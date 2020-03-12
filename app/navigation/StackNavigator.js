import React from 'react';
import Landing from '../screens/Landing/index';
import { createStackNavigator } from '@react-navigation/stack';
import Diary from '../screens/Diary/index';
import Login from '../screens/Login/index';
import Inventory from '../screens/Inventory/index';
import AddDiary from '../screens/AddDiary';

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
            <Stack.Screen name='AddDiary' component={AddDiary} />
        </Stack.Navigator>
    );
}

export default MainStack;
