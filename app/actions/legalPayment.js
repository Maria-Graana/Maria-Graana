/** @format */

import * as types from '../types'

export function setLegalPayment(payment) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_LEGAL_PAYMENT,
      payload: payment,
    })
  }
}
