import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Landing from '../screens/landing/index';
import Diary from '../screens/Diary/index';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

function RootStack() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='Landing' component={Landing} />
            <Stack.Screen name='Diary' component={Diary} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RootStack;
