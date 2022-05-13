/** @format */

import React, { Component } from 'react'
import { TouchableWithoutFeedback, SafeAreaView, Keyboard } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment-timezone'
import axios from 'axios'
import { connect } from 'react-redux'
import DetailForm from './detailForm'
import helper from '../../helper'
import HeaderRight from '../../components/HeaderRight/index'
import AppStyles from '../../AppStyles'
import TimerNotification from '../../LocalNotifications'
import StaticData from '../../StaticData'
import DiaryHelper from './../Diary/diaryHelper'
import { getGoogleAuth } from '../../actions/user'
import AppRatingModalPP from '../../components/AppRatingModalPP'
import {
  alltimeSlots,
  clearSlotData,
  getTimeShifts,
  setSlotDiaryData,
  setTimeSlots,
} from '../../actions/slotManagement'
import { getDiaryTasks, setDiaryFilterReason } from '../../actions/diary'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import { StackActions } from '@react-navigation/native'

const _today = moment(new Date()).format('YYYY-MM-DD')

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
    const { route, navigation, dispatch, user, permissions } = this.props
    let {
      tasksList = StaticData.diaryTasks,
      rcmLeadId,
      cmLeadId,
      lead,
      navFrom,
      screenName = '',
    } = route.params
    if (navFrom) {
      tasksList = StaticData.diaryTasksMeetingWithClient
    } else if (
      getPermissionValue(PermissionFeatures.PROJECT_LEADS, PermissionActions.UPDATE, permissions) &&
      getPermissionValue(PermissionFeatures.BUY_RENT_LEADS, PermissionActions.UPDATE, permissions)
    ) {
      tasksList = StaticData.diaryTasksMeetView
    } else if (
      getPermissionValue(PermissionFeatures.PROJECT_LEADS, PermissionActions.UPDATE, permissions) &&
      !getPermissionValue(PermissionFeatures.BUY_RENT_LEADS, PermissionActions.UPDATE, permissions)
    ) {
      tasksList = StaticData.diaryTasksMeet
    } else if (
      getPermissionValue(
        PermissionFeatures.BUY_RENT_LEADS,
        PermissionActions.UPDATE,
        permissions
      ) &&
      !getPermissionValue(PermissionFeatures.PROJECT_LEADS, PermissionActions.UPDATE, permissions)
    ) {
      tasksList = StaticData.diaryTasksView
    }
    dispatch(alltimeSlots())
    dispatch(setTimeSlots())
    if (helper.getAiraPermission(permissions) && lead) {
      dispatch(getTimeShifts(lead.armsuser.id))
      dispatch(setSlotDiaryData(_today, lead.armsuser.id))
    } else {
      dispatch(getTimeShifts())
      dispatch(setSlotDiaryData(_today))
    }

    if (rcmLeadId && screenName == 'ScheduledTasks') {
      tasksList = StaticData.diaryTasksRCM
    } else if (cmLeadId && screenName == 'ScheduledTasks') {
      tasksList = StaticData.diaryTasksCM
    }

    if (route.params.update) {
      navigation.setOptions({ title: 'EDIT TASK' })
    } else {
      navigation.setOptions({ title: 'ADD TASK' })
    }

    this.setState({ taskValues: tasksList })
    if (route.params.selectedDate) {
      dispatch(setSlotDiaryData(route.params.selectedDate))
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(clearSlotData())
    dispatch(setDiaryFilterReason(null))
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
    const { route, user, feedbackReasonFilter = null, permissions } = this.props
    const { rcmLeadId, cmLeadId, lead } = route.params
    let payload = null
    if (route.params.update) {
      // payload for update contains id of diary from existing api call and other user data
      payload = Object.assign({}, data)
      payload.date = data.startTime
      payload.time = data.startTime
      payload.userId = helper.getAiraPermission(permissions) && lead ? lead.armsuser.id : user.id
      payload.diaryTime = data.startTime
      payload.start = data.startTime
      payload.end = data.endTime
      payload.taskCategory = rcmLeadId || cmLeadId ? 'leadTask' : 'simpleTask'

      if (rcmLeadId) {
        payload.armsLeadId = rcmLeadId
      } else if (cmLeadId) {
        payload.leadId = cmLeadId
      }

      delete payload.startTime
      delete payload.endTime
      delete payload.hour
      return payload
    } else {
      // add payload contain these keys below

      payload = Object.assign({}, data)
      payload.date = data.startTime
      payload.userId = helper.getAiraPermission(permissions) && lead ? lead.armsuser.id : user.id
      payload.time = data.startTime
      payload.diaryTime = data.startTime
      payload.start = data.startTime
      payload.end = data.endTime
      payload.taskCategory = rcmLeadId || cmLeadId ? 'leadTask' : 'simpleTask'

      if (data.taskType === 'follow_up') {
        payload.reasonTag = feedbackReasonFilter ? feedbackReasonFilter.name : null
        payload.reasonId =
          feedbackReasonFilter && feedbackReasonFilter.value ? feedbackReasonFilter.value[0] : null
      }

      if (data && data.selectedProperty) {
        payload.propertyId = data.selectedProperty.id
        payload.leadId = rcmLeadId
        payload.customer_Id = data.selectedLead.customer && data.selectedLead.customer.id
        payload.subject =
          'Viewing' +
          (data.selectedLead.customer && ' with ' + data.selectedLead.customer.customerName) +
          (data.selectedProperty &&
            data.selectedProperty.area &&
            ' at ' + data.selectedProperty.area.name)
      } else {
        if (rcmLeadId) {
          payload.armsLeadId = rcmLeadId
        } else if (cmLeadId) {
          payload.leadId = cmLeadId
        }
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

    const {
      screenName = 'Diary',
      cmLeadId,
      rcmLeadId,
      property,
      customerName = null,
    } = route.params

    let diary = this.generatePayload(data)

    let query = property ? `/api/leads/viewing` : `/api/leads/task`
    axios
      .post(query, diary)
      .then((res) => {
        if (res?.status === 200) {
          helper.successToast('TASK ADDED SUCCESSFULLY!')

          let notificationData

          for (let i in res.data[1]) {
            notificationData = res.data[1][i]
          }

          let start = new Date(notificationData.start)
          let end = new Date(notificationData.end)

          let notificationPayload

          if (diary.taskType == 'viewing') {
            start = new Date(diary.start)
            end = new Date(diary.end)

            notificationPayload = {
              clientName:
                screenName == 'ScheduledTasks'
                  ? customerName
                  : data?.selectedLead?.customer?.customerName,
              id: diary.userId,
              title: DiaryHelper.showTaskType(diary?.taskType),
              body: moment(start).format('hh:mm A') + ' - ' + moment(end).format('hh:mm A'),
            }

            //  TimerNotification(notificationPayload, start)
          } else {
            if (notificationData.taskCategory == 'leadTask') {
              notificationPayload = {
                clientName:
                  screenName == 'ScheduledTasks'
                    ? customerName
                    : data?.selectedLead?.customer?.customerName,
                id: notificationData.id,
                title: DiaryHelper.showTaskType(notificationData?.taskType),
                body:
                  moment(new Date(notificationData.start)).format('hh:mm A') +
                  ' - ' +
                  moment(end).format('hh:mm A'),
              }

              // TimerNotification(notificationPayload, start)
            } else {
              notificationPayload = {
                id: notificationData.id,
                title: DiaryHelper.showTaskType(notificationData.taskType),
                body: moment(start).format('hh:mm A') + ' - ' + moment(end).format('hh:mm A'),
              }
              //  TimerNotification(notificationPayload, start)
            }
          }

          if (screenName === 'Diary') {
            dispatch(
              getDiaryTasks({
                selectedDate: moment(diary.date).format('YYYY-MM-DD'),
                agentId: diary.userId,
                overdue: false,
              })
            )
          } else {
            dispatch(
              getDiaryTasks({
                leadId: cmLeadId ? cmLeadId : rcmLeadId,
                leadType: cmLeadId ? 'invest' : 'buyRent',
              })
            )
          }
          navigation.navigate(screenName, { cmLeadId, rcmLeadId })
        } else {
          helper.errorToast('ERROR: SOMETHING WENT WRONG')
          this.setState({ loading: false })
        }
      })
      .catch((error) => {
        helper.errorToast('ERROR: ADDING DIARY')
        console.log('error', error.message)
        this.setState({ loading: false })
      })
  }

  updateDiary = (data) => {
    let diary = this.generatePayload(data)
    const { dispatch, navigation, route } = this.props
    const { screenName = 'Diary', cmLeadId, rcmLeadId } = route.params
    axios
      .patch(`/api/diary/update?id=${diary.id}`, diary)
      .then((res) => {
        helper.successToast('TASK UPDATED SUCCESSFULLY!')

        let start = new Date(res.data.start)
        let end = new Date(res.data.end)
        let newData = {
          id: res.data.id,
          title: res.data.subject,
          body: moment(start).format('hh:mm') + ' - ' + moment(end).format('hh:mm'),
        }

        let notificationPayload
        if (res?.data?.taskCategory == 'leadTask') {
          notificationPayload = {
            clientName: data?.selectedLead?.customer?.customerName,
            id: res?.data?.id,
            title: DiaryHelper.showTaskType(res?.data?.taskType),
            body: moment(start).format('hh:mm A') + ' - ' + moment(end).format('hh:mm A'),
          }
        } else {
          notificationPayload = {
            id: res?.data?.id,
            title: DiaryHelper.showTaskType(res?.data?.taskType),
            body: moment(start).format('hh:mm A') + ' - ' + moment(end).format('hh:mm A'),
          }
        }

        helper.deleteAndUpdateNotification(notificationPayload, start, res.data.id)

        if (screenName === 'Diary') {
          dispatch(
            getDiaryTasks({
              selectedDate: moment(diary.date).format('YYYY-MM-DD'),
              agentId: diary.userId,
              overdue: false,
            })
          )
        } else {
          dispatch(
            getDiaryTasks({
              leadId: cmLeadId ? cmLeadId : rcmLeadId,
              leadType: cmLeadId ? 'invest' : 'buyRent',
            })
          )
        }

        navigation.navigate(screenName, {
          update: false,
          agentId: this.props.route.params.agentId,
          cmLeadId,
          rcmLeadId,
        })
      })
      .catch((error) => {
        helper.errorToast('ERROR: UPDATING TASK')
        console.log(error)
        this.setState({ loading: false })
      })
  }

  goToSlotManagement = (data) => {
    const { navigation, slotsData } = this.props
    navigation.navigate('TimeSlotManagement', {
      taskType: data.taskType,
      date: slotsData ? slotsData.date : null,
    })
  }

  goToLeads = (data) => {
    const { navigation } = this.props

    navigation.setOptions({
      headerRight: (props) => <HeaderRight navigation={navigation} />,
      title: 'SELECT LEAD',
    })

    navigation.dispatch(
      StackActions.push('Leads', {
        screen: 'Leads',
        screenName: 'AddDiary',
        navFrom: data.taskType,
        hasBooking: false,
        hideCloseLostFilter: true,
      })
    )
  }

  goToLeadProperties = () => {
    const { navigation } = this.props
    navigation.navigate('PropertyList', { screenName: 'AddDiary' })
  }

  goToDiaryReasons = () => {
    const { navigation } = this.props
    navigation.navigate('DiaryReasons', { screenName: 'AddDiary' })
  }

  render() {
    const { checkValidation, taskValues, loading, isAppRatingModalVisible } = this.state
    const { route, slotsData, navigation } = this.props
    const { lead, property, navFrom } = route.params

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
                goToDiaryReasons={this.goToDiaryReasons}
                goBackToDiary={() => navigation.goBack()}
                slotsData={slotsData}
                goToLeads={this.goToLeads}
                goToLeadProperties={this.goToLeadProperties}
                lead={lead}
                property={property}
                navigation={navigation}
                navFrom={navFrom}
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
    feedbackReasonFilter: store.diary.feedbackReasonFilter,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(AddDiary)
