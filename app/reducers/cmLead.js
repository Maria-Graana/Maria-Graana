/** @format */

import * as types from '../types'
import { combineReducers } from 'redux'
import StaticData from '../StaticData'

export let defaultPayload = {
  customerId: null,
  cityId: null,
  projectId: null,
  projectType: '',
  armsProjectTypeId: null,
  minPrice: StaticData.PricesProject[0],
  maxPrice: StaticData.PricesProject[StaticData.PricesProject.length - 1],
  description: '',
  phones: [],
  noProduct: false,
}

const CMLead = (state = defaultPayload, action) => {
  switch (action.type) {
    case types.ADD_EDIT_CM_LEAD:
      return action.payload
    case types.SET_DEFAULT_CM_PAYLOAD:
      return defaultPayload
    default:
      return state
  }
}

const investmentProjects = (state = [], action) => {
  switch (action.type) {
    case types.GET_ALL_INVESTMENT_PROJECTS:
      return action.payload
    default:
      return state
  }
}

const CMFormLoading = (state = false, action) => {
  switch (action.type) {
    case types.SET_CM_LEAD_LOADER:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  CMLead,
  investmentProjects,
  CMFormLoading,
})
