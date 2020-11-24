import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Linking, Image } from 'react-native';
import { Fab } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'
import { connect } from 'react-redux';
import styles from './style'
import MeetingTile from '../../components/MeetingTile'
import MeetingModal from '../../components/MeetingModal'
import MeetingStatusModal from '../../components/MeetingStatusModal'
import moment from 'moment'
import helper from '../../helper';
import AppStyles from '../../AppStyles';
import { ProgressBar, Colors } from 'react-native-paper';
import { FAB } from 'react-native-paper';
import { setlead, setLeadRes } from '../../actions/lead';
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import StaticData from '../../StaticData';
import CMBottomNav from '../../components/CMBottomNav'
import { Platform } from 'react-native'
import { setContacts } from '../../actions/contacts';
import TimerNotification from '../../LocalNotifications';
import { cos } from 'react-native-reanimated';

class Meetings extends Component {
  constructor(props) {
    super(props)
    const { lead, user } = this.props
    this.state = {
      active: false,
      formData: {
        time: '',
        date: '',
        addedBy: '',
        taskCategory: '',
        leadId: this.props.lead.id,
        start: '',
        end: '',
        subject: this.props.lead.customer ? `Meeting with ${this.props.lead.customer.customerName}` : null
      },
      meetings: [],
      checkValidation: false,
      doneStatus: false,
      doneStatusId: '',
      editMeeting: false,
      meetingId: '',
      modalStatus: 'dropdown',
      open: false,
      progressValue: 0,
      reasons: [],
      isVisible: false,
      selectedReason: '',
      checkReasonValidation: false,
      closedLeadEdit: helper.checkAssignedSharedStatus(user, lead),
      checkForUnassignedLeadEdit: helper.checkAssignedSharedStatus(user, lead),
      diaryForm: false,
      diaryTask: {
        subject: '',
        taskType: 'follow up',
        start: '',
        end: '',
        date: '',
        notes: '',
        status: 'pending',
        leadId: this.props.lead.id,
      },
      loading: false,
      secondScreenData: {},
      checkForNewLeadData: false,
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    this.fetchLead()
    this.getMeetingLead()
    this.props.dispatch(setContacts())
    this._unsubscribe = navigation.addListener('focus', () => {
      this.fetchLead();
    })
  }

  fetchLead = (newLeadDataStatus) => {
    const { lead } = this.props
    const { cmProgressBar } = StaticData
    axios.get(`/api/leads/project/byId?id=${lead.id}`)
      .then((res) => {
        this.props.dispatch(setLeadRes(res.data))
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
  openModal = () => {
    this.setState({
      active: !this.state.active,
      formData: {},
      editMeeting: false,
      diaryForm: false,
    })
  }

  //  ************ Form Handle Function  ************ 
  handleForm = (value, name) => {
    const { formData } = this.state
    formData[name] = value
    formData['leadId'] = this.props.lead.id
    this.setState({ formData });
  }

  getMeetingLead = () => {
    const { formData } = this.state
    const { lead } = this.props
    axios.get(`/api/diary/all?leadId=${lead.id}`)
      .then((res) => {
        this.setState({ meetings: res.data })
      })
  }

  //  ************ Form submit Function  ************ 
  formSubmit = (id) => {
    const { formData, editMeeting, meetingId } = this.state
    if (!formData.time || !formData.date) {
      this.setState({ checkValidation: true })
    } else {
      this.setState({ loading: true });
      let formattedDate = helper.formatDate(formData.date);
      const start = helper.formatDateAndTime(formattedDate, formData.time);
      const end = moment(start).add(1, 'hours').format('YYYY-MM-DDTHH:mm:ssZ');
      if (editMeeting === true) {
        // Update meeting
        let body = {
          date: start,
          time: start,
          leadId: formData.leadId,
          start: start,
          end: end,
        }

        axios.patch(`/api/diary/update?id=${meetingId}`, body)
          .then((res) => {
            helper.successToast(`Meeting Updated`)
            let start = new Date(res.data.start)
            let end = new Date(res.data.end)
            let data = {
              id: res.data.id,
              title: res.data.subject,
              body: moment(start).format("hh:mm") + ' - ' + moment(end).format("hh:mm")
            }
            helper.deleteAndUpdateNotification(data, start, res.data.id)
            this.getMeetingLead();
            formData['time'] = ''
            formData['date'] = ''
            this.setState({
              active: false,
              formData,
              editMeeting: false,
            })
          }).catch(() => {
            helper.errorToast(`Some thing went wrong!!!`)
          }).finally(() => {
            this.setState({ loading: false })
          })
      } else {
        formData.addedBy = 'self';
        formData.taskCategory = 'leadTask';
        formData.date = start;
        formData.time = start;
        formData.start = start;
        formData.end = end;
        // Add meeting
        axios.post(`api/leads/project/meeting`, formData)
          .then((res) => {
            formData['time'] = ''
            formData['date'] = ''
            helper.successToast(`Meeting Added`)
            let start = new Date(res.data.start)
            let end = new Date(res.data.end)
            let data = {
              id: res.data.id,
              title: res.data.subject,
              body: moment(start).format("hh:mm") + ' - ' + moment(end).format("hh:mm")
            }
            TimerNotification(data, start)
            this.getMeetingLead();
            this.setState({
              active: false,
              formData,
            })
          }).catch(() => {
            helper.errorToast(`Some thing went wrong!!!`)
          }).finally(() => {
            this.setState({ loading: false })
          })
      }

    }
  }

  formSubmitDiary = (id) => {
    const { diaryTask } = this.state
    if (!diaryTask.start || !diaryTask.date) {
      this.setState({ checkValidation: true })
    } else {
      this.setState({ loading: true })
      let formattedDate = helper.formatDate(diaryTask.date);
      const start = helper.formatDateAndTime(formattedDate, diaryTask.start);
      const end = moment(start).add(0.33, 'hours').format('YYYY-MM-DDTHH:mm:ssZ');
      let body = {
        subject: 'Follow up with client',
        date: start,
        end: end,
        leadId: diaryTask.leadId,
        start: start,
        taskType: diaryTask.taskType,
        time: start,
      }
      axios.post(`api/leads/project/meeting`, body)
        .then((res) => {
          helper.successToast(`Follow up task added to the Diary`)
          this.getMeetingLead();
          this.setState({
            active: false,
            editMeeting: false,
          })
        }).catch((error) => {
          console.log(error)
          helper.errorToast(`Some thing went wrong!!!`)
        }).finally(() => {
          this.setState({ loading: false })
        })
    }
  }

  openStatus = (data) => {
    this.setState({
      doneStatus: !this.state.doneStatus,
      doneStatusId: data,
      modalStatus: 'dropdown'
    })
  }

  openAttechment = () => {
    this.setState({
      modalStatus: 'btnOptions',
      doneStatus: !this.state.doneStatus,
    })
  }

  sendStatus = (status) => {
    const { formData } = this.state
    let body = {
      response: status,
      leadId: formData.leadId
    }

    if (status === 'cancel_meeting') {
      axios.delete(`/api/diary/delete?id=${this.state.doneStatusId.id}&cmLeadId=${formData.leadId}`)
        .then((res) => {
          this.getMeetingLead();
          this.setState({
            doneStatus: !this.state.doneStatus,
          })
        })
    } else {
      axios.patch(`/api/diary/update?id=${this.state.doneStatusId.id}`, body)
        .then((res) => {
          this.getMeetingLead();
          this.setState({
            doneStatus: !this.state.doneStatus,
          }, () => {

            if (status === 'follow_up') {
              setTimeout(() => {
                this.addDiary()
              }, 500)

            }
          })
        })
    }

  }

  addDiary = () => {
    const { diaryTask } = this.state
    const startTime = moment()
    const endTime = moment()
    const add20Minutes = startTime.add(20, 'minutes');
    const newformData = { ...diaryTask }
    newformData['taskType'] = 'follow up'
    newformData['start'] = add20Minutes;
    newformData['end'] = endTime
    newformData['date'] = add20Minutes;
    this.setState({
      active: !this.state.active,
      diaryForm: true,
      diaryTask: newformData,
    })
  }

  handleFormDiary = (value, name) => {
    const { diaryTask } = this.state
    let newdiaryTask = { ...diaryTask }
    newdiaryTask[name] = value
    this.setState({ diaryTask: newdiaryTask })
  }

  sendCallStatus = () => {
    const start = moment().format();
    let body = {
      start: start,
      end: start,
      time: start,
      date: start,
      taskType: 'called',
      response: 'Called',
      subject: 'Call to client ' + this.props.lead.customer.customerName,
      cutomerId: this.props.lead.customer.id,
      leadId: this.props.lead.id,
      taskCategory: 'leadTask',
    }
    axios.post(`api/leads/project/meeting`, body)
      .then((res) => {
        this.getMeetingLead();
      })
  }

  callNumber = (url) => {
    if (url != 'tel:null') {
      Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            // this.sendCallStatus()
            console.log("Can't handle url: " + url);
          } else {
            this.sendCallStatus()
            this.call()
            return Linking.openURL(url)
          }
        }).catch(err => console.error('An error occurred', err));
    } else {
      helper.errorToast(`No Phone Number`)
    }
  }

  call = () => {
    const { lead, contacts } = this.props
    let newContact = helper.createContactPayload(lead.customer)
    let result = helper.contacts(newContact.phone, contacts)
    if (newContact.name && newContact.name !== '' && newContact.name !== ' ' && newContact.phone && newContact.phone !== '') if (!result) helper.addContact(newContact)
  }

  editFunction = (id) => {
    const { meetings, active } = this.state
    let filter = meetings.rows.filter((item) => { return item.id === id && item })
    this.setState({
      active: !active,
      formData: {
        date: filter[0].date,
        time: filter[0].time,
        leadId: this.props.lead.id,
      },
      editMeeting: true,
      meetingId: id,
    })
  }

  goToComments = () => {
    const { navigation, route } = this.props;
    navigation.navigate('Comments', { cmLeadId: this.props.lead.id });
  }

  goToAttachments = () => {
    const { navigation, route } = this.props;
    navigation.navigate('Attachments', { cmLeadId: this.props.lead.id });
  }

  goToDiaryForm = (taskType) => {
    const { navigation, route, user } = this.props;
    navigation.navigate('AddDiary', {
      update: false,
      agentId: user.id,
      cmLeadId: this.props.lead.id,
      addedBy: 'self',
      tasksList: StaticData.taskValuesCMLead,
      taskType: taskType != '' ? taskType : null
    });
  }

  navigateTo = () => {
    this.props.navigation.navigate('LeadDetail', { lead: this.props.lead, purposeTab: 'invest' })
  }

  handleReasonChange = (value) => {
    this.setState({ selectedReason: value });
  }

  closeModal = () => {
    this.setState({ isVisible: false })
  }

  onHandleCloseLead = (reason) => {
    const { lead, navigation } = this.props
    const { selectedReason } = this.state;
    let body = {
      reasons: selectedReason
    }
    if (selectedReason && selectedReason !== '') {
      var leadId = []
      leadId.push(lead.id)
      axios.patch(`/api/leads/project`, body, { params: { id: leadId } })
        .then(res => {
          this.setState({ isVisible: false }, () => {
            helper.successToast(`Lead Closed`)
            navigation.navigate('Leads');
          });
        }).catch(error => {
          console.log(error);
        })
    } else {
      alert('Please select a reason for lead closure!')
    }

  }

  closedLead = () => {
    const { lead, user } = this.props
    lead.status != StaticData.Constants.lead_closed_won ||
      lead.status != StaticData.Constants.lead_closed_lost && helper.leadClosedToast()
    lead.assigned_to_armsuser_id != user.id && helper.leadNotAssignedToast()
  }

  closeLead = () => {
    this.fetchLead(true)

    const { secondScreenData, checkForNewLeadData } = this.state
    if (secondScreenData && secondScreenData != '' && checkForNewLeadData === true) {

      // Check For Any pending and rejected Status
      var approvedPaymentDone = []
      secondScreenData && secondScreenData.payment != null &&
        secondScreenData.payment.filter((item, index) => {
          return item.status === 'pendingAccount' || item.status === 'pendingSales' || item.status === 'bankPending' || item.status === 'notCleared' ?
            approvedPaymentDone.push(true) : approvedPaymentDone.push(false)
        })

      // If there is any true in the bottom array PAYMENT DONE option will be hide
      var checkForPenddingNrjected = []
      var checkForPenddingNClear = []
      approvedPaymentDone && approvedPaymentDone.length > 0 &&
        approvedPaymentDone.filter((item) => { item === true && checkForPenddingNrjected.push(true) })
      approvedPaymentDone && approvedPaymentDone.length > 0 &&
        approvedPaymentDone.filter((item) => { item === false && checkForPenddingNClear.push(false) })

      var remainingPayment = this.props.lead.remainingPayment
      if (remainingPayment <= 0 && remainingPayment != null && checkForPenddingNrjected.length === 0) {
        this.setState({ reasons: StaticData.paymentPopupDone, isVisible: true, checkReasonValidation: '', checkForNewLeadData: false })
      } else {
        // Check For,If some payment is clear agent would not be able to close lead as close lost
        if (Number(remainingPayment) >= 0 && secondScreenData.remainingPayment != null || checkForPenddingNClear.length != 0) {
          if (checkForPenddingNClear.length === 0) {
            this.setState({ reasons: StaticData.paymentPopup, isVisible: true, checkReasonValidation: '' })
          } else {
            this.setState({ reasons: StaticData.paymentPopupAnyPaymentAdded, isVisible: true, checkReasonValidation: '' })
          }
        } else {
          this.setState({ reasons: StaticData.paymentPopup, isVisible: true, checkReasonValidation: '' })
        }
      }


    }





  }

  render() {
    const {
      active,
      formData,
      checkValidation,
      meetings,
      doneStatus,
      doneStatusId,
      modalStatus,
      open,
      progressValue,
      editMeeting,
      reasons,
      selectedReason,
      checkReasonValidation,
      closedLeadEdit,
      isVisible,
      checkForUnassignedLeadEdit,
      diaryForm,
      diaryTask,
      loading,
    } = this.state
    const { contacts } = this.props
    let platform = Platform.OS == 'ios' ? 'ios' : 'android'
    let leadData = this.props.lead
    let leadClosedCheck = closedLeadEdit === false || checkForUnassignedLeadEdit === false ? false : true
    return (
      <View style={styles.mainWrapCon}>
        <ProgressBar style={{ backgroundColor: "ffffff" }} progress={progressValue} color={'#0277FD'} />

        {/* ************Fab For Open Modal************ */}
        <View style={[styles.meetingConteiner, leadClosedCheck === true ? styles.openLeadHeight : styles.closeLeadHeight]}>
          <ScrollView>
            <View style={styles.paddBottom}>
              {
                meetings && meetings != '' && meetings.rows.map((item, key) => {
                  return (
                    <MeetingTile
                      data={item}
                      key={key}
                      openStatus={this.openStatus}
                      sendStatus={this.sendStatus}
                      doneStatus={doneStatus}
                      doneStatusId={doneStatusId}
                      editFunction={this.editFunction}
                      leadClosedCheck={leadClosedCheck}
                    />
                  )
                })
              }
            </View>
          </ScrollView>

        </View>
        {
          leadClosedCheck == true &&
          <View style={[styles.callMeetingBtn]}>
            <View style={[styles.btnsMainWrap]}>
              <TouchableOpacity style={[styles.actionBtn, platform == 'ios' ? styles.boxShadowForIos : styles.boxShadowForandroid]} onPress={() => { this.openModal() }}>
                <Text style={styles.alignCenter}>Add Meeting</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.btnsMainWrap]}>
              <TouchableOpacity style={[styles.actionBtn, platform == 'ios' ? styles.boxShadowForIos : styles.boxShadowForandroid]} onPress={() => { this.callNumber(`tel:${leadData.customer && leadData.customer.phone}`) }}>
                <Text style={styles.alignCenter}>Call</Text>
              </TouchableOpacity>
            </View>

          </View>
        }
        <View style={AppStyles.mainCMBottomNav}>
          <CMBottomNav
            goToAttachments={this.goToAttachments}
            navigateTo={this.navigateTo}
            goToDiaryForm={this.goToDiaryForm}
            goToComments={this.goToComments}
            alreadyClosedLead={this.closedLead}
            closedLeadEdit={leadClosedCheck}
            closeLead={this.closeLead}
          />
        </View>

        {/* ************Modal Component************ */}
        {
          active === true &&
          <MeetingModal
            active={active}
            formData={formData}
            checkValidation={checkValidation}
            openModal={this.openModal}
            handleForm={this.handleForm}
            formSubmit={this.formSubmit}
            diaryForm={diaryForm}
            editMeeting={editMeeting}
            diaryTask={diaryTask}
            handleFormDiary={this.handleFormDiary}
            formSubmitDiary={this.formSubmitDiary}
            loading={loading}
          />
        }

        <MeetingStatusModal
          doneStatus={doneStatus}
          sendStatus={this.sendStatus}
          data={doneStatusId}
          openStatus={this.openStatus}
          modalType={modalStatus}
          goToDiaryForm={this.goToDiaryForm}
          goToAttachments={this.goToAttachments}
          goToComments={this.goToComments}
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

      </View >
    )
  }
}


mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
    contacts: store.contacts.contacts
  }
}

export default connect(mapStateToProps)(Meetings)


