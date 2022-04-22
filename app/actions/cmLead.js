/** @format */

import * as types from '../types'
import axios from 'axios'

export function getAllProjects() {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_CM_LEAD_LOADER,
      payload: true,
    })
    let promise = axios
      .get(`/api/project/all`)
      .then((res) => {
        let projectArray = []
        res &&
          res.data.items.map((item, index) => {
            return projectArray.push({
              value: item.id,
              name: item.name,
              productType: item.productTypes,
            })
          })
        dispatch({
          type: types.GET_ALL_INVESTMENT_PROJECTS,
          payload: projectArray,
        })

        dispatch({
          type: types.SET_CM_LEAD_LOADER,
          payload: false,
        })
      })
      .catch((error) => {
        dispatch({
          type: types.SET_CM_LEAD_LOADER,
          payload: false,
        })
      })
    return promise
  }
}

export function addEditCMLead(data) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.ADD_EDIT_CM_LEAD,
      payload: data,
    })
  }
}

export function setDefaultCMPayload(data) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_DEFAULT_CM_PAYLOAD,
    })
  }
}
