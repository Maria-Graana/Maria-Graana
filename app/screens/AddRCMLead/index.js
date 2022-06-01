/** @format */

import React, { Component } from 'react'
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native'
import { StyleProvider } from 'native-base'
import RCMLeadFrom from './RCMLeadFrom'
import AppStyles from '../../AppStyles'
import getTheme from '../../../native-base-theme/components'
import formTheme from '../../../native-base-theme/variables/formTheme'
import axios from 'axios'
import { connect } from 'react-redux'
import * as RootNavigation from '../../navigation/RootNavigation'
import StaticData from '../../StaticData'
import helper from '../../helper'
import { setSelectedAreas } from '../../actions/areas'
import _ from 'underscore'

class AddRCMLead extends Component {
  constructor(props) {
    super(props)
    this.state = {
      organizations: [],
      checkValidation: false,
      clientName: '',
      selectedClient: null,
      selectedCity: null,
      getProject: [],
      formType: 'buy',
      priceList: [],
      sizeUnitList: [],
      selectSubType: [],
      loading: false,
      isBedBathModalVisible: false,
      isPriceModalVisible: false,
      isSizeModalVisible: false,
      modalType: 'none',
      RCMFormData: {
        type: '',
        subtype: '',
        leadAreas: [],
        customerId: '',
        city_id: '',
        size_unit: 'marla',
        description: '',
        org: '',
        bed: null,
        maxBed: null,
        bath: null,
        maxBath: null,
        size: StaticData.sizeMarla[0],
        maxSize: StaticData.sizeMarla[StaticData.sizeMarla.length - 1],
        minPrice: 0,
        maxPrice: 0,
      },
    }
  }

  componentDidMount() {
    const { user, navigation, route } = this.props
    const { purpose, update = false, lead } = route.params

    if (update) {
      navigation.setOptions({ title: 'EDIT LEAD' })
      this.setEditValues()
    }
    if (purpose) {
      this.setState({ formType: purpose }, () => {
        this.setPriceList()
      })
    } else {
      this.setPriceList()
    }
    this.fetchOrganizations()
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    // selected Areas should be cleared to be used anywhere else
    dispatch(setSelectedAreas([]))
  }

  componentDidUpdate(prevProps, prevState) {
    const { CMLead, route, dispatch, selectedAreasIds } = this.props
    const { selectedCity, client } = route.params
    if (selectedCity && prevState.RCMFormData.city_id !== selectedCity.value) {
      this.setState({
        selectedCity,
        RCMFormData: { ...this.state.RCMFormData, city_id: selectedCity.value },
      })
    }
    if (client && prevState.RCMFormData.customerId !== client.id) {
      this.setClient()
    }
    //Typical usage, don't forget to compare the props
    if (prevState.selectedCity && this.state.selectedCity.value !== prevState.selectedCity.value) {
      this.clearAreaOnCityChange() // clear area field only when city is changed, doesnot get called if same city is selected again..
    }

    if (prevProps.selectedAreasIds !== selectedAreasIds) {
      this.setState({ RCMFormData: { ...this.state.RCMFormData, leadAreas: selectedAreasIds } })
    }
  }

  setEditValues = () => {
    const { route, dispatch } = this.props
    const { RCMFormData } = this.state
    const { lead = null, selectedCity, client, name } = route.params
    let areasId =
      lead.armsLeadAreas && lead.armsLeadAreas.length > 0
        ? _.pluck(lead.armsLeadAreas, 'area_id')
        : []
    const regex = /(<([^>]+)>)/gi
    let copyObject = Object.assign({}, RCMFormData)
    copyObject.maxPrice = lead.price ? lead.price : 0
    copyObject.minPrice = lead.min_price ? lead.min_price : 0
    copyObject.bed = lead.bed ? lead.bed : 0
    copyObject.maxBed = lead.maxBed ? lead.maxBed : 0
    copyObject.bath = lead.bath ? lead.bath : 0
    copyObject.maxBath = lead.maxBath ? lead.maxBath : 0
    copyObject.size = lead.size ? lead.size : StaticData.sizeMarla[0]
    copyObject.size_unit = lead.size_unit ? lead.size_unit : 'marla'
    copyObject.maxSize = lead.max_size
      ? lead.max_size
      : StaticData.sizeMarla[StaticData.sizeMarla.length - 1]
    copyObject.type = lead.type ? lead.type : ''
    copyObject.subtype = lead.subtype ? lead.subType : ''
    copyObject.customerId = client ? client.id : null
    copyObject.city_id = selectedCity ? selectedCity.value : null
    copyObject.leadAreas = areasId
    copyObject.description = lead.description ? lead.description.replace(regex, '') : ''
    copyObject.subtype = lead.subtype ? lead.subtype : ''
    copyObject.org =
      lead.customer && lead.customer.organizationId ? lead.customer.organizationId : null
    dispatch(setSelectedAreas(areasId))
    this.setState({ selectedCity, selectedClient: client, name, RCMFormData: copyObject }, () => {
      if (copyObject.type != '') {
        this.selectSubtype(copyObject.type)
      }
    })
  }

