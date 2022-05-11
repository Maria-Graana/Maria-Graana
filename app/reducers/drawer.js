/** @format */

import * as types from '../types'
import { combineReducers } from 'redux'

const drawerMenuOptions = (state = false, action) => {
  switch (action.type) {
    case types.SET_DRAWER_INTERNAL_MENU:
      return action.payload
    default:
      return state
  }
}

const shortlistedData = (state = false, action) => {
  switch (action.type) {
    case types.SET_SHORTLISTED_DATA:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  drawerMenuOptions,
  shortlistedData,
})
