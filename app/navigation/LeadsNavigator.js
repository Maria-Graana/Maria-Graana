/** @format */

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React, { useEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { getPermissionValue } from '../hoc/Permissions'
import { PermissionFeatures, PermissionActions } from '../hoc/PermissionsTypes'
import AppStyles from '../AppStyles'
import BuyLeads from '../screens/BuyLeads/index'
import InvestLeads from '../screens/InvestLeads/index'
import PropertyLead from '../screens/PropertyLeads/index'
import RentLeads from '../screens/RentLeads/index'
import { connect } from 'react-redux'
import WantedLeads from '../screens/WantedLeads/index'

// const { width } = Dimensions.get('window')

const Tab = createMaterialTopTabNavigator()

const TabBarBadge = ({ count, color }) => {
  return count > 0 ? (
    <View style={[styles.badgeView, { backgroundColor: color, width: count > 99 ? 25 : 20 }]}>
      <Text style={styles.badgeText}>{count > 99 ? `99+` : `${count}`}</Text>
    </View>
  ) : null
}

function LeadsNavigator(props) {
  useEffect(() => {
    const { navigation, route } = props
    if (route.params.screen == 'MyDeals') {
      navigation.setOptions({ title: 'DEALS' })
    }
  }, [])
  const { count, user, permissions, route } = props
  return user.subRole === 'business_centre_manager' ||
    user.subRole === 'business_centre_agent' ||
    user.subRole === 'call_centre_manager' ||
    user.subRole === 'call_centre_warrior' ||
    user.subRole === 'call_centre_agent' ? (
    <Tab.Navigator
      tabBarOptions={{
        scrollEnabled: false,
        labelStyle: { fontSize: 12, fontFamily: AppStyles.fonts.semiBoldFont },
        activeTintColor: AppStyles.colors.primaryColor,
        inactiveTintColor: AppStyles.colors.subTextColor,
        showIcon: true,
        iconStyle: { margin: -5 },
        // tabStyle: { width: width / 3, paddingLeft: 0, paddingRight: 0 },
        tabStyle: {
          paddingLeft: 0,
          paddingRight: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
        indicatorStyle: {
          borderBottomColor: '#ffffff',
          borderBottomWidth: 2,
        },
      }}
    >
      {getPermissionValue(PermissionFeatures.PROJECT_LEADS, PermissionActions.READ, permissions) ? (
        <Tab.Screen
          name="Invest"
          options={{
            tabBarIcon: (props) => (
              <TabBarBadge color={props.focused ? 'red' : '#ddd'} count={count.projectLeads} />
            ),
          }}
          component={InvestLeads}
        />
      ) : null}
      {getPermissionValue(
        PermissionFeatures.BUY_RENT_LEADS,
        PermissionActions.READ,
        permissions
      ) ? (
        <Tab.Screen
          name="Rent"
          options={{
            tabBarIcon: (props) => (
              <TabBarBadge color={props.focused ? 'red' : '#ddd'} count={count.rentLeads} />
            ),
          }}
          component={RentLeads}
        />
      ) : null}
      {getPermissionValue(
        PermissionFeatures.BUY_RENT_LEADS,
        PermissionActions.READ,
        permissions
      ) ? (
        <Tab.Screen
          name="Buy"
          component={BuyLeads}
          options={{
            tabBarIcon: (props) => (
              <TabBarBadge color={props.focused ? 'red' : '#ddd'} count={count.buyLeads} />
            ),
          }}
        />
      ) : null}
      {/* <Tab.Screen name="Sell/Rent Out" component={PropertyLead} /> */}
    </Tab.Navigator>
  ) : (
    <Tab.Navigator
      tabBarOptions={{
        scrollEnabled: false,
        labelStyle: { fontSize: 12, fontFamily: AppStyles.fonts.semiBoldFont },
        activeTintColor: AppStyles.colors.primaryColor,
        inactiveTintColor: AppStyles.colors.subTextColor,
        showIcon: true,
        iconStyle: { margin: -5 },
        // tabStyle: { width: width / 3, paddingLeft: 0, paddingRight: 0 },
        tabStyle: {
          paddingLeft: 0,
          paddingRight: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
        indicatorStyle: {
          borderBottomColor: '#ffffff',
          borderBottomWidth: 2,
        },
      }}
    >
      {getPermissionValue(
        PermissionFeatures.BUY_RENT_LEADS,
        PermissionActions.READ,
        permissions
      ) ? (
        <Tab.Screen
          name="Rent"
          options={{
            tabBarIcon: (props) => (
              <TabBarBadge color={props.focused ? 'red' : '#ddd'} count={count.rentLeads} />
            ),
          }}
          initialParams={{
            screen: props.route.params?.screen,
            hasBooking: props.route.params?.hasBooking,
          }}
          component={RentLeads}
        />
      ) : null}
      {getPermissionValue(
        PermissionFeatures.BUY_RENT_LEADS,
        PermissionActions.READ,
        permissions
      ) ? (
        <Tab.Screen
          name="Buy"
          initialParams={{
            screen: props.route.params?.screen,
            hasBooking: props.route.params?.hasBooking,
          }}
          options={{
            tabBarIcon: (props) => (
              <TabBarBadge color={props.focused ? 'red' : '#ddd'} count={count.buyLeads} />
            ),
          }}
          component={BuyLeads}
        />
      ) : null}
      {/* <Tab.Screen name="Sell/Rent Out" component={PropertyLead} /> */}
      {getPermissionValue(PermissionFeatures.WANTED_LEADS, PermissionActions.READ, permissions) &&
      route.params.screen != 'MyDeals' ? (
        <Tab.Screen
          name="Wanted"
          initialParams={{
            screen: props.route.params?.screen,
            hasBooking: props.route.params?.hasBooking,
          }}
          options={{
            tabBarIcon: (props) => (
              <TabBarBadge color={props.focused ? 'red' : '#ddd'} count={count.wantedLeads} />
            ),
          }}
          component={WantedLeads}
        />
      ) : null}
      {getPermissionValue(PermissionFeatures.PROJECT_LEADS, PermissionActions.READ, permissions) ? (
        <Tab.Screen
          name="Invest"
          options={{
            tabBarIcon: (props) => (
              <TabBarBadge color={props.focused ? 'red' : '#ddd'} count={count.projectLeads} />
            ),
          }}
          initialParams={{
            screen: props.route.params?.screen,
            hasBooking: props.route.params?.hasBooking,
          }}
          component={InvestLeads}
        />
      ) : null}
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  badgeView: {
    backgroundColor: 'red',
    borderRadius: 16,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  badgeText: {
    color: 'white',
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 10,
  },
})

mapStateToProps = (store) => {
  return {
    count: store.listings.count,
    user: store.user.user,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(LeadsNavigator)
