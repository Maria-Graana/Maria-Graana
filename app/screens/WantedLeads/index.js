/** @format */

import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import { ActionSheet, Fab } from 'native-base'
import React from 'react'
import { FlatList, Image, Linking, TouchableOpacity, View } from 'react-native'
import { FAB } from 'react-native-paper'
import { connect } from 'react-redux'
import SortImg from '../../../assets/img/sort.png'
import { setCallPayload } from '../../actions/callMeetingFeedback'
import { setlead } from '../../actions/lead'
import { getListingsCount } from '../../actions/listings'
import { setPPBuyNotification } from '../../actions/notification'
import { getItem, storeItem } from '../../actions/user'
import AppStyles from '../../AppStyles'
import DateSearchFilter from '../../components/DateSearchFilter'
import LeadTile from '../../components/LeadTile'
import LoadingNoResult from '../../components/LoadingNoResult'
import MeetingFollowupModal from '../../components/MeetingFollowupModal'
import MultiplePhoneOptionModal from '../../components/MultiplePhoneOptionModal'
import HistoryModal from '../../components/HistoryModal'
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent'
import PickerComponent from '../../components/Picker/index'
import PPLeadTile from '../../components/PPLeadTile'
import Search from '../../components/Search'
import ShortlistedProperties from '../../components/ShortlistedProperties'
import SortModal from '../../components/SortModal'
import StatusFeedbackModal from '../../components/StatusFeedbackModal'
import SubmitFeedbackOptionsModal from '../../components/SubmitFeedbackOptionsModal'
import config from '../../config'
import helper from '../../helper'
import Ability from '../../hoc/Ability'
import StaticData from '../../StaticData'
import styles from './style'
import Loader from '../../components/loader'

var BUTTONS = [
  'Assign to team member',
  'Share lead with other agent',
  'Create new Buy lead for this client',
  'Cancel',
]
var CANCEL_INDEX = 3

