/** @format */

import * as types from '../types'
import _ from 'underscore'
import axios from 'axios'

export function setSlotDiaryData(selectedDate, id) {
  return (dispatch, getsState) => {
    if (id) {
      axios
        .get(
          `api/slotManagement/user-slots-diaries?startDate=${selectedDate}&endDate=${selectedDate}&userId=${id}`
        )
        .then((response) => {
          if (response.data[0] == undefined) {
            dispatch({
              type: types.CLEAR_SLOT_DATA_DIARY,
            })
          } else {
            dispatch({
              type: types.SET_SLOT_DIARY_DATA,
              payload: response.data,
            })
          }
        })
        .catch((error) => {
          console.log(
            `api/slotManagement/user-slots-diaries?startDate=${selectedDate}&endDate=${selectedDate}`
          )
          console.log('error', error)
        })
    } else {
      axios
        .get(
          `api/slotManagement/user-slots-diaries?startDate=${selectedDate}&endDate=${selectedDate}`
        )
        .then((response) => {
          if (response.data[0] == undefined) {
            dispatch({
              type: types.CLEAR_SLOT_DATA_DIARY,
            })
          } else {
            dispatch({
              type: types.SET_SLOT_DIARY_DATA,
              payload: response.data,
            })
          }
        })
        .catch((error) => {
          console.log(
            `api/slotManagement/user-slots-diaries?startDate=${selectedDate}&endDate=${selectedDate}`
          )
          console.log('error', error)
        })
    }
  }
}

export function setTimeSlots() {
  const sortTimeData = (res, dispatch) => {
    const sortedResp = _.sortBy(res, 'startTime')
    dataSlots(sortedResp, dispatch)
  }

  const dataSlots = (res, dispatch) => {
    var x = new Array(24)
    for (var i = 0; i < 24; i++) {
      x[i] = new Array(12)
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
      .then((response) => sortTimeData(response.data, dispatch))
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

export function clearSlotData() {
  return (dispatch, getsState) => {
    dispatch({
      type: types.CLEAR_SLOT_DIARY_DATA,
    })
  }
}

export function clearSlotDiaryData() {
  return (dispatch, getsState) => {
    dispatch({
      type: types.CLEAR_SLOT_DATA_DIARY,
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

export function clearScheduledTasks() {
  return (dispatch, getsState) => {
    dispatch({
      type: types.CLEAR_SCHEDULED_TASKS,
    })
  }
}

export function getTimeShifts(id) {
  return (dispatch, getsState) => {
    if (id) {
      axios
        .get(`api/slotManagement/user-shifts?userId=${id}`)
        .then((response) =>
          dispatch({
            type: types.SET_TIME_SHIFT,
            payload: response.data,
          })
        )
        .catch((error) => {
          console.log(`api/slotManagement/user-shifts?userId=${id}`)
          console.log('error', error)
        })
    } else {
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
}

export function setDataSlotsArray(dataSlots) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_SLOTS_DATA_PAYLOAD,
      payload: dataSlots,
    })
  }
}

export function alltimeSlots() {
  return (dispatch, getsState) => {
    axios
      .get('api/slotManagement/slot')
      .then((response) =>
        dispatch({
          type: types.ALL_TIME_SLOTS,
          payload: response.data,
        })
      )
      .catch((error) => {
        console.log('api/slotManagement/slot')
        console.log('error', error)
      })
  }
}
