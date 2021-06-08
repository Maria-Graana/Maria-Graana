/** @format */

import * as React from 'react'
import styles from './style'
import { View, Text, FlatList, Image, TouchableOpacity, Linking, Alert } from 'react-native'
import { connect } from 'react-redux'
import * as Location from 'expo-location'
import _ from 'underscore'
import AppStyles from '../../AppStyles'
import MatchTile from '../../components/MatchTile/index'
import AgentTile from '../../components/AgentTile/index'
import HistoryModal from '../../components/HistoryModal/index'
import axios from 'axios'
import Loader from '../../components/loader'
import AddViewing from '../../components/AddViewing/index'
import moment from 'moment'
import { ProgressBar } from 'react-native-paper'
import StaticData from '../../StaticData'
import { setlead } from '../../actions/lead'
import helper from '../../helper'
import TimerNotification from '../../LocalNotifications'
import CMBottomNav from '../../components/CMBottomNav'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import config from '../../config'
import CheckListModal from '../../components/CheckListModal'
import ViewCheckListModal from '../../components/ViewCheckListModal'
import GeoTaggingModal from '../../components/GeotaggingModal'
import StatusFeedbackModal from '../../components/StatusFeedbackModal'
import MeetingFollowupModal from '../../components/MeetingFollowupModal'

