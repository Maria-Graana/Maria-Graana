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
import styles from './style'
import { ActivityIndicator } from 'react-native-paper'
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent'
import PickerComponent from '../../components/Picker'
import Search from '../../components/Search'
import { isEmpty } from 'underscore'
import StaticData from '../../StaticData'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import GraanaPropertiesModal from '../../components/GraanaPropertiesStatusModal'

var BUTTONS = ['Delete', 'Cancel']
var CANCEL_INDEX = 1

class ArmsInventories extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      propertiesList: [],
      totalProperties: 0,
      loading: true,
      page: 1,
      pageSize: 20,
      onEndReachedLoader: false,
      showSearchBar: false,
      searchText: '',
      statusFilter: 'all',
      searchBy: 'id',
      selectedArea: null,
      showMenu: false,
      selectedProperty: null,
      armsModalActive: false,
      PropertyData: {},
      forStatusPrice: false,
      formData: {
        amount: '',
      },
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    this._unsubscribe = navigation.addListener('focus', () => {
      const { route } = this.props
      if (route.params && route.params.selectedArea) {
        const { selectedArea } = route.params
        if (selectedArea) {
          this.setState({ selectedArea }, () => {
            this.getPropertyArmsListing()
          })
        }
      } else if (route.params?.client) {
        this.getPropertyArmsListing()
      } else {
        this.getPropertyArmsListing()
      }
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

  getPropertyArmsListing = () => {
    const {
      propertiesList,
      page,
      pageSize,
      statusFilter,
      searchBy,
      searchText,
      showSearchBar,
      selectedArea,
    } = this.state
    let query = ``
    if (showSearchBar && searchBy === 'id' && searchText !== '') {
      if (helper.isANumber(searchText)) {
        // Search By ID
        query = `/api/inventory/all?propType=arms&searchBy=id&q=${searchText}&pageSize=${pageSize}&page=${page}`
      } else {
        alert('Please Enter valid Property ID!')
        this.setState({ loading: false })
        return
      }
    } else if (showSearchBar && searchBy === 'area' && selectedArea) {
      // Search By Area
      query = `/api/inventory/all?propType=arms&searchBy=area&q=${selectedArea.id}&pageSize=${pageSize}&page=${page}`
    } else {
      // Only Status Filter
      query = `/api/inventory/all?propType=arms&status=${statusFilter}&pageSize=${pageSize}&page=${page}`
    }
    if (this.props.route.params?.client) {
      query = `${query}&searchBy=customer&q=${this.props.route.params?.client?.first_name} ${this.props.route.params?.client?.last_name}`
    }

    axios
      .get(query)
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            propertiesList:
              page === 1 ? response.data.rows : [...propertiesList, ...response.data.rows],
            totalProperties: response.data.count,
            onEndReachedLoader: false,
            loading: false,
          })
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
  armsVerifeyModal = (status, id) => {
    const { propertiesList } = this.state
    if (status === true) {
      var filterProperty = propertiesList.find((item) => {
        return item.id === id && item
      })
      this.setState({
        PropertyData: filterProperty,
        armsModalActive: status,
        forStatusPrice: false,
      })
    } else {
      this.setState({
        armsModalActive: status,
        forStatusPrice: false,
      })
    }
  }
  armsStatusSubmit = (data, graanaStatus) => {
    if (graanaStatus === 'sold') {
      this.setState({
        forStatusPrice: true,
      })
    } else if (graanaStatus === 'rented') {
      this.setState({
        forStatusPrice: true,
      })
    } else {
      this.submitarmsStatusAmount('other')
    }
  }
  handleForm = (value, name) => {
    const { formData } = this.state
    const newFormData = formData
    newFormData[name] = value
    this.setState({ formData: newFormData })
  }
  submitarmsStatusAmount = (check) => {
    const { PropertyData, formData, propertiesList } = this.state
    var endpoint = ''
    var body = {
      amount: formData.amount,
      propertyType: 'arms',
    }
    if (check === 'amount') {
      endpoint = `api/inventory/verifyProperty?id=${PropertyData.id}`
    } else {
      endpoint = `api/inventory/verifyProperty?id=${PropertyData.id}`
    }
    formData['amount'] = ''
    axios.patch(endpoint, body).then((res) => {
      this.setState(
        {
          forStatusPrice: false,
          armsModalActive: false,
          formData,
        },
        () => {
          this.getPropertyArmsListing()
          helper.successToast(res.data)
        }
      )
    })
  }

  deleteProperty = (id) => {
    let endPoint = ``
    let that = this
    endPoint = `api/inventory/${id}`
    axios
      .delete(endPoint)
      .then(function (response) {
        if (response.status === 200) {
          if (response.data.message) {
            helper.errorToast(response.data.message)
          } else {
            helper.successToast('PROPERTY DELETED SUCCESSFULLY!')
            that.setState({ loading: true }, () => {
              that.getPropertyArmsListing()
            })
          }
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
      editButtonHide: false,
      screen: 'arms',
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
    let newContact = helper.createContactPayload(data.customer)
    let firstName = data.customer && data.customer.first_name && data.customer.first_name
    let last_name = data.customer && data.customer.last_name && data.customer.last_name
    newContact.name = firstName + ' ' + last_name
    helper.callNumber(newContact, contacts)
  }

  setKey = (index) => {
    return String(index)
  }

  changeStatus = (status) => {
    this.clearStateValues()
    this.setState({ statusFilter: status, propertiesList: [], loading: true }, () => {
      this.getPropertyArmsListing()
    })
  }

  clearAndCloseSearch = () => {
    this.setState(
      {
        searchText: '',
        showSearchBar: false,
        selectedArea: null,
        loading: true,
        searchBy: 'id',
        statusFilter: 'all',
      },
      () => {
        this.clearStateValues()
        this.getPropertyArmsListing()
      }
    )
  }

  changeSearchBy = (searchBy) => {
    this.setState({ searchBy, selectedArea: null })
  }

  handleSearchByArea = () => {
    const { navigation } = this.props
    const { selectedArea } = this.state
    navigation.navigate('AssignedAreas', { screenName: 'ARMS', selectedArea })
  }

  showMenuOptions = (data) => {
    this.setState({ selectedProperty: data, showMenu: true })
  }

  hideMenu = () => {
    this.setState({ selectedProperty: null, showMenu: false })
  }

  goToAttachments = (purpose) => {
    const { navigation, lead } = this.props
    navigation.navigate('LeadAttachments', {
      navProperty: true,
      purpose: purpose,
      propertyId: this.state.selectedProperty.id,
    })
  }

  createPermission = () => {
    const { permissions } = this.props
    return getPermissionValue(PermissionFeatures.PROPERTIES, PermissionActions.CREATE, permissions)
  }

  updatePermission = () => {
    const { permissions } = this.props
    return getPermissionValue(PermissionFeatures.PROPERTIES, PermissionActions.UPDATE, permissions)
  }

  render() {
    const {
      propertiesList,
      loading,
      totalProperties,
      onEndReachedLoader,
      statusFilter,
      searchText,
      showSearchBar,
      searchBy,
      selectedArea,
      showMenu,
      selectedProperty,
      armsModalActive,
      PropertyData,
      forStatusPrice,
      formData,
    } = this.state
    const { user, route } = this.props
    let createPermission = this.createPermission()
    return !loading ? (
      <View style={[styles.container, { marginBottom: 25 }]}>
        {showSearchBar ? (
          <View
            style={[
              styles.filterRow,
              {
                paddingBottom: 0,
                paddingTop: 0,
                paddingLeft: 0,
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}
          >
            <View style={[styles.pickerMain, { width: '20%', marginLeft: 10 }]}>
              <PickerComponent
                placeholder={'Search By'}
                data={helper.checkPP(user) ? StaticData.searchByIdOnly : StaticData.searchBy}
                customStyle={styles.pickerStyle}
                customIconStyle={styles.customIconStyle}
                onValueChange={this.changeSearchBy}
                selectedItem={searchBy}
              />
            </View>
            {searchBy === 'id' ? (
              <Search
                containerWidth={'80%'}
                placeholder={'Search by ID'}
                searchText={searchText}
                setSearchText={(value) => this.setState({ searchText: value })}
                showShadow={false}
                showClearButton={true}
                returnKeyType={'search'}
                onSubmitEditing={() =>
                  this.setState({ loading: true }, () => {
                    this.getPropertyArmsListing()
                  })
                }
                closeSearchBar={() => this.clearAndCloseSearch()}
              />
            ) : helper.checkPP(user) ? null : (
              <View style={styles.searchTextContainerStyle}>
                <Text
                  onPress={() => this.handleSearchByArea()}
                  style={[
                    AppStyles.formFontSettings,
                    styles.searchAreaInput,
                    {
                      color: isEmpty(selectedArea)
                        ? AppStyles.colors.subTextColor
                        : AppStyles.colors.textColor,
                    },
                  ]}
                >
                  {isEmpty(selectedArea) ? 'Search by Area' : selectedArea.name}
                </Text>
                <Ionicons
                  style={{ width: '10%' }}
                  onPress={() => this.clearAndCloseSearch()}
                  name={'ios-close-circle-outline'}
                  size={24}
                  color={'grey'}
                />
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.filterRow, { paddingHorizontal: 15 }]}>
            <View style={styles.pickerMain}>
              <PickerComponent
                placeholder={'Property Status'}
                data={[{ value: 'all', name: 'All' }]}
                customStyle={styles.pickerStyle}
                customIconStyle={styles.customIconStyle}
                onValueChange={this.changeStatus}
                selectedItem={statusFilter}
              />
            </View>
            <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons
                onPress={() => {
                  this.setState({ showSearchBar: true }, () => {
                    this.clearStateValues()
                  })
                }}
                name={'ios-search'}
                size={26}
                color={AppStyles.colors.primaryColor}
              />
            </View>
          </View>
        )}

        <Fab
          active="true"
          containerStyle={{ zIndex: 20 }}
          style={{ backgroundColor: AppStyles.colors.primaryColor }}
          position="bottomRight"
          onPress={() => {
            if (createPermission) this.goToInventoryForm()
          }}
        >
          <Ionicons name="md-add" color="#ffffff" />
        </Fab>

        {/* ***** Main Tile Wrap */}

        {propertiesList && propertiesList.length > 0 ? (
          <FlatList
            contentContainerStyle={{ paddingHorizontal: wp('2%') }}
            data={propertiesList}
            renderItem={({ item }) => (
              <PropertyTile
                data={item}
                checkForArmsProperty={true}
                onPress={(data) => this.onHandlePress(data)}
                onLongPress={(id) => this.onHandleLongPress(id)}
                onCall={this.onHandleOnCall}
                screen={'arms'}
                showMenuOptions={(data) => this.showMenuOptions(data)}
                showMenu={showMenu}
                hideMenu={() => this.hideMenu()}
                selectedProperty={selectedProperty}
                goToAttachments={this.goToAttachments}
                graanaVerifeyModal={this.armsVerifeyModal}
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
                    this.getPropertyArmsListing()
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
        <GraanaPropertiesModal
          active={armsModalActive}
          data={PropertyData}
          forStatusPrice={forStatusPrice}
          formData={formData}
          handleForm={this.handleForm}
          graanaVerifeyModal={this.armsVerifeyModal}
          submitStatus={this.armsStatusSubmit}
          submitGraanaStatusAmount={this.submitarmsStatusAmount}
        />

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
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(ArmsInventories)
