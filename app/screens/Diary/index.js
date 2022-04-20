/** @format */
/** @format */

import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { connect } from 'react-redux'
import { Fab } from 'native-base'
import { Ionicons, FontAwesome5, Entypo, Fontisto } from '@expo/vector-icons'
import AppStyles from '../../AppStyles'
import DateControl from '../../components/DateControl'
import CalendarComponent from '../../components/CalendarComponent'
import moment from 'moment'
import DiaryTile from '../../components/DiaryTile'
import AddLeadCategoryModal from '../../components/AddLeadCategoryModal'
import noData from '../../../assets/img/no-result-found.png'
import Loader from '../../components/loader'
import {
  deleteDiaryTask,
  getDiaryStats,
  getDiaryTasks,
  getOverdueCount,
  setPageCount,
  markDiaryTaskAsDone,
  setCategory,
  setClassificationModal,
  setOnEndReachedLoader,
  setSelectedDiary,
  setSortValue,
  clearDiaryFilter,
  setDairyFilterApplied,
  clearDiaries,
  initiateConnectFlow,
  setConnectFeedback,
  getDiaryFeedbacks,
  setMultipleModalVisible,
  getActivityHistory,
  addInvestmentGuide,
  setReferenceGuideData,
} from '../../actions/diary'
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent'
import {
  alltimeSlots,
  clearSlotDiaryData,
  getTimeShifts,
  setSlotData,
  setSlotDiaryData,
  setTimeSlots,
} from '../../actions/slotManagement'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import DayShiftEnd from '../../components/DayShiftEnd'
import { Menu } from 'react-native-paper'
import { DiarySortModal } from '../../components/DiarySortModal'
import helper, { formatDateTime } from '../../helper'
import MultiplePhoneOptionModal from '../../components/MultiplePhoneOptionModal'
import diaryHelper from './diaryHelper'
import HistoryModal from '../../components/HistoryModal'
import ReferenceGuideModal from '../../components/ReferenceGuideModal'

