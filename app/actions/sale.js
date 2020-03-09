import * as types from '../types';

export const setSale = (sale) => {
    return {
        type: types.SET_SALE,
        payload: sale
    }
}