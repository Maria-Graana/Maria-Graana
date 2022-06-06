/** @format */

import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import { ActionSheet, Fab } from 'native-base'
import React from 'react'
import { FlatList, Image, TouchableOpacity, View } from 'react-native'
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

var BUTTONS = [
  'Assign to team member',
  'Share lead with other agent',
  'Create new Investment lead for this client',
  'Cancel',
]
var CANCEL_INDEX = 3

class AvailableUnitLead extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
    }
  }

  componentDidMount() {
    const { dispatch, route } = this.props
    const { client } = route.params
    if (client) {
      this.fetchAddedLeads(client)
    } else {
      this._unsubscribe = this.props.navigation.addListener('focus', () => {
        dispatch(getListingsCount())
        this.getServerTime()
        this.onFocus()
      })
    }
  }

  componentWillUnmount() {
    this.clearStateValues()
  }

  createNewProjectLead = async (client, project, unit) => {
    const { dispatch, navigation } = this.props
    const phones =
      client && client.customerContacts && client.customerContacts.map((item) => item.phone)
    const payload = {
      customerId: client && client.id,
      cityId: 3,
      projectId: project.value,
      projectName: project.name,
      projectType: unit.project.type,
      description: unit.name,
      phones: phones,
      minPrice: StaticData.PricesProject[0],
      maxPrice: StaticData.PricesProject[StaticData.PricesProject.length - 1],
    }
    await axios
      .post(`/api/leads/project`, payload)
      .then((response) => {
        axios
          .get(`/api/leads/project/byId?id=${response.data.leadId}`)
          .then((res) => {
            dispatch(setlead(res.data))
            navigation.replace('CMLeadTabs', {
              screen: 'Payments',
              params: {
                lead: res.data,
                client: client,
                name: client.firstName + ' ' + client.lastName,
                unitData: unit,
              },
            })
          })
          .catch((error) => {
            console.log('/api/leads/project/byId?id - Error', error)
          })
      })
      .catch((error) => {
        console.log('/api/leads/project', error)
      })
  }

  fetchAddedLeads = (client) => {
    const { page, leadsData, statusFilter } = this.state
    const { clientDetails } = this.props.route.params
    this.setState({ loading: true })

    let url
    if (clientDetails) {
      url = `/api/leads/projects?customerId=${client.id}&customerLeads=true`
    } else {
      url = `/api/leads/projects?customerId=${client.id}&status=open`
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
      .catch(() => {
        this.setState({
          loading: false,
        })
      })
  }

  onFocus = async () => {
    const sortValue = await this.getSortOrderFromStorage()
    const statusValue = await getItem('statusFilterInvest')
    if (statusValue) {
      this.setState({ statusFilter: String(statusValue), sort: sortValue }, () => {
        this.fetchLeads()
      })
    } else {
      storeItem('statusFilterInvest', 'all')
      this.setState({ statusFilter: 'all', sort: sortValue }, () => {
        this.fetchLeads()
      })
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
    } = this.state
    const { hasBooking, client } = this.props.route.params
    this.setState({ loading: true })
    let query = ``
    if (showSearchBar) {
      if (statusFilterType === 'name' && searchText !== '') {
        query = `/api/leads/projects?searchBy=name&q=${searchText}&pageSize=${pageSize}&page=${page}&hasBooking=${hasBooking}&customerId=${client.id}`
      } else if (statusFilterType === 'id' && searchText !== '') {
        query = `/api/leads/projects?id=${searchText}&pageSize=${pageSize}&page=${page}&hasBooking=${hasBooking}&customerId=${client.id}`
      } else {
        query = `/api/leads/projects?startDate=${fromDate}&endDate=${toDate}&pageSize=${pageSize}&page=${page}&hasBooking=${hasBooking}&customerId=${client.id}`
      }
    } else {
      if (statusFilter === 'in_progress') {
        query = `/api/leads/projects?status=${statusFilter}${sort}&pageSize=${pageSize}&page=${page}&hasBooking=${hasBooking}&customerId=${client.id}`
      } else {
        query = `/api/leads/projects?status=${statusFilter}${sort}&pageSize=${pageSize}&page=${page}&hasBooking=${hasBooking}&customerId=${client.id}`
      }
    }
    axios
      .get(`${query}`)
      .then((res) => {
        this.setState(
          {
            leadsData: page === 1 ? res.data.rows : [...leadsData, ...res.data.rows],
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
      .catch(() => {
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
    this.clearStateValues()
    this.setState({ statusFilter: status, leadsData: [] }, () => {
      storeItem('statusFilterInvest', status)
      this.fetchLeads()
    })
  }

  navigateFromMenu = (data, name) => {
    this.props.dispatch(setlead(data))
    this.props.navigation.navigate(name, {
      lead: data,
      purposeTab: 'invest',
      screen: 'InvestLeads',
      cmLeadId: data.id,
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
    const { screen } = this.props.route.params
    const { navigation, route } = this.props
    const unitData = route.params.unitData

    this.props.dispatch(setlead(data))
    let page = ''
    if (data.readAt === null) {
      this.props.navigation.navigate('LeadDetail', {
        lead: data,
        purposeTab: 'invest',
        screenName: screen,
      })
    } else {
      if (
        data.status === 'token' ||
        data.status === 'payment' ||
        data.status === 'closed_won' ||
        data.status === 'closed_lost'
      ) {
        page = 'Payments'
      } else {
        page = 'Meetings'
      }

      navigation.replace('CMLeadTabs', {
        screen: unitData ? 'Payments' : page,
        params: { lead: data, unitData: unitData, screenName: screen },
      })
    }
  }

  sendStatus = (status) => {
    this.setState({ sort: status, activeSortModal: !this.state.activeSortModal }, () => {
      storeItem('sortInvest', status)
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
    const { navigation } = this.props
    const { selectedLead } = this.state
    if (selectedLead) {
      var leadId = []
      leadId.push(selectedLead.id)
      axios
        .patch(`/api/leads/project`, body, { params: { id: leadId } })
        .then(() => {
          helper.successToast(`Lead Closed`)
          navigation.navigate('Leads')
          this.fetchLeads()
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  showStatusFeedbackModal = (value) => {
    this.setState({ statusfeedbackModalVisible: value })
  }

  changeStatusType = (status) => {
    this.setState({ statusFilterType: status })
  }

  callAgain = (data) => {
    const { contacts, dispatch } = this.props
    this.setState({ selectedLead: data }, () => {
      if (data && data.customer) {
        let selectedClientContacts = helper.createContactPayload(data.customer)
        this.setState({ selectedClientContacts, calledOn: 'phone' }, () => {
          if (selectedClientContacts.payload && selectedClientContacts.payload.length > 1) {
            //  multiple numbers to select
            this.showMultiPhoneModal(true)
          } else {
            dispatch(
              setCallPayload(
                selectedClientContacts ? selectedClientContacts.phone : null,
                'phone',
                data
              )
            )
            helper.callNumber(selectedClientContacts, contacts)
            this.showStatusFeedbackModal(true, 'call')
          }
        })
      }
    })
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

  bookUnit = () => {
    const { navigation } = this.props
    navigation.navigate('CMLeadTabs', { screen: 'Payments' })
  }

  render() {
    const {
      leadsData,
      statusFilter,
      loading,
      activeSortModal,
      sort,
      totalLeads,
      onEndReachedLoader,
      searchText,
      showSearchBar,
      serverTime,
      active,
      statusfeedbackModalVisible,
      isFollowUpMode,
      modalMode,
      selectedLead,
      selectedClientContacts,
      isMultiPhoneModalVisible,
      statusFilterType,
      newActionModal,
      isMenuVisible,
    } = this.state
    const { user, route } = this.props
    const { client, projectData, unitData } = route.params
    let buyRentFilterType = StaticData.buyRentFilterType

    return (
      <View style={[AppStyles.container, { marginBottom: 25, paddingHorizontal: 0 }]}>
        {/* ******************* TOP FILTER MAIN VIEW ********** */}
        <View style={{ marginBottom: 15 }}>
          {/* {showSearchBar ? (
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
              <View style={styles.pickerMain}>
                <PickerComponent
                  placeholder={'Lead Status'}
                  data={StaticData.investmentFilter}
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
              </View>
            </View>
          )} */}
        </View>
        <Fab
          active="true"
          containerStyle={{ zIndex: 20 }}
          style={{ backgroundColor: AppStyles.colors.primaryColor }}
          position="bottomRight"
          onPress={() => {
            this.createNewProjectLead(client, projectData, unitData)
          }}
        >
          <Ionicons name="md-add" color="#ffffff" />
        </Fab>
        {leadsData && leadsData.length > 0 ? (
          <FlatList
            data={leadsData}
            contentContainerStyle={styles.paddingHorizontal}
            renderItem={({ item }) => (
              <LeadTile
                dispatch={this.props.dispatch}
                purposeTab={'invest'}
                user={user}
                data={item}
                navigateTo={this.navigateTo}
                navigateFromMenu={this.navigateFromMenu}
                callNumber={this.callAgain}
                handleLongPress={this.handleLongPress}
                serverTime={serverTime}
                screen={'AvailableUnitLead'}
                isMenuVisible={isMenuVisible}
                setIsMenuVisible={(value, data) => this.setIsMenuVisible(value, data)}
                checkAssignedLead={(lead) => this.checkAssignedLead(lead)}
                navigateToShareScreen={(data) => this.navigateToShareScreen(data)}
              />
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

        <SortModal
          sendStatus={this.sendStatus}
          openStatus={this.openStatus}
          data={StaticData.sortData}
          doneStatus={activeSortModal}
          sort={sort}
        />

        <SubmitFeedbackOptionsModal
          showModal={newActionModal}
          modalMode={modalMode}
          setShowModal={(value) => this.setNewActionModal(value)}
          performMeeting={() => this.openModalInMeetingMode()}
          performFollowUp={this.openModalInFollowupMode}
          performReject={this.goToRejectForm}
          call={() => this.callAgain(selectedLead)}
          bookUnit={this.bookUnit}
          leadType={'CM'}
        />

        <MultiplePhoneOptionModal
          isMultiPhoneModalVisible={isMultiPhoneModalVisible}
          contacts={selectedClientContacts.payload}
          showMultiPhoneModal={this.showMultiPhoneModal}
          handlePhoneSelectDone={this.handlePhoneSelectDone}
        />

        <MeetingFollowupModal
          closeModal={() => this.closeMeetingFollowupModal()}
          active={active}
          isFollowUpMode={isFollowUpMode}
          lead={selectedLead}
          leadType={'CM'}
        />

        <StatusFeedbackModal
          visible={statusfeedbackModalVisible}
          showFeedbackModal={(value, modalMode) => this.showStatusFeedbackModal(value, modalMode)}
          commentsList={
            modalMode === 'call'
              ? StaticData.commentsFeedbackCall
              : modalMode === 'meeting'
              ? StaticData.commentsFeedbackMeeting
              : StaticData.leadClosedCommentsFeedback
          }
          modalMode={modalMode}
          rejectLead={(body) => this.rejectLead(body)}
          setNewActionModal={(value) => this.setNewActionModal(value)}
          leadType={'CM'}
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
  }
}
export default connect(mapStateToProps)(AvailableUnitLead)
