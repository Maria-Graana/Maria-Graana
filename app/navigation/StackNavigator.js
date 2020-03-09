import React from 'react';
import Landing from '../screens/landing/index';
import { createStackNavigator } from '@react-navigation/stack';
import Diary from '../screens/Diary/index';
import Inventory from '../screens/Inventory/index';

const Stack = createStackNavigator();

function MainStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: false,
            }}
        >
            <Stack.Screen name="Landing" component={Landing} />
            <Stack.Screen name='Diary' component={Diary} />
            <Stack.Screen name='Inventory' component={Inventory} />
        </Stack.Navigator>
    );
}

export default MainStack;
