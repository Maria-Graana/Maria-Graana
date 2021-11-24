/** @format */

import React, { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableHighlight, View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

import styles from './style'
import TouchableButton from '../../components/TouchableButton'
import DateControl from '../../components/DateControl'
import CalendarComponent from '../../components/CalendarComponent'
import { minArray, hourArray, _format, _dayAfterTomorrow, _today, _tomorrow } from './constants'
import { connect } from 'react-redux'
import { setSlotDiaryData, setSlotData, setScheduledTasks } from '../../actions/slotManagement'
import moment from 'moment'

function TimeSlotManagement(props) {
  const data = props.timeSlots
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(_today)
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [slots, setSlots] = useState([])
  const [dayName, setDayName] = useState(moment(_today).format('dddd'))

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

  const showDetail = (e) => {
    const { dispatch } = props
    dispatch(setSlotDiaryData(selectedDate))

    const date = selectedDate
    const startTime = formatDateAndTime(selectedDate, e.startTime)
    const endTime = formatDateAndTime(selectedDate, e.endTime)

    if (slots.includes(e.id)) {
      slots.pop(e.id)
    } else {
      slots.push(e.id)
      diaryData(props.slotDiary, e, dispatch)
    }

    setDisabled(false)

    dispatch(setSlotData(date, startTime, endTime, slots))
  }

  // useEffect(() => {
  //   console.log(dayName)
  // }, [])

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
        <FontAwesome name="calendar" size={25} color="#0f73ee" />
      </View>
      <ScrollView horizontal={true}>
        <ScrollView>
          <View style={styles.viewHourCol}>
            {hourArray.map((o, i) => {
              return (
                <View style={styles.hourCol} key={i}>
                  <Text>{o}</Text>
                </View>
              )
            })}
          </View>
          {data &&
            rotateArray.map((o, i) => {
              return (
                <View style={styles.viewMinCol} key={i}>
                  <View style={styles.minCol}>
                    <Text>{minArray[i]}</Text>
                  </View>
                  {o.map((e, i) => {
                    return (
                      <TouchableHighlight
                        activeOpacity={0.1}
                        underlayColor="grey"
                        onPress={() => showDetail(e)}
                      >
                        <View style={styles.hourRow} key={i} />
                      </TouchableHighlight>
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
  }
}

export default connect(mapStateToProps)(TimeSlotManagement)
