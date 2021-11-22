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
      diaryData: {},
      loading: true,
      agentId: '',
      selectedDate: _today,
      isCalendarVisible: false,
      showMenu: false,
      selectedDiary: null,
      // newDiaryData: [],
      // selectedMonth: moment(_today).format('MM'),
      // selectedYear: moment().year(),
    }
  }
  componentDidMount() {
    const { navigation } = this.props
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
  }

  setSelectedDate = (date, mode) => {
    const { isCalendarVisible } = this.state
    this.setState(
      {
        selectedDate: date,
        isCalendarVisible: mode === 'month' ? isCalendarVisible : false,
        loading: true,
      },
      () => {
        this.getDiaries()
      }
    )
  }

  showMenuOptions = (data) => {
    this.setState({ selectedDiary: data, showMenu: true })
  }

  hideMenu = () => {
    this.setState({ selectedDiary: null, showMenu: false })
  }

  setCalendarVisible = (value) => {
    this.setState({ isCalendarVisible: value })
  }

  onCategorySelected = (value) => {
    // const { lead, fetchLead } = this.props
    const { selectedDiary } = this.state
    let body = {
      leadCategory: value,
    }
    // var leadId = []
    // leadId.push(selectedDiary.id)
    this.setState({ isLeadCategoryModalVisible: false }, () => {
      helper.successToast(`Lead Category added`)
    })
    // axios
    //   .patch(`/api/leads/project`, body, { params: { id: leadId } })
    //   .then((res) => {
    //     this.setState({ isLeadCategoryModalVisible: false }, () => {
    //       helper.successToast(`Lead Category added`)
    //     })
    //   })
    //   .catch((error) => {
    //     console.log('/api/leads/project - Error', error)
    //     helper.errorToast('Closed lead API failed!!')
    //   })
  }
  render() {
    const {
      selectedDate,
      isCalendarVisible,
      diaryData,
      selectedDiary,
      showMenu,
      isLeadCategoryModalVisible,
      loading,
    } = this.state
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
            selectedDiary && selectedDiary.leadCategory ? selectedDiary.leadCategory : null
          }
        />

        <CalendarComponent
          showCalendar={isCalendarVisible}
          startDate={selectedDate}
          // diaryData={diaryData}
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
            data={diaryData.rows}
            renderItem={({ item, index }) => (
              <DiaryTile
                diary={item}
                showMenu={showMenu}
                showMenuOptions={(value) => this.showMenuOptions(value)}
                selectedDiary={selectedDiary}
                hideMenu={() => this.hideMenu()}
                setClassification={(value) =>
                  this.setState({
                    isLeadCategoryModalVisible: true,
                    selectedDiary: value,
                  })
                }
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
        >
          <Text style={{ fontFamily: AppStyles.fonts.semiBoldFont }}>Overdue Tasks (5)</Text>
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
  }
}

export default connect(mapStateToProps)(Diary)
