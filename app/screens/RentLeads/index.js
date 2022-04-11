/** @format */

import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import moment from 'moment'
import { ActionSheet, Fab } from 'native-base'
import React from 'react'
import { FlatList, Image, Linking, TouchableOpacity, View } from 'react-native'
import { FAB } from 'react-native-paper'
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
    const { dispatch } = this.props
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      dispatch(getListingsCount())
      this.getServerTime()
      this.onFocus()
      this.setFabActions()
    })
  }

  componentWillUnmount() {
    this.clearStateValues()
    this.showMultiPhoneModal(false)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isMultiPhoneModalVisible !== prevProps.isMultiPhoneModalVisible) {
      this.showMultiPhoneModal(this.props.isMultiPhoneModalVisible)
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
    } = this.state
    const { permissions, user } = this.props
    this.setState({ loading: true })
    const { hasBooking, navFrom } = this.props.route.params
    let isAiraPermission = helper.getAiraPermission(permissions)
    let query = ``
    if (showSearchBar) {
      if (statusFilterType === 'name' && searchText !== '') {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads?purpose[]=rent&searchBy=name&q=${searchText}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads?purpose[]=rent&searchBy=name&q=${searchText}&pageSize=${pageSize}&page=${page}${pageType}`)
      } else if (statusFilterType === 'id' && searchText !== '') {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads?purpose[]=rent&id=${searchText}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads?purpose[]=rent&id=${searchText}&pageSize=${pageSize}&page=${page}${pageType}`)
      } else {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads?purpose[]=rent&startDate=${fromDate}&endDate=${toDate}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads?purpose[]=rent&startDate=${fromDate}&endDate=${toDate}&pageSize=${pageSize}&page=${page}${pageType}`)
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
    if (isAiraPermission && user.armsUserRole && !user.armsUserRole.groupManger) {
      query = `${query}&aira=true`
    }
    // console.log(query)
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
      pageName: status,
      client: copyClient,
      name: copyClient && copyClient.customerName,
      purpose: 'rent',
    })
  }

  sendStatus = (status) => {
    this.setState({ sort: status, activeSortModal: !this.state.activeSortModal }, () => {
      storeItem('sortRent', status)
      this.fetchLeads()
    })
  }

  changeStatus = (status) => {
    this.clearStateValues()
    this.setState({ statusFilter: status, leadsData: [] }, () => {
      storeItem('statusFilterRent', status)
      this.fetchLeads()
    })
  }

  changePageType = (value) => {
    this.clearStateValues()
    this.setState({ pageType: value, leadsData: [] }, () => {
      this.fetchLeads()
    })
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
      let page = ''
      if (this.props.route.params?.screen === 'MyDeals') {
        this.props.navigation.navigate('LeadDetail', {
          lead: data,
          purposeTab: 'rent',
          screenName: screen,
        })
      } else if (data.readAt === null) {
        this.props.navigation.navigate('LeadDetail', {
          lead: data,
          purposeTab: 'rent',
          screenName: screen,
        })
      } else {
        if (data.status === 'open') {
          page = 'Match'
        }
        if (data.status === 'viewing') {
          page = 'Viewing'
        }
        if (data.status === 'offer') {
          page = 'Offer'
        }
        if (data.status === 'propsure') {
          page = 'Propsure'
        }
        if (data.status === 'payment') {
          page = 'Payment'
        }
        if (
          data.status === 'payment' ||
          data.status === 'closed_won' ||
          data.status === 'closed_lost'
        ) {
          page = 'Payment'
        }
        if (data && data.requiredProperties) {
          this.props.navigation.navigate('PropertyTabs', {
            screen: page,
            params: { lead: data },
          })
        } else {
          this.props.navigation.navigate('RCMLeadTabs', {
            screen: page,
            params: { lead: data },
          })
        }
      }
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

  changeStatusType = (status) => {
    this.setState({ statusFilterType: status })
  }

  setFabActions = () => {
    const { createBuyRentLead, createProjectLead } = this.state
    let fabActions = []
    if (createBuyRentLead) {
      fabActions.push({
        icon: 'plus',
        label: 'Buy/Rent Lead',
        color: AppStyles.colors.primaryColor,
        onPress: () => this.goToFormPage('AddRCMLead', 'RCM', null),
      })
    }
    if (createProjectLead) {
      fabActions.push({
        icon: 'plus',
        label: 'Investment Lead',
        color: AppStyles.colors.primaryColor,
        onPress: () => this.goToFormPage('AddCMLead', 'CM', null),
      })
    }
    this.setState({
      fabActions: fabActions,
    })
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
    } = this.state
    const { user, navigation, permissions, dispatch, isMultiPhoneModalVisible, getIsTerminalUser } =
      this.props
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
        {/* ******************* TOP FILTER MAIN VIEW ********** */}
        <View style={{ marginBottom: 15 }}>
          {showSearchBar ? (
            <View style={[styles.filterRow, { paddingBottom: 0, paddingTop: 0, paddingLeft: 0 }]}>
              <View style={styles.idPicker}>
                <PickerComponent
                  placeholder={'NAME'}
                  data={buyRentFilterType}
                  customStyle={styles.pickerStyle}
                  customIconStyle={styles.customIconStyle}
                  onValueChange={this.changeStatusType}
                  selectedItem={statusFilterType}
                />
              </View>
              {statusFilterType === 'name' || statusFilterType === 'id' ? (
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
              )}
            </View>
          ) : (
            <View style={[styles.filterRow, { paddingHorizontal: 15 }]}>
              {/* {hasBooking ? (
                <View style={styles.emptyViewWidth}></View>
              ) : ( */}
              <View style={styles.pickerMain}>
                <PickerComponent
                  placeholder={'Lead Status'}
                  data={
                    hasBooking
                      ? StaticData.buyRentFilterDeals
                      : hideCloseLostFilter
                      ? StaticData.buyRentFilterAddTask
                      : StaticData.buyRentFilter
                  }
                  customStyle={styles.pickerStyle}
                  customIconStyle={styles.customIconStyle}
                  onValueChange={this.changeStatus}
                  selectedItem={statusFilter}
                />
              </View>
              {/* )} */}

              <View style={styles.iconRow}>
                <Ionicons name="funnel-outline" color={AppStyles.colors.primaryColor} size={24} />
              </View>

              <View style={styles.pageTypeRow}>
                <PickerComponent
                  placeholder={hasBooking ? 'Deal Filter' : 'Lead Filter'}
                  data={
                    hasBooking
                      ? getIsTerminalUser
                        ? StaticData.filterDealsValueTerminal
                        : StaticData.filterDealsValue
                      : getIsTerminalUser
                      ? StaticData.filterLeadsValueTerminal
                      : StaticData.filterLeadsValue
                  }
                  customStyle={styles.pickerStyle}
                  customIconStyle={styles.customIconStyle}
                  onValueChange={this.changePageType}
                  selectedItem={pageType}
                  showPickerArrow={false}
                />
              </View>
              <View style={styles.verticleLine} />
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
              </View>
            </View>
          )}
        </View>
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
                        : dispatch(callNumberFromLeads(data, 'BuyRent')).then((res) => {
                            if (res !== null) {
                              this.showMultiPhoneModal(true)
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
          isMultiPhoneModalVisible={isMultiPhoneModalVisible}
          showMultiPhoneModal={(value) => this.showMultiPhoneModal(value)}
          navigation={navigation}
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
    PPBuyNotification: store.Notification.PPBuyNotification,
    isMultiPhoneModalVisible: store.diary.isMultiPhoneModalVisible,
    contacts: store.contacts.contacts,
    permissions: store.user.permissions,
    getIsTerminalUser: store.user.getIsTerminalUser,
  }
}
export default connect(mapStateToProps)(RentLeads)
