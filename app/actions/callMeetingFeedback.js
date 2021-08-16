/** @format */

import * as types from '../types'
import axios from 'axios'

export function setCallPayload(phone, calledOn, lead) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_CALL_PAYLOAD,
      payload: { phone, calledOn, lead },
    })
  }
}

export function sendCallStatus(comment) {
  return async (dispatch, getsState) => {
    let callResponse = getsState().callMeetingStatus.callMeetingStatus
    let copyCallResponse = {
      ...callResponse,
      comments: comment,
      response: comment,
      status: 'completed',
    }
    return axios.post(`api/leads/project/meeting`, copyCallResponse).then((res) => {
      dispatch(clearCallPayload())
    })
  }
}

export function clearCallPayload() {
  return (dispatch, getsState) => {
    dispatch({
      type: types.CLEAR_CALL_PAYLOAD,
    })
  }
}
