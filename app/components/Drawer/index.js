/** @format */

import * as React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux'
import AppJson from '../../../app.json'
import { logoutUser } from '../../actions/user'
import AppStyles from '../../AppStyles'
import config from '../../config'
import helper from '../../helper'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import * as RootNavigation from '../../navigation/RootNavigation'
import Avatar from '../Avatar/index'
import DrawerIconItem from '../DrawerIconItem'
import DrawerItem from '../DrawerItem'
import styles from './style'

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
    const { user, count, permissions } = this.props
    const { subRole } = user
    let label = helper.checkChannel(config.channel)
    return (
      <SafeAreaView style={[AppStyles.mb1, { width: '100%' }]}>
        <ScrollView style={[styles.scrollContainer, { width: '100%' }]}>
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
          {/* {Ability.canView(subRole, 'Dashboard') && (
            <DrawerItem
              screen={'Dashboard'}
              navigateTo={() => {
                this.navigateTo('Dashboard')
              }}
            />
          )} */}
          {getPermissionValue(PermissionFeatures.DIARY, PermissionActions.READ, permissions) && (
            <DrawerIconItem
              screen={'Diary'}
              badges={0}
              navigateTo={() => {
                this.navigateTo('Diary')
              }}
            />
          )}
          {/* {Ability.canView(subRole, 'TeamDiary') && (
            <DrawerItem
              screen={'Team Diary'}
              navigateTo={() => {
                this.navigateTo('TeamDiary')
              }}
            />
          )} */}
          {getPermissionValue(
            PermissionFeatures.PROJECT_LEADS,
            PermissionActions.READ,
            permissions
          ) ||
          getPermissionValue(
            PermissionFeatures.BUY_RENT_LEADS,
            PermissionActions.READ,
            permissions
          ) ||
          getPermissionValue(
            PermissionFeatures.WANTED_LEADS,
            PermissionActions.READ,
            permissions
          ) ? (
            <DrawerIconItem
              screen={user && user.organization && user.organization.isPP ? 'Leads' : 'Leads'}
              badges={count.leads}
              navigateTo={() => {
                this.navigateTo('Leads', { params: { screen: 'Leads' } })
              }}
            />
          ) : null}
          {getPermissionValue(
            PermissionFeatures.PROJECT_LEADS,
            PermissionActions.READ,
            permissions
          ) ||
          getPermissionValue(
            PermissionFeatures.BUY_RENT_LEADS,
            PermissionActions.READ,
            permissions
          ) ? (
            <DrawerIconItem
              screen={user && user.organization && user.organization.isPP ? 'Deals' : 'Deals'}
              badges={count.leads}
              navigateTo={() => {
                this.navigateTo('Leads', { params: { screen: 'MyDeals' } })
              }}
            />
          ) : null}
          {getPermissionValue(PermissionFeatures.CLIENTS, PermissionActions.READ, permissions) && (
            <DrawerItem
              screen={'Clients'}
              navigateTo={() => {
                this.navigateTo('Client')
              }}
            />
          )}
          {getPermissionValue(
            PermissionFeatures.PROPERTIES,
            PermissionActions.READ,
            permissions
          ) && (
            <DrawerIconItem
              screen={
                user && user.organization && user.organization.isPP ? 'Properties' : 'Properties'
              }
              badges={count.inventory}
              navigateTo={() => {
                this.navigateToProperties()
              }}
            />
          )}
          {getPermissionValue(
            PermissionFeatures.APP_PAGES,
            PermissionActions.AVAILABLE_INVENTORY_PAGE_VIEW,
            permissions
          ) && (
            <DrawerItem
              screen={'Project Inventory'}
              navigateTo={() => {
                this.navigateTo('AvailableInventory', { screen: 'AvailableInventory' })
              }}
            />
          )}
          {getPermissionValue(PermissionFeatures.TARGETS, PermissionActions.READ, permissions) && (
            <DrawerItem
              screen={'Targets'}
              navigateTo={() => {
                this.navigateTo('Targets', { screen: 'Targets' })
              }}
            />
          )}
          {/* {Ability.canView(subRole, 'AssignedAreas') && (
            <DrawerItem
              screen={'Assigned Areas'}
              navigateTo={() => {
                this.navigateTo('AssignedAreas', { screen: 'AssignAreas' })
              }}
            />
          )} */}

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
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(CustomDrawerContent)
