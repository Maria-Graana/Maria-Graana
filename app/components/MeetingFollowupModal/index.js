/** @format */

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native'
import Modal from 'react-native-modal'
import times from '../../../assets/img/times.png'
import AppStyles from '../../AppStyles'
import TouchableButton from '../TouchableButton'
import moment from 'moment'
import helper from '../../helper'
import DateTimePicker from '../DatePicker'
import PropTypes from 'prop-types'
import { Textarea } from 'native-base'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import TimerNotification from '../../LocalNotifications'
import { getGoogleAuth } from '../../actions/user'
import { useDispatch, connect } from 'react-redux'
import { clearCallPayload } from '../../actions/callMeetingFeedback'

const MeetingFollowupModal = ({
  active,
  isFollowUpMode,
  leadType,
  editMeeting = false,
  lead,
  closeModal,
  getMeetingLead,
  currentMeeting,
  comment,
}) => {
  const [selectedOption, setSelectedOption] = useState('')
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    time: '',
    date: '',
    addedBy: '',
    taskCategory: 'leadTask',
    leadId: null,
    armsLeadId: null,
    start: '',
    end: '',
    subject: '',
  })
  const [followUpData, setFollowUpData] = useState({
    subject: '',
    taskType: 'follow_up',
    start: '',
    end: '',
    date: '',
    notes: '',
    status: 'pending',
    leadId: null,
    armsLeadId: null,
    notes: null,
    taskCategory: 'leadTask',
  })
  const [checkValidation, setValidation] = useState(false)
  const [loading, setLoading] = useState(false)

  const clearFormData = () => {
    const newFormData = { ...formData }
    newFormData.date = ''
    newFormData.time = ''
    setFormData(newFormData)
  }

  const clearFollowupData = () => {
    const newFollowupData = { ...followUpData }
    newFollowupData.subject = ''
    newFollowupData.taskType = 'follow_up'
    newFollowupData.start = ''
    newFollowupData.end = ''
    newFollowupData.date = ''
    newFollowupData.notes = ''
    newFollowupData.status = 'pending'
    newFollowupData.leadId = null
    newFollowupData.armsLeadId = null
    newFollowupData.notes = null
    ;(newFollowupData.taskCategory = null), setFollowUpData(newFollowupData)
  }

  useEffect(() => {
    const newFormData = { ...formData }
    newFormData.leadId = lead ? lead.id : null //cm lead
    newFormData.subject =
      lead && lead.customer ? `Meeting with ${lead.customer.customerName}` : null
    setFormData(newFormData) // update meeting form data on lead prop change
  }, [lead])

  useEffect(() => {
    const newFormDataFollowup = { ...followUpData }
    newFormDataFollowup.leadId = lead ? lead.id : null // cm lead
    newFormDataFollowup.notes = comment ? comment : null
    newFormDataFollowup.subject =
      lead && lead.customer ? `Follow up with ${lead.customer.customerName}` : null
    setFollowUpData(newFormDataFollowup) // update meeting form data for followup
  }, [lead, comment])

  useEffect(() => {
    const newFormData = { ...formData }
    newFormData.date = currentMeeting && currentMeeting.date ? currentMeeting.date : null
    newFormData.time = currentMeeting && currentMeeting.time ? currentMeeting.time : null
    setFormData(newFormData)
  }, [editMeeting, currentMeeting])

  //  ************ Form submit Function  ************
  const formSubmit = () => {
    if (!formData.time || !formData.date) {
      setValidation(true)
    } else {
      setLoading(true)
      let formattedDate = helper.formatDate(formData.date)
      const start = helper.formatDateAndTime(formattedDate, formData.time)
      const end = moment(start).add(1, 'hours').format('YYYY-MM-DDTHH:mm:ssZ')
      if (editMeeting === true) {
        // Update meeting
        let body = {
          date: start,
          time: start,
          leadId: leadType === 'CM' ? formData.leadId : null,
          armsLeadId: leadType === 'RCM' ? formData.leadId : null,
          start: start,
          end: end,
        }
        dispatch(getGoogleAuth()).then((res) => {
          axios
            .patch(`/api/diary/update?id=${currentMeeting.id}`, body)
            .then((res) => {
              helper.successToast(`Meeting Updated`)
              getMeetingLead && getMeetingLead()
              closeModal()
              clearFormData()
            })
            .catch((error) => {
              helper.errorToast(`Some thing went wrong!!!`, error)
            })
            .finally(() => {
              setLoading(false)
            })
        })
      } else {
        formData.addedBy = 'self'
        formData.taskCategory = 'leadTask'
        formData.date = start
        formData.time = start
        formData.start = start
        formData.end = end
        // Add meeting

        dispatch(getGoogleAuth()).then((res) => {
          axios
            .post(`api/leads/project/meeting`, formData)
            .then((res) => {
              helper.successToast(`Meeting Added`)
              let start = new Date(res.data.start)
              let end = new Date(res.data.end)
              let data = {
                id: res.data.id,
                title: res.data.subject,
                body: moment(start).format('hh:mm A') + ' - ' + moment(end).format('hh:mm A'),
              }
            //  TimerNotification(data, start)
              getMeetingLead && getMeetingLead()
              closeModal()
              clearFormData()
            })
            .catch(() => {
              helper.errorToast(`Some thing went wrong!!!`)
            })
            .finally(() => {
              setLoading(false)
            })
        })
      }
    }
  }

  const addFollowUpTask = (selectedOption) => {
    let payload = {
      subject: followUpData.subject,
      date: null,
      end: null,
      leadId: leadType === 'CM' ? followUpData.leadId : null,
      armsLeadId: leadType === 'RCM' ? followUpData.leadId : null,
      start: null,
      taskType: followUpData.taskType,
      time: null,
      notes: '',
      status: 'pending',
      notes: null,
      addedBy: 'self',
      taskCategory: 'leadTask',
    }
    payload.notes = followUpData.notes
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
          helper.formatDate(followUpData.date),
          followUpData.start
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

    // close Modal here
    dispatch(getGoogleAuth()).then((res) => {
      addFollowUpForCall(payload)
    })
    closeModal()
  }

  const addFollowUpForCall = (data) => {
    axios
      .post(`api/leads/project/meeting`, data)
      .then((res) => {
        if (res && res.data) {
          setSelectedOption('')
          clearFollowupData()
          getMeetingLead && getMeetingLead()
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

  //  ************ Form Handle Function For Meeting  ************
  const handleForm = (value, name) => {
    let newformData = { ...formData }
    newformData[name] = value
    setFormData(newformData)
  }

  const setInitialDateTimeCustom = () => {
    const startTime = moment()
    const start = startTime.add(1, 'hours')
    const newformData = { ...followUpData }
    newformData['status'] = 'pending'
    newformData['taskType'] = 'follow_up'
    newformData['start'] = start
    newformData['end'] = start
    newformData['date'] = start
    setFollowUpData(newformData)
  }

  const handleFormDiary = (value, name) => {
    let newdiaryTask = { ...followUpData }
    newdiaryTask[name] = value
    setFollowUpData(newdiaryTask)
  }

  return (
    // Follow up Modal
    isFollowUpMode ? (
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
        <Modal isVisible={active}>
          <KeyboardAvoidingView behavior={'padding'} style={styles.safeAreaView}>
            <View style={[styles.modalMain]}>
              <TouchableOpacity
                style={styles.timesBtn}
                onPress={() => {
                  setSelectedOption('')
                  closeModal()
                  dispatch(clearCallPayload())
                }}
              >
                <Image source={times} style={styles.timesImg} />
              </TouchableOpacity>

              <View style={styles.rowVertical}>
                <TouchableButton
                  label={'Today'}
                  loading={false}
                  onPress={() => {
                    setSelectedOption('today')
                    addFollowUpTask('today')
                  }}
                  containerStyle={styles.button}
                />

                <TouchableButton
                  label={'Tomorrow'}
                  loading={false}
                  onPress={() => {
                    setSelectedOption('tomorrow')
                    addFollowUpTask('tomorrow')
                  }}
                  containerStyle={styles.button}
                />

                <TouchableButton
                  label={'In 3 Days'}
                  loading={false}
                  onPress={() => {
                    setSelectedOption('in_3_days')
                    addFollowUpTask('in_3_days')
                  }}
                  containerStyle={styles.button}
                />
                <TouchableButton
                  label={'Next Week'}
                  loading={false}
                  onPress={() => {
                    setSelectedOption('next_week')
                    addFollowUpTask('next_week')
                  }}
                  containerStyle={styles.button}
                />

                <TouchableButton
                  label={'Custom'}
                  loading={false}
                  onPress={() => {
                    setInitialDateTimeCustom()
                    setSelectedOption('custom')
                  }}
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
                    showError={checkValidation === true && followUpData.date === ''}
                    errorMessage={'Required'}
                    iconSource={require('../../../assets/img/calendar.png')}
                    date={followUpData.date ? new Date(followUpData.date) : new Date()}
                    selectedValue={followUpData.date ? helper.formatDate(followUpData.date) : ''}
                    handleForm={(value, name) => handleFormDiary(value, name)}
                  />

                  <DateTimePicker
                    placeholderLabel={'Select Time'}
                    name={'start'}
                    mode={'time'}
                    disabled={selectedOption != 'custom'}
                    showError={checkValidation === true && followUpData.start === ''}
                    errorMessage={'Required'}
                    iconSource={require('../../../assets/img/clock.png')}
                    date={followUpData.start ? new Date(followUpData.start) : new Date()}
                    selectedValue={followUpData.start ? helper.formatTime(followUpData.start) : ''}
                    handleForm={(value, name) => handleFormDiary(value, name)}
                  />
                  {/* **************************************** */}
                  <View style={[AppStyles.mainInputWrap]}>
                    <TouchableButton
                      containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
                      label={'Done'}
                      onPress={() => addFollowUpTask('custom')}
                    />
                  </View>
                </View>
              )}

              <Textarea
                placeholderTextColor={'#a8a8aa'}
                style={[
                  AppStyles.formControl,
                  Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
                  AppStyles.formFontSettings,
                  { height: 100, paddingTop: 10 },
                ]}
                rowSpan={5}
                returnKeyType="done"
                placeholder="Description"
                onChangeText={(text) => handleFormDiary(text, 'notes')}
                onSubmitEditing={() => Keyboard.dismiss()}
                blurOnSubmit={true}
                value={followUpData.notes}
              />
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </TouchableWithoutFeedback>
    ) : (
      // Meeting Modal
      <Modal isVisible={active}>
        <View style={[styles.modalMain]}>
          <TouchableOpacity style={styles.timesBtn} onPress={() => closeModal()}>
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
              handleForm={(value, name) => handleForm(value, name)}
              disabled={currentMeeting && currentMeeting.status === 'completed'}
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
              handleForm={(value, name) => handleForm(value, name)}
              disabled={currentMeeting && currentMeeting.status === 'completed'}
            />

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <TouchableButton
                containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
                label={editMeeting ? 'UPDATE MEETING' : 'ADD MEETING'}
                onPress={() => formSubmit()}
                loading={loading}
                disabled={currentMeeting && currentMeeting.status === 'completed'}
              />
            </View>
          </View>
        </View>
      </Modal>
    )
  )
}

MeetingFollowupModal.propTypes = {
  isFollowUpMode: PropTypes.bool.isRequired,
  lead: PropTypes.object,
  closeModal: PropTypes.func.isRequired,
  editMeeting: PropTypes.bool,
  leadType: PropTypes.string.isRequired,
  getMeetingLead: PropTypes.func,
  currentMeeting: PropTypes.object,
}

const styles = StyleSheet.create({
  modalMain: {
    backgroundColor: '#E8EDF0',
    borderRadius: 10,
    padding: 15,
    paddingTop: 50,
    paddingBottom: 50,
    zIndex: 5,
    position: 'relative',
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
  },
  timesBtn: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  timesImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  rowVertical: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 4,
    width: '70%',
    alignSelf: 'center',
    margin: 10,
  },
})

mapStateToProps = (store) => {
  return {
    comment: store.callMeetingStatus.callMeetingStatus.comments,
  }
}

export default connect(mapStateToProps)(MeetingFollowupModal)
