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
import {
  setSlotDiaryData,
  setSlotData,
  setScheduledTasks,
  setDataSlotsArray,
  alltimeSlots,
} from '../../actions/slotManagement'
import moment from 'moment'
import _ from 'underscore'

function TimeSlotManagement(props) {
  const data = props.timeSlots
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(_today)
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [slots, setSlots] = useState(props.slotData ? props.slotData.slots : [])
  const [dayName, setDayName] = useState(moment(_today).format('dddd').toLowerCase())
  const [slotsData, setSlotsData] = useState(props.slotsDataArray ? props.slotsDataArray : [])
  const [slotsDiary, setSlotsDiary] = useState(props.slotDiary)
  const [isSelected, setIsSelected] = useState(props.slotData ? props.slotData.slots : [])

  const [tempDate, setTempDate] = useState(null)
  const [tempStartTime, setTempStartTime] = useState(null)
  const [tempEndTime, setTempEndTime] = useState(null)
  const [tempSlot, setTempSlot] = useState(null)

  const rotateArray = data && data[0].map((val, index) => data.map((row) => row[index]))

  const setSelectedDateData = (date, mode) => {
    setSelectedDate(date), setIsCalendarVisible(mode === 'month' ? isCalendarVisible : false)

    const dayN = moment(date).format('dddd').toLowerCase()
    setDayName(dayN)

    const { dispatch } = props
    dispatch(setSlotDiaryData(date))
  }

  const setCalendarVisible = (value) => {
    setIsCalendarVisible(value)
  }

  useEffect(() => {
    const { dispatch } = props
    if (props.slotData) {
      setDisabled(false)
    }
    // console.log(isTimeBetween('22:30:00', '3:00:00', '00:00:00'))

    if (props.slotData) {
      dispatch(alltimeSlots())
      const temp = props.slotData
      const start = moment(temp.startTime).format('H:mm:ss')
      const end = moment(temp.endTime).format('H:mm:ss')

      onEditSlots(start, end)
    }
  }, [])

  const onEditSlots = (start, end) => {
    const allSlots = props.allTimeSlot

    for (var i = 0; i < allSlots.length; i++) {
      if (isTimeBetween(start, end, allSlots[i].startTime)) {
        // console.log(allSlots[i].id)
        slotsData.push(allSlots[i])
        slots.push(allSlots[i].id)
        isSelected.push(allSlots[i].id)
      }
    }
  }

  const isTimeBetween = function (startTime, endTime, serverTime) {
    let start = moment(startTime, 'H:mm:ss')
    let end = moment(endTime, 'H:mm:ss')
    let server = moment(serverTime, 'H:mm:ss')
    if (end < start) {
      return (
        (server >= start && server <= moment('23:59:59', 'h:mm:ss')) ||
        (server >= moment('0:00:00', 'h:mm:ss') && server < end)
      )
    }
    return server >= start && server < end
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
    setTempDate(date)
    setTempEndTime(endTime)
    setTempStartTime(startTime)
    setTempSlot(slots)
  }

  const onDone = () => {
    const { dispatch, navigation } = props
    dispatch(setSlotData(tempDate, tempStartTime, tempEndTime, tempSlot))
    dispatch(setDataSlotsArray(slotsData))
    navigation.goBack()
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

  const fortyPercent = () => {
    const data = props.userShifts
    let array = []
    const slotsShift = slotsData
    const sSlots = slotsShift.length
    const slotFirst = slotsShift[0].startTime
    const slotEnd = slotsShift[slotsShift.length - 1].endTime

    for (var i = 0; i < data.length; i++) {
      if (dayName == data[i].dayName) {
        array.push(data[i])
      }
    }

    if (array && array.length == 1) {
      const startFirst = array[0].armsShift.startTime
      const endFirst = array[0].armsShift.endTime
      const shiftFirst = array[0].armsShift.name.toLowerCase()
      if (slotFirst > startFirst && slotEnd < endFirst) {
        shiftsInFirst(sSlots, shiftFirst)
      }
    }

    if (array && array.length == 2) {
      const startFirst = array[0].armsShift.startTime
      const endFirst = array[0].armsShift.endTime
      const startSecond = array[1].armsShift.startTime
      const endSecond = array[1].armsShift.endTime
      const shiftFirst = array[0].armsShift.name.toLowerCase()
      const shiftSecond = array[1].armsShift.name.toLowerCase()

      if (slotFirst > startFirst && slotEnd < endFirst) {
        shiftsInFirst(sSlots, shiftFirst)
      } else if (slotFirst > startSecond && slotEnd < endSecond) {
        shiftsInSecond(sSlots, shiftSecond)
      }
    }

    if (array && array.length == 3) {
      const startFirst = array[0].armsShift.startTime
      const endFirst = array[0].armsShift.endTime
      const startSecond = array[1].armsShift.startTime
      const endSecond = array[1].armsShift.endTime
      const startThird = array[1].armsShift.startTime
      const endThird = array[1].armsShift.endTime
      const shiftFirst = array[0].armsShift.name.toLowerCase()
      const shiftSecond = array[1].armsShift.name.toLowerCase()
      const shiftThird = array[2].armsShift.name.toLowerCase()

      if (slotFirst > startFirst && slotEnd < endFirst) {
        shiftsInFirst(sSlots, shiftFirst)
      } else if (slotFirst > startSecond && slotEnd < endSecond) {
        shiftsInSecond(sSlots, shiftSecond)
      } else if (slotFirst > startThird && slotEnd < endThird) {
        shiftsInThird(sSlots, shiftThird)
      }
    }
  }

  const shiftsInFirst = (sSlots, shiftFirst) => {
    if (shiftFirst == 'evening') {
      const nSlots = 8 * 12
      const forSlots = nSlots * 0.4
      if (sSlots > forSlots) {
        Alert.alert('Excessive Selection', '', [
          { text: 'OK' },
          {
            text: 'Clear',
            onPress: () => {
              setSlotsData([]), setSlots([]), setIsSelected([])
            },
          },
        ])
      }
    }
    if (shiftFirst == 'morning') {
      const nSlots = 9 * 12
      const forSlots = nSlots * 0.4
      if (sSlots > forSlots) {
        Alert.alert('Excessive Selection', '', [
          { text: 'OK' },
          {
            text: 'Clear',
            onPress: () => {
              setSlotsData([]), setSlots([]), setIsSelected([])
            },
          },
        ])
      }
    }
    if (shiftFirst == 'night') {
      const nSlots = 7 * 12
      const forSlots = nSlots * 0.4
      if (sSlots > forSlots) {
        Alert.alert('Excessive Selection', '', [
          { text: 'OK' },
          {
            text: 'Clear',
            onPress: () => {
              setSlotsData([]), setSlots([]), setIsSelected([])
            },
          },
        ])
      }
    }
  }

  const shiftsInSecond = (sSlots, shiftSecond) => {
    if (shiftSecond == 'evening') {
      const nSlots = 8 * 12
      const forSlots = nSlots * 0.4
      if (sSlots > forSlots) {
        Alert.alert('Excessive Selection', '', [
          { text: 'OK' },
          {
            text: 'Clear',
            onPress: () => {
              setSlotsData([]), setSlots([]), setIsSelected([])
            },
          },
        ])
      }
    }
    if (shiftSecond == 'morning') {
      const nSlots = 9 * 12
      const forSlots = nSlots * 0.4
      if (sSlots > forSlots) {
        Alert.alert('Excessive Selection', '', [
          { text: 'OK' },
          {
            text: 'Clear',
            onPress: () => {
              setSlotsData([]), setSlots([]), setIsSelected([])
            },
          },
        ])
      }
    }
    if (shiftSecond == 'night') {
      const nSlots = 7 * 12
      const forSlots = nSlots * 0.4
      if (sSlots > forSlots) {
        Alert.alert('Excessive Selection', '', [
          { text: 'OK' },
          {
            text: 'Clear',
            onPress: () => {
              setSlotsData([]), setSlots([]), setIsSelected([])
            },
          },
        ])
      }
    }
  }

  const shiftsInThird = (sSlots, shiftThird) => {
    if (shiftThird == 'evening') {
      const nSlots = 8 * 12
      const forSlots = nSlots * 0.4
      if (sSlots > forSlots) {
        Alert.alert('Excessive Selection', '', [
          { text: 'OK' },
          {
            text: 'Clear',
            onPress: () => {
              setSlotsData([]), setSlots([]), setIsSelected([])
            },
          },
        ])
      }
    }
    if (shiftThird == 'morning') {
      const nSlots = 9 * 12
      const forSlots = nSlots * 0.4
      if (sSlots > forSlots) {
        Alert.alert('Excessive Selection', '', [
          { text: 'OK' },
          {
            text: 'Clear',
            onPress: () => {
              setSlotsData([]), setSlots([]), setIsSelected([])
            },
          },
        ])
      }
    }
    if (shiftThird == 'night') {
      const nSlots = 7 * 12
      const forSlots = nSlots * 0.4
      if (sSlots > forSlots) {
        Alert.alert('Excessive Selection', '', [
          { text: 'OK' },
          {
            text: 'Clear',
            onPress: () => {
              setSlotsData([]), setSlots([]), setIsSelected([])
            },
          },
        ])
      }
    }
  }

  const setShift = (e) => {
    const data = props.userShifts
    let array = []

    for (var i = 0; i < data.length; i++) {
      if (dayName == data[i].dayName) {
        array.push(data[i])
      }
    }

    if (array && array.length == 2) {
      const start = array[0].armsShift.startTime
      const end = array[1].armsShift.endTime

      if (isTimeBetween(start, end, e.startTime)) return true
      else return false
    } else if (array && array.length == 3) {
      const start = array[0].armsShift.startTime
      const end = array[2].armsShift.endTime

      if (isTimeBetween(start, end, e.startTime)) return true
      else return false
    } else if (array && array.length == 1) {
      const start = array[0].armsShift.startTime
      const end = array[0].armsShift.endTime

      if (isTimeBetween(start, end, e.startTime)) return true
      else return false
    } else {
      return false
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
                                  ? '#f1f1f1'
                                  : 'white',

                              borderColor: isSelected.includes(e.id) ? 'black' : 'grey',
                              borderWidth: isSelected.includes(e.id) ? 1.5 : 0.6,
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
          onPress={() => onDone()}
        />
      </View>
    </View>
  )
}

mapStateToProps = (store) => {
  return {
    slotDiary: store.slotManagement.slotDiaryData,
    timeSlots: store.slotManagement.timeSlots,
    slotData: store.slotManagement.slotsPayload,
    userShifts: store.slotManagement.userTimeShifts,
    slotsDataArray: store.slotManagement.slotsDataPayload,
    allTimeSlot: store.slotManagement.allTimeSlots,
  }
}

export default connect(mapStateToProps)(TimeSlotManagement)
