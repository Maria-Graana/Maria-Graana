import * as types from '../types';
import { combineReducers } from 'redux';


const contacts = (state = '', action) => {
    switch (action.type) {
        case types.SET_CONTACTS:
            return action.payload
        case types.REMOVE_CONTACTS:
            return null;
        default: return state
    }
}

export default combineReducers({
    contacts
})