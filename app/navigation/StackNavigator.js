import React from 'react';
import Landing from '../screens/Landing/index';
import { createStackNavigator } from '@react-navigation/stack';
import Diary from '../screens/Diary/index';
import Login from '../screens/Login/index';
import Inventory from '../screens/Inventory/index';
import Lead from '../screens/Lead/index';
import HeaderRight from '../components/HeaderRight/index';
import HeaderLeftLogo from '../components/HeaderLeftLogo/index';

const Stack = createStackNavigator();

function MainStack() {
    return (
        <Stack.Navigator
        >
            <Stack.Screen name="Landing" component={Landing}
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderLeftLogo navigation={navigation}/>,
                    headerRight: props => <HeaderRight navigation={navigation}/>,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='Diary' component={Diary}
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool= {true}/>,
                    headerRight: props => <HeaderRight navigation={navigation}/>,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='Inventory' component={Inventory} 
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool= {true}/>,
                    headerRight: props => <HeaderRight navigation={navigation}/>,
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='Lead' component={Lead} 
                options={({ navigation, route }) => ({
                    headerLeft: props => <HeaderLeftLogo navigation={navigation} leftBool= {true}/>,
                    headerRight: props => <HeaderRight navigation={navigation}/>,
                    headerTitleAlign: 'center',
                })}
            />
        </Stack.Navigator>
    );
}

export default MainStack;
