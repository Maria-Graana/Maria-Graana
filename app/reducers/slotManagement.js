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

const timeSlots = (state = '', action) => {
  switch (action.type) {
    case types.SET_TIME_SLOTS:
      return action.payload
    default:
      return state
  }
}

const slotsPayload = (state = null, action) => {
  switch (action.type) {
    case types.SET_SLOTS_PAYLOAD:
      return action.payload
    case types.CLEAR_SLOT_DIARY_DATA:
      return null
    default:
      return state
  }
}

const setScheduled = (state = '', action) => {
  switch (action.type) {
    case types.SET_SCHEDULED_TASKS:
      return action.payload
    default:
      return state
  }
}

const userTimeShifts = (state = '', action) => {
  switch (action.type) {
    case types.SET_TIME_SHIFT:
      return action.payload
    default:
      return state
  }
}

const slotsDataPayload = (state = null, action) => {
  switch (action.type) {
    case types.SET_SLOTS_DATA_PAYLOAD:
      return action.payload
    case types.CLEAR_SLOT_DIARY_DATA:
      return null
    default:
      return state
  }
}

export default combineReducers({
  slotDiaryData,
  timeSlots,
  slotsPayload,
  setScheduled,
  userTimeShifts,
  slotsDataPayload,
})
