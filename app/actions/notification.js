/** @format */

import * as types from '../types'

export const setPPBuyNotification = (notification) => {
  return {
    type: types.SET_PP_BUY_NOTIFICATION,
    payload: notification,
  }
}
