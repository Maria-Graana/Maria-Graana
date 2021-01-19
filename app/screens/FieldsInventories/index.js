/** @format */

import * as RootNavigation from '../../navigation/RootNavigation'

import { Alert, FlatList, Image, Text, View } from 'react-native'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

import Ability from '../../hoc/Ability'
import { ActionSheet } from 'native-base'
import AppStyles from '../../AppStyles'
import { Fab } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import Loader from '../../components/loader'
import NoResultsComponent from '../../components/NoResultsComponent'
import PropertyTile from '../../components/PropertyTile'
import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import helper from '../../helper'
// import styles from './style'
import { ActivityIndicator } from 'react-native-paper'
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent'
import { Fields } from 'expo-contacts'

var BUTTONS = ['Delete', 'Cancel']
var CANCEL_INDEX = 1

class FieldsInventories extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      propertiesList: [],
      totalProperties: 0,
      loading: true,
      page: 1,
      pageSize: 20,
      onEndReachedLoader: false,
      selectedProperty: null,
      showMenu: false,
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    this._unsubscribe = navigation.addListener('focus', () => {
      this.getPropertyGraanaListing()
    })
  }

  componentWillUnmount() {
    this.clearStateValues()
    this._unsubscribe()
  }

  clearStateValues = () => {
    this.setState({
      page: 1,
      totalProperties: 0,
    })
  }

  getPropertyGraanaListing = () => {
    const { propertiesList, page, pageSize } = this.state
    const url = `/api/inventory/all?propType=fields&pageSize=${pageSize}&page=${page}`
    axios
      .get(url)
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            propertiesList:
              page === 1 ? response.data.rows : [...propertiesList, ...response.data.rows],
            totalProperties: response.data.count,
            onEndReachedLoader: false,
            loading: false,
          });
        }
      })
      .catch((error) => {
        console.log('error', error)
        this.setState({ loading: false })
      })
  }

  goToInventoryForm = () => {
    RootNavigation.navigate('AddInventory')
  }

  deleteProperty = (id) => {
    let endPoint = ``
    let that = this
    endPoint = `api/inventory/${id}`
    axios
      .delete(endPoint)
      .then(function (response) {
        if (response.status === 200) {
          helper.successToast('PROPERTY DELETED SUCCESSFULLY!')
          that.setState({ loading: true }, () => {
            that.getPropertyGraanaListing()
          })
        }
      })
      .catch(function (error) {
        that.setState({ loading: false })
        helper.successToast(error.message)
      })
  }

  onHandlePress = (data) => {
    const { navigation } = this.props
    navigation.navigate('PropertyDetail', {
      property: data,
      update: true,
      editButtonHide: data.status === 'onhold' ? false : true,
      screenName: 'FieldsInventories',
    })
  }

  onHandleLongPress = (val) => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: 'Select an Option',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          //Delete
          this.showDeleteDialog(val)
        }
      }
    )
  }

  showDeleteDialog(id) {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property ?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => this.deleteProperty(id) },
      ],
      { cancelable: false }
    )
  }

  onHandleOnCall = (data) => {
    const { contacts } = this.props
    if (data.poc_phone) {
      let phone = data.poc_phone
      let name = data.poc_name
      let newContact = {
        phone: phone,
        name: name && helper.capitalize(name),
        url: `tel:${phone}`,
      }
      helper.callNumber(newContact, contacts)
    } else {
      helper.errorToast(`No Phone Number`)
    }
  }

  setKey = (index) => {
    return String(index)
  }

  approveProperty = (id) => {
    let url = `/api/inventory/fieldProperty?id=${id}`
    this.setState({ loading: true }, () => {
      axios
        .patch(url)
        .then((res) => {
          helper.successToast('PROPERTY APPROVED!')
          this.getPropertyGraanaListing()
        })
        .catch((error) => {
          console.log('ERROR API: /api/inventory/fieldProperty', error)
        })
    })
  }

  showMenuOptions = (data) => {
    this.setState({ selectedProperty: data, showMenu: true })
  }

  hideMenu = () => {
    this.setState({ selectedProperty: null, showMenu: false })
  }


  render() {
    const { propertiesList, loading, totalProperties, onEndReachedLoader, selectedProperty, showMenu } = this.state
    const { user, route } = this.props
    return !loading ? (
      <View style={[AppStyles.container, { marginBottom: 25 }]}>

        {/* ***** Main Tile Wrap */}

        {propertiesList && propertiesList.length > 0 ? (
          <FlatList
            //contentContainerStyle={{ paddingHorizontal: wp('2%') }}
            data={propertiesList}
            renderItem={({ item }) => (
              <PropertyTile
                data={item}
                checkForArmsProperty={false}
                onPress={(data) => this.onHandlePress(data)}
                onLongPress={(id) => this.onHandleLongPress(id)}
                onCall={this.onHandleOnCall}
                screen={'fields'}
                selectedProperty={selectedProperty}
                showMenu={showMenu}
                showMenuOptions={(data) => this.showMenuOptions(data)}
                hideMenu={() => this.hideMenu()}
                approveProperty={(id) => this.approveProperty(id)}
              />
            )}
            onEndReached={() => {
              if (propertiesList.length < totalProperties) {
                this.setState(
                  {
                    page: this.state.page + 1,
                    onEndReachedLoader: true,
                  },
                  () => {
                    this.getPropertyGraanaListing()
                  }
                )
              }
            }}
            onEndReachedThreshold={0.5}
            keyExtractor={(item, index) => `${item.id}`}
          />
        ) : (
            <NoResultsComponent imageSource={require('../../../assets/img/no-result-found.png')} />
          )}

        {<OnLoadMoreComponent onEndReached={onEndReachedLoader} />}
      </View>
    ) : (
        <Loader loading={loading} />
      )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    contacts: store.contacts.contacts,
  }
}

export default connect(mapStateToProps)(FieldsInventories)
