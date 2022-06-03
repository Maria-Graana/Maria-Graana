/** @format */

import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import AppStyles from '../AppStyles'
import { Feather } from '@expo/vector-icons'
import styles from './style'
import HeaderLeftLeadDetail from '../components/HeaderLeftLeadDetail'
import HeaderLeftLogo from '../components/HeaderLeftLogo/index'
import HeaderRight from '../components/HeaderRight/index'
import DropdownHeader from '../components/HeaderRight/DropdownHeader'
import HeaderTitle from '../components/HeaderTitle/index'
import WhiteLogo from '../components/WhiteLogo/index'
import WhiteMenu from '../components/WhiteMenu/index'
import AddClient from '../screens/AddClient'
import AddCMLead from '../screens/AddCMLead'
import AddDiary from '../screens/AddDiary'
import AddInventory from '../screens/AddInventory/index'
import AddRCMLead from '../screens/AddRCMLead'
import AreaPickerScreen from '../screens/AreaPickerScreen'
import AssignedAreas from '../screens/AssignAreas'
import AssignLead from '../screens/AssignLead'
import Attachments from '../screens/Attachments'
import AttachmentsForPayments from '../screens/AttachmentsForPayments'
import AvailableInventory from '../screens/AvailableInventory'
import ChangePassword from '../screens/ChangePassword'
import Client from '../screens/Client'
import ClientDetail from '../screens/ClientDetail'
import CMReport from '../screens/CMReport'
import Comments from '../screens/Comments'
import CreateUser from '../screens/CreateUser'
import Dashboard from '../screens/Dashboard'
import Diary from '../screens/Diary'
import DiaryFilter from '../screens/DiaryFilter'
import EditFieldAppProperty from '../screens/EditFieldAppProperty'
import Landing from '../screens/Landing/index'
import LeadAttachments from '../screens/LeadAttachments'
import LeadDetail from '../screens/LeadDetail'
import LegalAttachments from '../screens/LegalAttachments'
import LegalPaymentAttachment from '../screens/LegalPaymentAttachment'
import MapContainer from '../screens/MapContainer'
import OverdueTasks from '../screens/OverdueTasks'
import PropertyDetail from '../screens/PropertyDetail'
import PropsureAttachment from '../screens/PropsureAttachment'
import RCMAttachment from '../screens/RCMAttachment'
import RCMReport from '../screens/RCMReport'
import SingleSelectionPicker from '../screens/SingleSelectionPicker'
import Targets from '../screens/Targets'
import TaskDetails from '../screens/TaskDetails'
import TeamDiary from '../screens/TeamDiary'
import TeamTargets from '../screens/TeamTargets'
import CMLeadTabs from './CMTabNavigator'
import InventoryTabs from './InventoryTabNavigators'
import Lead from './LeadsNavigator'
import ProjectLead from './ProjectLeadsNavigator'
import PropertyTabs from './PropertyTabNavigator'
import RCMLeadTabs from './RCMTabNavigator'
import TimeSlotManagement from '../screens/TimeSlotManagement' //ARMS-2180
import ScheduledTasks from '../screens/ScheduledTasks' //ARMS-2180
import DiaryReasons from '../screens/DiaryReasons'
import DiaryFeedback from '../screens/DiaryFeedback'
import RescheduleViewings from '../screens/RescheduleViewings'
import Contacts from '../screens/Contacts'
import AvailableUnitLead from '../screens/AvailableUnitLead' //ARMS-2293
import Dialer from '../screens/Dialer'
import ContactRegistrationFeedback from '../screens/ContactRegistrationFeedback'
import PropertyList from '../screens/PropertyList'
import { Ionicons } from '@expo/vector-icons'
import { clearDiaryFeedbacks, setConnectFeedback } from '../actions/diary'
import { store } from '../store'

