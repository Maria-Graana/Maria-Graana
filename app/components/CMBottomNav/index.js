/** @format */

import axios from 'axios'
import moment from 'moment'
import React from 'react'
import { ActionSheet } from 'native-base'
import { Image, Linking, Text, TouchableOpacity, View, TouchableHighlight } from 'react-native'
import { Menu as PopupMenu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'
import { Menu, Divider } from 'react-native-paper'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles'
import helper from '../../helper'
import StaticData from '../../StaticData'
import styles from './style'
import Ability from '../../hoc/Ability'
import MultiplePhoneOptionModal from '../MultiplePhoneOptionModal'

var BUTTONS = [
  'Assign to team member',
  'Share lead with other agent',
  'Create new Buy lead for this client',
  'Cancel',
]
var CANCEL_INDEX = 3

const triggerStyles = {
  triggerText: {
    color: '#fff',
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 16,
    alignSelf: 'center',
  },
  triggerWrapper: {
    padding: 5,
    backgroundColor: AppStyles.colors.primaryColor,
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
    borderRadius: 5,
    borderWidth: 1,
    borderColor: AppStyles.colors.primaryColor,
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
    const { contacts, customer, showStatusFeedbackModal } = this.props
    if (customer) {
      let selectedClientContacts = helper.createContactPayload(customer)
      this.setState({ selectedClientContacts }, () => {
        if (selectedClientContacts.payload && selectedClientContacts.payload.length > 1) {
          //  multiple numbers to select
          this.showMultiPhoneModal(true)
        } else {
          this.sendCallStatus()
          helper.callNumber(selectedClientContacts, contacts)
          showStatusFeedbackModal(true)
        }
      })
    }
  }

  showMultiPhoneModal = (value) => {
    this.setState({ isMultiPhoneModalVisible: value })
  }

  handlePhoneSelectDone = (phone) => {
    const { contacts, showStatusFeedbackModal } = this.props
    const copySelectedClientContacts = { ...this.state.selectedClientContacts }
    if (phone) {
      copySelectedClientContacts.phone = phone.number
      copySelectedClientContacts.url = 'tel:' + phone.number
      this.setState(
        { selectedClientContacts: copySelectedClientContacts, isMultiPhoneModalVisible: false },
        () => {
          showStatusFeedbackModal(true)
          this.sendCallStatus()
          helper.callNumber(copySelectedClientContacts, contacts)
        }
      )
    }
  }

  sendCallStatus = () => {
    const { leadType } = this.props
    const { selectedClientContacts } = this.state
    const start = moment().format()
    let body = {
      start: start,
      end: start,
      time: start,
      date: start,
      taskType: 'called',
      response: 'Called',
      subject: 'Call to client ' + this.props.lead.customer.customerName,
      cutomerId: this.props.lead.customer.id,
      armsLeadId: leadType === 'RCM' ? this.props.lead.id : null, // For RCM Call
      leadId: leadType === 'CM' ? this.props.lead.id : null, // For CM Call
      calledNumber: selectedClientContacts.phone ? selectedClientContacts.phone : null,
      taskCategory: 'leadTask',
    }
    axios.post(`api/leads/project/meeting`, body).then((res) => {
      this.props.setCurrentCall(res.data)
    })
  }

  performListActions = (title) => {
    const { goToComments, goToDiaryForm, goToAttachments, lead, onHandleCloseLead } = this.props
    if (title === 'Comment') goToComments()
    if (title === 'Diary Task') goToDiaryForm()
    if (title === 'Whatsapp') this.openWhatsapp()
    if (title === 'Attach') goToAttachments()
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
            screen: data.projectId ? 'InvestmentLead' : 'BuyLead',
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
      navigation.navigate('AssignLead', { leadId: lead.id, type: 'sale', screen: 'LeadDetail' })
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

  openWhatsapp = () => {
    const { customer } = this.props
    if (customer) {
      let newContact = helper.createContactPayload(customer)
      let url = 'whatsapp://send?phone=' + newContact.phone
      Linking.openURL(url)
        .then((data) => {
          console.log('WhatsApp Opened successfully ' + data)
        })
        .catch((error) => {
          console.log('ERROR: Opening Whatsapp ' + error)
          helper.errorToast('No APP Found OR Error Opening APP')
        })
    } else {
      helper.errorToast('No Phone Number')
    }
  }

  listActionMenuItems = () => {
    const { closedWon = false, closedLeadEdit } = this.props
    let actionData = StaticData.actionListItems
    if (closedWon) actionData = StaticData.actionClosedWonListItems
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
    } = this.props
    const { visible, isMultiPhoneModalVisible, selectedClientContacts } = this.state

    return (
      <View style={styles.bottomNavMain}>
        <TouchableOpacity style={styles.bottomNavBtn} onPress={() => navigateTo()}>
          <Image style={styles.bottomNavImg} source={require('../../../assets/img/details.png')} />
          <Text style={styles.bottomNavBtnText}>CIF</Text>
        </TouchableOpacity>
        <PopupMenu style={styles.popMenu}>
          <MenuTrigger text="Action" customStyles={triggerStyles} />
          <MenuOptions customStyles={optionsStyles}>{this.listActionMenuItems()}</MenuOptions>
        </PopupMenu>
        <TouchableOpacity
          disabled={closedLeadEdit ? false : true}
          style={styles.followBtn}
          onPress={() => goToFollowUp()}
        >
          <Text style={styles.followText}>Follow Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={closedLeadEdit ? false : true}
          style={styles.rejectBtn}
          onPress={() => goToRejectForm()}
        >
          <Text style={styles.actionText}>Reject</Text>
        </TouchableOpacity>
        <View style={[styles.bottomNavBtn2, visible === true && styles.forMenuIcon]}>
          <Menu
            visible={visible}
            onDismiss={() => this.openMenu(false)}
            anchor={
              <TouchableOpacity onPress={() => this.openMenu(true)} style={styles.align}>
                {visible === true ? (
                  <Image
                    style={styles.bottomNavImg}
                    source={require('../../../assets/img/menuIcon.png')}
                  />
                ) : (
                  <Image
                    style={styles.bottomNavImg}
                    source={require('../../../assets/img/menuIcon2.png')}
                  />
                )}
                <Text style={[styles.bottomNavBtnText, visible === true && styles.colorWhite]}>
                  Menu
                </Text>
              </TouchableOpacity>
            }
          >
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
              <Menu.Item
                onPress={() => {
                  if (closedLeadEdit) {
                    goToHistory()
                    this.openMenu(false)
                  } else helper.leadClosedToast()
                }}
                icon={require('../../../assets/img/callIcon.png')}
                title="Call History"
              />
            ) : null}
            {!callButton ? <Menu.Item title="No Option" /> : null}
          </Menu>
        </View>
        <MultiplePhoneOptionModal
          isMultiPhoneModalVisible={isMultiPhoneModalVisible}
          contacts={selectedClientContacts.payload}
          showMultiPhoneModal={this.showMultiPhoneModal}
          handlePhoneSelectDone={this.handlePhoneSelectDone}
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
