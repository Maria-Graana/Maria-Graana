import { combineReducers } from "redux";
import * as types from '../types';

const CMPayment = (state = [], action) => {
	switch (action.type) {
		case types.SET_CM_PAYMENT:
			return action.payload;
		default: return state
	}
}

export default combineReducers({
	CMPayment
})