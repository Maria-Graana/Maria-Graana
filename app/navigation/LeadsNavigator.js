import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import Meetings from '../screens/Meetings/index';
import Payments from '../screens/Payments/index';
import InvestLeads from '../screens/InvestLeads/index';
import BuyLeads from '../screens/BuyLeads/index';
import RentLeads from '../screens/RentLeads/index';
import styles from './style';
import { Dimensions } from 'react-native'
const { width } = Dimensions.get('window')
import AppStyles from '../AppStyles'

const Tab = createMaterialTopTabNavigator();

export default function LeadsNavigator() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                scrollEnabled: false,
                labelStyle: { fontSize: 12, fontFamily:AppStyles.fonts.semiBoldFont },
                activeTintColor: AppStyles.colors.primaryColor,
                inactiveTintColor: AppStyles.colors.subTextColor,
                tabStyle: { width: width / 3, paddingLeft: 0, paddingRight: 0 },
                indicatorStyle: {
                    borderBottomColor: '#ffffff',
                    borderBottomWidth: 2,
                },
                // style: { shadowColor: 'transparent', elevation: 0, borderTopColor: "transparent", borderTopWidth: 0 },
            }}>
            <Tab.Screen name="Invest" component={InvestLeads} />
            <Tab.Screen name="Buy" component={BuyLeads} />
            <Tab.Screen name="Rent" component={RentLeads} />
        </Tab.Navigator>
    );
}
