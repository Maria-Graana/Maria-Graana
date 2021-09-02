/** @format */
import axios from 'axios'
import moment from 'moment'
import React, { Component } from 'react'
import { FlatList, Linking, Platform, Text, TouchableOpacity, View } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { connect } from 'react-redux'
import { clearCallPayload } from '../../actions/callMeetingFeedback'
import { setContacts } from '../../actions/contacts'
import { setLeadRes } from '../../actions/lead'
import AppStyles from '../../AppStyles'
import CallFeedbackActionMeeting from '../../components/CallFeedbackActionMeeting'
import CMBottomNav from '../../components/CMBottomNav'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import MeetingFollowupModal from '../../components/MeetingFollowupModal'
import MeetingTile from '../../components/MeetingTile'
import MultiplePhoneOptionModal from '../../components/MultiplePhoneOptionModal'
import ReferenceGuideModal from '../../components/ReferenceGuideModal'
import StatusFeedbackModal from '../../components/StatusFeedbackModal'
import SubmitFeedbackOptionsModal from '../../components/SubmitFeedbackOptionsModal'
import helper from '../../helper'
import PaymentMethods from '../../PaymentMethods'
import StaticData from '../../StaticData'
import PaymentHelper from '../CMPayment/PaymentHelper'
import styles from './style'
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
      currentMeeting: null,
      isFeedbackMeetingModalVisible: false,
      isFollowUpMode: false,
      editMeeting: false,
      closedWon: false,
      comment: null,
      selectedClientContacts: [],
      isMultiPhoneModalVisible: false,
      isReferenceModalVisible: false,
      referenceGuideLoading: false,
      selectedMeetingId: null,
      referenceErrorMessage: null,
      newActionModal: false,
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    this.props.dispatch(setContacts())
    this._unsubscribe = navigation.addListener('focus', () => {
      this.fetchLead()
      this.getMeetingLead()
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
    const { meetings } = this.state
    this.setState({
      active: !this.state.active,
      editMeeting: edit,
      isFollowUpMode: false,
      currentMeeting: edit ? meetings.rows.find((item) => item.id === id) : null,
      newActionModal: false,
    })
  }

  closeMeetingFollowupModal = () => {
    this.setState({
      active: !this.state.active,
      editMeeting: false,
      isFollowUpMode: false,
      currentMeeting: null,
    })
  }

  //  ************ Function for open Follow up modal ************
  openModalInFollowupMode = (value) => {
    this.setState({
      active: !this.state.active,
      editMeeting: false,
      isFollowUpMode: true,
      currentMeeting: null,
      comment: value,
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

  sendMeetingStatus = (status, id, title = 'meeting') => {
    const { formData, meetings } = this.state
    const { lead } = this.props

    let body = {}
    if (status === 'cancel_meeting') {
      axios.delete(`/api/diary/delete?id=${id}&cmLeadId=${lead.id}`).then((res) => {
        this.getMeetingLead()
      })
    } else if (status === 'meeting_done') {
      if (lead && lead.guideReference) {
        body = {
          response: status,
          comments: status,
          leadId: lead.id,
          status: 'completed',
          title,
        }
        axios.patch(`/api/diary/update?id=${id}`, body).then((res) => {
          this.getMeetingLead()
        })
        this.setState({
          statusfeedbackModalVisible: true,
          modalMode: 'meeting',
          selectedMeetingId: id,
          currentMeeting:
            meetings && meetings.rows ? meetings.rows.find((item) => item.id === id) : null,
        })
      } else {
        this.setState({ isReferenceModalVisible: true, selectedMeetingId: id }) // show reference guide modal for first meeting if reference number is null
      }
    } else {
      body = {
        response: status,
        comments: status,
        leadId: lead.id,
        title,
      }
      axios.patch(`/api/diary/update?id=${id}`, body).then((res) => {
        this.getMeetingLead()
      })
    }
  }

  editMeeting = (id) => {
    this.openModalInMeetingMode(true, id)
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

  onHandleCloseLead = () => {
    const { lead, navigation } = this.props
    let body = {
      reasons: 'payment_done',
    }
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
        console.log('/api/leads/project - Error', error)
        helper.errorToast('Closed lead API failed!!')
      })
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
    let fullPaymentDiscount = PaymentHelper.findPaymentPlanDiscount(lead, unit)
    let finalPrice = PaymentMethods.findFinalPrice(
      unit,
      unit.discounted_price,
      fullPaymentDiscount,
      unit.type === 'regular' ? false : true
    )
    let { remainingPayment, remainingTax } = PaymentMethods.findRemaningPaymentWithClearedStatus(
      payment,
      finalPrice
    )
    let outStandingTax = PaymentMethods.findRemainingTaxWithClearedStatus(payment, remainingTax)
    if (outStandingTax <= 0 && remainingPayment <= 0) {
      this.setState({
        closedWon: true,
      })
    } else {
      this.setState({
        closedWon: false,
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

  showStatusFeedbackModal = (value, modalMode) => {
    this.setState({ statusfeedbackModalVisible: value, modalMode })
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
    const { navigation, lead } = this.props
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

  addInvestmentGuide = (guideNo, attachments) => {
    const { lead } = this.props
    const { selectedMeetingId, meetings } = this.state
    let body = {}
    const referenceNumberUrl = `/api/diary/addGuideReference?cmLeadId=${lead.id}&guideReference=${guideNo}`
    this.setState({ referenceGuideLoading: true }, () => {
      axios
        .post(referenceNumberUrl)
        .then((response) => {
          if (response && response.data.status) {
            //helper.successToast(response.data.message)
            this.setState(
              {
                isReferenceModalVisible: false,
                referenceGuideLoading: false,
                referenceErrorMessage: null,
              },
              () => {
                setTimeout(() => {
                  this.setState({ statusfeedbackModalVisible: true }, () => {
                    body = {
                      response: 'meeting_done',
                      comments: 'meeting_done',
                      leadId: lead.id,
                      status: 'completed',
                      title: 'meeting',
                    }
                    axios.patch(`/api/diary/update?id=${selectedMeetingId}`, body).then((res) => {
                      this.getMeetingLead()
                    })
                    this.setState({
                      statusfeedbackModalVisible: true,
                      modalMode: 'meeting',
                      currentMeeting:
                        meetings && meetings.rows
                          ? meetings.rows.find((item) => item.id === selectedMeetingId)
                          : null,
                    })
                  })
                }, 1000)
              }
            )
            this.fetchLead()
            attachments.map((item) => {
              // upload attachments after reference number is added successfully
              let attachment = {
                name: item.fileName,
                type: 'file/' + item.fileName.split('.').pop(),
                uri: item.uri,
              }
              let fd = new FormData()
              fd.append('file', attachment)
              let attachmentUrl = `/api/diary/addGuideAttachment?cmLeadId=${lead.id}&guideReference=${guideNo}&title=${attachment.name}&fileName=${attachment.name}`
              axios.post(attachmentUrl, fd).then((response) => {
                if (!response.status) {
                  helper.errorToast('Failed to upload attachment!')
                }
              })
            })
          } else {
            this.setState({
              referenceGuideLoading: false,
              referenceErrorMessage: response.data.message,
            })
          }
        })
        .catch((error) => {
          console.log('error', error)
        })
    })
  }

  setNewActionModal = (value) => {
    this.setState({ newActionModal: value })
  }

  bookUnit = () => {
    const { navigation } = this.props
    navigation.navigate('CMLeadTabs', { screen: 'Payments' })
  }

  callAgain = () => {
    const { lead, contacts } = this.props
    if (lead && lead.customer) {
      let selectedClientContacts = helper.createContactPayload(lead.customer)
      this.setState({ selectedClientContacts, calledOn: 'phone' }, () => {
        if (selectedClientContacts.payload && selectedClientContacts.payload.length > 1) {
          //  multiple numbers to select
          this.showMultiPhoneModal(true)
        } else {
          helper.callNumber(selectedClientContacts, contacts)
          this.showStatusFeedbackModal(true, 'call')
        }
      })
    }
  }

  showMultiPhoneModal = (value) => {
    this.setState({ isMultiPhoneModalVisible: value })
  }

  handlePhoneSelectDone = (phone) => {
    const { contacts } = this.props
    const copySelectedClientContacts = { ...this.state.selectedClientContacts }
    if (phone) {
      copySelectedClientContacts.phone = phone.number
      copySelectedClientContacts.url = 'tel:' + phone.number
      this.setState(
        { selectedClientContacts: copySelectedClientContacts, isMultiPhoneModalVisible: false },
        () => {
          helper.callNumber(copySelectedClientContacts, contacts)
          this.showStatusFeedbackModal(true, 'call')
        }
      )
    }
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
      modalMode,
      isFollowUpMode,
      currentMeeting,
      closedWon,
      comment,
      selectedClientContacts,
      isMultiPhoneModalVisible,
      isReferenceModalVisible,
      referenceGuideLoading,
      referenceErrorMessage,
      newActionModal,
    } = this.state

    const { navigation, lead } = this.props
    let platform = Platform.OS == 'ios' ? 'ios' : 'android'
    let leadClosedCheck =
      closedLeadEdit === false || checkForUnassignedLeadEdit === false ? false : true
    return (
      <View style={styles.mainWrapCon}>
        <SubmitFeedbackOptionsModal
          showModal={newActionModal}
          modalMode={modalMode}
          setShowModal={(value) => this.setNewActionModal(value)}
          performMeeting={() => this.openModalInMeetingMode()}
          performFollowUp={this.openModalInFollowupMode}
          performReject={this.goToRejectForm}
          call={this.callAgain}
          bookUnit={this.bookUnit}
          leadType={'CM'}
        />
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
              sendStatus={this.sendMeetingStatus}
              editFunction={this.editMeeting}
              leadClosedCheck={leadClosedCheck}
              toggleMenu={(val, id) => this.toggleMenu(val, id)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
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
            showStatusFeedbackModal={(value, modalMode) =>
              this.showStatusFeedbackModal(value, modalMode)
            }
            addMeeting={() => this.openModalInMeetingMode()}
            leadType={'CM'}
            navigation={navigation}
            customer={lead.customer}
            goToHistory={() => {}}
            getCallHistory={() => {}}
            onHandleCloseLead={this.onHandleCloseLead}
            closedWon={closedWon}
            fetchLead={this.fetchLead}
          />
        </View>

        <ReferenceGuideModal
          isReferenceModalVisible={isReferenceModalVisible}
          hideReferenceGuideModal={() => this.setState({ isReferenceModalVisible: false })}
          addInvestmentGuide={(guideNo, attachments) =>
            this.addInvestmentGuide(guideNo, attachments)
          }
          referenceGuideLoading={referenceGuideLoading}
          referenceErrorMessage={referenceErrorMessage}
        />

        <MeetingFollowupModal
          closeModal={() => this.closeMeetingFollowupModal()}
          active={active}
          isFollowUpMode={isFollowUpMode}
          lead={lead}
          leadType={'CM'}
          getMeetingLead={() => this.getMeetingLead()}
          currentMeeting={currentMeeting}
          editMeeting={editMeeting}
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

        <MultiplePhoneOptionModal
          isMultiPhoneModalVisible={isMultiPhoneModalVisible}
          contacts={selectedClientContacts.payload}
          showMultiPhoneModal={this.showMultiPhoneModal}
          handlePhoneSelectDone={this.handlePhoneSelectDone}
        />

        <StatusFeedbackModal
          visible={statusfeedbackModalVisible}
          showFeedbackModal={(value, modalMode) => this.showStatusFeedbackModal(value, modalMode)}
          commentsList={
            modalMode === 'call'
              ? StaticData.commentsFeedbackCall
              : modalMode === 'meeting'
              ? StaticData.commentsFeedbackMeeting
              : StaticData.leadClosedCommentsFeedback
          }
          modalMode={modalMode}
          getMeetingLead={this.getMeetingLead}
          sendMeetingStatus={(comment, id, title) => this.sendMeetingStatus(comment, id, title)}
          rejectLead={(body) => this.rejectLead(body)}
          currentMeeting={currentMeeting}
          setNewActionModal={(value) => this.setNewActionModal(value)}
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
