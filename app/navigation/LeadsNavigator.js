/** @format */

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React from 'react'
import AppStyles from '../AppStyles'
import BuyLeads from '../screens/BuyLeads/index'
import InvestLeads from '../screens/InvestLeads/index'
import PropertyLead from '../screens/PropertyLead/index'
import RentLeads from '../screens/RentLeads/index'
// const { width } = Dimensions.get('window')

const Tab = createMaterialTopTabNavigator()

export default function LeadsNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        scrollEnabled: false,
        labelStyle: { fontSize: 12, fontFamily: AppStyles.fonts.semiBoldFont },
        activeTintColor: AppStyles.colors.primaryColor,
        inactiveTintColor: AppStyles.colors.subTextColor,
        // tabStyle: { width: width / 3, paddingLeft: 0, paddingRight: 0 },
        tabStyle: { paddingLeft: 0, paddingRight: 0 },
        indicatorStyle: {
          borderBottomColor: '#ffffff',
          borderBottomWidth: 2,
        },
      }}
    >
      <Tab.Screen name="Rent" component={RentLeads} />
      <Tab.Screen name="Buy" component={BuyLeads} />
      <Tab.Screen name="Sell/Rent Out" component={PropertyLead} />
      <Tab.Screen name="Invest" component={InvestLeads} />
    </Tab.Navigator>
  )
}
