/** @format */

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React from 'react'
import AppStyles from '../AppStyles'
import BuyLeads from '../screens/BuyLeads/index'
import InvestLeads from '../screens/InvestLeads/index'
import PropertyLead from '../screens/PropertyLead/index'
import RentLeads from '../screens/RentLeads/index'
import { connect } from 'react-redux'
// const { width } = Dimensions.get('window')

const Tab = createMaterialTopTabNavigator()

function PPLeadsNavigator({ isPPBuyNotification }) {
  // const { Notification } = useSelector((state) => state)
  // const { PPBuyNotification } = Notification
  // let initialScreen = 'Rent'
  // if (PPBuyNotification && PPBuyNotification.screen === 'Buy') {
  //   initialScreen = 'Buy'
  // }

  // console.log('PPBuyNotification: ', PPBuyNotification)
  // console.log('initialScreen: ', initialScreen)

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
      initialRouteName={isPPBuyNotification ? 'Buy' : 'Rent'}
    >
      <Tab.Screen name="Rent" component={RentLeads} />
      <Tab.Screen name="Buy" component={BuyLeads} />
    </Tab.Navigator>
  )
}

const mapStateToProps = (store) => {
  return {
    isPPBuyNotification: store.Notification.PPBuyNotification,
  }
}

export default connect(mapStateToProps)(PPLeadsNavigator)
