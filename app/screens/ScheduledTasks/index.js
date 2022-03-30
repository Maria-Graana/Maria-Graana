/** @format */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FlatList, View, SafeAreaView, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import DiaryTile from '../../components/DiaryTile'
import styles from './style'
import axios from 'axios'
import AddLeadCategoryModal from '../../components/AddLeadCategoryModal'
import { Fab } from 'native-base'
import helper from '../../helper.js'
import noData from '../../../assets/img/no-result-found.png'
import {
  addInvestmentGuide,
  cancelDiaryMeeting,
  cancelDiaryViewing,
  clearDiaries,
  deleteDiaryTask,
  getActivityHistory,
  getDiaryFeedbacks,
  getDiaryTasks,
  initiateConnectFlow,
  markDiaryTaskAsDone,
  setCategory,
  setClassificationModal,
  setConnectFeedback,
  setMultipleModalVisible,
  setReferenceGuideData,
  setSelectedDiary,
} from '../../actions/diary'
import Loader from '../../components/loader'
import {
  alltimeSlots,
  clearSlotData,
  clearSlotDiaryData,
  getTimeShifts,
  setSlotData,
  setSlotDiaryData,
  setTimeSlots,
} from '../../actions/slotManagement'
import moment from 'moment'
import diaryHelper from '../Diary/diaryHelper'
import ReferenceGuideModal from '../../components/ReferenceGuideModal'
import MultiplePhoneOptionModal from '../../components/MultiplePhoneOptionModal'
import HistoryModal from '../../components/HistoryModal'

const _today = moment(new Date()).format('YYYY-MM-DD')

