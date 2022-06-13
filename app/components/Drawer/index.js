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
import { StackActions } from '@react-navigation/native'
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
                          <Text style={styles.textColor}>Client Registration</Text>
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
                          <Text style={styles.textColor}>Property Registration</Text>
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
                          <Text style={styles.textColor}>Diary Task</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  )}
                <Divider color={'#F1F1F1'} />

                {getPermissionValue(
                  PermissionFeatures.CLIENTS,
                  PermissionActions.READ,
                  permissions
                ) &&
                  drawerMenuOptions && (
                    <View style={styles.optionView}>
                      <TouchableWithoutFeedback
                        activeOpacity={0.7}
                        onPress={() => {
                          this.navigateTo('Client')
                        }}
                      >
                        <View style={styles.optionInnerView}>
                          <Text style={styles.textColor}>Existing Client</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  )}
              </View>
            )}
          </View>

          <DrawerIconItem
            screen={'Home'}
            navigateTo={() => {
              RootNavigation.popToTop()
              setTimeout(() => {
                this.props.navigation.closeDrawer()
              }, 500)
            }}
          />

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
            PermissionFeatures.APP_PAGES,
            PermissionActions.BUYRENT_LEADS_PAGE_VIEW,
            permissions
          ) ||
          getPermissionValue(
            PermissionFeatures.APP_PAGES,
            PermissionActions.WANTED_LEADS_PAGE_VIEW,
            permissions
          ) ? (
            <DrawerIconItem
              screen={
                user && user.organization && user.organization.isPP
                  ? 'Buy/Rent Leads'
                  : 'Buy/Rent Leads'
              }
              // badges={count.leads}
              navigation={this.props.navigation}
              navigateTo={() => {
                this.props.navigation.closeDrawer()
                this.props.navigation.dispatch(
                  StackActions.push('Leads', {
                    screen: 'Leads',
                    hasBooking: false,
                  })
                )
              }}
            />
          ) : null}

          {getPermissionValue(
            PermissionFeatures.APP_PAGES,
            PermissionActions.MY_DEALS_BUY_RENT,
            permissions
          ) ? (
            <DrawerIconItem
              screen={
                user && user.organization && user.organization.isPP
                  ? 'Buy/Rent Deals'
                  : 'Buy/Rent Deals'
              }
              // badges={count.leads}
              navigateTo={() => {
                this.props.navigation.closeDrawer()
                this.props.navigation.dispatch(
                  StackActions.push('Leads', {
                    screen: 'MyDeals',
                    hasBooking: true,
                  })
                )
              }}
            />
          ) : null}

          {getPermissionValue(
            PermissionFeatures.APP_PAGES,
            PermissionActions.PROJECT_LEADS_PAGE_VIEW,
            permissions
          ) ? (
            <DrawerIconItem
              screen={
                user && user.organization && user.organization.isPP
                  ? 'Project Leads'
                  : 'Project Leads'
              }
              // badges={count.leads}
              navigation={this.props.navigation}
              navigateTo={() => {
                this.props.navigation.closeDrawer()
                this.props.navigation.dispatch(
                  StackActions.push('ProjectLeads', {
                    screen: 'ProjectLeads',
                    hasBooking: false,
                  })
                )
              }}
            />
          ) : null}

          {getPermissionValue(
            PermissionFeatures.APP_PAGES,
            PermissionActions.MY_DEALS_PROJECT,
            permissions
          ) ? (
            <DrawerIconItem
              screen={
                user && user.organization && user.organization.isPP
                  ? 'Project Deals'
                  : 'Project Deals'
              }
              // badges={count.leads}
              navigateTo={() => {
                this.props.navigation.closeDrawer()
                this.props.navigation.dispatch(
                  StackActions.push('ProjectLeads', {
                    screen: 'MyDeals',
                    hasBooking: true,
                  })
                )
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
              screen={'Inventory'}
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
