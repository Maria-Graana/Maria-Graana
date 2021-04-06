/** @format */

import axios from 'axios'
import * as Linking from 'expo-linking'
import React from 'react'
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View, Platform } from 'react-native'
import { AntDesign, FontAwesome5 } from '@expo/vector-icons'
import { connect } from 'react-redux'
import addIcon from '../../../assets/img/add-icon-l.png'
import RightArrow from '../../../assets/img/white-.png'
import LeftArrow from '../../../assets/img/blue-.png'
import HomeBlue from '../../../assets/img/home-blue.png'
import MapBlue from '../../../assets/img/map-blue.png'
import TargetNew from '../../../assets/img/target-new.png'
import { setContacts } from '../../actions/contacts'
import { getListingsCount } from '../../actions/listings'
import AndroidNotifications from '../../AndroidNotifications'
import AppStyles from '../../AppStyles'
import LandingTile from '../../components/LandingTile'
import Loader from '../../components/loader'
import StatisticsTile from '../../components/StatisticsTile'
import helper from '../../helper'
import Ability from '../../hoc/Ability'
import UpdateApp from '../../UpdateApp'
import styles from './style'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

class Landing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tiles: [],
      tileNames: ['InventoryTabs', 'Leads', 'Diary', 'Dashboard', 'Team Diary', 'Targets'],
      loading: true,
      userStatistics: null,
      toggleStatsTile: false,
    }
  }

  componentDidMount() {
    const { navigation, dispatch, contacts } = this.props
    this._unsubscribe = navigation.addListener('focus', () => {
      dispatch(getListingsCount())
      this.props.dispatch(setContacts())
      this.getUserStatistics()
    })
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
        if (tile === 'Leads') label = 'Client Leads'
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
    } else {
      navigation.navigate(name, { screen: screenName })
    }
  }

  toggleStats = () => {
    const { toggleStatsTile } = this.state
    console.log('toggleStats: ', toggleStatsTile)
    this.setState({
      toggleStatsTile: !toggleStatsTile,
    })
  }

  render() {
    const { tiles, userStatistics, loading, toggleStatsTile } = this.state
    const { user, navigation } = this.props

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
        {!toggleStatsTile ? (
          <TouchableOpacity
            onPress={() => {
              this.toggleStats()
            }}
            style={styles.falseStatsIcon}
          >
            <Image source={RightArrow} style={styles.statsIcon} />
          </TouchableOpacity>
        ) : null}
        <View style={toggleStatsTile ? styles.kpiContainer : styles.kpiContainerFalse}>
          {toggleStatsTile ? (
            <TouchableOpacity
              onPress={() => {
                this.toggleStats()
              }}
              style={styles.buttonShadowView}
            >
              <Image source={LeftArrow} style={styles.statsIcon} />
            </TouchableOpacity>
          ) : null}
          {toggleStatsTile ? (
            <View style={{ flex: 1 }}>
              {loading ? (
                <View style={styles.loaderView}>
                  <Loader loading={loading} />
                </View>
              ) : (
                <>
                  <Text style={styles.kpiText}>KPIs:</Text>
                  <StatisticsTile imagePath={TargetNew} value={userStatistics.avgTime} />
                  <StatisticsTile imagePath={HomeBlue} value={userStatistics.listing} />
                  <StatisticsTile imagePath={MapBlue} value={userStatistics.geoTaggedListing} />
                  <StatisticsTile
                    title={'LCR'}
                    value={this.showLeadWonAssignedPercentage(
                      userStatistics.won,
                      userStatistics.totalLeads
                    )}
                  />
                </>
              )}
            </View>
          ) : null}
        </View>
        <View style={styles.btnView}>
          {Ability.canAdd(user.subRole, 'InventoryTabs') ? (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('AddInventory', { update: false })
              }}
              style={styles.btnStyle}
            >
              <Image source={addIcon} style={styles.containerImg} />
              <Text style={styles.font}>Property</Text>
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
              <Text style={styles.font}>Client</Text>
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
