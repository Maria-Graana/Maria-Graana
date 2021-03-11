/** @format */

import { FlatList } from 'react-native'
import * as Linking from 'expo-linking';
import Ability from '../../hoc/Ability'
import AppStyles from '../../AppStyles'
import styles from './style'
import helper from '../../helper'
import LandingTile from '../../components/LandingTile'
import PushNotification from '../../PushNotifications'
import AndroidNotifications from '../../AndroidNotifications'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux'
import { getListingsCount } from '../../actions/listings'
import { View, TouchableOpacity, Text, Image } from 'react-native'
import addIcon from '../../../assets/img/add-icon-l.png'
import { setContacts } from '../../actions/contacts'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
import UpdateApp from '../../UpdateApp'

class Landing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tiles: [],
      tileNames: [
        'Dashboard',
        'Leads',
        'Client',
        'InventoryTabs',
        'Diary',
        'Team Diary',
        'Targets',
      ],
    }
  }

  componentDidMount() {
    const { navigation, dispatch, contacts } = this.props
    // this._handleDeepLink()     // if app is not in opened state this function is executed for deep linking
    this._unsubscribe = navigation.addListener('focus', () => {
      dispatch(getListingsCount())
      this.props.dispatch(setContacts())
    })
    // this._addLinkingListener(); // if app is in foreground, this function is called for deep linking
  }


  _handleDeepLink = () => {
    const { navigation } = this.props;
    Linking.getInitialURL().then(async (url) =>  {
      const { path } = await Linking.parseInitialURLAsync(url)
      const pathArray = path?.split('/') ?? []
      const leadId = pathArray[pathArray.length - 1];
      const purposeTab = pathArray.includes('cmLead')
        ? 'invest'
        : pathArray.includes('rcmLead') && pathArray.includes('buy')
          ? 'sale'
          : pathArray.includes('rcmLead') && pathArray.includes('rent')
            ? 'rent'
            : ''
      path ? navigation.navigate('LeadDetail', {
        purposeTab,
        lead: { id: leadId },
      })
        : null
    })
  }


  componentDidUpdate(prevProps) {
    if (prevProps.count !== this.props.count) {
      this.fetchTiles()
    }
  }

  _handleRedirectInForeground = (event) => {
    const { navigation } = this.props;
    const { path } = Linking.parse(event.url)
    const pathArray = path?.split('/') ?? []
      const leadId = pathArray[pathArray.length - 1];
      const purposeTab = pathArray.includes('cmLead')
        ? 'invest'
        : pathArray.includes('rcmLead') && pathArray.includes('buy')
          ? 'sale'
          : pathArray.includes('rcmLead') && pathArray.includes('rent')
            ? 'rent'
            : ''
      path ? navigation.navigate('LeadDetail', {
        purposeTab,
        lead: { id: leadId },
      })
        : null
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
        if (label === 'InventoryTabs') label = 'Properties'
        let oneTilee = {
          screenName: tile,
        }
        if (label === 'Team Diary') label = "Team's Diary"
        if (label === 'Client') label = 'Clients'
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

  render() {
    const { tiles } = this.state
    const { user, navigation } = this.props

    return (
      <SafeAreaView
        style={[
          AppStyles.container,
          {
            backgroundColor: AppStyles.colors.primaryColor,
            paddingHorizontal: wp('0%'),
            paddingLeft: 0,
          },
        ]}
      >
        <AndroidNotifications navigation={navigation} />
        {tiles.length ? (
          <FlatList
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
        <View style={styles.btnView}>
          {Ability.canAdd(user.subRole, 'InventoryTabs') ? (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('AddInventory', { update: false })
              }}
              style={styles.btnStyle}
            >
              <Image source={addIcon} style={styles.containerImg} />
              <Text style={styles.font}>Add Property</Text>
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
              <Text style={styles.font}>Add Client</Text>
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
