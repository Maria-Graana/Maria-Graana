import * as types from '../types';

export function setCMPaymennt(payment) {
	return (dispatch, getsState) => {
		dispatch({
			type: types.SET_CM_PAYMENT,
			payload: payment
		})
		return payment
	}
}