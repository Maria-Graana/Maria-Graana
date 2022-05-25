/** @format */

import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import moment from 'moment'
import { ActionSheet, Fab } from 'native-base'
import { setLeadsDropdown } from '../../actions/leadsDropdown'
import React from 'react'
import {
  FlatList,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { FAB, TextInput } from 'react-native-paper'
import { connect } from 'react-redux'
import _ from 'underscore'
import SortImg from '../../../assets/img/sort.png'
import { setCallPayload } from '../../actions/callMeetingFeedback'
import { setlead } from '../../actions/lead'
import { getListingsCount } from '../../actions/listings'
import { getItem, storeItem } from '../../actions/user'
import AndroidNotifications from '../../AndroidNotifications'
import AppStyles from '../../AppStyles'
import DateSearchFilter from '../../components/DateSearchFilter'
import LeadTile from '../../components/LeadTile'
import LoadingNoResult from '../../components/LoadingNoResult'
import MeetingFollowupModal from '../../components/MeetingFollowupModal'
import MultiplePhoneOptionModal from '../../components/MultiplePhoneOptionModal'
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent'
import PickerComponent from '../../components/Picker/index'
import PPLeadTile from '../../components/PPLeadTile'
import Search from '../../components/Search'
import ShortlistedProperties from '../../components/ShortlistedProperties'
import SortModal from '../../components/SortModal'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import config from '../../config'
import helper from '../../helper'
import Ability from '../../hoc/Ability'
import StaticData from '../../StaticData'
import styles from './style'
import { callNumberFromLeads, callToAgent, setMultipleModalVisible } from '../../actions/diary'
import { alltimeSlots, setTimeSlots } from '../../actions/slotManagement'
import RBSheet from 'react-native-raw-bottom-sheet'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { getCountryCode } from '../../actions/country'
import FilterLeadsView from '../../components/FilterLeadsView'
import ListViewComponent from '../../components/ListViewComponent'
import TextFilterComponent from '../../components/TextFilterComponent'
import DateFilterComponent from '../../components/DateFilterComponent'

var BUTTONS = [
  'Assign to team member',
  'Share lead with other agent',
  'Create new Rent lead for this client',
  'Cancel',
]
var CANCEL_INDEX = 3

class RentLeads extends React.Component {
  constructor(props) {
    super(props)
    const { permissions } = this.props
    const { hasBooking = false } = this.props.route.params
    this.state = {
      phoneModelDataLoader: false,
      leadsData: [],
      statusFilter: '',
      open: false,
      sort: '',
      loading: false,
      activeSortModal: false,
      totalLeads: 0,
      page: 1,
      pageSize: 50,
      onEndReachedLoader: false,
      showSearchBar: false,
      searchText: '',
      showAssignToButton: false,
      shortListedProperties: [],
      openPopup: false,
      selectedLead: null,
      popupLoading: false,
      serverTime: null,
      isMultiPhoneModalVisible: false,
      statusFilterType: 'id',
      comment: null,
      fabActions: [],
      filterType: null,
      statusLead: null,
      sortLead: null,
      idLead: null,
      nameLead: null,
      dateLead: null,
      countryLead: null,
      emailLead: null,
      phoneLead: null,
      classificationLead: null,
      dateFromTo: null,
      countryFilter: null,
      classificationValues: null,
      activeDate: false,
      clear: false,
      createBuyRentLead: getPermissionValue(
        PermissionFeatures.BUY_RENT_LEADS,
        PermissionActions.CREATE,
        permissions
      ),
      createProjectLead: getPermissionValue(
        PermissionFeatures.PROJECT_LEADS,
        PermissionActions.CREATE,
        permissions
      ),
      pageType: hasBooking
        ? '&pageType=myDeals&hasBooking=true'
        : '&pageType=myLeads&hasBooking=false',
    }
  }

  componentDidMount() {
    const { hasBooking = false } = this.props.route.params
    const { dispatch, navigation, route } = this.props

    const { client } = route.params

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      dispatch(getListingsCount())
      dispatch(getCountryCode())
      this.getServerTime()
      this.onFocus()
    })

    this.setFabActions()
    dispatch(
      setLeadsDropdown(
        hasBooking ? '&pageType=myDeals&hasBooking=true' : '&pageType=myLeads&hasBooking=false'
      )
    )
  }

  componentWillUnmount() {
    this.clearStateValues()
    this.showMultiPhoneModal(false)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isMultiPhoneModalVisible !== prevProps.isMultiPhoneModalVisible) {
      this.showMultiPhoneModal(this.props.isMultiPhoneModalVisible)
    }
    if (this.props.leadsDropdown !== prevProps.leadsDropdown) {
      this.changePageType(this.props.leadsDropdown)
    }
  }

  getServerTime = () => {
    axios
      .get(`/api/user/serverTime?fullTime=true`)
      .then((res) => {
        if (res) {
          this.setState({ serverTime: res.data })
        } else {
          console.log('Something went wrong while getting server time')
        }
      })
      .catch((error) => {
        console.log('error getting server time', error)
      })
  }

  onFocus = async () => {
    const { hasBooking = false } = this.props.route.params // for Deals we need to set filter to closed won
    if (hasBooking) {
      const sortValue = await this.getSortOrderFromStorage()
      this.setState({ statusFilter: 'closed_won', sort: sortValue }, () => {
        this.fetchLeads()
      })
    } else {
      const sortValue = await this.getSortOrderFromStorage()
      const statusValue = await getItem('statusFilterRent')
      if (statusValue) {
        this.setState({ statusFilter: String(statusValue), sort: sortValue }, () => {
          this.fetchLeads()
        })
      } else {
        storeItem('statusFilterRent', 'open')
        this.setState({ statusFilter: 'open', sort: sortValue }, () => {
          this.fetchLeads()
        })
      }
    }
  }

  getSortOrderFromStorage = async () => {
    const sortOrder = await getItem('sortRent')
    if (sortOrder) {
      return String(sortOrder)
    } else {
      storeItem('sortRent', '&order=Desc&field=updatedAt')
      return '&order=Desc&field=updatedAt'
    }
  }

  clearStateValues = () => {
    this.setState({
      page: 1,
      totalLeads: 0,
      statusLead: null,
      sortLead: null,
      nameLead: null,
      idLead: null,
      dateLead: null,
      countryFilter: null,
      countryLead: null,
      emailLead: null,
      phoneLead: null,
      classificationLead: null,
      classificationValues: null,
    })
  }

  fetchLeads = (fromDate = null, toDate = null) => {
    const {
      sort,
      pageSize,
      page,
      leadsData,
      showSearchBar,
      searchText,
      statusFilter,
      statusFilterType,
      pageType,
      countryFilter,
      classificationValues,
    } = this.state
    const { permissions, user } = this.props
    this.setState({ loading: true })
    const { hasBooking, navFrom, client } = this.props.route.params
    let isAiraPermission = helper.getAiraPermission(permissions)
    let query = ``

    if (showSearchBar) {
      if (statusFilterType === 'name' && searchText !== '') {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads?purpose[]=rent&searchBy=name&clientName=${searchText}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads?purpose[]=rent&searchBy=name&clientName=${searchText}&pageSize=${pageSize}&page=${page}${pageType}`)
      } else if (statusFilterType === 'id' && searchText !== '') {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads?purpose[]=rent&id=${searchText}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads?purpose[]=rent&id=${searchText}&pageSize=${pageSize}&page=${page}${pageType}`)
      } else if (statusFilterType === 'phone' && searchText !== '') {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads?purpose[]=rent&phoneNo=${searchText}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads?purpose[]=rent&phoneNo=${searchText}&pageSize=${pageSize}&page=${page}${pageType}`)
      } else if (statusFilterType === 'email' && searchText !== '') {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads?purpose[]=rent&emailId=${searchText}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads?purpose[]=rent&emailId=${searchText}&pageSize=${pageSize}&page=${page}${pageType}`)
      } else {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads?purpose[]=rent&fromDate=${fromDate}&endDate=${toDate}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads?purpose[]=rent&fromDate=${fromDate}&endDate=${toDate}&pageSize=${pageSize}&page=${page}${pageType}`)
      }
    } else {
      if (statusFilter === 'shortlisting') {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads?purpose[]=rent&status[0]=offer&status[1]=viewing&status[2]=propsure&status=shortlisting&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads?purpose[]=rent&status[0]=offer&status[1]=viewing&status[2]=propsure&status=shortlisting&pageSize=${pageSize}&page=${page}${pageType}`)
      } else {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads?purpose[]=rent&status=${statusFilter}${sort}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads?purpose[]=rent&status=${statusFilter}${sort}&pageSize=${pageSize}&page=${page}${pageType}`)
      }
    }
    if (countryFilter) {
      query = `${query}&countryCode=${countryFilter}`
    }
    if (classificationValues) {
      query = `${query}&leadCategory[]=${classificationValues}`
    }
    if (isAiraPermission && user.armsUserRole && !user.armsUserRole.groupManger) {
      query = `${query}&aira=true`
    }
    if (client) {
      query = `${query}&customerId=${client.id}`
    }

    axios
      .get(`${query}`)
      .then((res) => {
        let leadNewData = helper.leadMenu(
          page === 1 ? res.data.rows : [...leadsData, ...res.data.rows]
        )
        if (leadNewData && navFrom) {
          leadNewData = leadNewData.filter(
            (item) => item.status !== 'closed_won' && item.status !== 'closed_lost'
          )
        }
        this.setState({
          leadsData: leadNewData,
          loading: false,
          onEndReachedLoader: false,
          totalLeads: res.data.count,
          statusFilter: statusFilter,
        })
      })
      .catch((res) => {
        this.setState({
          loading: false,
        })
      })
  }

  goToFormPage = (page, status, client, clientId) => {
    const { navigation } = this.props
    const copyClient = client ? { ...client } : null
    if (copyClient) {
      copyClient.id = clientId
    }
    navigation.navigate(page, {
      noEditableClient: copyClient ? true : false,
      pageName: status,
      client: copyClient,
      name:
        copyClient && copyClient.customerName
          ? copyClient.customerName
          : `${copyClient?.first_name} ${copyClient?.last_name}`,
      purpose: 'rent',
    })
  }

  sendStatus = (status, name) => {
    this.setState({ sortLead: name, sort: status, clear: true }, () => {
      storeItem('sortRent', status)
      this.fetchLeads()
    })
    this.RBSheet.close()
  }

  changeStatus = (status, name = null) => {
    this.clearStateValues()
    this.setState({ statusLead: name, statusFilter: status, leadsData: [], clear: true }, () => {
      storeItem('statusFilterRent', status)
      this.fetchLeads()
    })
    this.RBSheet.close()
  }

  changePageType = (value) => {
    this.clearStateValues()
    this.setState({ pageType: value, leadsData: [] }, () => {
      this.fetchLeads()
    })
  }

  searchCountry = (value, name) => {
    this.clearStateValues()
    this.setState({ countryLead: name, countryFilter: value, leadsData: [], clear: true }, () => {
      this.fetchLeads()
    })
    this.RBSheet.close()
  }

  setClassification = (value, name) => {
    this.clearStateValues()
    this.setState(
      { classificationLead: name, classificationValues: value, leadsData: [], clear: true },
      () => {
        this.fetchLeads()
      }
    )
    this.RBSheet.close()
  }

  navigateTo = (data) => {
    const { screen, navFrom } = this.props.route.params
    const { navigation } = this.props

    this.props.dispatch(setlead(data))

    if (navFrom) {
      navigation.navigate('AddDiary', {
        lead: data,
        rcmLeadId: data.id,
      })
    } else {
      this.props.navigation.navigate('LeadDetail', {
        lead: data,
        purposeTab: 'rent',
        screenName: screen,
      })
      // let page = ''
      // if (this.props.route.params?.screen === 'MyDeals') {
      //   this.props.navigation.navigate('LeadDetail', {
      //     lead: data,
      //     purposeTab: 'rent',
      //     screenName: screen,
      //   })
      // } else if (data.readAt === null) {
      //   this.props.navigation.navigate('LeadDetail', {
      //     lead: data,
      //     purposeTab: 'rent',
      //     screenName: screen,
      //   })
      // } else {
      //   if (data.status === 'open') {
      //     page = 'Match'
      //   }
      //   if (data.status === 'viewing') {
      //     page = 'Viewing'
      //   }
      //   if (data.status === 'offer') {
      //     page = 'Offer'
      //   }
      //   if (data.status === 'propsure') {
      //     page = 'Propsure'
      //   }
      //   if (data.status === 'payment') {
      //     page = 'Payment'
      //   }
      //   if (
      //     data.status === 'payment' ||
      //     data.status === 'closed_won' ||
      //     data.status === 'closed_lost'
      //   ) {
      //     page = 'Payment'
      //   }
      //   if (data && data.requiredProperties) {
      //     this.props.navigation.navigate('PropertyTabs', {
      //       screen: page,
      //       params: { lead: data },
      //     })
      //   } else {
      //     this.props.navigation.navigate('RCMLeadTabs', {
      //       screen: page,
      //       params: { lead: data },
      //     })
      //   }
      // }
    }
  }

  handleLongPress = (val) => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: 'Select an Option',
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          //Share
          this.navigateToShareScreen(val)
        } else if (buttonIndex === 2) {
          this.goToFormPage(
            'AddRCMLead',
            'RCM',
            val && val.customer ? val.customer : null,
            val.customer_id
          )
        } else if (buttonIndex === 0) {
          this.checkAssignedLead(val)
        }
      }
    )
  }

  navigateToShareScreen = (data) => {
    const { user } = this.props
    if (data) {
      if (
        data.status === StaticData.Constants.lead_closed_lost ||
        data.status === StaticData.Constants.lead_closed_won
      ) {
        helper.errorToast('Closed leads cannot be shared with other agents')
        return
      }
      if (user.id === data.assigned_to_armsuser_id) {
        if (data.shared_with_armsuser_id) {
          helper.errorToast('lead is already shared')
        } else {
          const { navigation } = this.props
          navigation.navigate('AssignLead', { leadId: data.id, type: 'Rent', screen: 'RentLeads' })
        }
      } else {
        helper.errorToast('Only the leads assigned to you can be shared')
      }
    } else {
      helper.errorToast('Something went wrong!')
    }
  }

  showMultiPhoneModal = (value) => {
    const { dispatch } = this.props
    dispatch(setMultipleModalVisible(value))
  }

  openStatus = () => {
    this.setState({ activeSortModal: !this.state.activeSortModal })
  }

  setKey = (index) => {
    return String(index)
  }

  clearAndCloseSearch = () => {
    this.setState({ searchText: '', showSearchBar: false }, () => {
      this.clearStateValues()
      this.fetchLeads()
    })
  }

  clearSearch = () => {
    this.setState({
      searchText: '',
      showSearchBar: false,
      statusFilterType: 'id',
      statusFilter: '',
    })
  }

  updateStatus = (data) => {
    var leadId = []
    leadId.push(data.id)
    if (data.status === 'open') {
      axios
        .patch(
          `/api/leads`,
          {
            status: 'called',
          },
          { params: { id: leadId } }
        )
        .then((res) => {
          this.fetchLeads()
        })
        .catch((error) => {
          console.log(`ERROR: /api/leads/?id=${data.id}`, error)
        })
    }
  }

  checkAssignedLead = (lead) => {
    const { user } = this.props
    // Show assign lead button only if loggedIn user is Sales level2 or CC/BC/RE Manager
    if (
      Ability.canView(user.subRole, 'AssignLead') &&
      lead.status !== StaticData.Constants.lead_closed_lost &&
      lead.status !== StaticData.Constants.lead_closed_won
    ) {
      // Lead can only be assigned to someone else if it is assigned to no one or to current user
      if (lead.assigned_to_armsuser_id === null || user.id === lead.assigned_to_armsuser_id) {
        this.setState({ showAssignToButton: true }, () => {
          this.navigateToAssignLead(lead)
        })
      } else {
        // Lead is already assigned to some other user (any other user)
        this.setState({ showAssignToButton: false }, () => {
          this.navigateToAssignLead(lead)
        })
      }
    } else {
      // not allowed to assign lead as per the role
      helper.errorToast('Sorry you are not authorized to assign lead')
    }
  }

  navigateToAssignLead = (lead) => {
    const { navigation } = this.props
    const { showAssignToButton } = this.state
    if (showAssignToButton === true) {
      navigation.navigate('AssignLead', { leadId: lead.id, type: 'Rent', screen: 'LeadDetail' })
    } else {
      helper.errorToast('Lead Already Assign')
    }
  }

  redirectToCompare = (lead) => {
    if (lead && lead.graana_property_id) {
      let url = `${config.graanaUrl}/property/${lead.graana_property_id}`
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) helper.errorToast(`No application available open this Url`)
          else return Linking.openURL(url)
        })
        .catch((err) => console.error('An error occurred', err))
    }
    if (lead && lead.wanted_id) {
      let url = `${config.graanaUrl}/api/dhoondho/shared-property/${lead.wanted_id}`
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) helper.errorToast(`No application available open this Url`)
          else return Linking.openURL(url)
        })
        .catch((err) => console.error('An error occurred', err))
    }
  }

  changeLeadStatus = (lead) => {
    const { leadsData } = this.state
    if (leadsData.length) {
      let leadNewData = leadsData.map((item, index) => {
        if (item.id === lead.id) {
          item.menu = !item.menu
          return item
        } else {
          return item
        }
      })
      this.setState({
        leadsData: [...leadNewData],
      })
    }
  }

  PPLeadStatusUpdate = (data, status) => {
    var leadId = []
    leadId.push(data.id)
    this.changeLeadStatus(data)
    if (data) {
      axios
        .patch(
          `/api/leads`,
          {
            status: status,
          },
          { params: { id: leadId } }
        )
        .then((res) => {
          this.fetchLeads()
        })
        .catch((error) => {
          console.log(`ERROR: /api/leads/?id=${data.id}`, error)
        })
    }
  }

  fetchShortlistedProperties = (lead) => {
    let matches = []
    this.closePopup()
    this.setState({ popupLoading: true })
    axios
      .get(`/api/leads/${lead.id}/shortlist`)
      .then((res) => {
        matches = helper.propertyIdCheck(res.data.rows)
        this.setState({
          popupLoading: false,
          shortListedProperties: matches,
        })
      })
      .catch((error) => {
        console.log(error)
        this.setState({
          popupLoading: false,
        })
      })
  }

  closePopup = () => {
    const { openPopup, selectedLead } = this.state
    this.setState({
      openPopup: !openPopup,
      selectedLead: openPopup === false ? {} : selectedLead,
    })
  }

  goToViewingScreen = () => {
    const { navigation } = this.props
    navigation.navigate('RCMLeadTabs', { screen: 'Viewing' })
  }

  changeStatusType = (status, text) => {
    this.clearStateValues()
    if (status == 'id') {
      this.setState({ idLead: text })
    } else if (status == 'name') {
      this.setState({ nameLead: text })
    } else if (status == 'email') {
      this.setState({ emailLead: text })
    } else {
      this.setState({ phoneLead: text })
    }
    this.setState({ statusFilterType: status, showSearchBar: true, clear: true }, () => {
      this.RBSheet.close()
      this.fetchLeads()
    })
  }

  setFabActions = () => {
    const { createBuyRentLead, createProjectLead } = this.state
    const { route } = this.props
    const { client } = route.params
    let fabActions = []
    if (createBuyRentLead) {
      fabActions.push({
        icon: 'plus',
        label: 'Buy/Rent Lead',
        color: AppStyles.colors.primaryColor,
        onPress: () => {
          if (client) {
            this.goToFormPage('AddRCMLead', 'RCM', client, client?.id)
          } else {
            this.goToFormPage('AddRCMLead', 'RCM', null)
          }
        },
      })
    }
    if (createProjectLead) {
      fabActions.push({
        icon: 'plus',
        label: 'Investment Lead',
        color: AppStyles.colors.primaryColor,
        onPress: () => {
          if (client) {
            this.goToFormPage('AddCMLead', 'CM', client, client?.id)
          } else {
            this.goToFormPage('AddCMLead', 'CM', null)
          }
        },
      })
    }
    this.setState({
      fabActions: fabActions,
    })
  }
  setBottomSheet = (value) => {
    this.setState(
      {
        filterType: value,
      },
      () => {
        this.clearSearch()
        if (value == 'date' && Platform.OS == 'android') {
          this.setState({ activeDate: true })
        } else {
          this.RBSheet.open()
        }
      }
    )
  }

  onClearAll = (clear) => {
    this.clearSearch()
    this.clearStateValues()
    this.setState({ clear: false }, () => {
      this.fetchLeads()
    })
  }

  changeDateFromTo = (name) => {
    this.clearStateValues()
    const { dateFromTo } = this.state
    const selectedDate = moment(dateFromTo ? dateFromTo : new Date()).format('YYYY-MM-DD')
    this.setState({ showSearchBar: true, dateLead: selectedDate, clear: true }, () => {
      this.fetchLeads(selectedDate, selectedDate)
      this.RBSheet.close()
    })
  }

  setDateFromTo = (event, date) => {
    this.setState({ dateFromTo: date, activeDate: false }, () => {
      if (Platform.OS == 'android' && event.type == 'set') {
        this.changeDateFromTo()
      }
    })
  }

  setTextSearch = (text) => {
    this.setState({ searchText: text })
  }

  render() {
    const {
      leadsData,
      open,
      statusFilter,
      loading,
      activeSortModal,
      sort,
      totalLeads,
      onEndReachedLoader,
      searchText,
      showSearchBar,
      openPopup,
      shortListedProperties,
      popupLoading,
      serverTime,
      statusFilterType,
      fabActions,
      createBuyRentLead,
      createProjectLead,
      pageType,
      phoneModelDataLoader,
      filterType,
      statusLead,
      sortLead,
      idLead,
      nameLead,
      emailLead,
      countryLead,
      phoneLead,
      classificationLead,
      dateLead,
      dateFromTo,
      activeDate,
      clear,
    } = this.state
    const {
      user,
      navigation,
      dispatch,
      isMultiPhoneModalVisible,
      getIsTerminalUser,
      leadsDropdown,
      countries,
    } = this.props
    const {
      screen,
      hasBooking = false,
      navFrom = null,
      hideCloseLostFilter,
    } = this.props.route.params
    let leadStatus = StaticData.buyRentFilter
    let buyRentFilterType = StaticData.buyRentFilterType
    if (user.organization && user.organization.isPP) leadStatus = StaticData.ppBuyRentFilter

    return (
      <View style={[AppStyles.container, { marginBottom: 25, paddingHorizontal: 0 }]}>
        {user.organization && user.organization.isPP && (
          <AndroidNotifications navigation={navigation} />
        )}
        <ShortlistedProperties
          openPopup={openPopup}
          closePopup={this.closePopup}
          data={shortListedProperties}
          popupLoading={popupLoading}
        />

        {/* ********** RN Bottom Sheet ********** */}
        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref
          }}
          height={
            filterType == 'classification'
              ? 250
              : filterType == 'date'
              ? 500
              : filterType == 'country'
              ? 700
              : filterType == 'leadStatus'
              ? 350
              : 300
          }
          openDuration={250}
          closeOnDragDown={true}
        >
          {filterType == 'leadStatus' ? (
            <ListViewComponent
              name={'Lead Status'}
              data={
                hasBooking
                  ? StaticData.buyRentFilterDeals
                  : hideCloseLostFilter
                  ? StaticData.buyRentFilterAddTask
                  : StaticData.buyRentFilter
              }
              onPress={this.changeStatus}
            />
          ) : filterType == 'sort' ? (
            <ListViewComponent data={StaticData.sortData} onPress={this.sendStatus} />
          ) : filterType == 'id' ? (
            <TextFilterComponent
              name={'ID'}
              type={'id'}
              searchText={searchText}
              setTextSearch={this.setTextSearch}
              changeStatusType={this.changeStatusType}
            />
          ) : filterType == 'name' ? (
            <TextFilterComponent
              name={'Name'}
              type={'name'}
              searchText={searchText}
              setTextSearch={this.setTextSearch}
              changeStatusType={this.changeStatusType}
            />
          ) : filterType == 'email' ? (
            <TextFilterComponent
              name={'Email ID'}
              type={'email'}
              searchText={searchText}
              setTextSearch={this.setTextSearch}
              changeStatusType={this.changeStatusType}
            />
          ) : filterType == 'phone' ? (
            <TextFilterComponent
              name={'Phone #'}
              type={'phone'}
              searchText={searchText}
              setTextSearch={this.setTextSearch}
              changeStatusType={this.changeStatusType}
            />
          ) : filterType == 'date' ? (
            <DateFilterComponent
              dateFromTo={dateFromTo}
              setDateFromTo={this.setDateFromTo}
              changeDateFromTo={this.changeDateFromTo}
            />
          ) : filterType == 'country' ? (
            <ListViewComponent data={countries} onPress={this.searchCountry} type={'country'} />
          ) : filterType == 'classification' ? (
            <ListViewComponent
              name={'Search by Classification Type'}
              data={StaticData.classificationFilter}
              onPress={this.setClassification}
            />
          ) : null}
        </RBSheet>
        {/* ********** RN Bottom Sheet ********** */}

        {/* ******************* TOP FILTER MAIN VIEW START ********** */}
        <FilterLeadsView
          statusLead={statusLead}
          sortLead={sortLead}
          idLead={idLead}
          nameLead={nameLead}
          dateLead={dateLead}
          countryLead={countryLead}
          emailLead={emailLead}
          phoneLead={phoneLead}
          classificationLead={classificationLead}
          setBottomSheet={this.setBottomSheet}
          hasBooking={hasBooking}
          clear={clear}
          onClear={this.onClearAll}
        />
        {/* ******************* TOP FILTER MAIN VIEW END ********** */}

        {leadsData && leadsData.length > 0 ? (
          <FlatList
            data={_.clone(leadsData)}
            contentContainerStyle={styles.paddingHorizontal}
            renderItem={({ item }) => (
              <View>
                {/* {console.log(user)} */}
                {(!user.organization && user.armsUserRole.groupManger) ||
                (user.organization && !user.organization.isPP) ? (
                  <LeadTile
                    dispatch={this.props.dispatch}
                    purposeTab={'rent'}
                    user={user}
                    data={{ ...item }}
                    navigateTo={this.navigateTo}
                    callNumber={(data) => {
                      pageType === '&pageType=demandLeads&hasBooking=false'
                        ? callToAgent(data)
                        : this.setState({ phoneModelDataLoader: true })
                      this.showMultiPhoneModal(true)
                      dispatch(callNumberFromLeads(data, 'BuyRent')).then((res) => {
                        if (res !== null) {
                          this.setState({ phoneModelDataLoader: false })
                        }
                      })
                    }}
                    handleLongPress={this.handleLongPress}
                    navFrom={navFrom}
                    serverTime={serverTime}
                    screenName={screen}
                    pageType={pageType}
                  />
                ) : (
                  <PPLeadTile
                    dispatch={this.props.dispatch}
                    purposeTab={'rent'}
                    user={user}
                    data={{ ...item }}
                    navigateTo={this.navigateTo}
                    callNumber={(data) => {
                      console.log(data)
                      dispatch(callNumberFromLeads(data, 'BuyRent')).then((res) => {
                        if (res !== null) {
                          this.showMultiPhoneModal(true)
                        }
                      })
                    }}
                    handleLongPress={this.handleLongPress}
                    changeLeadStatus={this.changeLeadStatus}
                    redirectToCompare={this.redirectToCompare}
                    PPLeadStatusUpdate={this.PPLeadStatusUpdate}
                    fetchShortlistedProperties={this.fetchShortlistedProperties}
                  />
                )}
              </View>
            )}
            onEndReached={() => {
              if (leadsData.length < totalLeads) {
                this.setState(
                  {
                    page: this.state.page + 1,
                    onEndReachedLoader: true,
                  },
                  () => {
                    this.fetchLeads()
                  }
                )
              }
            }}
            onEndReachedThreshold={0.5}
            keyExtractor={(item, index) => this.setKey(index)}
          />
        ) : (
          <LoadingNoResult loading={loading} />
        )}
        <OnLoadMoreComponent onEndReached={onEndReachedLoader} />
        {(createProjectLead || createBuyRentLead) && screen === 'Leads' && !hideCloseLostFilter ? (
          <FAB.Group
            open={open}
            icon="plus"
            style={{ marginBottom: 16 }}
            fabStyle={{ backgroundColor: AppStyles.colors.primaryColor }}
            color={AppStyles.bgcWhite.backgroundColor}
            actions={fabActions}
            onStateChange={({ open }) => this.setState({ open })}
          />
        ) : null}

        <MultiplePhoneOptionModal
          modelDataLoading={phoneModelDataLoader}
          isMultiPhoneModalVisible={isMultiPhoneModalVisible}
          showMultiPhoneModal={(value) => this.showMultiPhoneModal(value)}
          navigation={navigation}
        />

        {activeDate && (
          <RNDateTimePicker
            value={dateFromTo ? dateFromTo : new Date()}
            onChange={this.setDateFromTo}
          />
        )}

        <SortModal
          sendStatus={this.sendStatus}
          openStatus={this.openStatus}
          data={StaticData.sortData}
          doneStatus={activeSortModal}
          sort={sort}
        />
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    PPBuyNotification: store.Notification.PPBuyNotification,
    isMultiPhoneModalVisible: store.diary.isMultiPhoneModalVisible,
    contacts: store.contacts.contacts,
    permissions: store.user.permissions,
    getIsTerminalUser: store.user.getIsTerminalUser,
    countries: store.countries.country,
    leadsDropdown: store.leadsDropdown.leadsDropdown,
  }
}
export default connect(mapStateToProps)(RentLeads)