const Stack = createStackNavigator()

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

      {/* ARMS-2180 start */}
      <Stack.Screen
        name="TimeSlotManagement"
        component={TimeSlotManagement}
        options={({ navigation, route }) => ({
          title: 'SLOT MANAGEMENT',
          headerLeft: (props) => (
            <View style={styles.viewWrap}>
              <Ionicons
                name="md-arrow-back"
                size={26}
                style={styles.iconWrap}
                onPress={() => {
                  store.dispatch(setConnectFeedback({}))
                  store.dispatch(clearDiaryFeedbacks())
                  navigation.goBack()
                }}
              />
            </View>
          ),
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />

      <Stack.Screen
        name="ScheduledTasks"
        component={ScheduledTasks}
        options={({ navigation, route }) => ({
          title: 'SCHEDULED TASKS',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      {/* ARMS-2180 end */}

      {/* ARMS-2293 start */}
      <Stack.Screen
        name="AvailableUnitLead"
        component={AvailableUnitLead}
        options={({ navigation, route }) => ({
          title: 'SELECT LEAD',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      {/* ARMS-2293 end */}

      {/* ARMS-3271 start */}
      <Stack.Screen
        name="PropertyList"
        component={PropertyList}
        options={({ navigation, route }) => ({
          title: 'SELECT PROPERTY',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      {/* ARMS-3271 end */}

      <Stack.Screen
        name="OverdueTasks"
        component={OverdueTasks}
        options={({ navigation, route }) => ({
          title: 'Overdue Tasks',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />

      <Stack.Screen
        name="TaskDetails"
        component={TaskDetails}
        options={({ navigation, route }) => ({
          title: 'Task Details',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />

      <Stack.Screen
        name="DiaryFilter"
        component={DiaryFilter}
        options={({ navigation, route }) => ({
          title: 'Filters',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />

      <Stack.Screen
        name="DiaryFeedback"
        component={DiaryFeedback}
        options={({ navigation, route }) => ({
          title: 'Connect Feedback',
          headerLeft: (props) => (
            <View style={styles.viewWrap}>
              <Ionicons
                name="md-arrow-back"
                size={26}
                style={styles.iconWrap}
                onPress={() => {
                  store.dispatch(setConnectFeedback({}))
                  store.dispatch(clearDiaryFeedbacks())
                  navigation.goBack()
                }}
              />
            </View>
          ),
          headerTitleAlign: 'center',
        })}
      />

      <Stack.Screen
        name="RescheduleViewings"
        component={RescheduleViewings}
        options={({ navigation, route }) => ({
          title: 'Reschedule Viewings',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerTitleAlign: 'center',
        })}
      />

      <Stack.Screen
        name="DiaryReasons"
        component={DiaryReasons}
        options={({ navigation, route }) => ({
          title: 'SELECT REASON',
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
        name="Leads"
        component={Lead}
        options={({ navigation, route }) => ({
          //  headerShown:false,
          // title: 'LEADS',
          title: '',
          headerLeft: (props) => (
            <HeaderLeftLogo navigation={navigation} leftScreen={'Landing'} leftBool={true} />
          ),
          headerRight: (props) => (
            <DropdownHeader leadType={false} hasBooking={true} navigation={navigation} />
          ),

          headerTitleAlign: 'center',
        })}
      />

      <Stack.Screen
        name="ProjectLeads"
        component={ProjectLead}
        options={({ navigation, route }) => ({
          //  title: 'LEADS',
          title: '',
          headerLeft: (props) => (
            <HeaderLeftLogo navigation={navigation} leftScreen={'Landing'} leftBool={true} />
          ),

          headerRight: (props) => (
            <DropdownHeader hasBooking={true} leadType={'ProjectLeads'} navigation={navigation} />
          ),

          headerTitleAlign: 'left',
        })}
      />

      <Stack.Screen
        name="AddDiary"
        component={AddDiary}
        options={({ navigation, route }) => ({
          title: 'ADD TASK',
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
          headerLeft: (props) => (
            <HeaderLeftLogo navigation={navigation} leftScreen={'Landing'} leftBool={true} />
          ),
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />

      <Stack.Screen
        name="ClientView"
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
          // headerLeft : (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerLeft:
            route.params && route.params.isFromLeadWorkflow
              ? (props) => <HeaderLeftLeadDetail route={route} navigation={navigation} />
              : (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) =>
            route && route.params?.lead && route.params.lead.status === 'open' ? (
              <TouchableOpacity
                onPress={() => {
                  if (route && route.params && route.params.type) {
                    let selectedCity = null
                    if (route.params.lead && route.params.lead.city) {
                      selectedCity = {
                        ...route.params.lead.city,
                        value: route.params.lead.city.id,
                      }
                    }
                    if (route.params && route.params.type === 'Investment') {
                      navigation.navigate('AddCMLead', {
                        pageName: 'CM',
                        client:
                          route.params.lead && route.params.lead.customer
                            ? route.params.lead.customer
                            : null,
                        name:
                          route.params.lead && route.params.lead.customer
                            ? route.params.lead.customer.customerName
                            : null,
                        lead: route.params.lead ? route.params.lead : null,
                        selectedCity,
                        update: true,
                      })
                    } else {
                      navigation.navigate('AddRCMLead', {
                        pageName: 'RCM',
                        client:
                          route.params.lead && route.params.lead.customer
                            ? route.params.lead.customer
                            : null,
                        name:
                          route.params.lead && route.params.lead.customer
                            ? route.params.lead.customer.customerName
                            : null,
                        lead: route.params.lead ? route.params.lead : null,
                        selectedCity,
                        update: true,
                        purpose:
                          route.params.lead && route.params.lead.purpose
                            ? route.params.lead.purpose
                            : '',
                      })
                    }
                  }
                }}
              >
                <Feather
                  style={{ marginHorizontal: 15 }}
                  name="edit"
                  size={24}
                  color={AppStyles.colors.primaryColor}
                />
              </TouchableOpacity>
            ) : null,
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
        name="PropsureAttachments"
        component={PropsureAttachment}
        options={({ navigation, route }) => ({
          title: 'ATTACHMENTS',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
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
        name="LeadAttachments"
        component={LeadAttachments}
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
        name="AssignedAreas"
        component={AssignedAreas}
        options={({ navigation, route }) => ({
          title: 'ASSIGNED AREAS',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerTitleAlign: 'center',
        })}
      />

      <Stack.Screen
        name="AvailableInventory"
        component={AvailableInventory}
        options={({ navigation, route }) => ({
          title: 'PROJECT INVENTORY',
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
      <Stack.Screen
        name="MapContainer"
        component={MapContainer}
        options={({ navigation, route }) => ({
          title: 'LOCATE PROPERTY ON MAP',
          // headerTitle: (props) => <HeaderTitle {...props} />,
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          // headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="LegalAttachments"
        component={LegalAttachments}
        options={({ navigation, route }) => ({
          title: 'LEGAL DOCUMENT',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="LegalPaymentAttachment"
        component={LegalPaymentAttachment}
        options={({ navigation, route }) => ({
          title: 'ATTACHMENTS',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="Contacts"
        component={Contacts}
        options={({ navigation, route }) => ({
          title: 'ARMS CONTACTS',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen
        name="Dialer"
        component={Dialer}
        options={({ navigation, route }) => ({
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />

      <Stack.Screen
        name="ContactFeedback"
        component={ContactRegistrationFeedback}
        options={({ navigation, route }) => ({
          title: 'FEEDBACK FORM',
          headerLeft: (props) => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
          headerRight: (props) => <HeaderRight navigation={navigation} />,
          headerTitleAlign: 'center',
        })}
      />
    </Stack.Navigator>
  )
}

export default MainStack
