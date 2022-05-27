/** @format */

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React, { useEffect } from 'react'
import { Dimensions } from 'react-native'
import AppStyles from '../AppStyles'
import Armsinventory from '../screens/ArmsInventories'
import GraanaInventories from '../screens/GraanaInventories'
import FieldsInventories from '../screens/FieldsInventories'
const { width } = Dimensions.get('window')

const Tab = createMaterialTopTabNavigator()

export default function InventoryTabNavigators(props) {
  const { route, navigation } = props
  const { client } = route.params
  useEffect(() => {
    if (client) {
      props.navigation.setOptions({
        //  headerRight: (props) => <HeaderRight navigation={navigation} />,
        title: `${client?.first_name} ${client?.last_name}'s Properties`,
        // headerLeft: (props) => (
        //   <HeaderLeftLogo navigation={navigation} leftScreen={'ClientDetail'} leftBool={true} />
        // ),
      })
    }
  }, [navigation])

  return (
    <Tab.Navigator
      tabBarOptions={{
        scrollEnabled: false,
        labelStyle: { fontSize: 12, fontFamily: AppStyles.fonts.semiBoldFont },
        activeTintColor: AppStyles.colors.primaryColor,
        inactiveTintColor: AppStyles.colors.subTextColor,
        tabStyle: { width: width / 3, paddingLeft: 0, paddingRight: 0 },
        indicatorStyle: {
          borderBottomColor: '#ffffff',
          borderBottomWidth: 2,
        },
        // style: { shadowColor: 'transparent', elevation: 0, borderTopColor: "transparent", borderTopWidth: 0 },
      }}
    >
      <Tab.Screen
        name="ARMS"
        initialParams={{
          client: props.route.params?.client,
        }}
        component={Armsinventory}
      />
      <Tab.Screen
        name="Field App"
        initialParams={{
          client: props.route.params?.client,
        }}
        component={FieldsInventories}
      />
      <Tab.Screen
        initialParams={{
          client: props.route.params?.client,
        }}
        name="Graana.com"
        component={GraanaInventories}
      />
    </Tab.Navigator>
  )
}
