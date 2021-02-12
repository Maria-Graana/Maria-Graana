/** @format */

import * as Font from 'expo-font'
import * as Sentry from 'sentry-expo'
import { persistor, store } from './app/store'
import { AppLoading } from 'expo'
import Constants from 'expo-constants'
import { Ionicons } from '@expo/vector-icons'
import { Provider as PaperProvider } from 'react-native-paper'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import React from 'react'
import { Root } from 'native-base'
import RootStack from './app/navigation/AppNavigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as SplashScreen from 'expo-splash-screen'
import config from './app/config'
import axios from 'axios'
import { AsyncStorage, LogBox } from 'react-native'
import * as RootNavigation from './app/navigation/RootNavigation'
import * as Notifications from 'expo-notifications'
import { NavigationContainer } from '@react-navigation/native'
import NetInfo from '@react-native-community/netinfo'
import { navigationRef } from './app/navigation/RootNavigation'
import { setInternetConnection } from './app/actions/user'
import {
  setCustomImage,
  setCustomText,
  setCustomTextInput,
  setCustomTouchableOpacity,
} from 'react-native-global-props'
import * as Updates from 'expo-updates'

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
    if (config.channel === 'production') {
      Sentry.init({
        dsn: 'https://95bf407ef0f042b1b985d4efe8a8a75f@sentry.graana.rocks/8',
      })
      Sentry.setRelease(Constants.manifest.revisionId)
    }
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      OpenSans_regular: require('./assets/fonts/OpenSans-Regular.ttf'),
      OpenSans_bold: require('./assets/fonts/OpenSans-Bold.ttf'),
      OpenSans_light: require('./assets/fonts/OpenSans-Light.ttf'),
      OpenSans_semi_bold: require('./assets/fonts/OpenSans-SemiBold.ttf'),
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

  _handleNotification = (response) => {
    const { navigation } = this.props
    let notification = response.notification
    if (
      response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER &&
      notification.request
    ) {
      let content = notification.request && notification.request.content
      setTimeout(() => {
        this.navigateRoutes(content)
      }, 300)
    }
  }

  navigateRoutes = (content) => {
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
          RootNavigation.navigateTo('Leads', {
            screen: 'Buy',
          })
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
                <NavigationContainer ref={navigationRef}>
                  <RootStack />
                </NavigationContainer>
              </PaperProvider>
            </SafeAreaProvider>
          </Root>
        </PersistGate>
      </Provider>
    )
  }
}
