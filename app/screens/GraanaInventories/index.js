/** @format */

import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import * as Location from 'expo-location'
import { ActionSheet } from 'native-base'
import React from 'react'
import { Alert, FlatList, Linking, Text, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import { isEmpty } from 'underscore'
import AppStyles from '../../AppStyles'
import GeoTaggingModal from '../../components/GeotaggingModal'
import GraanaPhoneOptionModal from '../../components/GraanaPhoneOptionModal'
import GraanaPropertiesModal from '../../components/GraanaPropertiesStatusModal'
import Loader from '../../components/loader'
import NoResultsComponent from '../../components/NoResultsComponent'
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent'
import PickerComponent from '../../components/Picker'
import PropertyTile from '../../components/PropertyTile'
import Search from '../../components/Search'
import helper from '../../helper'
import * as RootNavigation from '../../navigation/RootNavigation'
import StaticData from '../../StaticData'
import styles from './style'

var BUTTONS = ['Delete', 'Cancel']
var CANCEL_INDEX = 1

class GraanaInventories extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      propertiesList: [],
      totalProperties: 0,
      loading: true,
      page: 1,
      pageSize: 20,
      onEndReachedLoader: false,
      graanaModalActive: false,
      singlePropertyData: {},
      forStatusPrice: false,
      showSearchBar: false,
      searchText: '',
      statusFilter: 'published',
      searchBy: 'id',
      selectedArea: null,
      showGraanaMenu: false,
      isGeoTaggingModalVisible: false,
      locate_manually: false,
      latitude: null,
      longitude: null,
      propsure_id: null,
      selectedProperty: null,
      isGraanaPhoneModalVisible: false,
      contactInformation: null,
      formData: {
        amount: '',
      },
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    let that = this
    this._unsubscribe = navigation.addListener('focus', () => {
      const { route } = that.props
      if (route.params && route.params.selectedArea) {
        const { selectedArea } = route.params
        if (selectedArea) {
          this.setState({ selectedArea }, () => {
            this.getPropertyGraanaListing()
          })
        }
      } else if (
        route.params &&
        this.props.route.params.mapValues &&
        this.props.route.params.fromScreen
      ) {
        const { mapValues, fromScreen } = this.props.route.params
        if (fromScreen === 'mapContainer' && mapValues) {
          this.setState({
            isGeoTaggingModalVisible: true,
            latitude: mapValues.lat,
            longitude: mapValues.lng,
            propsure_id: mapValues.propsure_id,
          })
        }
      } else {
        this.getPropertyGraanaListing()
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

  goToAttachments = (purpose) => {
    const { navigation, lead } = this.props
    navigation.navigate('LeadAttachments', {
      navProperty: true,
      purpose: purpose,
      propertyId: this.state.selectedProperty.id,
    })
  }

  getPropertyGraanaListing = () => {
    const {
      propertiesList,
      page,
      pageSize,
      statusFilter,
      searchBy,
      showSearchBar,
      searchText,
      selectedArea,
    } = this.state

    let query = ``
    if (showSearchBar && searchBy === 'id' && searchText !== '') {
      if (helper.isANumber(searchText)) {
        // Search By ID
        query = `/api/inventory/all?propType=graana&searchBy=id&q=${searchText}&pageSize=${pageSize}&page=${page}`
      } else {
        alert('Please Enter valid Property ID!')
        this.setState({ loading: false })
        return
      }
    } else if (showSearchBar && searchBy === 'area' && selectedArea) {
      // Search By Area
      query = `/api/inventory/all?propType=graana&searchBy=area&q=${selectedArea.id}&pageSize=${pageSize}&page=${page}`
    } else {
      // Only Status Filter
      query = `/api/inventory/all?propType=graana&propStatus=${statusFilter}&pageSize=${pageSize}&page=${page}`
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
      editButtonHide: true,
      screenName: 'GraanaInventories',
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
    let payload = []
    if (data && data.user && data.user.phone) {
      payload.push({
        name: data.user.first_name ? data.user.first_name + ' ' + data.user.last_name : '',
        number: data.user.phone ? data.user.phone : null,
        label: 'Agent',
      })
    }
    if (data && data.owner_phone) {
      payload.push({
        name: data.owner_name,
        number: data.owner_phone,
        label: 'Owner',
      })
    }
    if (data && data.poc_phone) {
      payload.push({
        name: data.poc_name,
        number: data.poc_phone,
        label: 'Point of Contact',
      })
    }
    if (payload.length > 0) {
      this.setState({ contactInformation: payload }, () => {
        this.showGraanaPhoneModal(true)
      })
    } else {
      alert('No phone number available to call!')
    }
  }

  setKey = (index) => {
    return String(index)
  }

  graanaVerifeyModal = (status, id) => {
    const { propertiesList } = this.state
    if (status === true) {
      var filterProperty = propertiesList.find((item) => {
        return item.id === id && item
      })
      this.setState({
        singlePropertyData: filterProperty,
        graanaModalActive: status,
        forStatusPrice: false,
      })
    } else {
      this.setState({
        graanaModalActive: status,
        forStatusPrice: false,
      })
    }
  }

  graanaStatusSubmit = (data, graanaStatus) => {
    if (graanaStatus === 'sold') {
      this.setState({
        forStatusPrice: true,
      })
    } else if (graanaStatus === 'rented') {
      this.setState({
        forStatusPrice: true,
      })
    } else {
      this.submitGraanaStatusAmount('other')
    }
  }

  handleForm = (value, name) => {
    const { formData } = this.state
    const newFormData = formData
    newFormData[name] = value
    this.setState({ formData: newFormData })
  }

  submitGraanaStatusAmount = (check) => {
    const { singlePropertyData, formData } = this.state
    var endpoint = ''
    var body = {
      amount: formData.amount,
      propertyType: 'graana',
    }
    if (check === 'amount') {
      endpoint = `api/inventory/verifyProperty?id=${singlePropertyData.id}`
    } else {
      endpoint = `api/inventory/verifyProperty?id=${singlePropertyData.id}`
    }
    formData['amount'] = ''
    axios.patch(endpoint, body).then((res) => {
      this.setState(
        {
          forStatusPrice: false,
          graanaModalActive: false,
          formData,
        },
        () => {
          this.getPropertyGraanaListing()
          helper.successToast(res.data)
        }
      )
    })
  }

  changeStatus = (status) => {
    this.clearStateValues()
    this.setState({ statusFilter: status, propertiesList: [], loading: true }, () => {
      this.getPropertyGraanaListing()
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
        statusFilter: 'published',
      },
      () => {
        this.clearStateValues()
        this.getPropertyGraanaListing()
      }
    )
  }

  changeSearchBy = (searchBy) => {
    this.setState({ searchBy, selectedArea: null })
  }

  handleSearchByArea = () => {
    const { navigation } = this.props
    const { selectedArea } = this.state
    navigation.navigate('AssignedAreas', { screenName: 'Graana.com', selectedArea })
  }

  convertLongitudeLattitude = (val) => {
    if (val === '') {
      return null
    } else if (typeof val === 'string' && val != '') {
      return parseFloat(val)
    } else {
      return val
    }
  }

  propertyGeoTagging = (data) => {
    // When user clicks geo tagging option from menu, this function is called
    this.hideGraanaMenu()
    this.setState({
      isGeoTaggingModalVisible: true,
      locate_manually: data.locate_manually,
      longitude: data.lon,
      latitude: data.lat,
      propsure_id: data.propsure_id,
      selectedProperty: data,
    })
  }

  hideGeoTaggingModal = () => {
    // hide the geotagging modal, when cancel button is pressed
    this.setState({
      isGeoTaggingModalVisible: false,
      locate_manually: false,
      longitude: null,
      latitude: null,
      propsure_id: null,
    })
  }

  propertyGeoTaggingDone = () => {
    // Done button pressed from inside of the geotagging modal
    const { navigation } = this.props
    const { latitude, longitude, propsure_id, locate_manually, selectedProperty } = this.state
    if (latitude && longitude) {
      let url = `api/inventory/update/fieldProperties?id=${selectedProperty.id}&isGraana=${true}`
      let body = {
        lat: this.convertLongitudeLattitude(latitude),
        lon: this.convertLongitudeLattitude(longitude),
        locate_manually,
        propsure_id,
        geotagged_date: propsure_id ? new Date() : null,
      }
      axios
        .patch(url, body)
        .then((response) => {
          if (response.status === 200) {
            this.hideGeoTaggingModal()
            this.getPropertyGraanaListing()
            navigation.setParams({ mapValues: null, fromScreen: null })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      alert('Latitude and Longitude values are required!')
    }
  }

  goToMapsForGeotagging = () => {
    // When user opts for geo tagging by maps
    const { navigation } = this.props
    const { longitude, latitude, propsure_id } = this.state
    this.setState({ isGeoTaggingModalVisible: false }, () => {
      navigation.navigate('MapContainer', {
        mapValues: {
          lat: latitude,
          lng: longitude,
          propsure_id: propsure_id,
        },
        screenName: 'Graana.com',
      })
    })
  }

  handleMarkProperty = (value) => {
    // check box for manual marking from maps or from current location
    this.setState({
      locate_manually: value,
      propsure_id: null,
      latitude: null,
      longitude: null,
    })
  }

  handleLatLngChange = (value, name) => {
    // lat lng value change, text input
    if (name === 'lat') {
      this.setState({ latitude: value })
    } else if (name === 'lng') {
      this.setState({ longitude: value })
    }
  }

  _getLocationAsync = async () => {
    // get current lat/lng location of user when opting for auto mode
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      alert('Permission to access location was denied')
    }
    const location = await Location.getCurrentPositionAsync()
    if (location && location.coords && location.coords.latitude && location.coords.longitude) {
      this.handleLatLngChange(location.coords.latitude, 'lat')
      this.handleLatLngChange(location.coords.longitude, 'lng')
    } else {
      alert('Error while getting location!')
    }
  }

  showGraanaMenuOptions = (data) => {
    this.setState({ selectedProperty: data, showGraanaMenu: true })
  }

  hideGraanaMenu = () => {
    this.setState({ showGraanaMenu: false })
  }

  showGraanaPhoneModal = (value) => {
    this.setState({ isGraanaPhoneModalVisible: value })
  }

  handlePhoneSelectDone = (selectedPhone) => {
    this.showGraanaPhoneModal(false)
    if (selectedPhone && selectedPhone.number) {
      this.callNumber('tel:' + selectedPhone.number)
    }
  }

  callNumber = (phone) => {
    if (phone && phone != 'tel:null') {
      Linking.canOpenURL(phone)
        .then((supported) => {
          if (!supported) {
            helper.errorToast(`No application available to dial phone number`)
            console.log("Can't handle url: " + phone)
          } else {
            return Linking.openURL(phone)
          }
        })
        .catch((err) => console.error('An error occurred', err))
    } else {
      helper.errorToast(`No Phone Number`)
    }
  }

  render() {
    const {
      propertiesList,
      loading,
      totalProperties,
      onEndReachedLoader,
      graanaModalActive,
      singlePropertyData,
      forStatusPrice,
      formData,
      searchBy,
      searchText,
      statusFilter,
      showSearchBar,
      selectedArea,
      isGeoTaggingModalVisible,
      locate_manually,
      latitude,
      longitude,
      propsure_id,
      showGraanaMenu,
      selectedProperty,
      isGraanaPhoneModalVisible,
      contactInformation,
    } = this.state
    const { user, route } = this.props
    const { client } = route.params
    return !loading ? (
      <View style={[styles.container, { marginBottom: 25 }]}>
        <GeoTaggingModal
          isGeoTaggingModalVisible={isGeoTaggingModalVisible}
          hideGeoTaggingModal={this.hideGeoTaggingModal}
          handleMarkProperty={this.handleMarkProperty}
          locate_manually={locate_manually}
          latitude={latitude}
          longitude={longitude}
          propsure_id={propsure_id}
          handleLatLngChange={this.handleLatLngChange}
          getCurrentLocation={this._getLocationAsync}
          propertyGeoTaggingDone={this.propertyGeoTaggingDone}
          goToMapsForGeotagging={this.goToMapsForGeotagging}
        />

        {!client && (
          <>
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
                        this.getPropertyGraanaListing()
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
                    data={
                      helper.checkPP(user)
                        ? StaticData.graanaStatusFiltersPP
                        : StaticData.graanaStatusFilters
                    }
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
          </>
        )}
        {/* ***** Main Tile Wrap */}
        {propertiesList && propertiesList.length > 0 ? (
          <FlatList
            contentContainerStyle={{ paddingHorizontal: wp('2%') }}
            data={propertiesList}
            renderItem={({ item, index }) => (
              <PropertyTile
                data={item}
                checkForArmsProperty={false}
                onPress={(data) => this.onHandlePress(data)}
                onLongPress={(id) => this.onHandleLongPress(id)}
                onCall={this.onHandleOnCall}
                showGraanaMenu={showGraanaMenu}
                showGraanaMenuOptions={(data) => this.showGraanaMenuOptions(data)}
                hideGraanaMenu={() => this.hideGraanaMenu()}
                propertyGeoTagging={this.propertyGeoTagging}
                graanaVerifeyModal={this.graanaVerifeyModal}
                whichProperties={'graanaProperties'}
                selectedProperty={selectedProperty}
                goToAttachments={this.goToAttachments}
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

        <GraanaPhoneOptionModal
          isGraanaPhoneModalVisible={isGraanaPhoneModalVisible}
          showGraanaPhoneModal={this.showGraanaPhoneModal}
          contacts={contactInformation}
          handlePhoneSelectDone={this.handlePhoneSelectDone}
        />

        {
          <GraanaPropertiesModal
            active={graanaModalActive}
            data={singlePropertyData}
            forStatusPrice={forStatusPrice}
            formData={formData}
            handleForm={this.handleForm}
            graanaVerifeyModal={this.graanaVerifeyModal}
            submitStatus={this.graanaStatusSubmit}
            submitGraanaStatusAmount={this.submitGraanaStatusAmount}
          />
        }

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

export default connect(mapStateToProps)(GraanaInventories)
