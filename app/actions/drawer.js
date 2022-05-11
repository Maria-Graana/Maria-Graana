/** @format */

import * as types from '../types'
import * as Contacts from 'expo-contacts'
import axios from 'axios'

export function setDrawerInternalMenu(value) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_DRAWER_INTERNAL_MENU,
      payload: value,
    })
  }
}

export function setShortlistedData(lead) {
  return (dispatch, getsState) => {
    let matches = []
    let url = `/api/leads/${lead.id}/shortlist`
    //console.log(url)
    axios
      .get(url)
      .then((response) => {
        if (response) {
          matches = response.data.rows.map((item) => {
            return item.armsuser.id
          })
          dispatch({
            type: types.SET_SHORTLISTED_DATA,
            payload: matches,
          })
        }
      })
      .catch((error) => {})
    return Promise.resolve(true)
  }
}
