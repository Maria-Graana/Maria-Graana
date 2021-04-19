/** @format */

import React from 'react'
import axios from 'axios'
import { Image, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import times from '../../../assets/img/times.png'
import AppStyles from '../../AppStyles'
import TouchableButton from '../../components/TouchableButton'
import moment from 'moment'
import helper from '../../helper'
import DateTimePicker from '../DatePicker'
import styles from './style'

class FollowUpModal extends React.Component {
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
      checkValidation: false,
      editMeeting: false,
      diaryTask: {
        subject: '',
        taskType: 'follow_up',
        start: '',
        end: '',
        date: '',
        notes: '',
        status: 'pending',
        leadId: this.props.lead.id,
      },
      loading: false,
      selectedOption: '',
    }
  }

  componentWillUnmount = () => {
    this.setState({
      formData: {},
      editMeeting: false,
      selectedOption: '',
    })
  }

  addFollowUpTask = (selectedOption) => {
    const { diaryTask } = this.state
    const { navigation, user } = this.props
    let payload = {
      subject: 'Follow up with client',
      date: null,
      end: null,
      leadId: diaryTask.leadId,
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
    this.setState(
      {
        active: false,
        editMeeting: false,
      },
      () => {
        this.addFollowUpForCall(payload)
      }
    )
  }

  addFollowUpForCall = (data) => {
    console.log('addFollowUpForCall: ', data)
    // axios
    //   .post(`api/leads/project/meeting`, data)
    //   .then((res) => {
    //     if (res && res.data) {
    //       helper.successToast(
    //         `Follow up task added for ${moment(res.data.start).format('hh:mm a')}, ${moment(
    //           res.data.start
    //         ).format('MMM D')}`,
    //         5000
    //       )
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //     helper.errorToast(`Some thing went wrong!!!`)
    //   })
  }

  //  ************ Function for open modal ************
  openModal = () => {
    this.setState({
      active: !this.state.active,
      formData: {},
      editMeeting: false,
    })
  }

  //  ************ Form Handle Function  ************
  handleForm = (value, name) => {
    const { formData } = this.state
    formData[name] = value
    formData['leadId'] = this.props.lead.id
    this.setState({ formData })
  }

  getMeetingLead = () => {
    const { formData } = this.state
    const { lead } = this.props
    axios.get(`/api/diary/all?leadId=${lead.id}`).then((res) => {
      this.setState({ meetings: res.data })
    })
  }

  //  ************ Form submit Function  ************
  formSubmit = (id) => {
    const { formData, editMeeting, meetingId } = this.state
    if (!formData.time || !formData.date) {
      this.setState({ checkValidation: true })
    } else {
      this.setState({ loading: true })
      let formattedDate = helper.formatDate(formData.date)
      const start = helper.formatDateAndTime(formattedDate, formData.time)
      const end = moment(start).add(1, 'hours').format('YYYY-MM-DDTHH:mm:ssZ')
      if (editMeeting === true) {
        // Update meeting
        let body = {
          date: start,
          time: start,
          leadId: formData.leadId,
          start: start,
          end: end,
        }

        axios
          .patch(`/api/diary/update?id=${meetingId}`, body)
          .then((res) => {
            helper.successToast(`Meeting Updated`)
            let start = new Date(res.data.start)
            let end = new Date(res.data.end)
            let data = {
              id: res.data.id,
              title: res.data.subject,
              body: moment(start).format('hh:mm') + ' - ' + moment(end).format('hh:mm'),
            }
            helper.deleteAndUpdateNotification(data, start, res.data.id)
            this.getMeetingLead()
            formData['time'] = ''
            formData['date'] = ''
            this.setState({
              active: false,
              formData,
              editMeeting: false,
            })
          })
          .catch(() => {
            helper.errorToast(`Some thing went wrong!!!`)
          })
          .finally(() => {
            this.setState({ loading: false })
          })
      } else {
        formData.addedBy = 'self'
        formData.taskCategory = 'leadTask'
        formData.date = start
        formData.time = start
        formData.start = start
        formData.end = end
        // Add meeting
        axios
          .post(`api/leads/project/meeting`, formData)
          .then((res) => {
            formData['time'] = ''
            formData['date'] = ''
            helper.successToast(`Meeting Added`)
            let start = new Date(res.data.start)
            let end = new Date(res.data.end)
            let data = {
              id: res.data.id,
              title: res.data.subject,
              body: moment(start).format('hh:mm') + ' - ' + moment(end).format('hh:mm'),
            }
            TimerNotification(data, start)
            this.getMeetingLead()
            this.setState({
              active: false,
              formData,
            })
          })
          .catch(() => {
            helper.errorToast(`Some thing went wrong!!!`)
          })
          .finally(() => {
            this.setState({ loading: false })
          })
      }
    }
  }

  handleFormDiary = (value, name) => {
    const { diaryTask } = this.state
    let newdiaryTask = { ...diaryTask }
    newdiaryTask[name] = value
    this.setState({ diaryTask: newdiaryTask })
  }

  closeModal = () => {
    const { openModal } = this.props
    this.setState({
      formData: {},
      editMeeting: false,
      selectedOption: '',
    })
    openModal()
  }

  render() {
    const { active, diaryForm } = this.props
    const {
      selectedOption,
      diaryTask,
      formData,
      checkValidation,
      loading,
      editMeeting,
    } = this.state
    if (diaryForm === true) {
      return (
        <Modal isVisible={active}>
          <View style={[styles.modalMain]}>
            <TouchableOpacity
              style={styles.timesBtn}
              onPress={() => {
                this.closeModal()
              }}
            >
              <Image source={times} style={styles.timesImg} />
            </TouchableOpacity>

            <View style={styles.rowVertical}>
              <TouchableButton
                label={'Today'}
                loading={false}
                onPress={() => {
                  this.setState({ selectedOption: 'today' })
                  this.addFollowUpTask('today')
                }}
                containerStyle={styles.button}
              />

              <TouchableButton
                label={'Tomorrow'}
                loading={false}
                onPress={() => {
                  this.setState({ selectedOption: 'tomorrow' })
                  this.addFollowUpTask('tomorrow')
                }}
                containerStyle={styles.button}
              />

              <TouchableButton
                label={'In 3 Days'}
                loading={false}
                onPress={() => {
                  this.setState({ selectedOption: 'in_3_days' })
                  this.addFollowUpTask('in_3_days')
                }}
                containerStyle={styles.button}
              />
              <TouchableButton
                label={'Next Week'}
                loading={false}
                onPress={() => {
                  this.setState({ selectedOption: 'next_week' })
                  this.addFollowUpTask('next_week')
                }}
                containerStyle={styles.button}
              />

              <TouchableButton
                label={'Custom'}
                loading={false}
                onPress={() => this.setState({ selectedOption: 'custom' })}
                containerStyle={styles.button}
              />
            </View>
            {selectedOption === 'custom' && (
              <View style={[styles.formMain]}>
                <DateTimePicker
                  placeholderLabel={'Select Date'}
                  name={'date'}
                  mode={'date'}
                  disabled={selectedOption != 'custom'}
                  showError={checkValidation === true && diaryTask.date === ''}
                  errorMessage={'Required'}
                  iconSource={require('../../../assets/img/calendar.png')}
                  date={diaryTask.date ? new Date(diaryTask.date) : new Date()}
                  selectedValue={diaryTask.date ? helper.formatDate(diaryTask.date) : ''}
                  handleForm={(value, name) => this.handleFormDiary(value, name)}
                />

                <DateTimePicker
                  placeholderLabel={'Select Time'}
                  name={'start'}
                  mode={'time'}
                  disabled={selectedOption != 'custom'}
                  showError={checkValidation === true && diaryTask.start === ''}
                  errorMessage={'Required'}
                  iconSource={require('../../../assets/img/clock.png')}
                  date={diaryTask.start ? new Date(diaryTask.start) : new Date()}
                  selectedValue={diaryTask.start ? helper.formatTime(diaryTask.start) : ''}
                  handleForm={(value, name) => this.handleFormDiary(value, name)}
                />
                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                  <TouchableButton
                    containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
                    label={'Done'}
                    onPress={() => this.addFollowUpTask('custom')}
                  />
                </View>
              </View>
            )}
          </View>
        </Modal>
      )
    } else {
      return (
        <Modal isVisible={active}>
          <View style={[styles.modalMain]}>
            <TouchableOpacity
              style={styles.timesBtn}
              onPress={() => {
                this.closeModal()
              }}
            >
              <Image source={times} style={styles.timesImg} />
            </TouchableOpacity>

            <View style={[styles.formMain]}>
              {/* **************************************** */}
              <DateTimePicker
                placeholderLabel={'Select Date'}
                name={'date'}
                mode={'date'}
                showError={checkValidation === true && formData.date === ''}
                errorMessage={'Required'}
                iconSource={require('../../../assets/img/calendar.png')}
                date={formData.date ? new Date(formData.date) : new Date()}
                selectedValue={formData.date ? helper.formatDate(formData.date) : ''}
                handleForm={(value, name) => this.handleForm(value, name)}
              />

              {/* **************************************** */}
              <DateTimePicker
                placeholderLabel={'Select Start Time'}
                name={'time'}
                mode={'time'}
                showError={checkValidation === true && formData.time === ''}
                errorMessage={'Required'}
                iconSource={require('../../../assets/img/clock.png')}
                date={formData.time ? new Date(formData.time) : new Date()}
                selectedValue={formData.time ? helper.formatTime(formData.time) : ''}
                handleForm={(value, name) => this.handleForm(value, name)}
              />

              {/* **************************************** */}
              <View style={[AppStyles.mainInputWrap]}>
                <TouchableButton
                  containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
                  label={editMeeting ? 'UPDATE MEETING' : 'ADD MEETING'}
                  onPress={() => this.formSubmit()}
                  loading={loading}
                />
              </View>
            </View>
          </View>
        </Modal>
      )
    }
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
  }
}

export default connect(mapStateToProps)(FollowUpModal)
