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

const TabBarBadge = ({ count, color, screen }) => {
  return count > 0 && screen === 'Leads' ? (
    <View style={[styles.badgeView, { backgroundColor: color, width: count > 99 ? 25 : 20 }]}>
      <Text style={styles.badgeText}>{count > 99 ? `99+` : `${count}`}</Text>
    </View>
  ) : null
}

function LeadsNavigator(props) {
  const { count, user, permissions, route, navigation } = props
  const { screen, screenName, navFrom, hideCloseLostFilter } = route.params
  console.log("PARAMSSSS" , route.params)
  if (screen == 'MyDeals') {
    navigation.setOptions({ title: 'DEALS' })
  } else if (hideCloseLostFilter) {
    navigation.setOptions({ title: 'SELECT LEAD' })
  }
  if (navFrom == 'meeting') {
    return (
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
          PermissionFeatures.PROJECT_LEADS,
          PermissionActions.READ,
          permissions
        ) ? (
          <Tab.Screen
            name="Invest"
            options={{
              tabBarIcon: (props) => (
                <TabBarBadge
                  color={props.focused ? 'red' : '#ddd'}
                  count={count.projectLeads}
                  screen={screen}
                />
              ),
            }}
            initialParams={{
              screen: props.route.params?.screen,
              hasBooking: props.route.params?.hasBooking,
              navFrom: navFrom,
              hideCloseLostFilter: hideCloseLostFilter,
            }}
            component={InvestLeads}
          />
        ) : null}
      </Tab.Navigator>
    )
  } else if (navFrom == 'follow_up') {
    return (
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
                <TabBarBadge
                  color={props.focused ? 'red' : '#ddd'}
                  count={count.rentLeads}
                  screen={screen}
                />
              ),
            }}
            initialParams={{
              screen: props.route.params?.screen,
              hasBooking: props.route.params?.hasBooking,
              navFrom: navFrom,
              hideCloseLostFilter: hideCloseLostFilter,
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
              navFrom: navFrom,
              hideCloseLostFilter: hideCloseLostFilter,
            }}
            options={{
              tabBarIcon: (props) => (
                <TabBarBadge
                  color={props.focused ? 'red' : '#ddd'}
                  count={count.buyLeads}
                  screen={screen}
                />
              ),
            }}
            component={BuyLeads}
          />
        ) : null}
        {getPermissionValue(
          PermissionFeatures.PROJECT_LEADS,
          PermissionActions.READ,
          permissions
        ) ? (
          <Tab.Screen
            name="Invest"
            options={{
              tabBarIcon: (props) => (
                <TabBarBadge
                  color={props.focused ? 'red' : '#ddd'}
                  count={count.projectLeads}
                  screen={screen}
                />
              ),
            }}
            initialParams={{
              screen: props.route.params?.screen,
              hasBooking: props.route.params?.hasBooking,
              navFrom: navFrom,
              hideCloseLostFilter: hideCloseLostFilter,
            }}
            component={InvestLeads}
          />
        ) : null}
      </Tab.Navigator>
    )
  } else if (navFrom == 'viewing') {
    return (
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
                <TabBarBadge
                  color={props.focused ? 'red' : '#ddd'}
                  count={count.rentLeads}
                  screen={screen}
                />
              ),
            }}
            initialParams={{
              screen: props.route.params?.screen,
              hasBooking: props.route.params?.hasBooking,
              navFrom: navFrom,
              hideCloseLostFilter: hideCloseLostFilter,
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
              navFrom: navFrom,
              hideCloseLostFilter: hideCloseLostFilter,
            }}
            options={{
              tabBarIcon: (props) => (
                <TabBarBadge
                  color={props.focused ? 'red' : '#ddd'}
                  count={count.buyLeads}
                  screen={screen}
                />
              ),
            }}
            component={BuyLeads}
          />
        ) : null}
      </Tab.Navigator>
    )
  } else {
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
        {getPermissionValue(
          PermissionFeatures.PROJECT_LEADS,
          PermissionActions.READ,
          permissions
        ) ? (
          <Tab.Screen
            name="Invest"
            options={{
              tabBarIcon: (props) => (
                <TabBarBadge
                  color={props.focused ? 'red' : '#ddd'}
                  count={count.projectLeads}
                  screen={screen}
                />
              ),
            }}
            initialParams={{
              screen: props.route.params?.screen,
              hasBooking: props.route.params?.hasBooking,
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
                <TabBarBadge
                  color={props.focused ? 'red' : '#ddd'}
                  count={count.rentLeads}
                  screen={screen}
                />
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
            component={BuyLeads}
            initialParams={{
              screen: props.route.params?.screen,
              hasBooking: props.route.params?.hasBooking,
            }}
            options={{
              tabBarIcon: (props) => (
                <TabBarBadge
                  color={props.focused ? 'red' : '#ddd'}
                  count={count.buyLeads}
                  screen={screen}
                />
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
                <TabBarBadge
                  color={props.focused ? 'red' : '#ddd'}
                  count={count.rentLeads}
                  screen={screen}
                />
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
                <TabBarBadge
                  color={props.focused ? 'red' : '#ddd'}
                  count={count.buyLeads}
                  screen={screen}
                />
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
                <TabBarBadge
                  color={props.focused ? 'red' : '#ddd'}
                  count={count.wantedLeads}
                  screen={screen}
                />
              ),
            }}
            component={WantedLeads}
          />
        ) : null}
        {getPermissionValue(
          PermissionFeatures.PROJECT_LEADS,
          PermissionActions.READ,
          permissions
        ) ? (
          <Tab.Screen
            name="Invest"
            options={{
              tabBarIcon: (props) => (
                <TabBarBadge
                  color={props.focused ? 'red' : '#ddd'}
                  count={count.projectLeads}
                  screen={screen}
                />
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
