import { combineReducers } from "redux";
import * as types from '../types';

const areas = (state = [], action) => {
    switch (action.type) {
        case types.GET_AREAS:
            return action.payload;
        case types.CLEAR_AREAS:
            return [];
        default: return state
    }
}

const areaLoader = (state = true, action) => {
    switch (action.type) {
        case types.SET_AREA_LOADER:
            return action.payload;
        default: return state
    }
}

const selectedAreas = (state = [], action) => {
    switch (action.type) {
        case types.SET_SELECTED_AREAS:
            return action.payload;
        default: return state
    }
}

export default combineReducers({
    areas,
    selectedAreas,
    areaLoader
})