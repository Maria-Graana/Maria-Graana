/** @format */

import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableHighlight, View } from 'react-native'

import styles from './style'
import TouchableButton from '../../components/TouchableButton'
import DateControl from '../../components/DateControl'
import CalendarComponent from '../../components/CalendarComponent'
import { minArray, hourArray, _format, _dayAfterTomorrow, _today, _tomorrow } from './constants'

export default function TimeSlotManagement({ navigation }) {
  const [data, setData] = useState(null)
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(_today)
  const [loading, setLoading] = useState(true)

  const setSelectedDateData = (date, mode) => {
    setSelectedDate(date), setIsCalendarVisible(mode === 'month' ? isCalendarVisible : false)
    setLoading(true)

    // this.getDiaries()
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
        x[i][j] = res[r].id
      }
    }

    setData(x)
  }

  useEffect(() => {
    navigation.setOptions({ title: 'SLOT MANAGEMENT' })
    let url = 'api/slotManagement/slot'
    axios
      .get(`${url}`)
      .then((res) => dataSlots(res.data))
      .catch((err) => console.log(err))
  }, [])

  const rotateArray = data && data[0].map((val, index) => data.map((row) => row[index]))

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
      <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
        <DateControl
          selectedDate={selectedDate}
          setCalendarVisible={(value) => setCalendarVisible(value)}
          setSelectedDate={(value) => setSelectedDateData(value)}
          today={_today}
          tomorrow={_tomorrow}
          initialDayAfterTomorrow={_dayAfterTomorrow}
          loading={loading}
        />
      </View>
      <ScrollView horizontal={true}>
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',

              padding: 10,
              paddingLeft: 60,
            }}
          >
            {hourArray.map((o, i) => {
              return (
                <View
                  style={{ padding: 5, alignItems: 'center', justifyContent: 'center' }}
                  key={i}
                >
                  <Text>{o}</Text>
                </View>
              )
            })}
          </View>
          {data &&
            rotateArray.map((o, i) => {
              return (
                <View style={{ flexDirection: 'row' }} key={i}>
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ padding: 10 }}>{minArray[i]}</Text>
                  </View>
                  {o.map((e, i) => {
                    return (
                      <TouchableHighlight
                        activeOpacity={0.1}
                        underlayColor="grey"
                        onPress={() => console.log(e)}
                      >
                        <View
                          style={{
                            flex: 1,
                            padding: 30,
                            backgroundColor: 'white',
                            borderWidth: 0.5,
                            borderColor: 'black',
                          }}
                          key={i}
                        >
                          {/* <Text>{e}</Text> */}
                        </View>
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
          // onPress={() => formSubmit()}
          // loading={imageLoading || loading}
        />
        <TouchableButton
          containerStyle={styles.timePageBtn}
          label="Done"
          borderColor="white"
          containerBackgroundColor="#0f73ee"
          borderWidth={1}
          // onPress={() => formSubmit()}
          // loading={imageLoading || loading}
        />
      </View>
    </View>
  )
}
