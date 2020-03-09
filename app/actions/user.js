import * as types from '../types';
import {AsyncStorage} from 'react-native';
import devConstants, {apiUrl} from '../constants';
import axios from 'axios';
import { StackActions, NavigationActions } from 'react-navigation';
import config from '../config';

storeItem = async (key, item) =>  {
    try {
        var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
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

export function setuser(data, navigation){
    return (dispatch, getsState) => {
        dispatch({
            type: types.USER_LOADING
        })
        axios.post(`${config.apiPath}/api/user/login`, data).then((response) => {
            console.log(response.data)
            storeItem('token', response.data.token)
            setAuthorizationToken(response.data.token)
            setBaseUrl()
             dispatch({
                type: types.SET_USER,
                payload: {...response.data},
            })
            dispatch({
                type: types.USER_LOADED
            })
            dispatch({
                type: types.REMOVE_USER_ERROR
            })
            navigation.navigate('App')
        })
        .catch((error) => {
            console.log('crashing', error.response.data)
            dispatch({
                type: types.USER_LOADED
            })
            dispatch({
                type: types.SET_USER_ERROR,
                payload: error.response ? error.response.data : error.message,
            })
        })
    }
}

export function logoutUser(navigation){
    return (dispatch, getsState) => {
        deleteAuthorizationToken();
        dispatch({
            type: types.LOGOUT_USER,
        })
        navigation.navigate('Login')
    }
}

export function checkToken(props){
    return (dispatch, getsState) => {
        if(props.user) {
            if(props.user.token != undefined || props.user.token != null){
                dispatch({
                    type: types.USER_LOADING
                })
                axios.get(`${config.apiPath}/api/user/me?id=${props.user.id}`, { headers: { "Authorization": `Bearer ${props.user.token}` } })
                .then((response) => {
                    setAuthorizationToken(props.user.token)
                    setBaseUrl()
                    // dispatch({
                    //     type: types.SET_USER,
                    //     payload: {...response.data},
                    // })
                    dispatch({
                        type: types.SET_TOKEN_SUCCESS
                    })
                    dispatch({
                        type: types.USER_LOADED
                    })
                    props.navigation.navigate('App')
                })
                .catch((error) => {
                    console.log(error.message)
                    dispatch({
                        type: types.SET_USER_ERROR,
                        payload: error.response ? error.response.data : error.message,
                    })
                    props.dispatch(logoutUser(props.navigation))
                })
            }else{
                console.log('SET_TOKEN_ERROR')
                dispatch({
                    type: types.SET_TOKEN_ERROR,
                })
                props.dispatch(logoutUser(props.navigation))  
            }
        } else {
            dispatch({
                type: types.SET_TOKEN_ERROR,
            })
            props.dispatch(logoutUser(props.navigation))
        }
    }   
}

export function getCurrentUser() {
    return (dispatch, getsState) => {
        axios.post(`${apiUrl}/api/user/me`, {headers: {Authorization: `Bearer ${token}`}}).then((response) => {
            // store in async storage
             dispatch({
                type: types.SET_USER,
                payload: response.data,
            })
        })
    }
}