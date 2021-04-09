/** @format */

import { combineReducers } from 'redux'
import * as types from '../types'

const legalPayment = {
  installmentAmount: null,
  type: '',
  rcmLeadId: null,
  details: '',
  visible: false,
  paymentAttachments: [],
  addedBy: null,
  armsUserId: null,
  officeLocationId: null,
}

const LegalPayment = (state = legalPayment, action) => {
  switch (action.type) {
    case types.SET_LEGAL_PAYMENT:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  LegalPayment,
})
