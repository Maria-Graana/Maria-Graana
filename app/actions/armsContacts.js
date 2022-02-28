/** @format */

import * as types from '../types'
import axios from 'axios'
import helper from '../helper.js'
import _ from 'underscore'
import { Linking } from 'react-native'

export function getARMSContacts() {
  return (dispatch, getsState) => {
    let endPoint = `/api/contacts/fetch`

    dispatch({
      type: types.SET_ARMS_CONTACTS_LOADER,
      payload: true,
    })

    let promise = axios
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

    return promise
  }
}

export function setSelectedContact(contact) {
  return (dispatch, getsState) => {
    let url = 'tel:' + contact.phone
    if (url && url != 'tel:null') {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            helper.errorToast(`No application available to dial phone number`)
            console.log("Can't handle url: " + url)
          } else {
            Linking.openURL(url)
          }
        })
        .catch((err) => console.error('An error occurred', err))
    } else {
      helper.errorToast(`No Phone Number`)
    }
    dispatch({
      type: types.SET_SELECTED_CONTACT,
      payload: contact,
    })
    return Promise.resolve(true)
  }
}
