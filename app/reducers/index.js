/** @format */

import { combineReducers } from 'redux'
import lead from './lead'
import contacts from './contacts'
import user from './user'
import sale from './sale'
import listings from './listings'
import areasReducer from './areas'
import property from './property'
import CMPayment from './addCMPayment'
import RCMPayment from './rcmPayment'
import LegalPayment from './legalPayment'
import PropsurePayment from './propsurePayment'
import Notification from './notification'
import Instruments from './addInstrument'
import callMeetingStatus from './callMeetingFeedback'
import slotManagement from './slotManagement' // ARMS-2180
import diary from './diary'
import armsContacts from './armsContacts'
import drawer from './drawer'
import cmLead from './cmLead'
import leadsDropdown from './leadsDropdown'

export default combineReducers({
  lead,
  user,
  sale,
  listings,
  areasReducer,
  property,
  contacts,
  CMPayment,
  RCMPayment,
  PropsurePayment,
  LegalPayment,
  Notification,
  Instruments,
  callMeetingStatus,
  slotManagement, // ARMS-2180
  diary,
  armsContacts,
  drawer,
  cmLead,
  leadsDropdown
})
