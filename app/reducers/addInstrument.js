/** @format */

import { combineReducers } from 'redux'
import * as types from '../types'

const instrument = {
    customerId: null,
    instrumentType: '',
    instrumentNo: null,
    instrumentAmount: null,
}


const addInstrument = (state = instrument, action) => {
    switch (action.type) {
        case types.SET_INSTRUMENT_INFORMATION:
            return action.payload
        default:
            return state
    }
}

const instruments = (state= [], action) => {
    switch (action.type) {
        case types.SET_INSTRUMENTS:
            return action.payload
        default:
            return state
    }
}

export default combineReducers({
    addInstrument,
    instruments,
})
