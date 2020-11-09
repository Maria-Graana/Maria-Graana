/** @format */

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React from 'react'
import { Dimensions } from 'react-native'
import AppStyles from '../AppStyles'
import PropertyOffer from '../screens/PropertyOffer/index'
import PropertyViewing from '../screens/PropertyViewing/index'
import PropertyPropsure from '../screens/PropertyPropsure'
import PropertyRCMPayment from '../screens/PropertyRCMPayment'

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
      <Tab.Screen name="Viewing" component={PropertyViewing} />
      <Tab.Screen name="Offer" component={PropertyOffer} />
      <Tab.Screen name="Propsure" component={PropertyPropsure} />
      <Tab.Screen name="Payment" component={PropertyRCMPayment} />
    </Tab.Navigator>
  )
}
