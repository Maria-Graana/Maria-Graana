/** @format */

import * as types from '../types'
import axios from 'axios'

export function getDiaryTasks(selectedDate) {
  return (dispatch, getsState) => {
    let endPoint = ``
    dispatch({
      type: types.SET_DIARY_LOADER,
      payload: true,
    })
    endPoint = `/api/diary/all?date[]=${selectedDate}`
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
            payload: res.data,
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
