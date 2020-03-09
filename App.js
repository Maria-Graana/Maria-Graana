import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Landing from './app/screens/landing/index';
import { createStackNavigator } from '@react-navigation/stack';
import RootStack from './app/navigation/AppNavigation'

export default function App() {
  return <RootStack />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
