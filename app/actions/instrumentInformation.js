/** @format */

import * as types from '../types'

export function setInstrumentInformation(instrument) {
    return (dispatch, getsState) => {
      dispatch({
        type: types.SET_INSTRUMENT_INFORMATION,
        payload: instrument,
      })
      return instrument
    }
}