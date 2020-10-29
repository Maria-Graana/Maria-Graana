/** @format */

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React from 'react'
import { Dimensions } from 'react-native'
import AppStyles from '../AppStyles'
import LeadOffer from '../screens/LeadOffer/index'
import LeadPropsure from '../screens/LeadPropsure/index'
import LeadRCMPayment from '../screens/LeadRCMPayment/index'
import LeadViewing from '../screens/LeadViewing/index'

const { width } = Dimensions.get('window')

const Tab = createMaterialTopTabNavigator()

export default function PropertyTabs() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        scrollEnabled: false,
        activeTintColor: AppStyles.colors.primaryColor,
        labelStyle: { fontSize: 12, fontFamily: AppStyles.fonts.semiBoldFont },
        inactiveTintColor: AppStyles.colors.subTextColor,
        tabStyle: { paddingLeft: 0, paddingRight: 0 },
        indicatorStyle: {
          backgroundColor: 'white',
        },
      }}
    >
      <Tab.Screen name="Viewing" component={LeadViewing} />
      <Tab.Screen name="Offer" component={LeadOffer} />
      <Tab.Screen name="Propsure" component={LeadPropsure} />
      <Tab.Screen name="Payment" component={LeadRCMPayment} />
    </Tab.Navigator>
  )
}
