/** @format */

import axios from 'axios'
import { StyleProvider } from 'native-base'
import * as React from 'react'
import { FlatList, Image, Linking, Text, TouchableOpacity, View } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import _ from 'underscore'
import getTheme from '../../../native-base-theme/components'
import CheckBoxTheme from '../../../native-base-theme/variables/CheckBoxTheme'
import { setlead } from '../../actions/lead'
import AppStyles from '../../AppStyles'
import AgentTile from '../../components/AgentTile/index'
import CMBottomNav from '../../components/CMBottomNav'
import FilterModal from '../../components/FilterModal/index'
import HistoryModal from '../../components/HistoryModal/index'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import Loader from '../../components/loader'
import MatchTile from '../../components/MatchTile/index'
import StatusFeedbackModal from '../../components/StatusFeedbackModal'
import config from '../../config'
import helper from '../../helper'
import StaticData from '../../StaticData'
import styles from './style'
import MeetingFollowupModal from '../../components/MeetingFollowupModal'
import SubmitFeedbackOptionsModal from '../../components/SubmitFeedbackOptionsModal'

class PropertyMatch extends React.Component {
  constructor(props) {
    super(props)
    const { user, lead, permissions } = this.props
    this.state = {
      open: false,
      organization: 'graana',
      loading: true,
      matchData: {
        data: [],
        type: 'arms',
      },
      checkAllBoolean: false,
      showFilter: false,
      active: false,
      matchesBol: true,
      showCheckBoxes: true,
      armsBol: false,
      graanaBol: false,
      agency21Bol: false,
      armsData: [],
      graanaData: [],
      agency21Data: [],
      selectedCity: {},
      formData: {
        cityId: '',
        areaId: '',
        minPrice: 0,
        maxPrice: 0,
        bed: null,
        maxBed: null,
        bath: null,
        maxBath: null,
        size: null,
        maxSize: null,
        sizeUnit: '',
        propertySubType: '',
        propertyType: '',
        purpose: '',
        leadAreas: [],
      },
      checkCount: {
        true: 0,
        false: 0,
      },
      selectedProperties: [],
      displayButton: false,
      cities: [],
      areas: [],
      subTypVal: [],
      progressValue: 0,
      filterColor: false,
      cities: [],
      areas: [],
      // for the lead close dialog
      isVisible: false,
      checkReasonValidation: false,
      selectedReason: '',
      reasons: [],
      closedLeadEdit: helper.checkAssignedSharedStatus(user, lead, permissions),
      callModal: false,
      meetings: [],
      legalDocLoader: false,
      active: false,
      statusfeedbackModalVisible: false,
      modalMode: 'call',
      isFollowUpMode: false,
      closedWon: false,
      newActionModal: false,
      shortListedProperties: [],
    }
  }

  componentDidMount() {
    const { lead } = this.props
    this.fetchLegalPaymentInfo()
    this.fetchLead()
    this.getCallHistory()
    this.props.dispatch(setlead(lead))
    this.fetchProperties()
  }

  fetchLead = (url) => {
    const { lead } = this.props
    axios
      .get(`/api/leads/byId?id=${lead.id}`)
      .then((res) => {
        this.props.dispatch(setlead(res.data))
        this.closeLead(res.data)
        this.setState({ lead: res.data }, () => this.getCities())
      })
      .catch((error) => {
        console.log(error)
      })
  }

