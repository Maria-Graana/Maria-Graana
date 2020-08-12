
import * as types from '../types';
import * as Contacts from 'expo-contacts';

export function setContacts() {
    return (dispatch, getsState) => {
        return Contacts.requestPermissionsAsync()
            .then((res) => {
                if (res.status === 'granted') {
                    Contacts.getContactsAsync()
                        .then((result) => {
                            if (result.data && result.data.length) {
                                let data = result.data
                                dispatch({
                                    type: types.SET_CONTACTS,
                                    payload: data,
                                })
                                return result.data
                            }
                        })
                }
            })
    }

}