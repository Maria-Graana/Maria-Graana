/** @format */

import * as React from 'react'
import { connect } from 'react-redux'
import Constants from 'expo-constants'
import { View, Alert, Platform } from 'react-native'
import axios from 'axios'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
// import * as Sentry from 'sentry-expo'

class AndroidNotifications extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fcmPushToken: null,
    }
  }

  componentDidMount = () => {
    this.registerForPushNotificationsAsync()
  }

  async allowsNotificationsAsync() {
    const settings = await Notifications.getPermissionsAsync();
    return (
      settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    );
  }


  async requestPermissionsAsync() {
    return await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
  }

  registerForPushNotificationsAsync = async () => {
    const { user } = this.props
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.getPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== 'granted') {

        if (Platform.OS === 'ios') {

          const checkPermissions = await this.allowsNotificationsAsync();

          if (!checkPermissions) {

            const reqResponse = await this.requestPermissionsAsync()
            console.log("responsee", reqResponse)
            if(reqResponse.status=='denied')
            {
              Alert.alert('Please allow push notifications. ')
            }
          }
        }
        else {


          Alert.alert('Failed to get push token for push notification!')
          return
        }
      }
      // let fcmPushToken = await Notifications.getDevicePushTokenAsync({ gcmSenderId: '372529293613' })
      let expoPushToken = (await Notifications.getExpoPushTokenAsync()).data
      if (expoPushToken) {
        let body = this.generatePayload()
        body.token = expoPushToken
        body.armsuserId = user.id
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
    Notifications.setNotificationCategoryAsync('call', [
      { identifier: 'call', buttonTitle: 'Call' },
    ])
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        color: '#2A7EF0',
      })
      Notifications.setNotificationChannelAsync('development', {
        name: 'Development',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        color: '#2A7EF0',
      })
      Notifications.setNotificationChannelAsync('reminder', {
        name: 'Reminder',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        color: '#2A7EF0',
      })
    }
  }

  generatePayload = () => {
    let body = {
      deviceDetails: {
        osName: Device.osName,
        osVersion: Device.osVersion,
        deviceName: Device.deviceName,
        brand: Device.brand,
        deviceYearClass: Device.deviceYearClass,
        modelId: Device.modelId,
        modelName: Device.modelName,
      },
      deviceId: Constants.deviceId,
    }
    return body
  }

  notify = () => {
    fetch('https://exp.host/--/api/v2/push/send', {
      body: JSON.stringify({
        to: 'ExponentPushToken[UQtndmHz3RHP-2xmmjB6Sx]',
        title: 'Test Title',
        body: 'Test Body',
        data: { random: Math.random() },
        // categoryIdentifier: 'basic',
        // _category: 'basic',
        categoryId: 'call',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
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

export default connect(mapStateToProps)(AndroidNotifications)
