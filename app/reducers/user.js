/** @format */

import * as types from '../types'
import { combineReducers } from 'redux'

const userPayload = {
  agent: 'Sharjeel Ehmer',
  branch: 1,
  id: 61,
  message: 'success',
  role: 'admin',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjo2MSwicm9sZSI6ImFkbWluIiwiYnJhbmNoIjoxLCJzdWJSb2xlIjpudWxsLCJpYXQiOjE1NzgyMzE3ODF9.qwVvgZX34TJmBbHHhDeOpIbWbCnL4j7RPS2HJTGVHFg',
}

const user = (state = '', action) => {
  switch (action.type) {
    case types.SET_USER:
      return action.payload
    case types.LOGOUT_USER:
      return null
    default:
      return state
  }
}

const permissions = (state = {}, action) => {
  switch (action.type) {
    case types.SET_PERMISSIONS:
      return action.payload
    default:
      return state
  }
}

const error = (state = '', action) => {
  switch (action.type) {
    case types.SET_USER_ERROR:
      return action.payload
    case types.REMOVE_USER_ERROR:
      return ''
    default:
      return state
  }
}

const loading = (state = false, action) => {
  switch (action.type) {
    case types.USER_LOADING:
      return true
    case types.USER_LOADED:
      return false
    default:
      return state
  }
}

const token = (state = false, action) => {
  switch (action.type) {
    case types.SET_TOKEN_SUCCESS:
      return true
    case types.SET_TOKEN_ERROR:
      return false
    default:
      return state
  }
}

const isInternetConnected = (state = false, action) => {
  switch (action.type) {
    case types.SET_INTERNET_CONNECTION:
      return action.payload
    default:
      return state
  }
}

const updateLoader = (state = false, action) => {
  switch (action.type) {
    case types.SET_UPDATE_LOADER:
      return action.payload
    default:
      return state
  }
}

const getIsTerminalUser = (state = false, action) => {
  switch (action.type) {
    case types.SET_IS_TERMINAL_USER:
      return action.data
    default:
      return state
  }
}

export default combineReducers({
  user,
  error,
  loading,
  token,
  isInternetConnected,
  updateLoader,
  permissions,
  getIsTerminalUser,
})
