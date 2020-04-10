import { combineReducers } from "redux";
import lead from './lead';
import user from './user';
import sale from './sale';
import listings from './listings'

export default combineReducers({
    lead,
    user,
    sale,
    listings
})
