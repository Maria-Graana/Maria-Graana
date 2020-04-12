import React from 'react';
import { Keyboard } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

const localNotification = {
    title: 'Meeting',
    body: 'Meeting!',
    android: {
        sound: true,
    },
    ios: {
        sound: true,
    }
};

const submitNotification = (body, date) => {
    Keyboard.dismiss();
    const schedulingOptions = {
        time: date
    };
    console.log('inside 3 ', body)
    localNotification.title = body.title
    localNotification.body = body.body
    console.log(' <<<<<<<<< Local Notification >>>>>>>>>>>')
    console.log(localNotification)
    console.log(schedulingOptions)
    Notifications.scheduleLocalNotificationAsync(
        localNotification,
        schedulingOptions,
    );
};

const handleNotification = () => {
    console.warn('ok! got your notif');
};

const askNotification = async (body, date) => {
    console.log('inside 1 ', body)
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
        console.log('inside 2 ', body)
        submitNotification(body, date)
    } else {
        console.log('Must use physical device for Notifications')
    }
};

const TimerNotification = (body, date) => {
    console.log('inside 0 ', body)
    askNotification(body, date);
};

export default TimerNotification;