/** @format */

import * as types from '../types'
import axios from 'axios'

export function getDiaryTasks(selectedDate, agentId = null, overdue = false) {
  return (dispatch, getsState) => {
    let endPoint = ``
    if (overdue) {
      endPoint = `/api/diary/all?overdue=${overdue}&agentId=${agentId}`
    } else {
      endPoint = `/api/diary/all?date[]=${selectedDate}`
    }
    dispatch({
      type: types.SET_DIARY_LOADER,
      payload: true,
    })

    axios
      .get(`${endPoint}`)
      .then((res) => {
        if (res.data) {
          dispatch({
            type: types.GET_DIARIES,
            payload: res.data,
          })
        }
      })

      .catch((error) => {
        console.log(error)
        dispatch({
          type: types.SET_DIARY_LOADER,
          payload: false,
        })
      })
  }
}

export function getOverdueCount() {
  return (dispatch, getsState) => {
    let endPoint = ``
    endPoint = `/api/diary/overdue/count`
    axios
      .get(`${endPoint}`)
      .then((res) => {
        if (res.data) {
          dispatch({
            type: types.SET_DIARY_OVERDUE_COUNT,
            payload: res.data.count,
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
