/** @format */

import { combineReducers } from 'redux'
import * as types from '../types'

const setPPBuyNotification = (state = { yes: 'yes' }, action) => {
  switch (action.type) {
    case types.SET_PP_BUY_NOTIFICATION:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  PPBuyNotification: setPPBuyNotification,
})
