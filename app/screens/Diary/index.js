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
import { Ionicons, FontAwesome5, Entypo } from '@expo/vector-icons'
import AppStyles from '../../AppStyles'
import DateControl from '../../components/DateControl'
import CalendarComponent from '../../components/CalendarComponent'
import moment from 'moment'
import DiaryTile from '../../components/DiaryTile'
import AddLeadCategoryModal from '../../components/AddLeadCategoryModal'
import axios from 'axios'
import helper, { formatDateTime } from '../../helper.js'
import Loader from '../../components/loader'
import { heightPercentageToDP } from 'react-native-responsive-screen'
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
} from '../../actions/diary'
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent'
import { getTimeShifts, setSlotDiaryData, setTimeSlots } from '../../actions/slotManagement'

import DayShiftEnd from '../../components/DayShiftEnd'
import { Menu } from 'react-native-paper'

const _format = 'YYYY-MM-DD'
const _today = moment(new Date()).format(_format)
const _tomorrow = moment(_today, _format).add(1, 'days').format(_format)
const _dayAfterTomorrow = moment(_today, _format).add(2, 'days').format(_format)
class Diary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: _today,
      agentId: '',
      selectedDate: _today,
      isCalendarVisible: false,
      showMenu: false,
      showDayEnd: false,
      dayName: moment(_today).format('dddd').toLowerCase(),
      nextDay: moment(_today, _format).add(1, 'days').format(_format),
      startTime: '',
      endTime: '',
      isMenuVisible: false,
    }
  }
  componentDidMount() {
    const { navigation, dispatch } = this.props
    const { route, user } = this.props

    dispatch(setTimeSlots())
    dispatch(getTimeShifts())
    dispatch(setSlotDiaryData(_today))
    this.getDiariesStats()
    // this._unsubscribe = navigation.addListener('focus', () => {
    let { selectedDate } = this.state
    let dateSelected = selectedDate
    if ('openDate' in route.params) {
      const { openDate } = route.params
      dateSelected = moment(openDate).format(_format)
    }
    if (route.params !== undefined && 'agentId' in route.params) {
      navigation.setOptions({ title: `${route.params.name} Diary` })
      this.setState({ agentId: route.params.agentId, selectedDate: dateSelected }, () => {
        this.getDiaries()
        // Team Diary View
      })
    } else {
      navigation.setOptions({ title: 'My Diary' })
      this.setState({ agentId: user.id, selectedDate: dateSelected }, () => {
        // Personal Diary
        this.getDiaries()
      })
    }
    //}
    //})
  }

  getDiariesStats = () => {
    const { selectedDate, dayName, nextDay } = this.state
    const data = this.props.userShifts
    const array = []

    for (var i = 0; i < data.length; i++) {
      if (dayName == data[i].dayName && dayName == 'sunday') {
        array.push(data[i])
      }
      if (dayName == data[i].dayName && dayName == 'monday') {
        array.push(data[i])
      }
      if (dayName == data[i].dayName && dayName == 'tuesday') {
        array.push(data[i])
      }
      if (dayName == data[i].dayName && dayName == 'wednesday') {
        array.push(data[i])
      }
      if (dayName == data[i].dayName && dayName == 'thursday') {
        array.push(data[i])
      }
      if (dayName == data[i].dayName && dayName == 'friday') {
        array.push(data[i])
      }
      if (dayName == data[i].dayName && dayName == 'saturday') {
        array.push(data[i])
      }
    }

    if (array[0] && array.length == 2) {
      const start = formatDateTime(selectedDate, array[0].armsShift.startTime)
      const end = formatDateTime(nextDay, array[1].armsShift.endTime)

      this.setStatsData(start, end)
    } else if (array[0] && array.length == 3) {
      const start = formatDateTime(selectedDate, array[0].armsShift.startTime)
      const end = formatDateTime(
        array[0].armsShift.name == 'Evening' ? nextDay : selectedDate,
        array[2].armsShift.endTime
      )

      this.setStatsData(start, end)
    } else {
      const start = formatDateTime(selectedDate, array[0] && array[0].armsShift.startTime)
      const end = formatDateTime(
        array[0] && array[0].armsShift.name == 'Evening' ? nextDay : selectedDate,
        array[0] && array[0].armsShift.endTime
      )

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

    let endPoint = ``
    this.setState({ loading: true }, () => {
      endPoint = `/api/diary/all?date[]=${selectedDate}`
      axios
        .get(`${endPoint}`)
        .then((res) => {
          // console.log(res)
          this.setState(
            {
              diaryData: res.data,
              loading: false,
            },
            () => {
              // this.showTime()
            }
          )
        })
        .catch((error) => {
          console.log(error)
          this.setState({
            loading: false,
          })
        })
    })

    const { dispatch } = this.props
    dispatch(getDiaryTasks(selectedDate, agentId, false))
    dispatch(getOverdueCount(agentId))
  }

  setSelectedDate = (date, mode) => {
    const { isCalendarVisible } = this.state
    const { dispatch, diary } = this.props
    const { page } = diary
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
    this.setState({ isCalendarVisible: value })
  }

  goToOverdueTasks = () => {
    const { navigation, overdueCount, route } = this.props
    const { name = null } = route.params
    const { agentId } = this.state
    navigation.navigate('OverdueTasks', { count: overdueCount, agentId, agentName: name })
  }

  handleMenuActions = (action) => {
    const { navigation, diary, dispatch } = this.props
    const { selectedDiary } = diary
    const { selectedDate, agentId } = this.state
    if (action === 'mark_as_done') {
      dispatch(markDiaryTaskAsDone(selectedDate, agentId, false))
    } else if (action === 'cancel_viewing') {
    } else if (action === 'task_details') {
      navigation.navigate('TaskDetails', { diary: selectedDiary })
    } else if (action === 'edit_task') {
      console.log(selectedDiary)
      this.goToAddEditDiaryScreen(true, selectedDiary)
    } else if (action === 'refer_lead') {
      this.navigateToReferAssignLead('refer')
    } else if (action === 'reassign_lead') {
      this.navigateToReferAssignLead('reassign')
    } else if (action === 'delete') {
      Alert.alert(
        'Delete Task',
        'Are you sure you want to delete this task ?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            onPress: () => dispatch(deleteDiaryTask(selectedDate, agentId, false)),
          },
        ],
        { cancelable: false }
      )
    }
  }

  navigateToReferAssignLead = (mode) => {
    const { navigation } = this.props
    const { selectedLead, selectedDiary } = this.props.diary
    let type = null
    if (selectedDiary.armsProjectLeadId) {
      type = 'investment'
    } else if (selectedDiary.armsLeadId) {
      type = selectedLead.purpose
    }
    navigation.navigate('AssignLead', {
      leadId: selectedLead.id,
      type: type,
      purpose: mode,
      screenName: 'Diary',
    })
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
      purposeTab = lead.purpose
    }
    navigation.navigate('LeadDetail', { lead, purposeTab })
  }

  navigateToFiltersScreen = () => {
    const { navigation } = this.props
    const { agentId, selectedDate } = this.state
    navigation.navigate('DiaryFilter', {
      agentId,
      isOverdue: false,
      selectedDate,
    })
  }

  goToAddEditDiaryScreen = (update, data = null) => {
    const { navigation } = this.props
    navigation.navigate('AddDiary', { update, data })
  }

  setShowDayEnd = (display) => {
    this.setState({ showDayEnd: display })
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
    } = this.state
    const { overdueCount, diary, dispatch, navigation, diaryStat, user } = this.props
    const {
      diaries,
      loading,
      selectedDiary,
      selectedLead,
      showClassificationModal,
      onEndReachedLoader,
      page,
    } = diary
    return (
      <SafeAreaView style={styles.container}>
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

        <AddLeadCategoryModal
          visible={showClassificationModal}
          toggleCategoryModal={(value) => {
            dispatch(setClassificationModal(value))
          }}
          onCategorySelected={(value) => dispatch(setCategory(value, selectedDate, agentId))}
          selectedCategory={
            selectedLead && selectedLead.leadCategory ? selectedLead.leadCategory : null
          }
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
              <Image source={require('../../../assets/img/filter.png')} style={styles.filterImg} />
            </TouchableOpacity>

            <FontAwesome5 name="sort-amount-down-alt" size={24} color="black" />

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
                title="Day/Shift End Report"
              />
            </Menu>
          </View>
        </View>
        {loading ? (
          <Loader loading={loading} />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
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
              />
            )}
            onEndReached={() => {
              if (diaries.rows.length < diaries.count) {
                dispatch(setOnEndReachedLoader())
                dispatch(setPageCount(page + 1))
                dispatch(getDiaryTasks(selectedDate, agentId, false, false))
              }
            }}
            onEndReachedThreshold={0.5}
            keyExtractor={(item, index) => item.id.toString()}
          />
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
    marginHorizontal: 20,
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
  }
}

export default connect(mapStateToProps)(Diary)
