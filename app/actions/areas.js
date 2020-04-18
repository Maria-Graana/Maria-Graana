import * as types from '../types';
import axios from 'axios';

export function getAreas(cityId) {
    return (dispatch, getsState) => {
        axios.get(`/api/areas?city_id=${cityId}&all=true`)
            .then((res) => {
                let areas = [];
                res && res.data.items.map((item, index) => { return areas.push({ value: item.id, name: item.name })})
                dispatch({
                    type: types.GET_AREAS,
                    payload: areas,
                })
                dispatch(setAreaLoader(false))
            }).catch(error => {
                console.log(error)
            })
    }
}

export function setSelectedAreas(areas) {
    return {
        type: types.SET_SELECTED_AREAS,
        payload: areas
    }
}

export function clearAreas() {
    return {
        type: types.CLEAR_AREAS,
    }
}

export function setAreaLoader(value) {
    return {
        type: types.SET_AREA_LOADER,
        payload: value,
    }
}

