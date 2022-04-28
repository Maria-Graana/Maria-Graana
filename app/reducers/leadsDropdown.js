import * as types from '../types';
import { combineReducers } from 'redux';


const leadsDropdown = (state = false, action) => {

    switch (action.type) {
        case types.COUNTER_CHANGE:
            return action.payload
            default:
                return state
    }
}

export default combineReducers({
    leadsDropdown
})