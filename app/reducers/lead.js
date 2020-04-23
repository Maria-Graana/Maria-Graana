import { combineReducers } from "redux";
import * as types from '../types';


const lead = (state = {}, action) => {
    switch (action.type) {
        case types.SET_LEAD:
            return action.payload
        case types.REMOVE_LEAD:
            return {};
        default: return state
    }
}

export default combineReducers({
    lead
})