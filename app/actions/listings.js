
import * as types from '../types';
import axios from 'axios';

export function getListingsCount() {
    return (dispatch, getsState) => {
        //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
        axios.get(`/api/inventory/counts`).then(response => {
            dispatch({
                type: types.UPDATE_LISTING_COUNT,
                payload: response.data,
            })
        }).catch(error => {
            console.log('error', error);
        })
    }
}