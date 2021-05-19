/** @format */

import * as types from '../types'
import axios from 'axios';

export function setInstrumentInformation(instrument) {
    return (dispatch, getsState) => {
        dispatch({
            type: types.SET_INSTRUMENT_INFORMATION,
            payload: instrument,
        })
        return instrument
    }
}

export function clearInstrumentInformation() {
    return (dispatch, getsState) => {
        dispatch({
            type: types.CLEAR_INSTRUMENT_INFORMATION,
        })
    }
}

export function getInstrumentDetails(type, lead) {
    return (dispatch, getsState) => {
        if (type && lead && lead.customerId) {
            axios.get(`api/leads/instruments?instrumentType=${type}&customerId=${lead.customerId}`)
                .then(res => {
                    if (res){
                        dispatch({
                            type: types.SET_INSTRUMENTS,
                            payload: res.data,
                        })
                        return res.data;
                    }
                    else
                        return [];
                })
                .catch(error => {
                    console.log(error)
                    return [];
                })
        }
    }
}