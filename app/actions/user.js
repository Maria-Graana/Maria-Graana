import * as types from '../types';

import {AsyncStorage} from 'react-native';
import { SplashScreen } from 'expo';
import axios from 'axios';
import config from '../config';

storeItem = async (key, item) =>  {
    try {
        let jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
        return jsonOfItem;
    } catch (error) {
    }
  }

getItem = async (key) => {
    try {
      const retrievedItem =  await AsyncStorage.getItem(key);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error) {
        return error
    }
}

removeItem = async (key) =>  {    
    try {
        var jsonOfItem = await AsyncStorage.removeItem(key);
        return jsonOfItem;
    } catch (error) {
    }
}

setAuthorizationToken = (token) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`     
}

deleteAuthorizationToken = () => {
    axios.defaults.headers.common['Authorization'] = '';
}

setBaseUrl = () => {
    console.log('<<<<<<<<<<<< BASE API >>>>>>>>>>>>')
    console.log(config.apiPath)
    axios.defaults.baseURL = config.apiPath;
}

removeBaseUrl = () => {
    axios.defaults.baseURL = '';
}

export function setuser(data){
    return (dispatch, getsState) => {
        dispatch({
            type: types.USER_LOADING
        })
        return axios.post(`${config.apiPath}/api/user/login`, data).then((response) => {
            console.log('<<<<<<<<<< User >>>>>>>>>>>>>>')
            console.log(response.data)
            storeItem('token', response.data.token)
            setAuthorizationToken(response.data.token)
            setBaseUrl()
            dispatch(checkToken())
            dispatch({
                type: types.SET_USER,
                payload: {...response.data},
            })
            dispatch({
                type: types.USER_LOADED
            })
            dispatch({
                type: types.SET_TOKEN_SUCCESS
            })
            return response
        })
        .catch((error) => {
            console.log(error)
            console.log('crashing', error.response.data)
            dispatch({
                type: types.USER_LOADED
            })
            dispatch({
                type: types.SET_USER_ERROR,
                payload: error.response ? error.response.data : error.message,
            })
            return error
        })
    }
}

export function logoutUser(){
    return (dispatch, getsState) => {
        deleteAuthorizationToken();
        removeBaseUrl();
        removeItem('token');
        dispatch({
            type: types.LOGOUT_USER,
        })
    }
}

export function checkToken(){
    return (dispatch, getsState) => {
        getItem('token').then((token) => {
            if (token) {
                axios.get(`${config.apiPath}/api/user/me`, { headers: { "Authorization": `Bearer ${token}` } })
                .then((response) => {
                    setAuthorizationToken(token)
                    setBaseUrl()
                    // console.log(response.data)
                    dispatch({
                        type: types.SET_USER,
                        payload: {...response.data},
                    })
                    dispatch({
                        type: types.USER_LOADED
                    })
                    dispatch({
                        type: types.SET_TOKEN_SUCCESS
                    })
                    SplashScreen.hide();
                })
                .catch((error) => {
                    SplashScreen.hide();
                    console.log(error.message)
                    dispatch({
                        type: types.SET_TOKEN_ERROR,
                        payload: error.response ? error.response.data : error.message,
                    })
                })                
            } else {
                console.log('SET_TOKEN_ERROR')
                dispatch({
                    type: types.SET_TOKEN_ERROR,
                })
                SplashScreen.hide();
            }
        })
    }   
}

export function getCurrentUser() {
    return (dispatch, getsState) => {
        axios.post(`${config.apiPath}/api/user/me`, {headers: {Authorization: `Bearer ${token}`}}).then((response) => {
            // store in async storage
             dispatch({
                type: types.SET_USER,
                payload: response.data,
            })
        })
    }
}