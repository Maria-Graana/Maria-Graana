import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Landing from '../screens/Landing/index';
import { createStackNavigator } from '@react-navigation/stack';
import Diary from '../screens/Diary/index';
import Inventory from '../screens/Inventory/index';
import AddDiary from '../screens/AddDiary';
import TeamDiary from '../screens/TeamDiary';
import moment from 'moment';
import Lead from './LeadsNavigator';
import HeaderRight from '../components/HeaderRight/index';
import WhiteMenu from '../components/WhiteMenu/index';
import WhiteLogo from '../components/WhiteLogo/index';
import HeaderLeftLogo from '../components/HeaderLeftLogo/index';
import AddInventory from '../screens/AddInventory/index'
import AddCMLead from '../screens/AddCMLead';
import AddRCMLead from '../screens/AddRCMLead';
import Client from '../screens/Client';
import AddClient from '../screens/AddClient';
import ClientDetail from '../screens/ClientDetail';
import PropertyDetail from '../screens/PropertyDetail'
import LeadDetail from '../screens/LeadDetail';
import AppStyles from '../AppStyles';
import RCMLeadTabs from './RCMTabNavigator';
import CMLeadTabs from './CMTabNavigator';
import AttachmentsForPayments from '../screens/AttachmentsForPayments';
import Attachments from '../screens/Attachments';
import Comments from '../screens/Comments';
import Targets from '../screens/Targets';
import TeamTargets from '../screens/TeamTargets';
import CreateUser from '../screens/CreateUser';
import ChangePassword from '../screens/ChangePassword';
import AreaPickerScreen from '../screens/AreaPickerScreen';
import Dashboard from '../screens/Dashboard';
import CMReport from '../screens/CMReport';
import RCMReport from '../screens/RCMReport';
import AssignLead from '../screens/AssignLead';
import SingleSelectionPicker from '../screens/SingleSelectionPicker';
import HeaderTitle from '../components/HeaderTitle/index';

const Stack = createStackNavigator();

const headerStyle = {
    headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: AppStyles.colors.backgroundColor
    },
}
const landingHeader = {
    headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: AppStyles.colors.primaryColor
    },
}

function MainStack() {
    return (
        <Stack.Navigator
        >
            <Stack.Screen name="Landing" component={Landing}
                options={({ navigation, route }) => ({
                    ...landingHeader,
                    title: '',
                    headerLeft: props => <WhiteLogo />,
                    headerRight: props => <WhiteMenu navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='Diary' component={Diary}
                options={({ navigation, route }) => ({
                    title: '',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='TeamDiary' component={TeamDiary}
                options={({ navigation, route }) => ({
                    title: 'SELECT TEAM MEMBER',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='Inventory' component={Inventory}
                options={({ navigation, route }) => ({
                    title: 'PROPERTY LISTING',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='Leads' component={Lead}
                options={({ navigation, route }) => ({
                    title: 'LEADS',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='AddDiary' component={AddDiary}
                options={({ navigation, route }) => ({
                    title: 'NEW TASK',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='AddInventory' component={AddInventory}
                options={({ navigation, route }) => ({
                    title: 'ADD PROPERTY',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='AddCMLead' component={AddCMLead}
                options={({ navigation, route }) => ({
                    title: 'CREATE INVESTMENT LEAD',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='AddRCMLead' component={AddRCMLead}
                options={({ navigation, route }) => ({
                    title: 'CREATE BUY/RENT LEAD',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='Client' component={Client}
                options={({ navigation, route }) => ({
                    title: 'CLIENTS',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='AddClient' component={AddClient}
                options={({ navigation, route }) => ({
                    title: route.params.title,
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='ClientDetail' component={ClientDetail}
                options={({ navigation, route }) => ({
                    title: 'CLIENT DETAILS',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='PropertyDetail' component={PropertyDetail}
                options={({ navigation, route }) => ({
                    title: 'PROPERTY DETAILS',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='LeadDetail' component={LeadDetail}
                options={({ navigation, route }) => ({
                    title: 'LEAD DETAILS',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='RCMLeadTabs' component={RCMLeadTabs}
                options={({ navigation, route }) => ({
                    title: 'LEAD WORKFLOW',
                    headerTitle: props => <HeaderTitle {...props} />,
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='CMLeadTabs' component={CMLeadTabs}
                options={({ navigation, route }) => ({
                    title: 'LEAD WORKFLOW',
                    headerTitle: props => <HeaderTitle {...props} />,
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='Attachments' component={Attachments}
                options={({ navigation, route }) => ({
                    title: 'ATTACHMENTS',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='AttachmentsForPayments' component={AttachmentsForPayments}
                options={({ navigation, route }) => ({
                    title: 'ATTACHMENTS FOR PAYMENT',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='Comments' component={Comments}
                options={({ navigation, route }) => ({
                    title: 'COMMENTS',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='Targets' component={Targets}
                options={({ navigation, route }) => ({
                    title: 'TARGETS',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='TeamTargets' component={TeamTargets}
                options={({ navigation, route }) => ({
                    title: 'SET TARGETS',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='CreateUser' component={CreateUser}
                options={({ navigation, route }) => ({
                    title: 'CREATE USER',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='ChangePassword' component={ChangePassword}
                options={({ navigation, route }) => ({
                    title: 'CHANGE PASSWORD',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='AreaPickerScreen' component={AreaPickerScreen}
                options={({ navigation, route }) => ({
                    title: 'Select Areas',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={{ paddingRight: 15 }}>
                            Done
                        </Text>
                    </TouchableOpacity>,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='SingleSelectionPicker' component={SingleSelectionPicker}
                options={({ navigation, route }) => ({
                    title: 'Select City',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='Dashboard' component={Dashboard}
                options={({ navigation, route }) => ({
                    title: 'DASHBOARD',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='CMReport' component={CMReport}
                options={({ navigation, route }) => ({
                    title: 'INVESTMENT REPORT',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='RCMReport' component={RCMReport}
                options={({ navigation, route }) => ({
                    title: 'BUY/RENT REPORT',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='AssignLead' component={AssignLead}
                options={({ navigation, route }) => ({
                    title: 'SELECT TEAM MEMBER',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerTitleAlign: 'center',
                })}
            />
        </Stack.Navigator>


    );
}

export default MainStack;
