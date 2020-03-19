import React from 'react';
import RootStack from './app/navigation/AppNavigation'
import { AppLoading } from 'expo';
import { Root } from "native-base";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, persistor } from './app/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { connect } from 'react-redux';
import { checkToken } from './app/actions/user';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { SplashScreen } from 'expo';


export default class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isReady: false,
		};
	}

	async componentDidMount() {
		SplashScreen.preventAutoHide();
		await Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'),
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
			OpenSans_regular: require('./assets/fonts/OpenSans-Regular.ttf'),
			OpenSans_bold: require('./assets/fonts/OpenSans-Bold.ttf'),
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
							<RootStack />
						</Root>
					</SafeAreaProvider>
				</PersistGate>
			</Provider>
		)
	}
}
