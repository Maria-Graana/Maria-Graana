import React from 'react';
import { Keyboard } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import moment from 'moment-timezone';
import * as Sentry from 'sentry-expo';

const submitNotification = (body, date) => {
    Keyboard.dismiss();
    let duration = moment.duration({ minutes: 15 })
    const trigger = new Date(moment(date).subtract(duration).format())
    let localNotification = {
        title: body.title,
        body: body.body,
        data: {
            type: 'local',
            date: date,
            id: body.id
        },
        sound: 'default'
    }
    console.log(' <<<<<<<<< Local Notification >>>>>>>>>>>')
    console.log(localNotification)
    console.log('trigger: ', trigger)
    Sentry.captureException(`Local localNotification: ${JSON.stringify(localNotification)}`)
    Sentry.captureException(`trigger: ${JSON.stringify(trigger)}`)
    Notifications.scheduleNotificationAsync({
        content: localNotification,
        trigger
    });
};

const handleNotification = () => {
    console.warn('ok! got your notif');
};

const askNotification = async (body, date) => {
    if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(
                Permissions.NOTIFICATIONS
            );
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return;
        }
        submitNotification(body, date)
    } else {
        console.log('Must use physical device for Notifications')
    }
};

const TimerNotification = (body, date) => {
    askNotification(body, date);
};

export default TimerNotification;