/** @format */

import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import moment from 'moment'
import { ActionSheet } from 'native-base'
import React from 'react'
import { FlatList, Image, Platform, TouchableOpacity, View } from 'react-native'
import { setLeadsDropdown } from '../../actions/leadsDropdown'
import { FAB } from 'react-native-paper'
import { connect } from 'react-redux'
import SortImg from '../../../assets/img/sort.png'
import { setCallPayload } from '../../actions/callMeetingFeedback'
import { setlead } from '../../actions/lead'
import { getListingsCount } from '../../actions/listings'
import { getItem, removeItem, storeItem } from '../../actions/user'
import AppStyles from '../../AppStyles'
import DateSearchFilter from '../../components/DateSearchFilter'
import LeadTile from '../../components/LeadTile'
import LoadingNoResult from '../../components/LoadingNoResult'
import MeetingFollowupModal from '../../components/MeetingFollowupModal'
import MultiplePhoneOptionModal from '../../components/MultiplePhoneOptionModal'
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent'
import PickerComponent from '../../components/Picker/index'
import Search from '../../components/Search'
import SortModal from '../../components/SortModal'
import StatusFeedbackModal from '../../components/StatusFeedbackModal'
import SubmitFeedbackOptionsModal from '../../components/SubmitFeedbackOptionsModal'
import helper from '../../helper'
import Ability from '../../hoc/Ability'
import StaticData from '../../StaticData'
import styles from './style'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import ReferenceGuideModal from '../../components/ReferenceGuideModal'
import {
  addInvestmentGuide,
  callNumberFromLeads,
  setMultipleModalVisible,
  setReferenceGuideData,
} from '../../actions/diary'
import RBSheet from 'react-native-raw-bottom-sheet'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { getCountryCode } from '../../actions/country'
import FilterLeadsView from '../../components/FilterLeadsView'
import ListViewComponent from '../../components/ListViewComponent'
import TextFilterComponent from '../../components/TextFilterComponent'
import DateFilterComponent from '../../components/DateFilterComponent'
import Loader from '../../components/loader'

var BUTTONS = [
  'Assign to team member',
  'Share lead with other agent',
  'Create new Investment lead for this client',
  'Cancel',
]
var CANCEL_INDEX = 3

class InvestLeads extends React.Component {
  constructor(props) {
    super(props)
    const { permissions } = this.props
    const { hasBooking = false } = this.props.route.params
    this.state = {
      phoneModelDataLoader: false,
      leadsData: [],
      purposeTab: 'invest',
      statusFilter: 'all',
      open: false,
      sort: '&order=Desc&field=createdAt',
      loading: false,
      activeSortModal: false,
      totalLeads: 0,
      page: 1,
      pageSize: 20,
      onEndReachedLoader: false,
      showSearchBar: false,
      searchText: '',
      showAssignToButton: false,
      serverTime: null,
      active: false,
      statusfeedbackModalVisible: false,
      modalMode: 'call',
      currentCall: null,
      isFollowUpMode: false,
      selectedLead: null,
      isMultiPhoneModalVisible: false,
      selectedClientContacts: [],
      statusFilterType: 'id',
      comment: null,
      newActionModal: false,
      isMenuVisible: false,
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
    const { dispatch, route } = this.props
    const { client } = route.params
    const { hasBooking = false } = this.props.route.params

    dispatch(
      setLeadsDropdown(
        hasBooking ? '&pageType=myDeals&hasBooking=true' : '&pageType=myLeads&hasBooking=false'
      )
    )

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      dispatch(getListingsCount())
      dispatch(getCountryCode())
      this.getServerTime()
      this.onFocus()
    })

