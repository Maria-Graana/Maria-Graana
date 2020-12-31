import { combineReducers } from "redux";
import * as types from '../types';

const payment = {
	installmentAmount: null,
	type: '',
	cmLeadId: null,
	details: '',
	visible: false,
	fileName: '',
	attachments : [],
	uri: '',
	size: null,
	title: '',
	taxIncluded: false,
	paymentCategory: '',
	whichModalVisible: '',
}

const CMPayment = (state = payment, action) => {
	switch (action.type) {
		case types.SET_CM_PAYMENT:
			return action.payload;
		default: return state
	}
}

export default combineReducers({
	CMPayment
})