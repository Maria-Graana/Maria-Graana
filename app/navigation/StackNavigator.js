import React from 'react';
import Landing from '../screens/Landing/index';
import { createStackNavigator } from '@react-navigation/stack';
import Diary from '../screens/Diary/index';
import Login from '../screens/Login/index';
import Inventory from '../screens/Inventory/index';
import AddDiary from '../screens/AddDiary';
import moment from 'moment'
import Lead from '../screens/Lead/index';
import HeaderRight from '../components/HeaderRight/index';
import HeaderLeftLogo from '../components/HeaderLeftLogo/index';
import AddInventory from '../screens/AddInventory/index'
import AppStyles from '../AppStyles';

const Stack = createStackNavigator();

const _format = 'MMMM YYYY';
const _today = moment(new Date().dateString).format(_format);

const headerStyle = {
    headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: AppStyles.colors.backgroundColor
    }
}

function MainStack() {
    return (
        <Stack.Navigator
        >
            <Stack.Screen name="Landing" component={Landing}
                options={({ navigation, route }) => ({
                    ...headerStyle,
                    title: '',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation}/>,
                    headerRight: props => <HeaderRight navigation={navigation}/>,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='Diary' component={Diary}
                options={({ navigation, route }) => ({
                    title: _today,
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='Inventory' component={Inventory}
                options={({ navigation, route }) => ({
                    ...headerStyle,
                    title: '',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool= {true}/>,
                    headerRight: props => <HeaderRight navigation={navigation}/>,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='Lead' component={Lead}
                options={({ navigation, route }) => ({
                    ...headerStyle,
                    title: '',
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool= {true}/>,
                    headerRight: props => <HeaderRight navigation={navigation}/>,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='AddDiary' component={AddDiary}
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='AddInventory' component={AddInventory}
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool={true} />,
                    headerRight: props => <HeaderRight navigation={navigation} />,
                    headerTitleAlign: 'center',
                })}
            />
        </Stack.Navigator>
    );
}

export default MainStack;