    this.setFabActions()
  }

  componentWillUnmount() {
    this.clearStateValues()
    this.showMultiPhoneModal(false)
  }

  showMultiPhoneModal = (value) => {
    const { dispatch } = this.props
    dispatch(setMultipleModalVisible(value))
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.referenceGuide !== prevProps.referenceGuide) {
      // reload page when reference guide is added
      this.fetchLeads()
    }
    if (this.props.isMultiPhoneModalVisible !== prevProps.isMultiPhoneModalVisible) {
      this.showMultiPhoneModal(this.props.isMultiPhoneModalVisible)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.leadsDropdown !== prevProps.leadsDropdown) {
      this.changePageType(this.props.leadsDropdown)
    }
    if (this.props.referenceGuide !== prevProps.referenceGuide) {
      // reload page when reference guide is added
      this.fetchLeads()
    }
  }

  fetchAddedLeads = (client) => {
    const { route } = this.props
    const { page, leadsData, statusFilter } = this.state
    this.setState({ loading: true })
    const { clientDetails } = route.params
    let url
    if (clientDetails) {
      url = `/api/leads/projects?customerId=${client.id}&customerLeads=true`
    } else {
      url = `/api/leads/projects?customerId=${client.id}`
    }
    axios
      .get(url)
      .then((res) => {
        this.setState({
          leadsData: page === 1 ? res.data.rows : [...leadsData, ...res.data.rows],
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

  onFocus = async () => {
    const { hasBooking = false, screen, client } = this.props.route.params // for Deals we need to set filter to closed won
    const sortValue = await this.getSortOrderFromStorage()
    let statusValue = ''

    if (client) {
      this.fetchAddedLeads(client)
    } else {
      if (hasBooking) {
        statusValue = await getItem('statusFilterInvestDeals')
      } else {
        statusValue = await getItem('statusFilterInvestLeads')
      }
      if (statusValue && String(statusValue.value) != 'all') {
        this.setState({ statusFilter: String(statusValue.value), sort: sortValue }, () => {
          this.fetchLeads()
          const str = String(statusValue.name)
          const capitalized = str.charAt(0).toUpperCase() + str.slice(1)
          this.setState({ statusLead: capitalized, clear: true })
        })
      } else {
        if (screen === 'MyDeals') {
          // storeItem('statusFilterInvestDeals', 'all')
          this.setState({ statusFilter: 'all', sort: sortValue }, () => {
            this.fetchLeads()
          })
        } else {
          // storeItem('statusFilterInvestLeads', 'all')
          this.setState({ statusFilter: 'all', sort: sortValue }, () => {
            this.fetchLeads()
          })
        }
      }
    }
  }
  setIsMenuVisible = (value, data) => {
    const { dispatch } = this.props
    dispatch(setlead(data))
    this.setState({
      isMenuVisible: value,
    })
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

  getSortOrderFromStorage = async () => {
    const sortOrder = await getItem('sortInvest')
    if (sortOrder) {
      return String(sortOrder)
    } else {
      storeItem('sortInvest', '&order=Desc&field=updatedAt')
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

  fetchLeads = async (fromDate = null, toDate = null) => {
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
    const { hasBooking, navFrom, client } = this.props.route.params
    const { user } = this.props
    this.setState({ loading: true })
    let query = ``

    if (showSearchBar) {
      if (statusFilterType === 'name' && searchText !== '') {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads/projects?searchBy=name&clientName=${searchText}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads/projects?searchBy=name&clientName=${searchText}&pageSize=${pageSize}&page=${page}${pageType}`)
      } else if (statusFilterType === 'id' && searchText !== '') {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads/projects?id=${searchText}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads/projects?id=${searchText}&pageSize=${pageSize}&page=${page}${pageType}`)
      } else if (statusFilterType === 'phone' && searchText !== '') {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads/projects?phoneNo=${searchText}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads/projects?phoneNo=${searchText}&pageSize=${pageSize}&page=${page}${pageType}`)
      } else if (statusFilterType === 'email' && searchText !== '') {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads/projects?emailId=${searchText}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads/projects?emailId=${searchText}&pageSize=${pageSize}&page=${page}${pageType}`)
      } else {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads/projects?fromDate=${fromDate}&endDate=${toDate}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads/projects?fromDate=${fromDate}&endDate=${toDate}&pageSize=${pageSize}&page=${page}${pageType}`)
      }
    } else {
      if (statusFilter === 'in_progress') {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads/projects?status=${statusFilter}${sort}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads/projects?status=${statusFilter}${sort}&pageSize=${pageSize}&page=${page}${pageType}`)
      } else {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads/projects?status=${statusFilter}${sort}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads/projects?status=${statusFilter}${sort}&pageSize=${pageSize}&page=${page}${pageType}`)
      }
    }

    if (client) {
      query = `${query}&customerId=${client.id}&customerLeads=true`
    }

    if (countryFilter) {
      query = `${query}&countryCode=${countryFilter}`
    }
    if (classificationValues) {
      query = `${query}&leadCategory[]=${classificationValues}`
    }
    axios
      .get(`${query}`)
      .then((res) => {
        let leadNewData = page === 1 ? res.data.rows : [...leadsData, ...res.data.rows]
        if (leadNewData && navFrom) {
          leadNewData = leadNewData.filter(
            (item) => item.status !== 'closed_won' && item.status !== 'closed_lost'
          )
        }
        this.setState(
          {
            leadsData: leadNewData,
            loading: false,
            onEndReachedLoader: false,
            totalLeads: res.data.count,
            statusFilter: statusFilter,
          },
          () => {
            // this.checkAssignedLead(res.data)
          }
        )
      })
      .catch((res) => {
        this.setState({
          loading: false,
        })
      })
  }

  goToFormPage = (page, status, client) => {
    const { navigation } = this.props

    navigation.navigate(page, {
      noEditableClient: client ? true : false,
      pageName: status,
      client,
      name:
        client && client.customerName
          ? client.customerName
          : `${client?.first_name} ${client?.last_name}`,
    })
  }

  changeStatus = (status, name = null) => {
    const { hasBooking = false } = this.props.route?.params
    this.clearStateValues()
    if (hasBooking) {
      this.setState({ statusLead: name, statusFilter: status, leadsData: [], clear: true }, () => {
        storeItem('statusFilterInvestDeals', { name: name, value: status })
        this.fetchLeads()
      })
    } else {
      this.setState({ statusLead: name, statusFilter: status, leadsData: [], clear: true }, () => {
        storeItem('statusFilterInvestLeads', { name: name, value: status })
        this.fetchLeads()
      })
    }
    this.RBSheet.close()
  }

  changePageType = (value) => {
    this.clearStateValues()
    this.setState({ pageType: value, leadsData: [] }, () => {
      this.fetchLeads()
    })
  }

  navigateFromMenu = (data, name) => {
    const { screen, navFrom } = this.props.route.params
    this.props.dispatch(setlead(data))
    this.props.navigation.navigate(name, {
      lead: data,
      purposeTab: 'invest',
      screen: 'InvestLeads',
      cmLeadId: data.id,
      screenName: screen,
      navFrom: navFrom,
      showBottomNav: true,
    })
    this.setIsMenuVisible(false, data)
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
          this.goToFormPage('AddCMLead', 'CM', val && val.customer ? val.customer : null)
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
          navigation.navigate('AssignLead', {
            leadId: data.id,
            type: 'Investment',
            purpose: 'refer',
            screenName: 'Invest',
            // screen: 'MenuLead',
          })
        }
      } else {
        helper.errorToast('Only the leads assigned to you can be shared')
      }
    } else {
      helper.errorToast('Something went wrong!')
    }
  }
  navigateTo = (data) => {
    const { screen, navFrom } = this.props.route.params

    const { navigation, route } = this.props
    const unitData = route.params.unitData
    if (navFrom) {
      this.props.dispatch(setlead(data))
      navigation.navigate('AddDiary', {
        lead: data,
        cmLeadId: data.id,
      })
    } else {
      this.props.dispatch(setlead(data))
      let page = ''
      if (data.readAt === null) {
        this.props.navigation.navigate('LeadDetail', {
          lead: data,
          purposeTab: 'invest',
          screenName: screen,
          navFrom: navFrom,
          showBottomNav: true,
        })
      } else {
        if (
          data.status === 'token' ||
          data.status === 'payment' ||
          data.status === 'closed_won' ||
          data.status === 'closed_lost'
        ) {
          page = 'Payments'

          navigation.navigate('CMLeadTabs', {
            screen: unitData ? 'Payments' : page,
            params: { lead: data, unitData: unitData, screenName: screen },
          })
        } else if (data.status === 'open' || data.status === 'in_progress') {
          this.props.navigation.navigate('LeadDetail', {
            lead: data,
            purposeTab: 'invest',
            screenName: screen,
            navFrom: navFrom,
            showBottomNav: true,
          })
        } else {
          page = 'Meetings'

          navigation.navigate('CMLeadTabs', {
            screen: unitData ? 'Payments' : page,
            params: { lead: data, unitData: unitData, screenName: screen },
          })
        }
      }
    }
  }

  sendStatus = (status, name) => {
    this.setState({ sort: status, activeSortModal: !this.state.activeSortModal }, () => {
      storeItem('sortInvest', status)
      this.fetchLeads()
    })
  }

  setKey = (index) => {
    return String(index)
  }

  clearAndCloseSearch = () => {
    this.setState({ searchText: '', showSearchBar: false, statusFilterType: 'id' }, () => {
      this.clearStateValues()
      this.fetchLeads()
    })
  }

  checkAssignedLead = (lead) => {
    const { user } = this.props
    // Show assign lead button only if loggedIn user is Sales level2 or CC/BC/RE Manager
    if (
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
      helper.errorToast('Sorry you are not authorized to assign lead')
    }
  }

  navigateToAssignLead = (lead) => {
    const { navigation } = this.props
    const { showAssignToButton } = this.state
    if (showAssignToButton === true) {
      navigation.navigate('AssignLead', {
        leadId: lead.id,
        type: 'Investment',
        purpose: 'reassign',
        screenName: 'Invest',
      })
    } else {
      helper.errorToast('Lead Already Assign')
    }
  }

  changeStatusType = (text, status) => {
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

  bookUnit = () => {
    const { navigation } = this.props
    navigation.navigate('CMLeadTabs', { screen: 'Payments' })
  }

  createProjectLead = () => {
    const { permissions } = this.props
    const { fabActions } = this.state
    if (
      getPermissionValue(PermissionFeatures.PROJECT_LEADS, PermissionActions.CREATE, permissions)
    ) {
      this.setState({
        fabActions: [
          {
            icon: 'plus',
            label: 'Investment Lead',
            color: AppStyles.colors.primaryColor,
            onPress: () => {
              if (createProjectLead) this.goToFormPage('AddCMLead', 'CM', null)
            },
          },
        ],
      })
      return true
    }
  }

  createBuyRentLead = () => {
    const { permissions } = this.props
    const { fabActions } = this.state
    if (
      getPermissionValue(PermissionFeatures.BUY_RENT_LEADS, PermissionActions.CREATE, permissions)
    ) {
      this.setState({
        fabActions: [
          {
            icon: 'plus',
            label: 'Buy/Rent Lead',
            color: AppStyles.colors.primaryColor,
            onPress: () => {
              if (createBuyRentLead) this.goToFormPage('AddRCMLead', 'RCM', null)
            },
          },
        ],
      })
      return true
    }
  }

  setFabActions = () => {
    const { createBuyRentLead, createProjectLead } = this.state
    let fabActions = []
    const { route } = this.props
    const { client } = route.params
    if (createBuyRentLead) {
      fabActions.push({
        icon: 'plus',
        label: 'Buy/Rent Lead',
        color: AppStyles.colors.primaryColor,
        onPress: () => {
          this.goToFormPage('AddRCMLead', 'RCM', client)
        },
      })
    }
    if (createProjectLead) {
      fabActions.push({
        icon: 'plus',
        label: 'Investment Lead',
        color: AppStyles.colors.primaryColor,
        onPress: () => this.goToFormPage('AddCMLead', 'CM', client),
      })
    }
    this.setState({
      fabActions: fabActions,
    })
  }

  openStatus = () => {
    this.setState({ activeSortModal: !this.state.activeSortModal })
  }

  renderItem = ({ item }) => {
    return (
      <LeadTile
        dispatch={this.props.dispatch}
        purposeTab={'invest'}
        user={this.props.user}
        data={item}
        navigateTo={this.navigateTo}
        navigateToDetailScreen={this.navigateToDetailScreen}
        navigateFromMenu={this.navigateFromMenu}
        pageType={this.state.pageType}
        callNumber={(data) => {
          // getting complete project lead object that contains customer contacts as well
          this.setState({ phoneModelDataLoader: true })

          this.showMultiPhoneModal(true)
          axios.get(`api/leads/project/byId?id=${data.id}`).then((lead) => {
            this.props.dispatch(callNumberFromLeads(lead.data, 'Project')).then((res) => {
              if (res !== null) {
                // this.showMultiPhoneModal(true)
                this.setState({ phoneModelDataLoader: false })
              }
            })
          })
        }}
        handleLongPress={this.handleLongPress}
        serverTime={this.state.serverTime}
        screen={this.props.route.params.navFrom ? 'AddDiary' : this.props.route.params.screen}
        navFrom={this.props.route.params.navFrom}
        isMenuVisible={this.state.isMenuVisible}
        setIsMenuVisible={(value, data) => this.setIsMenuVisible(value, data)}
        checkAssignedLead={(lead) => this.checkAssignedLead(lead)}
        navigateToShareScreen={(data) => this.navigateToShareScreen(data)}
        addGuideReference={() =>
          this.props.dispatch(
            setReferenceGuideData({ ...referenceGuide, isReferenceModalVisible: true })
          )
        }
      />
    )
  }

  clearSearch = () => {
    this.setState({
      searchText: '',
      showSearchBar: false,
      statusFilterType: 'id',
      statusFilter: '',
      sort: '&order=Desc&field=createdAt',
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

  onClearAll = async (clear) => {
    const { hasBooking = false } = this.props.route.params
    this.clearSearch()
    this.clearStateValues()
    this.setState({ clear: false }, () => {
      this.fetchLeads()
    })
    if (hasBooking) {
      await removeItem('statusFilterInvestDeals')
    } else {
      await removeItem('statusFilterInvestLeads')
    }
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
      serverTime,
      statusFilterType,
      isMenuVisible,
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
      permissions,
      lead,
      dispatch,
      referenceGuide,
      navigation,
      isMultiPhoneModalVisible,
      getIsTerminalUser,
      countries,
    } = this.props
    const {
      screen,
      hasBooking = false,
      navFrom = null,
      hideCloseLostFilter,
      client,
    } = this.props.route.params
    let buyRentFilterType = StaticData.buyRentFilterType

    return (
      <View style={[AppStyles.container, { marginBottom: 25, paddingHorizontal: 0 }]}>
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
          customStyles={{
            container: { borderTopLeftRadius: 10, borderTopRightRadius: 10 },
          }}
        >
          {filterType == 'leadStatus' ? (
            <ListViewComponent
              name={'Lead Status'}
              data={
                hasBooking
                  ? StaticData.investmentFilterDeals
                  : hideCloseLostFilter
                  ? StaticData.investmentFilterLeadsAddTask
                  : StaticData.investmentFilterLeads
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
            <ListViewComponent
              data={countries}
              onPress={this.searchCountry}
              type={'country'}
              show={true}
            />
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
        {client ? (
          <View style={styles.filterMainView} />
        ) : (
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
            openStatus={this.openStatus}
          />
        )}
        {/* ******************* TOP FILTER MAIN VIEW END ********** */}

        <ReferenceGuideModal
          isReferenceModalVisible={referenceGuide.isReferenceModalVisible}
          hideReferenceGuideModal={() =>
            dispatch(setReferenceGuideData({ ...referenceGuide, isReferenceModalVisible: false }))
          }
          addInvestmentGuide={(guideNo, attachments) =>
            dispatch(addInvestmentGuide({ guideNo, attachments }, lead))
          }
          referenceGuideLoading={referenceGuide.referenceGuideLoading}
          referenceErrorMessage={referenceGuide.referenceErrorMessage}
        />
        {leadsData && leadsData.length > 0 ? (
          <FlatList
            data={leadsData}
            contentContainerStyle={styles.paddingHorizontal}
            renderItem={this.renderItem}
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
          <Loader loading={loading} />
        )}
        <OnLoadMoreComponent onEndReached={onEndReachedLoader} />
        {(createProjectLead || createBuyRentLead) &&
        (screen === 'Leads' || screen === 'ProjectLeads') &&
        !hideCloseLostFilter ? (
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

        <SortModal
          sendStatus={this.sendStatus}
          openStatus={this.openStatus}
          data={StaticData.sortData}
          doneStatus={activeSortModal}
          sort={sort}
        />

        {activeDate && (
          <RNDateTimePicker
            value={dateFromTo ? dateFromTo : new Date()}
            onChange={this.setDateFromTo}
          />
        )}

        <MultiplePhoneOptionModal
          modelDataLoading={phoneModelDataLoader}
          isMultiPhoneModalVisible={isMultiPhoneModalVisible}
          showMultiPhoneModal={(value) => this.showMultiPhoneModal(value)}
          navigation={navigation}
        />
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    contacts: store.contacts.contacts,
    lead: store.lead.lead,
    permissions: store.user.permissions,
    referenceGuide: store.diary.referenceGuide,
    isMultiPhoneModalVisible: store.diary.isMultiPhoneModalVisible,
    getIsTerminalUser: store.user.getIsTerminalUser,
    countries: store.countries.country,
    leadsDropdown: store.leadsDropdown.leadsDropdown,
  }
}
export default connect(mapStateToProps)(InvestLeads)
