import React from 'react';
import RootStack from './app/navigation/AppNavigation'
import { Root } from "native-base";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, persistor } from './app/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

export default function App(props) {
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
