/** @format */

import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import AppStyles from '../AppStyles'
import HeaderLeftLogo from '../components/HeaderLeftLogo/index'
import HeaderRight from '../components/HeaderRight/index'
import HeaderTitle from '../components/HeaderTitle/index'
import WhiteLogo from '../components/WhiteLogo/index'
import WhiteMenu from '../components/WhiteMenu/index'
import AddClient from '../screens/AddClient'
import AddCMLead from '../screens/AddCMLead'
import AddDiary from '../screens/AddDiary'
import AddInventory from '../screens/AddInventory/index'
import AddRCMLead from '../screens/AddRCMLead'
import AreaPickerScreen from '../screens/AreaPickerScreen'
import AssignLead from '../screens/AssignLead'
import Attachments from '../screens/Attachments'
import AttachmentsForPayments from '../screens/AttachmentsForPayments'
import ChangePassword from '../screens/ChangePassword'
import Client from '../screens/Client'
import ClientDetail from '../screens/ClientDetail'
import CMReport from '../screens/CMReport'
import Comments from '../screens/Comments'
import CreateUser from '../screens/CreateUser'
import Dashboard from '../screens/Dashboard'
import Diary from '../screens/Diary/index'
import Inventory from '../screens/Inventory/index'
import Landing from '../screens/Landing/index'
import LeadDetail from '../screens/LeadDetail'
import PropertyDetail from '../screens/PropertyDetail'
import RCMAttachment from '../screens/RCMAttachment'
import RCMReport from '../screens/RCMReport'
import SingleSelectionPicker from '../screens/SingleSelectionPicker'
import Targets from '../screens/Targets'
import TeamDiary from '../screens/TeamDiary'
import TeamTargets from '../screens/TeamTargets'
import CMLeadTabs from './CMTabNavigator'
import InventoryTabs from './InventoryTabNavigators'
import Lead from './LeadsNavigator'
import RCMLeadTabs from './RCMTabNavigator'
import PropertyTabs from './PropertyTabNavigator'
import EditFieldAppProperty from '../screens/EditFieldAppProperty'

const Stack = createStackNavigator()

const headerStyle = {
  headerStyle: {
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: AppStyles.colors.backgroundColor,
  },
}
const landingHeader = {
  headerStyle: {
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: AppStyles.colors.primaryColor,
  },
}

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Landing"
        component={Landing}
        options={({ navigation, route }) => ({
          ...landingHeader,
          title: '',
          headerLeft: (props) => <WhiteLogo />,
          headerRight: (props) => <WhiteMenu navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="Diary"
        component={Diary}
        options={({ navigation, route }) => ({
          title: '',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="TeamDiary"
        component={TeamDiary}
        options={({ navigation, route }) => ({
          title: 'SELECT TEAM MEMBER',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="PROPERTIES"
        component={Inventory}
        options={({ navigation, route }) => ({
          title: 'PROPERTY LISTING',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="Leads"
        component={Lead}
        options={({ navigation, route }) => ({
          title: 'LEADS',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="AddDiary"
        component={AddDiary}
        options={({ navigation, route }) => ({
          title: 'NEW TASK',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="AddInventory"
        component={AddInventory}
        options={({ navigation, route }) => ({
          title: 'ADD PROPERTY',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="AddCMLead"
        component={AddCMLead}
        options={({ navigation, route }) => ({
          title: 'CREATE INVESTMENT LEAD',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="AddRCMLead"
        component={AddRCMLead}
        options={({ navigation, route }) => ({
          title: 'CREATE BUY/RENT LEAD',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="Client"
        component={Client}
        options={({ navigation, route }) => ({
          title: 'CLIENTS',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="AddClient"
        component={AddClient}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="ClientDetail"
        component={ClientDetail}
        options={({ navigation, route }) => ({
          title: 'CLIENT DETAILS',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="PropertyDetail"
        component={PropertyDetail}
        options={({ navigation, route }) => ({
          title: 'PROPERTY DETAILS',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="LeadDetail"
        component={LeadDetail}
        options={({ navigation, route }) => ({
          title: 'LEAD DETAILS',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="RCMLeadTabs"
        component={RCMLeadTabs}
        options={({ navigation, route }) => ({
          title: 'LEAD WORKFLOW',
          headerTitle: (props) => <HeaderTitle {...props} />,
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="CMLeadTabs"
        component={CMLeadTabs}
        options={({ navigation, route }) => ({
          title: 'LEAD WORKFLOW',
          headerTitle: (props) => <HeaderTitle {...props} />,
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="InventoryTabs"
        component={InventoryTabs}
        options={({ navigation, route }) => ({
          title: 'PROPERTIES',
          // headerTitle: (props) => <HeaderTitle {...props} />,
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="Attachments"
        component={Attachments}
        options={({ navigation, route }) => ({
          title: 'ATTACHMENTS',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="AttachmentsForPayments"
        component={AttachmentsForPayments}
        options={({ navigation, route }) => ({
          title: 'ATTACHMENTS',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="RCMAttachment"
        component={RCMAttachment}
        options={({ navigation, route }) => ({
          title: 'ATTACHMENTS',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="Comments"
        component={Comments}
        options={({ navigation, route }) => ({
          title: route.params.title,
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="Targets"
        component={Targets}
        options={({ navigation, route }) => ({
          title: 'TARGETS',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="TeamTargets"
        component={TeamTargets}
        options={({ navigation, route }) => ({
          title: 'SET TARGETS',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="CreateUser"
        component={CreateUser}
        options={({ navigation, route }) => ({
          title: 'CREATE USER',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={({ navigation, route }) => ({
          title: 'CHANGE PASSWORD',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="AreaPickerScreen"
        component={AreaPickerScreen}
        options={({ navigation, route }) => ({
          title: 'Select Areas',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ paddingRight: 15 }}>Done</Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="SingleSelectionPicker"
        component={SingleSelectionPicker}
        options={({ navigation, route }) => ({
          title: 'Select City',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={({ navigation, route }) => ({
          title: 'DASHBOARD',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="CMReport"
        component={CMReport}
        options={({ navigation, route }) => ({
          title: 'INVESTMENT REPORT',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="RCMReport"
        component={RCMReport}
        options={({ navigation, route }) => ({
          title: 'BUY/RENT REPORT',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="AssignLead"
        component={AssignLead}
        options={({ navigation, route }) => ({
          title: '',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="EditFieldAppProperty"
        component={EditFieldAppProperty}
        options={({ navigation, route }) => ({
          title: 'Edit Property',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="PropertyTabs"
        component={PropertyTabs}
        options={({ navigation, route }) => ({
          title: 'PROPERTY WORKFLOW',
          headerTitle: (props) => <HeaderTitle {...props} />,
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
    </Stack.Navigator>
  )
}

export default MainStack
