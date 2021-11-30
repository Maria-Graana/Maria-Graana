/** @format */

import axios from 'axios'
import moment from 'moment'
import React from 'react'
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles'
import BackButton from '../../components/BackButton'
import helper from '../../helper'
import HistoryTile from '../HistoryTile'
import LoadingNoResult from '../LoadingNoResult'

class HistoryModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: {
        time: '',
        date: '',
        addedBy: '',
        taskCategory: '',
        leadId: this.props.lead.id,
        start: '',
        end: '',
        subject: this.props.lead.customer
          ? `Meeting with ${this.props.lead.customer.customerName}`
          : null,
      },
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
      active: false,
      doneStatusId: '',
      visibleStatus: false,
      checkValidation: false,
      modalLoading: false,
      loading: false,
      diaryForm: false,
    }
  }

  openStatus = (data) => {
    this.setState({
      visibleStatus: !this.state.visibleStatus,
      doneStatusId: data,
    })
  }

  sendStatus = (status) => {
    const { lead } = this.props
    const { formData, doneStatusId } = this.state
    let body = {
      response: status,
      rcmLeadId: lead.id,
    }
    axios.patch(`/api/diary/update?id=${doneStatusId.id}`, body).then((res) => {
      this.props.getCallHistory()
      this.setState(
        {
          visibleStatus: !this.state.visibleStatus,
        },
        () => {
          if (status === 'follow_up') {
            setTimeout(() => {
              this.addDiary()
            }, 500)
          }
        }
      )
    })
  }

  handleFormDiary = (value, name) => {
    const { diaryTask } = this.state
    let newdiaryTask = { ...diaryTask }
    newdiaryTask[name] = value
    this.setState({ diaryTask: newdiaryTask })
  }

  addFollowUpTask = (selectedOption) => {
    const { diaryTask } = this.state
    let payload = {
      subject: 'Follow up with client',
      date: null,
      end: null,
      armsLeadId: diaryTask.leadId,
      start: null,
      taskType: diaryTask.taskType,
      time: null,
      notes: '',
      status: 'pending',
    }
    switch (selectedOption) {
      case 'today':
        let todayPayload = { ...payload }
        let startForToday = moment().add(1, 'hour').format('YYYY-MM-DDTHH:mm:ssZ')
        todayPayload.start = startForToday
        todayPayload.date = startForToday
        todayPayload.end = moment(todayPayload.start).add(1, 'hour').format('YYYY-MM-DDTHH:mm:ssZ')
        todayPayload.time = startForToday
        payload = todayPayload
        break
      case 'tomorrow':
        let tomorrowPayload = { ...payload }
        let startForTomorrow = moment().add(1, 'day')
        startForTomorrow.set({ hour: 9, minute: 0, second: 0 }).toISOString()
        startForTomorrow.format('YYYY-MM-DDTHH:mm:ssZ')
        tomorrowPayload.start = startForTomorrow
        tomorrowPayload.date = startForTomorrow
        tomorrowPayload.end = moment(startForTomorrow).add(1, 'hour').format('YYYY-MM-DDTHH:mm:ssZ')
        tomorrowPayload.time = startForTomorrow
        payload = tomorrowPayload
        break
      case 'in_3_days':
        let inThreeDaysPayload = { ...payload }
        let startForIn3days = moment().add(3, 'days')
        startForIn3days.set({ hour: 9, minute: 0, second: 0 }).toISOString()
        startForIn3days.format('YYYY-MM-DDTHH:mm:ssZ')
        inThreeDaysPayload.start = startForIn3days
        inThreeDaysPayload.date = startForIn3days
        inThreeDaysPayload.end = moment(startForIn3days)
          .add(1, 'hour')
          .format('YYYY-MM-DDTHH:mm:ssZ')
        inThreeDaysPayload.time = startForIn3days
        payload = inThreeDaysPayload
        break
      case 'next_week':
        let nextWeekPayload = { ...payload }
        let startForNextWeek = moment().add(7, 'days')
        startForNextWeek.set({ hour: 9, minute: 0, second: 0 }).toISOString()
        startForNextWeek.format('YYYY-MM-DDTHH:mm:ssZ')
        nextWeekPayload.start = startForNextWeek
        nextWeekPayload.date = startForNextWeek
        nextWeekPayload.end = moment(startForNextWeek).add(1, 'hour').format('YYYY-MM-DDTHH:mm:ssZ')
        nextWeekPayload.time = startForNextWeek
        payload = nextWeekPayload
        break
      case 'custom':
        let customPayload = { ...payload }
        let customStart = helper.formatDateAndTime(
          helper.formatDate(diaryTask.date),
          diaryTask.start
        )
        customPayload.start = customStart
        customPayload.date = customStart
        customPayload.end = moment(customStart).add(1, 'hour').format('YYYY-MM-DDTHH:mm:ssZ')
        customPayload.time = customStart
        payload = customPayload
        break
      default:
        break
    }
    this.setState({ active: false }, () => {
      this.props.closePopup()
      this.addFollowUpForCall(payload)
    })
  }

  addFollowUpForCall = (data) => {
    axios
      .post(`api/leads/project/meeting`, data)
      .then((res) => {
        if (res && res.data) {
          helper.successToast(
            `Follow up task added for ${moment(res.data.start).format('hh:mm a')}, ${moment(
              res.data.start
            ).format('MMM D')}`,
            5000
          )
        }
      })
      .catch((error) => {
        console.log(error)
        helper.errorToast(`Some thing went wrong!!!`)
      })
  }

  addDiary = () => {
    const { diaryTask } = this.state
    const startTime = moment()
    const start = startTime.add(1, 'hours')
    const newformData = { ...diaryTask }
    newformData['subject'] = 'Follow up with client'
    newformData['status'] = 'pending'
    newformData['taskType'] = 'follow_up'
    newformData['start'] = start
    newformData['end'] = start
    newformData['date'] = start
    this.setState({
      active: !this.state.active,
      diaryForm: true,
      diaryTask: newformData,
    })
  }

  //  ************ Function for open modal ************
  openModal = () => {
    this.setState({
      active: !this.state.active,
      formData: {},
    })
  }

  render() {
    const { openPopup, closePopup, lead, user, data } = this.props
    const {
      doneStatusId,
      visibleStatus,
      formData,
      checkValidation,
      diaryForm,
      loading,
      diaryTask,
      active,
      modalLoading,
    } = this.state
    let leadAssign = helper.checkAssignedSharedStatus(user, lead)
    return (
      <Modal visible={openPopup} animationType="slide" onRequestClose={this.props.closePopup}>
        <SafeAreaView style={[AppStyles.mb1, styles.container]}>
          <View style={styles.topHeader}>
            <BackButton
              onClick={() => {
                this.props.closePopup()
              }}
            />
            <View style={styles.header}>
              <Text style={styles.headerText}>ACTIVITIES HISTORY</Text>
            </View>
          </View>
          {data.length ? (
            <FlatList
              style={styles.flatStyle}
              data={data}
              renderItem={({ item }, index) => (
                <HistoryTile
                  data={item}
                  openStatus={this.openStatus}
                  sendStatus={this.sendStatus}
                  doneStatus={visibleStatus}
                  doneStatusId={doneStatusId}
                  editFunction={this.editFunction}
                  leadClosedCheck={leadAssign}
                />
              )}
              keyExtractor={(_, index) => index}
            />
          ) : (
            <LoadingNoResult loading={false} />
          )}
          {/* <HistoryStatusModal
                        visibleStatus={visibleStatus}
                        sendStatus={this.sendStatus}
                        openStatus={this.openStatus}
                    /> */}
          {/* <MeetingModal
                        active={active}
                        formData={formData}
                        checkValidation={checkValidation}
                        openModal={this.openModal}
                        diaryForm={true}
                        diaryTask={diaryTask}
                        handleFormDiary={this.handleFormDiary}
                        addFollowUpTask={(selectedOption) => this.addFollowUpTask(selectedOption)}
                        loading={loading}
                    /> */}
        </SafeAreaView>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e7ecf0',
    paddingVertical: 10,
  },
  topHeader: {
    flexDirection: 'row',
    margin: 10,
  },
  backImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    paddingRight: 30,
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 16,
  },
  flatStyle: {
    padding: 10,
  },
})

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
  }
}

export default connect(mapStateToProps)(HistoryModal)
