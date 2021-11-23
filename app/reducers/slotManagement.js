/** @format */

import * as types from '../types'
import { combineReducers } from 'redux'

const slotDiaryData = (state = '', action) => {
  switch (action.type) {
    case types.SET_SLOT_DIARY_DATA:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  slotDiaryData,
})
