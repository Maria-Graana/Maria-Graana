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
import { clearSlotData } from '../../actions/slotManagement'
import { getDiaryTasks } from '../../actions/diary'

class AddDiary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkValidation: false,
      taskValues: [],
      loading: false,
      //isAppRatingModalVisible: false,
    }
  }

  componentDidMount() {
    const { route, navigation } = this.props
    let { tasksList = StaticData.diaryTasks, rcmLeadId, cmLeadId } = route.params
    if (rcmLeadId) {
      tasksList = StaticData.diaryTasksRCM
    } else if (cmLeadId) {
      tasksList = StaticData.diaryTasksCM
    }
    if (route.params.update) {
      navigation.setOptions({ title: 'EDIT TASK' })
    }
    this.setState({ taskValues: tasksList })
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(clearSlotData())
  }

  formSubmit = (data) => {
    const { slotsData } = this.props
    if (slotsData === null || !data.taskType) {
      this.setState({
        checkValidation: true,
      })
    } else {
      this.setState({ loading: true }, () => {
        const copyInitialPayload = { ...data }
        copyInitialPayload.slots = slotsData.slots
        copyInitialPayload.startTime = slotsData.startTime
        copyInitialPayload.endTime = slotsData.endTime
        this.createDiary(copyInitialPayload)
      })
    }
  }

  generatePayload = (data) => {
    const { route, user } = this.props
    const { rcmLeadId, cmLeadId } = route.params
    let payload = null
    if (route.params.update) {
      // payload for update contains id of diary from existing api call and other user data
      payload = Object.assign({}, data)
      payload.date = data.startTime
      payload.time = data.startTime
      payload.userId = user.id
      payload.diaryTime = data.startTime
      payload.start = data.startTime
      payload.end = data.endTime
      payload.taskCategory = rcmLeadId || cmLeadId ? 'leadTask' : 'simpleTask'

      if (rcmLeadId) {
        payload.rcmLeadId = rcmLeadId
      } else if (cmLeadId) {
        payload.cmLeadId = cmLeadId
      }

      delete payload.startTime
      delete payload.endTime
      delete payload.hour
      return payload
    } else {
      // add payload contain these keys below

      payload = Object.assign({}, data)
      payload.date = data.startTime
      payload.userId = user.id
      payload.time = data.startTime
      payload.diaryTime = data.startTime
      payload.start = data.startTime
      payload.end = data.endTime
      payload.taskCategory = rcmLeadId || cmLeadId ? 'leadTask' : 'simpleTask'
      if (rcmLeadId) {
        payload.rcmLeadId = rcmLeadId
      } else if (cmLeadId) {
        payload.cmLeadId = cmLeadId
      }
      delete payload.startTime
      delete payload.endTime
      return payload
    }
  }

  createDiary = (diary) => {
    const { route, dispatch } = this.props
    if (route.params.update) {
      this.updateDiary(diary)
    } else {
      this.addDiary(diary)
    }
  }

  addDiary = (data) => {
    const { route, navigation, dispatch } = this.props
    let diary = this.generatePayload(data)
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
          dispatch(getDiaryTasks(moment(diary.date).format('YYYY-MM-DD'), diary.userId, false))
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
  }

  updateDiary = (data) => {
    let diary = this.generatePayload(data)
    const { dispatch, navigation } = this.props
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
        dispatch(getDiaryTasks(moment(diary.date).format('YYYY-MM-DD'), diary.userId, false))
        navigation.navigate('Diary', {
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

  goToSlotManagement = () => {
    const { navigation } = this.props
    navigation.navigate('TimeSlotManagement')
  }

  render() {
    const { checkValidation, taskValues, loading, isAppRatingModalVisible } = this.state
    const { route, slotsData } = this.props

    return (
      <KeyboardAwareScrollView
        style={[AppStyles.container]}
        keyboardShouldPersistTaps="always"
        enableOnAndroid
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} onLongPress={Keyboard.dismiss}>
          <>
            {/* <AppRatingModalPP
              isVisible={isAppRatingModalVisible}
              submitRating={this.submitRating}
            /> */}
            <SafeAreaView style={AppStyles.mb1}>
              <DetailForm
                formSubmit={this.formSubmit}
                props={this.props}
                editableData={route.params.update ? route.params.data : null}
                screenName={route.params.screenName ? route.params.screenName : null}
                taskValues={taskValues}
                checkValidation={checkValidation}
                loading={loading}
                goToSlotManagement={this.goToSlotManagement}
                slotsData={slotsData}
                // performTaskActions={(type) => this.performTaskActions(type)}
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
    slotsData: store.slotManagement.slotsPayload,
  }
}

export default connect(mapStateToProps)(AddDiary)
