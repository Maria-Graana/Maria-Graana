import * as types from '../types';

export function setlead(lead){
    console.log('inside lead dispatch')
    return {
        type: types.SET_LEAD,
        payload: lead
    }
}

export function removelead(lead){
    return {
        type: types.REMOVE_LEAD,
        payload: lead
    }
}