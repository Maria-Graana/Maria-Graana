/** @format */

import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import React from 'react'
import { FlatList, Image, Linking, TouchableOpacity, View } from 'react-native'
import { FAB } from 'react-native-paper'
import { connect } from 'react-redux'
import SortImg from '../../../assets/img/sort.png'
import { setlead } from '../../actions/lead'
import { getItem, storeItem } from '../../actions/user'
import AppStyles from '../../AppStyles'
import DateSearchFilter from '../../components/DateSearchFilter'
import LeadTile from '../../components/LeadTile'
import LoadingNoResult from '../../components/LoadingNoResult'
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent'
import PickerComponent from '../../components/Picker/index'
import Search from '../../components/Search'
import SortModal from '../../components/SortModal'
import helper from '../../helper'
import StaticData from '../../StaticData'
import styles from './style'

var BUTTONS = ['Share lead with other agent', 'Create new Buy lead for this client', 'Cancel']
var CANCEL_INDEX = 2

class PropertyLead extends React.Component {
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
      statusFilterType: 'id',
    }
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
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
    let query = ``
    if (showSearchBar) {
      if (statusFilterType === 'name' && searchText !== '') {
        query = `/api/leads?leadWithCurrentAgentProps=true&searchBy=name&q=${searchText}&pageSize=${pageSize}&page=${page}`
      } else if (statusFilterType === 'id' && searchText !== '') {
        query = `/api/leads?leadWithCurrentAgentProps=true&id=${searchText}&pageSize=${pageSize}&page=${page}`
      } else {
        query = `/api/leads?leadWithCurrentAgentProps=true&startDate=${fromDate}&endDate=${toDate}&pageSize=${pageSize}&page=${page}`
      }
    } else {
      query = `/api/leads?leadWithCurrentAgentProps=true&status=${statusFilter}${sort}&pageSize=${pageSize}&page=${page}`
    }
    axios
      .get(`${query}`)
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
      purpose: 'sale',
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
    this.props.dispatch(setlead(data))
    let page = ''
    if (data.readAt === null) {
      this.props.navigation.navigate('LeadDetail', { lead: data, purposeTab: 'property' })
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
      this.props.navigation.navigate('PropertyTabs', {
        screen: page,
        params: { lead: data },
      })
    }
  }

  handleLongPress = (val) => {}

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

  callNumber = (url) => {
    if (url != 'tel:null') {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            console.log("Can't handle url: " + url)
          } else {
            return Linking.openURL(url)
          }
        })
        .catch((err) => console.error('An error occurred', err))
    } else {
      helper.errorToast(`No Phone Number`)
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
      statusFilterType,
    } = this.state
    const { user } = this.props
    let leadStatus = StaticData.buyRentFilter
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
                updateStatus={this.updateStatus}
                dispatch={this.props.dispatch}
                purposeTab={'buy'}
                user={user}
                data={item}
                navigateTo={this.navigateTo}
                callNumber={this.callNumber}
                handleLongPress={this.handleLongPress}
                displayPhone={false}
                propertyLead={true}
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
        {/* <FAB.Group
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
              onPress: () => this.goToFormPage('AddRCMLead', 'RCM', null, null),
            },
            {
              icon: 'plus',
              label: 'Investment Lead',
              color: AppStyles.colors.primaryColor,
              onPress: () => this.goToFormPage('AddCMLead', 'CM', null, null),
            },
          ]}
          onStateChange={({ open }) => this.setState({ open })}
        /> */}
        <SortModal
          sendStatus={this.sendStatus}
          openStatus={this.openStatus}
          data={StaticData.sortDataSellRent}
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
  }
}
export default connect(mapStateToProps)(PropertyLead)
