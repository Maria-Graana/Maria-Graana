/** @format */

import axios from 'axios'
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { StyleProvider } from 'native-base'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import { Camera } from 'expo-camera'
import getTheme from '../../../native-base-theme/components'
import formTheme from '../../../native-base-theme/variables/formTheme'
import _ from 'underscore'
import {
  addImage,
  flushImages,
  removeImage,
  setAddPropertyParams,
  setImageLoading,
  uploadImage,
} from '../../actions/property'
import AppStyles from '../../AppStyles'
import ImageBrowser from '../../components/ImageBrowser/ImageBrowser'
import helper from '../../helper'
import StaticData from '../../StaticData'
import DetailForm from './detailForm'

class AddInventory extends Component {
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
      selectedClient: null,
      selectedPOC: null,
      selectedCity: null,
      selectedArea: null,
      isModalOpen: false,
      phoneValidate: false,
      countryCode: defaultCountry.name,
      callingCode: defaultCountry.code,
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
        customer_id: null,
        poc_name: null,
        poc_phone: null,
        price: 0,
        grade: '',
        status: 'pending',
        transfered: false,
        transferedDate: null,
        transferedFrom: null,
        origin: 'arms',
        imageIds: [],
        lat: '',
        lng: '',
        propsure_id: null,
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
        geotagged_date: null,
        downpayment: 0,
        showWaterMark: false,
        leadId: null,
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
    const { navigation, route } = this.props
    const { screenName, lead, name, client } = route.params

    if (route.params.update) {
      navigation.setOptions({ title: 'EDIT PROPERTY' })
      this.setEditValues()
    }

    // from lead viewing screen, adding a new property for shortlist
    if (screenName && screenName === 'leadViewing' && lead) {
      const { formData } = this.state
      let copyObject = Object.assign({}, formData)
      const area = lead.armsLeadAreas && lead.armsLeadAreas[0] ? lead.armsLeadAreas[0].area : null
      copyObject.city_id = lead.city_id
      copyObject.area_id = area.id
      copyObject.purpose = lead.purpose
      copyObject.type = lead.type
      copyObject.subtype = lead.subtype
      copyObject.leadId = lead.id
      this.setState(
        {
          formData: copyObject,
          selectedCity: { ...lead.city, value: lead.city.id },
          selectedArea: { ...area, value: area.id },
        },
        () => {
          this.selectSubtype(lead.type)
        }
      )
    }

