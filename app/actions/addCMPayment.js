/** @format */

import * as types from '../types'

export function setCMPayment(payment) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_CM_PAYMENT,
      payload: payment,
    })
    return payment
  }
}
