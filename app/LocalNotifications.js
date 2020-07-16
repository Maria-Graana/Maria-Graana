import React from 'react';
import { Keyboard } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const submitNotification = (body, timeStamp, date) => {
    Keyboard.dismiss();
    const schedulingOptions = {
        time: timeStamp
    };
    let localNotification = {
        title: body.title,
        body: body.body,
        data: {
            type: 'local',
            date: date
        },
        android: {
            channelId: 'reminder',
        },
        ios: {
            sound: true,
        }
    }
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

const askNotification = async (body, timeStamp, date) => {
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
        submitNotification(body, timeStamp, date)
    } else {
        console.log('Must use physical device for Notifications')
    }
};

const TimerNotification = (body, timeStamp, date) => {
    askNotification(body, timeStamp, date);
};

export default TimerNotification;