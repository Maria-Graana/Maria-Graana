import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, EvilIcons } from '@expo/vector-icons';
import DiaryTile from '../../components/DiaryTile'
import Loader from '../../components/loader'
import CalendarComponent from '../../components/CalendarComponent'
import { Fab } from 'native-base';
import data from '../../StaticData';
import _ from 'underscore';
import moment from 'moment';
import styles from './styles'

const _format = 'YYYY-MM-DD';
const _today = moment(new Date().dateString).format(_format);

class Diary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showCalendar: false,
      calendarList: [],
      startDate: moment(_today).format(_format),
      todayDate: moment(new Date()).format('L'),
      newDiaryData: [],
      diaryData: [],
      loading: false,
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      this.diaryMain();
    });
    this.listData();
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

  diaryMain = () => {
    let endPoint = ``
    // let date = moment(this.state.startDate).format('YYYY-MM-DD')
    //endPoint = `/api/diary/all?fromDate=${date}&toDate=${date}&agentId=${this.state.agentId}`
    // axios.get(`${endPoint}`)
    //  .then((res) => {
    this.setState({
      loading: true,
      diaryData: data.diaryRows,
    }, () => {
      this.showTime()
    })
  }

  checkStatus = (val) => {
    let statusColor = 'yellow'
    let taskDate = moment(val.date).format('L')
    let checkForCDate = taskDate == this.state.todayDate
    if (val.status == 'inProgress' && taskDate == this.state.todayDate) {
      return '#edb73f'
    }
    else if (checkForCDate && val.status != 'completed') {
      return '#3d78f6'
    }
    else if (taskDate > this.state.todayDate) {
      return '#edb73f'
    }
    else if (taskDate != this.state.todayDate && val.status != 'completed') {
      return 'red'
    }
    else if (val.status == 'completed') {
      return '#15c559'
    }
    else if (val.status == 'inProgress' && taskDate == this.state.todayDate) {
      return '#edb73f'
    }
    else {
      return '#000'
    }
  }


  showTime = () => {
    if (this.state.diaryData.length) {
      groupedData = this.state.diaryData.map((item, index) => {
        item.statusColor = this.checkStatus(item)
        if (item.hour) {
          item.hour = item.hour.replace(/(\d{2})/g, '$1 ').replace(/(^\s+|\s+$)/, '')
          return item;
        } else {
          return item
        }
      })
      groupedData = _.groupBy(this.state.diaryData, 'hour')
      calendarData = this.state.calendarList.map((item, index) => {
        if (groupedData[item]) {
          return {
            time: item,
            diary: _.sortBy(groupedData[item], 'time')
          }
        } else {
          return {
            time: item,
            diary: []
          }
        }
      })
      this.setState({
        newDiaryData: calendarData,
        loading: false
      })
    } else {
      calendarData = this.state.calendarList.map((item, index) => {
        return {
          time: item,
          diary: []
        }
      })
      this.setState({
        newDiaryData: calendarData,
        loading: false
      })
    }
  }

  updateDay = (day) => {
    const { dateString } = day
    let newDate = moment(dateString).format(_format)
    this.setState({
      startDate: newDate
    }, () => {
      //this.diaryMain()
    })
  }

  goToDiaryForm = () => {
    this.props.navigation.navigate('AddDiary', { 'agentId': this.state.agentId, 'update': false })
  }

  updateDiary = (data) => {
    this.props.navigation.navigate('AddDiary', { 'agentId': this.state.agentId, 'update': true, data: data })
    this.setState({
      openPopup: false,
    })
  }

  showPopup = (val) => {
    this.setState({
      openPopup: true,
      oneDiary: val
    })
  }

  closePopup = (val) => {
    this.setState({
      openPopup: false,
      loading: true,
    }, () => {
      this.diaryMain()
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
            console.log('responseSuccessCompleted');
          that.diaryMain();
        })
        break;
      case 'inProgress':
        axios.patch(endPoint, {
          status: type
        }).then(function (response) {
          if (response.status == 200)
            console.log('responseSuccessInProgress');
          that.diaryMain();
        })

        break;
      default:
        break;

    }
  }

  render() {
    const { showCalendar, startDate, newDiaryData, loading } = this.state;
    return (
      <View style={styles.container}>
        <Fab
          active='true'
          containerStyle={{ zIndex: 20 }}
          style={{ backgroundColor: '#484848' }}
          position="bottomRight"
          //onPress={this.goToDiaryForm}
          >
          <Ionicons name="md-add" color="#ffffff" />
        </Fab>
        <Text style={styles.heading}> Diary </Text>
        <TouchableOpacity onPress={this._toggleShow} activeOpacity={0.7}>
          <View style={styles.calenderIconContainer}>
            <EvilIcons name='calendar' size={styles.calenderIcon.fontSize} color={styles.calenderIcon.color} />
          </View>
        </TouchableOpacity>
        {
          showCalendar ?
            <CalendarComponent startDate={startDate} updateDay={this.updateDay} />
            : null
        }
        {
          newDiaryData && newDiaryData.length ?
            <DiaryTile data={newDiaryData} showPopup={this.showPopup} />
            : <Loader loading={loading} />
        }
      </View>
    )
  }
}

export default Diary;