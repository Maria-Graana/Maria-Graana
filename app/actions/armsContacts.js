/** @format */

import * as types from '../types'
import axios from 'axios'
import helper from '../helper.js'
import _ from 'underscore'

export function getARMSContacts() {
  return (dispatch, getsState) => {
    let endPoint = `/api/contacts/fetch`

    dispatch({
      type: types.SET_ARMS_CONTACTS_LOADER,
      payload: true,
    })

    axios
      .get(endPoint)
      .then((res) => {
        if (res.data) {
          dispatch({
            type: types.GET_ARMS_CONTACTS,
            payload: res.data,
          })
        }
        dispatch({
          type: types.SET_ARMS_CONTACTS_LOADER,
          payload: false,
        })
      })
      .catch((error) => {
        console.log(error)
        dispatch({
          type: types.SET_ARMS_CONTACTS_LOADER,
          payload: false,
        })
      })
  }
}
