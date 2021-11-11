/** @format */

import * as types from '../types'
import { combineReducers } from 'redux'

let diaryData = {
  diaries: [],
  loading: false,
  selectedDiary: null,
  selectedLead: null,
}

const diary = (state = diaryData, action) => {
  switch (action.type) {
    case types.SET_DIARY_LOADER:
      return { ...diaryData, loading: action.payload }
    case types.GET_DIARIES:
      return { ...diaryData, diaries: action.payload }
    case types.SET_SELECTED_DIARY:
      return {
        ...state,
        selectedDiary: action.payload.diary,
        selectedLead: action.payload.lead,
      }
    default:
      return state
  }
}

const overdueCount = (state = 0, action) => {
  switch (action.type) {
    case types.SET_DIARY_OVERDUE_COUNT:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  diary,
  overdueCount,
})
