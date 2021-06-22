/** @format */

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React from 'react'
import { Dimensions } from 'react-native'
import AppStyles from '../AppStyles'
import Meetings from '../screens/Meetings/index'
import CMPayment from '../screens/CMPayment'
const { width } = Dimensions.get('window')

const Tab = createMaterialTopTabNavigator()

export default function CMLeadTabs() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        scrollEnabled: false,
        labelStyle: { fontSize: 12, fontFamily: AppStyles.fonts.semiBoldFont },
        activeTintColor: AppStyles.colors.primaryColor,
        inactiveTintColor: AppStyles.colors.subTextColor,
        tabStyle: { width: width / 2, paddingLeft: 0, paddingRight: 0 },
        indicatorStyle: {
          borderBottomColor: '#ffffff',
          borderBottomWidth: 2,
        },
        // style: { shadowColor: 'transparent', elevation: 0, borderTopColor: "transparent", borderTopWidth: 0 },
      }}
    >
      <Tab.Screen name="Meetings" options={{ title: 'Nurture' }} component={Meetings} />
      <Tab.Screen name="Payments" component={CMPayment} />
    </Tab.Navigator>
  )
}
