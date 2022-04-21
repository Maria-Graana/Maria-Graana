

import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import moment from 'moment-timezone'
import { Keyboard } from 'react-native'

const submitNotification = (body, date) => {
  Keyboard.dismiss()
  const trigger = convertTimeZone(date);
  
  let localNotification = {
    title:` ${body.title} ${body.clientName?  "with "+body.clientName : ''}`,
    body: body.body,
    data: {
      type: 'local',
      date: date,
      id: body.id,
      
    },
    sound: 'default',
  }
  Notifications.scheduleNotificationAsync({
    content: localNotification,
    trigger: {
      date: trigger,
    },
  })
}

const convertTimeZone = (date) => {
  let _format = 'YYYY-MM-DDTHH:mmZ'
  let paktz = moment(date).format(_format)
  var duration = moment.duration({ minutes:15 })
  var sub = moment(paktz, _format).subtract(duration).format()
  return new Date(sub)
}

const handleNotification = () => {
  console.warn('ok! got your notif')
}

const askNotification = async (body, date) => {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      return
    }
    submitNotification(body, date)
  } else {
    console.log('Must use physical device for Notifications')
  }
}

const TimerNotification = (body, date) => {

  askNotification(body, date)
}

export default TimerNotification

