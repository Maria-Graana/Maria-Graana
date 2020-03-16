import { combineReducers } from "redux";
import * as types from '../types';

const saleName = (state = null, action) => {
    switch(action.type) {
        case types.SET_SALE:
            return action.payload
        default: return state
    }
}

export default combineReducers({
    name: saleName
})