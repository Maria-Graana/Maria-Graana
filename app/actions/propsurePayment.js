/** @format */

import * as types from '../types'

export function setPropsurePayment(payment) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_PROPSURE_PAYMENT,
      payload: payment,
    })
  }
}
