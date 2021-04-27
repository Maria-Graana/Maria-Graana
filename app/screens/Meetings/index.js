/** @format */
import axios from 'axios'
import moment from 'moment'
import React, { Component } from 'react'
import { FlatList, Linking, Platform, Text, TouchableOpacity, View } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { connect } from 'react-redux'
import { setContacts } from '../../actions/contacts'
import { setLeadRes } from '../../actions/lead'
import AppStyles from '../../AppStyles'
import CMBottomNav from '../../components/CMBottomNav'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import MeetingTile from '../../components/MeetingTile'
import StatusFeedbackModal from '../../components/StatusFeedbackModal'
import helper from '../../helper'
import PaymentMethods from '../../PaymentMethods'
import StaticData from '../../StaticData'
import styles from './style'
import CallFeedbackActionMeeting from '../../components/CallFeedbackActionMeeting';
import MeetingFollowupModal from '../../components/MeetingFollowupModal';
class Meetings extends Component {
  constructor(props) {
    super(props)
    const { lead, user } = this.props
    this.state = {
      active: false,
      meetings: [],
      checkValidation: false,
      modalStatus: 'dropdown',
      open: false,
      progressValue: 0,
      reasons: [],
      isVisible: false,
      selectedReason: '',
      checkReasonValidation: false,
      closedLeadEdit: helper.checkAssignedSharedStatus(user, lead),
      checkForUnassignedLeadEdit: helper.checkAssignedSharedStatus(user, lead),
      secondScreenData: {},
      checkForNewLeadData: false,
      statusfeedbackModalVisible: false,
      modalMode: 'call',
      currentCall: null,
      currentMeeting: null,
      isFeedbackMeetingModalVisible: false,
      isFollowUpMode: false,
      editMeeting: false,
      closedWon: false,
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    this.fetchLead()
    this.getMeetingLead()
    this.props.dispatch(setContacts())
    this._unsubscribe = navigation.addListener('focus', () => {
      this.fetchLead()
    })
  }

  fetchLead = (newLeadDataStatus) => {
    const { lead } = this.props
    const { cmProgressBar } = StaticData
    axios
      .get(`/api/leads/project/byId?id=${lead.id}`)
      .then((res) => {
        this.props.dispatch(setLeadRes(res.data))
        this.checkLeadClosureReasons(res.data)
        this.setState({
          progressValue: cmProgressBar[res.data.status] || 0,
          secondScreenData: res.data,
          checkForNewLeadData: newLeadDataStatus,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //  ************ Function for open modal ************
  openModalInMeetingMode = (edit = false, id = null) => {
    const {meetings} = this.state;
    this.setState({
      active: !this.state.active,
      editMeeting: edit,
      isFollowUpMode: false,
      currentMeeting: edit ? meetings.rows.find(item => item.id === id) : null,
    });
  }

  closeMeetingFollowupModal = () => {
    this.setState({
      active: !this.state.active,
      editMeeting: false,
      isFollowUpMode: false,
      currentMeeting : null,
    })
  }

  //  ************ Function for open Follow up modal ************
  openModalInFollowupMode = () => {
    this.setState({
      active: !this.state.active,
      editMeeting: false,
      isFollowUpMode: true,
      currentMeeting : null,
    })
  }

  

  getMeetingLead = () => {
    const { lead } = this.props
    axios.get(`/api/diary/all?leadId=${lead.id}`).then((res) => {
      if (res && res.data) {
        const { rows } = res.data
        let newRows = rows
        newRows = newRows.filter((item) =>
          item.taskType === 'called' ? item.response !== null : item
        )
        this.setState({ meetings: { count: res.data.count, rows: newRows } })
      }
    })
  }

  sendStatus = (status, id) => {
    const { formData, meetings } = this.state
    const {lead} = this.props;
    let body = {
      response: status,
      comments: status,
      leadId: lead.id,
    }
    if (status === 'cancel_meeting') {
      axios.delete(`/api/diary/delete?id=${id}&cmLeadId=${lead.id}`).then((res) => {
        this.getMeetingLead()
      })
    } else if (status === 'meeting_done') {
      this.setState({ statusfeedbackModalVisible: true, modalMode: 'meeting', currentCall: meetings && meetings.rows ? meetings.rows.find(item => item.id === id) : null })
    } else {
      axios.patch(`/api/diary/update?id=${id}`, body).then((res) => {
        this.getMeetingLead()
      })
    }
  }



  sendCallStatus = () => {
    const start = moment().format()
    let body = {
      start: start,
      end: start,
      time: start,
      date: start,
      taskType: 'called',
      subject: 'Call to client ' + this.props.lead.customer.customerName,
      customerId: this.props.lead.customer.id,
      leadId: this.props.lead.id, // For CM send leadID and armsLeadID for RCM
      taskCategory: 'leadTask',
    }
    axios.post(`api/leads/project/meeting`, body).then((res) => {
      this.setCurrentCall(res.data);
      this.getMeetingLead()
    })
  }

  callNumber = (url) => {
    if (url != 'tel:null') {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            console.log("Can't handle url: " + url)
          } else {
            this.call();
            return Linking.openURL(url)
          }
        })
        .catch((err) => console.error('An error occurred', err))
    } else {
      helper.errorToast(`No Phone Number`)
    }
  }

  call = () => {
    const { lead, contacts } = this.props
    let newContact = helper.createContactPayload(lead.customer)
    let result = helper.contacts(newContact.phone, contacts)
    if (
      newContact.name &&
      newContact.name !== '' &&
      newContact.name !== ' ' &&
      newContact.phone &&
      newContact.phone !== ''
    )
      if (!result) {
        this.sendCallStatus()
        helper.addContact(newContact)
        this.setState({ statusfeedbackModalVisible: true })
      }
  }

  editMeeting = (id) => {
    this.openModalInMeetingMode(true, id);
  }

  goToComments = () => {
    const { navigation, route } = this.props
    navigation.navigate('Comments', { cmLeadId: this.props.lead.id })
  }

  goToAttachments = () => {
    const { navigation, route, lead } = this.props
    navigation.navigate('LeadAttachments', { cmLeadId: lead.id, workflow: 'cm' })
  }

  goToDiaryForm = (taskType) => {
    const { navigation, route, user } = this.props
    navigation.navigate('AddDiary', {
      update: false,
      agentId: user.id,
      cmLeadId: this.props.lead.id,
      addedBy: 'self',
      tasksList: StaticData.taskValuesCMLead,
      taskType: taskType != '' ? taskType : null,
      screenName: 'Diary',
    })
  }

  navigateTo = () => {
    this.props.navigation.navigate('LeadDetail', {
      lead: this.props.lead,
      purposeTab: 'invest',
      isFromLeadWorkflow: true,
      fromScreen: 'meetings',
    })
  }

  handleReasonChange = (value) => {
    this.setState({ selectedReason: value })
  }

  closeModal = () => {
    this.setState({ isVisible: false })
  }

  onHandleCloseLead = (reason) => {
    const { lead, navigation } = this.props
    const { selectedReason } = this.state
    let body = {
      reasons: selectedReason,
    }
    if (selectedReason && selectedReason !== '') {
      var leadId = []
      leadId.push(lead.id)
      axios
        .patch(`/api/leads/project`, body, { params: { id: leadId } })
        .then((res) => {
          this.setState({ isVisible: false }, () => {
            helper.successToast(`Lead Closed`)
            navigation.navigate('Leads')
          })
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      alert('Please select a reason for lead closure!')
    }
  }

  closedLead = () => {
    const { lead, user } = this.props
    lead.status != StaticData.Constants.lead_closed_won ||
      (lead.status != StaticData.Constants.lead_closed_lost && helper.leadClosedToast())
    lead.assigned_to_armsuser_id != user.id && helper.leadNotAssignedToast()
  }

  checkLeadClosureReasons = (lead) => {
    const { payment, unit } = lead
    if (!unit) {
      return
    }
    let { remainingPayment, remainingTax } = PaymentMethods.findRemaningPaymentWithClearedStatus(
      payment,
      unit.finalPrice
    )
    let outStandingTax = PaymentMethods.findRemainingTaxWithClearedStatus(payment, remainingTax)
    if (outStandingTax <= 0 && remainingPayment <= 0) {
      this.setState({
        closedWon: true,
      })
    }
  }

  closeLead = () => {
    this.fetchLead(true)

    const { secondScreenData, checkForNewLeadData } = this.state
    if (secondScreenData && secondScreenData != '' && checkForNewLeadData === true) {
      // Check For Any pending and rejected Status
      var approvedPaymentDone = []
      secondScreenData &&
        secondScreenData.payment != null &&
        secondScreenData.payment.filter((item, index) => {
          return item.status === 'pendingAccount' ||
            item.status === 'pendingAccountHq' ||
            item.status === 'pendingSales' ||
            item.status === 'bankPending' ||
            item.status === 'notCleared'
            ? approvedPaymentDone.push(true)
            : approvedPaymentDone.push(false)
        })

      // If there is any true in the bottom array PAYMENT DONE option will be hide
      var checkForPenddingNrjected = []
      var checkForPenddingNClear = []
      approvedPaymentDone &&
        approvedPaymentDone.length > 0 &&
        approvedPaymentDone.filter((item) => {
          item === true && checkForPenddingNrjected.push(true)
        })
      approvedPaymentDone &&
        approvedPaymentDone.length > 0 &&
        approvedPaymentDone.filter((item) => {
          item === false && checkForPenddingNClear.push(false)
        })

      var remainingPayment = this.props.lead.remainingPayment
      if (
        remainingPayment <= 0 &&
        remainingPayment != null &&
        checkForPenddingNrjected.length === 0
      ) {
        this.setState({
          reasons: StaticData.paymentPopupDone,
          isVisible: true,
          checkReasonValidation: '',
          checkForNewLeadData: false,
        })
      } else {
        // Check For,If some payment is clear agent would not be able to close lead as close lost
        if (
          (Number(remainingPayment) >= 0 && secondScreenData.remainingPayment != null) ||
          checkForPenddingNClear.length != 0
        ) {
          if (checkForPenddingNClear.length === 0) {
            this.setState({
              reasons: StaticData.paymentPopup,
              isVisible: true,
              checkReasonValidation: '',
            })
          } else {
            this.setState({
              reasons: StaticData.paymentPopupAnyPaymentAdded,
              isVisible: true,
              checkReasonValidation: '',
            })
          }
        } else {
          this.setState({
            reasons: StaticData.paymentPopup,
            isVisible: true,
            checkReasonValidation: '',
          })
        }
      }
    }
  }


  showFeedbackMeetingModal = (value) => {
    this.setState({ isFeedbackMeetingModalVisible: value });
  }

  performMeetingAction = (type) => {
    const { navigation } = this.props;
    this.showFeedbackMeetingModal(false);
    if (type) {
      if (type === 'book unit')
        navigation.navigate('CMLeadTabs', { screen: 'Payments' });
      else if (type === 'setup another meeting')
        this.openModal();
    }
  }


  toggleMenu = (val, id) => {
    const { meetings } = this.state
    let newMeetingObj = Object.create({})
    if (meetings) {
      const { rows } = meetings
      newMeetingObj.count = meetings.count
      newMeetingObj.rows = rows.map((item) => {
        if (item.id === id) {
          item.showMenu = val
          return item
        } else return item
      })
    } else {
      newMeetingObj = meetings
    }
    this.setState({ meetings: newMeetingObj })
  }

  rejectLead = (body) => {
    const { navigation, lead } = this.props;
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads/project`, body, { params: { id: leadId } })
      .then((res) => {
        helper.successToast(`Lead Closed`)
        navigation.navigate('Leads')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  goToRejectForm = () => {
    this.setState({ modalMode: 'reject', statusfeedbackModalVisible: true })
  }

  setCurrentCall = (call) => {
    this.setState({ currentCall: call });
  }

  showStatusFeedbackModal = (value) => {
    this.setState({ statusfeedbackModalVisible: value })
  }


  render() {
    const {
      active,
      meetings,
      progressValue,
      editMeeting,
      reasons,
      selectedReason,
      checkReasonValidation,
      closedLeadEdit,
      isVisible,
      checkForUnassignedLeadEdit,
      statusfeedbackModalVisible,
      isFeedbackMeetingModalVisible,
      modalMode,
      currentCall,
      isFollowUpMode,
      currentMeeting
    } = this.state

    let platform = Platform.OS == 'ios' ? 'ios' : 'android'
    const { lead } = this.props;
    let leadClosedCheck =
      closedLeadEdit === false || checkForUnassignedLeadEdit === false ? false : true
    return (
      <View style={styles.mainWrapCon}>
        <ProgressBar
          style={{ backgroundColor: 'ffffff' }}
          progress={progressValue}
          color={'#0277FD'}
        />

        {/* ************Fab For Open Modal************ */}
        <FlatList
          style={[
            styles.meetingConteiner,
            leadClosedCheck === true ? styles.openLeadHeight : styles.closeLeadHeight,
          ]}
          data={meetings.rows}
          renderItem={({ item, index }) => (
            <MeetingTile
              data={item}
              key={index}
              sendStatus={this.sendStatus}
              editFunction={this.editMeeting}
              leadClosedCheck={leadClosedCheck}
              toggleMenu={(val, id) => this.toggleMenu(val, id)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        {leadClosedCheck == true && (
          <View style={[styles.callMeetingBtn]}>
            <View style={[styles.btnsMainWrap]}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  platform == 'ios' ? styles.boxShadowForIos : styles.boxShadowForandroid,
                ]}
                onPress={() => {this.openModalInMeetingMode()}}
              >
                <Text style={styles.alignCenter}>Add Meeting</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.btnsMainWrap]}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  platform == 'ios' ? styles.boxShadowForIos : styles.boxShadowForandroid,
                ]}
                onPress={() => {
                  this.callNumber(`tel:${lead.customer && lead.customer.phone}`)
                }}
              >
                <Text style={styles.alignCenter}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={AppStyles.mainCMBottomNav}>
          <CMBottomNav
            goToAttachments={this.goToAttachments}
            navigateTo={this.navigateTo}
            goToDiaryForm={this.goToDiaryForm}
            goToComments={this.goToComments}
            alreadyClosedLead={this.closedLead}
            closedLeadEdit={leadClosedCheck}
            closeLead={this.checkLeadClosureReasons}
            goToFollowUp={this.openModalInFollowupMode}
            goToRejectForm={this.goToRejectForm}
            showStatusFeedbackModal={(value) => this.showStatusFeedbackModal(value)}
            setCurrentCall={(call) => this.setCurrentCall(call)}
            customer={lead.customer}
            leadType={'CM'}
          />
        </View>

        <MeetingFollowupModal
          closeModal={() => this.closeMeetingFollowupModal()}
          active={active}
          isFollowUpMode={isFollowUpMode}
          lead={lead}
          leadType={'CM'}
          getMeetingLead={()=> this.getMeetingLead()}
          currentMeeting={currentMeeting}
          editMeeting={editMeeting}
        />
        
        <CallFeedbackActionMeeting
          isFeedbackMeetingModalVisible={isFeedbackMeetingModalVisible}
          showFeedbackMeetingModal={(value) => this.showFeedbackMeetingModal(value)}
          performMeetingAction={(type) => this.performMeetingAction(type)}
        />

        <LeadRCMPaymentPopup
          reasons={reasons}
          selectedReason={selectedReason}
          changeReason={this.handleReasonChange}
          checkValidation={checkReasonValidation}
          isVisible={isVisible}
          closeModal={() => this.closeModal()}
          onPress={this.onHandleCloseLead}
          CMlead={true}
        />

        <StatusFeedbackModal
          visible={statusfeedbackModalVisible}
          showAction={modalMode === 'call' || modalMode === 'meeting'}
          showFollowup={modalMode === 'call' || modalMode === 'meeting'}
          showFeedbackModal={(value) => this.showStatusFeedbackModal(value)}
          commentsList={modalMode === 'call' ? StaticData.commentsFeedbackCall : modalMode === 'meeting' ? StaticData.commentsFeedbackMeeting : StaticData.leadClosedCommentsFeedback}
          modalMode={modalMode}
          sendStatus={(comment, id) => this.sendStatus(comment, id)}
          addMeeting={() => this.openModalInMeetingMode()}
          addFollowup={() => this.openModalInFollowupMode()}
          showFeedbackMeetingModal={(value) => this.showFeedbackMeetingModal(value)}
          currentCall={currentCall}
          rejectLead={(body) => this.rejectLead(body)}
          leadType={'CM'}
        />
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
    contacts: store.contacts.contacts,
  }
}

export default connect(mapStateToProps)(Meetings)
