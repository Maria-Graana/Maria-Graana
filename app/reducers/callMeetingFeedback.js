/** @format */

import { combineReducers } from 'redux'
import moment from 'moment'
import * as types from '../types'

const callMeetingPayload = {
  start: null,
  end: null,
  time: null,
  date: null,
  taskType: 'called',
  response: 'Called',
  subject: null,
  customerId: null,
  armsLeadId: null, // For RCM Call
  leadId: null, // For CM Call
  calledNumber: null,
  taskCategory: 'leadTask',
  calledOn: null,
  comments: null,
  status: null,
  response: null,
  addedBy: 'self',
}

const callMeetingStatus = (state = callMeetingPayload, action) => {
  switch (action.type) {
    case types.SET_CALL_PAYLOAD:
      if (action.payload) {
        const { phone, calledOn, lead } = action.payload
        let start = moment().format()
        let copyPayload = {
          ...state,
          phone,
          calledOn,
          calledNumber: phone ? phone : null,
          subject:
            calledOn === 'phone'
              ? 'called ' + lead.customer.customerName
              : 'contacted ' + lead.customer.customerName,
          customerId: lead.customer.id,
          armsLeadId: !lead.projectId ? lead.id : null, // For RCM Call
          leadId: lead.projectId ? lead.id : null, // For CM Call
          start,
          end: start,
          time: start,
          date: start,
          title: calledOn === 'phone' ? 'phone' : 'whatsapp',
        }
        return copyPayload
      } else {
        console.log('something went wrong')
      }
    case types.SET_CALL_COMMENT:
      return action.payload
    case types.CLEAR_CALL_PAYLOAD:
      return callMeetingPayload
    default:
      return state
  }
}

export default combineReducers({
  callMeetingStatus,
})
