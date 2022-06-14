/** @format */

import React, { useEffect, useRef, useState } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

import styles from './style'

import TimerNotification from '../../LocalNotifications'
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
import { clearDiaryFeedbacks, saveOrUpdateDiaryTask, setConnectFeedback } from '../../actions/diary'
import helper from '../../helper'
import diaryHelper from '../Diary/diaryHelper'
import axios from 'axios'
import TouchableInput from '../../components/TouchableInput'
import DateTimePicker from '../../components/DatePicker'

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
  const [tempSlot, setTempSlot] = useState([])
  const [sSlots, setSSlots] = useState([])

  const [timeStart, setTimeStart] = useState(null)
  const [timeEnd, setTimeEnd] = useState(null)

  const [startDate, setStartDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  const scrollViewFirst = useRef()
  const scrollViewSecond = useRef()
  const scrollHorizontal = useRef()

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
    const { dispatch, navigation, route } = props
    const { taskType } = route?.params
    if (taskType) {
      navigation.setOptions({
        title:
          taskType === 'morning_meeting' ||
          taskType === 'meeting_with_pp' ||
          taskType === 'daily_update'
            ? 'Book Time Slot'
            : `Select Slot for ${diaryHelper.showTaskType(taskType)} Task`,
      })
    }
  }, [])

  useEffect(() => {
    const { dispatch, route } = props

    dispatch(setSlotDiaryData(selectedDate))

    if (props.slotData) {
      setDisabled(false)
    }

    if (props.slotData) {
      const temp = props.slotData
      const start = moment(temp.startTime).format('H:mm:ss')
      const end = moment(temp.endTime).format('H:mm:ss')

      checkSlotArea(start)
      onEditSlots(start, end)
    } else {
      checkShift()
    }
  }, [selectedDate, dayName])

  const checkSlotArea = (start) => {
    const min = start.split(':')
    // if (parseInt(min[1]) > 30) {
    //   scrollViewFirst.current.scrollTo({
    //     x: 0,
    //     y: 100,
    //     animated: false,
    //   })
    //   scrollViewSecond.current.scrollTo({
    //     x: 0,
    //     y: 100,
    //     animated: false,
    //   })
    // }
    scrollHorizontal.current.scrollTo({
      x: parseInt(min[0]) * 50,
      y: 0,
      animated: false,
    })
  }

  const checkShift = () => {
    const data = props.userShifts
    let array = []

    for (var i = 0; i < data.length; i++) {
      if (dayName == data[i].dayName) {
        array.push(data[i])
      }
    }

    var shiftArr = array.sort((first, sec) => {
      var a = first.armsShift.startTime.split(':')[0]
      var b = sec.armsShift.startTime.split(':')[0]
      return a - b
    })

    if (array.length > 0) {
      if (array && array[0].armsShift && array.length == 2) {
        const start = shiftArr[0].armsShift.startTime
        const xp = start.split(':')
        scrollHorizontal.current.scrollTo({
          x: parseInt(xp[0]) * 50,
          y: 0,
          animated: false,
        })
      } else if (array && array[0].armsShift && array.length == 3) {
        const start = shiftArr[0].armsShift.startTime
        const xp = start.split(':')
        scrollHorizontal.current.scrollTo({
          x: 9 * 50,
          y: 0,
          animated: false,
        })
      } else if (array && array[0].armsShift && array.length == 1) {
        const start = shiftArr[0].armsShift.startTime
        const xp = start.split(':')
        scrollHorizontal.current.scrollTo({
          x: parseInt(xp[0]) * 50,
          y: 0,
          animated: false,
        })
      }
    } else {
      scrollHorizontal.current.scrollTo({
        x: 9 * 50,
        y: 0,
        animated: false,
      })
    }
  }

  const onEditSlots = (start, end, fromPicker = false) => {
    const { dispatch } = props
    const allSlots = props.allTimeSlot
    let mySlotData = []
    let myslots = []
    let myisSelected = []

    for (var i = 0; i < allSlots.length; i++) {
      if (isTimeBetween(start, end, allSlots[i].startTime)) {
        mySlotData.push(allSlots[i])
        myslots.push(allSlots[i].id)
        myisSelected.push(allSlots[i].id)
      }
    }
    setSlotsData(mySlotData)
    setSlots(myslots)
    setIsSelected(myisSelected)

    // if (fromPicker) {
    //   setSlotsData(slotsData)
    //   setSlots(slots)
    //   setTempSlot(slots)
    //   setIsSelected(isSelected)
    //   setSSlots([])
    // }

    setStartDate(mySlotData[0].startTime)
    setToDate(mySlotData[mySlotData.length - 1].endTime)

    if (props.slotDiary == null) {
      diaryData([], slots, dispatch)
    } else {
      diaryData(props.slotDiary, slots, dispatch)
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
    let tasks = []
    for (var i = 0; i < res.length; i++) {
      for (var j = 0; j < e.length; j++) {
        if (res[i].slotId == e[j]) {
          tasks.push(res[i])
        }
      }
    }
    if (tasks.length) {
      dispatch(setScheduledTasks(tasks))
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

  const verifyDetail = (e, myslots, mySlotData, myisSelected) => {
    const { dispatch } = props
    if (props.slotDiary == null) {
      diaryData([], slots, dispatch)
    } else {
      diaryData(props.slotDiary, slots, dispatch)
    }

    setActualData(myslots, mySlotData, myisSelected)
  }

  const setActualData = (myslots, mySlotData, myisSelected) => {
    const { dispatch } = props
    const sortedAray = _.sortBy(mySlotData, 'startTime')

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

    setSlotsData(mySlotData)
    setSlots(myslots)
    setIsSelected(myisSelected)
    setCheck(true)
    setDisabled(false)
    setTempDate(date)
    setTempEndTime(endTime)
    setTempStartTime(startTime)
    setTempSlot(myslots)
    setStartDate(sDate)
    setToDate(eDate)
    setTimeEnd(endTime)
    setTimeStart(startTime)

    dispatch(setSlotData(date, startTime, endTime, myslots))
    dispatch(setDataSlotsArray(sortedAray))
  }

  const createViewing = (body) => {
    const { navigation } = props

    let copyData = {
      ...body,
    }

    delete copyData.customer

    axios
      .post(`/api/leads/viewing`, copyData)
      .then((res) => {
        if (res) {
          helper.successToast('TASK ADDED SUCCESSFULLY!')

          let start = new Date(body.start)
          let end = new Date(body.end)

          let notificationPayload
          if (body.taskCategory == 'leadTask') {
            notificationPayload = {
              clientName: body?.customer?.customerName,
              id: body.userId,
              title: diaryHelper.showTaskType(body?.taskType),
              body: moment(start).format('hh:mm A') + ' - ' + moment(end).format('hh:mm A'),
            }
          } else {
            notificationPayload = {
              id: body.userId,
              title: diaryHelper.showTaskType(body.taskType),
              body: moment(start).format('hh:mm A') + ' - ' + moment(end).format('hh:mm A'),
            }
          }

          //  TimerNotification(notificationPayload, start)

          navigation.goBack()
        } else {
          helper.errorToast('SOMETHING WENT WRONG!')
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const onDone = () => {
    // setActualData()
    const dataActual = []
    const _format = 'YYYY-MM-DD'
    const { dispatch, navigation, route, allTimeSlot } = props
    if (slots.length > 0) {
      for (var i = 0; i < slots.length; i++) {
        for (var j = 0; j < allTimeSlot.length; j++) {
          if (slots[i] == allTimeSlot[j].id) {
            dataActual.push(allTimeSlot[j])
          }
        }
      }
    }
    const sortedAray = _.sortBy(dataActual, 'startTime')
    const date = selectedDate
    const nextDate = moment(selectedDate, _format).add(1, 'days').format(_format)
    const startTime = formatDateAndTime(selectedDate, sortedAray && sortedAray[0].startTime)
    const endTime = formatDateAndTime(
      compareTime(sortedAray[0].startTime, sortedAray[sortedAray.length - 1].endTime)
        ? nextDate
        : selectedDate,
      sortedAray && sortedAray[sortedAray.length - 1].endTime
    )

    const {
      data = null,
      isFromConnectFlow = false,
      isBookViewing = false,
      isViewingDone = false,
    } = route.params
    if (data && isFromConnectFlow) {
      let copyData = Object.assign({}, data)
      copyData.date = startTime
      copyData.time = startTime
      copyData.diaryTime = startTime
      copyData.start = startTime
      copyData.end = endTime
      copyData.slots = tempSlot
      delete copyData.selectedLead
      if (isViewingDone) {
        saveOrUpdateDiaryTask(copyData).then((response) => {
          // viewing done case
          if (response) {
            helper.successToast('TASK ADDED SUCCESSFULLY!')

            let notificationData

            for (let i in response.data[1]) {
              notificationData = response.data[1][i]
            }

            let start = new Date(notificationData.start)
            let end = new Date(notificationData.end)

            let notificationPayload
            if (notificationData.taskCategory == 'leadTask') {
              notificationPayload = {
                clientName: `${data.selectedLead.customer.first_name} ${data.selectedLead.customer.last_name}`,
                id: notificationData.id,
                title: diaryHelper.showTaskType(notificationData?.taskType),
                body: moment(start).format('hh:mm A') + ' - ' + moment(end).format('hh:mm A'),
              }
            } else {
              notificationPayload = {
                id: notificationData.id,
                title: diaryHelper.showTaskType(notificationData.taskType),
                body: moment(start).format('hh:mm A') + ' - ' + moment(end).format('hh:mm A'),
              }
            }
            navigation.goBack()
          } else {
            helper.errorToast('SOMETHING WENT WRONG!')
          }
        })
      } else {
        saveOrUpdateDiaryTask(props.connectFeedback).then((res) => {
          // mark previous task as completed and then create the new task
          saveOrUpdateDiaryTask(copyData).then((response) => {
            if (response) {
              helper.successToast('TASK ADDED SUCCESSFULLY!')

              let notificationData

              for (let i in response.data[1]) {
                notificationData = response.data[1][i]
              }

              let start = new Date(notificationData.start)
              let end = new Date(notificationData.end)

              let notificationPayload
              if (notificationData.taskCategory == 'leadTask') {
                notificationPayload = {
                  clientName: `${data.selectedLead.customer.first_name} ${data.selectedLead.customer.last_name}`,
                  id: notificationData.id,
                  title: diaryHelper.showTaskType(notificationData?.taskType),
                  body: moment(start).format('hh:mm A') + ' - ' + moment(end).format('hh:mm A'),
                }
              } else {
                notificationPayload = {
                  id: notificationData.id,
                  title: diaryHelper.showTaskType(notificationData.taskType),
                  body: moment(start).format('hh:mm A') + ' - ' + moment(end).format('hh:mm A'),
                }
              }
              dispatch(setConnectFeedback({}))
              dispatch(clearDiaryFeedbacks())

              navigation.goBack()
            } else {
              helper.errorToast('SOMETHING WENT WRONG!')
            }
          })
        })
      }
    } else if (data && isBookViewing) {
      let copyData = Object.assign({}, data)
      copyData.date = startTime
      copyData.time = startTime
      copyData.diaryTime = startTime
      copyData.start = startTime
      copyData.end = endTime
      copyData.slots = tempSlot

      if (copyData && !copyData.id) createViewing(copyData)
    } else {
      if (sortedAray) {
        dispatch(setSlotData(date, startTime, endTime, slots))
        dispatch(setDataSlotsArray(sortedAray))
      }
      navigation.goBack()
    }
  }

  const showDetailNew = (e) => {
    const tempAray = slotsData.length != 0 ? _.sortBy(slotsData, 'id') : []
    let mySlotData = [...slotsData]
    let myslots = [...slots]
    let myisSelected = [...isSelected]
    if (slotsData.length == 0) {
      mySlotData.push(e)
      myslots.push(e.id)
      myisSelected.push(e.id)
      // fortyPercent(e)
      verifyDetail(e, myslots, mySlotData, myisSelected)
    } else {
      if (e.id == tempAray[0].id - 1 || e.id == tempAray[tempAray.length - 1].id + 1) {
        mySlotData.push(e)
        myslots.push(e.id)
        myisSelected.push(e.id)
        // fortyPercent(e)
        verifyDetail(e, myslots, mySlotData, myisSelected)
      } else if (_.contains(tempAray, e)) {
      } else {
        setSlotsData([e])
        setSlots([e.id])
        setTempSlot([e.id])
        setIsSelected([e.id])
        // setSSlots([])
        // fortyPercent(e)
        verifyDetail(e, [e.id], [e], [e.id])
      }
    }
  }

  const showDetail = (e) => {
    slotsData.push(e)
    slots.push(e.id)
    isSelected.push(e.id)
    const tempAray = _.sortBy(slotsData, 'id')

    // fortyPercent(e)

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

    var shiftArr = array.sort((first, sec) => {
      var a = first.armsShift.startTime.split(':')[0]
      var b = sec.armsShift.startTime.split(':')[0]
      return a - b
    })

    if (array.length > 0) {
      if (array && array[0].armsShift && array.length == 2) {
        const start = shiftArr[0].armsShift.startTime
        const end = shiftArr[1].armsShift.endTime

        if (isTimeBetween(start, end, e.startTime)) return true
        else return false
      } else if (array && array[0].armsShift && array.length == 3) {
        const start = shiftArr[0].armsShift.startTime
        const end = shiftArr[2].armsShift.endTime

        if (isTimeBetween(start, end, e.startTime)) return true
        else return true
      } else if (array && array[0].armsShift && array.length == 1) {
        const start = shiftArr[0].armsShift.startTime
        const end = shiftArr[0].armsShift.endTime

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
          var count = 0
          for (var i = 0; i < color[0].diary.length; i++) {
            if (color[0].diary[i].status !== 'cancelled') {
              count++
            }
          }
          return count
        } else {
          const str = color[0].diary[0].taskType.replace(/[_ ]+/g, '').toLowerCase()
          const stat = color[0].diary[0].status.toLowerCase()
          if (stat !== 'cancelled') return str
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
    } else if (
      task === 'meeting' ||
      task === 'viewing' ||
      task === 'reassign' ||
      task === 're-assign'
    ) {
      return '#99c5fa'
    }
  }

  const navigateTo = () => {
    const { navigation, dispatch } = props
    if (props.slotDiary == null) {
      diaryData([], slots, dispatch)
    } else {
      diaryData(props.slotDiary, slots, dispatch)
    }

    navigation.navigate('ScheduledTasks', {
      fromDate: startDate,
      toDate: toDate,
      isFromTimeSlot: true,
    })
  }

  const handleTimeStart = (time, name) => {
    setTimeStart(time)

    if (timeEnd) onHandleTimeSlotChange(time, 'start')
  }

  const handleTimeEnd = (time, name) => {
    setTimeEnd(time)

    if (timeStart) onHandleTimeSlotChange(time, 'end')
  }

  const onHandleTimeSlotChange = (time, from) => {
    if (from == 'end') {
      let tempStartPick = moment(timeStart).format('H:mm:ss')
      let tempEndPick = moment(time).format('H:mm:ss')
      let tempStartPick2 = moment(timeStart).format('H:mm')
      let tempEndPick2 = moment(time).format('H:mm')

      if (tempStartPick2 == tempEndPick2) {
        setTimeStart(null)
        setSlotsData([])
        setSlots([])
        setIsSelected([])
        helper.errorToast(`Start Time should be not equal to End Time`)
      } else {
        if (
          timeStart &&
          time &&
          moment(tempEndPick, 'H:mm:ss') > moment(tempStartPick, 'H:mm:ss')
        ) {
          onEditSlots(tempStartPick, tempEndPick, true)
          setDisabled(false)
        } else {
          setTimeStart(null)
          // setTimeEnd(null)
          setSlotsData([])
          setSlots([])
          setIsSelected([])
          // helper.errorToast(`End Time should be greater than Start Time`)
          helper.errorToast(`Start Time should be less than End Time`)
        }
      }
    } else {
      let tempStartPick = moment(time).format('H:mm:ss')
      let tempEndPick = moment(timeEnd).format('H:mm:ss')
      let tempStartPick2 = moment(timeStart).format('H:mm')
      let tempEndPick2 = moment(time).format('H:mm')

      if (tempStartPick2 == tempEndPick2) {
        setTimeEnd(null)
        setSlotsData([])
        setSlots([])
        setIsSelected([])
        helper.errorToast(`Start Time should be not equal to End Time`)
      } else {
        if (time && timeEnd && moment(tempEndPick, 'H:mm:ss') > moment(tempStartPick, 'H:mm:ss')) {
          onEditSlots(tempStartPick, tempEndPick, true)
          setDisabled(false)
        } else {
          // setTimeStart(null)
          setTimeEnd(null)
          setSlotsData([])
          setSlots([])
          setIsSelected([])
          // helper.errorToast(`Start Time should be less than End Time`)
          helper.errorToast(`End Time should be greater than Start Time`)
        }
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
      <View style={styles.slotView}>
        <ScrollView
          style={{ marginTop: '9%' }}
          scrollEnabled={false}
          ref={scrollViewFirst}
          bounces={false}
          scrollEventThrottle={16}
        >
          <View style={{ flexDirection: 'column' }}>
            {minArray.map((i) => {
              return (
                <View style={styles.minCol} key={i}>
                  <Text style={styles.timeText}>{i}</Text>
                </View>
              )
            })}
          </View>
        </ScrollView>
        <ScrollView horizontal={true} ref={scrollHorizontal}>
          <View style={{ flexDirection: 'column' }}>
            <View style={styles.viewHourCol}>
              {hourArray.map((o, i) => {
                return (
                  <View style={styles.hourCol} key={i}>
                    <Text style={styles.timeText}>{o}</Text>
                  </View>
                )
              })}
            </View>
            <ScrollView
              bounces={false}
              onScroll={(e) => {
                scrollViewFirst.current.scrollTo({
                  x: 0,
                  y: e.nativeEvent.contentOffset.y,
                  animated: false,
                })
              }}
              scrollEventThrottle={16}
            >
              {data
                ? rotateArray.map((o, i) => {
                    return (
                      <View style={styles.viewMinCol} key={i}>
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
                                      : setColor(e) == 'reassign'
                                      ? '#99c5fa'
                                      : setColor(e) == 're-assign'
                                      ? '#99c5fa'
                                      : setColor(e) == 'viewing'
                                      ? '#99c5fa'
                                      : setColor(e) == 'meetingwithpp'
                                      ? '#dcf0ff'
                                      : setColor(e) == 'followup'
                                      ? '#fff1c5'
                                      : setColor(e) == 'closed'
                                      ? '#e6e6e6'
                                      : setShift(e) == true
                                      ? '#ffffff'
                                      : '#f1f1f1',

                                    borderColor: isSelected.includes(e.id) ? 'black' : 'grey',
                                    borderWidth: isSelected.includes(e.id) ? 1.6 : 0.6,
                                  },
                                ]}
                                key={i}
                              >
                                {typeof setColor(e) == 'number' && (
                                  <View style={styles.taskLengthView} key={i}>
                                    <Text style={{ color: 'black' }}>{`+${setColor(e)}`}</Text>
                                  </View>
                                )}
                              </View>
                            </TouchableOpacity>
                          )
                        })}
                      </View>
                    )
                  })
                : null}
            </ScrollView>
          </View>
        </ScrollView>
      </View>

      {/* <View style={styles.timeInput}>
        <TouchableInput
          placeholder="Start Time"
          showDropDownIcon={false}
          isRow={true}
          iconSource={require('../../../assets/icons/time.png')}
          showIconOrImage={true}
        />
        <TouchableInput
          placeholder="End Time"
          showDropDownIcon={false}
          isRow={true}
          iconSource={require('../../../assets/icons/time.png')}
          showIconOrImage={true}
        />
      </View> */}

      <View style={styles.timeInput}>
        <DateTimePicker
          placeholderLabel={'Select Time'}
          name={'time'}
          mode={'time'}
          // showError={checkValidation === true && time === ''}
          errorMessage={'Required'}
          iconSource={require('../../../assets/icons/time.png')}
          date={timeStart ? new Date(moment(timeStart).format()) : new Date()}
          selectedValue={timeStart ? helper.formatTimeForTimePicker(timeStart) : ''}
          handleForm={(value, name) => handleTimeStart(value, name)}
        />

        <DateTimePicker
          placeholderLabel={'Select Time'}
          name={'time'}
          mode={'time'}
          // showError={checkValidation === true && viewing.time === ''}
          errorMessage={'Required'}
          iconSource={require('../../../assets/icons/time.png')}
          date={timeEnd ? new Date(moment(timeEnd).format()) : new Date()}
          selectedValue={timeEnd ? helper.formatTimeForTimePicker(timeEnd) : ''}
          handleForm={(value, name) => handleTimeEnd(value, name)}
        />
      </View>

      <View style={styles.buttonInputWrap}>
        <TouchableButton
          containerStyle={[styles.timePageBtn, { opacity: disabled ? 0.5 : 1 }]}
          containerBackgroundColor="white"
          textColor="#0f73ee"
          borderColor="#0f73ee"
          borderWidth={1}
          label="Show Details"
          disabled={disabled}
          onPress={() => navigateTo()}
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
    connectFeedback: store.diary.connectFeedback,
  }
}

export default connect(mapStateToProps)(TimeSlotManagement)
