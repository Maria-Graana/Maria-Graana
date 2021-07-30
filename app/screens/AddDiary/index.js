/** @format */

import React, { Component } from 'react'
import { TouchableWithoutFeedback, SafeAreaView, Keyboard } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment-timezone'
import axios from 'axios'
import { connect } from 'react-redux'
import DetailForm from './detailForm'
import helper from '../../helper'
import AppStyles from '../../AppStyles'
import TimerNotification from '../../LocalNotifications'
import StaticData from '../../StaticData'
import { getGoogleAuth } from '../../actions/user'
import AppRatingModalPP from '../../components/AppRatingModalPP'

class AddDiary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkValidation: false,
      taskValues: [],
      loading: false,
      isAppRatingModalVisible: false,
    }
  }

  componentDidMount() {
    const { route, navigation } = this.props
    const { tasksList = StaticData.taskValues } = route.params
    if (route.params.update) {
      navigation.setOptions({ title: 'EDIT TASK' })
    }
    this.setState({ taskValues: tasksList })
  }

  formSubmit = (data) => {
    if (!data.taskType || !data.date || !data.startTime || !data.subject) {
      this.setState({
        checkValidation: true,
      })
    } else {
      this.setState({ loading: true }, () => {
        this.createDiary(data)
      })
    }
  }

  generatePayload = (data) => {
    const { route } = this.props
    const { rcmLeadId, cmLeadId, managerId, addedBy } = route.params
    let payload = null
    let start = helper.formatDateAndTime(helper.formatDate(data.date), data.startTime)
    let end =
      data.endTime !== ''
        ? helper.formatDateAndTime(helper.formatDate(data.date), data.endTime)
        : moment(start).add(1, 'hours').format('YYYY-MM-DDTHH:mm:ssZ') // If end date is not selected by user, add plus 1 hour in start time
    if (route.params.update) {
      // payload for update contains id of diary from existing api call and other user data
      payload = Object.assign({}, data)
      payload.date = start
      payload.time = rcmLeadId || cmLeadId ? data.startTime : helper.formatTime(data.startTime)
      payload.userId = route.params.agentId
      payload.diaryTime = start
      payload.start = start
      payload.end = end
      payload.taskCategory = rcmLeadId || cmLeadId ? 'leadTask' : 'simpleTask'

      if (rcmLeadId) {
        payload.rcmLeadId = rcmLeadId
      } else if (cmLeadId) {
        payload.cmLeadId = cmLeadId
      }

      delete payload.startTime
      delete payload.endTime
      delete payload.hour
      //console.log(payload)
      return payload
    } else {
      // add payload contain these keys below

      payload = Object.assign({}, data)
      payload.date = start
      payload.userId = route.params.agentId
      payload.time = data.startTime
      payload.diaryTime = start
      payload.start = start
      payload.end = end
      payload.taskCategory = rcmLeadId || cmLeadId ? 'leadTask' : 'simpleTask'
      if (rcmLeadId) {
        payload.rcmLeadId = rcmLeadId
      } else if (cmLeadId) {
        payload.cmLeadId = cmLeadId
      }
      payload.addedBy = addedBy
      payload.managerId = managerId
      delete payload.startTime
      delete payload.endTime
      return payload
    }
  }

  createDiary = (diary) => {
    const { route, dispatch } = this.props
    if (route.params.update) {
      dispatch(getGoogleAuth()).then((res) => {
        this.updateDiary(diary)
      })
    } else {
      dispatch(getGoogleAuth()).then((res) => {
        this.addDiary(diary)
      })
    }
  }

  addDiary = (data) => {
    const { route, navigation } = this.props
    const { rcmLeadId, cmLeadId } = route.params
    let diary = this.generatePayload(data)
    if (rcmLeadId || cmLeadId) {
      // create task for lead
      axios
        .post(`/api/leads/task`, diary)
        .then((res) => {
          if (res.status === 200) {
            helper.successToast('TASK ADDED SUCCESSFULLY!')
            let start = new Date(res.data.start)
            let end = new Date(res.data.end)
            let data = {
              id: res.data.id,
              title: res.data.subject,
              body: moment(start).format('hh:mm A') + ' - ' + moment(end).format('hh:mm A'),
            }
            TimerNotification(data, start)
            navigation.goBack()
          } else {
            helper.errorToast('ERROR: SOMETHING WENT WRONG')
          }
        })
        .catch((error) => {
          helper.errorToast('ERROR: ADDING DIARY')
          console.log('error', error.message)
        })
        .finally(() => {
          this.setState({ loading: false })
        })
    } else {
      axios
        .post(`/api/diary/create`, diary)
        .then((res) => {
          if (res.status === 200) {
            helper.successToast('TASK ADDED SUCCESSFULLY!')
            let start = new Date(res.data.start)
            let end = new Date(res.data.end)
            let data = {
              id: res.data.id,
              title: res.data.subject,
              body: moment(start).format('hh:mm') + ' - ' + moment(end).format('hh:mm'),
            }
            TimerNotification(data, start)
            navigation.navigate('Diary', {
              agentId: this.props.route.params.agentId,
            })
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
    }
  }

  updateDiary = (data) => {
    let diary = this.generatePayload(data)
    axios
      .patch(`/api/diary/update?id=${diary.id}`, diary)
      .then((res) => {
        helper.successToast('TASK UPDATED SUCCESSFULLY!')
        let start = new Date(res.data.start)
        let end = new Date(res.data.end)
        let data = {
          id: res.data.id,
          title: res.data.subject,
          body: moment(start).format('hh:mm') + ' - ' + moment(end).format('hh:mm'),
        }
        helper.deleteAndUpdateNotification(data, start, res.data.id)
        this.props.navigation.navigate('Diary', {
          update: false,
          agentId: this.props.route.params.agentId,
        })
      })
      .catch((error) => {
        helper.errorToast('ERROR: UPDATING TASK')
        console.log(error)
      })
      .finally(() => {
        this.setState({ loading: false })
      })
  }

  performTaskActions = (type) => {
    const { route } = this.props
    const { data } = route.params
    console.log('data', data)
    if (data && data.taskType === 'meeting_with_pp') {
      this.setState({ isAppRatingModalVisible: true })
    } else {
      this.performTask(type)
    }
  }

  performTask = (type, isRated = null, ratingComment = null) => {
    const { route, navigation } = this.props
    const { data } = route.params
    let endPoint = ``
    endPoint = `/api/diary/update?id=${data.id}`
    switch (type) {
      case 'completed':
        axios
          .patch(endPoint, {
            status: type,
            isRated,
            ratingComment,
          })
          .then(function (response) {
            if (response.status == 200) {
              helper.deleteLocalNotification(data.id)
              navigation.goBack()
            }
          })
        break
      default:
        break
    }
  }

  submitRating = (isRated, ratingComment) => {
    console.log(isRated, ratingComment)
    this.setState({ isAppRatingModalVisible: false }, () => {
      this.performTask('completed', isRated, ratingComment)
    })
  }

  render() {
    const { checkValidation, taskValues, loading, isAppRatingModalVisible } = this.state
    const { route } = this.props

    return (
      <KeyboardAwareScrollView
        style={[AppStyles.container]}
        keyboardShouldPersistTaps="always"
        enableOnAndroid
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} onLongPress={Keyboard.dismiss}>
          <>
            <AppRatingModalPP
              isVisible={isAppRatingModalVisible}
              submitRating={this.submitRating}
            />
            <SafeAreaView style={AppStyles.mb1}>
              <DetailForm
                formSubmit={this.formSubmit}
                props={this.props}
                editableData={route.params.update ? route.params.data : null}
                screenName={route.params.screenName ? route.params.screenName : null}
                taskValues={taskValues}
                checkValidation={checkValidation}
                loading={loading}
                performTaskActions={(type) => this.performTaskActions(type)}
              />
            </SafeAreaView>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(AddDiary)
