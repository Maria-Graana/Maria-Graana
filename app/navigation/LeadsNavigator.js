/** @format */

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React, { useEffect, useLayoutEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import AppStyles from '../AppStyles'
import HeaderLeftLogo from '../components/HeaderLeftLogo/index'
import DropdownHeader from '../components/HeaderRight/DropdownHeader'
import HeaderRight from '../components/HeaderRight/index'
import { getPermissionValue } from '../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../hoc/PermissionsTypes'
import BuyLeads from '../screens/BuyLeads/index'
import WantedLeads from './../screens/WantedLeads/index'
import InvestLeads from '../screens/InvestLeads/index'
import RentLeads from '../screens/RentLeads/index'

import PickerComponent from './../components/Picker/index'

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

  //unmount

  useLayoutEffect(() => {
    if (navFrom == 'viewing' || typeof navFrom == 'undefined') {
      navigation.setOptions({
        headerRight: (props) => <HeaderRight navigation={navigation} />,
        title: 'SELECT LEAD',
        headerLeft: (props) => (
          <HeaderLeftLogo navigation={navigation} //leftClientScreen={'Client'}
           leftBool={true} />
        ),
      })
    }
  }, [])

  useEffect(() => {
    if (
      screen == 'Leads' &&
      navFrom != 'viewing' &&
      navFrom != 'follow_up' &&
      navFrom != 'meeting'
    ) {
      navigation.setOptions({
        title: '',
        headerRight: (props) => (
          <DropdownHeader
            leadType={navFrom == 'meeting' ? 'ProjectLeads' : false}
            hasBooking={false}
            pageType={''}
            navigation={navigation}
          />
        ),
      })
    }

    if (screen == 'MyDeals') {
      navigation.setOptions({
        headerRight: (props) => (
          <DropdownHeader
            leadType={navFrom == 'meeting' ? 'ProjectLeads' : false}
            hasBooking={true}
            pageType={''}
            navigation={navigation}
          />
        ),
      })
    }

    if (screenName == 'AddClient') {
      navigation.setOptions({
        headerLeft: (props) => (
          <HeaderLeftLogo navigation={navigation} leftClientScreen={'Client'} leftBool={true} />
        ),
      })
    }
  }, [navigation])

  if (screen == 'MyDeals') {
    navigation.setOptions({ title: '' })
  } else if (hideCloseLostFilter) {
    navigation.setOptions({
      headerRight: (props) => <HeaderRight navigation={navigation} />,
      title: 'SELECT LEAD',
      headerLeft: (props) => (
        <HeaderLeftLogo navigation={navigation} //leftClientScreen={'Client'}
         leftBool={true} />
      ),
    })

    //  navigation.setOptions({ title: 'SELECT LEAD' })
  }
  if (navFrom == 'follow_up' || navFrom == 'meeting') {
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
          PermissionFeatures.APP_PAGES,
          PermissionActions.BUYRENT_LEADS_PAGE_VIEW,
          permissions
        ) ? (
          <Tab.Screen
            name="Rent"
            // options={{
            //   tabBarIcon: (props) => (
            //     <TabBarBadge
            //       color={props.focused ? 'red' : '#ddd'}
            //       count={count.rentLeads}
            //       screen={screen}
            //     />
            //   ),
            // }}
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
          PermissionFeatures.APP_PAGES,
          PermissionActions.BUYRENT_LEADS_PAGE_VIEW,
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
            // options={{
            //   tabBarIcon: (props) => (
            //     <TabBarBadge
            //       color={props.focused ? 'red' : '#ddd'}
            //       count={count.buyLeads}
            //       screen={screen}
            //     />
            //   ),
            // }}
            component={BuyLeads}
          />
        ) : null}
        {getPermissionValue(
          PermissionFeatures.APP_PAGES,
          PermissionActions.PROJECT_LEADS_PAGE_VIEW,
          permissions
        ) ? (
          <Tab.Screen
            name="Invest"
            // options={{
            //   tabBarIcon: (props) => (
            //     <TabBarBadge
            //       color={props.focused ? 'red' : '#ddd'}
            //       count={count.projectLeads}
            //       screen={screen}
            //     />
            //   ),
            // }}
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
          PermissionFeatures.APP_PAGES,
          PermissionActions.BUYRENT_LEADS_PAGE_VIEW,
          permissions
        ) ? (
          <Tab.Screen
            name="Rent"
            // options={{
            //   tabBarIcon: (props) => (
            //     <TabBarBadge
            //       color={props.focused ? 'red' : '#ddd'}
            //       count={count.rentLeads}
            //       screen={screen}
            //     />
            //   ),
            // }}
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
          PermissionFeatures.APP_PAGES,
          PermissionActions.BUYRENT_LEADS_PAGE_VIEW,
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
            // options={{
            //   tabBarIcon: (props) => (
            //     <TabBarBadge
            //       color={props.focused ? 'red' : '#ddd'}
            //       count={count.buyLeads}
            //       screen={screen}
            //     />
            //   ),
            // }}
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
          PermissionFeatures.APP_PAGES,
          PermissionActions.PROJECT_LEADS_PAGE_VIEW,
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
          PermissionFeatures.APP_PAGES,
          PermissionActions.BUYRENT_LEADS_PAGE_VIEW,
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
          PermissionFeatures.APP_PAGES,
          PermissionActions.BUYRENT_LEADS_PAGE_VIEW,
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
      <>
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
            PermissionFeatures.APP_PAGES,
            PermissionActions.BUYRENT_LEADS_PAGE_VIEW,
            permissions
          ) ? (
            <Tab.Screen
              name="Rent"
              // options={{
              //   tabBarIcon: (props) => (
              //     <TabBarBadge
              //       color={props.focused ? 'red' : '#ddd'}
              //       count={count.rentLeads}
              //       screen={screen}
              //     />
              //   ),
              // }}
              initialParams={{
                screen: props.route.params?.screen,
                hasBooking: props.route.params?.hasBooking,
              }}
              component={RentLeads}
            />
          ) : null}
          {getPermissionValue(
            PermissionFeatures.APP_PAGES,
            PermissionActions.BUYRENT_LEADS_PAGE_VIEW,
            permissions
          ) ? (
            <Tab.Screen
              name="Buy"
              initialParams={{
                screen: props.route.params?.screen,
                hasBooking: props.route.params?.hasBooking,
              }}
              // options={{
              //   tabBarIcon: (props) => (
              //     <TabBarBadge
              //       color={props.focused ? 'red' : '#ddd'}
              //       count={count.buyLeads}
              //       screen={screen}
              //     />
              //   ),
              // }}
              component={BuyLeads}
            />
          ) : null}
          {/* <Tab.Screen name="Sell/Rent Out" component={PropertyLead} /> */}
          {getPermissionValue(
            PermissionFeatures.APP_PAGES,
            PermissionActions.WANTED_LEADS_PAGE_VIEW,
            permissions
          ) && route.params.screen != 'MyDeals' ? (
            <Tab.Screen
              name="Wanted"
              initialParams={{
                screen: props.route.params?.screen,
                hasBooking: props.route.params?.hasBooking,
              }}
              // options={{
              //   tabBarIcon: (props) => (
              //     <TabBarBadge
              //       color={props.focused ? 'red' : '#ddd'}
              //       count={count.wantedLeads}
              //       screen={screen}
              //     />
              //   ),
              // }}
              component={WantedLeads}
            />
          ) : null}
          {/* {getPermissionValue(
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
        ) : null} */}
        </Tab.Navigator>
      </>
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
