/** @format */

import React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import ListItem from '../ListItem/index'
import styles from './style'
import AppStyles from '../../AppStyles'
import moment from 'moment'
import helper from '../../helper'
import AddTaskModal from '../AddTaskModal'
import { Ionicons } from '@expo/vector-icons'
import { Menu } from 'react-native-paper'
import DiaryHelper from '../../screens/Diary/diaryHelper'

const _format = 'YYYY-MM-DD'
const _today = moment(new Date()).format(_format)
class DiaryTile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openPopup: false,
      todayDate: moment(new Date()).format('L'),
      showTask: false,
      selectedTime: null,
      description: null,
      active: false,
    }
  }

  componentDidMount() {}

  render() {
    const {
      diary,
      hideMenu,
      selectedDiary,
      showMenuOptions,
      showMenu,
      setClassification,
      handleMenuActions,
      goToLeadDetails,
      // addTask,
      // editTask,
      screenName,
    } = this.props
    //const { todayDate, selectedTime, showTask, description, active } = this.state
    //console.log(diary)
    return (
      <View style={styles.mainContainer}>
        <View style={styles.rowTwo}>
          <View style={styles.timeView}>
            {screenName === 'overduetasks' ? (
              <Text style={styles.time}>{moment(diary.start).format('DD MMM')}</Text>
            ) : null}
            <Text style={styles.time}>{diary.hour}</Text>
            <Text style={styles.duration}>{DiaryHelper.calculateTimeDifference(diary)}</Text>
          </View>
          <View
            style={[
              styles.tileWrap,
              {
                borderLeftColor: DiaryHelper.displayTaskColor(diary),
                backgroundColor: diary.status === 'completed' ? '#EEEEEE' : '#FFFFFF',
              },
            ]}
          >
            <View style={styles.rowWidth100}>
              <Text numberOfLines={1} style={styles.taskType}>{`${DiaryHelper.showTaskType(
                diary.taskType
              )}${DiaryHelper.showClientName(diary)}`}</Text>

              <View>
                {diary.status !== 'completed' ? (
                  <Menu
                    visible={showMenu && diary.id === selectedDiary.id}
                    onDismiss={() => hideMenu()}
                    anchor={
                      <Ionicons
                        onPress={() => showMenuOptions(diary)}
                        name="ellipsis-vertical"
                        size={22}
                        color="black"
                      />
                    }
                  >
                    <View>
                      <Menu.Item
                        onPress={() => {
                          handleMenuActions('mark_as_done')
                          hideMenu()
                        }}
                        title="Mark as Done"
                      />

                      {diary.taskType === 'viewing' && diary.armsLeadId ? (
                        <Menu.Item
                          onPress={() => {
                            handleMenuActions('cancel_viewing')
                            hideMenu()
                          }}
                          title="Cancel Viewing"
                        />
                      ) : null}

                      <Menu.Item
                        onPress={() => {
                          handleMenuActions('task_details')
                          hideMenu()
                        }}
                        title="Task Details"
                      />

                      <Menu.Item
                        onPress={() => {
                          handleMenuActions('edit_task')
                          hideMenu()
                        }}
                        title="Edit Task"
                      />

                      {!diary.wantedId ? (
                        <Menu.Item
                          onPress={() => {
                            handleMenuActions('refer_lead')
                            hideMenu()
                          }}
                          title="Refer Lead"
                        />
                      ) : null}

                      <Menu.Item
                        onPress={() => {
                          handleMenuActions('reassign_lead')
                          hideMenu()
                        }}
                        title="Reassign Lead"
                      />

                      {diary.taskType === 'morning meeting' || diary.taskType === 'daily update' ? (
                        <Menu.Item
                          onPress={() => {
                            handleMenuActions('delete')
                            hideMenu()
                          }}
                          title="Delete"
                        />
                      ) : null}
                    </View>
                  </Menu>
                ) : null}
              </View>
            </View>
            {diary && diary.response ? (
              <View style={styles.taskResponseView}>
                <Text style={styles.taskResponse}>{diary.response}</Text>
              </View>
            ) : null}
            <View style={styles.rowWidth100}>
              <Text numberOfLines={1} style={styles.requirements}>{`${DiaryHelper.checkLeadType(
                diary
              )} - ${DiaryHelper.showRequirements(diary)}`}</Text>
            </View>

            <View style={styles.rowWidth100}>
              <View style={styles.bottomView}>
                <Text onPress={() => goToLeadDetails(diary)} style={styles.leadId}>
                  {DiaryHelper.getLeadId(diary)}
                </Text>
              </View>
              {DiaryHelper.getLeadId(diary) === null ? null : (
                <>
                  <Text
                    numberOfLines={1}
                    onPress={() => setClassification(diary)}
                    style={[
                      styles.classification,
                      { color: DiaryHelper.setLeadCategoryColor(diary) },
                    ]}
                  >
                    {DiaryHelper.checkLeadCategory(diary)}
                  </Text>
                  <TouchableOpacity
                    style={{ width: '10%' }}
                    onPress={() => console.log('call connect')}
                  >
                    <Ionicons
                      name="ios-call-outline"
                      size={24}
                      color={AppStyles.colors.primaryColor}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default DiaryTile