class WantedLeads extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      language: '',
      leadsData: [],
      statusFilter: '',
      open: false,
      sort: '',
      loading: false,
      activeSortModal: false,
      totalLeads: 0,
      page: 1,
      pageSize: 20,
      onEndReachedLoader: false,
      showSearchBar: false,
      searchText: '',
      showAssignToButton: false,
      shortListedProperties: [],
      openPopup: false,
      selectedLead: null,
      popupLoading: false,
      serverTime: null,
      statusfeedbackModalVisible: false,
      modalMode: 'call',
      isFollowUpMode: false,
      active: false,
      isMultiPhoneModalVisible: false,
      selectedClientContacts: [],
      statusFilterType: 'id',
      newActionModal: false,
      isMenuVisible: false,
      meetings: [],
      callModal: false,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      const { PPBuyNotification } = this.props
      if (PPBuyNotification) {
        dispatch(setPPBuyNotification(false))
      }
      dispatch(getListingsCount())
      this.getServerTime()
      this.onFocus()
    })
  }

  componentWillUnmount() {
    this.clearStateValues()
  }

  onFocus = async () => {
    const sortValue = await this.getSortOrderFromStorage()
    const statusValue = await getItem('statusFilterBuy')
    if (statusValue) {
      this.setState({ statusFilter: String(statusValue), sort: sortValue }, () => {
        this.fetchLeads()
      })
    } else {
      storeItem('statusFilterBuy', 'all')
      this.setState({ statusFilter: 'all', sort: sortValue }, () => {
        this.fetchLeads()
      })
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

  getSortOrderFromStorage = async () => {
    const sortOrder = await getItem('sortBuy')
    if (sortOrder) {
      return String(sortOrder)
    } else {
      // default case only runs when no value exists in async storage.
      storeItem('sortBuy', '&order=Desc&field=updatedAt')
      return '&order=Desc&field=updatedAt'
    }
  }

  clearStateValues = () => {
    this.setState({
      page: 1,
      totalLeads: 0,
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
    } = this.state
    this.setState({ loading: true })
    const { hasBooking, client } = this.props.route.params
    const { user } = this.props

    let query = ''
    if (client) {
      if (user.armsUserRole && user.armsUserRole.groupManger) {
        query = `/api/wanted?customerId=${client.id}&page=1&pageSize=${pageSize}&showAllLeads=true`
      } else {
        query = `/api/wanted?customerId=${client.id}&pageSize=${pageSize}&page=${page}`
      }
    } else {
      if (user.armsUserRole && user.armsUserRole.groupManger) {
        query = `/api/wanted?page=1&pageSize=${pageSize}&showAllLeads=true`
      } else {
        query = `/api/wanted?pageSize=${pageSize}&page=${page}`
      }
    }
    // if (showSearchBar) {
    //   if (statusFilterType === 'name' && searchText !== '') {
    //     query = `/api/leads?purpose[]=sale&searchBy=name&q=${searchText}&pageSize=${pageSize}&page=${page}&hasBooking=${hasBooking}`
    //   } else if (statusFilterType === 'id' && searchText !== '') {
    //     query = `/api/leads?purpose[]=sale&id=${searchText}&pageSize=${pageSize}&page=${page}&hasBooking=${hasBooking}`
    //   } else {
    //     query = `/api/leads?purpose[]=sale&startDate=${fromDate}&endDate=${toDate}&pageSize=${pageSize}&page=${page}&hasBooking=${hasBooking}`
    //   }
    // } else {
    //   if (statusFilter === 'shortlisting') {
    //     query = `/api/leads?purpose[]=sale&status[0]=offer&status[1]=viewing&status[2]=propsure&pageSize=${pageSize}&page=${page}&hasBooking=${hasBooking}`
    //   } else {
    //     query = `/api/leads?purpose[]=sale&status=${statusFilter}${sort}&pageSize=${pageSize}&page=${page}&hasBooking=${hasBooking}`
    //   }
    // }
    axios
      .get(`${query}`)
      .then((res) => {
        let leadNewData = helper.leadMenu(
          page === 1 ? res.data.rows : [...leadsData, ...res.data.rows]
        )
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

  goToHistory = () => {
    const { callModal } = this.state
    this.setState({ callModal: !callModal })
  }

  getCallHistory = (lead) => {
    axios
      .get(`/api/leads/tasks?wantedId=${lead.id}`)
      .then((res) => {
        this.setState({ meetings: res.data }, () => this.goToHistory())
      })
      .catch(() => {
        console.log(error)
        helper.errorToast(error.message)
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
      purpose: 'wanted',
    })
  }

  changeStatus = (status) => {
    this.clearStateValues()
    this.setState({ statusFilter: status, leadsData: [] }, () => {
      storeItem('statusFilterBuy', status)
      this.fetchLeads()
    })
  }

  navigateTo = (data) => {
    // const { screen } = this.props.route.params
    // this.props.dispatch(setlead(data))
    // let page = ''
    // if (this.props.route.params?.screen === 'MyDeals') {
    //   this.props.navigation.navigate('LeadDetail', {
    //     lead: data,
    //     purposeTab: 'sale',
    //     screenName: screen,
    //   })
    // } else if (data.readAt === null) {
    //   this.props.navigation.navigate('LeadDetail', {
    //     lead: data,
    //     purposeTab: 'sale',
    //     screenName: screen,
    //   })
    // } else {
    //   if (data.status == 'open') {
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
    //   this.props.navigation.navigate('RCMLeadTabs', {
    //     screen: page,
    //     params: { lead: data },
    //   })
    // }
  }

  handleLongPress = (val) => {
    // ActionSheet.show(
    //   {
    //     options: BUTTONS,
    //     cancelButtonIndex: CANCEL_INDEX,
    //     title: 'Select an Option',
    //   },
    //   (buttonIndex) => {
    //     if (buttonIndex === 1) {
    //       //Share
    //       this.navigateToShareScreen(val)
    //     } else if (buttonIndex === 2) {
    //       this.goToFormPage('AddRCMLead', 'RCM', val && val.customer ? val.customer : null)
    //     } else if (buttonIndex === 0) {
    //       this.checkAssignedLead(val)
    //     }
    //   }
    // )
  }

  assignToLead = (data) => {
    axios
      .post(`/api/wanted/convert-to-lead/${data.id}`)
      .then((response) => {
        if (response.status === 200) {
          helper.successToast('LEAD ASSIGNED SUCCESSFULLY')
        } else {
          helper.errorToast('SOMETHING WENT WRONG')
        }
      })
      .catch((error) => {
        console.log(error)
        helper.errorToast(error.message)
      })
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
          navigation.navigate('AssignLead', { leadId: data.id, type: 'Buy', screen: 'BuyLead' })
        }
      } else {
        helper.errorToast('Only the leads assigned to you can be shared')
      }
    } else {
      helper.errorToast('Something went wrong!')
    }
  }

  callNumber = (data) => {
    // const { contacts, dispatch } = this.props
    // this.setState({ selectedLead: data }, () => {
    //   if (data && data.customer) {
    //     let selectedClientContacts = helper.createContactPayload(data.customer)
    //     this.setState({ selectedClientContacts, calledOn: 'phone' }, () => {
    //       if (selectedClientContacts.payload && selectedClientContacts.payload.length > 1) {
    //         //  multiple numbers to select
    //         this.showMultiPhoneModal(true)
    //       } else {
    //         dispatch(
    //           setCallPayload(
    //             selectedClientContacts ? selectedClientContacts.phone : null,
    //             'phone',
    //             data
    //           )
    //         )
    //         helper.callNumber(selectedClientContacts, contacts)
    //         this.showStatusFeedbackModal(true, 'call')
    //       }
    //     })
    //   }
    // })
  }

  setNewActionModal = (value) => {
    this.setState({ newActionModal: value })
  }

  showMultiPhoneModal = (value) => {
    this.setState({ isMultiPhoneModalVisible: value })
  }

  handlePhoneSelectDone = (phone) => {
    const { contacts, dispatch } = this.props
    const { selectedLead } = this.state
    const copySelectedClientContacts = { ...this.state.selectedClientContacts }
    if (phone) {
      copySelectedClientContacts.phone = phone.number
      copySelectedClientContacts.url = 'tel:' + phone.number
      this.setState(
        { selectedClientContacts: copySelectedClientContacts, isMultiPhoneModalVisible: false },
        () => {
          dispatch(
            setCallPayload(
              copySelectedClientContacts ? copySelectedClientContacts.phone : null,
              'phone',
              selectedLead
            )
          )
          helper.callNumber(copySelectedClientContacts, contacts)
          this.showStatusFeedbackModal(true, 'call')
        }
      )
    }
  }

  sendStatus = (status) => {
    this.setState({ sort: status, activeSortModal: !this.state.activeSortModal }, () => {
      storeItem('sortBuy', status)
      this.fetchLeads()
    })
  }

  openStatus = () => {
    this.setState({ activeSortModal: !this.state.activeSortModal })
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

  updateStatus = (data) => {
    var leadId = []
    leadId.push(data.id)
    if (data.status === 'open') {
      axios
        .patch(
          `/api/wanted`,
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
      helper.errorToast('Sorry you are not authorized to assign lead')
    }
  }

  navigateToAssignLead = (lead) => {
    const { navigation } = this.props
    const { showAssignToButton } = this.state
    if (showAssignToButton === true) {
      // navigation.navigate('AssignLead', { leadId: lead.id, type: 'wanted', screen: 'LeadDetail' })
      navigation.navigate('AssignLead', {
        leadId: lead.id,
        type: 'wanted',
        screen: 'LeadDetail',
        purpose: 'reassign',
      })
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

  setIsMenuVisible = (value, data) => {
    const { dispatch } = this.props
    dispatch(setlead(data))
    this.setState({
      isMenuVisible: value,
    })
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

  navigateFromMenu = (data, name) => {
    this.props.dispatch(setlead(data))
    this.props.navigation.navigate(name, {
      lead: data,
      purposeTab: 'wanted',
      screen: 'WantedLeads',
      wcmLeadId: data.id,
    })
    this.setIsMenuVisible(false, data)
  }

  closePopup = () => {
    const { openPopup, selectedLead } = this.state
    this.setState({
      openPopup: !openPopup,
      selectedLead: openPopup === false ? {} : selectedLead,
    })
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

  openModalInMeetingMode = (edit = false, id = null) => {
    this.setState({
      active: !this.state.active,
      isFollowUpMode: false,
    })
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
    const { selectedLead } = this.state
    if (selectedLead) {
      var leadId = []
      leadId.push(selectedLead.id)
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
  }

  showStatusFeedbackModal = (value, modalMode) => {
    this.setState({ statusfeedbackModalVisible: value, modalMode })
  }

  goToViewingScreen = () => {
    const { navigation } = this.props
    navigation.navigate('RCMLeadTabs', { screen: 'Viewing' })
  }

  changeStatusType = (status) => {
    this.setState({ statusFilterType: status })
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
      active,
      statusfeedbackModalVisible,
      isFollowUpMode,
      modalMode,
      selectedClientContacts,
      isMultiPhoneModalVisible,
      statusFilterType,
      newActionModal,
      selectedLead,
      isMenuVisible,
      meetings,
      callModal,
    } = this.state
    const { user, navigation } = this.props
    // console.log('Hrellooo', leadsData && leadsData.length && leadsData[0].customer)
    let leadStatus = StaticData.buyRentFilter
    let buyRentFilterType = StaticData.buyRentFilterType
    if (user.organization && user.organization.isPP) leadStatus = StaticData.ppBuyRentFilter

    return (
      <View style={[AppStyles.container, { marginBottom: 25, paddingHorizontal: 0 }]}>
        {/* ******************* TOP FILTER MAIN VIEW ********** */}
        <View style={{ marginBottom: 15 }}>
          <ShortlistedProperties
            openPopup={openPopup}
            closePopup={this.closePopup}
            data={shortListedProperties}
            popupLoading={popupLoading}
          />
          {showSearchBar ? (
            <View style={[styles.filterRow, { paddingBottom: 0, paddingTop: 0, paddingLeft: 0 }]}>
              {/* <View style={styles.idPicker}>
                <PickerComponent
                  placeholder={'NAME'}
                  data={buyRentFilterType}
                  customStyle={styles.pickerStyle}
                  customIconStyle={styles.customIconStyle}
                  onValueChange={this.changeStatusType}
                  selectedItem={statusFilterType}
                />
              </View> */}
              {/* {statusFilterType === 'name' || statusFilterType === 'id' ? (
                <Search
                  containerWidth="75%"
                  placeholder="Search leads here"
                  searchText={searchText}
                  setSearchText={(value) => this.setState({ searchText: value })}
                  showShadow={false}
                  showClearButton={true}
                  returnKeyType={'search'}
                  onSubmitEditing={() => this.fetchLeads()}
                  autoFocus={true}
                  closeSearchBar={() => this.clearAndCloseSearch()}
                />
              ) : (
                <DateSearchFilter
                  applyFilter={this.fetchLeads}
                  clearFilter={() => this.clearAndCloseSearch()}
                />
              )} */}
            </View>
          ) : (
            <View style={[styles.filterRow, { paddingHorizontal: 15 }]}>
              {/* <View style={styles.pickerMain}>
                <PickerComponent
                  placeholder={'Lead Status'}
                  data={leadStatus}
                  customStyle={styles.pickerStyle}
                  customIconStyle={styles.customIconStyle}
                  onValueChange={this.changeStatus}
                  selectedItem={statusFilter}
                />
              </View>
              <View style={styles.stylesMainSort}>
                <TouchableOpacity
                  style={styles.sortBtn}
                  onPress={() => {
                    this.openStatus()
                  }}
                >
                  <Image source={SortImg} style={[styles.sortImg]} />
                </TouchableOpacity>
                <Ionicons
                  style={{ alignSelf: 'center' }}
                  onPress={() => {
                    this.setState({ showSearchBar: true }, () => {
                      this.clearStateValues()
                    })
                  }}
                  name={'ios-search'}
                  size={26}
                  color={AppStyles.colors.primaryColor}
                />
              </View> */}
            </View>
          )}
        </View>
        {leadsData && leadsData.length > 0 ? (
          <FlatList
            data={leadsData}
            contentContainerStyle={styles.paddingHorizontal}
            renderItem={({ item }) => (
              <View>
                {/* {(!user.organization && user.subRole === 'group_management') ||
                (user.organization && !user.organization.isPP) ? ( */}
                <LeadTile
                  updateStatus={this.updateStatus}
                  dispatch={this.props.dispatch}
                  purposeTab={'wanted'}
                  user={user}
                  data={{ ...item }}
                  navigateTo={this.navigateTo}
                  callNumber={this.callNumber}
                  handleLongPress={this.handleLongPress}
                  serverTime={serverTime}
                  displayPhone={false}
                  screen={'Leads'}
                  isMenuVisible={isMenuVisible}
                  setIsMenuVisible={(value, data) => this.setIsMenuVisible(value, data)}
                  navigateFromMenu={this.navigateFromMenu}
                  navigateToAssignLead={this.checkAssignedLead}
                  // checkAssignedLead={(lead) => this.checkAssignedLead(lead)}
                  assignLeadTo={this.assignToLead}
                  wanted={true}
                  goToHistory={this.goToHistory}
                  getCallHistory={this.getCallHistory}
                />
                {/* ) : (
                  <PPLeadTile
                    updateStatus={this.updateStatus}
                    dispatch={this.props.dispatch}
                    purposeTab={'rent'}
                    user={user}
                    data={{ ...item }}
                    navigateTo={this.navigateTo}
                    callNumber={this.callNumber}
                    handleLongPress={this.handleLongPress}
                    changeLeadStatus={this.changeLeadStatus}
                    redirectToCompare={this.redirectToCompare}
                    PPLeadStatusUpdate={this.PPLeadStatusUpdate}
                    fetchShortlistedProperties={this.fetchShortlistedProperties}
                  />
                )} */}
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
          <Loader loading={loading} />
        )}
        <OnLoadMoreComponent onEndReached={onEndReachedLoader} />
        {user.organization && user.organization.isPP ? (
          <Fab
            active="true"
            containerStyle={{ zIndex: 20 }}
            style={{ backgroundColor: AppStyles.colors.primaryColor }}
            position="bottomRight"
            onPress={() => this.goToFormPage('AddRCMLead', 'RCM', null, null)}
          >
            <Ionicons name="md-add" color="#ffffff" />
          </Fab>
        ) : (
          <FAB.Group
            open={open}
            icon="plus"
            style={{ marginBottom: 16 }}
            fabStyle={{ backgroundColor: AppStyles.colors.primaryColor }}
            color={AppStyles.bgcWhite.backgroundColor}
            actions={[
              {
                icon: 'plus',
                label: 'Buy/Rent Lead',
                color: AppStyles.colors.primaryColor,
                onPress: () => {
                  if (this.props.route?.params?.client) {
                    this.goToFormPage(
                      'AddRCMLead',
                      'RCM',
                      this.props.route?.params?.client,
                      this.props.route?.params?.client?.id
                    )
                  } else {
                    this.goToFormPage('AddRCMLead', 'RCM', null, null)
                  }
                },
              },
              {
                icon: 'plus',
                label: 'Investment Lead',
                color: AppStyles.colors.primaryColor,
                onPress: () => {
                  if (this.props.route?.params?.client) {
                    this.goToFormPage(
                      'AddRCMLead',
                      'CM',
                      this.props.route?.params?.client,
                      this.props.route?.params?.client?.id
                    )
                  } else {
                    this.goToFormPage('AddCMLead', 'CM', null, null)
                  }
                },
              },
            ]}
            onStateChange={({ open }) => this.setState({ open })}
          />
        )}

        <MultiplePhoneOptionModal
          isMultiPhoneModalVisible={isMultiPhoneModalVisible}
          contacts={selectedClientContacts.payload}
          showMultiPhoneModal={this.showMultiPhoneModal}
          handlePhoneSelectDone={this.handlePhoneSelectDone}
        />

        <StatusFeedbackModal
          visible={statusfeedbackModalVisible}
          showFeedbackModal={(value, modalMode) => this.showStatusFeedbackModal(value, modalMode)}
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

        <HistoryModal
          navigation={navigation}
          data={meetings}
          closePopup={this.goToHistory}
          openPopup={callModal}
          getCallHistory={this.getCallHistory}
        />

        <SubmitFeedbackOptionsModal
          showModal={newActionModal}
          modalMode={modalMode}
          setShowModal={(value) => this.setNewActionModal(value)}
          performFollowUp={this.openModalInFollowupMode}
          performReject={this.goToRejectForm}
          //call={this.callAgain}
          goToViewingScreen={this.goToViewingScreen}
          leadType={'RCM'}
        />
        <MeetingFollowupModal
          closeModal={() => this.closeMeetingFollowupModal()}
          active={active}
          isFollowUpMode={isFollowUpMode}
          lead={selectedLead}
          leadType={'RCM'}
        />
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
    count: store.listings.count,
    contacts: store.contacts.contacts,
    PPBuyNotification: store.Notification.PPBuyNotification,
  }
}
export default connect(mapStateToProps)(WantedLeads)