const _format = 'YYYY-MM-DD'
const _today = moment(new Date()).format(_format)
const _tomorrow = moment(_today, _format).add(1, 'days').format(_format)
const _dayAfterTomorrow = moment(_today, _format).add(2, 'days').format(_format)
class Diary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: _today,
      agentId: null,
      selectedDate: _today,
      isCalendarVisible: false,
      showMenu: false,
      showDayEnd: false,
      dayName: moment(_today).format('dddd').toLowerCase(),
      nextDay: moment(_today, _format).add(1, 'days').format(_format),
      startTime: '',
      endTime: '',
      isMenuVisible: false,
      isSortModalVisible: false,
      isDelete: false,
      activityHistoryData: [],
      isActivityHistoryModalVisible: false,
    }
  }
  componentDidMount() {
    const { navigation, dispatch, route } = this.props
    const { agentId } = route.params
    let { selectedDate } = this.state
    dispatch(alltimeSlots())
    dispatch(setTimeSlots())
    dispatch(getTimeShifts())
    this._unsubscribe = navigation.addListener('focus', () => {
      const { user, isFilterApplied, filters } = this.props
      this.getDiariesStats()
      dispatch(setSlotDiaryData(_today))
      let dateSelected = null
      if (isFilterApplied) {
        dateSelected = filters.date
      } else {
        dateSelected = selectedDate
      }
      if ('openDate' in route.params) {
        const { openDate } = route.params
        dateSelected = moment(openDate).format(_format)
      }
      if (route.params !== undefined && agentId) {
        // Team Diary View
        this.getTeamDiary(dateSelected)
      } else {
        // Personal Diary
        this.getMyDiary(dateSelected)
      }
    })
  }

  componentDidUpdate() {
    const { dispatch } = this.props
    if (this.state.isDelete) {
      dispatch(setSlotDiaryData(_today))
      this.setState({ isDelete: false })
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(clearDiaries())
    dispatch(setPageCount(1))
    dispatch(setConnectFeedback({}))
  }

  getMyDiary = (dateSelected) => {
    const { route, user, navigation } = this.props
    navigation.setOptions({ title: 'My Diary' })
    this.setState({ agentId: user.id, selectedDate: dateSelected }, () => {
      // Personal Diary
      this.getDiaries()
    })
  }

  getTeamDiary = (dateSelected) => {
    const { route, user, navigation } = this.props
    navigation.setOptions({ title: `${route.params.name} Diary` })
    this.setState({ agentId: route.params.agentId, selectedDate: dateSelected }, () => {
      this.getDiaries()
    })
  }

  getDiariesStats = () => {
    const { selectedDate, dayName, nextDay } = this.state
    const data = this.props.userShifts
    const array = []

    for (var i = 0; i < data.length; i++) {
      if (dayName == data[i].dayName) {
        array.push(data[i])
      }
    }

    this.setState({ statDayEnd: array }, () => this.dayEndStat(selectedDate, nextDay, array))
  }

  dayEndStat = (selectedDate, nextDay, array) => {
    if (array[0] && array[0].armsShift && array.length == 2) {
      const start = formatDateTime(selectedDate, array[0].armsShift.startTime)
      const end = formatDateTime(
        array[0] && (array[1].armsShift.name == 'Evening' || array[1].armsShift.name == 'Night')
          ? nextDay
          : selectedDate,
        array[1].armsShift.endTime
      )

      this.setStatsData(start, end)
    }
    // else if (array[0] && array[0].armsShift && array.length == 3) {
    //   const start = formatDateTime(selectedDate, array[0].armsShift.startTime)
    //   const end = formatDateTime(
    //     array[2].armsShift.name == 'Night' ? nextDay : selectedDate,
    //     array[2].armsShift.endTime
    //   )

    //   this.setStatsData(start, end)
    // }
    else if (array[0] && array[0].armsShift && array.length == 1) {
      const start = formatDateTime(selectedDate, array[0] && array[0].armsShift.startTime)
      const end = formatDateTime(
        array[0] && array[0].armsShift.name == 'Evening' ? nextDay : selectedDate,
        array[0] && array[0].armsShift.endTime
      )

      this.setStatsData(start, end)
    } else {
      const start = formatDateTime(selectedDate, '00:00:00')
      const end = formatDateTime(nextDay, '23:59:00')

      this.setStatsData(start, end)
    }
  }

  setStatsData = (start, end) => {
    this.setState({
      startTime: start,
      endTime: end,
    })

    const { dayName } = this.state
    const { dispatch, user } = this.props
    dispatch(getDiaryStats(user.id, dayName, start, end))
  }

  getDiaries = () => {
    const { agentId, selectedDate } = this.state
    const { dispatch } = this.props
    dispatch(getDiaryTasks({ selectedDate, agentId }))
    dispatch(getOverdueCount(agentId))
  }

  setSelectedDate = (date, mode) => {
    const { isCalendarVisible } = this.state
    const { dispatch, diary } = this.props
    const { page } = diary
    dispatch(setDairyFilterApplied(false))
    dispatch(clearDiaryFilter())
    this.setState(
      {
        selectedDate: date,
        isCalendarVisible: mode === 'month' ? isCalendarVisible : false,
        dayName: moment(date).format('dddd').toLowerCase(),
        nextDay: moment(date, _format).add(1, 'days').format(_format),
      },
      () => {
        dispatch(setPageCount(1))
        this.getDiaries()
        this.getDiariesStats()
      }
    )
  }

  showMenuOptions = (data) => {
    const { dispatch } = this.props
    dispatch(setSelectedDiary(data))
    this.setState({ showMenu: true })
  }

  hideMenu = () => {
    this.setState({ showMenu: false })
  }

  setCalendarVisible = (value) => {
    const { dispatch } = this.props
    dispatch(setDairyFilterApplied(false))
    dispatch(clearDiaryFilter())
    this.setState({ isCalendarVisible: value })
  }

  goToOverdueTasks = () => {
    const { navigation, overdueCount, route, dispatch } = this.props
    const { name = null } = route.params
    const { agentId } = this.state
    dispatch(setDairyFilterApplied(false))
    dispatch(clearDiaryFilter())
    dispatch(setPageCount(1))
    dispatch(setSortValue(''))
    navigation.navigate('OverdueTasks', { count: overdueCount, agentId, agentName: name, agentId })
  }

  handleMenuActions = (action) => {
    const {
      navigation,
      diary,
      dispatch,
      connectFeedback,
      referenceGuide,
      selectedDiary,
      selectedLead,
    } = this.props
    const { selectedDate, agentId } = this.state
    if (action === 'mark_as_done') {
      if (selectedDiary.taskCategory === 'simpleTask') {
        dispatch(markDiaryTaskAsDone({ selectedDate, agentId }))
      } else {
        dispatch(
          setConnectFeedback({
            ...connectFeedback,
            id: selectedDiary.id,
          })
        ).then((res) => {
          if (selectedDiary.taskType === 'meeting') {
            dispatch(
              getDiaryFeedbacks({
                taskType: selectedDiary.taskType,
                leadType: diaryHelper.getLeadType(selectedDiary),
                actionType: 'Done',
              })
            ).then((res) => {
              navigation.navigate('DiaryFeedback', { actionType: 'Done' })
            })
          } else {
            // for all other cases
            dispatch(
              getDiaryFeedbacks({
                taskType: selectedDiary.taskType,
                leadType: diaryHelper.getLeadType(selectedDiary),
                actionType: 'Done',
              })
            ).then((res) => {
              navigation.navigate('DiaryFeedback', { actionType: 'Done' })
            })
          }
        })
      }
    } else if (action === 'cancel_viewing') {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          id: selectedDiary.id,
        })
      )
      dispatch(
        getDiaryFeedbacks({
          taskType: 'viewing',
          leadType: diaryHelper.getLeadType(selectedDiary),
          actionType: 'Cancel',
        })
      ).then((res) => {
        navigation.navigate('DiaryFeedback', { actionType: 'Cancel' })
      })
    } else if (action === 'cancel_meeting') {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          id: selectedDiary.id,
        })
      )
      dispatch(
        getDiaryFeedbacks({
          taskType: 'meeting',
          leadType: diaryHelper.getLeadType(selectedDiary),
          actionType: 'Cancel',
        })
      ).then((res) => {
        navigation.navigate('DiaryFeedback', { actionType: 'Cancel' })
      })
    } else if (action === 'task_details') {
      const { selectedDate } = this.state
      dispatch(clearDiaries())
      if (selectedDiary) {
        dispatch(
          setSlotData(
            moment(selectedDiary.date).format('YYYY-MM-DD'),
            selectedDiary.start,
            selectedDiary.end,
            []
          )
        )
      }
      navigation.navigate('TaskDetails', { diary: selectedDiary, selectedDate, agentId })
    } else if (action === 'edit_task') {
      this.goToAddEditDiaryScreen(true, selectedDiary)
    } else if (action === 'refer_lead') {
      this.navigateToShareScreen()
    } else if (action === 'reassign_lead') {
      this.checkAssignedLead()
    } else if (action === 'activity_history') {
      getActivityHistory(selectedLead, diaryHelper.getLeadType(selectedDiary)).then((res) => {
        if (res) {
          this.setState({ isActivityHistoryModalVisible: true, activityHistoryData: res.data })
        }
      })
    } else if (action === 'delete') {
      Alert.alert(
        'Delete Task',
        'Are you sure you want to delete this task ?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            onPress: () => {
              dispatch(deleteDiaryTask({ selectedDate, agentId }))
              dispatch(clearSlotDiaryData())
              dispatch(setSlotDiaryData(selectedDate))
              this.setState({ isDelete: true })
            },
          },
        ],
        { cancelable: false }
      )
    } else if (action === 'add_investment_guide') {
      dispatch(setReferenceGuideData({ ...referenceGuide, isReferenceModalVisible: true }))
    }
  }

  // navigateToReferAssignLead = (mode) => {
  //   const { navigation, selectedDiary, selectedLead } = this.props
  //   let type = null
  //   if (selectedDiary.armsProjectLeadId) {
  //     type = 'Investment'
  //   } else if (selectedDiary.armsLeadId) {
  //     type = selectedLead.purpose
  //   }
  //   navigation.navigate('AssignLead', {
  //     leadId: selectedLead.id,
  //     type: type,
  //     purpose: mode,
  //     screenName: 'Diary',
  //   })
  // }
  navigateToShareScreen = () => {
    const { user, selectedLead, navigation, selectedDiary, permissions } = this.props
    let type = null
    if (selectedDiary.armsProjectLeadId) {
      type = 'Investment'
    } else if (selectedDiary.armsLeadId) {
      type = selectedLead.purpose
    }
    if (selectedLead) {
      if (
        (getPermissionValue(
          selectedLead.projectId && selectedLead.project
            ? PermissionFeatures.PROJECT_LEADS
            : PermissionFeatures.BUY_RENT_LEADS,
          PermissionActions.REFER,
          permissions
        ) &&
          selectedLead.status === StaticData.Constants.lead_closed_lost) ||
        selectedLead.status === StaticData.Constants.lead_closed_won
      ) {
        helper.errorToast('Closed leads cannot be shared with other agents')
        return
      }
      if (user.id === selectedLead.assigned_to_armsuser_id) {
        if (selectedLead.shared_with_armsuser_id) {
          helper.errorToast('lead is already shared')
        } else {
          navigation.navigate('AssignLead', {
            leadId: selectedLead.id,
            type: type,
            purpose: 'refer',
            screenName: 'Diary',
          })
        }
      } else {
        helper.errorToast('Only the leads assigned to you can be shared')
      }
    } else {
      helper.errorToast('Something went wrong!')
    }
  }
  checkAssignedLead = () => {
    const { user, navigation, selectedDiary, selectedLead, permissions } = this.props
    let type = null
    if (selectedDiary.armsProjectLeadId) {
      type = 'Investment'
    } else if (selectedDiary.armsLeadId) {
      type = selectedLead.purpose
    }
    // Show assign lead button only if loggedIn user is Sales level2 or CC/BC/RE Manager
    if (
      getPermissionValue(
        selectedLead.projectId && selectedLead.project
          ? PermissionFeatures.PROJECT_LEADS
          : PermissionFeatures.BUY_RENT_LEADS,
        PermissionActions.REFER,
        permissions
      ) &&
      selectedLead.status !== StaticData.Constants.lead_closed_lost &&
      selectedLead.status !== StaticData.Constants.lead_closed_won
    ) {
      // Lead can only be assigned to someone else if it is assigned to no one or to current user
      if (
        selectedLead.assigned_to_armsuser_id === null ||
        user.id === selectedLead.assigned_to_armsuser_id
      ) {
        navigation.navigate('AssignLead', {
          leadId: selectedLead.id,
          type: type,
          purpose: 'reassign',
          screenName: 'Diary',
        })
      }
    } else {
      helper.errorToast('Sorry you are not authorized to assign lead')
    }
  }

  navigateToLeadDetail = (data) => {
    const { navigation } = this.props
    let lead = null
    let purposeTab = null
    if (data.armsProjectLeadId) {
      lead = { ...data.armsProjectLead }
      purposeTab = 'invest'
    } else if (data.armsLeadId) {
      lead = { ...data.armsLead }
      purposeTab = lead.purpose
    } else if (data.wantedId) {
      lead = { ...data.wanted }
      purposeTab = 'wanted'
    }
    navigation.navigate('LeadDetail', { lead, purposeTab, screenName: 'diary' })
  }

  navigateToFiltersScreen = () => {
    const { navigation, isFilterApplied, dispatch } = this.props
    const { agentId } = this.state
    navigation.navigate('DiaryFilter', {
      agentId,
      isOverdue: false,
    })
  }

  goToAddEditDiaryScreen = (update, data = null) => {
    const { navigation, dispatch } = this.props
    const { selectedDate } = this.state
    dispatch(clearDiaries())
    if (data) {
      dispatch(setSlotData(moment(data.date).format('YYYY-MM-DD'), data.start, data.end, []))
    }
    navigation.navigate('AddDiary', { update, data, selectedDate })
  }

  setShowDayEnd = (display) => {
    this.setState({ showDayEnd: display })
  }

  showSortModalVisible = (value) => {
    this.setState({ isSortModalVisible: value })
  }

  showMultiPhoneModal = (value) => {
    const { dispatch } = this.props
    dispatch(setMultipleModalVisible(value))
  }

  render() {
    const {
      selectedDate,
      isCalendarVisible,
      showMenu,
      agentId,
      showDayEnd,
      startTime,
      endTime,
      dayName,
      isMenuVisible,
      isSortModalVisible,
      isActivityHistoryModalVisible,
      activityHistoryData,
    } = this.state
    const {
      overdueCount,
      diary,
      dispatch,
      navigation,
      diaryStat,
      user,
      route,
      sortValue,
      onEndReachedLoader,
      isFilterApplied,
      isMultiPhoneModalVisible,
      referenceGuide,
      selectedDiary,
      selectedLead,
      page,
      permissions,
    } = this.props
    const { diaries, loading, showClassificationModal } = diary
    const { name = null, screen } = route.params

    return (
      <SafeAreaView style={styles.container}>
        {screen &&
        getPermissionValue(PermissionFeatures.DIARY, PermissionActions.CREATE, permissions) &&
        screen !== 'TeamDiary' ? (
          <Fab
            active="true"
            containerStyle={{ zIndex: 20 }}
            style={{
              backgroundColor: AppStyles.colors.primaryColor,
            }}
            position="bottomRight"
            onPress={() => this.goToAddEditDiaryScreen()}
          >
            <Ionicons name="md-add" color="#ffffff" />
          </Fab>
        ) : null}

        <AddLeadCategoryModal
          visible={showClassificationModal}
          toggleCategoryModal={(value) => {
            dispatch(setClassificationModal(value))
          }}
          onCategorySelected={(value) =>
            dispatch(
              setCategory({
                category: value,
                selectedDate,
                agentId,
              })
            )
          }
          selectedCategory={
            selectedLead && selectedLead.leadCategory ? selectedLead.leadCategory : null
          }
        />

        <ReferenceGuideModal
          isReferenceModalVisible={referenceGuide.isReferenceModalVisible}
          hideReferenceGuideModal={() =>
            dispatch(setReferenceGuideData({ ...referenceGuide, isReferenceModalVisible: false }))
          }
          addInvestmentGuide={(guideNo, attachments) =>
            dispatch(addInvestmentGuide({ guideNo, attachments })).then((res) => {
              this.getMyDiary(_today)
            })
          }
          referenceGuideLoading={referenceGuide.referenceGuideLoading}
          referenceErrorMessage={referenceGuide.referenceErrorMessage}
        />

        <DayShiftEnd
          navigation={navigation}
          setVisible={this.setShowDayEnd}
          visible={showDayEnd}
          diaryStat={diaryStat}
          user={user}
          startTime={startTime}
          endTime={endTime}
          day={dayName}
        />

        <MultiplePhoneOptionModal
          isMultiPhoneModalVisible={isMultiPhoneModalVisible}
          showMultiPhoneModal={(value) => this.showMultiPhoneModal(value)}
          navigation={navigation}
        />

        <HistoryModal
          navigation={navigation}
          data={activityHistoryData}
          closePopup={(value) => this.setState({ isActivityHistoryModalVisible: value })}
          openPopup={isActivityHistoryModalVisible}
        />

        <DiarySortModal
          isSortModalVisible={isSortModalVisible}
          isOverdue={false}
          isFiltered={isFilterApplied}
          selectedDate={selectedDate}
          agentId={agentId}
          sortValue={sortValue}
          showSortModalVisible={(value) => this.showSortModalVisible(value)}
        />

        <CalendarComponent
          showCalendar={isCalendarVisible}
          startDate={selectedDate}
          updateMonth={(value) => this.setSelectedDate(value ? value.dateString : null, 'month')}
          updateDay={(value) => this.setSelectedDate(value ? value.dateString : null, 'date')}
          selectedDate={selectedDate}
          onPress={() => this.setCalendarVisible(!isCalendarVisible)}
        />

        <View style={styles.rowOne}>
          <DateControl
            selectedDate={selectedDate}
            setCalendarVisible={(value) => this.setCalendarVisible(value)}
            setSelectedDate={(value) => this.setSelectedDate(value)}
            today={_today}
            tomorrow={_tomorrow}
            initialDayAfterTomorrow={_dayAfterTomorrow}
            loading={loading}
          />

          <View style={styles.filterSortView}>
            <TouchableOpacity onPress={() => this.navigateToFiltersScreen()}>
              <Image
                source={
                  !isFilterApplied
                    ? require('../../../assets/img/filter.png')
                    : require('../../../assets/img/filter_blue.png')
                }
                style={styles.filterImg}
              />
            </TouchableOpacity>

            <FontAwesome5
              name="sort-amount-down-alt"
              size={24}
              color={sortValue === '' ? 'black' : AppStyles.colors.primaryColor}
              onPress={() => this.showSortModalVisible(true)}
            />

            <Menu
              visible={isMenuVisible}
              onDismiss={() => this.setState({ isMenuVisible: false })}
              anchor={
                <View style={styles.menuView}>
                  <Entypo
                    onPress={() => this.setState({ isMenuVisible: true })}
                    name="dots-three-vertical"
                    size={24}
                  />
                </View>
              }
            >
              <Menu.Item
                onPress={() => {
                  this.setShowDayEnd(!showDayEnd), this.setState({ isMenuVisible: false })
                }}
                title="Day End Report"
              />

              <Menu.Item
                onPress={() => {
                  navigation.replace('TeamDiary'), this.setState({ isMenuVisible: false })
                }}
                title="View Team Diary"
              />
            </Menu>
          </View>
        </View>

        {agentId !== user.id && name ? (
          <View style={styles.teamViewIndicator}>
            <Image
              source={require('../../../assets/img/alert_diary.png')}
              style={styles.teamViewImageAlert}
            />
            <Text style={styles.teamViewText}>
              {`You are viewing ${name} Diary, Click`}
              <Text
                style={{ color: AppStyles.colors.primaryColor }}
                onPress={() => {
                  navigation.replace('Diary', { agentId: null })
                }}
              >
                {` here `}
              </Text>
              to viewing your Diary
            </Text>
          </View>
        ) : null}

        {loading ? (
          <Loader loading={loading} />
        ) : diaries && diaries.rows && diaries.rows.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: diaries && diaries.rows.length - 1 ? 15 : 0 }}
            data={diaries.rows}
            renderItem={({ item, index }) => (
              <DiaryTile
                diary={item}
                showMenu={showMenu}
                showMenuOptions={(value) => this.showMenuOptions(value)}
                handleMenuActions={(action) => this.handleMenuActions(action)}
                setClassification={(diary) => {
                  dispatch(setSelectedDiary(diary))
                  dispatch(setClassificationModal(true))
                }}
                goToLeadDetails={this.navigateToLeadDetail}
                selectedDiary={selectedDiary}
                screenName={'diary'}
                hideMenu={() => this.hideMenu()}
                initiateConnectFlow={(diary) => {
                  dispatch(setSelectedDiary(diary))
                  dispatch(initiateConnectFlow()).then((res) => {
                    this.showMultiPhoneModal(true)
                  })
                }}
                isOwnDiaryView={agentId === user.id}
                assignedToMe={
                  selectedDiary &&
                  selectedDiary.armsLead &&
                  user &&
                  selectedDiary.armsLead.assigned_to_armsuser_id === user.id
                    ? true
                    : false
                }
              />
            )}
            onEndReached={() => {
              if (diaries.rows.length < diaries.count && onEndReachedLoader === false) {
                dispatch(setOnEndReachedLoader(true))
                dispatch(setPageCount(page + 1))
                dispatch(getDiaryTasks({ selectedDate, agentId }))
              }
            }}
            onEndReachedThreshold={0.5}
            keyExtractor={(item, index) => item.id.toString()}
          />
        ) : (
          <Image source={noData} style={styles.noResultImg} />
        )}

        {<OnLoadMoreComponent onEndReached={onEndReachedLoader} />}

        <TouchableOpacity
          style={{
            backgroundColor: overdueCount > 0 ? 'red' : 'white',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => this.goToOverdueTasks()}
        >
          <Text
            style={{
              fontFamily: AppStyles.fonts.semiBoldFont,
              color: overdueCount > 0 ? 'white' : AppStyles.colors.textColor,
            }}
          >{`Overdue Tasks(${overdueCount})`}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppStyles.colors.backgroundColor,
    flex: 1,
  },
  rowOne: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },

  filterImg: {
    resizeMode: 'contain',
    width: 24,
    marginHorizontal: 15,
  },
  filterSortView: {
    width: '30%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuView: {
    marginLeft: 10,
    marginRight: 40,
  },
  teamViewIndicator: {
    margin: 10,
    backgroundColor: '#FFFCE3',
    borderColor: '#FDD835',
    padding: 5,
    borderRadius: 4,
    borderWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamViewImageAlert: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  teamViewText: {
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 16,
    padding: 7,
  },
  noResultImg: {
    width: '100%',
    height: 200,
    resizeMode: 'center',
    flex: 1,
  },
})

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    diary: store.diary.diary,
    selectedDiary: store.diary.selectedDiary,
    selectedLead: store.diary.selectedLead,
    overdueCount: store.diary.overdueCount,
    page: store.diary.page,
    pageSize: store.diary.pageSize,
    userShifts: store.slotManagement.userTimeShifts,
    diaryStat: store.diary.diaryStats,
    sortValue: store.diary.sort,
    isMultiPhoneModalVisible: store.diary.isMultiPhoneModalVisible,
    onEndReachedLoader: store.diary.onEndReachedLoader,
    isFilterApplied: store.diary.isFilterApplied,
    slotDiary: store.slotManagement.slotDiaryData,
    connectFeedback: store.diary.connectFeedback,
    filters: store.diary.filters,
    referenceGuide: store.diary.referenceGuide,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(Diary)
