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
