/** @format */

import * as types from '../types'
import axios from 'axios'
import helper from '../helper.js'
import _ from 'underscore'
import { Linking } from 'react-native'

export function getARMSContacts(searchText = '', statusFilterType = '') {
  return (dispatch, getsState) => {
    let endPoint = ''
    if (statusFilterType === 'name') {
      endPoint = `/api/contacts/fetch?name=${searchText}`
    } else if (statusFilterType === 'phone') {
      endPoint = `/api/contacts/fetch?&phone=${searchText}`
    } else {
      endPoint = `/api/contacts/fetch`
    }

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
                number: item.phone,
                phone: item.dialCode ? item.dialCode + item.phone : '',
                dialCode: item.dialCode,
                countryCode: item.countryCode,
              },
              {
                phoneWithDialCode: item.dialCode2 ? item.dialCode2 + item.phone2 : '',
                number: item.phone2,
                dialCode: item.dialCode2,
                phone: item.dialCode2 ? item.dialCode2 + item.phone2 : '',
                countryCode: item.countryCode2,
              },
              {
                phoneWithDialCode: item.dialCode3 ? item.dialCode3 + item.phone3 : '',
                number: item.phone3,
                phone: item.dialCode3 ? item.dialCode3 + item.phone3 : '',
                dialCode: item.dialCode3,
                countryCode: item.countryCode3,
              }
            )
            newArr = newArr.filter((item) => item.number !== null).sort()
            newObj.phoneNumbers = newArr
            return newObj
          })
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

export function checkUndefined(callingCode) {
  if (callingCode) {
    let withoutPlus = callingCode.replace('+', '')
    callingCode = callingCode.startsWith('+') ? callingCode : '+' + callingCode
    return withoutPlus === 'undefined' || !withoutPlus ? '+92' : callingCode
  } else return (callingCode = '+92')
}

export function createARMSContactPayload(data) {
  const {
    id,
    countryCode,
    countryCode1,
    countryCode2,
    callingCode,
    callingCode1,
    callingCode2,
    contactNumber,
    contact1,
    contact2,
  } = data
  let body = {
    firstName: helper.capitalize(data.firstName),
    lastName: helper.capitalize(data.lastName),
    phone: {
      countryCode: callingCode === '+92' ? 'PK' : countryCode,
      phone: contactNumber ? contactNumber.replace(/\s+/g, '') : null,
      dialCode: checkUndefined(callingCode),
    },
    contact1: {
      countryCode: callingCode1 === '+92' ? 'PK' : countryCode1,
      contact1: contact1 ? contact1.replace(/\s+/g, '') : null,
      dialCode: checkUndefined(callingCode1),
    },
    contact2: {
      countryCode: callingCode2 === '+92' ? 'PK' : countryCode2,
      contact2: contact2 ? contact2.replace(/\s+/g, '') : null,
      dialCode: checkUndefined(callingCode2),
    },
    contactRegistrationId: id,
  }
  if (!contact1) delete body.contact1
  if (!contact2) delete body.contact2
  return body
}

export function updateARMSContact(data) {
  const {
    id,
    countryCode,
    countryCode1,
    countryCode2,
    callingCode,
    callingCode1,
    callingCode2,
    contactNumber,
    contact1,
    contact2,
  } = data
  let body = {
    firstName: helper.capitalize(data.firstName),
    lastName: helper.capitalize(data.lastName),
    phone: {
      countryCode: callingCode === '+92' ? 'PK' : countryCode,
      phone: contactNumber ? contactNumber.replace(/\s+/g, '') : null,
      dialCode: checkUndefined(callingCode),
    },
    contact1: {
      countryCode: callingCode1 === '+92' ? 'PK' : countryCode1,
      contact1: contact1 ? contact1.replace(/\s+/g, '') : null,
      dialCode: checkUndefined(callingCode1),
    },
    contact2: {
      countryCode: callingCode2 === '+92' ? 'PK' : countryCode2,
      contact2: contact2 ? contact2.replace(/\s+/g, '') : null,
      dialCode: checkUndefined(callingCode2),
    },
    id,
    contactRegistrationId: id,
    updatedAt: Date.now(),
  }
  return body
}

export function setSelectedContact(contact, call = false) {
  return (dispatch, getsState) => {
    if (call) {
      let url = 'tel:' + contact.phone
      if (url && url != 'tel:null') {
      } else {
        helper.errorToast(`No Phone Number`)
      }
      // console.log("Can't handle url: " + url)
      Linking.openURL(url)
    }
    dispatch({
      type: types.SET_SELECTED_CONTACT,
      payload: contact,
    })
    return Promise.resolve(true)
  }
}

export function createContact(body) {
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

export function updateContact(body) {
  let url = `api/contacts/update`

  let promise = axios
    .patch(url, body)
    .then((res) => {
      if (res && res.data) {
        return res.data
      }
    })
    .catch((err) => {
      console.error('An error occurred while updating contact', err)
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
