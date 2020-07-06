import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { ActionSheet, Footer } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import DiaryTile from '../../components/DiaryTile'
import Loader from '../../components/loader'
import CalendarComponent from '../../components/CalendarComponent'
import axios from 'axios';
import { Fab } from 'native-base';
import _ from 'underscore';
import moment from 'moment';
import DairyPopup from '../../components/DairyPopup'
import AppStyles from '../../AppStyles'
import styles from './styles'
import Ability from '../../hoc/Ability'
import { connect } from 'react-redux';
import helper from '../../helper';

const _format = 'YYYY-MM-DD';
const startOfMonth = moment().startOf('month').format(_format);
const endOfMonth = moment().endOf('month').format(_format);
const _today = moment(new Date()).format(_format);
var BUTTONS = ['Delete', 'Cancel'];
var CANCEL_INDEX = 1;

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
      openPopup: false,
      selectedDiary: {},
      selectedDate: _today,
      newDiaryData: [],
      selectedMonth: moment(_today).format('MM'),
      selectedYear: moment().year(),
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      const { route, user } = this.props;
      if (route.params !== undefined && 'agentId' in route.params) {
        this.setState({ agentId: route.params.agentId }, () => {
          this.diaryMain();
          this.listData();
        });
      }
      else {
        this.setState({ agentId: user.id }, () => {
          this.diaryMain();
          this.listData();
        })
      }
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggleShow = () => {
    this.setState({ showCalendar: !this.state.showCalendar })
  }

  listData = () => {

    var time = 7
    var checkAmPm = 'AM'
    var showTime = []
    var showZero = '0'
    for (let hour = 0; hour <= 15; hour++) {
      if (time > 12) {
        time = 1
      }
      if (time > 11) {
        checkAmPm = 'PM'
      }
      if (time > 9 && time <= 12) {
        showZero = ''
      } else {
        showZero = '0'
      }
      showTime[hour] = showZero + time++ + ' ' + checkAmPm
    }
    this.setState({
      calendarList: showTime
    })
  }

  getSelectedYear = () => {
    const { selectedYear } = this.state;
    return selectedYear;
  }

  getSelectedMonth = () => {
    const { selectedMonth } = this.state;
    //console.log(selectedMonth);
    return selectedMonth;
  }

  getDays = () => {
    const { startMonthDate, endMonthDate } = this.state;
    const days = []
    const dateStart = moment(startMonthDate);
    const dateEnd = moment(endMonthDate).add(dateEnd, 'days');
    while (dateEnd.diff(dateStart, 'days') >= 0) {
      days.push(dateStart.format('DD'))
      dateStart.add(1, 'days')
    }
    return days
  }

  getAllDates = () => {
    const days = this.getDays();
    const year = this.getSelectedYear();
    const month = this.getSelectedMonth();
    return days.map(day => {
      return `${year}-${month}-${day}`
    })
  }

  diaryMain = () => {
    const { agentId, startMonthDate, endMonthDate, selectedDate } = this.state;
    let endPoint = ``
    this.setState({ loading: true }, () => {
      endPoint = `/api/diary/all?fromDate=${startMonthDate}&toDate=${endMonthDate}&agentId=${agentId}`
      axios.get(`${endPoint}`)
        .then((res) => {
          const currentMonthDates = this.getAllDates();  //Get All dates of selected month in 'YYYY-MM-DD format
          const datesFromServer = _.pluck(res.data.rows, 'date'); // get array of dates by using 'date' as key from list of array of objects
          const formatedDates = _.map(datesFromServer, function (item) { return moment(item).format('YYYY-MM-DD') }); // convert it to our used format of dates
          const uniqueDates = _.uniq(formatedDates); // Get only uniquely identified dates
          let diaryTasks = _.reduce(currentMonthDates, (previousValue, currentValue) => Object.assign(previousValue,     // this function converts array to object because calendar component require object
            {
              [currentValue]:
              {
                selected: currentValue === selectedDate, // only selected if the date is today's date
                marked: _.contains(uniqueDates, currentValue),  // unique date format is 2020-08-01 so we check the array if it contains the date that that came from server
                dayTasks: _.contains(uniqueDates, currentValue) ? _.filter(res.data.rows, (item) => moment(item.date).format('YYYY-MM-DD') === currentValue) : [], // if date is similar put data object in the selected date else put empty object
              }
            }), {});
          this.setState({
            diaryData: diaryTasks,
          }, () => {
            this.showTime();
          })
        }).catch((error) => {
          console.log(error)
          this.setState({
            loading: false
          })
        })
    })

  }

  showTime = () => {
    const { diaryData, calendarList, selectedDate } = this.state;
    let selectedObject = {};
    let calendarData = {};
    const allDiaryDates = _.keys(diaryData);         // Get all dates 
    for (let i = 0; i < allDiaryDates.length; i++) {     // map all dates on selected dates
      if (allDiaryDates[i].match(selectedDate)) {
        selectedObject = diaryData[selectedDate];
      }
    }
    if (!_.isEmpty(selectedObject)) {
      if (selectedObject.dayTasks.length) { // Do manipulation on mapped dates
        let groupTasksByTime = _.map(selectedObject.dayTasks, (item) => {
          item.statusColor = helper.checkStatusColor(item, _today); // check status color for example todo task is indicated with red color
        })
        groupTasksByTime = (_.groupBy(selectedObject.dayTasks, 'hour')); // group tasks in a day by hour
        calendarData = calendarList.map((item, index) => {
          if (groupTasksByTime[item]) {
            return {
              time: item,
              task: _.sortBy(groupTasksByTime[item], 'time') // sort day tasks by time
            }
          } else {
            return {
              time: item,   // if day tasks does not contain any task on that particular time, this block is executed
              task: []
            }
          }
        })
        this.setState({
          newDiaryData: calendarData,
          loading: false
        })
      }
      else {
        calendarData = calendarList.map((item, index) => {
          return {
            time: item,   // no day tasks are present, show only empty time list e.g 10AM,11AM 
            diary: []
          }
        })
        this.setState({
          newDiaryData: calendarData,
          loading: false
        })
      }
    }
  }

  updateDay = (day) => {
    const { navigation } = this.props;
    const { diaryData } = this.state;
    const newDiaryData = Object.assign({}, diaryData); // creating new object because state cannot be changed directly
    const { dateString } = day
    const diaryDataKeys = _.keys(newDiaryData); // contains all the date keys as [2020-06-01,2020-06-02,.....]
    for (let i = 0; i < diaryDataKeys.length; i++) {
      if (diaryDataKeys[i].match(dateString)) {
        newDiaryData[dateString].selected = true    // update the selected value in object with the current selected date
      }
      else {
        newDiaryData[diaryDataKeys[i]].selected = false;     // set selected of all other values as false
      }
    }
    navigation.setOptions({ title: moment(dateString).format('DD MMMM YYYY') })
    this.setState({
      showCalendar: false,
      diaryData: newDiaryData,
      selectedDate: dateString,
    }, () => {
      this.showTime();
    });
  }

  updateMonth = (value) => {
    const { navigation } = this.props;
    const { dateString } = value;
    const startOfMonth = moment(dateString).startOf('month').format(_format);
    const endOfMonth = moment(dateString).endOf('month').format(_format);
    navigation.setOptions({ title: moment(dateString).format('DD MMMM YYYY') })
    this.setState({
      startMonthDate: startOfMonth,
      endMonthDate: endOfMonth,
      selectedMonth: moment(dateString).format('MM'),
      selectedDate: dateString,
    }, () => {
      this.diaryMain();
    })
  }

  goToDiaryForm = () => {
    const { navigation, route } = this.props;
    const { agentId } = this.state;
    const { screen, managerId } = route.params;
    navigation.navigate('AddDiary', {
      'agentId': agentId,
      addedBy: screen === 'TeamDiary' ? 'manager' : 'self',
      managerId: managerId ? managerId : null,
    });
  }

  showPopup = (val) => {
    if (val.taskType !== 'viewing' && val.taskType !== 'called' && val.armsProjectLeadId === null) {
      this.setState({
        openPopup: true,
        selectedDiary: val
      });
    }
  }

  closePopup = () => {
    this.setState({
      openPopup: false,
      loading: true,
    }, () => {
      this.diaryMain()
    })
  }

  updateDiary = (data) => {
    this.props.navigation.navigate('AddDiary',
      {
        'agentId': this.state.agentId,
        'update': true,
        'data': data
      })
    this.setState({
      openPopup: false,
    })
  }

  deleteDiary = (data) => {
    let endPoint = ``
    let that = this;
    endPoint = `/api/diary/delete?id=${data.id}`
    axios.delete(endPoint).then(function (response) {
      if (response.status === 200) {
        helper.successToast('TASK DELETED SUCCESSFULLY!')
        that.diaryMain();
      }

    }).catch(function (error) {
      helper.successToast(error.message)
    })

  }

  popupAction = (val, type) => {
    let endPoint = ``
    endPoint = `/api/diary/update?id=${val.id}`
    let that = this;
    switch (type) {
      case 'completed':
        axios.patch(endPoint, {
          status: type
        }).then(function (response) {
          if (response.status == 200)
            // console.log('responseSuccessCompleted');
            that.diaryMain();
        })
        break;
      case 'inProgress':
        axios.patch(endPoint, {
          status: type
        }).then(function (response) {
          if (response.status == 200)
            // console.log('responseSuccessInProgress');
            that.diaryMain();
        })

        break;
      default:
        break;

    }
  }

  handleLongPress = (val) => {
    const { user } = this.props;
    let isManager = false;
    const managerId = val.managerId ? val.managerId : null;
    isManager = managerId ? user.id == managerId ? true : false : false;
    if ((val.taskType !== 'Daily Task' && val.taskType !== 'Weekly Task') && (val.addedBy === 'self' || isManager) ) {
      ActionSheet.show(
        {
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX,
          title: 'Select an Option',
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            //Delete
            this.showDeleteDialog(val);
          }
        }
      );
    }
    else {
      helper.errorToast('Sorry, you are not authorized to delete this task.')
    }


  }

  showDeleteDialog(val) {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => this.deleteDiary(val) },
    ],
      { cancelable: false })
  }

  handleLeadLinkPress = (diaryObject) => {
    let url = diaryObject.armsLeadId ? `/api/leads/byId?id=${diaryObject.armsLeadId}` :
      `/api/leads/project/byId?id=${diaryObject.armsProjectLeadId}`

    axios.get(url).then(response => {
      this.setState({ openPopup: false })
      this.props.navigation.navigate('LeadDetail', { lead: response.data, purposeTab: response.data.purpose ? response.data.purpose : 'invest' })
    }).catch(error => {
      console.log('error', error)
    })

  }

  render() {
    const { showCalendar, startDate, loading, selectedDiary, newDiaryData, diaryData, selectedDate } = this.state;
    const { user, route } = this.props;
    //console.log(user.subRole);
    const { name } = route.params;
    return (
      !loading ?
        <View style={styles.container}>

          <DairyPopup
            screenName={route.params.screen}
            data={selectedDiary}
            updateDiary={this.updateDiary}
            openPopup={this.state.openPopup}
            closePopup={this.closePopup}
            onLeadLinkClicked={this.handleLeadLinkPress}
            popupAction={(val, type) => this.popupAction(val, type)}
          />

          {
            Ability.canAdd(user.subRole, route.params.screen) ?
              <Fab
                active='true'
                containerStyle={{ zIndex: 20 }}
                style={{ backgroundColor: AppStyles.colors.primaryColor }}
                position="bottomRight"
                onPress={this.goToDiaryForm}
              >
                <Ionicons name="md-add" color="#ffffff" />
              </Fab> :
              null
          }

          {
            // Show view with team member name if coming from team member screen
            route.params.screen === 'TeamDiary' ?
              <View style={styles.calenderIconContainer}>
                <View style={AppStyles.flexDirectionRow}>
                  <Text style={styles.teamMemberNameText}>{name !== null && name !== undefined ? name : ''}</Text>
                  <Text style={styles.diaryText}>Diary</Text>
                </View>
              </View>
              : null
          }


          {
            !showCalendar ?
              <TouchableOpacity onPress={this._toggleShow} activeOpacity={0.7}>
                <View style={styles.underLine} />
                <View style={styles.calenderIconContainer}>
                  <Image style={{ width: 30, height: 26 }} source={require('../../../assets/img/calendar2.png')} />
                  <Text style={styles.calendarText}>Calendar</Text>
                </View>
                <View style={styles.underLine}
                />
              </TouchableOpacity>
              :
              <CalendarComponent startDate={startDate}
                diaryData={diaryData}
                updateMonth={(value) => this.updateMonth(value)}
                updateDay={(value) => this.updateDay(value)}
                selectedDate={selectedDate}
                onPress={this._toggleShow} />
          }


          {
            newDiaryData && newDiaryData.length ?
              <DiaryTile data={newDiaryData} showPopup={this.showPopup} onLeadLinkPressed={this.handleLeadLinkPress} onLongPress={(val) => this.handleLongPress(val)} /> : null
          }
        </View >
        :
        <Loader loading={loading} />
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user
  }
}

export default connect(mapStateToProps)(Diary)
