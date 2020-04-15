import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Meetings from '../screens/Meetings/index';
import Payments from '../screens/Payments/index';
import React from 'react';
import styles from './style';

const Tab = createMaterialTopTabNavigator();

export default function CMLeadTabs() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                scrollEnabled: true,
                labelStyle: { fontSize: 12 },
                tabStyle: { width: 206},
                // style: { shadowColor: 'transparent', elevation: 0, borderTopColor: "transparent", borderTopWidth: 0 },
            }}>
            <Tab.Screen name="Meetings" component={Meetings} />
            <Tab.Screen name="Payments" component={Payments} />
        </Tab.Navigator>
    );
}