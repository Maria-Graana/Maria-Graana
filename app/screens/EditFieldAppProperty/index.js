/** @format */

import React, { Component } from 'react'
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  Keyboard,
} from 'react-native'
import { StyleProvider } from 'native-base'
import * as Location from 'expo-location'
import * as MediaLibrary from 'expo-media-library'
import { Camera } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import getTheme from '../../../native-base-theme/components'
import formTheme from '../../../native-base-theme/variables/formTheme'
import axios from 'axios'
import DetailForm from './detailForm'
import StaticData from '../../StaticData'
import AppStyles from '../../AppStyles'
import helper from '../../helper'
import { connect } from 'react-redux'
import _ from 'underscore'
import ImageBrowser from '../../components/ImageBrowser/ImageBrowser'
import * as ImageManipulator from 'expo-image-manipulator'
import {
  uploadImage,
  addImage,
  flushImages,
  removeImage,
  setImageLoading,
} from '../../actions/property'
import { getAllCountries } from 'react-native-country-picker-modal'
import config from '../../config'

class EditFieldAppProperty extends Component {
  constructor(props) {
    super(props)
    var defaultCountry = { name: 'PK', code: '+92' }
    this.state = {
      checkValidation: false,
      areas: [],
      selectSubType: [],
      selectedGrade: '',
      sizeUnit: StaticData.sizeUnit,
      buttonText: 'ADD PROPERTY',
      clientName: '',
      selectedCity: null,
      selectedArea: null,
      isModalOpen: false,
      phoneValidate: false,
      pocPhoneValidate: false,
      countries: [],
      countryCode: defaultCountry.name,
      callingCode: defaultCountry.code,
      countryCode1: defaultCountry.name,
      callingCode1: defaultCountry.code,
      loading: false,
      formData: {
        type: '',
        subtype: '',
        purpose: '',
        bed: null,
        bath: null,
        size: 0,
        city_id: '',
        area_id: '',
        size_unit: 'marla',
        owner_name: null,
        owner_phone: null,
        ownerDialCode: null,
        ownerCountryCode: null,
        poc_name: null,
        poc_phone: null,
        pocDialCode: null,
        pocCountryCode: null,
        price: 0,
        grade: '',
        imageIds: [],
        lat: '',
        lon: '',
        description: '',
        general_size: null,
        lisitng_type: 'mm',
        features: {},
        custom_title: null,
        show_address: false,
        address: null,
        video: '',
        year_built: null,
        floors: null,
        parking_space: null,
        downpayment: 0,
        showWaterMark: false,
        rider_id: null,
        propsure_id: null,
        geotagged_date: null,
        locate_manually: false,
      },
      showAdditional: false,
      showCustomTitle: false,
      features: StaticData.residentialFeatures,
      facing: StaticData.facing,
      utilities: StaticData.residentialUtilities,
      selectedFeatures: [],
    }
  }

