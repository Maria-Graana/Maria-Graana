import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Meetings from '../screens/Meetings/index';
import Payments from '../screens/Payments/index';
import React from 'react';
import styles from './style';
import { Dimensions } from 'react-native'
const { width } = Dimensions.get('window')

const Tab = createMaterialTopTabNavigator();

export default function CMLeadTabs() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                scrollEnabled: true,
                labelStyle: { fontSize: 12 },
                tabStyle: { width: width / 2, paddingLeft: 0, paddingRight: 0 },
                indicatorStyle: {
                    borderBottomColor: '#ffffff',
                    borderBottomWidth: 2,
                }
                // style: { shadowColor: 'transparent', elevation: 0, borderTopColor: "transparent", borderTopWidth: 0 },
            }}>
            <Tab.Screen name="Meetings" options={{ title: 'Calls / Meetings' }} component={Meetings} />
            <Tab.Screen name="Payments" component={Payments} />
        </Tab.Navigator>
    );
}
