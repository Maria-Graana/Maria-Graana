import { combineReducers } from "redux";
import * as types from '../types';

const rcmPayment = {
	installmentAmount: null,
	type: '',
	rcmLeadId: null,
	details: '',
	visible: false,
	paymentAttachments: [],
	addedBy: null,
	armsUserId: null,
}

const RCMPayment = (state = rcmPayment, action) => {
	switch (action.type) {
		case types.SET_RCM_PAYMENT:
			return action.payload;
		default: return state
	}
}

export default combineReducers({
	RCMPayment
})