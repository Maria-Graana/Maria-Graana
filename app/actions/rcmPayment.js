import * as types from '../types';

export function setRCMPayment(payment) {
	return (dispatch, getsState) => {
		dispatch({
			type: types.SET_RCM_PAYMENT,
			payload: payment
		})
	}
}