class LeadViewing extends React.Component {
  constructor(props) {
    super(props)
    const { user, lead } = this.props
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
      closedLeadEdit: helper.checkAssignedSharedStatus(user, lead),
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
      legalDocLoader: false,
      closedWon: false,
      statusfeedbackModalVisible: false,
      modalMode: 'call',
      currentCall: null,
      isFollowUpMode: false,
      comment: null,
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
        this.fetchLegalPaymentInfo()
        this.fetchLead()
        this.getCallHistory()
        this.fetchProperties()
      }
    })
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

  fetchProperties = () => {
    const { lead } = this.props
    const { rcmProgressBar } = StaticData
    let matches = []
    this.setState({ loading: true }, () => {
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
        .finally(() => {
          this.setState({
            loading: false,
          })
        })
    })
  }

  fetchLead = () => {
    const { lead } = this.props
    axios
      .get(`api/leads/byid?id=${lead.id}`)
      .then((res) => {
        this.props.dispatch(setlead(res.data))
        this.closeLead(res.data)
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
    helper.leadClosedToast()
  }

  closeLead = async (lead) => {
    const { legalServicesFee } = this.state
    if (lead.commissions.length) {
      let { count } = await this.getLegalDocumentsCount()
      if (helper.checkClearedStatuses(lead, count, legalServicesFee)) {
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
      let res = await axios.get(`api/leads/legalDocCount?leadId=${lead.id}`)
      return res.data
    } catch (error) {
      console.log(`ERROR: api/leads/legalDocCount?leadId=${lead.id}`, error)
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

  goToAttachments = () => {
    const { lead, navigation } = this.props
    navigation.navigate('LeadAttachments', { rcmLeadId: lead.id, workflow: 'rcm' })
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
          body: moment(start).format('hh:mm') + ' - ' + moment(end).format('hh:mm'),
        }
        TimerNotification(data, start)
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

  checkStatus = (property) => {
    const { lead, user } = this.props
    const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(user, lead)
    if (helper.checkMyDiary(property, user)) {
      let diaries = property.diaries
      let diary = _.find(diaries, (item) => user.id === item.userId && item.status === 'pending')
      let viewingDoneCount =
        diaries &&
        diaries.filter((item) => {
          return item.status === 'completed' && item.userId === user.id
        })
      let greaterOneViewing = viewingDoneCount && viewingDoneCount.length > 1
      if (diaries && diaries.length > 0) {
        return (
          <View>
            {diary && diary.status === 'pending' && (
              <TouchableOpacity
                style={styles.viewingAtBtn}
                onPress={() => {
                  if (leadAssignedSharedStatus) {
                    this.openModal()
                    this.updateProperty(property)
                  }
                }}
              >
                <Text style={styles.viewingAtText2}>
                  Viewing at{' '}
                  <Text style={styles.viewingAtText1}>{moment(diary.start).format('LLL')}</Text>
                </Text>
              </TouchableOpacity>
            )}
            {viewingDoneCount && viewingDoneCount.length > 0 && (
              <TouchableOpacity
                style={styles.viewingDoneBtn}
                onPress={() => this.simplifyViewingData(viewingDoneCount)}
              >
                <Text style={styles.viewDoneText}>VIEWING{greaterOneViewing && 'S'} DONE</Text>
                {greaterOneViewing && (
                  <View style={styles.countView}>
                    <Text style={styles.countText}>{`${viewingDoneCount.length}`}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            {/* } */}
          </View>
        )
      }
    } else {
      return (
        <TouchableOpacity
          style={styles.viewingBtn}
          onPress={() => {
            if (leadAssignedSharedStatus) {
              this.openModal()
              this.setProperty(property)
            }
          }}
        >
          <Text style={styles.viewingText}>BOOK VIEWING</Text>
        </TouchableOpacity>
      )
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
    const { lead, user } = this.props
    const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(user, lead)
    if (leadAssignedSharedStatus) {
      this.openModal()
      this.setProperty(property)
    }
  }

  doneViewing = (property) => {
    const { user } = this.props
    const { selectedCheckList, userFeedback } = this.state
    if (property.diaries.length) {
      let diaries = property.diaries
      let diary = _.find(diaries, (item) => user.id === item.userId && item.status === 'pending')
      if (
        diary.status === 'pending' &&
        selectedCheckList.length === StaticData.areaManagerCheckList.length &&
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
      purposeTab: this.props.lead.purpose,
      isFromLeadWorkflow: true,
      fromScreen: 'viewing',
    })
  }

  goToHistory = () => {
    const { callModal } = this.state
    this.setState({ callModal: !callModal })
  }

  getCallHistory = () => {
    const { lead } = this.props
    axios.get(`/api/diary/all?armsLeadId=${lead.id}`).then((res) => {
      this.setState({ meetings: res.data.rows })
    })
  }

  goToPropertyScreen = () => {
    const { lead, navigation } = this.props
    navigation.navigate('AddInventory', {
      lead: lead,
      screenName: 'leadViewing',
    })
  }

  goToPropertyComments = (data) => {
    const { lead, navigation } = this.props
    this.toggleMenu(false, data.id)
    navigation.navigate('Comments', {
      propertyId: data.id,
      screenName: 'viewing',
      leadId: lead.id,
    })
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
            this.getCallHistory()
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
    const { status } = await Location.requestPermissionsAsync()
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

  closeMeetingFollowupModal = () => {
    this.setState({
      active: !this.state.active,
      isFollowUpMode: false,
    })
  }

  //  ************ Function for open Follow up modal ************
  openModalInFollowupMode = (value) => {
    this.setState({
      active: !this.state.active,
      isFollowUpMode: true,
      comment: value,
    })
  }

  sendStatus = (status, id) => {
    const { lead } = this.props
    let body = {
      response: status,
      comments: status,
      leadId: lead.id,
    }
    axios.patch(`/api/diary/update?id=${id}`, body).then((res) => {})
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

  showStatusFeedbackModal = (value) => {
    this.setState({ statusfeedbackModalVisible: value })
  }

  setCurrentCall = (call) => {
    this.setState({ currentCall: call, modalMode: 'call' })
  }

  goToViewingScreen = () => {
    const { navigation } = this.props
    navigation.navigate('RCMLeadTabs', { screen: 'Viewing' })
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
      legalDocLoader,
      active,
      statusfeedbackModalVisible,
      modalMode,
      closedWon,
      currentCall,
      isFollowUpMode,
      comment,
    } = this.state
    const { lead, user, navigation } = this.props
    const showMenuItem = helper.checkAssignedSharedStatus(user, lead)

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
        <HistoryModal
          getCallHistory={this.getCallHistory}
          navigation={navigation}
          data={meetings}
          closePopup={this.goToHistory}
          openPopup={callModal}
        />
        <CheckListModal
          data={StaticData.areaManagerCheckList}
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
        <View
          style={[
            AppStyles.container,
            styles.container,
            { backgroundColor: AppStyles.colors.backgroundColor, paddingBottom: 65 },
          ]}
        >
          {matchData.length !== 0 ? (
            <FlatList
              data={_.clone(matchData)}
              renderItem={(item, index) => (
                <View style={{ marginVertical: 3 }}>
                  {this.ownProperty(item.item) ? (
                    <MatchTile
                      bookAnotherViewing={this.bookAnotherViewing}
                      deleteProperty={this.deleteProperty}
                      cancelViewing={this.cancelViewing}
                      toggleCheckListModal={(toggleState, data) =>
                        this.toggleCheckListModal(toggleState, data)
                      }
                      isMenuVisible={showMenuItem && isMenuVisible}
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
                  ) : (
                    <AgentTile
                      bookAnotherViewing={this.bookAnotherViewing}
                      deleteProperty={this.deleteProperty}
                      cancelViewing={this.cancelViewing}
                      toggleCheckListModal={(toggleState, data) =>
                        this.toggleCheckListModal(toggleState, data)
                      }
                      isMenuVisible={showMenuItem && isMenuVisible}
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
        <StatusFeedbackModal
          visible={statusfeedbackModalVisible}
          showFeedbackModal={(value) => this.showStatusFeedbackModal(value)}
          modalMode={modalMode}
          commentsList={
            modalMode === 'call'
              ? StaticData.commentsFeedbackCall
              : StaticData.leadClosedCommentsFeedback
          }
          showAction={modalMode === 'call'}
          showFollowup={modalMode === 'call'}
          rejectLead={(body) => this.rejectLead(body)}
          sendStatus={(comment, id) => this.sendStatus(comment, id)}
          addFollowup={(value) => this.openModalInFollowupMode(value)}
          leadType={'RCM'}
          currentCall={currentCall}
          goToViewingScreen={this.goToViewingScreen}
        />

        <MeetingFollowupModal
          closeModal={() => this.closeMeetingFollowupModal()}
          active={active}
          isFollowUpMode={isFollowUpMode}
          lead={lead}
          leadType={'RCM'}
          getMeetingLead={this.getCallHistory}
          comment={comment}
        />

        <StatusFeedbackModal
          visible={statusfeedbackModalVisible}
          showFeedbackModal={(value) => this.showStatusFeedbackModal(value)}
          modalMode={modalMode}
          commentsList={
            modalMode === 'call'
              ? StaticData.commentsFeedbackCall
              : StaticData.leadClosedCommentsFeedback
          }
          showAction={modalMode === 'call'}
          showFollowup={modalMode === 'call'}
          rejectLead={(body) => this.rejectLead(body)}
          sendStatus={(comment, id) => this.sendStatus(comment, id)}
          addFollowup={(value) => this.openModalInFollowupMode(value)}
          leadType={'RCM'}
          currentCall={currentCall}
          goToViewingScreen={this.goToViewingScreen}
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
            goToPropertyScreen={this.goToPropertyScreen}
            getCallHistory={this.getCallHistory}
            isFromViewingScreen={true}
            goToFollowUp={(value) => this.openModalInFollowupMode(value)}
            showStatusFeedbackModal={(value) => this.showStatusFeedbackModal(value)}
            setCurrentCall={(call) => this.setCurrentCall(call)}
            leadType={'RCM'}
            navigation={navigation}
            goToRejectForm={this.goToRejectForm}
            closedWon={closedWon}
            onHandleCloseLead={this.onHandleCloseLead}
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
          legalDocLoader={legalDocLoader}
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
  }
}

export default connect(mapStateToProps)(LeadViewing)
