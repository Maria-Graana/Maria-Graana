import * as React from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { logoutUser } from '../../actions/user';
import { connect } from 'react-redux';
import * as RootNavigation from '../../navigation/RootNavigation';

class CustomDrawerContent extends React.Component {

    constructor (props) {
        super(props)
    }

    navigateTo = (screen) => {
        RootNavigation.navigate(screen)
    }

    signOut = () => {
        this.props.dispatch(logoutUser())
    }

    render () {
        return (
            <DrawerContentScrollView>
                <DrawerItem label="Diary" onPress={(props) => this.navigateTo('Diary')} />
                <DrawerItem label="Sign Out" onPress={(props) => this.signOut()} />
            </DrawerContentScrollView>
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
  
  export default connect(mapStateToProps)(CustomDrawerContent)