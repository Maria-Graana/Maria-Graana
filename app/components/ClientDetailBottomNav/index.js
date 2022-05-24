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
    const { navigation } = this.props
    navigation.navigate('AssignLead', {
      leadId: lead.id,
      type: 'sale',
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

  navigateFunction = (screenName) => {
    const { navigation, client } = this.props

    if (screenName === 'Properties') {
      navigation.navigate('InventoryTabs', {
        screen: 'ARMS',
        client: client,
        params: {
          screen: 'InventoryTabs',
          client: client,
          clientDetails: true,
        },
      })
    } else if (screenName === 'Leads') {
      navigation.navigate('Leads', {
        screen: screenName,
        hasBooking: false,
        client: client,
        clientDetails: true,
      })
    } else if (screenName === 'ProjectLeads') {
      navigation.navigate('ProjectLeads', {
        screen: screenName,
        hasBooking: false,
        client: client,
        clientDetails: true,
      })
    } else {
      navigation.navigate('Client')
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
        <TouchableOpacity
          style={[styles.followBtn]}
          onPress={() => this.showMultiPhoneModal(!this.state.isMultiPhoneModalVisible)}
        >
          <View style={styles.align}>
            <Image
              style={[styles.bottomNavImg]}
              source={require('../../../assets/img/clientBottomTab/Call.png')}
            />
            <Text style={styles.followText}>Call</Text>
          </View>
        </TouchableOpacity>
        {getPermissionValue(
          PermissionFeatures.APP_PAGES,
          PermissionActions.PROJECT_LEADS_PAGE_VIEW,
          permissions
        ) && (
          <TouchableOpacity
            style={styles.followBtn}
            onPress={() => {
              this.navigateFunction('ProjectLeads')
            }}
          >
            <View style={styles.align}>
              <Image
                style={styles.bottomNavImg}
                source={require('../../../assets/img/clientBottomTab/ProjectLeads.png')}
              />
              <Text style={styles.followText}>Project Leads</Text>
            </View>
          </TouchableOpacity>
        )}

        {(getPermissionValue(
          PermissionFeatures.APP_PAGES,
          PermissionActions.BUYRENT_LEADS_PAGE_VIEW,
          permissions
        ) ||
          getPermissionValue(
            PermissionFeatures.APP_PAGES,
            PermissionActions.WANTED_LEADS_PAGE_VIEW,
            permissions
          )) && (
          <TouchableOpacity
            style={styles.followBtn}
            onPress={() => {
              this.navigateFunction('Leads')
            }}
          >
            <View style={styles.align}>
              <Image
                style={styles.bottomNavImg}
                source={require('../../../assets/img/clientBottomTab/RentLeads.png')}
              />
              <Text style={styles.followText}>Buy/Rent Leads</Text>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.followBtn}
          onPress={() => {
            this.navigateFunction('Properties')
          }}
        >
          <View style={styles.align}>
            <Image
              style={styles.bottomNavImg}
              source={require('../../../assets/img/clientBottomTab/Properties.png')}
            />
            <Text style={styles.followText}>Properties</Text>
          </View>
        </TouchableOpacity>
        <MultiplePhoneOptionModal
          // modelDataLoading={phoneModelDataLoader}
          isMultiPhoneModalVisible={isMultiPhoneModalVisible}
          showMultiPhoneModal={(value) => this.showMultiPhoneModal(value)}
          navigation={this.props.navigation}
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
    permissions: store.user.permissions,
    selectedDiary: store.diary.selectedDiary,
  }
}

export default connect(mapStateToProps)(CMBottomNav)
