/** @format */

import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

import styles from './style'
import TouchableButton from '../../components/TouchableButton'
import DateControl from '../../components/DateControl'
import CalendarComponent from '../../components/CalendarComponent'
import { minArray, hourArray, _format, _dayAfterTomorrow, _today, _tomorrow } from './constants'
import { connect } from 'react-redux'
import { setSlotDiaryData, setSlotData, setScheduledTasks } from '../../actions/slotManagement'
import moment from 'moment'
import _ from 'underscore'

function TimeSlotManagement(props) {
  const data = props.timeSlots
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(_today)
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [slots, setSlots] = useState([])
  const [dayName, setDayName] = useState(moment(_today).format('dddd').toLowerCase())
  const [slotsData, setSlotsData] = useState([])
  const [slotsDiary, setSlotsDiary] = useState(props.slotDiary)
  const [isSelected, setIsSelected] = useState([])

  const rotateArray = data && data[0].map((val, index) => data.map((row) => row[index]))

  const setSelectedDateData = (date, mode) => {
    setSelectedDate(date), setIsCalendarVisible(mode === 'month' ? isCalendarVisible : false)

    const dayN = moment(date).format('dddd')
    setDayName(dayN)

    const { dispatch } = props
    dispatch(setSlotDiaryData(date))
  }

  const setCalendarVisible = (value) => {
    setIsCalendarVisible(value)
  }

  const diaryData = (res, e, dispatch) => {
    for (var i = 0; i < res.length; i++) {
      if (res[i].slotId == e.id) {
        dispatch(setScheduledTasks(res[i]))
      }
    }
  }

  const formatDateAndTime = (date, time) => {
    return moment(date + time, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:ssZ')
  }

  const verifyDetail = (e) => {
    const { dispatch } = props
    diaryData(props.slotDiary, e, dispatch)

    const sortedAray = _.sortBy(slotsData, 'id')

    const date = selectedDate
    const startTime = formatDateAndTime(selectedDate, sortedAray && sortedAray[0].startTime)
    const endTime = formatDateAndTime(
      selectedDate,
      sortedAray && sortedAray[sortedAray.length - 1].endTime
    )

    setDisabled(false)

    dispatch(setSlotData(date, startTime, endTime, slots))
  }

  const showDetail = (e) => {
    slotsData.push(e)
    slots.push(e.id)
    isSelected.push(e.id)
    const tempAray = _.sortBy(slotsData, 'id')

    if (tempAray[1] == undefined) {
      verifyDetail(e)
    } else {
      for (var i = 0; i < tempAray.length - 1; i++) {
        if (tempAray[i].id != tempAray[i + 1].id - 1) {
          if (tempAray[i] == e) {
            Alert.alert(
              'Already selected',
              'Please clear current selection if you want to continue',
              [
                { text: 'OK' },
                {
                  text: 'Clear',
                  onPress: () => {
                    setSlotsData([]), setSlots([]), setIsSelected([])
                  },
                },
              ]
            )
            slotsData.pop(e)
            slots.pop(e.id)
            isSelected.pop(e.id)
          } else {
            Alert.alert(
              'Sorry',
              'You cannot skip a slot\nPlease clear current selection if you want to continue',
              [
                { text: 'OK' },
                {
                  text: 'Clear',
                  onPress: () => {
                    setSlotsData([]), setSlots([]), setIsSelected([])
                  },
                },
              ]
            )
            slotsData.pop(e)
            slots.pop(e.id)
            isSelected.pop(e.id)
          }
        } else {
          verifyDetail(e)
        }
      }
    }
  }

  const setShift = (e) => {
    const data = props.userShifts
    const array = []

    for (var i = 0; i < data.length; i++) {
      if (dayName == data[i].dayName && dayName == 'sunday') {
        array.push(data[i])
      }
      if (dayName == data[i].dayName && dayName == 'monday') {
        array.push(data[i])
      }
      if (dayName == data[i].dayName && dayName == 'tuesday') {
        array.push(data[i])
      }
      if (dayName == data[i].dayName && dayName == 'wednesday') {
        array.push(data[i])
      }
      if (dayName == data[i].dayName && dayName == 'thursday') {
        array.push(data[i])
      }
      if (dayName == data[i].dayName && dayName == 'friday') {
        array.push(data[i])
      }
      if (dayName == data[i].dayName && dayName == 'saturday') {
        array.push(data[i])
      }
    }

    if (array && array.length == 2) {
      const start = array[0].armsShift.startTime
      const end = array[1].armsShift.endTime

      if (e.startTime < start && e.endTime > end) return false
    } else if (array && array.length == 3) {
      const start = array[0].armsShift.startTime
      const end = array[2].armsShift.endTime

      if (e.startTime < start && e.endTime > end) return false
    } else {
      const start = array[0] && array[0].armsShift.startTime
      const end = array[0] && array[0].armsShift.endTime

      if (e.startTime < start && e.endTime > end) return false
    }
  }

  const setColor = (e) => {
    let color = slotsDiary.filter((diary) => diary.slotId == e.id)

    if (color[0] && color[0].diary) {
      if (color[0].diary.length > 1) {
        return color[0].diary.length
      } else {
        const str = color[0].diary[0].taskType.replace(/[_ ]+/g, '').toLowerCase()
        return str
      }
    }
  }

  return (
    <View style={styles.container}>
      <CalendarComponent
        showCalendar={isCalendarVisible}
        startDate={selectedDate}
        updateMonth={(value) => setSelectedDateData(value ? value.dateString : null, 'month')}
        updateDay={(value) => setSelectedDateData(value ? value.dateString : null, 'date')}
        selectedDate={selectedDate}
        onPress={() => setCalendarVisible(!isCalendarVisible)}
      />
      <View style={styles.topRow}>
        <DateControl
          selectedDate={selectedDate}
          setCalendarVisible={(value) => setCalendarVisible(value)}
          setSelectedDate={(value) => setSelectedDateData(value)}
          today={_today}
          tomorrow={_tomorrow}
          initialDayAfterTomorrow={_dayAfterTomorrow}
          loading={loading}
        />
        <FontAwesome
          name="calendar"
          size={25}
          color="#0f73ee"
          onPress={(value) => setCalendarVisible(value)}
        />
      </View>
      <ScrollView horizontal={true}>
        <ScrollView>
          <View style={styles.viewHourCol}>
            {hourArray.map((o, i) => {
              return (
                <View style={styles.hourCol} key={i}>
                  <Text style={styles.timeText}>{o}</Text>
                </View>
              )
            })}
          </View>
          {data &&
            rotateArray.map((o, i) => {
              return (
                <View style={styles.viewMinCol} key={i}>
                  <View style={styles.minCol}>
                    <Text style={styles.timeText}>{minArray[i]}</Text>
                  </View>
                  {o.map((e, i) => {
                    return (
                      <TouchableOpacity activeOpacity={0.1} onPress={() => showDetail(e)} key={i}>
                        <View
                          style={[
                            styles.hourRow,
                            {
                              backgroundColor:
                                setColor(e) == 'dailyupdate'
                                  ? '#dcf0ff'
                                  : setColor(e) == 'morningmeeting'
                                  ? '#dcf0ff'
                                  : setColor(e) == 'connect'
                                  ? '#deecd7'
                                  : setColor(e) == 'meeting'
                                  ? '#bedafb'
                                  : setColor(e) == 'meetingwithpp'
                                  ? '#bedafb'
                                  : setColor(e) == 'followup'
                                  ? '#fff1c5'
                                  : setColor(e) == 'closed'
                                  ? '#e6e6e6'
                                  : setShift(e) == false
                                  ? '#d6d6d6'
                                  : 'white',

                              opacity: isSelected.includes(e.id) ? 0.1 : 1,
                            },
                          ]}
                          key={i}
                        >
                          {typeof setColor(e) == 'number' && (
                            <View style={styles.taskLengthView}>
                              <Text style={{ color: 'black' }}>{`+${setColor(e)}`}</Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              )
            })}
        </ScrollView>
      </ScrollView>

      <View style={styles.buttonInputWrap}>
        <TouchableButton
          containerStyle={[styles.timePageBtn, { opacity: disabled ? 0.5 : 1 }]}
          containerBackgroundColor="white"
          textColor="#0f73ee"
          borderColor="#0f73ee"
          borderWidth={1}
          label="Show Details"
          disabled={disabled}
          onPress={() => props.navigation.navigate('ScheduledTasks')}
        />
        <TouchableButton
          containerStyle={[styles.timePageBtn, { opacity: disabled ? 0.5 : 1 }]}
          label="Done"
          borderColor="white"
          containerBackgroundColor="#0f73ee"
          borderWidth={1}
          disabled={disabled}
          onPress={() => props.navigation.goBack()}
        />
      </View>
    </View>
  )
}

mapStateToProps = (store) => {
  return {
    slotDiary: store.slotManagement.slotDiaryData,
    timeSlots: store.slotManagement.timeSlots,
    slotsData: store.slotManagement.slotsPayload,
    userShifts: store.slotManagement.userTimeShifts,
  }
}

export default connect(mapStateToProps)(TimeSlotManagement)
