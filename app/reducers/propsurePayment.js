/** @format */

import { combineReducers } from 'redux'
import * as types from '../types'

const propsurePayment = {
  installmentAmount: null,
  type: '',
  rcmLeadId: null,
  details: '',
  visible: false,
  paymentAttachments: [],
  addedBy: null,
  armsUserId: null,
}

const PropsurePayment = (state = propsurePayment, action) => {
  switch (action.type) {
    case types.SET_PROPSURE_PAYMENT:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  PropsurePayment,
})
