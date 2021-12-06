/** @format */

import axios from 'axios'
import * as Linking from 'expo-linking'
import React from 'react'
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import addIcon from '../../../assets/img/add-icon-l.png'
import { setContacts } from '../../actions/contacts'
import { getListingsCount } from '../../actions/listings'
import { getCurrentUser } from '../../actions/user'
import AndroidNotifications from '../../AndroidNotifications'
import AppStyles from '../../AppStyles'
import LandingTile from '../../components/LandingTile'
import Loader from '../../components/loader'
import StatisticsTile from '../../components/StatisticsTile'
import helper from '../../helper'
import Ability from '../../hoc/Ability'
import UpdateApp from '../../UpdateApp'
import styles from './style'

class Landing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tiles: [],
      tileNames: [
        'InventoryTabs',
        'Leads',
        'My Deals',
        'Diary',
        'Dashboard',
        'Team Diary',
        'Targets',
      ],
      loading: true,
      userStatistics: null,
      toggleStatsTile: true,
      kpisData: [],
    }
  }

  async componentDidMount() {
    const { navigation, dispatch, contacts, user } = this.props
    this._unsubscribe = navigation.addListener('focus', () => {
      dispatch(getListingsCount())
      this.props.dispatch(setContacts())
      this.getUserStatistics()
      this.getUserStatistics2()
    })
    await dispatch(getCurrentUser()) // always get updated information of user from /api/user/me
    this._handleDeepLink()
    this._addLinkingListener() // if app is in foreground, this function is called for deep linking
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
    const { user, count } = this.props
    const { tileNames } = this.state
    let counter = 0
    let tileData = []

    for (let tile of tileNames) {
      let label = tile
      tile = tile.replace(/ /g, '')
      if (Ability.canView(user.subRole, tile)) {
        if (label === 'InventoryTabs') label = 'Property Leads'
        let oneTilee = {
          screenName: tile,
        }
        if (label === 'Team Diary') label = "Team's Diary"
        if (tile === 'Leads') label = 'My Leads'
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
    this.setState({ tiles: tileData })
  }

  // ****** Navigate Function
  navigateFunction = (name, screenName) => {
    const { navigation } = this.props
    if (screenName === 'InventoryTabs') {
      navigation.navigate('InventoryTabs', {
        screen: 'ARMS',
        params: { screen: screenName },
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
    } else {
      navigation.navigate(name, { screen: screenName })
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

  render() {
    const { tiles, loading, toggleStatsTile, kpisData } = this.state
    const { user, navigation } = this.props
    let isShowKPIs = this.isShowKPIsView()
    return (
      <SafeAreaView style={[AppStyles.container, styles.mainContainer]}>
        <AndroidNotifications navigation={navigation} />
        {tiles.length ? (
          <FlatList
            style={styles.scrollContainer}
            numColumns={2}
            data={tiles}
            renderItem={(item, index) => (
              <LandingTile
                navigateFunction={this.navigateFunction}
                pagePath={item.item.pagePath}
                screenName={item.item.screenName}
                badges={item.item.badges}
                label={item.item.label}
                imagePath={item.item.buttonImg}
              />
            )}
            keyExtractor={(item, index) => item.id.toString()}
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

        <View style={styles.btnView}>
          {Ability.canAdd(user.subRole, 'InventoryTabs') ? (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('AddInventory', { update: false })
              }}
              style={styles.btnStyle}
            >
              <Image source={addIcon} style={styles.containerImg} />
              <Text style={styles.font}>PRF</Text>
            </TouchableOpacity>
          ) : null}
          {Ability.canAdd(user.subRole, 'Client') ? (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('AddClient', { update: false })
              }}
              style={[styles.btnStyle, { marginLeft: 5 }]}
            >
              <Image source={addIcon} style={styles.containerImg} />
              <Text style={styles.font}>CRF</Text>
            </TouchableOpacity>
          ) : null}
        </View>
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
  }
}

export default connect(mapStateToProps)(Landing)
