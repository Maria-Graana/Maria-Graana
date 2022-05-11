/** @format */

import * as types from '../types'
import { combineReducers } from 'redux'

const armsContacts = (state = {}, action) => {
  switch (action.type) {
    case types.GET_ARMS_CONTACTS:
      return action.payload
    default:
      return state
  }
}

const armContactsLoading = (state = false, action) => {
  switch (action.type) {
    case types.SET_ARMS_CONTACTS_LOADER:
      return action.payload
    default:
      return state
  }
}

const selectedContact = (state = null, action) => {
  switch (action.type) {
    case types.SET_SELECTED_CONTACT:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  armsContacts,
  armContactsLoading,
  selectedContact,
})
