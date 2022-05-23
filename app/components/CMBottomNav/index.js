/** @format */

import axios from 'axios'
import { ActionSheet } from 'native-base'
import React from 'react'
import { Image, Linking, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { Divider, Menu } from 'react-native-paper'
import { MenuOption } from 'react-native-popup-menu'
import { connect } from 'react-redux'
import { setCallPayload } from '../../actions/callMeetingFeedback'
import helper from '../../helper'
import StaticData from '../../StaticData'
import AddLeadCategoryModal from '../AddLeadCategoryModal'
import MultiplePhoneOptionModal from '../MultiplePhoneOptionModal'
import ClosedWonModel from '../ClosedWonModel'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import styles from './style'
import { getDiaryFeedbacks, setConnectFeedback } from '../../actions/diary'
import diaryHelper from '../../screens/Diary/diaryHelper'

var BUTTONS = [
  'Assign to team member',
  'Share lead with other agent',
  'Create new Buy lead for this client',
  'Cancel',
]
var CANCEL_INDEX = 3

const triggerStyles = {
  triggerText: {
    fontSize: 16,
    alignSelf: 'center',
  },
  triggerWrapper: {
    padding: 5,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    borderRadius: 5,
  },
  triggerTouchable: {
    underlayColor: '#fff',
    activeOpacity: 70,
  },
  TriggerTouchableComponent: TouchableHighlight,
}

const optionsStyles = {
  optionsContainer: {
    backgroundColor: '#fff',
    padding: 5,
  },
  optionsWrapper: {
    backgroundColor: '#fff',
  },
  optionWrapper: {
    backgroundColor: '#fff',
    margin: 5,
  },
  optionTouchable: {
    // activeOpacity: 70,
  },
  optionText: {},
}
class CMBottomNav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      actionVisible: false,
      isMultiPhoneModalVisible: false,
      selectedClientContacts: [],
      calledOn: 'phone',
      isLeadCategoryModalVisible: false,
      isClosedWonModelVisible: false,
    }
  }

  openMenu = (status) => {
    this.setState({
      visible: status,
    })
  }

  openActionMenu = (status) => {
    this.setState({
      actionVisible: status,
    })
  }

  call = () => {
    const { contacts, customer, showStatusFeedbackModal, lead, dispatch } = this.props
    if (customer) {
      let selectedClientContacts = helper.createContactPayload(customer)
      this.setState({ selectedClientContacts, calledOn: 'phone' }, () => {
        if (selectedClientContacts.payload && selectedClientContacts.payload.length > 1) {
          //  multiple numbers to select
          this.showMultiPhoneModal(true)
        } else {
          dispatch(
            setCallPayload(
              selectedClientContacts ? selectedClientContacts.phone : null,
              this.state.calledOn,
              lead
            )
          )
          helper.callNumber(selectedClientContacts, contacts)
          showStatusFeedbackModal(true, 'call')
        }
      })
    }
  }

  showMultiPhoneModal = (value) => {
    this.setState({ isMultiPhoneModalVisible: value })
  }

  handlePhoneSelectDone = (phone) => {
    const { contacts, showStatusFeedbackModal, navigateToAssignLead, dispatch, lead } = this.props
    const { calledOn } = this.state
    const copySelectedClientContacts = { ...this.state.selectedClientContacts }
    if (calledOn === 'whatsapp') {
      // for whatsapp call
      if (phone && phone.number) {
        this.makeWhatsappCall(phone.number)
        this.showMultiPhoneModal(false)
      }
    } else {
      // for phone call
      if (phone) {
        copySelectedClientContacts.phone = phone.number
        copySelectedClientContacts.url = 'tel:' + phone.number
        this.setState(
          { selectedClientContacts: copySelectedClientContacts, isMultiPhoneModalVisible: false },
          () => {
            dispatch(
              setCallPayload(
                copySelectedClientContacts ? copySelectedClientContacts.phone : null,
                calledOn,
                lead
              )
            )
            helper.callNumber(copySelectedClientContacts, contacts)
            showStatusFeedbackModal(true, 'call')
          }
        )
      }
    }
  }

  performListActions = (title) => {
    const { goToComments, goToDiaryForm, goToAttachments, lead, onHandleCloseLead, addMeeting } =
      this.props
    if (title === 'Add Comment') goToComments()
    if (title === 'Add Meeting') addMeeting()
    if (title === 'Add Diary Task') goToDiaryForm()
    if (title === 'Whatsapp') this.openWhatsapp()
    if (title === 'Add Attachment') goToAttachments()
    if (title === 'Call') this.call()
    if (title === 'ReAssign') this.checkAssignedLead(lead)
    if (title === 'Share') this.navigateToShareScreen(lead)
    if (title === 'Closed Won') onHandleCloseLead(lead)
  }

  handleLongPress = (val) => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: 'Select an Option',
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          //Share
          this.navigateToShareScreen(val)
        } else if (buttonIndex === 2) {
          this.goToFormPage('AddCMLead', 'CM', val && val.customer ? val.customer : null)
        } else if (buttonIndex === 0) {
          this.checkAssignedLead(val)
        }
      }
    )
  }

  navigateToShareScreen = (data) => {
    const { user } = this.props
    if (data) {
      if (
        data.status === StaticData.Constants.lead_closed_lost ||
        data.status === StaticData.Constants.lead_closed_won
      ) {
        helper.errorToast('Closed leads cannot be shared with other agents')
        return
      }
      if (user.id === data.assigned_to_armsuser_id) {
        if (data.shared_with_armsuser_id) {
          helper.errorToast('lead is already shared')
        } else {
          const { navigation } = this.props
          navigation.navigate('AssignLead', {
            leadId: data.id,
            type: data.projectId ? 'Investment' : 'Buy',
            // screenName: data.projectId ? 'InvestmentLead' : 'BuyLead',
            purpose: 'refer',
            screenName: 'LeadDetail',
          })
        }
      } else {
        helper.errorToast('Only the leads assigned to you can be shared')
      }
    } else {
      helper.errorToast('Something went wrong!')
    }
  }

  checkAssignedLead = (lead) => {
    const { user } = this.props
    // Show assign lead button only if loggedIn user is Sales level2 or CC/BC/RE Manager
    if (
      lead.status !== StaticData.Constants.lead_closed_lost &&
      lead.status !== StaticData.Constants.lead_closed_won
    ) {
      // Lead can only be assigned to someone else if it is assigned to no one or to current user
      if (lead.assigned_to_armsuser_id === null || user.id === lead.assigned_to_armsuser_id) {
        this.navigateToAssignLead(lead)
      }
    } else {
      helper.errorToast('Sorry you are not authorized to assign lead')
    }
  }

  navigateToAssignLead = (lead) => {
    const { navigation, screenName } = this.props
   

    navigation.navigate('AssignLead', {
      leadId: lead.id,
      type: screenName == 'InvestDetailScreen' || screenName=='ProjectDeals' ? 'Investment' : 'sale',
      screen: 'LeadDetail',
      purpose: 'reassign',
    })
  }

  goToFormPage = (page, status, client, clientId) => {
    const { navigation } = this.props
    const copyClient = client ? { ...client } : null
    if (copyClient) {
      copyClient.id = clientId
    }
    navigation.navigate(page, {
      pageName: status,
      client: copyClient,
      name: copyClient && copyClient.customerName,
      purpose: 'sale',
    })
  }

  makeWhatsappCall = (phone) => {
    const { showStatusFeedbackModal, lead, dispatch } = this.props
    let url = 'whatsapp://send?phone=' + phone
    Linking.openURL(url)
      .then((data) => {
        console.log('WhatsApp Opened successfully ' + data)
        dispatch(setCallPayload(phone, 'whatsapp', lead))
        showStatusFeedbackModal(true, 'call')
      })
      .catch((error) => {
        console.log('ERROR: Opening Whatsapp ' + error)
        helper.errorToast('No APP Found OR Error Opening APP')
      })
  }

  openWhatsapp = () => {
    const { customer } = this.props
    if (customer) {
      let selectedClientContacts = helper.createContactPayload(customer)
      this.setState({ selectedClientContacts, calledOn: 'whatsapp' }, () => {
        if (selectedClientContacts.payload && selectedClientContacts.payload.length > 1) {
          //  multiple numbers to select
          this.showMultiPhoneModal(true)
        } else {
          this.makeWhatsappCall(selectedClientContacts.phone)
        }
      })
    } else {
      helper.errorToast('No Phone Number')
    }
  }

  listActionMenuItems = () => {
    const { closedWon = false, closedLeadEdit, lead } = this.props
    let actionData =
      lead && lead.projectId ? StaticData.actionListItemsCM : StaticData.actionListItems
    if (closedWon)
      actionData =
        lead && lead.projectId
          ? StaticData.actionClosedWonListItemsCM
          : StaticData.actionClosedWonListItems
    return actionData.map((item, index) => {
      return (
        <MenuOption
          onSelect={() => {
            if (closedLeadEdit) this.performListActions(item.title)
            else helper.leadClosedToast()
          }}
        >
          <View style={styles.menuStyle}>
            <Image style={styles.bottomNavImg} source={item.image} />
            <Text style={styles.menuText}>{item.title}</Text>
          </View>
          {actionData.length - 1 !== index && <Divider />}
        </MenuOption>
      )
    })
  }
  closeWonModel = (value) => {
    this.setState({
      isClosedWonModelVisible: value,
    })
  }

  onCategorySelected = (value) => {
    const { lead, fetchLead } = this.props
    let body = {
      leadCategory: value,
    }
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads/project`, body, { params: { id: leadId } })
      .then((res) => {
        this.setState({ isLeadCategoryModalVisible: false }, () => {
          helper.successToast(`Lead Category added`)
          fetchLead && fetchLead()
        })
      })
      .catch((error) => {
        console.log('/api/leads/project - Error', error)
        helper.errorToast('Closed lead API failed!!')
      })
  }

  canMarkCloseAsLost = (lead, type) => {
    if (type === 'Project') {
      if (lead && lead.payment && lead.payment.length > 0) {
        return false
      } else {
        return true
      }
    } else {
      if (lead && lead.commissions && lead.commissions.length > 0) {
        return false
      } else {
        return true
      }
    }
  }

  render() {
    const {
      navigateTo,
      callButton,
      goToHistory,
      goToPropertyScreen,
      isFromViewingScreen,
      goToFollowUp,
      goToRejectForm,
      closedLeadEdit,
      lead,
      goToDiaryForm,
      goToAttachments,
      permissions,
      screenName,
      user,
      onHandleCloseLead,
      closedWon,
      leadType,
      closedWonOptionVisible,
      checkCloseWon,
      leadData,
      closeWonOptionVisibleFromInvest,
      navigateToBookUnit,
      navigateFromMenu,
      addGuideReference = null,
      guideReference,
      navigateToOpenWorkFlow,
      goToFeedBack,
      goToAddEditDiaryScreen,
      selectedDiary,
      dispatch,
      navigateToAddDiary,
      requiredProperties,
    } = this.props
    const {
      visible,
      isMultiPhoneModalVisible,
      selectedClientContacts,
      calledOn,
      isLeadCategoryModalVisible,
      isClosedWonModelVisible,
    } = this.state
    let readPermission = getPermissionValue(
      lead.projectId && lead.project
        ? PermissionFeatures.PROJECT_LEADS
        : PermissionFeatures.BUY_RENT_LEADS,
      PermissionActions.READ,
      permissions
    )
    let referPermission = getPermissionValue(
      lead.projectId && lead.project
        ? PermissionFeatures.PROJECT_LEADS
        : PermissionFeatures.BUY_RENT_LEADS,
      PermissionActions.REFER,
      permissions
    )
    let assignPermission = getPermissionValue(
      lead.projectId && lead.project
        ? PermissionFeatures.PROJECT_LEADS
        : PermissionFeatures.BUY_RENT_LEADS,
      PermissionActions.ASSIGN_REASSIGN,
      permissions
    )
    let updatePermission = getPermissionValue(
      lead.projectId && lead.project
        ? PermissionFeatures.PROJECT_LEADS
        : PermissionFeatures.BUY_RENT_LEADS,
      PermissionActions.UPDATE,
      permissions
    )
    let updateProperty = getPermissionValue(
      PermissionFeatures.PROPERTIES,
      PermissionActions.UPDATE,
      permissions
    )

    return (
      <View style={styles.bottomNavMain}>
        {screenName === 'InvestDetailScreen' ? (
          <TouchableOpacity
            style={styles.followBtn}
            //style={styles.bottomNavBtn}
            onPress={() => navigateToBookUnit()}
          >
            <View style={styles.align}>
              <Image
                style={styles.bottomNavImg}
                source={require('../../../assets/img/BookUnit.png')}
              />
              <Text style={styles.followText}>Book Unit</Text>
            </View>
          </TouchableOpacity>
        ) : screenName === 'BuyRentDetailScreen' ? (
          <TouchableOpacity
            style={[styles.followBtn, { width: '33.4%' }]}
            onPress={() => navigateToOpenWorkFlow(lead)}
          >
            <View style={styles.align}>
              <Image
                style={[styles.bottomNavImg]}
                source={require('../../../assets/img/black/workflow.png')}
              />
              <Text style={styles.followText}>WorkFlow</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.followBtn} onPress={() => navigateTo()}>
            <View style={{ alignItems: 'center' }}>
              <Image
                style={styles.bottomNavImg}
                source={require('../../../assets/img/black/details.png')}
              />
              <Text style={styles.followText}>Details</Text>
            </View>
          </TouchableOpacity>
        )}
        {screenName === 'InvestDetailScreen' ? (
          <TouchableOpacity
            style={styles.followBtn}
            onPress={() => {
              goToAddEditDiaryScreen()
            }}
          >
            <View style={styles.align}>
              <Image
                style={styles.bottomNavImg}
                source={require('../../../assets/img/meeting.png')}
              />
              <Text style={styles.followText}>+ Meeting</Text>
            </View>
          </TouchableOpacity>
        ) : screenName === 'BuyRentDetailScreen' ? null : (
          <TouchableOpacity
            style={styles.followBtn}
            onPress={() => {
              if (closedLeadEdit && readPermission) goToFollowUp()
            }}
          >
            <View style={styles.align}>
              <Image
                style={styles.bottomNavImg}
                source={require('../../../assets/img/tasks.png')}
              />
              <Text style={styles.followText}>Tasks</Text>
            </View>
          </TouchableOpacity>
        )}
        {screenName === 'InvestDetailScreen' ? (
          <TouchableOpacity
            disabled={closedLeadEdit ? false : true}
            style={styles.followBtn}
            onPress={() => {
              goToFeedBack()
            }}
          >
            <View style={styles.align}>
              <Image
                style={styles.bottomNavImg}
                source={require('../../../assets/img/Feedback.png')}
              />
              <Text style={styles.followText}>Feedback</Text>
            </View>
          </TouchableOpacity>
        ) : screenName === 'BuyRentDetailScreen' ? null : (
          <TouchableOpacity
            disabled={closedLeadEdit ? false : true}
            style={styles.followBtn}
            onPress={() => {
              if (closedLeadEdit && readPermission) goToHistory()
            }}
          >
            <View style={styles.align}>
              <Image
                style={styles.bottomNavImg}
                source={require('../../../assets/img/black/activity.png')}
              />
              <Text style={styles.followText}>Activity</Text>
            </View>
          </TouchableOpacity>
        )}

        {screenName === 'MyDeals' || leadType === 'CM' ? (
          <TouchableOpacity
            disabled={helper.getAiraPermission(permissions) ? true : closedLeadEdit ? false : true}
            style={styles.followBtn}
            onPress={() => {
              if (closedLeadEdit && readPermission) {
                goToAttachments('view')
              }
            }}
          >
            <View style={styles.align}>
              <Image
                style={styles.bottomNavImg}
                source={require('../../../assets/img/attachBottom.png')}
              />
              <Text style={styles.followText}>Files</Text>
            </View>
          </TouchableOpacity>
        ) : screenName === 'BuyRentDetailScreen' ? (
          <TouchableOpacity
            style={
              screenName === 'BuyRentDetailScreen'
                ? [styles.followBtn, { width: '33.3%' }]
                : styles.followBtn
            }
            onPress={() => {
              navigateFromMenu()
            }}
          >
            <View style={styles.align}>
              <Image
                style={styles.bottomNavImg}
                source={require('../../../assets/img/tasks.png')}
              />
              <Text style={styles.followText}>Tasks</Text>
            </View>
          </TouchableOpacity>
        ) : screenName === 'InvestDetailScreen' ? (
          <TouchableOpacity
            style={
              screenName === 'BuyRentDetailScreen'
                ? [styles.rejectBtn, styles.followBtn, { width: '33.3%' }]
                : [styles.followBtn]
            }
            onPress={() => {
              navigateToAddDiary()
            }}
          >
            <View style={styles.align}>
              <Image
                style={styles.bottomNavImg}
                source={require('../../../assets/img/tasks.png')}
              />
              <Text style={styles.followText}>Tasks</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={helper.getAiraPermission(permissions) ? true : closedLeadEdit ? false : true}
            style={styles.rejectBtn}
            onPress={() => {
              if (closedLeadEdit && updatePermission) {
                goToAttachments('addSCA')
                this.openMenu(false)
              } else helper.leadClosedToast()
            }}
          >
            <View style={styles.align}>
              <Image
                style={styles.bottomNavImg}
                source={require('../../../assets/img/black/SCA.png')}
              />
              <Text style={styles.followText}>SCA</Text>
            </View>
          </TouchableOpacity>
        )}
        <View style={[styles.bottomNavBtn2, visible === true]}>
          <Menu
            visible={visible}
            onDismiss={() => this.openMenu(false)}
            anchor={
              <TouchableOpacity
                onPress={() => !helper.getAiraPermission(permissions) && this.openMenu(true)}
              >
                <View
                  style={[
                    styles.align,
                    {
                      marginBottom: 12,
                    },
                  ]}
                >
                  {visible === true ? (
                    <Image
                      style={[
                        styles.bottomNavImg,
                        screenName === 'BuyRentDetailScreen' && { left: 25 },
                      ]}
                      source={require('../../../assets/img/Blue/menu.png')}
                    />
                  ) : (
                    <Image
                      style={[
                        [styles.bottomNavImg],
                        screenName === 'BuyRentDetailScreen' && { left: 25 },
                      ]}
                      source={require('../../../assets/img/actions.png')}
                    />
                  )}
                  <Text
                    style={[
                      styles.followText,
                      visible === true && { color: '#348ceb' },
                      screenName === 'BuyRentDetailScreen' && { left: 25 },
                    ]}
                  >
                    Menu
                  </Text>
                </View>
              </TouchableOpacity>
            }
          >
            <View>
              {isFromViewingScreen ? (
                <Menu.Item
                  onPress={() => {
                    if (closedLeadEdit && updateProperty) {
                      goToPropertyScreen()
                      this.openMenu(false)
                    } else helper.leadClosedToast()
                  }}
                  // icon={require('../../../assets/img/properties-icon-l.png')}
                  title="Add Property"
                />
              ) : null}
              {!requiredProperties && (
                <Menu.Item
                  onPress={() => {
                    if (closedLeadEdit && assignPermission) {
                      this.checkAssignedLead(lead)
                      this.openMenu(false)
                    } else helper.leadClosedToast()
                  }}
                  // icon={require('../../../assets/img/callIcon.png')}
                  title="Re-Assign"
                />
              )}
              {!requiredProperties && (
                <Menu.Item
                  onPress={() => {
                    if (closedLeadEdit && referPermission) {
                      this.navigateToShareScreen(lead)
                      this.openMenu(false)
                    } else helper.leadClosedToast()
                  }}
                  // icon={require('../../../assets/img/callIcon.png')}
                  title="Refer Lead"
                />
              )}

              {screenName === 'InvestDetailScreen' && !guideReference && (
                <Menu.Item
                  onPress={() => {
                    addGuideReference()
                    this.openMenu(false)
                  }}
                  // icon={require('../../../assets/img/callIcon.png')}
                  title="Reference Guide #"
                />
              )}
              {(screenName === 'InvestDetailScreen' || screenName === 'BuyRentDetailScreen') && (
                <Menu.Item
                  onPress={() => {
                    this.canMarkCloseAsLost(lead, lead.armsProjectTypeId ? 'Project' : 'BuyRent')
                      ? dispatch(
                        getDiaryFeedbacks({
                          taskType: 'Connect',
                          leadType: 'Project',
                          actionType: 'Connect',
                          section: 'Reject',
                        })
                      )
                        .then((res) => {
                          this.props.navigation.navigate('DiaryFeedback', {
                            actionType: 'Connect',
                          })
                        })
                        .catch((err) => console.error('An error occurred', err))
                      : helper.errorToast(
                        `This lead cannot be Closed as Lost as it has some payments. Delete all payments before closing this lead.`
                      )
                    this.openMenu(false)
                  }}
                  // icon={require('../../../assets/img/callIcon.png')}
                  title="Close as Lost"
                />
              )}
              {closedWonOptionVisible &&
                leadData.status !== 'closed_won' &&
                leadData.status !== 'closed_lost' && (
                  <Menu.Item
                    onPress={() => {
                      let hasError = checkCloseWon
                      if (hasError.paymentEr != '' || hasError.documentEr != '') {
                        this.closeWonModel(true)
                      } else {
                        onHandleCloseLead(lead)
                      }
                      this.openMenu(false)
                    }}
                    title="Closed Won"
                  />
                )}
              {closeWonOptionVisibleFromInvest &&
                closedWon &&
                lead.status !== 'closed_won' &&
                lead.status !== 'closed_lost' && (
                  <Menu.Item
                    onPress={() => {
                      onHandleCloseLead(lead)
                      this.openMenu(false)
                    }}
                    title="Closed Won"
                  />
                )}

              {
                screenName === 'MyDeals' ? (
                  <Menu.Item
                    onPress={() => {
                      if (closedLeadEdit) {
                        this.setState({ isLeadCategoryModalVisible: true })
                        // this.onCategorySelected(lead)
                        this.openMenu(false)
                      } else helper.leadClosedToast()
                    }}
                    // icon={require('../../../assets/img/callIcon.png')}
                    title="Set Classification"
                  />
                ) : null
                // (
                //   <Menu.Item
                //     onPress={() => {
                //       if (closedLeadEdit && readPermission) {
                //         goToAttachments('view')
                //         this.openMenu(false)
                //       } else helper.leadClosedToast()
                //     }}
                //     // icon={require('../../../assets/img/callIcon.png')}
                //     title="View Attachments"
                //   />
                // )
              }
            </View>
          </Menu>
        </View>
        <MultiplePhoneOptionModal
          isMultiPhoneModalVisible={isMultiPhoneModalVisible}
          contacts={selectedClientContacts.payload}
          showMultiPhoneModal={this.showMultiPhoneModal}
          handlePhoneSelectDone={this.handlePhoneSelectDone}
          mode={calledOn}
        />
        <AddLeadCategoryModal
          visible={isLeadCategoryModalVisible}
          toggleCategoryModal={(value) => this.setState({ isLeadCategoryModalVisible: value })}
          onCategorySelected={(value) => this.onCategorySelected(value)}
          selectedCategory={lead && lead.leadCategory ? lead.leadCategory : null}
        />
        {isClosedWonModelVisible && (
          <ClosedWonModel
            visible={isClosedWonModelVisible}
            navigation={this.props.navigation}
            closeWonModel={() => this.closeWonModel(false)}
            checkCloseWon={checkCloseWon}
            leadData={leadData}
          />
        )}
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    contacts: store.contacts.contacts,
    lead: store.lead.lead,
    permissions: store.user.permissions,
    selectedDiary: store.diary.selectedDiary,
  }
}

export default connect(mapStateToProps)(CMBottomNav)
