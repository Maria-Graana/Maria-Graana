import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LeadMatch from '../../app/screens/LeadMatch/index';
import Viewing from '../../app/screens/Viewing/index';
import React from 'react';

const Tab = createMaterialTopTabNavigator();

export default function LeadTabs() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                scrollEnabled: true,
                labelStyle: { fontSize: 10 },
                tabStyle: { width: 85},
                // style: { shadowColor: 'transparent', elevation: 0, borderTopColor: "transparent", borderTopWidth: 0 },
            }}>
            <Tab.Screen name="Match" component={LeadMatch}/>
            <Tab.Screen name="Viewing" component={Viewing} />
            <Tab.Screen name="Offer" component={Viewing} />
            <Tab.Screen name="Propsure" component={Viewing} />
            <Tab.Screen name="Payment" component={Viewing} />
        </Tab.Navigator>
    );
}