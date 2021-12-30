/** @format */

import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
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
  clearScheduledTasks,
  clearSlotDiaryData,
} from '../../actions/slotManagement'
import moment from 'moment'
import _ from 'underscore'
import { saveOrUpdateDiaryTask } from '../../actions/diary'
import helper from '../../helper'

function TimeSlotManagement(props) {
  const data = props.timeSlots
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(
    props.route.params.date ? props.route.params.date : _today
  )
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [check, setCheck] = useState(false)
  const [slots, setSlots] = useState(props.slotData ? props.slotData.slots : [])
  const [dayName, setDayName] = useState(
    moment(props.route.params.date ? props.route.params.date : _today)
      .format('dddd')
      .toLowerCase()
  )
  const [slotsData, setSlotsData] = useState(props.slotsDataArray ? props.slotsDataArray : [])
  const [slotsDiary, setSlotsDiary] = useState(props.slotDiary ? props.slotDiary : [])
  const [isSelected, setIsSelected] = useState(props.slotData ? props.slotData.slots : [])

  const [tempDate, setTempDate] = useState(null)
  const [tempStartTime, setTempStartTime] = useState(null)
  const [tempEndTime, setTempEndTime] = useState(null)
  const [tempSlot, setTempSlot] = useState(null)
  const [sSlots, setSSlots] = useState([])

  const [startDate, setStartDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  const rotateArray = data && data[0].map((val, index) => data.map((row) => row[index]))

  const setSelectedDateData = (date, mode) => {
    const { dispatch } = props
    dispatch(clearSlotDiaryData())
    setSelectedDate(date), setIsCalendarVisible(mode === 'month' ? isCalendarVisible : false)

    const dayN = moment(date).format('dddd').toLowerCase()
    setDayName(dayN)

    dispatch(setSlotDiaryData(date))
  }

  const setCalendarVisible = (value) => {
    setIsCalendarVisible(value)
  }

  useEffect(() => {
    const { dispatch, route } = props
    //console.log(route.params)

    dispatch(setSlotDiaryData(selectedDate))

    if (props.slotData) {
      setDisabled(false)
    }

    if (props.slotData) {
      const temp = props.slotData
      const start = moment(temp.startTime).format('H:mm:ss')
      const end = moment(temp.endTime).format('H:mm:ss')

      onEditSlots(start, end)
    }
  }, [selectedDate, dayName])

  const onEditSlots = (start, end) => {
    const allSlots = props.allTimeSlot

    for (var i = 0; i < allSlots.length; i++) {
      if (isTimeBetween(start, end, allSlots[i].startTime)) {
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
    dispatch(clearScheduledTasks())
    for (var i = 0; i < res.length; i++) {
      if (res[i].slotId == e.id) {
        dispatch(setScheduledTasks(res[i]))
      }
    }
  }

  const formatDateAndTime = (date, time) => {
    return moment(date + time, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:ssZ')
  }

  const formatDT = (date, time) => {
    return moment(date + time, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:ss')
  }

  const compareTime = (timeStart, timeLast) => {
    if (timeLast < timeStart) {
      return true
    } else return false
  }

  const verifyDetail = (e) => {
    const { dispatch } = props
    if (props.slotDiary == null) {
      diaryData([], e, dispatch)
    } else {
      diaryData(props.slotDiary, e, dispatch)
    }

    const sortedAray = _.sortBy(slotsData, 'id')

    const _format = 'YYYY-MM-DD'
    const date = selectedDate
    const nextDate = moment(selectedDate, _format).add(1, 'days').format(_format)
    const startTime = formatDateAndTime(selectedDate, sortedAray && sortedAray[0].startTime)
    const endTime = formatDateAndTime(
      compareTime(sortedAray[0].startTime, sortedAray[sortedAray.length - 1].endTime)
        ? nextDate
        : selectedDate,
      sortedAray && sortedAray[sortedAray.length - 1].endTime
    )

    const sDate = formatDT(selectedDate, sortedAray && sortedAray[0].startTime)
    const eDate = formatDT(
      compareTime(sortedAray[0].startTime, sortedAray[sortedAray.length - 1].endTime)
        ? nextDate
        : selectedDate,
      sortedAray && sortedAray[sortedAray.length - 1].endTime
    )

    setCheck(true)
    setDisabled(false)
    setTempDate(date)
    setTempEndTime(endTime)
    setTempStartTime(startTime)
    setTempSlot(slots)
    setStartDate(sDate)
    setToDate(eDate)
  }

  const onDone = () => {
    const { dispatch, navigation, route } = props
    const { data = null, isFromConnectFlow = false } = route.params
    if (data && isFromConnectFlow) {
      let copyData = Object.assign({}, data)
      copyData.date = tempStartTime
      copyData.time = tempStartTime
      copyData.diaryTime = tempStartTime
      copyData.start = tempStartTime
      copyData.end = tempEndTime
      copyData.slots = tempSlot
      //console.log(copyData)
      saveOrUpdateDiaryTask(copyData).then((response) => {
        if (response) {
          helper.successToast('TASK ADDED SUCCESSFULLY!')
          navigation.goBack()
        } else {
          helper.errorToast('SOMETHING WENT WRONG!')
        }
      })
    } else {
      dispatch(setSlotData(tempDate, tempStartTime, tempEndTime, tempSlot))
      dispatch(setDataSlotsArray(slotsData))
      navigation.goBack()
    }
  }

  const showDetailNew = (e) => {
    const tempAray = slotsData.length != 0 ? _.sortBy(slotsData, 'id') : []
    if (slotsData.length == 0) {
      slotsData.push(e)
      slots.push(e.id)
      isSelected.push(e.id)
      fortyPercent(e)
      verifyDetail(e)
    } else {
      if (e.id == tempAray[0].id - 1 || e.id == tempAray[tempAray.length - 1].id + 1) {
        slotsData.push(e)
        slots.push(e.id)
        isSelected.push(e.id)
        fortyPercent(e)
        verifyDetail(e)
      } else if (_.contains(tempAray, e)) {
      } else {
        Alert.alert(
          'Sorry',
          'You cannot skip a slot\nPlease clear current selection if you want to continue',
          [
            { text: 'OK' },
            {
              text: 'Clear',
              onPress: () => {
                setSlotsData([]), setSlots([]), setIsSelected([]), setSSlots([])
              },
            },
          ]
        )
      }
    }
  }

  const showDetail = (e) => {
    slotsData.push(e)
    slots.push(e.id)
    isSelected.push(e.id)
    const tempAray = _.sortBy(slotsData, 'id')

    fortyPercent(e)

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
                    setSlotsData([]), setSlots([]), setIsSelected([]), setSSlots([])
                  },
                },
              ]
            )
            slotsData.pop(e)
            slots.pop(e.id)
            isSelected.pop(e.id)
            sSlots.pop(e)
          } else {
            Alert.alert(
              'Sorry',
              'You cannot skip a slot\nPlease clear current selection if you want to continue',
              [
                { text: 'OK' },
                {
                  text: 'Clear',
                  onPress: () => {
                    setSlotsData([]), setSlots([]), setIsSelected([]), setSSlots([])
                  },
                },
              ]
            )
            slotsData.pop(e)
            slots.pop(e.id)
            isSelected.pop(e.id)
            sSlots.pop(e)
          }
        } else {
          verifyDetail(e)
        }
      }
    }
  }

  const fortyPercent = (e) => {
    const data = props.userShifts
    let array = []
    const slotsShift = _.sortBy(slotsData, 'id')
    const slotFirst = slotsShift[0].startTime
    const slotEnd = slotsShift[slotsShift.length - 1].endTime
    const currentTime = moment().format('H:mm:ss')
    const tempCurrent = currentTime.split(':')
    const currentMin = parseInt(tempCurrent[0]) * 60 + parseInt(tempCurrent[1])

    for (var i = 0; i < data.length; i++) {
      if (dayName == data[i].dayName) {
        array.push(data[i])
      }
    }

    if (array.length > 0) {
      if (array && array[0].armsShift && array.length == 1) {
        const startFirst = array[0].armsShift.startTime
        const endFirst = array[0].armsShift.endTime
        const tempSFirst = startFirst.split(':')
        const tempEFirst = endFirst.split(':')
        const startMin = parseInt(tempSFirst[0]) * 60 + parseInt(tempSFirst[1])
        const endMin = parseInt(tempEFirst[0]) * 60 + parseInt(tempEFirst[1])

        const shiftFirst = array[0].armsShift.name.toLowerCase()

        if (isTimeBetween(startFirst, endFirst, currentTime)) {
          if (e.startTime >= currentTime && e.startTime < endFirst) {
            sSlots.push(e)
            if (endMin < startMin) {
              const p = 1440 - (endMin + startMin)
              const x = currentMin - startMin
              const r = (p - x) / 5
              shiftsSlotsEval(sSlots.length, shiftFirst, e, r)
            } else {
              const p = endMin - startMin
              const x = currentMin - startMin
              const r = (p - x) / 5
              shiftsSlotsEval(sSlots.length, shiftFirst, e, r)
            }
          }
        } else {
          if (slotFirst >= startFirst && slotEnd <= endFirst) {
            sSlots.push(e)
            shiftsSlotsEval(sSlots.length, shiftFirst, e)
          }
        }
      }

      if (array && array[0].armsShift && array.length == 2) {
        const startFirst = array[0].armsShift.startTime
        const endFirst = array[0].armsShift.endTime
        const tempSFirst = startFirst.split(':')
        const tempEFirst = endFirst.split(':')
        const startMin = parseInt(tempSFirst[0]) * 60 + parseInt(tempSFirst[1])
        const endMin = parseInt(tempEFirst[0]) * 60 + parseInt(tempEFirst[1])

        const startSecond = array[1].armsShift.startTime
        const endSecond = array[1].armsShift.endTime
        const tempSSecond = startSecond.split(':')
        const tempESecond = endSecond.split(':')
        const startMinS = parseInt(tempSSecond[0]) * 60 + parseInt(tempSSecond[1])
        const endMinS = parseInt(tempESecond[0]) * 60 + parseInt(tempESecond[1])

        const shiftFirst = array[0].armsShift.name.toLowerCase()
        const shiftSecond = array[1].armsShift.name.toLowerCase()

        if (isTimeBetween(startFirst, endFirst, currentTime)) {
          if (e.startTime >= currentTime && e.startTime < endFirst) {
            sSlots.push(e)
            if (endMin < startMin) {
              const p = 1440 - (endMin + startMin)
              const x = currentMin - startMin
              const r = (p - x) / 5
              shiftsSlotsEval(sSlots.length, shiftFirst, e, r)
            } else {
              const p = endMin - startMin
              const x = currentMin - startMin
              const r = (p - x) / 5
              shiftsSlotsEval(sSlots.length, shiftFirst, e, r)
            }
          }
        } else if (isTimeBetween(startSecond, endSecond, currentTime)) {
          if (e.startTime >= currentTime && e.startTime < endSecond) {
            sSlots.push(e)
            if (endMinS < startMinS) {
              const p = 1440 - (endMinS + startMinS)
              const x = currentMin - startMinS
              const r = (p - x) / 5
              shiftsSlotsEval(sSlots.length, shiftSecond, e, r)
            } else {
              const p = endMinS - startMinS
              const x = currentMin - startMinS
              const r = (p - x) / 5
              shiftsSlotsEval(sSlots.length, shiftSecond, e, r)
            }
          }
        } else {
          if (slotFirst >= startFirst && slotEnd <= endFirst) {
            sSlots.push(e)
            shiftsSlotsEval(sSlots, shiftFirst, e)
          } else if (slotFirst >= startSecond && slotEnd <= endSecond) {
            sSlots.push(e)
            shiftsSlotsEval(sSlots, shiftSecond, e)
          }
        }
      }

      if (array && array[0].armsShift && array.length == 3) {
        const startFirst = array[0].armsShift.startTime
        const endFirst = array[0].armsShift.endTime
        const tempSFirst = startFirst.split(':')
        const tempEFirst = endFirst.split(':')
        const startMin = parseInt(tempSFirst[0]) * 60 + parseInt(tempSFirst[1])
        const endMin = parseInt(tempEFirst[0]) * 60 + parseInt(tempEFirst[1])

        const startSecond = array[1].armsShift.startTime
        const endSecond = array[1].armsShift.endTime
        const tempSSecond = startSecond.split(':')
        const tempESecond = endSecond.split(':')
        const startMinS = parseInt(tempSSecond[0]) * 60 + parseInt(tempSSecond[1])
        const endMinS = parseInt(tempESecond[0]) * 60 + parseInt(tempESecond[1])

        const startThird = array[2].armsShift.startTime
        const endThird = array[2].armsShift.endTime
        const tempSThird = startThird.split(':')
        const tempEThird = endThird.split(':')
        const startMinT = parseInt(tempSThird[0]) * 60 + parseInt(tempSThird[1])
        const endMinT = parseInt(tempEThird[0]) * 60 + parseInt(tempEThird[1])

        const shiftFirst = array[0].armsShift.name.toLowerCase()
        const shiftSecond = array[1].armsShift.name.toLowerCase()
        const shiftThird = array[2].armsShift.name.toLowerCase()

        if (isTimeBetween(startFirst, endFirst, currentTime)) {
          if (e.startTime >= currentTime && e.startTime < endFirst) {
            sSlots.push(e)
            if (endMin < startMin) {
              const p = 1440 - (endMin + startMin)
              const x = currentMin - startMin
              const r = (p - x) / 5
              shiftsSlotsEval(sSlots.length, shiftFirst, e, r)
            } else {
              const p = endMin - startMin
              const x = currentMin - startMin
              const r = (p - x) / 5
              shiftsSlotsEval(sSlots.length, shiftFirst, e, r)
            }
          }
        } else if (isTimeBetween(startSecond, endSecond, currentTime)) {
          if (e.startTime >= currentTime && e.startTime < endSecond) {
            sSlots.push(e)
            if (endMinS < startMinS) {
              const p = 1440 - (endMinS + startMinS)
              const x = currentMin - startMinS
              const r = (p - x) / 5
              shiftsSlotsEval(sSlots.length, shiftSecond, e, r)
            } else {
              const p = endMinS - startMinS
              const x = currentMin - startMinS
              const r = (p - x) / 5
              shiftsSlotsEval(sSlots.length, shiftSecond, e, r)
            }
          }
        } else if (isTimeBetween(startThird, endThird, currentTime)) {
          if (e.startTime >= currentTime && e.startTime < endThird) {
            sSlots.push(e)
            if (endMinT < startMinT) {
              const p = 1440 - (endMinT + startMinT)
              const x = currentMin - startMinT
              const r = (p - x) / 5
              shiftsSlotsEval(sSlots.length, shiftThird, e, r)
            } else {
              const p = endMinT - startMinT
              const x = currentMin - startMinT
              const r = (p - x) / 5
              shiftsSlotsEval(sSlots.length, shiftThird, e, r)
            }
          }
        } else {
          if (slotFirst >= startFirst && slotEnd <= endFirst) {
            sSlots.push(e)
            shiftsSlotsEval(sSlots, shiftFirst, e)
          } else if (slotFirst >= startSecond && slotEnd <= endSecond) {
            sSlots.push(e)
            shiftsSlotsEval(sSlots, shiftSecond, e)
          } else if (slotFirst >= startThird && slotEnd <= endThird) {
            sSlots.push(e)
            shiftsSlotsEval(sSlots, shiftThird, e)
          }
        }
      }
    }
  }

  const shiftsSlotsEval = (sSlotsLen, shift, e, r) => {
    if (shift == 'evening') {
      const nSlots = r ? r : 8 * 12
      const forSlots = nSlots * 0.6
      if (sSlotsLen > forSlots) {
        Alert.alert('Excessive Selection', '', [
          { text: 'OK' },
          {
            text: 'Clear',
            onPress: () => {
              setSlotsData([]), setSlots([]), setIsSelected([]), setSSlots([])
            },
          },
        ])
        slotsData.pop(e)
        slots.pop(e.id)
        isSelected.pop(e.id)
        sSlots.pop(e)
      }
    }
    if (shift == 'morning') {
      const nSlots = r ? r : 9 * 12
      const forSlots = nSlots * 0.6
      if (sSlotsLen > forSlots) {
        Alert.alert('Excessive Selection', '', [
          { text: 'OK' },
          {
            text: 'Clear',
            onPress: () => {
              setSlotsData([]), setSlots([]), setIsSelected([]), setSSlots([])
            },
          },
        ])
        slotsData.pop(e)
        slots.pop(e.id)
        isSelected.pop(e.id)
        sSlots.pop(e)
      }
    }
    if (shift == 'night') {
      const nSlots = r ? r : 7 * 12
      const forSlots = nSlots * 0.6
      if (sSlotsLen > forSlots) {
        Alert.alert('Excessive Selection', '', [
          { text: 'OK' },
          {
            text: 'Clear',
            onPress: () => {
              setSlotsData([]), setSlots([]), setIsSelected([]), setSSlots([])
            },
          },
        ])
        slotsData.pop(e)
        slots.pop(e.id)
        isSelected.pop(e.id)
        sSlots.pop(e)
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

    if (array.length > 0) {
      if (array && array[0].armsShift && array.length == 2) {
        const start = array[0].armsShift.startTime
        const end = array[1].armsShift.endTime

        if (isTimeBetween(start, end, e.startTime)) return true
        else return false
      } else if (array && array[0].armsShift && array.length == 3) {
        const start = array[0].armsShift.startTime
        const end = array[2].armsShift.endTime

        if (isTimeBetween(start, end, e.startTime)) return true
        else return false
      } else if (array && array[0].armsShift && array.length == 1) {
        const start = array[0].armsShift.startTime
        const end = array[0].armsShift.endTime

        if (isTimeBetween(start, end, e.startTime)) return true
        else return false
      } else {
        return false
      }
    }
  }

  const setColor = (e) => {
    let color = props.slotDiary && props.slotDiary.filter((diary) => diary.slotId == e.id)
    if (props.slotDiary == null) {
      return null
    } else {
      if (color[0] && color[0].diary) {
        if (color[0].diary.length > 1) {
          return color[0].diary.length
        } else {
          const str = color[0].diary[0].taskType.replace(/[_ ]+/g, '').toLowerCase()
          return str
        }
      }
    }
  }

  const setSelectedColor = () => {
    const { route } = props
    const task = route.params.taskType.replace(/[_ ]+/g, '').toLowerCase()
    if (task == 'dailyupdate' || task == 'morningmeeting' || task == 'meetingwithpp') {
      return '#dcf0ff'
    } else if (task == 'followup') {
      return '#fff1c5'
    } else if (task == 'connect') {
      return '#deecd7'
    } else if (task == 'closed') {
      return '#e6e6e6'
    } else if (task === 'meeting' || task === 'viewing') {
      return '#99c5fa'
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
                      <TouchableOpacity
                        activeOpacity={0.1}
                        onPress={() => showDetailNew(e)}
                        key={i}
                      >
                        <View
                          style={[
                            styles.hourRow,
                            {
                              backgroundColor: isSelected.includes(e.id)
                                ? setSelectedColor()
                                : setColor(e) == 'dailyupdate'
                                ? '#dcf0ff'
                                : setColor(e) == 'morningmeeting'
                                ? '#dcf0ff'
                                : setColor(e) == 'connect'
                                ? '#deecd7'
                                : setColor(e) == 'meeting'
                                ? '#99c5fa'
                                : setColor(e) == 'viewing'
                                ? '#99c5fa'
                                : setColor(e) == 'meetingwithpp'
                                ? '#dcf0ff'
                                : setColor(e) == 'followup'
                                ? '#fff1c5'
                                : setColor(e) == 'closed'
                                ? '#e6e6e6'
                                : setShift(e) == false
                                ? '#f1f1f1'
                                : 'white',

                              borderColor: isSelected.includes(e.id) ? 'black' : 'grey',
                              borderWidth: isSelected.includes(e.id) ? 1.6 : 0.6,
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
          onPress={() =>
            props.navigation.navigate('ScheduledTasks', {
              fromDate: startDate,
              toDate: toDate,
            })
          }
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
