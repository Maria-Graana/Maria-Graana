/** @format */

import * as types from '../types'

export function setCMTax(payment) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_CM_TAX,
      payload: payment,
    })
    return payment
  }
}
