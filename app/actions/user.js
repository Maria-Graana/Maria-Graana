/** @format */

import * as types from '../types'

import { AsyncStorage } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import axios from 'axios'
import config from '../config'
// import * as Sentry from 'sentry-expo'
import * as WebBrowser from 'expo-web-browser'
import Constants from 'expo-constants'

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
      // if (config.channel === 'production') {
      //   Sentry.captureException(`Login API Source Cancel! ${JSON.stringify(data.email)}`)
      // }
      source.cancel()
    }, 10000)
    // if (config.channel === 'production') {
    //   Sentry.captureException(
    //     `Login Action Loading And Before API call! ${JSON.stringify(
    //       data.email
    //     )}! URL:${JSON.stringify(axios.defaults.baseURL)}`
    //   )
    // }
    return axios
      .post(`/api/user/login`, data, { cancelToken: source.token })
      .then((response) => {
        // if (config.channel === 'production') {
        //   Sentry.captureException(`Login API Success Response! ${JSON.stringify(data.email)}`)
        // }
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
        console.log(error)
        console.log('crashing', error.response.data)
        dispatch({
          type: types.SET_USER_ERROR,
          payload: error.response ? error.response.data : error.message,
        })
        // if (config.channel === 'production') {
        //   Sentry.captureException(
        //     `Login API Catch Response ERROR! ${JSON.stringify(data.email)}: ${JSON.stringify(
        //       error.response.data
        //     )}`
        //   )
        // }
        return error
      })
      .finally(() => {
        dispatch({
          type: types.USER_LOADED,
        })
      })
      .finally(() => {
        dispatch({
          type: types.USER_LOADED,
        })
        // if (config.channel === 'production') {
        //   Sentry.captureException(`Login API Finally Response! ${JSON.stringify(data.email)}`)
        // }
      })
  }
}

export function logoutUser() {
  return (dispatch, getsState) => {
    let body = {
      deviceId: Constants.deviceId,
    }
    axios.patch(`/api/user/logoutDevice`, body).then((res) => {
      deleteAuthorizationToken()
      removeItem('token')
    })
    // removeBaseUrl()
    dispatch({
      type: types.LOGOUT_USER,
    })
    dispatch({
      type: types.REMOVE_USER_ERROR,
    })
  }
}

export function checkPermissions(roleId, data) {
  return (dispatch, getsState) => {
    let body = {
      deviceId: Constants.deviceId,
    }
    let source = CancelToken.source()
    setTimeout(() => {
      dispatch({
        type: types.USER_LOADED,
      })
      source.cancel()
    }, 10000)
    axios.get(`/api/rolepermission/fetch?roleId=${roleId}&all=true`).then((res) => {
      console.log(`/api/rolepermission/fetch?roleId=${roleId}&all=true`)
      // console.log('permissions: ', res.data)
      storeItem('permissions', { ...res.data })
      dispatch({
        type: types.SET_USER,
        payload: { ...data },
      })
      dispatch({
        type: types.SET_PERMISSIONS,
        payload: { ...res.data },
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
            dispatch(checkPermissions(response.data.armsUserRoleId, response.data))
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
    getItem('token').then((token) => {
      const url = `${config.apiPath}/api/user/me`
      axios.get(url, { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
        // store in async storage
        dispatch({
          type: types.SET_USER,
          payload: response.data,
        })
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

export function getGoogleAuth() {
  return (dispatch, getsState) => {
    let user = getsState().user.user
    if (user && user.googleAuth) {
      //console.log('auth exists')
      return Promise.resolve(true)
    } else {
      return axios
        .get(`/api/user/auth/googleCalendar`)
        .then((result) => {
          return WebBrowser.openBrowserAsync(result.data).then((browserResult) => {
            if (browserResult.type === 'cancel' || browserResult.type === 'dismiss') {
              dispatch(getCurrentUser())
              return true
            }
          })
        })
        .catch((error) => {
          console.log(error)
          return Promise.reject('Error auth')
        })
    }
  }
}

export function isTerminalUser() {
  return (dispatch, getsState) => {
    let user = getsState().user.user
    let groupManagerParam = ''
    const userRoleId = user.armsUserRoleId
    const userRole = user.armsUserRole
    if (userRole && userRole.groupManger && userRole.groupManger.toString() == 'true') {
      groupManagerParam = `&groupManager=true`
    }
    axios.get(`/api/role/sub-users?roleId=${userRoleId}${groupManagerParam}`).then((res) => {
      if (res && res.data && res.data.length) {
        return dispatch({ type: types.SET_IS_TERMINAL_USER, data: false })
      } else {
        return dispatch({ type: types.SET_IS_TERMINAL_USER, data: true })
      }
    })
  }
}