export class ScheduledTasks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false,
      isDelete: false,
      leadId: null,
      leadType: null,
      activityHistoryData: [],
      isActivityHistoryModalVisible: false,
    }
  }

  componentDidMount() {
    const { navigation, dispatch } = this.props
    dispatch(alltimeSlots())
    dispatch(setTimeSlots())
    dispatch(getTimeShifts())
    this._unsubscribe = navigation.addListener('focus', () => {
      const { route } = this.props
      dispatch(setSlotDiaryData(_today))
      // for scheduled tasks on basis of lead id
      const {
        cmLeadId = null,
        rcmLeadId = null,
        fromDate = null,
        toDate = null,
        wcmLeadId = null,
      } = route.params
      if (cmLeadId || rcmLeadId || wcmLeadId) {
        if (cmLeadId) {
          this.setState({ leadId: cmLeadId, leadType: 'invest' })
          dispatch(getDiaryTasks({ leadId: cmLeadId, leadType: 'invest' }))
        } else if (rcmLeadId) {
          this.setState({ leadId: rcmLeadId, leadType: 'buyRent' })
          dispatch(getDiaryTasks({ leadId: rcmLeadId, leadType: 'buyRent' }))
        } else if (wcmLeadId) {
          this.setState({ leadId: wcmLeadId, leadType: 'wanted' })
          dispatch(getDiaryTasks({ leadId: wcmLeadId, leadType: 'wanted' }))
        }
      } else {
        // from slots
        dispatch(getDiaryTasks({ fromDate, toDate }))
      }
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(clearDiaries())
  }

  showMenuOptions = (data) => {
    const { dispatch } = this.props
    dispatch(setSelectedDiary(data))
    this.setState({ showMenu: true })
  }

  hideMenu = () => {
    this.setState({ showMenu: false })
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
      purposeTab = 'wanted'
    }
    navigation.navigate('LeadDetail', { lead, purposeTab })
  }

  handleMenuActions = (action) => {
    const {
      navigation,
      diary,
      dispatch,
      connectFeedback,
      referenceGuide,
      selectedDiary,
      selectedLead,
      user,
      route,
    } = this.props
    const { selectedDate } = this.state
    const { isFromTimeSlot = false } = route.params
    if (action === 'mark_as_done') {
      if (selectedDiary.taskCategory === 'simpleTask') {
        dispatch(markDiaryTaskAsDone({ selectedDate, agentId: user ? user.id : null }))
      } else {
        dispatch(
          setConnectFeedback({
            ...connectFeedback,
            id: selectedDiary.id,
          })
        ).then((res) => {
          if (selectedDiary.taskType === 'meeting') {
            // check if reference number exists for meeting task when marking task as done, show modal if not
            // dispatch(setReferenceGuideData({ ...referenceGuide, isReferenceModalVisible: true }))
            // } else if (selectedDiary.taskType === 'meeting' && selectedLead.guideReference) {
            // reference number exists for the selected lead, so directly marking it as done
            dispatch(
              getDiaryFeedbacks({
                taskType: selectedDiary.taskType,
                leadType: diaryHelper.getLeadType(selectedDiary),
                actionType: 'Done',
              })
            ).then((res) => {
              navigation.navigate('DiaryFeedback', { actionType: 'Done' })
            })
          } else {
            // for all other cases
            dispatch(
              getDiaryFeedbacks({
                taskType: selectedDiary.taskType,
                leadType: diaryHelper.getLeadType(selectedDiary),
                actionType: 'Done',
              })
            ).then((res) => {
              navigation.navigate('DiaryFeedback', { actionType: 'Done' })
            })
          }
        })
      }
    } else if (action === 'cancel_viewing') {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          id: selectedDiary.id,
        })
      )
      dispatch(
        getDiaryFeedbacks({
          taskType: 'viewing',
          leadType: diaryHelper.getLeadType(selectedDiary),
          actionType: 'Cancel',
        })
      ).then((res) => {
        navigation.navigate('DiaryFeedback', { actionType: 'Cancel' })
      })
    } else if (action === 'cancel_meeting') {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          id: selectedDiary.id,
        })
      )
      dispatch(
        getDiaryFeedbacks({
          taskType: 'meeting',
          leadType: diaryHelper.getLeadType(selectedDiary),
          actionType: 'Cancel',
        })
      ).then((res) => {
        navigation.navigate('DiaryFeedback', { actionType: 'Cancel' })
      })
    } else if (action === 'task_details') {
      const { selectedDate } = this.state
      dispatch(clearDiaries())
      if (selectedDiary) {
        dispatch(
          setSlotData(
            moment(selectedDiary.date).format('YYYY-MM-DD'),
            selectedDiary.start,
            selectedDiary.end,
            []
          )
        )
      }
      navigation.navigate('TaskDetails', {
        diary: selectedDiary,
        selectedDate,
        agentId: user ? user.id : null,
        isFromTimeSlot: isFromTimeSlot,
      })
    } else if (action === 'edit_task') {
      this.goToAddEditDiaryScreen(true, selectedDiary)
    } else if (action === 'refer_lead') {
      this.navigateToReferAssignLead('refer')
    } else if (action === 'reassign_lead') {
      this.navigateToReferAssignLead('reassign')
    } else if (action === 'activity_history') {
      getActivityHistory(selectedLead, diaryHelper.getLeadType(selectedDiary)).then((res) => {
        if (res) {
          this.setState({ isActivityHistoryModalVisible: true, activityHistoryData: res.data })
        }
      })
    } else if (action === 'delete') {
      Alert.alert(
        'Delete Task',
        'Are you sure you want to delete this task ?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            onPress: () => {
              dispatch(deleteDiaryTask({ selectedDate, agentId: user ? user.id : null }))
              dispatch(clearSlotDiaryData())
              dispatch(setSlotDiaryData(selectedDate))
              this.setState({ isDelete: true })
            },
          },
        ],
        { cancelable: false }
      )
    } else if (action === 'add_investment_guide') {
      dispatch(setReferenceGuideData({ ...referenceGuide, isReferenceModalVisible: true }))
    }
  }

  goToAddEditDiaryScreen = (update, data = null) => {
    const { navigation, dispatch, route, user, permissions } = this.props
    const { cmLeadId = null, rcmLeadId = null, lead = null } = route.params
    if (data) {
      dispatch(setSlotData(moment(data.date).format('YYYY-MM-DD'), data.start, data.end, []))
    }
    navigation.navigate('AddDiary', {
      update,
      data,
      selectedDate: data ? moment(data.date).format('YYYY-MM-DD') : null,
      cmLeadId: cmLeadId,
      rcmLeadId: rcmLeadId,
      screenName: 'ScheduledTasks',
      lead: lead && helper.getAiraPermission(permissions) ? lead : null,
    })
  }

  navigateToReferAssignLead = (mode) => {
    const { navigation, selectedLead, selectedDiary } = this.props
    let type = null
    if (selectedDiary.armsProjectLeadId) {
      type = 'Investment'
    } else if (selectedDiary.armsLeadId) {
      type = selectedLead.purpose
    }
    navigation.navigate('AssignLead', {
      leadId: selectedLead.id,
      type: type,
      purpose: mode,
      screenName: 'ScheduleTasks',
    })
  }

  showMultiPhoneModal = (value) => {
    const { dispatch } = this.props
    dispatch(setMultipleModalVisible(value))
  }

  render() {
    const { showMenu, leadType, leadId, isActivityHistoryModalVisible, activityHistoryData } =
      this.state
    const {
      dispatch,
      diary,
      route,
      referenceGuide,
      navigation,
      isMultiPhoneModalVisible,
      selectedDiary,
      selectedLead,
      user,
    } = this.props
    const { purposeTab, isFromTimeSlot = false } = route.params
    const { diaries, loading, showClassificationModal, page } = diary
    return (
      <SafeAreaView style={styles.container}>
        {purposeTab != 'wanted' && !isFromTimeSlot && (
          <Fab
            active="true"
            containerStyle={{ zIndex: 20 }}
            style={{
              backgroundColor: AppStyles.colors.primaryColor,
            }}
            position="bottomRight"
            onPress={() => this.goToAddEditDiaryScreen()}
          >
            <Ionicons name="md-add" color="#ffffff" />
          </Fab>
        )}

        <AddLeadCategoryModal
          visible={showClassificationModal}
          toggleCategoryModal={(value) => {
            dispatch(setClassificationModal(value))
          }}
          onCategorySelected={(value) =>
            dispatch(
              setCategory({
                category: value,
                leadType,
                leadId,
              })
            )
          }
          selectedCategory={
            selectedLead && selectedLead.leadCategory ? selectedLead.leadCategory : null
          }
        />

        <ReferenceGuideModal
          isReferenceModalVisible={referenceGuide.isReferenceModalVisible}
          hideReferenceGuideModal={() =>
            dispatch(setReferenceGuideData({ ...referenceGuide, isReferenceModalVisible: false }))
          }
          addInvestmentGuide={(guideNo, attachments) =>
            dispatch(addInvestmentGuide({ guideNo, attachments })).then((res) => {
              dispatch(getDiaryTasks({ leadId, leadType }))
            })
          }
          referenceGuideLoading={referenceGuide.referenceGuideLoading}
          referenceErrorMessage={referenceGuide.referenceErrorMessage}
        />

        <MultiplePhoneOptionModal
          isMultiPhoneModalVisible={isMultiPhoneModalVisible}
          showMultiPhoneModal={(value) => this.showMultiPhoneModal(value)}
          navigation={navigation}
        />

        <HistoryModal
          navigation={navigation}
          data={activityHistoryData}
          closePopup={(value) => this.setState({ isActivityHistoryModalVisible: value })}
          openPopup={isActivityHistoryModalVisible}
        />

        {loading ? (
          <Loader loading={loading} />
        ) : diaries && diaries.rows && diaries.rows.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: diaries && diaries.rows.length - 1 ? 15 : 0 }}
            data={diaries.rows}
            renderItem={({ item, index }) => (
              <DiaryTile
                diary={item}
                showMenu={showMenu}
                showMenuOptions={(value) => this.showMenuOptions(value)}
                handleMenuActions={(action) => this.handleMenuActions(action)}
                setClassification={(diary) => {
                  dispatch(setSelectedDiary(diary))
                  dispatch(setClassificationModal(true))
                }}
                goToLeadDetails={this.navigateToLeadDetail}
                selectedDiary={selectedDiary}
                screenName={'scheduledTasks'}
                hideMenu={() => this.hideMenu()}
                initiateConnectFlow={(diary) => {
                  dispatch(setSelectedDiary(diary))
                  dispatch(initiateConnectFlow()).then((res) => {
                    this.showMultiPhoneModal(true)
                  })
                }}
                leadType={leadType}
                isOwnDiaryView={true}
                assignedToMe={
                  selectedDiary &&
                  selectedDiary.armsLead &&
                  user &&
                  selectedDiary.armsLead.assigned_to_armsuser_id === user.id
                    ? true
                    : false
                }
              />
            )}
            keyExtractor={(item, index) => item.id.toString()}
          />
        ) : (
          <Image source={noData} style={styles.noResultImg} />
        )}
      </SafeAreaView>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    diary: store.diary.diary,
    selectedDiary: store.diary.selectedDiary,
    selectedLead: store.diary.selectedLead,
    isMultiPhoneModalVisible: store.diary.isMultiPhoneModalVisible,
    slotDiary: store.slotManagement.slotDiaryData,
    connectFeedback: store.diary.connectFeedback,
    referenceGuide: store.diary.referenceGuide,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(ScheduledTasks)
