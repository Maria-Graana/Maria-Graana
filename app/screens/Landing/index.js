/** @format */

import axios from 'axios'
import * as Linking from 'expo-linking'
import React from 'react'
import { FlatList, SafeAreaView } from 'react-native'
import { connect } from 'react-redux'
import { setContacts } from '../../actions/contacts'
import { getListingsCount } from '../../actions/listings'
import { getCurrentUser, isTerminalUser } from '../../actions/user'
import AndroidNotifications from '../../AndroidNotifications'
import AppStyles from '../../AppStyles'
import LandingTile from '../../components/LandingTile'
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency'
import Loader from '../../components/loader'
import StatisticsTile from '../../components/StatisticsTile'
import helper from '../../helper'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import { FAB } from 'react-native-paper'
import UpdateApp from '../../UpdateApp'
import styles from './style'
import { clearDiaries } from '../../actions/diary'
import { getTimeShifts, setSlotData } from '../../actions/slotManagement'
import moment from 'moment'

const _format = 'YYYY-MM-DD'
const _today = moment(new Date()).format(_format)

class Landing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tiles: [],
      tileNames: [
        {
          tile: 'Clients',
          actions: 'CLIENTS',
        },
        {
          tile: 'Diary',
          actions: 'DIARY',
        },
        {
          tile: 'Project Leads',
          actions: 'PROJECT_LEADS',
        },
        {
          tile: 'Project Deals',
          actions: 'PROJECT_LEADS',
        },
        {
          tile: 'Leads',
          actions: 'PROJECT_LEADS',
        },
        {
          tile: 'My Deals',
          actions: 'PROJECT_LEADS',
        },
        {
          tile: 'Properties',
          actions: 'PROPERTIES',
        },
        {
          tile: 'Project Inventory',
          actions: 'APP_PAGES',
        },
        {
          tile: 'Targets',
          actions: 'TARGETS',
        },
        {
          tile: 'Contacts',
          actions: 'CONTACTS',
        },
      ],
      loading: true,
      userStatistics: null,
      toggleStatsTile: true,
      kpisData: [],
      fabActions: [],
      open: false,
      selectedDate: _today,
    }
  }

  async componentDidMount() {
    const { navigation, dispatch } = this.props
    dispatch(getTimeShifts())
    this.props.dispatch(setContacts())
    this._unsubscribe = navigation.addListener('focus', () => {
      dispatch(getListingsCount())
      dispatch(isTerminalUser())
      this.getUserStatistics()
      this.getUserStatistics2()
      this.setFabActions()
    })
    await dispatch(getCurrentUser()) // always get updated information of user from /api/user/me
    this._handleDeepLink()
    this._addLinkingListener() // if app is in foreground, this function is called for deep linking
    const { status } = await requestTrackingPermissionsAsync()
    if (status === 'granted') {
      console.log('Yay! I have user permission to track data')
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.count !== this.props.count) {
      this.fetchTiles()
    }
  }

  _handleDeepLink = () => {
    const { navigation } = this.props
    Linking.getInitialURL().then(async (url) => {
      const { path } = await Linking.parseInitialURLAsync(url)
      const pathArray = path?.split('/') ?? []
      if (pathArray && pathArray.length) {
        const leadId = pathArray[pathArray.length - 1]
        const purposeTab = pathArray.includes('cmLead')
          ? 'invest'
          : pathArray.includes('rcmLead') && pathArray.includes('buy')
          ? 'sale'
          : pathArray.includes('rcmLead') && pathArray.includes('rent')
          ? 'rent'
          : ''
        pathArray.includes('cmLead') || pathArray.includes('rcmLead')
          ? navigation.navigate('LeadDetail', {
              purposeTab,
              lead: { id: leadId },
            })
          : null
      }
    })
  }

  _handleRedirectInForeground = (event) => {
    const { navigation } = this.props
    const { path } = Linking.parse(event.url)
    const pathArray = path?.split('/') ?? []
    if (pathArray && pathArray.length) {
      const leadId = pathArray[pathArray.length - 1]
      const purposeTab = pathArray.includes('cmLead')
        ? 'invest'
        : pathArray.includes('rcmLead') && pathArray.includes('buy')
        ? 'sale'
        : pathArray.includes('rcmLead') && pathArray.includes('rent')
        ? 'rent'
        : ''
      pathArray.includes('cmLead') || pathArray.includes('rcmLead')
        ? navigation.navigate('LeadDetail', {
            purposeTab,
            lead: { id: leadId },
          })
        : null
    }
  }

  getUserStatistics = () => {
    const { kpisData } = this.state
    axios
      .get(`/api/user/stats`)
      .then((response) => {
        this.setState({ userStatistics: response.data })
      })
      .catch((error) => {
        console.log('error getting statistic at /api/user/stats', error)
      })
      .finally(() => {
        this.setState({ loading: false })
      })
  }

  getUserStatistics2 = () => {
    const { kpisData } = this.state
    const { user } = this.props
    axios
      .get(`/api/user/kpis`)
      .then((res) => {
        let kpis = helper.setKPIsData(user.subRole, res.data)
        this.setState({ kpisData: kpis })
      })
      .catch((error) => {
        console.log('error getting statistic at /api/user/stats', error)
      })
  }

  showLeadWonAssignedPercentage = (wonLeads, assignedLeads) => {
    if (wonLeads && assignedLeads) {
      return `${((wonLeads / assignedLeads) * 100).toFixed(1)} %`
    } else {
      return null
    }
  }

  _addLinkingListener = () => {
    Linking.addEventListener('url', this._handleRedirectInForeground)
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  fetchTiles = () => {
    const { count, permissions } = this.props
    const { tileNames } = this.state
    let counter = 0
    let tileData = []

    for (let oneTile of tileNames) {
      const { tile, actions } = oneTile
      let label = tile
      tile = tile.replace(/ /g, '')
      if (oneTile.tile === 'Project Leads') {
        if (
          getPermissionValue(
            PermissionFeatures.APP_PAGES,
            PermissionActions.PROJECT_LEADS_PAGE_VIEW,
            permissions
          )
        ) {
          if (label === 'Team Diary') label = "Team's Diary"
          let oneTile = {
            id: counter,
            label: label,
            pagePath: tile,
            buttonImg: helper.tileImage(tile),
            screenName: tile,
          }
          if (tile.toLocaleLowerCase() in count) oneTile.badges = count[tile.toLocaleLowerCase()]
          else oneTile.badges = 0
          if (oneTile.badges > 99) oneTile.badges = '99+'
          tileData.push(oneTile)
          counter++
        }
      } else if (oneTile.tile === 'Leads') {
        if (
          getPermissionValue(
            PermissionFeatures.APP_PAGES,
            PermissionActions.BUYRENT_LEADS_PAGE_VIEW,
            permissions
          ) ||
          getPermissionValue(
            PermissionFeatures.APP_PAGES,
            PermissionActions.WANTED_LEADS_PAGE_VIEW,
            permissions
          )
        ) {
          if (label === 'Team Diary') label = "Team's Diary"
          if (tile === 'Leads') label = 'Buy/Rent Leads'
          let oneTile = {
            id: counter,
            label: label,
            pagePath: tile,
            buttonImg: helper.tileImage(tile),
            screenName: tile,
          }
          if (tile.toLocaleLowerCase() in count) oneTile.badges = count[tile.toLocaleLowerCase()]
          else oneTile.badges = 0
          if (oneTile.badges > 99) oneTile.badges = '99+'
          tileData.push(oneTile)
          counter++
        }
      } else if (oneTile.tile === 'My Deals') {
        if (
          getPermissionValue(
            PermissionFeatures.APP_PAGES,
            PermissionActions.MY_DEALS_BUY_RENT,
            permissions
          )
        ) {
          if (label === 'Team Diary') label = "Team's Diary"
          if (tile === 'MyDeals') label = 'Buy/Rent Deals'
          let oneTile = {
            id: counter,
            label: label,
            pagePath: tile,
            buttonImg: helper.tileImage(tile),
            screenName: tile,
          }
          if (tile.toLocaleLowerCase() in count) oneTile.badges = count[tile.toLocaleLowerCase()]
          else oneTile.badges = 0
          if (oneTile.badges > 99) oneTile.badges = '99+'
          tileData.push(oneTile)
          counter++
        }
      } else if (oneTile.tile === 'Project Deals') {
        if (
          getPermissionValue(
            PermissionFeatures.APP_PAGES,
            PermissionActions.MY_DEALS_PROJECT,
            permissions
          )
        ) {
          if (label === 'Team Diary') label = "Team's Diary"
          let oneTile = {
            id: counter,
            label: label,
            pagePath: tile,
            buttonImg: helper.tileImage(tile),
            screenName: tile,
          }
          if (tile.toLocaleLowerCase() in count) oneTile.badges = count[tile.toLocaleLowerCase()]
          else oneTile.badges = 0
          if (oneTile.badges > 99) oneTile.badges = '99+'
          tileData.push(oneTile)
          counter++
        }
      } else {
        if (
          (oneTile.tile !== 'Project Inventory' &&
            oneTile.tile !== 'Contacts' &&
            getPermissionValue(PermissionFeatures[actions], PermissionActions.READ, permissions)) ||
          (oneTile.tile === 'Contacts' &&
            getPermissionValue(
              PermissionFeatures.APP_PAGES,
              PermissionActions.CONTACTS,
              permissions
            )) ||
          (oneTile.tile === 'Project Inventory' &&
            getPermissionValue(
              PermissionFeatures.APP_PAGES,
              PermissionActions.PROJECT_INVENTORY_PAGE_VIEW,
              permissions
            ))
        ) {
          if (label === 'Project Inventory') label = 'Inventory'
          if (label === 'InventoryTabs') label = 'Properties'
          if (label === 'Team Diary') label = "Team's Diary"
          if (tile === 'Leads') label = 'Buy/Rent Leads'
          if (tile === 'MyDeals') label = 'Buy/Rent Deals'
          let oneTile = {
            id: counter,
            label: label,
            pagePath: tile,
            buttonImg: helper.tileImage(tile),
            screenName: tile,
          }
          if (tile.toLocaleLowerCase() in count) oneTile.badges = count[tile.toLocaleLowerCase()]
          else oneTile.badges = 0
          if (oneTile.badges > 99) oneTile.badges = '99+'
          tileData.push(oneTile)
          counter++
        }
      }
    }
    this.setState({ tiles: tileData })
  }

  // ****** Navigate Function
  navigateFunction = (name, screenName) => {
    const { navigation } = this.props
    if (screenName === 'Properties') {
      navigation.navigate('InventoryTabs', {
        screen: 'ARMS',
        params: { screen: 'InventoryTabs' },
      })
    } else if (screenName === 'Leads') {
      navigation.navigate('Leads', {
        screen: screenName,
        hasBooking: false,
      })
    } else if (screenName === 'MyDeals') {
      navigation.navigate('Leads', {
        screen: screenName,
        hasBooking: true,
      })
    } else if (screenName === 'ProjectDeals') {
      navigation.navigate('ProjectLeads', {
        screen: screenName,
        hasBooking: true,
      })
    } else if (screenName === 'ProjectLeads') {
      navigation.navigate('ProjectLeads', {
        screen: screenName,
        hasBooking: false,
      })
    } else if (screenName === 'ProjectInventory') {
      navigation.navigate('AvailableInventory', {
        screen: 'AvailableInventory',
      })
    } else {
      navigation.navigate(name === 'Clients' ? 'Client' : name, { screen: screenName })
    }
  }

  toggleStats = () => {
    const { toggleStatsTile } = this.state
    this.setState({
      toggleStatsTile: !toggleStatsTile,
    })
  }

  isBcOrCCRole = () => {
    const { user } = this.props
    if (
      user.subRole === 'business_centre_manager' ||
      user.subRole === 'business_centre_agent' ||
      user.subRole === 'call_centre_manager' ||
      user.subRole === 'call_centre_warrior' ||
      user.subRole === 'call_centre_agent'
    )
      return true
    else return false
  }

  isShowKPIsView = () => {
    const { user } = this.props
    if (
      user.subRole === 'area_manager' ||
      user.subRole === 'zonal_manager' ||
      user.subRole === 'business_centre_manager' ||
      user.subRole === 'business_centre_agent' ||
      user.subRole === 'branch_manager' ||
      user.subRole === 'sales_agent' ||
      user.subRole === 'call_centre_manager' ||
      user.subRole === 'call_centre_warrior'
    )
      return true
    else return false
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

  setFabActions = () => {
    const { navigation, permissions } = this.props
    let fabActions = []
    {
      getPermissionValue(PermissionFeatures.CLIENTS, PermissionActions.CREATE, permissions) &&
        fabActions.push({
          icon: 'plus',
          label: 'Client Registration',
          color: AppStyles.colors.primaryColor,
          onPress: () => navigation.navigate('AddClient', { update: false }),
        })
    }
    {
      getPermissionValue(PermissionFeatures.PROPERTIES, PermissionActions.CREATE, permissions) &&
        fabActions.push({
          icon: 'plus',
          label: 'Property Registration',
          color: AppStyles.colors.primaryColor,
          onPress: () => navigation.navigate('AddInventory', { update: false }),
        })
    }

    {
      getPermissionValue(PermissionFeatures.DIARY, PermissionActions.CREATE, permissions) &&
        fabActions.push({
          icon: 'plus',
          label: 'Diary Task',
          color: AppStyles.colors.primaryColor,
          onPress: () => this.goToAddEditDiaryScreen(),
        })
    }

    {
      getPermissionValue(PermissionFeatures.CLIENTS, PermissionActions.READ, permissions) &&
        fabActions.push({
          icon: 'plus',
          label: 'Existing Client',
          color: AppStyles.colors.primaryColor,
          onPress: () => navigation.navigate('Client', { screen: 'Client' }),
        })
    }

    this.setState({
      fabActions: fabActions,
    })
  }

  goToFormPage = (page, status, client) => {
    const { navigation } = this.props
    navigation.navigate(page, { pageName: status, client, name: client && client.customerName })
  }

  render() {
    const { tiles, open, fabActions } = this.state
    const { navigation, permissions } = this.props
    return (
      <SafeAreaView style={[AppStyles.container, styles.mainContainer]}>
        <AndroidNotifications navigation={navigation} />

        {tiles.length ? (
          <FlatList
            style={styles.scrollContainer}
            numColumns={2}
            data={tiles}
            renderItem={(item) => (
              <LandingTile
                navigateFunction={this.navigateFunction}
                pagePath={item.item.pagePath}
                screenName={item.item.screenName}
                // badges={item.item.badges} // temporarily hiding count for diary
                label={item.item.label}
                imagePath={item.item.buttonImg}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : null}
        {/* {isShowKPIs ? (
          <TouchableOpacity
            onPress={() => {
              this.toggleStats()
            }}
            style={
              toggleStatsTile
                ? [styles.kpiContainer, { minHeight: this.isBcOrCCRole() ? hp('20%') : hp('20%') }]
                : [
                    styles.kpiContainerFalse,
                    { minHeight: this.isBcOrCCRole() ? hp('20%') : hp('20%') },
                  ]
            }
          >
            {toggleStatsTile ? (
              <View style={{ flex: 1 }}>
                {loading ? (
                  <View style={styles.loaderView}>
                    <Loader loading={loading} />
                  </View>
                ) : (
                  <>
                    <Text style={styles.kpiText}>KPIs</Text>
                    <FlatList
                      style={styles.scrollContainer}
                      data={kpisData}
                      renderItem={({ item }) => (
                        <StatisticsTile unit={''} imagePath={item.image} value={item.value} />
                      )}
                      keyExtractor={(item, index) => item.id.toString()}
                    />
                  </>
                )}
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null} */}

        {/* <View style={styles.btnView}> */}
        {getPermissionValue(PermissionFeatures.PROPERTIES, PermissionActions.CREATE, permissions) ||
        getPermissionValue(PermissionFeatures.CLIENTS, PermissionActions.CREATE, permissions) ||
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
        getPermissionValue(PermissionFeatures.DIARY, PermissionActions.CREATE, permissions) ? (
          <FAB.Group
            open={open}
            icon={open ? 'close' : 'plus'}
            style={{ marginBottom: 16 }}
            fabStyle={{ backgroundColor: AppStyles.bgcWhite.backgroundColor }}
            color={AppStyles.colors.primaryColor}
            actions={fabActions}
            onStateChange={({ open }) => this.setState({ open })}
          />
        ) : null}
        {/* {getPermissionValue(
            PermissionFeatures.PROPERTIES,
            PermissionActions.CREATE,
            permissions
          ) ? (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('AddInventory', { update: false })
              }}
              style={styles.btnStyle}
            >
              <Image source={addIcon} style={styles.containerImg} />
              <Text style={styles.font}>PR</Text>
            </TouchableOpacity>
          ) : null}
          {getPermissionValue(PermissionFeatures.CLIENTS, PermissionActions.CREATE, permissions) ? (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('AddClient', { update: false })
              }}
              style={[styles.btnStyle, { marginLeft: 5 }]}
            >
              <Image source={addIcon} style={styles.containerImg} />
              <Text style={styles.font}>CR</Text>
            </TouchableOpacity>
          ) : null} */}
        {/* </View> */}
        <UpdateApp />
      </SafeAreaView>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    count: store.listings.count,
    contacts: store.contacts.contacts,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(Landing)