  componentDidMount() {
    const { route, navigation, user } = this.props
    navigation.addListener('focus', () => {
      this.onScreenFocused()
    })
    if (route.params.update) {
      navigation.setOptions({ title: 'EDIT PROPERTY' })
      getAllCountries().then((countries) => {
        this.setState({ countries }, () => this.fetchCountryCode())
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //Typical usage, don't forget to compare the props
    if (prevState.selectedCity && this.state.selectedCity.value !== prevState.selectedCity.value) {
      this.clearAreaOnCityChange() // clear area field only when city is changed, doesnot get called if same city is selected again..
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flushImages())
    this.props.dispatch(setImageLoading(false))
  }

  onScreenFocused = () => {
    const { selectedCity, selectedArea, mapValues } = this.props.route.params
    const { formData } = this.state
    let copyObject = Object.assign({}, formData)
    if (selectedCity) {
      copyObject.city_id = selectedCity.value
      this.setState({ formData: copyObject, selectedCity })
    }
    if (selectedArea) {
      copyObject.area_id = selectedArea.value
      this.setState({ formData: copyObject, selectedArea })
    }
    if (mapValues) {
      copyObject.propsure_id = mapValues.propsure_id
      copyObject.lat = mapValues.lat
      copyObject.lon = mapValues.lng
      this.setState({ formData: copyObject })
    }
  }

  clearAreaOnCityChange = () => {
    const { formData } = this.state
    this.setState({ formData: { ...formData, area_id: '' }, selectedArea: null })
  }

  fetchCountryCode = () => {
    const { countries } = this.state
    const { property } = this.props.route.params
    let ownerPhone = property.owner_phone ? property.owner_phone.substring(1) : null
    let ownerDialCode = null
    let ownerCountryCode = null
    let pocContact = property.poc_phone ? property.poc_phone.substring(1) : null
    let pocCountryCode = null
    let pocDialCode = null
    let result = _.map(_.where(countries), function (country) {
      return { callingCode: country.callingCode, cca2: country.cca2 }
    })
    let newResult = []
    if (result.length) {
      result.map((item) => {
        let callingCode = item.callingCode
        if (callingCode.length) {
          callingCode.map((code) => {
            let obj = {
              cca2: item.cca2,
              callingCode: Number(code),
            }
            newResult.push(obj)
          })
        }
      })
    }
    newResult = _.sortBy(newResult, 'callingCode').reverse()
    for (let i = 0; i < newResult.length; i++) {
      if (ownerPhone && ownerPhone.startsWith(newResult[i].callingCode)) {
        if (!property.ownerCountryCode) {
          ownerDialCode = '+' + newResult[i].callingCode
          ownerCountryCode = newResult[i].cca2
        } else {
          ownerCountryCode = property.ownerCountryCode
          ownerDialCode = property.ownerDialCode
        }
      }

      if (pocContact && pocContact.startsWith(newResult[i].callingCode)) {
        if (!property.pocDialCode) {
          pocDialCode = '+' + newResult[i].callingCode
          pocCountryCode = newResult[i].cca2
        } else {
          pocDialCode = property.pocDialCode
          pocCountryCode = property.pocCountryCode
        }
      }
    }
    this.setState(
      {
        countryCode: ownerCountryCode ? ownerCountryCode.toUpperCase() : 'PK',
        callingCode: ownerDialCode ? ownerDialCode : '+92',
        countryCode1: pocCountryCode ? pocCountryCode.toUpperCase() : 'PK',
        callingCode1: pocDialCode ? pocDialCode : '+92',
      },
      () => {
        this.setEditValues()
      }
    )
  }

  setDialCode = (callingCode) => {
    return callingCode.startsWith('+') ? callingCode : '+' + callingCode
  }
  setPhoneNumber = (dialCode, phone) => {
    let number = ''
    let withoutPlus = dialCode.replace('+', '')
    if (phone.startsWith('+')) {
      if (phone.startsWith(dialCode)) number = phone.replace(dialCode, '')
      else number = phone
    } else {
      if (phone.startsWith(withoutPlus)) number = phone.replace(withoutPlus, '')
      else number = phone
    }
    return number
  }

  setEditValues = () => {
    const { route } = this.props
    const { callingCode, countryCode, callingCode1, countryCode1 } = this.state
    const { property } = route.params
    let parsedFeatures = property.features ? JSON.parse(property.features) : {}
    let amentities = _.isEmpty(parsedFeatures) ? [] : _.keys(parsedFeatures)
    if (amentities.length) {
      amentities = _.map(amentities, (amentity) =>
        amentity
          .split('_')
          .join(' ')
          .replace(/\b\w/g, (l) => l.toUpperCase())
      )
      amentities = _.without(amentities, 'Year Built', 'Floors', 'Downpayment', 'Parking Space')
    }
    let ownerCallingCode = this.setDialCode(callingCode)
    let ownerNumber = property.owner_phone
      ? this.setPhoneNumber(ownerCallingCode, property.owner_phone)
      : null
    let pocCallingCode = this.setDialCode(callingCode1)
    let pocNumber = property.poc_phone
      ? this.setPhoneNumber(pocCallingCode, property.poc_phone)
      : null
    console.log(property)
    this.setState(
      {
        formData: {
          id: property.id,
          type: property.type,
          subtype: property.subtype,
          purpose: property.purpose,
          bed: property.bed === null || property.bed === undefined ? null : property.bed,
          bath: property.bath === null || property.bath === undefined ? null : property.bath,
          size_unit: property.size_unit,
          size: property.size ? property.size : 0,
          city_id: property.city_id,
          area_id: property.area_id,
          propsure_id: property.propsure_id,
          geotagged_date: property.geotagged_date,
          address: property.address,
          price: property.price ? property.price : 0,
          imageIds:
            property.property_images.length === 0 || property.property_images === undefined
              ? []
              : property.property_images,
          status: property.status,
          owner_phone: ownerNumber,
          owner_name: property.owner_name,
          ownerDialCode: ownerCallingCode,
          ownerCountryCode: countryCode,
          poc_phone: pocNumber,
          poc_name: property.poc_name,
          pocDialCode: pocCallingCode,
          pocCountryCode: countryCode1,
          lat: property.lat,
          lon: property.lon,
          locate_manually: property.locate_manually,
          description: property.description,
          year_built: parsedFeatures.year_built ? parsedFeatures.year_built : null,
          floors:
            parsedFeatures.floors === null || parsedFeatures.floors === undefined
              ? null
              : parsedFeatures.floors,
          parking_space:
            parsedFeatures.parking_space === null || parsedFeatures.parking_space === undefined
              ? null
              : parsedFeatures.parking_space,
          downpayment:
            parsedFeatures && parsedFeatures.downpayment ? parsedFeatures.downpayment : 0,
          general_size: null,
          lisitng_type: 'mm',
          custom_title: property.custom_title ? property.custom_title : null,
          show_address: property.show_address ? property.show_address : false,
          video: property.video,
          rider_id: property.rider_id,
        },
        selectedCity: property.city ? { ...property.city, value: property.city.id } : null,
        selectedFeatures: amentities,
        selectedArea: property.area ? { ...property.area, value: property.area.id } : null,
        buttonText: 'UPDATE PROPERTY',
      },
      () => {
        //console.log(this.state.formData)
        this.selectSubtype(property.type)
        this.setFeatures(property.type)
        this.state.formData.imageIds.length > 0 && this.setImagesForEditMode()
      }
    )
  }

  setImagesForEditMode = () => {
    const { dispatch } = this.props
    const { formData } = this.state
    const { imageIds } = formData
    imageIds.map((image) => {
      dispatch(
        addImage({
          id: image.id,
          uri: image.url,
          filetype: image.type,
        })
      )
    })
  }

  selectSubtype = (type) => {
    this.setState({ selectSubType: StaticData.subType[type] })
  }

  setFeatures = (type) => {
    if (type !== '') {
      if (type === 'residential') {
        this.setState({
          features: StaticData.residentialFeatures,
          utilities: StaticData.residentialUtilities,
        })
      } else if (type === 'plot') {
        this.setState({ features: StaticData.plotFeatures, utilities: StaticData.plotUtilities })
      } else if (type === 'commercial') {
        this.setState({
          features: StaticData.commercialFeatures,
          utilities: StaticData.commercialUtilities,
        })
      }
    }
  }

  // ********* Form Handle Function
  handleForm = (value, name) => {
    const { formData } = this.state
    formData[name] = value
    this.setState({ formData })
    if (formData.type !== '') {
      this.setFeatures(formData.type)
      this.selectSubtype(formData.type)
    }
    if (name === 'owner_phone') {
      this.validatePhone(value)
    }
    if (name === 'poc_phone') {
      this.validatePocPhone(value)
    }
    if (formData.size === '') {
      formData.size = 0
      this.setState({ formData })
    }
  }

  // ********* On form Submit Function
  formSubmit = () => {
    const { formData } = this.state
    // ********* Form Validation Check
    if (
      !formData.type ||
      !formData.subtype ||
      !formData.city_id ||
      !formData.purpose ||
      !formData.area_id ||
      !formData.size ||
      !formData.owner_name ||
      !formData.owner_phone ||
      !formData.poc_name ||
      !formData.poc_phone
      // !formData.customer_id
    ) {
      this.setState({
        checkValidation: true,
      })
    } else {
      // ********* Call Add Inventory API here :)
      this.setState({ loading: true }, () => {
        this.createOrEditProperty(formData)
      })
    }
  }

  updateMapLocation = async (property, data) => {
    const { user } = this.props
    if (property.propsure_id !== data.propsure_id) {
      const url = `${config.mapUrl}/arms-propsure`
      const body = {
        plot_id: data.propsure_id, // propsure_id value here
        arms_id: property.id, // arms property id here
        assigned_by: user.email, // user's email
      }
      const response = await axios.post(url, body)
      if (response.status === 200) {
        const copyData = { ...data }
        copyData.geotagged_date = response.data.createdAt
        return copyData
      } else {
        return null
      }
    } else {
      return data // does not need to update map location because it is the same.
    }
  }

  createOrEditProperty = (formData) => {
    let features = {}
    const { navigation, route, dispatch } = this.props
    const { selectedFeatures, callingCode, callingCode1, countryCode, countryCode1 } = this.state
    if (formData.year_built) {
      features['year_built'] = formData.year_built
    }
    if (formData.floors) {
      features['floors'] = formData.floors
    }
    if (formData.parking_space !== null || formData.parking_space !== undefined) {
      features['parking_space'] = formData.parking_space
    }
    if (formData.downpayment) {
      features['downpayment'] = this.convertToIntegerForZero(formData.downpayment)
    }
    selectedFeatures && selectedFeatures.length
      ? selectedFeatures.map((amenity, index) => {
          features[amenity.replace(/\s+/g, '_').toLowerCase()] = true
        })
      : {}
    const { property } = route.params
    const { images } = this.props
    formData.lat = this.convertLatitude(formData.lat)
    formData.lon = this.convertLongitude(formData.lon)
    formData.size = this.convertToIntegerForZero(formData.size)
    formData.price = this.convertToIntegerForZero(formData.price)
    formData.custom_title = formData.custom_title === '' ? null : formData.custom_title
    formData.features = _.isEmpty(features) ? {} : features
    formData.imageIds = _.pluck(images, 'id')
    formData.ownerCountryCode = countryCode
    formData.ownerDialCode = callingCode
    formData.pocCountryCode = countryCode1
    formData.pocDialCode = callingCode1
    formData.owner_phone = callingCode.replace(/\+/g, '') + formData.owner_phone
    formData.poc_phone = callingCode1.replace(/\+/g, '') + formData.poc_phone
    // deleting these keys below from formdata as they are sent in features instead of seperately
    delete formData.parking_space
    delete formData.floors
    delete formData.year_built
    delete formData.downpayment
    // grade not being saved in case of field properties
    delete formData.grade

    if (formData.imageIds.length < 3) {
      alert('Minimum three images are required to update property!')
      this.setState({ loading: false })
      return
    }

    if (route.params.update) {
      this.updateMapLocation(property, formData).then((data) => {
        if (data) {
          axios
            .patch(`/api/inventory/update/fieldProperties?id=${property.id}`, data)
            .then((res) => {
              if (res.status === 200) {
                helper.successToast('PROPERTY UPDATED SUCCESSFULLY!')
                dispatch(flushImages())
                navigation.navigate('InventoryTabs', {
                  update: false,
                  screen: 'Field App',
                  params: { screen: 'InventoryTabs' },
                })
              } else {
                helper.errorToast('ERROR: SOMETHING WENT WRONG')
              }
              this.setState({ loading: false })
            })
            .catch((error) => {
              this.setState({ loading: false })
              helper.errorToast('ERROR: UPDATING PROPERTY')
              console.log('error', error.message)
            })
            .finally(() => {
              this.setState({ loading: false })
            })
        } else {
          helper.errorToast('ERROR: UPDATING MAP LOCATION')
          this.setState({ loading: false })
        }
      })
    }
  }

  getPermissionAsync = async () => {
    let { status: camStatus } = await MediaLibrary.requestPermissionsAsync()
    if (camStatus !== 'granted') {
      const status = await MediaLibrary.requestPermissionsAsync().status
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
        return false
      }
    }
    // If permission is granted multiple selection dialog opens and image browser callback is called after user presses 'done'
    return true
  }

  getImagesFromGallery = () => {
    this.getPermissionAsync().then((result) => {
      if (result === true) {
        this.setState({ isModalOpen: true })
      } else {
        // Perimission denied, perform action or display alert
      }
    })
  }

  takePhotos = async () => {
    let { status: camStatus } = await Camera.requestPermissionsAsync()
    if (camStatus !== 'granted') {
      const status = await Camera.requestPermissionsAsync().status
      if (status !== 'granted') {
        return
      }
    }

    let result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
    })

    if (!result.cancelled) {
      this._compressImageAndUpload(result.uri, result)
    }
  }

