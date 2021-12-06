/** @format */

import * as types from '../types'
import { combineReducers } from 'redux'
import moment from 'moment'

const _format = 'YYYY-MM-DD'
const _today = moment(new Date()).format(_format)

let diaryData = {
  diaries: [],
  loading: false,
  selectedDiary: null,
  selectedLead: null,
  showClassificationModal: false,
  page: 1,
  pageSize: 50,
  onEndReachedLoader: false,
}

let filtersData = {
  date: null,
  feedbackId: null,
  leadType: null,
  wantedId: null,
  projectId: null,
  buyrentId: null,
  customerId: null,
  customerName: null,
  customerPhoneNumber: null,
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
    case types.SET_CLASSIFICATION_MODAL:
      return {
        ...state,
        showClassificationModal: action.payload,
      }
    case types.SET_DIARY_PAGE_COUNT:
      return {
        ...state,
        page: action.payload,
      }
    case types.SET_DIARY_ON_END_REACHED_LOADER:
      return {
        ...state,
        onEndReachedLoader: action.payload,
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

const filters = (state = filtersData, action) => {
  switch (action.type) {
    case types.SET_DIARY_FILTER:
      return action.payload
    case types.CLEAR_DIARY_FILTER:
      return filtersData
    default:
      return state
  }
}

const diaryStats = (state = '', action) => {
  switch (action.type) {
    case types.GET_DIARY_STATS:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  diary,
  overdueCount,
  filters,
  diaryStats,
})
