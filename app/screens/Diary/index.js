/** @format */

import React from 'react'
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import { ActionSheet, Footer } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import DiaryTile from '../../components/DiaryTile'
import Loader from '../../components/loader'
import CalendarComponent from '../../components/CalendarComponent'
import axios from 'axios'
import { Fab } from 'native-base'
import _ from 'underscore'
import moment from 'moment'
import DairyPopup from '../../components/DairyPopup'
import AppStyles from '../../AppStyles'
import styles from './styles'
import Ability from '../../hoc/Ability'
import { connect } from 'react-redux'
import helper from '../../helper'
import TimerNotification from '../../LocalNotifications'
import StaticData from '../../StaticData'
import { getGoogleAuth } from '../../actions/user'

const _format = 'YYYY-MM-DD'
const startOfMonth = moment().startOf('month').format(_format)
const endOfMonth = moment().endOf('month').format(_format)
const _today = moment(new Date()).format(_format)
var BUTTONS = ['Delete', 'Cancel']
var CANCEL_INDEX = 1

class Diary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showCalendar: false,
      calendarList: [],
      startDate: _today,
      startMonthDate: startOfMonth,
      endMonthDate: endOfMonth,
      diaryData: {},
      loading: true,
      agentId: '',
      selectedDate: _today,
      newDiaryData: [],
      selectedMonth: moment(_today).format('MM'),
      selectedYear: moment().year(),
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
      navigation.setOptions({ title: moment(dateSelected).format('DD MMMM YYYY') })
      if (route.params !== undefined && 'agentId' in route.params) {
        this.setState({ agentId: route.params.agentId, selectedDate: dateSelected }, () => {
          this.diaryMain()
          this.listData()
        })
      } else {
        this.setState({ agentId: user.id, selectedDate: dateSelected }, () => {
          this.diaryMain()
          this.listData()
        })
      }
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  _toggleShow = () => {
    this.setState({ showCalendar: !this.state.showCalendar })
  }

  listData = () => {
    var time = 0
    let showZero = ''
    // var checkAmPm = 'AM'
    var showTime = []
    for (let hour = 0; hour <= 23; hour++) {
      if (time < 10) {
        showZero = '0'
      } else {
        showZero = ''
      }
      showTime[hour] = showZero + time++ + ':00'
    }
    this.setState({
      calendarList: showTime,
    })
  }

  getSelectedYear = () => {
    const { selectedYear } = this.state
    return selectedYear
  }

  getSelectedMonth = () => {
    const { selectedMonth } = this.state
    return selectedMonth
  }

  getDays = () => {
    const { startMonthDate, endMonthDate } = this.state
    const days = []
    const dateStart = moment(startMonthDate)
    const dateEnd = moment(endMonthDate).add(dateEnd, 'days')
    while (dateEnd.diff(dateStart, 'days') >= 0) {
      days.push(dateStart.format('DD'))
      dateStart.add(1, 'days')
    }
    return days
  }

  getAllDates = () => {
    const days = this.getDays()
    const year = this.getSelectedYear()
    const month = this.getSelectedMonth()
    return days.map((day) => {
      return `${year}-${month}-${day}`
    })
  }

  diaryMain = () => {
    const { agentId, startMonthDate, endMonthDate, selectedDate } = this.state
    let endPoint = ``
    this.setState({ loading: true }, () => {
      endPoint = `/api/diary/all?fromDate=${startMonthDate}&toDate=${endMonthDate}&agentId=${agentId}`
      axios
        .get(`${endPoint}`)
        .then((res) => {
          const currentMonthDates = this.getAllDates() //Get All dates of selected month in 'YYYY-MM-DD format
          const datesFromServer = _.pluck(res.data.rows, 'date') // get array of dates by using 'date' as key from list of array of objects
          const formatedDates = _.map(datesFromServer, function (item) {
            return moment(item).format('YYYY-MM-DD')
          }) // convert it to our used format of dates
          const uniqueDates = _.uniq(formatedDates) // Get only uniquely identified dates
          let diaryTasks = _.reduce(
            currentMonthDates,
            (previousValue, currentValue) =>
              Object.assign(
                previousValue, // this function converts array to object because calendar component require object
                {
                  [currentValue]: {
                    selected: currentValue === selectedDate, // only selected if the date is today's date
                    marked: _.contains(uniqueDates, currentValue), // unique date format is 2020-08-01 so we check the array if it contains the date that that came from server
                    dayTasks: _.contains(uniqueDates, currentValue)
                      ? _.filter(
                          res.data.rows,
                          (item) => moment(item.date).format('YYYY-MM-DD') === currentValue
                        )
                      : [], // if date is similar put data object in the selected date else put empty array
                  },
                }
              ),
            {}
          )
          this.setState(
            {
              diaryData: diaryTasks,
            },
            () => {
              this.showTime()
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

  showTime = () => {
    const { diaryData, calendarList, selectedDate } = this.state
    let selectedObject = {}
    let calendarData = {}
    const allDiaryDates = _.keys(diaryData) // Get all dates
    for (let i = 0; i < allDiaryDates.length; i++) {
      // map all dates on selected dates
      if (allDiaryDates[i].match(selectedDate)) {
        selectedObject = diaryData[selectedDate]
      }
    }
    if (!_.isEmpty(selectedObject)) {
      if (selectedObject.dayTasks.length) {
        // Do manipulation on mapped dates
        let groupTasksByTime = _.map(selectedObject.dayTasks, (item) => {
          item.statusColor = helper.checkStatusColor(item, _today) // check status color for example todo task is indicated with red color
          item.hour = moment(item.start).format('HH:00')
        })
        groupTasksByTime = _.groupBy(selectedObject.dayTasks, 'hour') // group tasks in a day by hour
        calendarData = calendarList.map((item, index) => {
          if (groupTasksByTime[item]) {
            return {
              time: item,
              task: _.sortBy(groupTasksByTime[item], 'time'), // sort day tasks by time
            }
          } else {
            return {
              time: item, // if day tasks does not contain any task on that particular time, this block is executed
              task: [],
            }
          }
        })
        this.setState({
          newDiaryData: calendarData,
          loading: false,
        })
      } else {
        calendarData = calendarList.map((item, index) => {
          return {
            time: item, // no day tasks are present, show only empty time list e.g 10AM,11AM
            diary: [],
          }
        })
        this.setState({
          newDiaryData: calendarData,
          loading: false,
        })
      }
    }
  }

  updateDay = (day) => {
    const { navigation } = this.props
    const { diaryData } = this.state
    const newDiaryData = Object.assign({}, diaryData) // creating new object because state cannot be changed directly
    const { dateString } = day
    const diaryDataKeys = _.keys(newDiaryData) // contains all the date keys as [2020-06-01,2020-06-02,.....]
    for (let i = 0; i < diaryDataKeys.length; i++) {
      if (diaryDataKeys[i].match(dateString)) {
        newDiaryData[dateString].selected = true // update the selected value in object with the current selected date
      } else {
        newDiaryData[diaryDataKeys[i]].selected = false // set selected of all other values as false
      }
    }
    navigation.setOptions({ title: moment(dateString).format('DD MMMM YYYY') })
    this.setState(
      {
        showCalendar: false,
        diaryData: newDiaryData,
        selectedDate: dateString,
      },
      () => {
        this.showTime()
      }
    )
  }

  updateMonth = (value) => {
    const { navigation } = this.props
    const { dateString } = value
    const startOfMonth = moment(dateString).startOf('month').format(_format)
    const endOfMonth = moment(dateString).endOf('month').format(_format)
    navigation.setOptions({ title: moment(dateString).format('DD MMMM YYYY') })
    this.setState(
      {
        startMonthDate: startOfMonth,
        endMonthDate: endOfMonth,
        selectedMonth: moment(dateString).format('MM'),
        selectedDate: dateString,
      },
      () => {
        this.diaryMain()
      }
    )
  }

  editTask = (val) => {
    const { navigation, route, user } = this.props
    const { screen, managerId } = route.params
    const { agentId } = this.state
    let isManager = false
    isManager = managerId ? (user.id == managerId ? true : false) : false
    if ((val.addedBy === 'self' || isManager) && Ability.canEdit(user.subRole, screen)) {
      navigation.navigate('AddDiary', {
        update: true,
        data: val,
        screenName: screen,
        managerId,
        agentId,
        rcmLeadId: val.armsLeadId,
        cmLeadId: val.armsProjectLeadId,
        tasksList: StaticData.allTaskValues,
      })
    }
  }

  deleteDiary = (data) => {
    let endPoint = ``
    let that = this
    endPoint = `/api/diary/delete?id=${data.id}`
    axios
      .delete(endPoint)
      .then(function (response) {
        if (response.status === 200) {
          helper.successToast('TASK DELETED SUCCESSFULLY!')
          helper.deleteLocalNotification(data.id)
          that.diaryMain()
        }
      })
      .catch(function (error) {
        helper.successToast(error.message)
      })
  }

  handleLongPress = (val) => {
    const { user } = this.props
    let isManager = false
    const managerId = val.managerId ? val.managerId : null
    isManager = managerId ? (user.id == managerId ? true : false) : false
    if ((val.addedBy === 'self' || isManager) && val.taskCategory === 'simpleTask') {
      ActionSheet.show(
        {
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX,
          title: 'Select an Option',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            //Delete
            this.showDeleteDialog(val)
          }
        }
      )
    } else {
      helper.errorToast('Sorry, you are not authorized to delete this task.')
    }
  }

  showDeleteDialog(val) {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => this.deleteDiary(val) },
      ],
      { cancelable: false }
    )
  }

  handleLeadLinkPress = (diaryObject) => {
    let url = diaryObject.armsLeadId
      ? `/api/leads/byId?id=${diaryObject.armsLeadId}`
      : `/api/leads/project/byId?id=${diaryObject.armsProjectLeadId}`
    axios
      .get(url)
      .then((response) => {
        //this.setState({ openPopup: false })
        this.props.navigation.navigate('LeadDetail', {
          lead: response.data,
          purposeTab: response.data.purpose ? response.data.purpose : 'invest',
        })
      })
      .catch((error) => {
        console.log('error', error)
      })
  }

  createTaskPayLoad = (title, time) => {
    const { selectedDate } = this.state
    const { user } = this.props
    let start = moment(selectedDate + 'T' + time).format('YYYY-MM-DDTHH:mm:ssZ')
    let end = moment(start).add(1, 'hours').format('YYYY-MM-DDTHH:mm:ssZ') // If end date is not selected by user, add plus 1 hour in start time
    let payload = Object.create({})
    payload.date = start
    payload.userId = user.id
    payload.time = start
    payload.diaryTime = start
    payload.start = start
    payload.end = end
    payload.taskCategory = 'simpleTask'
    payload.addedBy = 'self'
    payload.managerId = null
    payload.subject = title
    payload.taskType = 'task'
    payload.status = 'pending'
    return payload
  }

  addGoogleCalendarTask = async (description, time) => {
    const { user } = this.props
    this.props.dispatch(getGoogleAuth(user)).then((res) => {
      this.addTask(description, time)
    })
  }

  addTask = async (description, time) => {
    let payload = this.createTaskPayLoad(description, time)
    this.setState({ loading: true }, () => {
      axios
        .post(`/api/diary/create`, payload)
        .then((res) => {
          if (res.status === 200) {
            helper.successToast('TASK ADDED SUCCESSFULLY!')
            let start = new Date(res.data.start)
            let end = new Date(res.data.end)
            this.diaryMain()
            let data = {
              id: res.data.id,
              title: res.data.subject,
              body: moment(start).format('hh:mm A') + ' - ' + moment(end).format('hh:mm A'),
            }
            TimerNotification(data, start)
          } else {
            helper.errorToast('ERROR: SOMETHING WENT WRONG')
          }
        })
        .catch((error) => {
          helper.errorToast('ERROR: ADDING TASK')
          console.log('error', error.message)
        })
        .finally(() => {
          this.setState({ loading: false })
        })
    })
  }

  render() {
    const {
      showCalendar,
      startDate,
      loading,
      selectedDiary,
      newDiaryData,
      diaryData,
      selectedDate,
    } = this.state
    const { user, route } = this.props
    const { name } = route.params
    return !loading ? (
      <View style={styles.container}>
        {
          // Show view with team member name if coming from team member screen
          route.params.screen === 'TeamDiary' ? (
            <View style={styles.calenderIconContainer}>
              <View style={AppStyles.flexDirectionRow}>
                <Text style={styles.teamMemberNameText}>
                  {name !== null && name !== undefined ? name : ''}
                </Text>
                <Text style={styles.diaryText}>Diary</Text>
              </View>
            </View>
          ) : null
        }

        {!showCalendar ? (
          <TouchableOpacity onPress={this._toggleShow} activeOpacity={0.7}>
            <View style={styles.underLine} />
            <View style={styles.calenderIconContainer}>
              <Image
                style={{ width: 30, height: 26 }}
                source={require('../../../assets/img/calendar2.png')}
              />
              <Text style={styles.calendarText}>Calendar</Text>
            </View>
            <View style={styles.underLine} />
          </TouchableOpacity>
        ) : (
          <CalendarComponent
            startDate={startDate}
            diaryData={diaryData}
            updateMonth={(value) => this.updateMonth(value)}
            updateDay={(value) => this.updateDay(value)}
            selectedDate={selectedDate}
            onPress={this._toggleShow}
          />
        )}

        {newDiaryData && newDiaryData.length ? (
          <DiaryTile
            data={newDiaryData}
            editTask={this.editTask}
            // showPopup={this.showPopup}
            onLeadLinkPressed={this.handleLeadLinkPress}
            onLongPress={(val) => this.handleLongPress(val)}
            addTask={(description, selectedTime) =>
              this.addGoogleCalendarTask(description, selectedTime)
            }
          />
        ) : null}
      </View>
    ) : (
      <Loader loading={loading} />
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(Diary)
