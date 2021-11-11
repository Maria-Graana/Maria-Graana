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
import StaticData from '../../StaticData'
import DiaryTile from '../../components/DiaryTile'
import AddLeadCategoryModal from '../../components/AddLeadCategoryModal'
import axios from 'axios'
import helper from '../../helper.js'
import Loader from '../../components/loader'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import { getDiaryTasks, getOverdueCount, setSelectedDiary } from '../../actions/diary'
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace'
import { SET_DIARY_OVERDUE_COUNT } from '../../types'

const _format = 'YYYY-MM-DD'
const _today = moment(new Date()).format(_format)
const _tomorrow = moment(_today, _format).add(1, 'days').format(_format)
const _dayAfterTomorrow = moment(_today, _format).add(2, 'days').format(_format)
class Diary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: _today,
      isLeadCategoryModalVisible: false,
      // startMonthDate: startOfMonth,
      // endMonthDate: endOfMonth,
      //diaryData: {},
      // loading: true,
      agentId: '',
      selectedDate: _today,
      isCalendarVisible: false,
      showMenu: false,
      //selectedDiary: null,
      // newDiaryData: [],
      // selectedMonth: moment(_today).format('MM'),
      // selectedYear: moment().year(),
    }
  }
  componentDidMount() {
    const { navigation, dispatch } = this.props
    dispatch(getOverdueCount())
    this._unsubscribe = navigation.addListener('focus', () => {
      const { route, user } = this.props
      let { selectedDate } = this.state
      let dateSelected = selectedDate
      if ('openDate' in route.params) {
        const { openDate } = route.params
        dateSelected = moment(openDate).format(_format)
      }
      // navigation.setOptions({ title: moment(dateSelected).format('DD MMMM YYYY') })
      if (route.params !== undefined && 'agentId' in route.params) {
        navigation.setOptions({ title: `${route.params.name} Diary` })
        this.setState({ agentId: route.params.agentId, selectedDate: dateSelected }, () => {
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
    dispatch(getDiaryTasks(selectedDate))
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
    const { navigation } = this.props
    navigation.navigate('OverdueTasks')
  }

  handleMenuActions = (action) => {
    const { navigation } = this.props
    if (action === 'mark_as_done') {
      this.markTaskAsDone()
    } else if (action === 'cancel_viewing') {
    } else if (action === 'task_details') {
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

  setClassification = (diary) => {
    const { dispatch } = this.props
    dispatch(setSelectedDiary(diary))
    this.setState({
      isLeadCategoryModalVisible: true,
    })
  }

  onCategorySelected = (value) => {
    const { selectedLead } = this.props.diary
    if (selectedLead) {
      let endPoint = ``
      let body = {
        leadCategory: value,
      }
      endPoint = selectedLead.projectId ? `/api/leads/project` : `api/leads`
      var leadId = []
      leadId.push(selectedLead.id)
      this.setState({ isLeadCategoryModalVisible: false }, () => {
        helper.successToast(`Lead Category added`)
      })
      axios
        .patch(endPoint, body, { params: { id: leadId } })
        .then((res) => {
          this.setState({ isLeadCategoryModalVisible: false }, () => {
            this.getDiaries()
            helper.successToast(`Lead Category added`)
          })
        })
        .catch((error) => {
          console.log('/api/leads/project - Error', error)
          helper.errorToast('Closed lead API failed!!')
        })
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
      purposeTab = lead.purpose
    }
    navigation.navigate('LeadDetail', { lead, purposeTab })
  }

  markTaskAsDone = () => {
    const { selectedDiary } = this.props.diary
    let that = this
    let endPoint = ``
    endPoint = `/api/diary/update?id=${selectedDiary.id}`
    axios
      .patch(endPoint, {
        status: 'completed',
      })
      .then(function (response) {
        //console.log(response)
        if (response.status == 200) {
          that.getDiaries()
          //helper.deleteLocalNotification(data.id)
          // navigation.goBack()
        }
      })
  }

  render() {
    const { selectedDate, isCalendarVisible, showMenu, isLeadCategoryModalVisible } = this.state
    const { overdueCount, diary } = this.props
    const { diaries, loading, selectedDiary, selectedLead } = diary
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
          visible={isLeadCategoryModalVisible}
          toggleCategoryModal={(value) => {
            this.setState({ isLeadCategoryModalVisible: value })
          }}
          onCategorySelected={(value) => this.onCategorySelected(value)}
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
            <Image source={require('../../../assets/img/filter.png')} style={styles.filterImg} />
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
                setClassification={this.setClassification}
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
