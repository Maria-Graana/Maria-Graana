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
} from 'react-native'
import { connect } from 'react-redux'
import { Fab } from 'native-base'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import AppStyles from '../../AppStyles'
import DateControl from '../../components/DateControl'
import CalendarComponent from '../../components/CalendarComponent'
import moment from 'moment'
import DiaryTile from '../../components/DiaryTile'
import AddLeadCategoryModal from '../../components/AddLeadCategoryModal'
import axios from 'axios'
import helper from '../../helper.js'
import Loader from '../../components/loader'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import {
  getDiaryTasks,
  getOverdueCount,
  markDiaryTaskAsDone,
  setCategory,
  setClassificationModal,
  setSelectedDiary,
} from '../../actions/diary'

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
    }
  }
  componentDidMount() {
    const { navigation, dispatch } = this.props
    const { route, user } = this.props
    this._unsubscribe = navigation.addListener('focus', () => {
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
    })
  }

  getDiaries = () => {
    const { agentId, selectedDate } = this.state
    const { dispatch } = this.props
    dispatch(getDiaryTasks(selectedDate, agentId, false))
    dispatch(getOverdueCount(agentId))
  }

  setSelectedDate = (date, mode) => {
    const { isCalendarVisible } = this.state
    this.setState(
      {
        selectedDate: date,
        isCalendarVisible: mode === 'month' ? isCalendarVisible : false,
      },
      () => {
        this.getDiaries()
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
    const { navigation, overdueCount } = this.props
    const { agentId } = this.state
    navigation.navigate('OverdueTasks', { count: overdueCount, agentId })
  }

  handleMenuActions = (action) => {
    const { navigation, diary, dispatch } = this.props
    const { selectedDiary } = diary
    const { selectedDate, agentId } = this.state
    if (action === 'mark_as_done') {
      dispatch(markDiaryTaskAsDone(selectedDate, agentId))
    } else if (action === 'cancel_viewing') {
    } else if (action === 'task_details') {
      navigation.navigate('TaskDetails', { diary: selectedDiary })
    } else if (action === 'edit_task') {
    } else if (action === 'refer_lead') {
      this.navigateToReferAssignLead('refer')
    } else if (action === 'reassign_lead') {
      this.navigateToReferAssignLead('reassign')
    } else if (action === 'delete') {
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
    navigation.navigate('DiaryFilter', { agentId, isOverdue: false, selectedDate })
  }

  render() {
    const { selectedDate, isCalendarVisible, showMenu, agentId } = this.state
    const { overdueCount, diary, dispatch } = this.props
    const { diaries, loading, selectedDiary, selectedLead, showClassificationModal } = diary
    return (
      <SafeAreaView style={styles.container}>
        <Fab
          active="true"
          containerStyle={{ zIndex: 20 }}
          style={{
            backgroundColor: AppStyles.colors.primaryColor,
            marginBottom: heightPercentageToDP('10%'),
          }}
          position="bottomRight"
          onPress={() => console.log('add diary')}
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
            keyExtractor={(item, index) => item.id.toString()}
          />
        )}

        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => this.goToOverdueTasks()}
        >
          <Text
            style={{ fontFamily: AppStyles.fonts.semiBoldFont }}
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
})

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    diary: store.diary.diary,
    selectedDiary: store.diary.selectedDiary,
    selectedLead: store.diary.selectedLead,
    overdueCount: store.diary.overdueCount,
  }
}

export default connect(mapStateToProps)(Diary)
