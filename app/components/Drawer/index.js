/** @format */

import * as React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { logoutUser } from '../../actions/user'
import { connect } from 'react-redux'
import * as RootNavigation from '../../navigation/RootNavigation'
import { SafeAreaView } from 'react-native-safe-area-context'
import DrawerIconItem from '../DrawerIconItem'
import DrawerItem from '../DrawerItem'
import AppStyles from '../../AppStyles'
import styles from './style'
import Ability from '../../hoc/Ability'
import Avatar from '../Avatar/index'
import config from '../../config'
import AppJson from '../../../app.json'
import helper from '../../helper'

class CustomDrawerContent extends React.Component {
  constructor(props) {
    super(props)
  }

  navigateTo = (screen) => {
    RootNavigation.navigate(screen)
  }
  navigateToProperties = () => {
    RootNavigation.navigateTo('InventoryTabs', {
      screen: 'ARMS',
      params: { screen: 'InventoryTabs' },
    })
  }

  signOut = () => {
    this.props.dispatch(logoutUser())
  }

  render() {
    const { user, count } = this.props
    const { subRole } = user
    let label = helper.checkChannel(config.channel)
    return (
      <SafeAreaView style={[AppStyles.mb1, { width: '100%' }]}>
        <ScrollView
          style={[styles.scrollContainer, { width: '100%' }]}
          contentContainerStyle={AppStyles.mb1}
        >
          <View style={AppStyles.flexDirectionRow}>
            <View>
              <Avatar data={user} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.nameText}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.emailText}>{user.email}</Text>
            </View>
          </View>
          <View style={styles.underLine} />
          {Ability.canView(subRole, 'Dashboard') && (
            <DrawerItem
              screen={'Dashboard'}
              navigateTo={() => {
                this.navigateTo('Dashboard')
              }}
            />
          )}
          {Ability.canView(subRole, 'Diary') && (
            <DrawerIconItem
              screen={'Diary'}
              badges={count.diary}
              navigateTo={() => {
                this.navigateTo('Diary')
              }}
            />
          )}
          {Ability.canView(subRole, 'TeamDiary') && (
            <DrawerItem
              screen={'Team Diary'}
              navigateTo={() => {
                this.navigateTo('TeamDiary')
              }}
            />
          )}
          {Ability.canView(subRole, 'Leads') && (
            <DrawerIconItem
              screen={
                user && user.organization && user.organization.isPP ? 'Leads' : 'Client Leads'
              }
              badges={count.leads}
              navigateTo={() => {
                this.navigateTo('Leads')
              }}
            />
          )}
          {/* {
                        navigation.navigate('InventoryTabs', {screen: 'ARMS',params: { screen: screenName },})
                    } */}
          {Ability.canView(subRole, 'InventoryTabs') && (
            <DrawerIconItem
              screen={
                user && user.organization && user.organization.isPP
                  ? 'Properties'
                  : 'Property Leads'
              }
              badges={count.inventory}
              navigateTo={() => {
                this.navigateToProperties()
              }}
            />
          )}
          {Ability.canView(subRole, 'Client') && (
            <DrawerItem
              screen={'Clients'}
              navigateTo={() => {
                this.navigateTo('Client')
              }}
            />
          )}
          {Ability.canView(subRole, 'Targets') && (
            <DrawerItem
              screen={'Targets'}
              navigateTo={() => {
                this.navigateTo('Targets', { screen: 'Targets' })
              }}
            />
          )}
          {Ability.canView(subRole, 'AssignedAreas') && (
            <DrawerItem
              screen={'Assigned Areas'}
              navigateTo={() => {
                this.navigateTo('AssignedAreas', { screen: 'AssignAreas' })
              }}
            />
          )}
          {/* {Ability.canView(role, 'CreateUser') && <DrawerItem screen={'Create User'} navigateTo={() => { this.navigateTo('CreateUser') }} />} */}

          <View style={styles.underLine} />
          <DrawerItem
            screen={'Change Password'}
            navigateTo={() => {
              this.navigateTo('ChangePassword')
            }}
          />
          <DrawerItem
            screen={'Logout'}
            navigateTo={() => {
              this.props.navigation.closeDrawer()
              setTimeout(() => this.signOut(), 0)
            }}
          />
          <View style={{ alignSelf: 'center', justifyContent: 'flex-end', flex: 1 }}>
            <Text style={AppStyles.blackInputText}>
              {label}v{AppJson.expo.version}
            </Text>
          </View>
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
    count: store.listings.count,
  }
}

export default connect(mapStateToProps)(CustomDrawerContent)
