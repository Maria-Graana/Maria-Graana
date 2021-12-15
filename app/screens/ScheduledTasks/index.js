/** @format */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FlatList, View, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import DiaryTile from '../../components/DiaryTile'
import style from './style'
import axios from 'axios'
import AddLeadCategoryModal from '../../components/AddLeadCategoryModal'
import { Fab } from 'native-base'
import helper from '../../helper.js'
import {
  cancelDiaryMeeting,
  cancelDiaryViewing,
  deleteDiaryTask,
  getDiaryTasks,
  markDiaryTaskAsDone,
  setCategory,
  setClassificationModal,
  setSelectedDiary,
} from '../../actions/diary'
import Loader from '../../components/loader'
import { clearSlotData, setSlotData, setSlotDiaryData } from '../../actions/slotManagement'
import moment from 'moment'

export class ScheduledTasks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false,
      isDelete: false,
      leadId: null,
      leadType: null,
    }
  }

  componentDidMount() {
    const { navigation, dispatch } = this.props
    this._unsubscribe = navigation.addListener('focus', () => {
      const { route } = this.props
      // for scheduled tasks on basis of lead id
      if (route.params) {
        const { cmLeadId = null, rcmLeadId = null } = route.params
        if (cmLeadId) {
          this.setState({ leadId: cmLeadId, leadType: 'invest' })
          dispatch(getDiaryTasks({ leadId: cmLeadId, leadType: 'invest' }))
        } else if (rcmLeadId) {
          this.setState({ leadId: rcmLeadId, leadType: 'buyRent' })
          dispatch(getDiaryTasks({ leadId: rcmLeadId, leadType: 'buyRent' }))
        }
      } else {
        console.log('call scheduled tasks from slots api call')
      }
    })
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
      purposeTab = lead.purpose
    }
    navigation.navigate('LeadDetail', { lead, purposeTab })
  }

  handleMenuActions = (action) => {
    const { navigation, diary, dispatch } = this.props
    const { selectedDiary } = diary
    const { leadType, leadId } = this.state
    if (action === 'mark_as_done') {
      dispatch(markDiaryTaskAsDone({ leadId, leadType }))
    } else if (action === 'cancel_viewing') {
      dispatch(cancelDiaryViewing({ leadId, leadType }))
    } else if (action === 'cancel_meeting') {
      dispatch(cancelDiaryMeeting({ leadId, leadType }))
    } else if (action === 'task_details') {
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
      navigation.navigate('TaskDetails', { diary: selectedDiary })
    } else if (action === 'edit_task') {
      this.goToAddEditDiaryScreen(true, selectedDiary)
    } else if (action === 'refer_lead') {
      this.navigateToReferAssignLead('refer')
    } else if (action === 'reassign_lead') {
      this.navigateToReferAssignLead('reassign')
    } else if (action === 'delete') {
      Alert.alert(
        'Delete Task',
        'Are you sure you want to delete this task ?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            onPress: () => {
              dispatch(deleteDiaryTask({ leadId, leadType }))
              // dispatch(clearSlotData())
              // dispatch(setSlotDiaryData(selectedDate))
              // this.setState({ isDelete: true })
            },
          },
        ],
        { cancelable: false }
      )
    }
  }

  goToAddEditDiaryScreen = (update, data = null) => {
    const { navigation, dispatch, route } = this.props
    const { cmLeadId = null, rcmLeadId = null } = route.params
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
    })
  }

  navigateToReferAssignLead = (mode) => {
    const { navigation } = this.props
    const { selectedLead, selectedDiary } = this.props.diary
    let type = null
    if (selectedDiary.armsProjectLeadId) {
      type = 'investment'
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

  render() {
    const { showMenu, leadType, leadId } = this.state
    const { route, dispatch, diary, scheduledTasks } = this.props
    const { diaries, loading, selectedDiary, selectedLead, showClassificationModal, page } = diary
    return (
      <SafeAreaView style={style.container}>
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
              })
            )
          }
          selectedCategory={
            selectedLead && selectedLead.leadCategory ? selectedLead.leadCategory : null
          }
        />
        {loading ? (
          <Loader loading={loading} />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={scheduledTasks ? scheduledTasks.diary : diaries.rows}
            renderItem={({ item, index }) => (
              <DiaryTile
                diary={item}
                showMenu={showMenu}
                showMenuOptions={(value) => this.showMenuOptions(value)}
                selectedDiary={selectedDiary}
                hideMenu={() => this.hideMenu()}
                goToLeadDetails={this.navigateToLeadDetail}
                handleMenuActions={(action) => this.handleMenuActions(action)}
                setClassification={(diary) => {
                  dispatch(setSelectedDiary(diary))
                  dispatch(setClassificationModal(true))
                }}
              />
            )}
            keyExtractor={(item, index) => item.id.toString()}
          />
        )}
      </SafeAreaView>
    )
  }
}

mapStateToProps = (store) => {
  return {
    scheduledTasks: store.slotManagement.setScheduled,
    diary: store.diary.diary,
    selectedDiary: store.diary.selectedDiary,
    selectedLead: store.diary.selectedLead,
  }
}

export default connect(mapStateToProps)(ScheduledTasks)
