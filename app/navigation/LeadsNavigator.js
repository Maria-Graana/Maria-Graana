/** @format */

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import AppStyles from '../AppStyles'
import BuyLeads from '../screens/BuyLeads/index'
import InvestLeads from '../screens/InvestLeads/index'
import PropertyLead from '../screens/PropertyLead/index'
import RentLeads from '../screens/RentLeads/index'
import { connect } from 'react-redux'

// const { width } = Dimensions.get('window')

const Tab = createMaterialTopTabNavigator()

const TabBarBadge = ({ count, color }) => {
  return (
    <View style={[styles.badgeView, { backgroundColor: color, width : count > 99 ? 25 : 20 }]}>
      <Text style={styles.badgeText}>{ count > 99 ? `99+` : `${count}`}</Text>
    </View>
  )
}

function LeadsNavigator(props) {
  const { count } = props;
  return (
    <Tab.Navigator
      tabBarOptions={{
        scrollEnabled: false,
        labelStyle: { fontSize: 12, fontFamily: AppStyles.fonts.semiBoldFont},
        activeTintColor: AppStyles.colors.primaryColor,
        inactiveTintColor: AppStyles.colors.subTextColor,
        showIcon: true,
        iconStyle: { margin: -7},
        // tabStyle: { width: width / 3, paddingLeft: 0, paddingRight: 0 },
        tabStyle: {  paddingLeft: 0, paddingRight: 0, flexDirection: 'row', justifyContent:'center', alignItems:'center' },
        indicatorStyle: {
          borderBottomColor: '#ffffff',
          borderBottomWidth: 2,
        },
      }}
    >
      <Tab.Screen name={'Rent'}
        options={{ tabBarIcon: (props) => <TabBarBadge color={props.focused ? 'red' : '#ddd'} count={count.rentLeads} />}}
        component={RentLeads} />
      <Tab.Screen
        name={`Buy`}
        component={BuyLeads}
        options={{ tabBarIcon: (props) => <TabBarBadge color={props.focused ? 'red' : '#ddd'} count={count.buyLeads} /> }}
      />
      <Tab.Screen name="Sell/Rent Out"
        component={PropertyLead} />
      <Tab.Screen name={`Invest`}
        options={{tabBarIcon: (props) => <TabBarBadge color={props.focused ? 'red': '#ddd'} count={count.projectLeads} /> }}
        component={InvestLeads} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  badgeView: {
    backgroundColor: 'red',
    borderRadius: 16,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop:2,
  },
  badgeText: {
    color:'white',
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 10,
  }
})

mapStateToProps = (store) => {
  return {
    count: store.listings.count,
  }
}

export default connect(mapStateToProps)(LeadsNavigator)
