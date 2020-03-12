import React from 'react';
import RootStack from './app/navigation/AppNavigation'
import { Root } from "native-base";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, persistor } from './app/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { connect } from 'react-redux';
import { checkToken } from './app/actions/user';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';


export default class App extends React.Component {
	constructor(props) {
		super(props)
	}

	async componentDidMount() {
		await Font.loadAsync({
			Roboto: require('native-base/Fonts/Roboto.ttf'),
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
			...Ionicons.font,
		});
		this.setState({ isReady: true });
	}

	render() {
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
