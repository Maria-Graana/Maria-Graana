/** @format */

import moment from 'moment'
import * as React from 'react'
import { ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux'
import AppJson from '../../../app.json'
import { clearDiaries } from '../../actions/diary'
import { setSlotData } from '../../actions/slotManagement'
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
import { Divider } from 'react-native-paper'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import { setDrawerInternalMenu } from '../../actions/drawer'

const _format = 'YYYY-MM-DD'
const _today = moment(new Date()).format(_format)

class CustomDrawerContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDate: _today,
    }
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

  goToAddEditDiaryScreen = (update, data = null) => {
    const { navigation, dispatch } = this.props
    const { selectedDate } = this.state
    dispatch(clearDiaries())
    if (data) {
      dispatch(setSlotData(moment(data.date).format('YYYY-MM-DD'), data.start, data.end, []))
    }
    navigation.navigate('AddDiary', { update, data, selectedDate })
  }

  goToFormPage = (page, status, client) => {
    const { navigation } = this.props
    navigation.navigate(page, { pageName: status, client, name: client && client.customerName })
  }

  render() {
    const { user, count, permissions, drawerMenuOptions, dispatch } = this.props
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
          <View style={{ width: '100%' }}>
            {getPermissionValue(PermissionFeatures.DIARY, PermissionActions.CREATE, permissions) ||
            getPermissionValue(
              PermissionFeatures.PROPERTIES,
              PermissionActions.CREATE,
              permissions
            ) ||
            getPermissionValue(
              PermissionFeatures.BUY_RENT_LEADS,
              PermissionActions.CREATE,
              permissions
            ) ||
            getPermissionValue(
              PermissionFeatures.PROJECT_LEADS,
              PermissionActions.CREATE,
              permissions
            ) ||
            getPermissionValue(
              PermissionFeatures.CLIENTS,
              PermissionActions.CREATE,
              permissions
            ) ? (
              <DrawerIconItem
                screen={'+ Create '}
                navigateTo={() => {
                  dispatch(setDrawerInternalMenu(!drawerMenuOptions))
                }}
                display={drawerMenuOptions}
                buttonStyling={true}
              />
            ) : null}
            {drawerMenuOptions && (
              <View style={styles.mainOptionView}>
                {/* <View style={styles.menuShapeView}></View> */}
                {getPermissionValue(
                  PermissionFeatures.CLIENTS,
                  PermissionActions.CREATE,
                  permissions
                ) &&
                  drawerMenuOptions && (
                    <View style={styles.optionView}>
                      <TouchableWithoutFeedback
                        activeOpacity={0.7}
                        onPress={() => {
                          this.navigateTo('AddClient')
                        }}
                      >
                        <View style={styles.optionInnerView}>
                          <Text style={styles.textColor}>Register Client</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  )}
                <Divider color={'#F1F1F1'} />
                {getPermissionValue(
                  PermissionFeatures.PROJECT_LEADS,
                  PermissionActions.CREATE,
                  permissions
                ) &&
                  drawerMenuOptions && (
                    <View style={styles.optionView}>
                      <TouchableWithoutFeedback
                        activeOpacity={0.7}
                        onPress={() => {
                          this.goToFormPage('AddCMLead', 'CM', null)
                        }}
                      >
                        <View style={styles.optionInnerView}>
                          <Text style={styles.textColor}>Add Project Lead</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  )}
                <Divider color={'#F1F1F1'} />

                {getPermissionValue(
                  PermissionFeatures.BUY_RENT_LEADS,
                  PermissionActions.CREATE,
                  permissions
                ) &&
                  drawerMenuOptions && (
                    <View style={styles.optionView}>
                      <TouchableWithoutFeedback
                        activeOpacity={0.7}
                        onPress={() => {
                          this.goToFormPage('AddRCMLead', 'RCM', null)
                        }}
                      >
                        <View style={styles.optionInnerView}>
                          <Text style={styles.textColor}>Add Buy/Rent Lead</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  )}
                <Divider color={'#F1F1F1'} />

                {getPermissionValue(
                  PermissionFeatures.DIARY,
                  PermissionActions.CREATE,
                  permissions
                ) &&
                  drawerMenuOptions && (
                    <View style={styles.optionView}>
                      <TouchableWithoutFeedback
                        activeOpacity={0.7}
                        onPress={() => {
                          this.goToAddEditDiaryScreen()
                        }}
                      >
                        <View style={styles.optionInnerView}>
                          <Text style={styles.textColor}>Add Diary Task</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  )}
                <Divider color={'#F1F1F1'} />

                {getPermissionValue(
                  PermissionFeatures.PROPERTIES,
                  PermissionActions.CREATE,
                  permissions
                ) &&
                  drawerMenuOptions && (
                    <View style={styles.optionView}>
                      <TouchableWithoutFeedback
                        activeOpacity={0.7}
                        onPress={() => {
                          this.navigateTo('AddInventory')
                        }}
                      >
                        <View style={styles.optionInnerView}>
                          <Text style={styles.textColor}>Add Property</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  )}
              </View>
            )}
          </View>

          {getPermissionValue(PermissionFeatures.DIARY, PermissionActions.READ, permissions) && (
            <DrawerIconItem
              screen={'Diary'}
              badges={count.diary}
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
                this.props.navigation.navigate('Leads', { screen: 'Leads', hasBooking: false })
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
                this.props.navigation.navigate('Leads', { screen: 'MyDeals', hasBooking: true })
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
            PermissionActions.PROJECT_INVENTORY_PAGE_VIEW,
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
            <Text style={AppStyles.blackInputText}>v{AppJson.expo.version}</Text>
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
    drawerMenuOptions: store.drawer.drawerMenuOptions,
  }
}

export default connect(mapStateToProps)(CustomDrawerContent)
