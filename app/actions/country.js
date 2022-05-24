/** @format */

import * as types from '../types'
import axios from 'axios'

export function getCountryCode() {
  return (dispatch, getsState) => {
    axios.get('/api/user/getCountryCodes').then((response) => {
      dispatch({
        type: types.GET_COUNTRY_CODE,
        payload: response.data,
      })
    })
  }
}
