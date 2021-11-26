/** @format */

import * as types from '../types'

import axios from 'axios'

export function setSlotDiaryData(selectedDate) {
  return (dispatch, getsState) => {
    axios
      .get(
        `api/slotManagement/user-slots-diaries?startDate=${selectedDate}&endDate=${selectedDate}`
      )
      .then((response) =>
        dispatch({
          type: types.SET_SLOT_DIARY_DATA,
          payload: response.data,
        })
      )
      .catch((error) => {
        console.log(
          `api/slotManagement/user-slots-diaries?startDate=${selectedDate}&endDate=${selectedDate}`
        )
        console.log('error', error)
      })
  }
}

export function setTimeSlots() {
  const dataSlots = (res, dispatch) => {
    var x = new Array(24)
    for (var i = 0; i < 24; i++) {
      x[i] = new Array(11)
    }
    addData(res, x, dispatch)
  }

  const addData = (res, x, dispatch) => {
    var r = 0
    for (var i = 0; i < x.length; i++) {
      for (var j = 0; j < x[i].length; j++, r++) {
        x[i][j] = res[r]
      }
    }
    dispatch({
      type: types.SET_TIME_SLOTS,
      payload: x,
    })
  }
  return (dispatch, getsState) => {
    axios
      .get('api/slotManagement/slot')
      .then((response) => dataSlots(response.data, dispatch))
      .catch((error) => {
        console.log('api/slotManagement/slot')
        console.log('error', error)
      })
  }
}

export function setSlotData(date, startTime, endTime, slots) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_SLOTS_PAYLOAD,
      payload: { date, startTime, endTime, slots },
    })
  }
}

export function setScheduledTasks(payload) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_SCHEDULED_TASKS,
      payload: payload,
    })
  }
}

export function getTimeShifts() {
  return (dispatch, getsState) => {
    axios
      .get('api/slotManagement/user-shifts')
      .then((response) =>
        dispatch({
          type: types.SET_TIME_SHIFT,
          payload: response.data,
        })
      )
      .catch((error) => {
        console.log('api/slotManagement/user-shifts')
        console.log('error', error)
      })
  }
}
