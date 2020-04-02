import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LeadMatch from '../screens/LeadMatch/index';
import LeadViewing from '../screens/LeadViewing/index';
import React from 'react';

const Tab = createMaterialTopTabNavigator();

export default function RCMLeadTabs() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                scrollEnabled: true,
                labelStyle: { fontSize: 10 },
                tabStyle: { width: 85},
                // style: { shadowColor: 'transparent', elevation: 0, borderTopColor: "transparent", borderTopWidth: 0 },
            }}>
            <Tab.Screen name="Match" component={LeadMatch}/>
            <Tab.Screen name="Viewing" component={LeadViewing} />
            <Tab.Screen name="Offer" component={LeadViewing} />
            <Tab.Screen name="Propsure" component={LeadViewing} />
            <Tab.Screen name="Payment" component={LeadViewing} />
        </Tab.Navigator>
    );
}