import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, EvilIcons } from '@expo/vector-icons';
import DiaryTile from '../../components/DiaryTile'
import Loader from '../../components/loader'
import CalendarComponent from '../../components/CalendarComponent'
import axios from 'axios';
import { Fab } from 'native-base';
import data from '../../StaticData';
import _ from 'underscore';
import moment from 'moment';
import AppStyles from '../../AppStyles'
import styles from './styles'
import Ability from '../../hoc/Ability'
import { connect } from 'react-redux';

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
      loading: true,
      agentId: '',
     // screen: this.props.route.params.screen
    }
  }

  componentDidMount() {
    const { navigation, route, user } = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      if (route.params !== undefined && 'agentId' in route.params && route.params.agentId) {
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
    const { agentId } = this.state;
    let endPoint = ``
    let date = moment(this.state.startDate).format('YYYY-MM-DD')
    endPoint = `/api/diary/all?fromDate=${date}&toDate=${date}&agentId=${agentId}`
    axios.get(`${endPoint}`)
      .then((res) => {
        this.setState({
          loading: true,
          diaryData: res.data.rows,
        }, () => {
          this.showTime()
        })
      }).catch((error) => {
        console.log(error)
        this.setState({
          loading: false
        })
      })
  }

  checkStatus = (val) => {
    let taskDate = moment(val.date).format('L')
    let checkForCDate = taskDate == this.state.todayDate
    if (val.status == 'inProgress' && taskDate == this.state.todayDate) {
      return 'yellow'
    }
    else if (checkForCDate && val.status != 'completed') {
      return 'red'
    }
    else if (taskDate != this.state.todayDate && val.status != 'completed') {
      return AppStyles.colors.subTextColor;
    }
    else if (val.status == 'completed') {
      return 'green'
    }
    else {
      return AppStyles.colors.subTextColor;
    }
  }



  showTime = () => {
    const { diaryData, calendarList } = this.state;
    let calendarData = null;
    if (diaryData.length) {
      let groupedData = diaryData.map((item, index) => {
        item.statusColor = this.checkStatus(item)
        if (item.hour) {
          // item.hour = item.hour.replace(/(\d{2})/g, '$1 ').replace(/(^\s+|\s+$)/, '')
          return item;
        } else {
          return item
        }
      })
      groupedData = _.groupBy(diaryData, 'hour')
      calendarData = calendarList.map((item, index) => {
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
    }
    else {
      calendarData = calendarList.map((item, index) => {
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
      startDate: newDate,
      showCalendar: false
    }, () => {
      this.diaryMain()
    })
  }

  goToDiaryForm = () => {
    const { navigation } = this.props;
    const { agentId } = this.state;
    navigation.navigate('AddDiary', {
      'agentId': agentId
    });
  }


  render() {
    const { showCalendar, startDate, newDiaryData, loading, screen } = this.state;
    const { user,route } = this.props;
    return (
      <View style={styles.container}>
        {
          Ability.canAdd(user.role, route.params.screen) ?
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
          !showCalendar ?
            <TouchableOpacity onPress={this._toggleShow} activeOpacity={0.7}>
              <Ionicons style={{ position: 'absolute', right: 20, top: 15 }}
                name="ios-arrow-down" size={26}
                color={AppStyles.colors.primaryColor} />
              <View style={styles.calenderIconContainer}>
                <Ionicons name='md-calendar' size={26} color={AppStyles.colors.primaryColor} />
                <Text style={styles.calendarText}>Calendar</Text>
              </View>
              <View style={styles.underLine}
              />
            </TouchableOpacity>
            : null
        }

        {
          showCalendar ?
            <CalendarComponent startDate={startDate} updateDay={this.updateDay} onPress={this._toggleShow} />
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


mapStateToProps = (store) => {
  return {
    user: store.user.user
  }
}

export default connect(mapStateToProps)(Diary)
