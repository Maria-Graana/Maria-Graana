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
import Ability from '../../hoc/Ability'
import StaticData from '../../StaticData'
import AddLeadCategoryModal from '../AddLeadCategoryModal'
import MultiplePhoneOptionModal from '../MultiplePhoneOptionModal'
import styles from './style'

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
      Ability.canView(user.subRole, 'AssignLead') &&
      lead.status !== StaticData.Constants.lead_closed_lost &&
      lead.status !== StaticData.Constants.lead_closed_won
    ) {
      // Lead can only be assigned to someone else if it is assigned to no one or to current user
      if (lead.assigned_to_armsuser_id === null || user.id === lead.assigned_to_armsuser_id) {
        this.setState({ showAssignToButton: true }, () => {
          this.navigateToAssignLead(lead)
        })
      } else {
        // Lead is already assigned to some other user (any other user)
        this.setState({ showAssignToButton: false }, () => {
          this.navigateToAssignLead(lead)
        })
      }
    }
  }

  navigateToAssignLead = (lead) => {
    const { navigation } = this.props
    const { showAssignToButton } = this.state
    if (showAssignToButton === true) {
      navigation.navigate('AssignLead', {
        leadId: lead.id,
        type: 'sale',
        screen: 'LeadDetail',
        purpose: 'reassign',
      })
    } else {
      helper.errorToast('Lead Already Assign')
    }
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
      goToAttachments,
      lead,
      goToDiaryForm,
      goToAttachments,
    } = this.props
    const {
      visible,
      isMultiPhoneModalVisible,
      selectedClientContacts,
      calledOn,
      isLeadCategoryModalVisible,
    } = this.state
    const { screenName } = this.props

    return (
      <View style={styles.bottomNavMain}>
        <TouchableOpacity style={styles.bottomNavBtn} onPress={() => navigateTo()}>
          <View style={{ alignItems: 'center' }}>
            <Image
              style={styles.bottomNavImg}
              source={require('../../../assets/img/black/details.png')}
            />
            <Text style={styles.bottomNavBtnText}>Details</Text>
          </View>
        </TouchableOpacity>
        {screenName === 'MyDeals' ? (
          <TouchableOpacity
            // disabled={closedLeadEdit ? false : true}
            style={styles.followBtn}
            onPress={() => goToFollowUp()}
          >
            <View style={styles.align}>
              <Image
                style={styles.bottomNavImg}
                source={require('../../../assets/img/diaryBottom.png')}
              />
              <Text style={styles.followText}>Diary</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            // disabled={closedLeadEdit ? false : true}
            style={styles.followBtn}
            onPress={() => goToFollowUp()}
          >
            <View style={styles.align}>
              <Image
                style={styles.bottomNavImg}
                source={require('../../../assets/img/black/tasks.png')}
              />
              <Text style={styles.followText}>Tasks</Text>
            </View>
          </TouchableOpacity>
        )}
        {screenName === 'MyDeals' ? (
          <TouchableOpacity
            disabled={closedLeadEdit ? false : true}
            style={styles.followBtn}
            onPress={() => goToAttachments()}
          >
            <View style={styles.align}>
              <Image
                style={styles.bottomNavImg}
                source={require('../../../assets/img/attachBottom.png')}
              />
              <Text style={styles.followText}>Files</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={closedLeadEdit ? false : true}
            style={styles.followBtn}
            onPress={() => goToHistory()}
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
        {screenName === 'MyDeals' ? (
          <TouchableOpacity
            disabled={closedLeadEdit ? false : true}
            style={styles.rejectBtn}
            onPress={() => goToHistory()}
          >
            <View style={styles.align}>
              <Image
                style={styles.bottomNavImg}
                source={require('../../../assets/img/logBottom.png')}
              />
              <Text style={styles.followText}>Logs</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={closedLeadEdit ? false : true}
            style={styles.rejectBtn}
            onPress={() => console.log('navigate to SCA document')}
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
        {screenName === 'MyDeals' ? (
          <View style={[styles.bottomNavBtn2, visible === true]}>
            <Menu
              visible={visible}
              onDismiss={() => this.openMenu(false)}
              anchor={
                <TouchableOpacity onPress={() => this.openMenu(true)} style={styles.align}>
                  {visible === true ? (
                    <Image
                      style={styles.bottomNavImg}
                      source={require('../../../assets/img/Blue/menu.png')}
                    />
                  ) : (
                    <Image
                      style={styles.bottomNavImg}
                      source={require('../../../assets/img/black/menu.png')}
                    />
                  )}
                  <Text style={[styles.bottomNavBtnText, visible === true && { color: '#348ceb' }]}>
                    Menu
                  </Text>
                </TouchableOpacity>
              }
            >
              {/* {lead.projectId ? (
                <Menu.Item
                  onPress={() => {
                    if (closedLeadEdit) {
                      goToHistory()
                      this.openMenu(false)
                    } else helper.leadClosedToast()
                  }}
                  title="Activity History"
                />
              ) : null} */}

              {/* {isFromViewingScreen ? (
                <Menu.Item
                  onPress={() => {
                    if (closedLeadEdit) {
                      goToPropertyScreen()
                      this.openMenu(false)
                    } else helper.leadClosedToast()
                  }}
                  // icon={require('../../../assets/img/properties-icon-l.png')}
                  title="Add Property"
                />
              ) : null} */}
              <View>
                <Menu.Item
                  onPress={() => {
                    if (closedLeadEdit) {
                      this.navigateToAssignLead(lead)
                      this.openMenu(false)
                    } else helper.leadClosedToast()
                  }}
                  // icon={require('../../../assets/img/callIcon.png')}
                  title="Re-assign"
                />
                <Menu.Item
                  onPress={() => {
                    if (closedLeadEdit) {
                      this.navigateToShareScreen(lead)
                      this.openMenu(false)
                    } else helper.leadClosedToast()
                  }}
                  // icon={require('../../../assets/img/callIcon.png')}
                  title="Refer"
                />
                <Menu.Item
                  onPress={() => {
                    if (closedLeadEdit) {
                      this.onCategorySelected(lead)
                      this.openMenu(false)
                    } else helper.leadClosedToast()
                  }}
                  // icon={require('../../../assets/img/callIcon.png')}
                  title="Set Classification"
                />
              </View>
              {/* {!callButton && !lead.projectId ? <Menu.Item title="No Option" /> : null} */}
            </Menu>
          </View>
        ) : (
          <View style={[styles.bottomNavBtn2, visible === true]}>
            <Menu
              visible={visible}
              onDismiss={() => this.openMenu(false)}
              anchor={
                <TouchableOpacity onPress={() => this.openMenu(true)} style={styles.align}>
                  {visible === true ? (
                    <Image
                      style={styles.bottomNavImg}
                      source={require('../../../assets/img/Blue/menu.png')}
                    />
                  ) : (
                    <Image
                      style={styles.bottomNavImg}
                      source={require('../../../assets/img/black/menu.png')}
                    />
                  )}
                  <Text style={[styles.bottomNavBtnText, visible === true && { color: '#348ceb' }]}>
                    Menu
                  </Text>
                </TouchableOpacity>
              }
            >
              {lead.projectId ? (
                <Menu.Item
                  onPress={() => {
                    if (closedLeadEdit) {
                      goToHistory()
                      this.openMenu(false)
                    } else helper.leadClosedToast()
                  }}
                  title="Activity History"
                />
              ) : null}

              {isFromViewingScreen ? (
                <Menu.Item
                  onPress={() => {
                    if (closedLeadEdit) {
                      goToPropertyScreen()
                      this.openMenu(false)
                    } else helper.leadClosedToast()
                  }}
                  icon={require('../../../assets/img/properties-icon-l.png')}
                  title="Add Property"
                />
              ) : null}
              {callButton ? (
                <View>
                  <Menu.Item
                    onPress={() => {
                      if (closedLeadEdit) {
                        this.navigateToAssignLead(lead)
                        this.openMenu(false)
                      } else helper.leadClosedToast()
                    }}
                    // icon={require('../../../assets/img/callIcon.png')}
                    title="Re-assign"
                  />
                  <Menu.Item
                    onPress={() => {
                      if (closedLeadEdit) {
                        this.navigateToShareScreen(lead)
                        this.openMenu(false)
                      } else helper.leadClosedToast()
                    }}
                    // icon={require('../../../assets/img/callIcon.png')}
                    title="Refer"
                  />
                  <Menu.Item
                    onPress={() => {
                      if (closedLeadEdit) {
                        goToAttachments()
                        this.openMenu(false)
                      } else helper.leadClosedToast()
                    }}
                    // icon={require('../../../assets/img/callIcon.png')}
                    title="Attachments"
                  />
                </View>
              ) : null}
              {!callButton && !lead.projectId ? <Menu.Item title="No Option" /> : null}
            </Menu>
          </View>
        )}

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
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    contacts: store.contacts.contacts,
    lead: store.lead.lead,
  }
}

export default connect(mapStateToProps)(CMBottomNav)
