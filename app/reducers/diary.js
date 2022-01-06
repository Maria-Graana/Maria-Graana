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
}

let filtersData = {
  date: _today,
  feedbackId: null,
  leadType: null,
  wantedId: null,
  projectId: null,
  buyrentId: null,
  customerId: null,
  customerName: null,
  customerPhoneNumber: null,
}

let referenceGuideData = {
  isReferenceModalVisible: false,
  referenceGuideLoading: false,
  referenceErrorMessage: null,
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
    case types.CLEAR_DIARIES:
      return { ...diaryData, diaries: action.payload }
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

const referenceGuide = (state = referenceGuideData, action) => {
  switch (action.type) {
    case types.SET_REFERENCE_GUIDE_DATA:
      return action.payload
    default:
      return state
  }
}

const diaryFeedbacks = (state = {}, action) => {
  switch (action.type) {
    case types.SET_DIARY_FEEDBACKS:
      return action.payload
    case types.CLEAR_DIARY_FEEDBACKS:
      return {}
    default:
      return state
  }
}

const sort = (state = '', action) => {
  switch (action.type) {
    case types.SET_DIARY_SORT:
      return action.payload
    default:
      return state
  }
}

const isFilterApplied = (state = false, action) => {
  switch (action.type) {
    case types.SET_DAIRY_FILTER_APPLIED:
      return action.payload
    default:
      return state
  }
}

const onEndReachedLoader = (state = false, action) => {
  switch (action.type) {
    case types.SET_DIARY_ON_END_REACHED_LOADER:
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

const feedbackReasonFilter = (state = null, action) => {
  switch (action.type) {
    case types.SET_DIARY_FILTER_REASON:
      return action.payload
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

const connectFeedback = (state = {}, action) => {
  switch (action.type) {
    case types.SET_CONNECT_FEEDBACK:
      return action.payload
    default:
      return state
  }
}

const isMultiPhoneModalVisible = (state = false, action) => {
  switch (action.type) {
    case types.SET_MULTIPLE_PHONE_MODAL_VISIBLE:
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
  sort,
  onEndReachedLoader,
  isFilterApplied,
  feedbackReasonFilter,
  diaryFeedbacks,
  connectFeedback,
  isMultiPhoneModalVisible,
  referenceGuide,
})
