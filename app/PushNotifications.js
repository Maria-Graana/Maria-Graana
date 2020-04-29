import { Notifications } from 'expo';
import * as React from 'react';
import { connect } from 'react-redux';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { View, Alert, Platform } from 'react-native';
import axios from 'axios';
import * as Sentry from 'sentry-expo';

class PushNotifications extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fcmPushToken: null
        }
    }

    componentDidMount = () => {
        this.registerForPushNotificationsAsync()
        this._notificationSubscription = Notifications.addListener(this._handleNotification)
    }

    registerForPushNotificationsAsync = async () => {
        const { user } = this.props
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
                alert('Failed to get push token for push notification!');
                return;
            }

            let expoPushToken = await Notifications.getExpoPushTokenAsync();

            if (expoPushToken) {
                this.setState({
                    expoPushToken: expoPushToken
                })
            }

            let fcmPushToken = await Notifications.getDevicePushTokenAsync({ gcmSenderId: '372529293613' })
            Sentry.captureException(`After Function End: ${JSON.stringify(fcmPushToken)}`)

            if (fcmPushToken) {
                let body = {
                    token: fcmPushToken.data,
                    armsuserId: user.id,
                }
                axios.post('/api/notifications/add-token', body)
                    .then((res) => {
                        this.setState({
                            fcmPushToken: fcmPushToken
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
            Notifications.createChannelAndroidAsync('development', {
                name: 'development',
                sound: true,
                priority: 'max',
                vibrate: [0, 250, 250, 250],
            });
        }
    }

    _handleNotification = notification => {
        // Vibration.vibrate();
        this.setState({ notification: notification });
    }


    sendPushNotification = async () => {
        const message = {
            to: this.state.expoPushToken,
            sound: 'default',
            title: 'Original Title',
            body: 'I am here inside apk Bro!',
            data: { data: 'goes here' },
            _displayInForeground: true,
        };
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    };

    render() {
        return (<View />)
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(PushNotifications)