    navigation.addListener('focus', () => {
      this.onScreenFocused()
    })
  }

  componentDidUpdate(prevProps, prevState) {
    //Typical usage, don't forget to compare the props
    if (prevState.selectedCity && this.state.selectedCity.value !== prevState.selectedCity.value) {
      this.clearAreaOnCityChange() // clear area field only when city is changed, doesnot get called if same city is selected again..
    }

    if (prevState.formData.lat !== prevProps.addPropertyParams.latitude) {
      this.updatePropertyLocation()
    }
  }

  updatePropertyLocation = () => {
    if (this.props.addPropertyParams) {
      let copyPropertyObj = { ...this.state.formData }
      copyPropertyObj.lat = this.props.addPropertyParams.latitude
      copyPropertyObj.lng = this.props.addPropertyParams.longitude
      copyPropertyObj.locate_manually = this.props.addPropertyParams.locate_manually
      copyPropertyObj.propsure_id = this.props.addPropertyParams.propsure_id
        ? this.props.addPropertyParams.propsure_id
        : null
      this.setState({
        formData: copyPropertyObj,
      })
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flushImages())
    this.props.dispatch(setImageLoading(false))
  }

  onScreenFocused = () => {
    const { client, name, flowCheck, selectedCity, selectedPOC, selectedArea, noEditableClient } =
      this.props.route.params

    const { formData } = this.state
    let copyObject = Object.assign({}, formData)

    if (client && name) {
      if (noEditableClient) {
        this.setState({
          formData: copyObject,
          clientName: name,
          selectedClient: client,
        })
      } else {
        this.setState({
          formData: copyObject,
          clientName: name,
          selectedClient: client,
          selectedPOC: client,
        })
      }
    }
    if (selectedPOC) {
      copyObject.poc_name =
        selectedPOC.firstName && selectedPOC.lastName
          ? selectedPOC.firstName + ' ' + selectedPOC.lastName
          : null
      copyObject.poc_phone = selectedPOC.contact1 ? selectedPOC.contact1 : null
      this.setState({ formData: copyObject, selectedPOC })
    }
    if (selectedCity) {
      copyObject.city_id = selectedCity.value
      this.setState({ formData: copyObject, selectedCity })
    }
    if (selectedArea) {
      copyObject.area_id = selectedArea.value
      this.setState({ formData: copyObject, selectedArea })
    }

    if (noEditableClient && !flowCheck) {
      let copyObject = Object.assign({}, formData)
      copyObject.poc_name =
        client.first_name && client.last_name ? client.first_name + ' ' + client.last_name : null
      copyObject.poc_phone = client.contact1 ? client.contact1 : null

      this.setState({ formData: copyObject, selectedPOC: client })
    }
  }

  clearAreaOnCityChange = () => {
    const { formData } = this.state
    this.setState({ formData: { ...formData, area_id: '' }, selectedArea: null })
  }

  setEditValues = () => {
    const { route } = this.props
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
          address: property.address,
          customer_id: property.customer_id ? property.customer_id : null,
          price: property.price ? property.price : 0,
          imageIds:
            property.armsPropertyImages.length === 0 || property.armsPropertyImages === undefined
              ? []
              : property.armsPropertyImages,
          grade: property.grade,
          origin: property.origin,
          status: property.status,
          lat: property.lat,
          lng: property.lng,
          locate_manually: property.locate_manually,
          propsure_id: property.propsure_id,
          geotagged_date: property.geotagged_date,
          description: property.description,
          transfered: property.transfered,
          transferedDate: property.transferedDate,
          transferedFrom: property.transferedFrom,
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
          poc_name: property.poc_name ? property.poc_name : null,
          poc_phone: property.poc_phone ? property.poc_phone : null,
        },
        selectedClient: property.customer ? property.customer : null,
        selectedPOC:
          property.poc_name && property.poc_phone
            ? { firstName: property.poc_name, contact1: property.poc_phone }
            : null,
        selectedCity: property.city ? { ...property.city, value: property.city.id } : null,
        selectedFeatures: amentities,
        selectedArea: property.area ? { ...property.area, value: property.area.id } : null,
        clientName:
          property.customer && property.customer.first_name + ' ' + property.customer.last_name,
        buttonText: 'UPDATE PROPERTY',
      },
      () => {
        this.selectSubtype(property.type)
        this.setFeatures(property.type)
        this.props.dispatch(
          setAddPropertyParams({
            latitude: property.lat,
            longitude: property.lng,
            locate_manually: property.locate_manually,
            propsure_id: property.propsure_id,
          })
        )
        // this.getAreas(property.city_id);
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
    if (formData.size === '') {
      formData.size = 0
      this.setState({ formData })
    }
  }

  clearGeotaggData = () => {
    this.props.dispatch(
      setAddPropertyParams({
        latitude: '',
        longitude: '',
        locate_manually: false,
        propsure_id: null,
      })
    )
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
      !formData.customer_id
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

  createOrEditProperty = async (formData) => {
    let features = {}
    const { navigation, route, dispatch } = this.props
    const { selectedFeatures } = this.state
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
    formData.lng = this.convertLongitude(formData.lng)
    formData.size = this.convertToIntegerForZero(formData.size)
    formData.price = this.convertToIntegerForZero(formData.price)
    formData.custom_title = formData.custom_title === '' ? null : formData.custom_title
    formData.features = _.isEmpty(features) ? {} : features
    formData.imageIds = _.pluck(images, 'id')
    // deleting these keys below from formdata as they are sent in features instead of seperately
    delete formData.parking_space
    delete formData.floors
    delete formData.year_built
    delete formData.downpayment

    if (route.params.update) {
      axios
        .patch(`/api/inventory/${property.id}`, formData)
        .then((res) => {
          if (res.status === 200) {
            helper.successToast('PROPERTY UPDATED SUCCESSFULLY!')
            dispatch(flushImages())
            navigation.navigate('InventoryTabs', {
              update: false,
              screen: 'ARMS',
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
      const { screenName, lead } = route.params
      if (screenName && screenName === 'leadViewing') {
        // adding property for lead viewing and shortlisting it in lead workflow
        axios
          .post(`/api/inventory/create`, formData)
          .then((res) => {
            if (res.status === 200) {
              helper.successToast('PROPERTY ADDED SUCCESSFULLY!')
              dispatch(flushImages())
              navigation.navigate('RCMLeadTabs', {
                screen: 'Viewing',
                params: { lead: lead },
              })
            } else {
              helper.errorToast('ERROR: SOMETHING WENT WRONG')
            }
            this.setState({ loading: false })
          })
          .catch((error) => {
            console.log(error.message)
          })
          .finally(() => {
            this.setState({ loading: false })
          })
      } else {
        // adding property for normal flow
        axios
          .post(`/api/inventory/create`, formData)
          .then((res) => {
            console.log(res.data)
            if (res.status === 200) {
              helper.successToast('PROPERTY ADDED SUCCESSFULLY!')
              dispatch(flushImages())
              navigation.navigate('InventoryTabs', {
                update: false,
                screen: 'ARMS',
                params: { screen: 'InventoryTabs' },
              })
            } else {
              helper.errorToast('ERROR: SOMETHING WENT WRONG')
            }
            this.setState({ loading: false })
          })
          .catch((error) => {
            this.setState({ loading: false })
            helper.errorToast('ERROR: ADDING PROPERTY')
            console.log('error', error.message)
          })
          .finally(() => {
            this.setState({ loading: false })
          })
      }
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
    dispatch(uploadImage(image))
  }

  deleteImage = (imageId) => {
    const { dispatch } = this.props
    if (imageId) {
      dispatch(removeImage(imageId)).then((response) => {
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
    const location = await Location.getCurrentPositionAsync()
    if (location && location.coords && location.coords.latitude && location.coords.longitude) {
      this.handleForm(location.coords.latitude, 'lat')
      this.handleForm(location.coords.longitude, 'lng')
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

    navigation.navigate('ClientView', {
      isFromDropDown: true,
      selectedClient,
      isPOC: false,
      screenName: 'AddInventory',
    })
  }

  handlePointOfContact = () => {
    const { navigation } = this.props
    const { selectedPOC } = this.state
    navigation.navigate('ClientView', {
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
    copyObject.lng = ''
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
    } = this.state
    const { route } = this.props
    const { client, noEditableClient } = route.params
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
                  nonEditableClient={noEditableClient ? true : false}
                  formSubmit={this.formSubmit}
                  clearGeotaggData={this.clearGeotaggData}
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
                  getImagesFromGallery={() => this.getImagesFromGallery()}
                  takePhotos={() => this.takePhotos()}
                  selectSubType={selectSubType}
                  sizeUnit={sizeUnit}
                  selectedGrade={formData.grade}
                  size={StaticData.oneToTen}
                  latitude={formData.lat}
                  longitude={formData.lng}
                  propsure_id={formData.propsure_id}
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
                  getCurrentLocation={this._getLocationAsync}
                  loading={loading}
                  handlePointOfContact={this.handlePointOfContact}
                  handleMarkProperty={this.handleMarkProperty}
                  handleWaterMark={this.handleWaterMark}
                  showCustomTitleField={this.showCustomTitleField}
                  showCustomTitle={showCustomTitle}
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
    addPropertyParams: store.property.addPropertyParams,
  }
}

export default connect(mapStateToProps)(AddInventory)
