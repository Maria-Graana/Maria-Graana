import * as types from '../types';

export function setCMAttachment(attachment) {
	return (dispatch, getsState) => {
		dispatch({
			type: types.SET_CM_ATTACHMENT,
			payload: attachment
		})
		return attachment
	}
}