import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainStack from './StackNavigator';
import CustomDrawerContent from '../components/Drawer/index';
import Login from '../screens/Login/index';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { checkToken } from '../actions/user';
import { navigationRef } from './RootNavigation';
import { SplashScreen } from 'expo';

const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();

function Authstack() {
    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: false,
                headerShown: false
            }}
        >
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
    );
}

class RootStack extends React.Component {
    constructor (props) {
        super(props)
    }
    
    componentDidMount() {
        SplashScreen.preventAutoHide();
        this.props.dispatch(checkToken())
    }
    
    render () {
        const {user, token, store, loading}= this.props
        return (
            <SafeAreaProvider>
                <NavigationContainer ref={navigationRef}>
                    {
                        user && loading === false && token?
                            <Drawer.Navigator drawerContent={navigation => <CustomDrawerContent />}>
                                <Drawer.Screen name="MainStack" component={MainStack} />
                            </Drawer.Navigator>
                        :
                        <Stack.Navigator
                        screenOptions={{
                            gestureEnabled: false,
                            headerShown: false
                        }}
                        >
                            <Stack.Screen name={"Authstack"} component={Authstack} />
                        </Stack.Navigator>
                    }
                </NavigationContainer>
            </SafeAreaProvider>
        )
    }
}


mapStateToProps = (store) => {
    return {
        user: store.user.user,
        token: store.user.token,
        store: store,
        loading: store.user.loading
    }
}

export default connect(mapStateToProps)(RootStack)
