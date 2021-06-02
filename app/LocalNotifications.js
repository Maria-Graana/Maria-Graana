/** @format */

import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import moment from 'moment-timezone'
import { Keyboard } from 'react-native'
import { color } from 'react-native-reanimated'

const submitNotification = (body, date) => {
  Keyboard.dismiss()
  let _format = 'YYYY-MM-DDTHH:mm:ssZ'
  let paktz = moment.tz(date, 'Asia/Karachi').format(_format)
  console.log('paktz: ', paktz)
  var duration = moment.duration({ hours: 4, minutes: 45 })
  console.log('moment(paktz, _format).subtract(duration).format(): ', moment(paktz).format(_format))
  var trigger = new Date(moment(paktz).add(duration).format(_format))
  // let duration = moment.duration({ hours: 4, minutes: 45 })
  // let trigger = moment(date).add(duration).format()
  // console.log('trigger after added duration: ', trigger)
  // trigger = new Date(moment(date).add(duration).format())
  console.log('trigger after new date: ', trigger)
  let localNotification = {
    title: body.title,
    body: body.body,
    data: {
      type: 'local',
      date: date,
      id: body.id,
    },
    sound: 'default',
  }
  console.log('localNotification: ', localNotification)
  console.log('trigger: ', trigger)
  Notifications.scheduleNotificationAsync({
    content: localNotification,
    trigger,
  })
}

const handleNotification = () => {
  console.warn('ok! got your notif')
}

const askNotification = async (body, date) => {
  // if (Constants.isDevice) {
  //   const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
  //   let finalStatus = existingStatus
  //   if (existingStatus !== 'granted') {
  //     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
  //     finalStatus = status
  //   }
  //   if (finalStatus !== 'granted') {
  //     return
  //   }
  //   submitNotification(body, date)
  // } else {
  //   console.log('Must use physical device for Notifications')
  // }
  submitNotification(body, date)
}

const TimerNotification = (body, date) => {
  askNotification(body, date)
}

export default TimerNotification
