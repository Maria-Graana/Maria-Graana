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
import CMTax from './addCMTax'
import RCMPayment from './rcmPayment'
import PropsurePayment from './propsurePayment'

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
  CMTax,
})
