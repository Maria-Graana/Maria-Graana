import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { ActionSheet } from 'native-base';
import { Ionicons, EvilIcons } from '@expo/vector-icons';
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
const _today = moment(new Date().dateString).format(_format);
var BUTTONS = ['Delete', 'Cancel'];
var CANCEL_INDEX = 1;

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
      openPopup: false,
      selectedDiary: {}
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
    this.setState({ loading: true }, () => {
      let date = moment(this.state.startDate).format('YYYY-MM-DD')
      endPoint = `/api/diary/all?fromDate=${date}&toDate=${date}&agentId=${agentId}`
      axios.get(`${endPoint}`)
        .then((res) => {
          this.setState({
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
    })

  }

  checkStatus = (val) => {
    let taskDate = moment(val.date).format('L')
    let checkForCDate = taskDate == this.state.todayDate
    if (val.status == 'inProgress' && taskDate == this.state.todayDate) {
      return '#FDD835'
    }
    else if (taskDate > this.state.todayDate) {
      return 'red'
    }
    else if (checkForCDate && val.status === 'pending') {
      return 'red'
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

  showPopup = (val) => {
    this.setState({
      openPopup: true,
      selectedDiary: val
    });
  }

  closePopup = (val) => {
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
        helper.successToast('DIARY DELETED SUCCESSFULLY!')
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

  handleLongPress = (val) => {
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

  showDeleteDialog(val) {
    Alert.alert('Delete Diary', 'Are you sure you want to delete this diary ?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => this.deleteDiary(val) },
    ],
      { cancelable: false })
  }

  render() {
    const { showCalendar, startDate, newDiaryData, loading, selectedDiary } = this.state;
    const { user, route } = this.props;
    return (
      !loading ?
        <View style={styles.container}>
          <DairyPopup
            screenName={route.params.screen}
            data={selectedDiary}
            updateDiary={this.updateDiary}
            deleteDiary={this.deleteDiary}
            openPopup={this.state.openPopup}
            closePopup={this.closePopup}
            popupAction={(val, type) => this.popupAction(val, type)}
          />

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
                <View style={styles.calenderIconContainer}>
                  <Image style={{ width: 26, height: 26 }} source={require('../../../assets/img/calendar.png')} />
                  <Text style={styles.calendarText}>Calendar</Text>
                </View>
                <View style={styles.underLine}
                />
              </TouchableOpacity>
              : null
          }

          {
            newDiaryData && newDiaryData.length ?
              <DiaryTile data={newDiaryData} showPopup={this.showPopup} onLongPress={(val) => this.handleLongPress(val)} /> : null
          }
        </View>
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
