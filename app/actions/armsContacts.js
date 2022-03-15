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
          res.data = res.data.rows.map((item) => {
            let newObj = { ...item }
            let newArr = []
            newArr.push(
              {
                phoneWithDialCode: item.dialCode ? item.dialCode + item.phone : '',
                phone: item.phone,
                dialCode: item.dialCode,
                countryCode: item.countryCode,
              },
              {
                phoneWithDialCode: item.dialCode2 ? item.dialCode2 + item.phone2 : '',
                phone: item.phone2,
                dialCode: item.dialCode2,
                countryCode: item.countryCode2,
              },
              {
                phoneWithDialCode: item.dialCode3 ? item.dialCode3 + item.phone3 : '',
                phone: item.phone3,
                dialCode: item.dialCode3,
                countryCode: item.countryCode3,
              }
            )
            newObj.phoneNumbers = newArr
            return newObj
          })
          // console.log('afterData', res.data)
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

export function setSelectedContact(contact, call = false) {
  return (dispatch, getsState) => {
    if (call) {
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
    }
    dispatch({
      type: types.SET_SELECTED_CONTACT,
      payload: contact,
    })
    return Promise.resolve(true)
  }
}

export function createContact(body, addCallPayload) {
  let url = `api/contacts/create`
  let promise = axios
    .post(url, body)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.error('An error occurred while creating contact', err)
      return null
    })
  return promise
}

export function addCall(body) {
  let url = `api/contacts/addcall`
  let promise = axios
    .post(url, body)
    .then((res) => {})
    .catch((err) => {
      console.error('An error occurred while creating contact', err)
    })
  return promise
}
