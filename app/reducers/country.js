/** @format */

import { combineReducers } from 'redux'
import * as types from '../types'

const country = (state = {}, action) => {
  switch (action.type) {
    case types.GET_COUNTRY_CODE:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  country,
})
