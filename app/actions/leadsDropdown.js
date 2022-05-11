
import * as types from '../types';
import * as Contacts from 'expo-contacts';

export function setLeadsDropdown(value) {
   
    return (dispatch, getsState) => {
    dispatch({
        type: types.COUNTER_CHANGE,
        payload: value,
    })
    }

}