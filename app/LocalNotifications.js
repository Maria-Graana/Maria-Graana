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