/** @format */

import reducers from './reducers'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import { AsyncStorage } from 'react-native'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['loading'],
}

const persistedReducer = persistReducer(persistConfig, reducers)

const middleware = [thunk]
export const store = createStore(persistedReducer, {}, applyMiddleware(...middleware))

export const persistor = persistStore(store)
