/** @format */

import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
  Platform,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native'
import AppStyles from '../../AppStyles'
import DateTimePicker from '../../components/DatePicker'
import PickerComponent from '../../components/Picker'
import TouchableButton from '../../components/TouchableButton'
import helper from '../../helper.js'
import axios from 'axios'
import Loader from '../../components/loader'
import _ from 'underscore'
import StaticData from '../../StaticData'
import {
  clearDiaryFilter,
  getDiaryTasks,
  setDairyFilterApplied,
  setDiaryFilter,
  setDiaryFilterReason,
} from '../../actions/diary'
import moment from 'moment'
import { connect } from 'react-redux'
import TouchableInput from '../../components/TouchableInput'
import { Ionicons } from '@expo/vector-icons'
import RBSheet from 'react-native-raw-bottom-sheet'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import ListViewComponent from '../../components/ListViewComponent'
import TextFilterComponent from '../../components/TextFilterComponent'
import DateFilterComponent from '../../components/DateFilterComponent'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import DiaryReasons from '../../screens/DiaryReasons'
import SortImg from '../../../assets/img/sort.png'
import { TextInput } from 'react-native-paper'
import OnLoadMoreComponent from '../OnLoadMoreComponent'

const _format = 'YYYY-MM-DD'
const _today = moment(new Date()).format(_format)
class FilterDiaryView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      feedbackReasons: [],
      clear: false,
      leadType: '',
      filterType: '',
      leadTypeList: [],
      searchText: '',
      dateFromTo: null,
      activeDate: false,
      customers: [],
      totalCustomers: 0,
      loading: true,
      page: 1,
      pageSize: 50,
      onEndReachedLoader: false,
      isSelected: false,
    }
  }

  componentDidMount() {
    const { permissions } = this.props
    const { leadTypeList } = this.state
    if (
      getPermissionValue(
        PermissionFeatures.APP_PAGES,
        PermissionActions.PROJECT_LEADS_PAGE_VIEW,
        permissions
      )
    ) {
      leadTypeList.push({ name: 'Project', value: 'Project' })
    }
    if (
      getPermissionValue(
        PermissionFeatures.APP_PAGES,
        PermissionActions.BUYRENT_LEADS_PAGE_VIEW,
        permissions
      )
    ) {
      leadTypeList.push({ name: 'Buy/Rent', value: 'BuyRent' })
    }
    if (
      getPermissionValue(
        PermissionFeatures.APP_PAGES,
        PermissionActions.WANTED_LEADS_PAGE_VIEW,
        permissions
      )
    ) {
      leadTypeList.push({ name: 'Wanted', value: 'Wanted' })
    }

    this.fetchCustomer()
  }

  fetchCustomer = () => {
    const { customers, searchText, page, pageSize } = this.state
    let url = ''
    const clientName = searchText.replace(' ', '%20')
    searchText !== ''
      ? (url = `/api/customer/find?searchBy=name&q=${clientName}`)
      : (url = `/api/customer/find?pageSize=${pageSize}&page=${page}`)
    axios
      .get(url)
      .then((res) => {
        this.setState({
          customers:
            searchText !== ''
              ? res.data.rows
              : page === 1
              ? res.data.rows
              : [...customers, ...res.data.rows],
          totalCustomers: res.data.count,
          onEndReachedLoader: false,
          loading: false,
        })
      })
      .catch((error) => {
        console.log(error)
        return null
      })
  }

  clearFilter = () => {
    const { dispatch, route, navigation, agentId, isOverdue } = this.props
    dispatch(setDairyFilterApplied(false)).then((res) => {
      dispatch(clearDiaryFilter())
      dispatch(setDiaryFilterReason(null))
      // if (isOverdue) {
      dispatch(getDiaryTasks({ selectedDate: _today, agentId, overdue: isOverdue }))
      // }
      this.setState({ clear: false })
      // navigation.goBack()
    })
  }

  onSearchPressed = () => {
    const { navigation, route, dispatch, agentId, isOverdue = false } = this.props
    const { filters, feedbackReasonFilter } = this.props
    const newFormData = {
      ...filters,
      reasonTag: feedbackReasonFilter ? feedbackReasonFilter.name : null,
    }
    dispatch(setDiaryFilter(newFormData))
    dispatch(setDairyFilterApplied(true))
    dispatch(getDiaryTasks({ agentId, overdue: isOverdue }))
    this.setState({ clear: true, searchText: '' })
    // navigation.goBack()
    this.fetchCustomer()
  }

  handleForm = (value, name) => {
    const { dispatch } = this.props
    const { filters, feedbackReasonFilter } = this.props
    let newformData = {
      ...filters,
    }
    if (
      name === 'wantedId' ||
      name === 'projectId' ||
      name === 'buyrentId' ||
      name === 'customerId'
    ) {
      if (helper.isANumber(value)) {
        newformData[name] = value
      } else {
        alert('Please enter correct format!')
      }
    } else {
      newformData[name] = value
    }
    dispatch(setDiaryFilter(newformData)).then((res) => {
      this.onSearchPressed()
      this.RBSheet.close()
    })
  }

  setTextSearch = (text) => {
    this.setState({ searchText: text })
  }

  goToDiaryReasons = () => {
    const { navigation, route } = this.props
    navigation.navigate('DiaryReasons', { screenName: 'DiaryFilter' })
  }

  setBottomSheet = (value) => {
    this.setState(
      {
        filterType: value,
      },
      () => {
        if (value == 'date' && Platform.OS == 'android') {
          this.setState({ activeDate: true })
        } else {
          this.RBSheet.open()
        }
      }
    )
  }

  setDateFromTo = (event, date) => {
    this.setState({ dateFromTo: date, activeDate: false }, () => {
      if (Platform.OS == 'android' && event.type == 'set') {
        this.changeDateFromTo()
      }
    })
  }

  changeDateFromTo = () => {
    const { dateFromTo } = this.state
    this.handleForm(helper.formatDate(dateFromTo), 'date')
  }

  onReasonSet = () => {
    const { clear } = this.state
    this.setState({ clear: true })
    this.RBSheet.close()
    this.onSearchPressed()
  }

  setClientSearch = (value) => {
    const { page } = this.state
    this.setState(
      {
        searchText: value,
        page: value === '' ? 1 : page,
        pageSize: 50,
      },
      () => this.fetchCustomer()
    )
  }

  render() {
    const { filters, route, feedbackReasonFilter, isOverdue, sort } = this.props
    const {
      loading,
      clear,
      leadType,
      filterType,
      leadTypeList,
      searchText,
      activeDate,
      dateFromTo,
      customers,
      totalCustomers,
      onEndReachedLoader,
      page,
    } = this.state

    return (
      <View style={styles.listView}>
        {/* ********** RN Bottom Sheet ********** */}
        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref
          }}
          height={
            filterType == 'date'
              ? 500
              : filterType == 'reasons' || filterType == 'customerName'
              ? 700
              : 300
          }
          openDuration={250}
          closeOnDragDown={true}
          customStyles={{
            container: { borderTopLeftRadius: 10, borderTopRightRadius: 10 },
          }}
        >
          {filterType == 'leadType' ? (
            <ListViewComponent
              name={'Lead Type'}
              data={leadTypeList}
              onPress={this.handleForm}
              custom={true}
            />
          ) : filterType == 'projectId' ? (
            <TextFilterComponent
              name={'Project ID'}
              type={'projectId'}
              searchText={searchText}
              setTextSearch={this.setTextSearch}
              changeStatusType={this.handleForm}
              numeric={true}
            />
          ) : filterType == 'buyrentId' ? (
            <TextFilterComponent
              name={'Buy/Rent ID'}
              type={'buyrentId'}
              searchText={searchText}
              setTextSearch={this.setTextSearch}
              changeStatusType={this.handleForm}
              numeric={true}
            />
          ) : filterType == 'wantedId' ? (
            <TextFilterComponent
              name={'Wanted ID'}
              type={'wantedId'}
              searchText={searchText}
              setTextSearch={this.setTextSearch}
              changeStatusType={this.handleForm}
              numeric={true}
            />
          ) : filterType == 'customerName' ? (
            <View style={{ padding: 20, justifyContent: 'center' }}>
              <TextInput
                mode="outlined"
                activeOutlineColor={AppStyles.colors.primaryColor}
                outlineColor={AppStyles.colors.primary}
                value={searchText}
                onChangeText={(queryText) => this.setClientSearch(queryText)}
                placeholder="Search"
                theme={{ colors: { text: 'black', background: 'white' } }}
                style={{ marginBottom: 10 }}
              />
              <FlatList
                data={customers}
                style={{ marginBottom: 50, marginLeft: 10 }}
                renderItem={({ item }, index) => (
                  <Pressable
                    style={{ justifyContent: 'center' }}
                    onPress={() =>
                      this.handleForm(item.firstName + ' ' + item.lastName, 'customerName')
                    }
                    key={index}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        paddingVertical: 10,
                        fontFamily: AppStyles.fonts.defaultFont,
                        fontWeight: '300',
                      }}
                    >
                      {item.firstName + ' ' + item.lastName}
                    </Text>
                  </Pressable>
                )}
                onEndReached={() => {
                  if (
                    customers.length < totalCustomers &&
                    onEndReachedLoader === false &&
                    searchText === ''
                  ) {
                    this.setState(
                      {
                        page: this.state.page + 1,
                        onEndReachedLoader: true,
                      },
                      () => {
                        this.fetchCustomer()
                      }
                    )
                  }
                }}
                onEndReachedThreshold={0.5}
                keyExtractor={(item, index) => item.id.toString()}
              />
              <OnLoadMoreComponent
                style={{ backgroundColor: 'white' }}
                onEndReached={onEndReachedLoader}
              />
            </View>
          ) : filterType == 'customerPhoneNumber' ? (
            <TextFilterComponent
              name={'Client Phone#'}
              type={'customerPhoneNumber'}
              searchText={searchText}
              setTextSearch={this.setTextSearch}
              changeStatusType={this.handleForm}
              numeric={true}
            />
          ) : filterType == 'date' ? (
            <DateFilterComponent
              dateFromTo={dateFromTo}
              setDateFromTo={this.setDateFromTo}
              changeDateFromTo={this.changeDateFromTo}
            />
          ) : filterType == 'reasons' ? (
            <DiaryReasons screenName={'DiaryFilter'} onPress={() => this.onReasonSet()} />
          ) : null}
        </RBSheet>
        {/* ********** RN Bottom Sheet ********** */}

        {activeDate && (
          <RNDateTimePicker
            value={dateFromTo ? dateFromTo : new Date()}
            onChange={this.setDateFromTo}
          />
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity onPress={() => sort()} style={{ marginLeft: 15, marginRight: 5 }}>
            <Image source={SortImg} style={[styles.sortImg]} />
          </TouchableOpacity>
          {clear ? (
            <Pressable onPress={() => this.clearFilter()} style={styles.clearPressable}>
              <Text style={styles.clearText}>Clear All</Text>
            </Pressable>
          ) : null}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <Pressable
              onPress={() => this.setBottomSheet('leadType')}
              style={[
                styles.filterPressable,
                {
                  backgroundColor: filters.leadType
                    ? AppStyles.colors.primaryColor
                    : AppStyles.colors.backgroundColor,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: filters.leadType ? 'white' : AppStyles.colors.textColor,
                }}
              >
                {filters.leadType ? filters.leadType : 'Lead Type'}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={filters.leadType ? 'white' : AppStyles.colors.textColor}
              />
            </Pressable>
            <Pressable
              onPress={() => this.setBottomSheet('reasons')}
              style={[
                styles.filterPressable,
                {
                  backgroundColor: feedbackReasonFilter
                    ? AppStyles.colors.primaryColor
                    : AppStyles.colors.backgroundColor,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: feedbackReasonFilter ? 'white' : AppStyles.colors.textColor,
                }}
              >
                {feedbackReasonFilter ? feedbackReasonFilter.name : 'Reason'}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={feedbackReasonFilter ? 'white' : AppStyles.colors.textColor}
              />
            </Pressable>
            <Pressable
              onPress={() => this.setBottomSheet('projectId')}
              style={[
                styles.filterPressable,
                {
                  backgroundColor: filters.projectId
                    ? AppStyles.colors.primaryColor
                    : AppStyles.colors.backgroundColor,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: filters.projectId ? 'white' : AppStyles.colors.textColor,
                }}
              >
                {filters.projectId ? filters.projectId : 'Project ID'}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={filters.projectId ? 'white' : AppStyles.colors.textColor}
              />
            </Pressable>
            <Pressable
              onPress={() => this.setBottomSheet('buyrentId')}
              style={[
                styles.filterPressable,
                {
                  backgroundColor: filters.buyrentId
                    ? AppStyles.colors.primaryColor
                    : AppStyles.colors.backgroundColor,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: filters.buyrentId ? 'white' : AppStyles.colors.textColor,
                }}
              >
                {filters.buyrentId ? filters.buyrentId : 'Buy/Rent ID'}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={filters.buyrentId ? 'white' : AppStyles.colors.textColor}
              />
            </Pressable>
            <Pressable
              onPress={() => this.setBottomSheet('wantedId')}
              style={[
                styles.filterPressable,
                {
                  backgroundColor: filters.wantedId
                    ? AppStyles.colors.primaryColor
                    : AppStyles.colors.backgroundColor,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: filters.wantedId ? 'white' : AppStyles.colors.textColor,
                }}
              >
                {filters.wantedId ? filters.wantedId : 'Wanted ID'}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={filters.wantedId ? 'white' : AppStyles.colors.textColor}
              />
            </Pressable>
            <Pressable
              onPress={() => this.setBottomSheet('customerName')}
              style={[
                styles.filterPressable,
                {
                  backgroundColor: filters.customerName
                    ? AppStyles.colors.primaryColor
                    : AppStyles.colors.backgroundColor,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: filters.customerName ? 'white' : AppStyles.colors.textColor,
                }}
              >
                {filters.customerName ? filters.customerName : 'Client Name'}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={filters.customerName ? 'white' : AppStyles.colors.textColor}
              />
            </Pressable>
            <Pressable
              onPress={() => this.setBottomSheet('customerPhoneNumber')}
              style={[
                styles.filterPressable,
                {
                  backgroundColor: filters.customerPhoneNumber
                    ? AppStyles.colors.primaryColor
                    : AppStyles.colors.backgroundColor,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: filters.customerPhoneNumber ? 'white' : AppStyles.colors.textColor,
                }}
              >
                {filters.customerPhoneNumber ? filters.customerPhoneNumber : 'Client Phone#'}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={filters.customerPhoneNumber ? 'white' : AppStyles.colors.textColor}
              />
            </Pressable>
            <Pressable
              onPress={() => this.setBottomSheet('date')}
              style={[
                styles.filterPressable,
                {
                  backgroundColor: filters.date
                    ? AppStyles.colors.primaryColor
                    : AppStyles.colors.backgroundColor,
                  marginRight: 25,
                },
              ]}
            >
              <Text
                style={{ fontSize: 12, color: filters.date ? 'white' : AppStyles.colors.textColor }}
              >
                {filters.date ? helper.formatDate(filters.date) : 'Date'}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={filters.date ? 'white' : AppStyles.colors.textColor}
              />
            </Pressable>
          </ScrollView>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  listView: {
    marginBottom: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
  },
  clearPressable: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 5,
  },
  filterScroll: {
    padding: 10,
  },
  filterPressable: {
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 5,
  },
  sortImg: {
    resizeMode: 'contain',
    width: 20,
  },
})

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    filters: store.diary.filters,
    feedbackReasonFilter: store.diary.feedbackReasonFilter,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(FilterDiaryView)