  fetchProperties = () => {
    const { lead } = this.props
    let matches = []
    axios
      .get(`/api/leads/${lead.id}/shortlist`)
      .then((res) => {
        matches = helper.propertyIdCheck(res.data.rows)
        this.setState({
          shortListedProperties: matches,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  selectedOrganization = (value) => {
    this.setState(
      {
        organization: value,
        loading: true,
      },
      () => {
        this.fetchMatches()
      }
    )
  }

  getCities = () => {
    axios.get(`/api/cities`).then((res) => {
      let citiesArray = []
      res &&
        res.data.map((item, index) => {
          return citiesArray.push({ value: item.id, name: item.name, isSelected: false })
        })
      this.setState(
        {
          cities: citiesArray,
        },
        () => this.resetFilter()
      )
    })
  }

  getAreas = (cityId) => {
    axios.get(`/api/areas?city_id=${cityId}&&all=${true}&minimal=true`).then((res) => {
      let areas = []
      res &&
        res.data.items.map((item, index) => {
          return areas.push({ value: item.id, name: item.name })
        })
      this.setState({
        areas: areas,
      })
    })
  }

  handleForm = (value, name) => {
    const { formData } = this.state
    formData[name] = value
    if (name === 'cityId') {
      this.getAreas(value.value)
      this.filterModalRef.emptyList()
      this.handleCity(value)
      formData.leadAreas = []
      formData[name] = value.value
    }
    // if (name === 'sizeUnit') this.setSizeUnitList(value)
    this.setState({ formData })
  }

  handleCity = (city) => {
    let { cities, selectedCity } = this.state
    selectedCity = _.find(cities, function (item) {
      return item.value === city.value
    })
    let newCities = cities.map((item, index) => {
      if (item.value === city.value) item.isSelected = true
      else item.isSelected = false
      return item
    })
    this.setState({ cities: newCities, selectedCity })
  }

  getSubType = (text) => {
    const { subType } = StaticData
    this.setState({
      subTypVal: subType[text],
    })
  }

  filterModal = () => {
    const { showFilter } = this.state
    this.setState({
      filterColor: false,
      showFilter: !showFilter,
      matchesBol: false,
    })
  }

  submitFilter = () => {
    const { formData } = this.state
    this.setState(
      {
        formData: formData,
        showFilter: false,
        loading: true,
        filterColor: true,
      },
      () => {
        this.fetchMatches()
      }
    )
  }

  resetFilter = () => {
    const { lead } = this.state
    let cityId = ''
    let areas = []

    if ('city' in lead && lead.city) {
      cityId = lead.city.id
      this.getAreas(cityId)
      this.handleCity({ value: cityId })
    }

    if ('armsLeadAreas' in lead) {
      if (lead.armsLeadAreas.length) {
        areas = lead.armsLeadAreas.map((area) => {
          if ('area' in area) return area?.area?.id
        })
      }
    }
    if (!lead.size_unit) lead.size_unit = 'marla'
    if (!lead.bed) lead.bed = 0
    if (!lead.maxBed) lead.maxBed = StaticData.bedBathRange[StaticData.bedBathRange.length - 1]
    if (!lead.bath) lead.bath = 0
    if (!lead.maxBath) lead.maxBath = StaticData.bedBathRange[StaticData.bedBathRange.length - 1]
    if (lead.type) this.getSubType(lead.type)
    if (!lead.min_price) lead.min_price = 0
    if (!lead.price) lead.price = StaticData.Constants.any_value
    if (!lead.size) lead.size = 0
    if (!lead.max_size) lead.max_size = StaticData.Constants.size_any_value
    this.setState(
      {
        formData: {
          cityId: cityId,
          leadAreas: areas,
          minPrice: lead.min_price,
          maxPrice: lead.price,
          bed: lead.bed,
          bath: lead.bath,
          maxBed: lead.maxBed,
          maxBath: lead.maxBath,
          size: lead.size,
          sizeUnit: lead.size_unit,
          propertySubType: lead.subtype,
          propertyType: lead.type,
          purpose: lead.purpose,
          maxSize: lead.max_size,
        },
        showFilter: false,
        loading: true,
        filterColor: false,
      },
      () => {
        this.fetchMatches()
      }
    )
  }

  canCallApi = () => {
    const { organization, armsBol, graanaBol, agency21Bol } = this.state

    if (organization === 'arms') {
      if (armsBol) return false
      else return true
    } else if (organization === 'graana') {
      if (graanaBol) return false
      else return true
    } else if (organization === 'agency21') {
      if (agency21Bol) return false
      else return true
    } else {
      return false
    }
  }

  setParams = () => {
    const { organization, formData } = this.state
    const { lead } = this.state
    let params = {
      leadId: lead.id,
      organization: organization,
      type: formData.propertyType,
      subtype: formData.propertySubType,
      area_id: formData.leadAreas,
      purpose: formData.purpose,
      price_min: String(formData.minPrice),
      price_max: String(formData.maxPrice),
      city_id: formData.cityId,
      bed: formData.bed === 0 ? null : String(formData.bed),
      bath: formData.bath === 0 ? null : String(formData.bath),
      maxBed: String(formData.maxBed),
      maxBath: String(formData.maxBath),
      size: String(formData.size),
      unit: formData.sizeUnit,
      max_size: String(formData.maxSize),
      all: true,
    }

    for (let key in params) {
      if (params[key] === '' || !params[key]) {
        delete params[key]
      }
    }
    return params
  }

  fetchMatches = () => {
    const { organization, showCheckBoxes } = this.state
    const { lead } = this.state
    const { rcmProgressBar } = StaticData
    let matches = []

    let params = this.setParams()
    let callApi = this.canCallApi()
    if (lead.type === 'plot' || lead.type === 'commercial') {
      delete params.bed
      delete params.maxBed
      delete params.bath
      delete params.maxBath
    }
    if (callApi || !showCheckBoxes) {
      if (organization === 'graana') params.organization = 'graanaDU'
      axios
        .get(`/api/leads/matches`, {
          params: params,
        })
        .then((res) => {
          matches = helper.propertyCheck(res.data.rows)
          this.setState(
            {
              matchData: {
                type: organization,
                data: matches,
              },
              progressValue: rcmProgressBar[lead.status],
            },
            () => {
              this.loadData()
            }
          )
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      this.handleApiData()
    }
  }

  loadData = () => {
    const { matchData } = this.state
    if (matchData.type === 'arms') {
      this.setState({ armsData: matchData.data, loading: false })
    } else if (matchData.type === 'graana') {
      this.setState({ graanaData: matchData.data, loading: false })
    } else {
      this.setState({ agency21Data: matchData.data, loading: false })
    }
  }

  changeComBool = () => {
    const { organization, matchData } = this.state

    if (organization === 'arms') {
      this.setState({ armsData: matchData.data, armsBol: true })
    } else if (organization === 'graana') {
      this.setState({ graanaData: matchData.data, graanaBol: true })
    } else {
      this.setState({ agency21Data: matchData.data, agency21Bol: true })
    }
  }

  handleApiData = () => {
    const { organization, armsData, graanaData, agency21Data } = this.state
    if (organization === 'arms') {
      this.setState({
        matchData: {
          type: organization,
          data: armsData,
        },
        loading: false,
      })
    } else if (organization === 'graana') {
      this.setState({
        matchData: {
          type: organization,
          data: graanaData,
        },
        loading: false,
      })
    } else {
      this.setState({
        matchData: {
          type: organization,
          data: agency21Data,
        },
        loading: false,
      })
    }
  }

  navigateTo = () => {
    const { route } = this.props
    const { client } = route.params
    this.props.navigation.navigate('AddClient', { client: client, update: true })
  }

  ownProperty = (property) => {
    const { user } = this.props
    const { organization } = this.state
    if (organization === 'arms') {
      if (property.assigned_to_armsuser_id) {
        return user.id === property.assigned_to_armsuser_id
      } else {
        return false
      }
    } else return true
  }

  displayChecks = () => {
    const { showCheckBoxes } = this.state
    const { lead, user, permissions } = this.props
    const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(user, lead, permissions)
    if (leadAssignedSharedStatus) {
      if (showCheckBoxes) {
        this.unSelectAll()
      } else {
        this.setState({
          armsBol: false,
          graanaBol: false,
          agency21Bol: false,
        })
      }
      this.setState({ showCheckBoxes: !showCheckBoxes })
    }
  }

  addProperty = (property) => {
    const { showCheckBoxes, matchData, selectedProperties, organization } = this.state
    const { user, lead, permissions } = this.props
    const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(user, lead, permissions)
    if (leadAssignedSharedStatus) {
      if (showCheckBoxes) {
        if (showCheckBoxes) this.changeComBool()
        let properties = matchData.data.map((item) => {
          if (item.id === property.id) {
            item.checkBox = !item.checkBox
            if (item.checkBox) {
              this.setState((prevState) => ({
                selectedProperties: [...prevState.selectedProperties, item],
              }))
            } else {
              let propValues = selectedProperties.filter((value) => {
                if (value.id === item.id) {
                  return false
                } else {
                  return true
                }
              })
              this.setState({ selectedProperties: [...propValues] })
            }
            return item
          } else {
            return item
          }
        })
        let checkCount = _.countBy(properties, function (num) {
          return num.checkBox ? true : false
        })
        if (checkCount.true) {
          this.setState({
            matchData: {
              type: organization,
              data: properties,
            },
            checkCount: checkCount,
            checkAllBoolean: true,
            displayButton: true,
          })
        } else {
          this.setState({
            matchData: {
              type: organization,
              data: properties,
            },
            checkCount: checkCount,
            checkAllBoolean: false,
            displayButton: false,
          })
        }
      } else {
        this.redirectProperty(property)
      }
    }
  }

  redirectProperty = (property) => {
    const { organization } = this.state
    if (organization === 'arms') {
      if (this.ownProperty(property))
        this.props.navigation.navigate('PropertyDetail', { property: property, update: true })
      else helper.warningToast(`You cannot view other agent's property details!`)
    } else {
      let url = `${config.graanaUrl}/property/${property.id}`
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) helper.errorToast(`No application available open this Url`)
          else return Linking.openURL(url)
        })
        .catch((err) => console.error('An error occurred', err))
    }
  }

  unSelectAll = () => {
    const { matchData, checkAllBoolean, showCheckBoxes, organization, selectedProperties } =
      this.state
    if (showCheckBoxes) {
      let properties = matchData.data.map((item) => {
        item.checkBox = false
        return item
      })
      let checkCount = _.countBy(properties, function (num) {
        return num.checkBox ? true : false
      })
      if (checkAllBoolean) {
        this.setState({
          matchData: {
            type: organization,
            data: properties,
          },
          selectedProperties: [],
          checkCount: checkCount,
          checkAllBoolean: false,
          showCheckBoxes: false,
          displayButton: false,
        })
      }
    }
  }

  closedLead = () => {
    helper.leadClosedToast()
  }

  fetchLegalPaymentInfo = () => {
    this.setState({ loading: true }, () => {
      axios.get(`/api/leads/legalPayment`).then((res) => {
        this.setState({
          legalServicesFee: res.data,
        })
      })
    })
  }

  closeLead = async (lead) => {
    const { legalServicesFee } = this.state
    if (lead.commissions.length) {
      let legalDocResp = await this.getLegalDocumentsCount()
      if (helper.checkClearedStatuses(lead, legalDocResp, legalServicesFee)) {
        this.setState({
          closedWon: true,
        })
      }
    }
  }

  getLegalDocumentsCount = async () => {
    const { lead } = this.props
    this.setState({ legalDocLoader: true })
    try {
      let res = await axios.get(`api/legal/document/count?leadId=${lead.id}`)
      return res.data
    } catch (error) {
      console.log(`ERROR: api/legal/document/count?leadId=${lead.id}`, error)
    }
  }

  onHandleCloseLead = () => {
    const { navigation, lead } = this.props
    let payload = Object.create({})
    payload.reasons = 'payment_done'
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads`, payload, { params: { id: leadId } })
      .then((response) => {
        this.setState({ isVisible: false }, () => {
          helper.successToast(`Lead Closed`)
          navigation.navigate('Leads')
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  handleReasonChange = (value) => {
    this.setState({ selectedReason: value })
  }

  closeModal = () => {
    this.setState({ isVisible: false })
  }

  sendProperties = () => {
    const { selectedProperties } = this.state
    const { lead } = this.props
    axios
      .post(`/api/leads/${lead.id}/shortlist`, selectedProperties)
      .then((res) => {
        this.unSelectAll()
        this.props.navigation.navigate('Viewing', { lead: lead })
      })
      .catch((error) => {
        console.log(error)
        helper.errorToast('ERROR: SHORTLISTING PROPERTIES!')
      })
  }

  goToDiaryForm = () => {
    const { navigation, lead, user } = this.props
    navigation.navigate('AddDiary', {
      update: false,
      rcmLeadId: lead.id,
      agentId: user.id,
      screenName: 'Diary',
    })
  }

  goToAttachments = (purpose) => {
    const { navigation, lead } = this.props
    navigation.navigate('LeadAttachments', {
      rcmLeadId: lead.id,
      workflow: 'rcm',
      purpose: purpose,
    })
  }

  goToComments = () => {
    const { navigation, lead } = this.props
    navigation.navigate('Comments', { rcmLeadId: lead.id })
  }

  navigateToDetails = () => {
    this.props.navigation.navigate('LeadDetail', {
      lead: this.props.lead,
      purposeTab: 'property',
      isFromLeadWorkflow: true,
      fromScreen: 'match',
    })
  }

  _onStateChange = ({ open }) => this.setState({ open })

  goToHistory = () => {
    const { callModal } = this.state
    this.setState({ callModal: !callModal })
  }

  getCallHistory = () => {
    const { lead } = this.props
    axios.get(`/api/leads/tasks?rcmLeadId=${lead.id}`).then((res) => {
      this.setState({ meetings: res.data })
    })
  }

  onModalPriceDonePressed = (minValue, maxValue) => {
    const { formData } = this.state
    const copyObject = { ...formData }
    copyObject.minPrice = minValue
    copyObject.maxPrice = maxValue
    this.setState({ formData: copyObject })
  }

  onBedBathModalDonePressed = (minValue, maxValue, modalType) => {
    const { formData } = this.state
    const copyObject = { ...formData }
    switch (modalType) {
      case 'bed':
        copyObject.bed = minValue
        copyObject.maxBed = maxValue
        this.setState({ formData: copyObject })
        break
      case 'bath':
        copyObject.bath = minValue
        copyObject.maxBath = maxValue
        this.setState({ formData: copyObject })
      default:
        break
    }
  }

  onModalSizeDonePressed = (minValue, maxValue, unit) => {
    const { formData } = this.state
    const copyObject = { ...formData }
    copyObject.size = minValue
    copyObject.maxSize = maxValue
    copyObject.sizeUnit = unit
    this.setState({ formData: copyObject })
  }

  closeMeetingFollowupModal = () => {
    this.setState({
      active: !this.state.active,
      isFollowUpMode: false,
    })
  }

  //  ************ Function for open Follow up modal ************
  openModalInFollowupMode = (value) => {
    const { navigation, lead } = this.props

    navigation.navigate('ScheduledTasks', {
      taskType: 'follow_up',
      lead,
      rcmLeadId: lead ? lead.id : null,
    })
    // this.setState({
    //   active: !this.state.active,
    //   isFollowUpMode: true,
    //   comment: value,
    // })
  }

  // ************ Function for Reject modal ************
  goToRejectForm = () => {
    const { statusfeedbackModalVisible } = this.state
    this.setState({
      statusfeedbackModalVisible: !statusfeedbackModalVisible,
      modalMode: 'reject',
    })
  }

  rejectLead = (body) => {
    const { navigation, lead } = this.props
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads`, body, { params: { id: leadId } })
      .then((res) => {
        helper.successToast(`Lead Closed`)
        navigation.navigate('Leads')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  showStatusFeedbackModal = (value, modalMode) => {
    this.setState({ statusfeedbackModalVisible: value, modalMode })
  }

  goToViewingScreen = () => {
    const { navigation } = this.props
    navigation.navigate('RCMLeadTabs', { screen: 'Viewing' })
  }

  setNewActionModal = (value) => {
    this.setState({ newActionModal: value })
  }

  render() {
    const { lead, user, navigation, permissions } = this.props
    const {
      meetings,
      callModal,
      sizeUnitList,
      selectedCity,
      subTypVal,
      areas,
      cities,
      progressValue,
      organization,
      loading,
      matchData,
      selectedProperties,
      showFilter,
      formData,
      displayButton,
      reasons,
      selectedReason,
      isVisible,
      checkReasonValidation,
      closedLeadEdit,
      legalDocLoader,
      active,
      statusfeedbackModalVisible,
      isFollowUpMode,
      modalMode,
      closedWon,
      newActionModal,
      shortListedProperties,
    } = this.state
    const showMenuItem = helper.checkAssignedSharedStatus(user, lead, permissions)
    return !loading ? (
      <View
        style={[
          AppStyles.container,
          { backgroundColor: AppStyles.colors.backgroundColor, paddingLeft: 0, paddingRight: 0 },
        ]}
      >
        <StyleProvider style={getTheme(CheckBoxTheme)}>
          <View style={AppStyles.mb1}>
            <ProgressBar
              style={{ backgroundColor: 'ffffff' }}
              progress={progressValue}
              color={'#0277FD'}
            />
            <View style={{ minHeight: '85%' }}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={organization === 'graana' ? styles.labelBtn : styles.unselectedLabelBtn}
                  onPress={() => {
                    this.selectedOrganization('graana')
                  }}
                >
                  <Text
                    style={[
                      organization === 'graana' ? styles.tokenLabelBlue : styles.tokenLabel,
                      AppStyles.mrFive,
                    ]}
                  >
                    {' '}
                    Graana DU{' '}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={organization === 'arms' ? styles.labelBtn : styles.unselectedLabelBtn}
                  onPress={() => {
                    this.selectedOrganization('arms')
                  }}
                >
                  <Text
                    style={[
                      organization === 'arms' ? styles.tokenLabelBlue : styles.tokenLabel,
                      AppStyles.mrFive,
                    ]}
                  >
                    {' '}
                    ARMS{' '}
                  </Text>
                </TouchableOpacity>
              </View>
              <HistoryModal
                getCallHistory={this.getCallHistory}
                navigation={navigation}
                data={meetings}
                closePopup={this.goToHistory}
                openPopup={callModal}
              />
              <FilterModal
                lead={lead}
                sizeUnitList={sizeUnitList}
                onRef={(ref) => (this.filterModalRef = ref)}
                selectedCity={selectedCity}
                onSizeUnitSliderValueChange={this.onSizeUnitSliderValueChange}
                onSliderValueChange={this.onSliderValueChange}
                getAreas={this.getAreas}
                subTypVal={subTypVal}
                handleForm={this.handleForm}
                areas={_.clone(areas)}
                cities={cities}
                resetFilter={this.resetFilter}
                formData={_.clone(formData)}
                openPopup={showFilter}
                getSubType={this.getSubType}
                filterModal={this.filterModal}
                onModalPriceDonePressed={(minValue, maxValue) =>
                  this.onModalPriceDonePressed(minValue, maxValue)
                }
                onBedBathModalDonePressed={(minValue, maxValue, modalType) =>
                  this.onBedBathModalDonePressed(minValue, maxValue, modalType)
                }
                onModalSizeDonePressed={(minValue, maxValue, unit) =>
                  this.onModalSizeDonePressed(minValue, maxValue, unit)
                }
                submitFilter={this.submitFilter}
              />
              <View style={styles.checkBoxView}>
                <View style={{ justifyContent: 'center', marginRight: 5 }}>
                  <Text style={{ fontFamily: AppStyles.fonts.defaultFont, fontSize: 16 }}>
                    {selectedProperties.length}{' '}
                    <Text style={{ fontFamily: AppStyles.fonts.lightFont, fontSize: 14 }}>
                      Selected
                    </Text>
                  </Text>
                </View>
                <View
                  style={{
                    borderLeftWidth: 1,
                    height: heightPercentageToDP('1.5%'),
                    marginTop: 5,
                    justifyContent: 'center',
                  }}
                />
                <View style={{ justifyContent: 'center' }}>
                  <Text style={{ fontFamily: AppStyles.fonts.defaultFont, fontSize: 16 }}>
                    {' '}
                    {matchData.data.length}{' '}
                    <Text style={{ fontFamily: AppStyles.fonts.lightFont, fontSize: 14 }}>
                      Matched
                    </Text>
                  </Text>
                </View>
                <View style={{ position: 'absolute', right: 15, alignSelf: 'center' }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.filterModal()
                    }}
                  >
                    <Image
                      source={require('../../../assets/img/filter.png')}
                      style={{
                        width: 25,
                        height: 25,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {matchData.data.length ? (
                <FlatList
                  data={matchData.data}
                  renderItem={(item, index) => (
                    <View style={{ marginVertical: 2, marginHorizontal: 8 }}>
                      {this.ownProperty(item.item) ? (
                        <MatchTile
                          data={_.clone(item.item)}
                          user={user}
                          displayChecks={this.displayChecks}
                          showCheckBoxes={true}
                          addProperty={this.addProperty}
                          organization={matchData.type}
                          isMenuVisible={showMenuItem}
                          screen={'match'}
                        />
                      ) : (
                        <AgentTile
                          data={_.clone(item.item)}
                          user={user}
                          displayChecks={this.displayChecks}
                          showCheckBoxes={true}
                          addProperty={this.addProperty}
                          organization={matchData.type}
                          isMenuVisible={showMenuItem}
                          screen={'match'}
                        />
                      )}
                    </View>
                  )}
                  keyExtractor={(item, index) => item.id.toString()}
                />
              ) : (
                <Image
                  source={require('../../../assets/img/no-result-found.png')}
                  resizeMode={'center'}
                  style={{ flex: 1, alignSelf: 'center', width: 300, height: 300 }}
                />
              )}
            </View>
            {displayButton ? (
              <TouchableOpacity
                onPress={() => this.sendProperties()}
                style={{
                  height: 50,
                  alignSelf: 'center',
                  marginBottom: 20,
                  width: '90%',
                  opacity: 1,
                  backgroundColor: AppStyles.colors.primaryColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 5,
                  position: 'absolute',
                  bottom: 70,
                }}
              >
                <Text
                  style={{ color: 'white', fontFamily: AppStyles.fonts.semiBoldFont, fontSize: 16 }}
                >
                  Book Viewing
                </Text>
              </TouchableOpacity>
            ) : null}

            <StatusFeedbackModal
              visible={statusfeedbackModalVisible}
              showFeedbackModal={(value, modalMode) =>
                this.showStatusFeedbackModal(value, modalMode)
              }
              commentsList={
                modalMode === 'call'
                  ? StaticData.commentsFeedbackCall
                  : StaticData.leadClosedCommentsFeedback
              }
              modalMode={modalMode}
              rejectLead={(body) => this.rejectLead(body)}
              setNewActionModal={(value) => this.setNewActionModal(value)}
              leadType={'RCM'}
            />
            <SubmitFeedbackOptionsModal
              showModal={newActionModal}
              modalMode={modalMode}
              setShowModal={(value) => this.setNewActionModal(value)}
              performFollowUp={this.openModalInFollowupMode}
              performReject={this.goToRejectForm}
              call={this.callAgain}
              goToViewingScreen={this.goToViewingScreen}
              leadType={'RCM'}
            />
            <MeetingFollowupModal
              closeModal={() => this.closeMeetingFollowupModal()}
              active={active}
              isFollowUpMode={isFollowUpMode}
              lead={lead}
              leadType={'RCM'}
              getMeetingLead={this.getCallHistory}
            />
            <View style={AppStyles.mainCMBottomNav}>
              <CMBottomNav
                goToAttachments={this.goToAttachments}
                navigateTo={this.navigateToDetails}
                goToDiaryForm={this.goToDiaryForm}
                goToComments={this.goToComments}
                alreadyClosedLead={() => this.closedLead()}
                closeLead={this.closeLead}
                closedLeadEdit={closedLeadEdit}
                callButton={true}
                customer={lead.customer}
                lead={lead}
                goToHistory={this.goToHistory}
                getCallHistory={this.getCallHistory}
                goToFollowUp={(value) => this.openModalInFollowupMode(value)}
                navigation={navigation}
                goToRejectForm={this.goToRejectForm}
                showStatusFeedbackModal={(value, modalMode) =>
                  this.showStatusFeedbackModal(value, modalMode)
                }
                leadType={'RCM'}
                closedWon={closedWon}
                onHandleCloseLead={this.onHandleCloseLead}
              />
            </View>
            <LeadRCMPaymentPopup
              reasons={reasons}
              selectedReason={selectedReason}
              changeReason={(value) => this.handleReasonChange(value)}
              checkValidation={checkReasonValidation}
              isVisible={isVisible}
              closeModal={() => this.closeModal()}
              onPress={() => this.onHandleCloseLead()}
              legalDocLoader={legalDocLoader}
            />
          </View>
        </StyleProvider>
      </View>
    ) : (
      <Loader loading={loading} />
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(PropertyMatch)
