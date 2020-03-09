import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Landing from '../screens/landing/index';
import { createStackNavigator } from '@react-navigation/stack';
import MyDrawer from './DrawerNavigator';
import Diary from '../screens/Diary/index';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainStack from './StackNavigator';
import CustomDrawerContent from '../components/Drawer/index';

const Drawer = createDrawerNavigator();

function RootStack() {
  return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Drawer.Navigator drawerContent={navigation => CustomDrawerContent(navigation)}>
                    <Drawer.Screen name="MainStack" component={MainStack} />
                </Drawer.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default RootStack;
