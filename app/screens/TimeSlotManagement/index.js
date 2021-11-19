/** @format */

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableHighlight, View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

import styles from './style'
import TouchableButton from '../../components/TouchableButton'
import DateControl from '../../components/DateControl'
import CalendarComponent from '../../components/CalendarComponent'
import { minArray, hourArray, _format, _dayAfterTomorrow, _today, _tomorrow } from './constants'
import { connect } from 'react-redux'
import { setSlotDiaryData } from '../../actions/slotManagement'

function TimeSlotManagement(props) {
  const [data, setData] = useState(null)
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(_today)
  const [loading, setLoading] = useState(true)
  const [disabled, setDisabled] = useState(true)
  const [diary, setDiary] = useState(null)

  const rotateArray = data && data[0].map((val, index) => data.map((row) => row[index]))

  const setSelectedDateData = (date, mode) => {
    setSelectedDate(date), setIsCalendarVisible(mode === 'month' ? isCalendarVisible : false)
    setLoading(true)

    const { dispatch } = props
    dispatch(setSlotDiaryData(date))
  }

  const setCalendarVisible = (value) => {
    setIsCalendarVisible(value)
  }

  const dataSlots = (res) => {
    var x = new Array(24)
    for (var i = 0; i < 24; i++) {
      x[i] = new Array(11)
    }
    addData(res, x)
  }

  const addData = (res, x) => {
    var r = 0
    for (var i = 0; i < x.length; i++) {
      for (var j = 0; j < x[i].length; j++, r++) {
        x[i][j] = res[r]
      }
    }
    setData(x)
  }

  const diaryData = (res, e) => {
    for (var i = 0; i < res.length; i++) {
      if (res[i].slotId == e.id) {
        setDiary(res[i])
      }
    }
  }

  const showDetail = (e) => {
    const { dispatch } = props
    dispatch(setSlotDiaryData(selectedDate))

    setDisabled(false)

    diaryData(props.slotDiary, e)
  }

  useEffect(() => {
    let url = 'api/slotManagement/slot'
    axios
      .get(`${url}`)
      .then((res) => dataSlots(res.data))
      .catch((err) => console.log(err))
  }, [])

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
          containerStyle={styles.timePageBtn}
          containerBackgroundColor="white"
          textColor="#0f73ee"
          borderColor="#0f73ee"
          borderWidth={1}
          label="Show Details"
          disabled={disabled}
          onPress={() =>
            props.navigation.navigate('ScheduledTasks', {
              diary: diary,
            })
          }
          // loading={imageLoading || loading}
        />
        <TouchableButton
          containerStyle={styles.timePageBtn}
          label="Done"
          borderColor="white"
          containerBackgroundColor="#0f73ee"
          borderWidth={1}
          disabled={disabled}
          // onPress={() => formSubmit()}
          // loading={imageLoading || loading}
        />
      </View>
    </View>
  )
}

mapStateToProps = (store) => {
  return {
    slotDiary: store.slotManagement.slotDiaryData,
  }
}

export default connect(mapStateToProps)(TimeSlotManagement)
