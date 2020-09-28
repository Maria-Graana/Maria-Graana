import * as types from '../types';

export function setlead(lead){
    return {
        type: types.SET_LEAD,
        payload: lead
    }
}

export function setLeadRes(lead){
    return (dispatch, getsState) => {
        dispatch({
            type: types.SET_LEAD,
            payload: lead
        })
        return lead
    }
}

export function removelead(lead){
    return {
        type: types.REMOVE_LEAD,
        payload: lead
    }
}