  clearParmas = () => {
    const { navigation } = this.props
    navigation.setParams({ selectedCity: null, client: null, name: null })
  }

  setClient = () => {
    const { CMLead, route, dispatch } = this.props
    const { RCMFormData } = this.state
    const { client, name, selectedCity } = route.params
    let copyObject = Object.assign({}, RCMFormData)
    let phones = []
    if (client && client.customerContacts && client.customerContacts.length) {
      client.customerContacts.map((item) => {
        phones.push(item.phone)
      })
      copyObject.customerId = client.id
      copyObject.phones = phones
    }

    setTimeout(() => {
      this.setState({
        RCMFormData: copyObject,
        selectedCity,
        selectedClient: client,
        clientName: name,
      })
    }, 500)
  }

  fetchOrganizations = () => {
    axios
      .get('/api/user/organizations?limit=2')
      .then((res) => {
        let organizations = []
        res &&
          res.data.rows.length &&
          res.data.rows.map((item, index) => {
            return organizations.push({ value: item.id, name: item.name })
          })
        this.setState({ organizations })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  setPriceList = () => {
    const { formType, RCMFormData } = this.state
    if (formType === 'buy') {
      RCMFormData.minPrice = StaticData.PricesBuy[0]
      RCMFormData.maxPrice = StaticData.PricesBuy[StaticData.PricesBuy.length - 1]
      this.setState({ RCMFormData, priceList: StaticData.PricesBuy })
    } else {
      RCMFormData.minPrice = StaticData.PricesRent[0]
      RCMFormData.maxPrice = StaticData.PricesRent[StaticData.PricesRent.length - 1]
      this.setState({ RCMFormData, priceList: StaticData.PricesRent })
    }
  }

  handleRCMForm = (value, name) => {
    const { RCMFormData } = this.state
    if (name === 'description') {
      const copyObject = { ...RCMFormData }
      copyObject.description = value
      this.setState({ RCMFormData: copyObject })
    } else {
      const { dispatch } = this.props
      RCMFormData[name] = value
      if (name === 'size_unit') this.setSizeUnitList(value)
      this.setState({ RCMFormData })
      if (RCMFormData.type != '') {
        this.selectSubtype(RCMFormData.type)
      }
    }
  }

  clearAreaOnCityChange = () => {
    const { dispatch } = this.props
    const { RCMFormData } = this.state
    let copyObject = Object.assign({}, RCMFormData)
    copyObject.leadAreas = []
    this.setState({ RCMFormData: copyObject })
    dispatch(setSelectedAreas([]))
  }

  handleAreaClick = () => {
    const { RCMFormData } = this.state
    const { city_id, leadAreas } = RCMFormData
    const { navigation } = this.props
    const isEditMode = `${leadAreas && leadAreas.length > 0 ? true : false}`
    if (city_id !== '' && city_id !== undefined && city_id != null) {
      navigation.navigate('AreaPickerScreen', {
        cityId: city_id,
        isEditMode: isEditMode,
        screenName: 'AddRCMLead',
      })
    } else {
      alert('Please select city first!')
    }
  }

  selectSubtype = (type) => {
    this.setState(
      {
        selectSubType: StaticData.subType[type],
      },
      () => {
        this.setDefaultValuesForBedBath(type)
      }
    )
  }

  setDefaultValuesForBedBath = (type) => {
    if (type === 'residential') {
      const { RCMFormData } = this.state
      const copyObject = { ...RCMFormData }
      copyObject.bed = 0
      copyObject.bath = 0
      copyObject.maxBed = StaticData.bedBathRange[StaticData.bedBathRange.length - 1]
      copyObject.maxBath = StaticData.bedBathRange[StaticData.bedBathRange.length - 1]
      this.setState({ RCMFormData: copyObject })
    }
  }

  RCMFormSubmit = () => {
    const { RCMFormData } = this.state
    const { user } = this.props
    if (user.subRole === 'group_management') {
      if (
        !RCMFormData.customerId ||
        !RCMFormData.city_id ||
        !RCMFormData.leadAreas ||
        !RCMFormData.type ||
        !RCMFormData.org ||
        !RCMFormData.subtype
      ) {
        this.setState({
          checkValidation: true,
        })
      } else this.sendPayload()
    } else {
      if (
        !RCMFormData.customerId ||
        !RCMFormData.city_id ||
        !RCMFormData.leadAreas ||
        !RCMFormData.type ||
        !RCMFormData.subtype
      ) {
        this.setState({
          checkValidation: true,
        })
      } else this.sendPayload()
    }
  }

  sendPayload = () => {
    const { formType, RCMFormData, organizations } = this.state
    const { user, route } = this.props
    const { update = false, lead, noEditableClient, client } = route.params
    if (RCMFormData.size === '') RCMFormData.size = null
    else RCMFormData.size = Number(RCMFormData.size)
    let payLoad = {
      purpose: formType,
      type: RCMFormData.type,
      subtype: RCMFormData.subtype,
      bed: RCMFormData.bed,
      bath: RCMFormData.bath,
      maxBed: RCMFormData.maxBed,
      maxBath: RCMFormData.maxBath,
      size: RCMFormData.size,
      max_size: RCMFormData.maxSize,
      leadAreas: RCMFormData.leadAreas,
      customerId: RCMFormData.customerId,
      city_id: RCMFormData.city_id,
      size_unit: RCMFormData.size_unit,
      price: RCMFormData.maxPrice,
      min_price: RCMFormData.minPrice,
      description: RCMFormData.description,
      phones: RCMFormData.phones,
    }

    this.setState({ loading: true }, () => {
      if (user.subRole === 'group_management') {
        let newOrg = _.find(organizations, function (item) {
          return item.value === RCMFormData.org
        })
        payLoad.org = newOrg.name.toLowerCase()
      }

      if (update) {
        axios
          .patch(`/api/leads/update/${lead.id}`, payLoad)
          .then((res) => {
            helper.successToast('Lead updated successfully')
            if (payLoad.purpose == 'buy') {
              RootNavigation.navigateToSpecificTab('Leads', 'Buy')
            } else {
              RootNavigation.navigateToSpecificTab('Leads', 'Rent')
            }
          })
          .catch((error) => {
            console.log('error on updating lead', error)
            this.setState({ loading: false })
          })
      } else {
        axios
          .post(`/api/leads`, payLoad)
          .then((res) => {
            helper.successToast('Lead created successfully')

            if (noEditableClient) {
              // RootNavigation.navigateTo('ProjectLeads', {
              //   client: client,
              //   screen: 'ProjectLeads',
              // })
              if (payLoad.purpose == 'buy') {
                RootNavigation.navigateTo('Leads', { screen: 'Buy', client: client })
              } else {
                RootNavigation.navigateTo('Leads', { screen: 'Rent', client: client })
              }
            } else {
              if (payLoad.purpose == 'buy') {
                RootNavigation.navigateToSpecificTab('Leads', 'Buy')
              } else {
                RootNavigation.navigateToSpecificTab('Leads', 'Rent')
              }
              //RootNavigation.navigate('ProjectLeads')
            }
          })
          .catch((error) => {
            console.log('error on creating lead', error)
            this.setState({ loading: false })
          })
      }
    })
  }

  changeStatus = (status) => {
    this.setState(
      {
        formType: status,
      },
      () => {
        this.setPriceList()
      }
    )
  }

  render() {
    const {
      organizations,
      cities,
      clientName,
      formType,
      RCMFormData,
      selectedCity,
      selectSubType,
      checkValidation,
      priceList,
      loading,
      sizeUnitList,
      selectedClient,
      isBedBathModalVisible,
      isPriceModalVisible,
      isSizeModalVisible,
      modalType,
    } = this.state
    const { route } = this.props
    const { update = false } = route.params
    const { client, noEditableClient } = route.params

    return (
      <View style={[route.params.pageName === 'CM' && AppStyles.container]}>
        <StyleProvider style={getTheme(formTheme)}>
          <KeyboardAvoidingView enabled>
            <ScrollView keyboardShouldPersistTaps="always">
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                  <RCMLeadFrom
                    setParentState={(obj) => {
                      this.setState(obj)
                    }}
                    nonEditableClient={noEditableClient ? true : false}
                    navigation={this.props.navigation}
                    sizeUnitList={sizeUnitList}
                    organizations={_.clone(organizations)}
                    selectedCity={selectedCity}
                    selectedClient={selectedClient}
                    clientName={clientName}
                    formSubmit={this.RCMFormSubmit}
                    checkValidation={checkValidation}
                    handleForm={this.handleRCMForm}
                    changeStatus={this.changeStatus}
                    size={StaticData.oneToTen}
                    sizeUnit={StaticData.sizeUnit}
                    propertyType={StaticData.type}
                    formData={RCMFormData}
                    update={update}
                    formType={formType}
                    subTypeData={selectSubType}
                    handleAreaClick={this.handleAreaClick}
                    priceList={priceList}
                    onSliderValueChange={(values) => this.onSliderValueChange(values)}
                    loading={loading}
                    isBedBathModalVisible={isBedBathModalVisible}
                    modalType={modalType}
                    isPriceModalVisible={isPriceModalVisible}
                    isSizeModalVisible={isSizeModalVisible}
                  />
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </KeyboardAvoidingView>
        </StyleProvider>
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    selectedAreasIds: store.areasReducer.selectedAreas,
  }
}

export default connect(mapStateToProps)(AddRCMLead)
