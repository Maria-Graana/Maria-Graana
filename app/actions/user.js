/** @format */

import * as types from '../types'

import { AsyncStorage } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import axios from 'axios'
import config from '../config'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

export const storeItem = async (key, item) => {
  try {
    let jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item))
    return jsonOfItem
  } catch (error) {}
}

export const getItem = async (key) => {
  try {
    const retrievedItem = await AsyncStorage.getItem(key)
    const item = JSON.parse(retrievedItem)
    return item
  } catch (error) {
    return error
  }
}

export const removeItem = async (key) => {
  try {
    var jsonOfItem = await AsyncStorage.removeItem(key)
    return jsonOfItem
  } catch (error) {}
}

setAuthorizationToken = (token) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

deleteAuthorizationToken = () => {
  axios.defaults.headers.common['Authorization'] = ''
}

setBaseUrl = () => {
  console.log('<<<<<<<<<<<< BASE API >>>>>>>>>>>>')
  console.log(config.apiPath)
  axios.defaults.baseURL = config.apiPath
}

removeBaseUrl = () => {
  axios.defaults.baseURL = ''
}

export function setUpdatesLoader(value) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_UPDATE_LOADER,
      payload: value,
    })
  }
}

export function getListingsCount() {
  return (dispatch, getsState) => {
    //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
    axios
      .get(`/api/inventory/counts`)
      .then((response) => {
        dispatch({
          type: types.UPDATE_LISTING_COUNT,
          payload: response.data,
        })
      })
      .catch((error) => {
        console.log(`/api/inventory/counts`)
        console.log('error', error)
      })
  }
}

export function setuser(data) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.USER_LOADING,
    })
    let source = CancelToken.source()
    setTimeout(() => {
      dispatch({
        type: types.USER_LOADED,
      })
      source.cancel()
    }, 10000)
    return axios
      .post(`/api/user/login`, data, { cancelToken: source.token })
      .then((response) => {
        console.log('<<<<<<<<<< User >>>>>>>>>>>>>>')
        console.log(response.data)
        storeItem('token', response.data.token)
        setAuthorizationToken(response.data.token)
        // setBaseUrl()
        dispatch(checkToken())
        dispatch({
          type: types.SET_USER,
          payload: { ...response.data },
        })
        dispatch({
          type: types.USER_LOADED,
        })
        dispatch({
          type: types.SET_TOKEN_SUCCESS,
        })
        return response
      })
      .catch((error) => {
        dispatch({
          type: types.USER_LOADED,
        })
        dispatch({
          type: types.SET_USER_ERROR,
          payload: error.response ? error.response.data : error.message,
        })
        return error
      })
      .finally(() => {
        dispatch({
          type: types.USER_LOADED,
        })
      })
  }
}

export function logoutUser() {
  return (dispatch, getsState) => {
    deleteAuthorizationToken()
    // removeBaseUrl()
    removeItem('token')
    dispatch({
      type: types.LOGOUT_USER,
    })
    dispatch({
      type: types.REMOVE_USER_ERROR,
    })
  }
}

export function checkToken() {
  return (dispatch, getsState) => {
    getItem('token').then((token) => {
      if (token) {
        let source = CancelToken.source()
        setTimeout(() => {
          dispatch({
            type: types.USER_LOADED,
          })
          source.cancel()
        }, 10000)
        axios
          .get(
            `/api/user/me`,
            { headers: { Authorization: `Bearer ${token}` } },
            { cancelToken: source.token }
          )
          .then((response) => {
            setAuthorizationToken(token)
            // setBaseUrl()
            dispatch({
              type: types.SET_USER,
              payload: { ...response.data },
            })
            dispatch({
              type: types.USER_LOADED,
            })
            dispatch({
              type: types.SET_TOKEN_SUCCESS,
            })
            dispatch(getListingsCount())
            SplashScreen.hideAsync()
          })
          .catch((error) => {
            SplashScreen.hideAsync()
            dispatch({
              type: types.SET_TOKEN_ERROR,
              payload: error.response ? error.response.data : error.message,
            })
            console.log(error.message)
          })
      } else {
        console.log('SET_TOKEN_ERROR')
        dispatch({
          type: types.SET_TOKEN_ERROR,
        })
        SplashScreen.hideAsync()
      }
    })
  }
}

export function getCurrentUser() {
  return (dispatch, getsState) => {
    axios
      .post(`${config.apiPath}/api/user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        // store in async storage
        dispatch({
          type: types.SET_USER,
          payload: response.data,
        })
      })
  }
}

export function setInternetConnection(value) {
  return (dispatch, getsState) => {
    dispatch({
      type: types.SET_INTERNET_CONNECTION,
      payload: value,
    })
  }
}
