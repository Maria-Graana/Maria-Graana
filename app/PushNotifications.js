/** @format */

import { Notifications } from 'expo'
import * as React from 'react'
import { connect } from 'react-redux'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'
import { View, Alert, Platform } from 'react-native'
import axios from 'axios'
// import * as Sentry from 'sentry-expo';

class PushNotifications extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fcmPushToken: null,
    }
  }

  componentDidMount = () => {
    this.registerForPushNotificationsAsync()
    this._notificationSubscription = Notifications.addListener(this._handleNotification)
  }

  registerForPushNotificationsAsync = async () => {
    const { user } = this.props
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!')
        return
      }

      // let fcmPushToken = await Notifications.getDevicePushTokenAsync({ gcmSenderId: '372529293613' })

      let expoPushToken = await Notifications.getExpoPushTokenAsync()

      if (expoPushToken) {
        let body = {
          token: expoPushToken,
          armsuserId: user.id,
        }
        axios
          .post('/api/notifications/add-token', body)
          .then((res) => {
            this.setState({
              expoPushToken: expoPushToken,
            })
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        Alert.alert('No Token Found!')
      }
    } else {
      console.log('Must use physical device for Push Notifications')
    }
    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'Default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      })
      Notifications.createChannelAndroidAsync('development', {
        name: 'Development',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      })
      Notifications.createChannelAndroidAsync('reminder', {
        name: 'Reminder',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      })
    }
  }

  _handleNotification = (notification) => {
    const { navigation } = this.props
    if (notification.origin === 'selected') {
      let data = notification && notification.data
      if (data.type === 'local')
        navigation.navigate('Diary', { openDate: data.date, screen: 'Diary' })
      if (data.type === 'investLead') navigation.navigate('Leads', { screen: 'Invest' })
      if (data.type === 'buyLead') navigation.navigate('Leads', { screen: 'Buy' })
      if (data.type === 'rentLead') navigation.navigate('Leads', { screen: 'Rent' })
      if (data.type === 'diary')
        navigation.navigate('Diary', { openDate: data.date, screen: 'Diary' })
    }
  }

  sendPushNotification = async () => {
    const message = {
      to: this.state.expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'I am here inside apk Bro!',
      data: { data: 'goes here' },
      _displayInForeground: true,
    }
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
  }

  render() {
    return <View />
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(PushNotifications)
