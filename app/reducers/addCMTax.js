/** @format */

import { combineReducers } from 'redux'
import * as types from '../types'

const payment = {
  installmentAmount: null,
  type: '',
  cmLeadId: null,
  details: '',
  visible: false,
  fileName: '',
  attachments: [],
  uri: '',
  size: null,
  title: '',
  taxIncluded: false,
  paymentCategory: '',
  whichModalVisible: '',
}

const CMTax = (state = payment, action) => {
  switch (action.type) {
    case types.SET_CM_TAX:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  CMTax,
})
