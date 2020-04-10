import { Notifications } from 'expo';
import * as React from 'react';
import { connect } from 'react-redux';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { View, Vibration, Alert } from 'react-native';
import axios from 'axios';
import { Textarea } from 'native-base';
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
            console.log(expoPushToken)

            if (expoPushToken) {
                this.setState({
                    expoPushToken: expoPushToken
                })
            }

            let config = {
                gcmSenderId: '372529293613'
            }

            let fcmPushToken = null
            Sentry.captureException(`Before Function Start:`)

            fcmPushToken = await Notifications.getDevicePushTokenAsync(config)

            Sentry.captureException(`After Function End: ${JSON.stringify(fcmPushToken)}`)

            if (fcmPushToken) {
                let body = {
                    token: fcmPushToken.data,
                    armsuserId: user.id,
                    topic: 'fcm-token'
                }
                console.log(body)
                axios.post('/api/notifications/add-token', body)
                    .then((res) => {
                        this.setState({
                            fcmPushToken: fcmPushToken
                        })
                        Alert.alert('FCM: ', fcmPushToken.data)
                        console.log('<<<<<<< >>>>>>>>')
                        console.log(res.data)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } else {
                Alert.alert('No Token Found!')
            }
        } else {
            console.log('Must use physical device for Push Notifications');
        }
        if (Platform.OS === 'android') {
            Notifications.createChannelAndroidAsync('development', {
                name: 'development',
                sound: true,
                priority: 'max',
                vibrate: [0, 250, 250, 250],
            });
        }
        this.sendPushNotification()
    }

    _handleNotification = notification => {
        // Vibration.vibrate();
        console.log('notification: ', notification);
        this.setState({ notification: notification });
    }


    // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
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
        const { fcmPushToken } = this.state
        return (<View>
        </View>)
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(PushNotifications)
