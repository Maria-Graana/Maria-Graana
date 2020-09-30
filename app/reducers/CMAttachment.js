import { combineReducers } from "redux";
import * as types from '../types';

const CMAttachment = (state = [], action) => {
	switch (action.type) {
		case types.SET_CM_ATTACHMENT:
			return action.payload;
		default: return state
	}
}

export default combineReducers({
	CMAttachment
})