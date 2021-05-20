/** @format */

import { combineReducers } from 'redux'
import * as types from '../types'

const instrument = {
    id: null,
    customerId: null,
    instrumentType: '',
    instrumentNo: null,
    instrumentAmount: null,
}


const addInstrument = (state = instrument, action) => {
    switch (action.type) {
        case types.SET_INSTRUMENT_INFORMATION:
            return action.payload;
        case types.CLEAR_INSTRUMENT_INFORMATION:
            return instrument;
        default:
            return state
    }
}

const instruments = (state= [], action) => {
    switch (action.type) {
        case types.SET_INSTRUMENTS:
            return action.payload
            case types.CLEAR_INSTRUMENTS_LIST:
                return [];
        default:
            return state
    }
}

export default combineReducers({
    addInstrument,
    instruments,
})
