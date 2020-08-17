
import * as types from '../types';
import axios from 'axios';

const getCount = (response) => ({
    type: types.UPDATE_LISTING_COUNT,
    payload: response.data,
});

export function getListingsCount() {
    return (dispatch, getsState) => {
        //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
        axios.get(`/api/inventory/counts`).then(response => {
            dispatch(getCount(response));
        }).catch(error => {
            console.log('error', error);
        })
    }
}