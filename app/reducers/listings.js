import { combineReducers } from "redux";
import * as types from '../types';

const count = (state = {}, action) => {
    switch (action.type) {
        case types.UPDATE_LISTING_COUNT:
            return action.payload;
        default: return state
    }
}

export default combineReducers({
    count
})