  imageBrowserCallback = (mediaAssets) => {
    const { dispatch } = this.props
    mediaAssets
      .then((photos) => {
        this.setState(
          {
            isModalOpen: false,
          },
          () => {
            if (photos.length > 0) {
              dispatch(setImageLoading(true))
              this._uploadMultipleImages(photos)
            } else {
              helper.errorToast('No pictures selected')
            }
          }
        )
      })
      .catch((e) => console.log(e))
  }

  _uploadMultipleImages(response) {
    // response contains the array of photos
    response.map((object) => {
      // map each photo and upload them one at a time
      //Compress the image so that it can be uploaded to the server
      this._compressImageAndUpload(object.uri, object)
    })
  }

  //Image Compression and image size reduction...
  _compressImageAndUpload = async (uri, object) => {
    const { dispatch } = this.props
    let orginalWidth = object.width
    let originalHeight = object.height
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      orginalWidth * 0.5 > 1920
        ? [{ resize: { width: orginalWidth * 0.5, height: originalHeight * 0.5 } }]
        : [],
      {
        compress: 0.5,
      }
    )
    let filename = manipResult.uri.split('/').pop()
    let match = /\.(\w+)$/.exec(filename)
    let type = match ? `image/${match[1]}` : `image`

    let image = {
      name: filename,
      type: type,
      uri: manipResult.uri,
    }
    dispatch(uploadImage(image, true))
  }

  deleteImage = (imageId) => {
    const { dispatch } = this.props
    if (imageId) {
      dispatch(removeImage(imageId, true)).then((response) => {
        helper.successToast(response)
      })
    } else {
      alert('Please wait while images are processing')
    }
  }

  _getLocationAsync = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      alert('Permission to access location was denied')
    }
    const location = await Location.getCurrentPositionAsync().status
    if (location && location.coords && location.coords.latitude && location.coords.longitude) {
      this.handleForm(location.coords.latitude, 'lat')
      this.handleForm(location.coords.longitude, 'lon')
    } else {
      alert('Error while getting location!')
    }
  }

  convertLongitude = (val) => {
    if (val === '') {
      return null
    } else if (typeof val === 'string' && val != '') {
      return parseFloat(val)
    } else {
      return val
    }
  }

  convertLatitude = (val) => {
    if (val === '') {
      return null
    } else if (typeof val === 'string' && val != '') {
      return parseFloat(val)
    } else {
      return val
    }
  }

  convertToInteger = (val) => {
    if (val === '') {
      return null
    } else if (typeof val === 'string' && val != '') {
      return parseInt(val)
    }
  }

  convertToIntegerForZero = (val) => {
    if (val === 0) {
      return 0
    } else if (typeof val === 'string' && val != '') {
      return parseInt(val)
    } else if (val === '') {
      return 0
    } else {
      return val
    }
  }

  handleClientClick = () => {
    const { navigation } = this.props
    const { selectedClient } = this.state
    navigation.navigate('Client', {
      isFromDropDown: true,
      selectedClient,
      isPOC: false,
      screenName: 'AddInventory',
    })
  }

  handlePointOfContact = () => {
    const { navigation } = this.props
    const { selectedPOC } = this.state
    navigation.navigate('Client', {
      isFromDropDown: true,
      selectedPOC,
      isPOC: true,
      screenName: 'AddInventory',
    })
  }

  handleCityClick = () => {
    const { navigation } = this.props
    const { selectedCity } = this.state
    navigation.navigate('SingleSelectionPicker', {
      screenName: 'AddInventory',
      mode: 'city',
      selectedCity,
    })
  }

  handleAreaClick = () => {
    const { navigation } = this.props
    const { selectedArea, selectedCity } = this.state
    if (selectedCity) {
      navigation.navigate('SingleSelectionPicker', {
        screenName: 'AddInventory',
        mode: 'area',
        cityId: selectedCity.value,
        selectedArea,
      })
    } else {
      alert('Please select city first!')
    }
  }

  handleFeatures(feature) {
    if (this.state.selectedFeatures.includes(feature)) {
      let temp = this.state.selectedFeatures
      delete temp[temp.indexOf(feature)]
      this.setState({ selectedFeatures: temp })
    } else {
      let temp = this.state.selectedFeatures
      temp.push(feature)
      this.setState({ selectedFeatures: temp })
    }
  }

  handleMarkProperty = (value) => {
    const { formData } = this.state
    const copyObject = { ...formData }
    copyObject.locate_manually = value
    copyObject.propsure_id = null
    copyObject.lat = ''
    copyObject.lon = ''
    this.setState({ formData: copyObject })
  }

  handleWaterMark = (value) => {
    const { formData } = this.state
    const copyObject = { ...formData }
    copyObject.showWaterMark = value
    this.setState({ formData: copyObject })
  }

  showCustomTitleField = () => {
    const { showCustomTitle } = this.state
    this.setState({ showCustomTitle: !showCustomTitle })
  }

  setFlagObject = (object, name) => {
    if (name === 'owner_phone') {
      this.setState({ countryCode: object.cca2, callingCode: '+' + object.callingCode[0] })
    }
    if (name === 'poc_phone') {
      this.setState({ countryCode1: object.cca2, callingCode1: '+' + object.callingCode[0] })
    }
  }

  validatePhone = (value) => {
    if (value.length < 4 && value !== '') this.setState({ phoneValidate: true })
    else this.setState({ phoneValidate: false })
  }

  validatePocPhone(value) {
    if (value.length < 4 && value !== '') this.setState({ pocPhoneValidate: true })
    else this.setState({ pocPhoneValidate: false })
  }

  getTrimmedPhone = (number) => {
    let phone = number
    if (phone.startsWith('92')) {
      phone = phone.substring(2)
    } else if (phone.startsWith('092')) {
      phone = phone.substring(3)
    } else if (phone.startsWith('0092')) {
      phone = phone.substring(4)
    } else if (phone.startsWith('03')) {
      phone = phone.substring(1)
    }
    return phone
  }

  render() {
    const {
      formData,
      selectSubType,
      checkValidation,
      buttonText,
      buttonDisabled,
      sizeUnit,
      clientName,
      selectedCity,
      selectedArea,
      isModalOpen,
      showAdditional,
      additionalInformation,
      features,
      utilities,
      facing,
      selectedFeatures,
      loading,
      showCustomTitle,
      phoneValidate,
      pocPhoneValidate,
      countryCode,
      countryCode1,
    } = this.state
    return (
      <StyleProvider style={getTheme(formTheme)}>
        <KeyboardAvoidingView enabled>
          <Modal
            animated={true}
            ref={(ref) => (this._modal = ref)}
            animationType="slide"
            visible={isModalOpen}
            onRequestClose={() => this.setState({ isModalOpen: false })}
          >
            <View style={{ flex: 1 }}>
              <ImageBrowser
                max={10} // Maximum number of pickable image. default is None
                callback={this.imageBrowserCallback} // Callback functinon on press Done or Cancel Button. Argument is Asset Infomartion of the picked images wrapping by the Promise.
              />
            </View>
          </Modal>
          <ScrollView keyboardShouldPersistTaps="always">
            {/* ********* Form Component */}
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={AppStyles.container}>
                <DetailForm
                  formSubmit={this.formSubmit}
                  checkValidation={checkValidation}
                  handleForm={this.handleForm}
                  formData={formData}
                  purpose={StaticData.purpose}
                  selectedCity={selectedCity}
                  selectedArea={selectedArea}
                  handleCityClick={this.handleCityClick}
                  handleAreaClick={this.handleAreaClick}
                  buttonText={buttonText}
                  clientName={clientName}
                  handleClientClick={this.handleClientClick}
                  propertyType={StaticData.type}
                  getCurrentLocation={this._getLocationAsync}
                  getImagesFromGallery={() => this.getImagesFromGallery()}
                  takePhotos={() => this.takePhotos()}
                  selectSubType={selectSubType}
                  sizeUnit={sizeUnit}
                  selectedGrade={formData.grade}
                  size={StaticData.oneToTen}
                  latitude={formData.lat}
                  longitude={formData.lon}
                  price={formData.price}
                  deleteImage={(image, index) => this.deleteImage(image, index)}
                  buttonDisabled={buttonDisabled}
                  showAdditional={showAdditional}
                  showAdditionalInformation={() =>
                    this.setState({ showAdditional: !showAdditional })
                  }
                  additionalInformation={additionalInformation}
                  features={features}
                  utilities={utilities}
                  facing={facing}
                  selectedFeatures={selectedFeatures}
                  handleFeatures={(value) => this.handleFeatures(value)}
                  loading={loading}
                  handlePointOfContact={this.handlePointOfContact}
                  handleMarkProperty={this.handleMarkProperty}
                  handleWaterMark={this.handleWaterMark}
                  showCustomTitleField={this.showCustomTitleField}
                  showCustomTitle={showCustomTitle}
                  phoneValidate={phoneValidate}
                  pocPhoneValidate={pocPhoneValidate}
                  countryCode={countryCode}
                  countryCode1={countryCode1}
                  getTrimmedPhone={this.getTrimmedPhone}
                  setFlagObject={this.setFlagObject}
                  navigation={this.props.navigation}
                />
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </StyleProvider>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    images: store.property.images,
  }
}

export default connect(mapStateToProps)(EditFieldAppProperty)
