/** @format */

import { Ionicons } from '@expo/vector-icons'
import NetInfo from '@react-native-community/netinfo'
import { NavigationContainer } from '@react-navigation/native'
import axios from 'axios'
import AppLoading from 'expo-app-loading'
import Constants from 'expo-constants'
import * as Font from 'expo-font'
import * as Notifications from 'expo-notifications'
import * as SplashScreen from 'expo-splash-screen'
import { Root } from 'native-base'
import React from 'react'
import { AsyncStorage, Linking, LogBox } from 'react-native'
import {
  setCustomText,
  setCustomTextInput,
  setCustomTouchableOpacity,
} from 'react-native-global-props'
import { Provider as PaperProvider } from 'react-native-paper'
import AppJson from './app.json'
import { MenuProvider } from 'react-native-popup-menu'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
// import * as Sentry from 'sentry-expo'
import { setPPBuyNotification } from './app/actions/notification'
import { setInternetConnection } from './app/actions/user'
import config from './app/config'
import helper from './app/helper'
import RootStack from './app/navigation/AppNavigation'
import * as RootNavigation from './app/navigation/RootNavigation'
import { navigationRef } from './app/navigation/RootNavigation'
import { persistor, store } from './app/store'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this._notificationSubscription = Notifications.addNotificationResponseReceivedListener(
      this._handleNotification
    )
    this.state = {
      isReady: false,
    }
  }

  async componentDidMount() {
    this.setState({ isReady: true }, () => {
      NetInfo.addEventListener((state) => {
        store.dispatch(setInternetConnection(state.isConnected && state.isInternetReachable))
      })
    })

    setCustomTouchableOpacity({ activeOpacity: 0.8 })
    SplashScreen.preventAutoHideAsync()
    setBaseUrl()
    axios.defaults.baseURL = config.apiPath
    const retrievedItem = AsyncStorage.getItem('token').then((token) => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(token)
      }
    })
    axios.defaults.headers['version'] = AppJson.expo.version
    // axios.defaults.headers['version'] = '3.0.7'
    axios.interceptors.request.use(
      (config) =>
        new Promise((resolve) => {
          const retrievedItem = AsyncStorage.getItem('token').then((token) => {
            if (token) {
              config.headers.Authorization = 'Bearer ' + JSON.parse(token)
            }
          })
          resolve(config)
        })
    )
    axios.interceptors.response.use(undefined, function (error) {
      if (error && error.response && error.response.data.msg === 'update version') {
        helper.errorToast(
          `Please upgrade ARMS application to latest version (${error.response.data.version})`
        )
      }
    })
    axios.interceptors.request.use(
      (config) =>
        new Promise((resolve) => {
          const retrievedItem = AsyncStorage.getItem('token').then((token) => {
            if (token) {
              config.headers.Authorization = 'Bearer ' + JSON.parse(token)
            }
          })
          resolve(config)
        })
    )
    // if (config.channel === 'production') {
    //   Sentry.init({
    //     enableInExpoDevelopment: false,
    //     dsn: 'https://ed71a841530f479cb60896ee2db0788f@sentry.graana.rocks/7',
    //   })
    //   Sentry.setRelease(Constants.manifest.revisionId)
    // }
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      OpenSans_regular: require('./assets/fonts/OpenSans-Regular.ttf'),
      OpenSans_bold: require('./assets/fonts/OpenSans-Bold.ttf'),
      OpenSans_light: require('./assets/fonts/OpenSans-Light.ttf'),
      OpenSans_semi_bold: require('./assets/fonts/OpenSans-SemiBold.ttf'),
      Poppins_regular: require('./assets/fonts/Poppins-Regular.ttf'),
      Poppins_bold: require('./assets/fonts/Poppins-Bold.ttf'),
      Poppins_light: require('./assets/fonts/Poppins-Light.ttf'),
      Poppins_semi_bold: require('./assets/fonts/Poppins-SemiBold.ttf'),
      ...Ionicons.font,
    })
    const customTextProps = {
      allowFontScaling: false,
      // style: {
      //   fontSize: 18,
      //   fontFamily: 'OpenSans',
      //   color: '#333',
      // },
    }
    const customTextInputProps = {
      allowFontScaling: false,
      // style: {
      //   fontSize: 18
      // }
    }
    setCustomText(customTextProps)
    setCustomTextInput(customTextInputProps)
    LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified'])
  }

  setBaseUrl = () => {
    console.log('<<<<<<<<<<<< BASE API >>>>>>>>>>>>')
    console.log(config.apiPath)
    axios.defaults.baseURL = config.apiPath
  }

  _handleNotification = async (response) => {
    const { navigation } = this.props
    let notification = response.notification
    if (
      response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER &&
      notification.request
    ) {
      setTimeout(() => {
        this.navigateRoutes(notification)
      }, 300)
    } else {
      if (response.actionIdentifier === 'call') {
        setTimeout(() => {
          this.callPayload(notification)
        }, 300)
      }
    }
  }

  callPayload = async (notification) => {
    let content = notification.request && notification.request.content
    let { contacts } = await store.getState()
    let data = content.data
    let newContact = {
      phone: data.number,
      name: data.name !== '- - -' ? data.name : '',
      url: `tel:${data.number}`,
      payload: [
        {
          label: 'mobile',
          number: data.number,
        },
      ],
    }
    helper.callNumber(newContact, contacts, data.role === 'Accounts' ? 'Accounts' : 'ARMS')
  }

  callAgent = async (notification) => {
    let content = notification.request && notification.request.content
    let data = content.data
    let url = `tel:${data.number}`
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          helper.errorToast(`No application available to dial phone number`)
          console.log("Can't handle url: " + url)
        } else {
          Notifications.dismissNotificationAsync(notification.request.identifier).then((res) => {})
          return Linking.openURL(url)
        }
      })
      .catch((err) => console.error('An error occurred', err))
  }

  navigateRoutes = (notification) => {
    let content = notification.request && notification.request.content
    if (content) {
      let data = content.data
      let leadId = data && data.leadId && data.leadId
      let lead = { id: leadId }
      if (data.type === 'local')
        RootNavigation.navigateTo('Diary', { openDate: data.date, screen: 'Diary' })
      if (data.type === 'investLead') {
        if (!data.isPP) {
          RootNavigation.navigateTo('LeadDetail', {
            screen: 'Invest',
            purposeTab: 'invest',
            lead: lead,
          })
        }
      }
      if (data.type === 'call') this.callPayload(notification)
      // data.isPP = true
      if (data.type === 'buyLead') {
        if (!data.isPP) {
          if (data.leadStatus === 'payment') {
            if (data.notificationFor === 'buyer') {
              // buyer screen
              RootNavigation.navigateTo('RCMLeadTabs', {
                screen: 'Payment',
                params: {
                  isFromNotification: true,
                  lead: lead,
                },
              })
            } else {
              // seller screen
              RootNavigation.navigateTo('PropertyTabs', {
                screen: 'Payment',
                params: {
                  isFromNotification: true,
                  lead: lead,
                },
              })
            }
          } else if (data.leadStatus === 'propsure') {
            if (data.notificationFor === 'buyer') {
              // buyer screen
              RootNavigation.navigateTo('RCMLeadTabs', {
                screen: 'Propsure',
                params: {
                  isFromNotification: true,
                  lead: lead,
                },
              })
            } else {
              // seller screen
              RootNavigation.navigateTo('PropertyTabs', {
                screen: 'Propsure',
                params: {
                  isFromNotification: true,
                  lead: lead,
                },
              })
            }
          } else {
            RootNavigation.navigateTo('LeadDetail', {
              screen: 'Buy',
              purposeTab: 'sale',
              lead: lead,
            })
          }
        } else {
          store.dispatch(setPPBuyNotification(true))
        }
      }
      if (data.type === 'rentLead') {
        if (!data.isPP) {
          if (data.leadStatus === 'payment') {
            if (data.notificationFor === 'buyer') {
              // buyer screen
              RootNavigation.navigateTo('RCMLeadTabs', {
                screen: 'Payment',
                params: {
                  isFromNotification: true,
                  lead: lead,
                },
              })
            } else {
              // seller screen
              RootNavigation.navigateTo('PropertyTabs', {
                screen: 'Payment',
                params: {
                  isFromNotification: true,
                  lead: lead,
                },
              })
            }
          } else if (data.leadStatus === 'propsure') {
            if (data.notificationFor === 'buyer') {
              // buyer screen
              RootNavigation.navigateTo('RCMLeadTabs', {
                screen: 'Propsure',
                params: {
                  isFromNotification: true,
                  lead: lead,
                },
              })
            } else {
              // seller screen
              RootNavigation.navigateTo('PropertyTabs', {
                screen: 'Propsure',
                params: {
                  isFromNotification: true,
                  lead: lead,
                },
              })
            }
          } else {
            RootNavigation.navigateTo('LeadDetail', {
              screen: 'Rent',
              purposeTab: 'rent',
              lead: lead,
            })
          }
        } else {
          RootNavigation.navigateTo('Leads', {
            screen: 'Rent',
          })
        }
      }
      if (data.type === 'diary')
        RootNavigation.navigateTo('Diary', { openDate: data.date, screen: 'Diary' })
    }
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />
    }
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Root>
            <SafeAreaProvider>
              <PaperProvider>
                <MenuProvider>
                  <NavigationContainer ref={navigationRef}>
                    <RootStack />
                  </NavigationContainer>
                </MenuProvider>
              </PaperProvider>
            </SafeAreaProvider>
          </Root>
        </PersistGate>
      </Provider>
    )
  }
}
