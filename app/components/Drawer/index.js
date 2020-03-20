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

class CustomDrawerContent extends React.Component {

    constructor (props) {
        super(props)
    }

    navigateTo = (screen) => {
        console.log(' i am inside navigateTo')
        RootNavigation.navigate(screen)
    }

    signOut = () => {
        this.props.dispatch(logoutUser())
    }

    render () {
        const {user}= this.props
        const {role}= user
        return (
            <SafeAreaView style={[AppStyles.mb1, {width: '100%'}]}>
                <ScrollView  style={[styles.scrollContainer, {width: '100%'}]}>
                    <View style={AppStyles.flexDirectionRow}>
                        <View>
                            <UserAvatar  size="50" src='https://pickaface.net/gallery/avatar/unr_ironman_170308_2112_9ldw5b.png' name={`${user.firstName}`}/>
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
                    { Ability.canView(role, 'Diary') && <DrawerIconItem screen={'Diary'} badges={15} navigateTo={ () => {this.navigateTo('Diary')}}/> }
                    { Ability.canView(role, 'TeamDiary') && <DrawerItem screen={'Team Diary'} navigateTo={ () => {this.navigateTo('TeamDiary')}}/> }
                    <DrawerIconItem screen={'Leads'} badges={20} navigateTo={ () => {this.navigateTo('Lead')}} />
                    <DrawerIconItem screen={'Inventory'} badges={30} navigateTo={ () => {this.navigateTo('Inventory')}} />
                    <DrawerItem screen={'Clients'} navigateTo={ () => {}}/>
                    <DrawerItem screen={'Targets'} navigateTo={ () => {}}/>
                    <DrawerItem screen={'Users'} navigateTo={ () => {}}/>
                    <View style={styles.underLine} />
                    <DrawerItem screen={'Logout'} navigateTo={this.signOut}/>
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
        loading: store.user.loading
    }
  }
  
  export default connect(mapStateToProps)(CustomDrawerContent)