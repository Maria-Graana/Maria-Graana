/** @format */

import { combineReducers } from 'redux'
import * as types from '../types'
import _ from 'underscore'

const images = (state = [], action) => {
  switch (action.type) {
    case types.ADD_IMAGES:
      return [...state, action.payload]
    case types.IMAGE_UPLOAD_SUCCESS:
      let newImages = state.map((image, index) => {
        if (action.payload.index === index) {
          image.id = action.payload.id
        }
        return image
      })
      return newImages
    case types.IMAGE_REMOVE:
      const allImages = [...state]
      for (let i = 0; i < allImages.length; i++) {
        if (allImages[i].id === action.payload) {
          allImages.splice(i, 1)
        }
      }
      return allImages
    case types.FLUSH_IMAGES:
      return []
    default:
      return state
  }
}
const imageLoader = (state = false, action) => {
  switch (action.type) {
    case types.SET_IMAGE_LOADING:
      return action.payload
    default:
      return state
  }
}

const addPropertyParams = (state = {}, action) => {
  switch (action.type) {
    case types.SET_ADD_PROPERTY_PARAMS:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export default combineReducers({
  images,
  imageLoader,
  addPropertyParams,
})
