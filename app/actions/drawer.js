
import * as types from '../types';
import * as Contacts from 'expo-contacts';

export function setDrawerInternalMenu(value) {
    return (dispatch, getsState) => {
    dispatch({
        type: types.SET_DRAWER_INTERNAL_MENU,
        payload: value,
    })
    }

}