/** @format */

import axios from 'axios'
import * as Location from 'expo-location'
import moment from 'moment'
import * as React from 'react'
import { FlatList, Image, Linking, Text, TouchableOpacity, View } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { connect } from 'react-redux'
import _ from 'underscore'
import { setlead } from '../../actions/lead'
import AppStyles from '../../AppStyles'
import AddViewing from '../../components/AddViewing/index'
import CheckListModal from '../../components/CheckListModal'
import GeoTaggingModal from '../../components/GeotaggingModal'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import Loader from '../../components/loader'
import HistoryModal from '../../components/HistoryModal/index'
import MeetingFollowupModal from '../../components/MeetingFollowupModal'
import PropAgentTile from '../../components/PropAgentTile/index'
import PropertyBottomNav from '../../components/PropertyBottomNav'
import PropMatchTile from '../../components/PropMatchTile/index'
import ViewCheckListModal from '../../components/ViewCheckListModal'
import config from '../../config'
import helper from '../../helper'
import TimerNotification from '../../LocalNotifications'
import StaticData from '../../StaticData'
import styles from './style'
import {
  alltimeSlots,
  getTimeShifts,
  setSlotDiaryData,
  setTimeSlots,
} from '../../actions/slotManagement'

class PropertyViewing extends React.Component {
  constructor(props) {
    super(props)
    const { user, lead, permissions, shortlistedData } = this.props
    this.state = {
      isVisible: false,
      open: false,
      loading: true,
      addLoading: false,
      viewing: {
        date: '',
        time: '',
      },
      checkValidation: false,
      currentProperty: {},
      progressValue: 0,
      menuShow: false,
      updateViewing: false,
      isMenuVisible: true,
      // for the lead close dialog
      isCloseLeadVisible: false,
      checkReasonValidation: false,
      organization: 'arms',
      selectedReason: '',
      reasons: [],
      closedLeadEdit: helper.propertyCheckAssignedSharedStatus(
        user,
        lead,
        permissions,
        shortlistedData
      ),
      callModal: false,
      meetings: [],
      matchData: [],
      isCheckListModalVisible: false,
      selectedCheckList: [],
      userFeedback: null,
      viewCheckListModal: false,
      selectedViewingData: null,
      isGeoTaggingModalVisible: false,
      locate_manually: false,
      latitude: null,
      longitude: null,
      propsure_id: null,
      selectedPropertyId: null,
      active: false,
      isFollowUpMode: false,
    }
  }

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (
        this.props.route.params &&
        this.props.route.params.fromScreen === 'mapContainer' &&
        this.props.route.params.mapValues
      ) {
        const { mapValues } = this.props.route.params
        this.setState({
          isGeoTaggingModalVisible: true,
          latitude: mapValues.lat,
          longitude: mapValues.lng,
          propsure_id: mapValues.propsure_id,
        })
      } else {
        this.fetchLead()
        this.fetchProperties()
      }
    })
  }

  fetchProperties = () => {
    const { lead } = this.props
    const { rcmProgressBar } = StaticData
    let matches = []
    axios
      .get(`/api/leads/${lead.id}/shortlist`)
      .then((res) => {
        matches = helper.propertyIdCheck(res.data.rows)
        this.setState({
          loading: false,
          matchData: matches,
          progressValue: rcmProgressBar[lead.status],
        })
      })
      .catch((error) => {
        console.log(error)
        this.setState({
          loading: false,
        })
      })
  }
  getCallHistory = () => {
    const { lead } = this.props
    axios.get(`/api/leads/tasks?rcmLeadId=${lead.id}`).then((res) => {
      this.setState({ meetings: res.data })
    })
  }

  fetchLead = () => {
    const { lead } = this.props
    axios
      .get(`api/leads/byid?id=${lead.id}`)
      .then((res) => {
        this.props.dispatch(setlead(res.data))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  openModal = () => {
    const { isVisible } = this.state
    this.setState({
      isVisible: !isVisible,
    })
  }

  displayChecks = () => {}

  ownProperty = (property) => {
    const { user } = this.props
    const { organization } = this.state
    if (property.arms_id) {
      if (property.assigned_to_armsuser_id) {
        return user.id === property.assigned_to_armsuser_id
      } else {
        return false
      }
    } else {
      return true
    }
  }

  closedLead = () => {
    // helper.leadClosedToast()
  }

  closeLead = () => {
    console.log('hello')
    const { lead } = this.props
    if (lead.commissions && lead.commissions.status === StaticData.leadClearedStatus) {
      this.setState({
        reasons: StaticData.leadCloseReasonsWithPayment,
        isCloseLeadVisible: true,
        checkReasonValidation: '',
      })
    } else {
      this.setState({
        reasons: StaticData.leadCloseReasons,
        isCloseLeadVisible: true,
        checkReasonValidation: '',
      })
    }
  }

  onHandleCloseLead = () => {
    const { navigation, lead } = this.props
    const { selectedReason } = this.state
    let payload = Object.create({})
    payload.reasons = selectedReason
    if (selectedReason !== '') {
      var leadId = []
      leadId.push(lead.id)
      axios
        .patch(`/api/leads`, payload, { params: { id: leadId } })
        .then((response) => {
          this.setState({ isCloseLeadVisible: false }, () => {
            helper.successToast(`Lead Closed`)
            navigation.navigate('Leads')
          })
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      alert('Please select a reason for lead closure!')
    }
  }

  handleReasonChange = (value) => {
    this.setState({ selectedReason: value })
  }

  closeModal = () => {
    this.setState({ isCloseLeadVisible: false })
  }

  goToDiaryForm = () => {
    const { lead, navigation, user } = this.props
    navigation.navigate('AddDiary', {
      update: false,
      agentId: user.id,
      rcmLeadId: lead.id,
      addedBy: 'self',
      screenName: 'Diary',
    })
  }

  goToAttachments = (purpose) => {
    const { lead, navigation } = this.props
    navigation.navigate('LeadAttachments', {
      rcmLeadId: lead.id,
      workflow: 'rcm',
      purpose: purpose,
    })
  }

  goToComments = () => {
    const { lead, navigation } = this.props
    navigation.navigate('Comments', { rcmLeadId: lead.id })
  }

  setProperty = (property) => {
    const { viewing } = this.state
    viewing['date'] = ''
    viewing['time'] = ''
    this.setState({ currentProperty: property, updateViewing: false })
  }

  updateProperty = (property) => {
    if (property.diaries.length) {
      if (property.diaries[0].status === 'pending') {
        let diary = property.diaries[0]
        let date = moment(diary.date)
        this.setState({
          currentProperty: property,
          viewing: {
            date: date,
            time: diary.start,
          },
          updateViewing: true,
        })
      }
    }
  }

  handleForm = (value, name) => {
    const { viewing } = this.state
    viewing[name] = value
    this.setState({ viewing })
  }

  submitViewing = () => {
    const { viewing, updateViewing } = this.state
    if (!viewing.time || !viewing.date) {
      this.setState({
        checkValidation: true,
      })
    } else {
      this.setState({ addLoading: true })
      if (updateViewing) this.updateViewing()
      else this.createViewing()
    }
  }

  updateViewing = () => {
    const { viewing, currentProperty } = this.state
    const { lead } = this.props
    if (currentProperty.diaries.length) {
      let diary = currentProperty.diaries[0]
      let start = helper.formatDateAndTime(helper.formatDate(viewing.date), viewing.time)
      let end = moment(start).add(1, 'hours').format('YYYY-MM-DDTHH:mm:ssZ')
      let body = {
        date: start,
        time: start,
        start: start,
        end: end,
        subject: diary.subject,
        taskCategory: 'leadTask',
      }
      axios
        .patch(`/api/diary/update?id=${diary.id}`, body)
        .then((res) => {
          this.setState({
            isVisible: false,
            loading: true,
          })
          let start = new Date(res.data.start)
          let end = new Date(res.data.end)
          let data = {
            id: res.data.id,
            title: res.data.subject,
            body: moment(start).format('hh:mm') + ' - ' + moment(end).format('hh:mm'),
          }
          helper.deleteAndUpdateNotification(data, start, res.data.id)
          this.fetchLead()
          this.fetchProperties()
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.setState({ addLoading: false })
        })
    }
  }

  createViewing = () => {
    const { viewing, currentProperty } = this.state
    const { lead } = this.props
    let customer =
      (lead.customer &&
        lead.customer.customerName &&
        helper.capitalize(lead.customer.customerName)) ||
      ''
    let areaName =
      (currentProperty.area && currentProperty.area.name && currentProperty.area.name) || ''
    let customerId = lead.customer && lead.customer.id
    let start = helper.formatDateAndTime(helper.formatDate(viewing.date), viewing.time)
    let end = moment(start).add(1, 'hours').format('YYYY-MM-DDTHH:mm:ssZ')
    let body = {
      date: start,
      time: start,
      start: start,
      end: end,
      propertyId: currentProperty.id,
      leadId: lead.id,
      subject: 'Viewing with ' + customer + ' at ' + areaName,
      taskCategory: 'leadTask',
      customerId: customerId,
    }
    axios
      .post(`/api/leads/viewing`, body)
      .then((res) => {
        this.setState({
          isVisible: false,
          loading: true,
        })
        let start = new Date(res.data.start)
        let end = new Date(res.data.end)
        let data = {
          id: res.data.id,
          title: res.data.subject,
          body: moment(start).format('hh:mm A') + ' - ' + moment(end).format('hh:mm A'),
        }
      //  TimerNotification(data, start)
        this.fetchLead()
        this.fetchProperties()
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.setState({ addLoading: false })
      })
  }

  toggleCheckListModal = (toggleState, data) => {
    this.setState({
      isCheckListModalVisible: toggleState,
      currentProperty: data ? data : null,
      selectedCheckList: [],
      userFeedback: null,
    })
  }

  goToTimeSlots = (property) => {
    const { lead, navigation, user, dispatch, permissions } = this.props
    dispatch(alltimeSlots())
    dispatch(setTimeSlots())

    if (helper.getAiraPermission(permissions) && lead) {
      dispatch(getTimeShifts(lead.armsuser.id))
      dispatch(setSlotDiaryData(_today, lead.armsuser.id))
    } else {
      dispatch(getTimeShifts())
      dispatch(setSlotDiaryData(_today))
    }

    let customer =
      (lead.customer &&
        lead.customer.customerName &&
        helper.capitalize(lead.customer.customerName)) ||
      ''
    let copyObj = {}
    let customerId = lead.customer && lead.customer.id ? lead.customer.id : null
    let areaName = (property.area && property.area.name && property.area.name) || ''
    copyObj.status = 'pending'
    copyObj.taskCategory = 'leadTask'
    copyObj.userId = helper.getAiraPermission(permissions) && lead ? lead.armsuser.id : user.id
    copyObj.taskType = 'viewing'
    copyObj.leadId = lead && lead.id ? lead.id : null
    copyObj.customerId = customerId
    copyObj.subject = 'Viewing with ' + customer + ' at ' + areaName
    copyObj.propertyId = property && property.id ? property.id : null
    navigation.navigate('TimeSlotManagement', {
      data: copyObj,
      taskType: 'viewing',
      isBookViewing: true,
    })
  }

  updateTimeSlots = (property) => {
    const { lead, navigation, user, dispatch, permissions } = this.props
    dispatch(alltimeSlots())
    dispatch(setTimeSlots())

    if (helper.getAiraPermission(permissions) && lead) {
      dispatch(getTimeShifts(lead.armsuser.id))
      dispatch(setSlotDiaryData(_today, lead.armsuser.id))
    } else {
      dispatch(getTimeShifts())
      dispatch(setSlotDiaryData(_today))
    }

    let diary = property.diaries[0]
    let customer =
      (lead.customer &&
        lead.customer.customerName &&
        helper.capitalize(lead.customer.customerName)) ||
      ''
    let copyObj = {}
    let customerId = lead.customer && lead.customer.id ? lead.customer.id : null
    let areaName = (property.area && property.area.name && property.area.name) || ''
    copyObj.status = 'pending'
    copyObj.id = diary.id
    copyObj.taskCategory = 'leadTask'
    copyObj.userId = helper.getAiraPermission(permissions) && lead ? lead.armsuser.id : user.id
    copyObj.taskType = 'viewing'
    copyObj.leadId = lead && lead.id ? lead.id : null
    copyObj.customerId = customerId
    copyObj.subject = 'Viewing with ' + customer + ' at ' + areaName
    copyObj.propertyId = property && property.id ? property.id : null
    navigation.navigate('TimeSlotManagement', {
      data: copyObj,
      taskType: 'viewing',
      isBookViewing: true,
    })
  }

  checkStatus = (property) => {
    const { lead, user, permissions, shortlistedData } = this.props
    const leadAssignedSharedStatus = helper.propertyCheckAssignedSharedStatus(
      user,
      lead,
      permissions,
      shortlistedData
    )
    if (property.diaries.length) {
      let diaries = property.diaries
      let diary = _.find(diaries, (item) => user.id === item.userId)
      let viewingDone =
        diaries &&
        diaries.filter((item) => {
          return item.status === 'completed' && item.userId === user.id
        })
      let greaterOneViewing = viewingDone && viewingDone.length > 1
      if (diaries && diaries.length > 0) {
        return (
          <View>
            {diary && diary.status === 'pending' && (
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                  height: 30,
                  borderBottomEndRadius: 10,
                  borderBottomLeftRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (leadAssignedSharedStatus) {
                    // this.openModal()
                    // this.updateProperty(property)
                    this.updateTimeSlots(property)
                  }
                }}
              >
                <Text style={{ fontFamily: AppStyles.fonts.lightFont }}>
                  Viewing at{' '}
                  <Text
                    style={{
                      color: AppStyles.colors.primaryColor,
                      fontFamily: AppStyles.fonts.defaultFont,
                    }}
                  >
                    {moment(property.diaries[0].start).format('LLL')}
                  </Text>
                </Text>
              </TouchableOpacity>
            )}
            {viewingDone && viewingDone.length > 0 && (
              <TouchableOpacity
                style={{
                  backgroundColor: AppStyles.colors.primaryColor,
                  height: 30,
                  borderBottomEndRadius: 10,
                  borderBottomLeftRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
                onPress={() => this.simplifyViewingData(viewingDone)}
              >
                <Text style={{ color: 'white', fontFamily: AppStyles.fonts.defaultFont }}>
                  VIEWING{greaterOneViewing && 'S'} DONE
                </Text>
                {greaterOneViewing && (
                  <View style={styles.countView}>
                    <Text style={styles.countText}>{`${viewingDone.length}`}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        )
      }
    } else {
      return <View></View>
    }
  }

  simplifyViewingData = (data) => {
    let simpleData = [...data]
    simpleData = _.sortBy(simpleData, 'id')
    simpleData = simpleData.map((item, index) => {
      return {
        ...item,
        checkList: _.keys(JSON.parse(item.checkList)),
        isExpanded: data.length > 1 ? false : true,
        title: data.length > 1 ? `Details for Viewing 0${index + 1} ` : `Details for Viewing`,
      }
    })
    this.setState({ selectedViewingData: simpleData }, () => {
      this.toggleViewCheckList(true)
    })
  }

  toggleExpandable = (status, id) => {
    const { selectedViewingData } = this.state
    let copyViewingData = [...selectedViewingData]
    copyViewingData = copyViewingData.map((item) => {
      return item.id === id ? { ...item, isExpanded: status } : { ...item, isExpanded: false }
    })
    this.setState({ selectedViewingData: copyViewingData })
  }

  toggleViewCheckList = (value) => {
    this.setState({ viewCheckListModal: value })
  }

  bookAnotherViewing = (property) => {
    const { lead, user, permissions, shortlistedData } = this.props
    const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(
      user,
      lead,
      permissions,
      shortlistedData
    )
    if (leadAssignedSharedStatus) {
      // this.openModal()
      this.setProperty(property)
      this.goToTimeSlots(property)
    }
  }

  doneViewing = (property) => {
    const { user } = this.props
    const { selectedCheckList, userFeedback } = this.state
    if (property.diaries.length) {
      let diaries = property.diaries
      let diary = _.find(diaries, (item) => user.id === item.userId)
      if (
        diary.status === 'pending' &&
        selectedCheckList.length === StaticData.realEstateAgentsCheckList.length &&
        userFeedback !== '' &&
        userFeedback !== null
      ) {
        let checkList = {}
        selectedCheckList.map((item, index) => {
          checkList[item] = true
        })
        let stringifiedObj = JSON.stringify(checkList)
        let body = {
          status: 'completed',
          checkList: stringifiedObj,
          customer_feedback: userFeedback,
        }
        axios
          .patch(`/api/diary/update?id=${diary.id}`, body)
          .then((res) => {
            this.setState({ loading: true })
            this.toggleCheckListModal(false, null)
            this.fetchProperties()
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        alert('Please fill the checklist and user feedback to continue!')
      }
    }
  }

  cancelViewing = (property) => {
    const { lead } = this.props
    if (property.diaries.length) {
      if (property.diaries[0].status === 'pending') {
        axios
          .delete(
            `/api/diary/delete?id=${property.diaries[0].id}&propertyId=${property.id}&leadId=${lead.id}`
          )
          .then((res) => {
            this.setState({ loading: true })
            helper.deleteLocalNotification(property.diaries[0].id)
            this.fetchProperties()
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
  }

  deleteProperty = (property) => {
    axios
      .delete(`/api/leads/shortlisted?id=${property.id}`)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.message) {
            helper.errorToast(res.data.message)
          } else {
            this.setState({ loading: true })
            this.fetchProperties()
          }
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  navigateToDetails = () => {
    this.props.navigation.navigate('LeadDetail', {
      lead: this.props.lead,
      purposeTab: 'property',
      isFromLeadWorkflow: true,
      fromScreen: 'match',
    })
  }

  goToPropertyComments = (data) => {
    const { lead, navigation } = this.props
    this.toggleMenu(false, data.id)
    navigation.navigate('Comments', { propertyId: data.id, screenName: 'viewing', leadId: lead.id })
  }

  toggleMenu = (val, id) => {
    const { matchData } = this.state
    let newMatches = matchData.map((item) => {
      if (item.id === id) {
        item.checkBox = val
        return item
      } else return item
    })
    this.setState({ matchData: newMatches })
  }

  addProperty = (data) => {
    this.redirectProperty(data)
  }

  redirectProperty = (property) => {
    if (property.origin === 'arms' || property.origin === 'arms_lead') {
      if (this.ownProperty(property))
        this.props.navigation.navigate('PropertyDetail', {
          property: property,
          update: true,
          screen: 'LeadDetail',
        })
      else helper.warningToast(`You cannot view other agent's property details!`)
    } else {
      let url = `${config.graanaUrl}/property/${property.graana_id}`
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) helper.errorToast(`No application available open this Url`)
          else return Linking.openURL(url)
        })
        .catch((err) => console.error('An error occurred', err))
    }
  }

  handleCheckListSelection = (item) => {
    if (this.state.selectedCheckList.includes(item)) {
      let temp = this.state.selectedCheckList
      temp = _.without(temp, item)
      this.setState({ selectedCheckList: temp })
    } else {
      let temp = this.state.selectedCheckList
      temp.push(item)
      this.setState({ selectedCheckList: temp })
    }
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
    this.toggleMenu(false, data.id)
    this.setState({
      isGeoTaggingModalVisible: true,
      locate_manually: data.locate_manually,
      longitude: data.lng,
      latitude: data.lat,
      propsure_id: data.propsure_id,
      selectedPropertyId: data.id,
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
    const { lead, navigation } = this.props
    const { latitude, longitude, propsure_id, locate_manually, selectedPropertyId } = this.state
    if (latitude && longitude) {
      let url = `/api/inventory/updateshortListedPRoperties?id=${selectedPropertyId}&leadId=${lead.id}`
      let body = {
        lat: this.convertLongitudeLattitude(latitude),
        lng: this.convertLongitudeLattitude(longitude),
        locate_manually,
        propsure_id,
        geotagged_date: propsure_id ? new Date() : null,
      }
      axios
        .patch(url, body)
        .then((response) => {
          if (response.data) {
            this.hideGeoTaggingModal()
            this.fetchProperties()
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
        screenName: 'Viewing',
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

  closeMeetingFollowupModal = () => {
    this.setState({
      active: !this.state.active,
      isFollowUpMode: false,
    })
  }
  goToHistory = () => {
    const { callModal } = this.state
    this.setState({ callModal: !callModal })
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

  render() {
    const {
      menuShow,
      meetings,
      callModal,
      loading,
      matchData,
      isVisible,
      checkValidation,
      viewing,
      progressValue,
      updateViewing,
      isMenuVisible,
      reasons,
      selectedReason,
      isCloseLeadVisible,
      checkReasonValidation,
      closedLeadEdit,
      addLoading,
      isCheckListModalVisible,
      selectedCheckList,
      userFeedback,
      selectedViewingData,
      viewCheckListModal,
      isGeoTaggingModalVisible,
      locate_manually,
      latitude,
      longitude,
      propsure_id,
      active,
      isFollowUpMode,
    } = this.state
    const { lead, user, navigation } = this.props
    const showMenuItem = true

    return !loading ? (
      <View style={{ flex: 1 }}>
        <View>
          <ProgressBar
            style={{ backgroundColor: 'ffffff' }}
            progress={progressValue}
            color={'#0277FD'}
          />
        </View>

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
        <CheckListModal
          data={StaticData.realEstateAgentsCheckList}
          selectedCheckList={selectedCheckList}
          isVisible={isCheckListModalVisible}
          togglePopup={(val) => this.toggleCheckListModal(val)}
          setSelected={(item) => this.handleCheckListSelection(item)}
          userFeedback={userFeedback}
          setUserFeedback={(value) => this.setState({ userFeedback: value })}
          viewingDone={() => this.doneViewing(this.state.currentProperty)}
          loading={loading}
        />

        <ViewCheckListModal
          viewCheckList={viewCheckListModal}
          toggleViewCheckList={(value) => this.toggleViewCheckList(value)}
          selectedViewingData={selectedViewingData}
          toggleExpandable={(status, id) => this.toggleExpandable(status, id)}
        />
        <View
          style={[
            AppStyles.container,
            styles.container,
            { backgroundColor: AppStyles.colors.backgroundColor },
          ]}
        >
          <View style={{ paddingBottom: 100 }}>
            <AddViewing
              update={updateViewing}
              onPress={this.submitViewing}
              handleForm={this.handleForm}
              openModal={this.openModal}
              loading={addLoading}
              viewing={viewing}
              checkValidation={checkValidation}
              isVisible={isVisible}
            />
            {matchData.length !== 0 ? (
              <FlatList
                data={_.clone(matchData)}
                renderItem={(item, index) => (
                  <View style={{ marginVertical: 3 }}>
                    {this.ownProperty(item.item) ? (
                      <PropMatchTile
                        deleteProperty={this.deleteProperty}
                        cancelViewing={this.cancelViewing}
                        toggleCheckListModal={(toggleState, data) =>
                          this.toggleCheckListModal(toggleState, data)
                        }
                        isMenuVisible={isMenuVisible}
                        data={_.clone(item.item)}
                        user={user}
                        displayChecks={this.displayChecks}
                        showCheckBoxes={false}
                        addProperty={this.addProperty}
                        viewingMenu={true}
                        goToPropertyComments={this.goToPropertyComments}
                        toggleMenu={this.toggleMenu}
                        menuShow={menuShow}
                        screen={'viewing'}
                        propertyGeoTagging={this.propertyGeoTagging}
                      />
                    ) : (
                      <PropAgentTile
                        deleteProperty={this.deleteProperty}
                        cancelViewing={this.cancelViewing}
                        toggleCheckListModal={(toggleState, data) =>
                          this.toggleCheckListModal(toggleState, data)
                        }
                        isMenuVisible={isMenuVisible}
                        data={_.clone(item.item)}
                        user={user}
                        displayChecks={this.displayChecks}
                        showCheckBoxes={false}
                        addProperty={this.addProperty}
                        viewingMenu={true}
                        goToPropertyComments={this.goToPropertyComments}
                        menuShow={menuShow}
                        toggleMenu={this.toggleMenu}
                        screen={'viewing'}
                        propertyGeoTagging={this.propertyGeoTagging}
                      />
                    )}
                    <View>{this.checkStatus(item.item)}</View>
                  </View>
                )}
                keyExtractor={(item, index) => item.id.toString()}
              />
            ) : (
              <>
                <Image
                  source={require('../../../assets/img/no-result-found.png')}
                  resizeMode={'center'}
                  style={{ alignSelf: 'center', width: 300, height: 300 }}
                />
              </>
            )}
          </View>
        </View>
        <MeetingFollowupModal
          closeModal={() => this.closeMeetingFollowupModal()}
          active={active}
          isFollowUpMode={isFollowUpMode}
          lead={lead}
          leadType={'RCM'}
        />
        <HistoryModal
          getCallHistory={this.getCallHistory}
          navigation={navigation}
          data={meetings}
          closePopup={this.goToHistory}
          openPopup={callModal}
        />
        <View style={AppStyles.mainCMBottomNav}>
          <PropertyBottomNav
            goToAttachments={this.goToAttachments}
            navigateTo={this.navigateToDetails}
            goToDiaryForm={this.goToDiaryForm}
            goToComments={this.goToComments}
            //alreadyClosedLead={() => this.closedLead()}
            //closeLead={this.closeLead}
            //closedLeadEdit={closedLeadEdit}
            callButton={true}
            customer={lead.customer}
            lead={lead}
            goToHistory={this.goToHistory}
            goToFollowUp={(value) => this.openModalInFollowupMode(value)}
          />
        </View>
        <LeadRCMPaymentPopup
          reasons={reasons}
          selectedReason={selectedReason}
          changeReason={(value) => this.handleReasonChange(value)}
          checkValidation={checkReasonValidation}
          isVisible={isCloseLeadVisible}
          closeModal={() => this.closeModal()}
          onPress={() => this.onHandleCloseLead()}
        />
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
    shortlistedData: store.drawer.shortlistedData,
  }
}

export default connect(mapStateToProps)(PropertyViewing)
