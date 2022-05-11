/** @format */

import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import { ActionSheet } from 'native-base'
import React from 'react'
import { FlatList, Image, TouchableOpacity, View } from 'react-native'
import { setLeadsDropdown } from '../../actions/leadsDropdown'
import { FAB } from 'react-native-paper'
import { connect } from 'react-redux'
import SortImg from '../../../assets/img/sort.png'
import { setCallPayload } from '../../actions/callMeetingFeedback'
import { setlead } from '../../actions/lead'
import { getListingsCount } from '../../actions/listings'
import { getItem, storeItem } from '../../actions/user'
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

    if (client) {
      this.fetchAddedLeads(client)
    } else {
      this._unsubscribe = this.props.navigation.addListener('focus', () => {
        dispatch(getListingsCount())
        this.getServerTime()
        this.onFocus()
        this.setFabActions()
      })
    }
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
    const { page, leadsData, statusFilter } = this.state
    this.setState({ loading: true })
    axios
      .get(`/api/leads/projects?customerId=${client.id}`)
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
    const { hasBooking = false, screen } = this.props.route.params // for Deals we need to set filter to closed won
    const sortValue = await this.getSortOrderFromStorage()
    let statusValue = ''
    if (hasBooking) {
      statusValue = await getItem('statusFilterInvestDeals')
    } else {
      statusValue = await getItem('statusFilterInvestLeads')
    }
    if (statusValue) {
      this.setState({ statusFilter: String(statusValue), sort: sortValue }, () => {
        this.fetchLeads()
      })
    } else {
      if (screen === 'MyDeals') {
        storeItem('statusFilterInvest', 'all')
        this.setState({ statusFilter: 'all', sort: sortValue }, () => {
          this.fetchLeads()
        })
      } else {
        storeItem('statusFilterInvest', 'open')
        this.setState({ statusFilter: 'open', sort: sortValue }, () => {
          this.fetchLeads()
        })
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
    } = this.state
    const { hasBooking, navFrom } = this.props.route.params
    const { user } = this.props
    this.setState({ loading: true })
    let query = ``
    if (showSearchBar) {
      if (statusFilterType === 'name' && searchText !== '') {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads/projects?searchBy=name&q=${searchText}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads/projects?searchBy=name&q=${searchText}&pageSize=${pageSize}&page=${page}${pageType}`)
      } else if (statusFilterType === 'id' && searchText !== '') {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads/projects?id=${searchText}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads/projects?id=${searchText}&pageSize=${pageSize}&page=${page}${pageType}`)
      } else {
        user.armsUserRole && user.armsUserRole.groupManger
          ? (query = `/api/leads/projects?startDate=${fromDate}&endDate=${toDate}&showAllLeads=true&pageSize=${pageSize}&page=${page}`)
          : (query = `/api/leads/projects?startDate=${fromDate}&endDate=${toDate}&pageSize=${pageSize}&page=${page}${pageType}`)
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
    navigation.navigate(page, { pageName: status, client, name: client && client.customerName })
  }

  changeStatus = (status) => {
    const { hasBooking = false } = this.props.route?.params
    this.clearStateValues()
    if (hasBooking) {
      this.setState({ statusFilter: status, leadsData: [] }, () => {
        storeItem('statusFilterInvestDeals', status)
        this.fetchLeads()
      })
    } else {
      this.setState({ statusFilter: status, leadsData: [] }, () => {
        storeItem('statusFilterInvestLeads', status)
        this.fetchLeads()
      })
    }
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
    console.log('params', this.props.route.params)
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

  sendStatus = (status) => {
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

  changeStatusType = (status) => {
    this.setState({ statusFilterType: status })
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
    } = this.props
    const {
      screen,
      hasBooking = false,
      navFrom = null,
      hideCloseLostFilter,
    } = this.props.route.params
    let buyRentFilterType = StaticData.buyRentFilterType

    return (
      <View style={[AppStyles.container, { marginBottom: 25, paddingHorizontal: 0 }]}>
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
            <View
              style={[
                styles.filterRow,
                {
                  //paddingHorizontal: 15,
                  justifyContent: 'space-between',
                },
              ]}
            >
              <View style={styles.pickerMain}>
                <PickerComponent
                  placeholder={'Lead Status'}
                  data={
                    hasBooking
                      ? StaticData.investmentFilterDeals
                      : hideCloseLostFilter
                      ? StaticData.investmentFilterLeadsAddTask
                      : StaticData.investmentFilterLeads
                  }
                  customStyle={styles.pickerStyle}
                  customIconStyle={styles.customIconStyle}
                  onValueChange={this.changeStatus}
                  selectedItem={statusFilter}
                />
              </View>

              {/* <View style={styles.iconRow}>
                <Ionicons name="funnel-outline" color={AppStyles.colors.primaryColor} size={24} />
              </View>
              <View style={styles.pageTypeRow}>
                <PickerComponent
                  placeholder={hasBooking ? 'Deal Filter' : 'Lead Filter'}
                  data={
                    hasBooking
                      ? getIsTerminalUser
                        ? StaticData.filterDealsValueProjectTerminal
                        : StaticData.filterDealsValueProject
                      : getIsTerminalUser
                        ? StaticData.filterLeadsValueProjectTerminal
                        : StaticData.filterLeadsValueProject
                  }
                  customStyle={styles.pickerStyle}
                  customIconStyle={styles.customIconStyle}
                  onValueChange={this.changePageType}
                  selectedItem={pageType}
                  showPickerArrow={false}
                />
              </View>*/}
              <View style={styles.verticleLine} /> 

              <View style={[styles.stylesMainSort, { marginHorizontal: 5 }]}>
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
          <LoadingNoResult loading={loading} />
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
    leadsDropdown: store.leadsDropdown.leadsDropdown,
  }
}
export default connect(mapStateToProps)(InvestLeads)
