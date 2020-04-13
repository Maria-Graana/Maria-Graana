import * as React from 'react';
import {
    View,
    ScrollView,
    Text
} from 'react-native'
import { logoutUser } from '../../actions/user';
import { connect } from 'react-redux';
import * as RootNavigation from '../../navigation/RootNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import DrawerIconItem from '../DrawerIconItem';
import DrawerItem from '../DrawerItem';
import UserAvatar from 'react-native-user-avatar';
import AppStyles from '../../AppStyles';
import styles from './style';
import Ability from '../../hoc/Ability';
import axios from 'axios';

class CustomDrawerContent extends React.Component {

    constructor(props) {
        super(props)
    }


    navigateTo = (screen) => {
        RootNavigation.navigate(screen)
    }

    signOut = () => {
        this.props.dispatch(logoutUser())
    }

    render() {
        const { user,count } = this.props
        const { role } = user
        return (
            <SafeAreaView style={[AppStyles.mb1, { width: '100%' }]}>
                <ScrollView style={[styles.scrollContainer, { width: '100%', }]}>
                    <View style={AppStyles.flexDirectionRow}>
                        <View >
                            <UserAvatar size="50" name={`${user.firstName} ${user.lastName}`} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.nameText}>
                                {user.firstName} {user.lastName}
                            </Text>
                            <Text style={styles.emailText}>
                                {user.email}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.underLine} />
                    {Ability.canView(role, 'Diary') && <DrawerIconItem screen={'Diary'} badges={count.diary} navigateTo={() => { this.navigateTo('Diary') }} />}
                    {Ability.canView(role, 'TeamDiary') && <DrawerItem screen={'Team Diary'} navigateTo={() => { this.navigateTo('TeamDiary') }} />}
                    <DrawerIconItem screen={'Leads'} badges={count.leads} navigateTo={() => { this.navigateTo('Lead') }} />
                    {Ability.canView(role, 'Inventory') && <DrawerIconItem screen={'Properties'} badges={count.inventory} navigateTo={() => { this.navigateTo('Inventory') }} />}
                    {Ability.canView(role, 'Client') && <DrawerItem screen={'Clients'} navigateTo={() => { this.navigateTo('Client') }} />}
                    {Ability.canView(role, 'Targets') && <DrawerItem screen={'Targets'} navigateTo={() => { this.navigateTo('Targets', { screen: 'Targets' }) }} />}
                    <DrawerItem screen={'Create User'} navigateTo={() => { this.navigateTo('CreateUser') }} />
                    <View style={styles.underLine} />
                    <DrawerItem screen={'Change Password'} navigateTo={() => { this.navigateTo('ChangePassword') }} />
                    <DrawerItem screen={'Logout'} navigateTo={this.signOut} />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user,
        token: store.user.token,
        store: store,
        loading: store.user.loading,
        count: store.listings.count
    }
}

export default connect(mapStateToProps)(CustomDrawerContent)