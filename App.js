import * as Font from 'expo-font';
import * as Sentry from 'sentry-expo';

import { persistor, store } from './app/store';

import { AppLoading } from 'expo';
// import * as firebase from 'firebase';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import React from 'react';
import { Root } from "native-base";
import RootStack from './app/navigation/AppNavigation'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from 'expo';
import { setCustomTouchableOpacity } from 'react-native-global-props'
import helper from './app/helper';
import config from './app/config';
import axios from 'axios';
import { AsyncStorage } from 'react-native';

// const firebaseConfig = {
// 	apiKey: "AIzaSyBcMF6jv0j0EY82JC9XW0jKMu4o7fRDKrg",
// 	authDomain: "graana-push-notification-e4375.firebaseapp.com",
// 	databaseURL: "https://graana-push-notification-e4375.firebaseio.com",
// 	storageBucket: "graana-push-notification-e4375.appspot.com",
// 	measurementId: "G-8CRWYW95PT"
//   }

export default class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isReady: false,
		};
	}

	async componentDidMount() {
		setCustomTouchableOpacity({ activeOpacity: 0.8 })
		SplashScreen.preventAutoHide();
		axios.defaults.baseURL = config.apiPath
		const retrievedItem = AsyncStorage.getItem('token')
			.then((token) => {
				if (token) {
					axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(token)
				}
			})
		axios.interceptors.request.use(config =>
			new Promise(resolve => {
				const retrievedItem = AsyncStorage.getItem('token')
					.then((token) => {
						if (token) {
							config.headers.Authorization = 'Bearer ' + JSON.parse(token)
						}
					})
				resolve(config)
			})
		)
		// firebase.initializeApp(firebaseConfig)
		Sentry.init({
			dsn: 'https://d23d9b7296fa43a1ab41150269693c2f@o375514.ingest.sentry.io/5195102',
		})
		Sentry.setRelease(Constants.manifest.revisionId);

		await Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'),
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
			OpenSans_regular: require('./assets/fonts/OpenSans-Regular.ttf'),
			OpenSans_bold: require('./assets/fonts/OpenSans-Bold.ttf'),
			OpenSans_light: require('./assets/fonts/OpenSans-Light.ttf'),
			OpenSans_semi_bold: require('./assets/fonts/OpenSans-SemiBold.ttf'),
			...Ionicons.font,
		});
		this.setState({ isReady: true });
	}

	render() {
		if (!this.state.isReady) {
			return <AppLoading />;
		}
		return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<SafeAreaProvider>
						<Root>
							<PaperProvider>
								<RootStack />
							</PaperProvider>
						</Root>
					</SafeAreaProvider>
				</PersistGate>
			</Provider>
		)
	}
}
