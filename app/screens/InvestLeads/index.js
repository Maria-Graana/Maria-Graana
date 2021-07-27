/** @format */

import React from 'react'
import styles from './style'
import moment from 'moment'
import { View, Text, TouchableOpacity, Image, SafeAreaView, Linking, FlatList } from 'react-native'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles'
import PickerComponent from '../../components/Picker/index'
import { ActionSheet } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import SortImg from '../../../assets/img/sort.png'
import LoadingNoResult from '../../components/LoadingNoResult'
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent'
import LeadTile from '../../components/LeadTile'
import axios from 'axios'
import helper from '../../helper'
import StaticData from '../../StaticData'
import { FAB } from 'react-native-paper'
import Loader from '../../components/loader'
import SortModal from '../../components/SortModal'
import { setlead } from '../../actions/lead'
import Search from '../../components/Search'
import Ability from '../../hoc/Ability'
import { getItem, storeItem } from '../../actions/user'
import { getListingsCount } from '../../actions/listings'
import MeetingFollowupModal from '../../components/MeetingFollowupModal'
import StatusFeedbackModal from '../../components/StatusFeedbackModal'
import MultiplePhoneOptionModal from '../../components/MultiplePhoneOptionModal'
import DateSearchFilter from '../../components/DateSearchFilter'

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
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
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
    this.setState({ loading: true })
    let query = ``
    if (showSearchBar) {
      if (statusFilterType === 'name' && searchText !== '') {
        query = `/api/leads/projects?searchBy=name&q=${searchText}&pageSize=${pageSize}&page=${page}`
      } else if (statusFilterType === 'id' && searchText !== '') {
        query = `/api/leads/projects?id=${searchText}&pageSize=${pageSize}&page=${page}`
      } else {
        query = `/api/leads/projects?startDate=${fromDate}&endDate=${toDate}&pageSize=${pageSize}&page=${page}`
      }
    } else {
      query = `/api/leads/projects?status=${statusFilter}${sort}&pageSize=${pageSize}&page=${page}`
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
    this.clearStateValues()
    this.setState({ statusFilter: status, leadsData: [] }, () => {
      storeItem('statusFilterInvest', status)
      this.fetchLeads()
    })
  }

  navigateTo = (data) => {
    const { navigation } = this.props
    this.props.dispatch(setlead(data))
    let page = ''
    if (data.readAt === null) {
      this.props.navigation.navigate('LeadDetail', { lead: data, purposeTab: 'invest' })
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

      navigation.navigate('CMLeadTabs', {
        screen: page,
        params: { lead: data },
      })
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
            screen: 'InvestLeads',
          })
        }
      } else {
        helper.errorToast('Only the leads assigned to you can be shared')
      }
    } else {
      helper.errorToast('Something went wrong!')
    }
  }

  callNumber = (data) => {
    const { contacts } = this.props
    this.setState({ selectedLead: data }, () => {
      // call api here
      if (data && data.customer) {
        axios
          .get(`/api/customer/getNumbers?customerId=${data.customer.id}`)
          .then((res) => {
            let selectedClientContacts = helper.createContactPayload(res.data)
            this.setState({ selectedClientContacts }, () => {
              if (selectedClientContacts.payload && selectedClientContacts.payload.length > 1) {
                // multiple numbers to select
                this.showMultiPhoneModal(true)
              } else {
                this.showStatusFeedbackModal(true) // user has only one number so direct call can be made
                this.sendCallStatus()
                helper.callNumber(selectedClientContacts, contacts)
              }
            })
          })
          .catch((error) => {
            console.log(error)
          })
      }
    })
  }

  showMultiPhoneModal = (value) => {
    this.setState({ isMultiPhoneModalVisible: value })
  }

  handlePhoneSelectDone = (phone) => {
    const { contacts } = this.props
    const copySelectedClientContacts = { ...this.state.selectedClientContacts }
    if (phone) {
      copySelectedClientContacts.phone = phone.number
      copySelectedClientContacts.url = 'tel:' + phone.number
      this.setState(
        { selectedClientContacts: copySelectedClientContacts, isMultiPhoneModalVisible: false },
        () => {
          this.showStatusFeedbackModal(true)
          this.sendCallStatus()
          helper.callNumber(copySelectedClientContacts, contacts)
        }
      )
    }
  }

  sendCallStatus = () => {
    const start = moment().format()
    const { selectedLead, selectedClientContacts } = this.state
    let body = {
      start: start,
      end: start,
      time: start,
      date: start,
      taskType: 'called',
      subject: 'Call to client ' + selectedLead.customer.customerName,
      customerId: selectedLead.customer.id,
      leadId: selectedLead.id, // For CM send leadID and armsLeadID for RCM
      calledNumber: selectedClientContacts.phone ? selectedClientContacts.phone : null,
      taskCategory: 'leadTask',
    }
    axios.post(`api/leads/project/meeting`, body).then((res) => {
      this.setCurrentCall(res.data)
    })
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
        screen: 'LeadDetail',
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
    const { navigation, lead } = this.props
    const { selectedLead } = this.state
    if (selectedLead) {
      var leadId = []
      leadId.push(selectedLead.id)
      axios
        .patch(`/api/leads/project`, body, { params: { id: leadId } })
        .then((res) => {
          helper.successToast(`Lead Closed`)
          navigation.navigate('Leads')
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  showStatusFeedbackModal = (value) => {
    this.setState({ statusfeedbackModalVisible: value })
  }

  setCurrentCall = (call) => {
    this.setState({ currentCall: call, modalMode: 'call' })
  }

  sendStatusCall = (status, id) => {
    const { selectedLead } = this.state
    let body = {
      response: status,
      comments: status,
      leadId: selectedLead.id,
    }
    axios.patch(`/api/diary/update?id=${id}`, body).then((res) => {})
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
      serverTime,
      active,
      statusfeedbackModalVisible,
      currentCall,
      isFollowUpMode,
      modalMode,
      selectedLead,
      selectedClientContacts,
      isMultiPhoneModalVisible,
      statusFilterType,
      comment,
    } = this.state
    const { user, lead } = this.props
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
          )}
        </View>
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
                callNumber={this.callNumber}
                handleLongPress={this.handleLongPress}
                serverTime={serverTime}
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
              onPress: () => this.goToFormPage('AddRCMLead', 'RCM', null),
            },
            {
              icon: 'plus',
              label: 'Investment Lead',
              color: AppStyles.colors.primaryColor,
              onPress: () => this.goToFormPage('AddCMLead', 'CM', null),
            },
          ]}
          onStateChange={({ open }) => this.setState({ open })}
        />
        <SortModal
          sendStatus={this.sendStatus}
          openStatus={this.openStatus}
          data={StaticData.sortData}
          doneStatus={activeSortModal}
          sort={sort}
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
          sendStatus={(comment, id) => this.sendStatusCall(comment, id)}
          addFollowup={(value) => this.openModalInFollowupMode(value)}
          addMeeting={() => this.openModalInMeetingMode()}
          leadType={'CM'}
          currentCall={currentCall}
        />
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    contacts: store.contacts.contacts,
  }
}
export default connect(mapStateToProps)(InvestLeads)
