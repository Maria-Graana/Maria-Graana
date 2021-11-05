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
      onLeadLinkPressed,
      addTask,
      editTask,
    } = this.props
    const { todayDate, selectedTime, showTask, description, active } = this.state
    //console.log(diary)
    return (
      <View style={styles.mainContainer}>
        <View style={styles.rowTwo}>
          <View style={styles.timeView}>
            <Text style={styles.time}>{diary.hour}</Text>
            <Text style={styles.duration}>{DiaryHelper.calculateTimeDifference(diary)}</Text>
          </View>
          <View style={[styles.tileWrap, { borderLeftColor: DiaryHelper.displayTaskColor(diary) }]}>
            <View style={styles.rowWidth100}>
              <Text numberOfLines={1} style={styles.taskType}>{`${DiaryHelper.showTaskType(
                diary.taskType
              )}${DiaryHelper.showClientName(diary)}`}</Text>

              <Text
                numberOfLines={1}
                onPress={() => setClassification(diary)}
                style={[styles.classification, { color: DiaryHelper.setLeadCategoryColor(diary) }]}
              >
                {DiaryHelper.checkLeadCategory(diary)}
              </Text>
              <View>
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
                        console.log('mark as done')
                        hideMenu()
                      }}
                      title="Mark as Done"
                    />

                    {diary.taskType === 'viewing' && diary.armsLeadId ? (
                      <Menu.Item
                        onPress={() => {
                          console.log('cancel viewing')
                          hideMenu()
                        }}
                        title="Cancel Viewing"
                      />
                    ) : null}

                    <Menu.Item
                      onPress={() => {
                        console.log('task details')
                        hideMenu()
                      }}
                      title="Task Details"
                    />

                    <Menu.Item
                      onPress={() => {
                        console.log('Edit Task')
                        hideMenu()
                      }}
                      title="Edit Task"
                    />

                    <Menu.Item
                      onPress={() => {
                        console.log('Refer Lead')
                        hideMenu()
                      }}
                      title="Refer Lead"
                    />

                    <Menu.Item
                      onPress={() => {
                        console.log('Reassign Lead')
                        hideMenu()
                      }}
                      title="Reassign Lead"
                    />

                    {diary.taskType === 'morning meeting' || diary.taskType === 'daily update' ? (
                      <Menu.Item
                        onPress={() => {
                          console.log('Delete')
                          hideMenu()
                        }}
                        title="Delete"
                      />
                    ) : null}
                  </View>
                </Menu>
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
                <Text style={styles.leadId}>
                  {diary.armsLeadId ? `ID:${diary.armsLeadId}` : `ID:${diary.armsProjectLeadId}`}
                </Text>
              </View>
              <TouchableOpacity
                style={{ width: '10%' }}
                onPress={() => console.log('call connect')}
              >
                <Ionicons name="ios-call-outline" size={24} color={AppStyles.colors.primaryColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default DiaryTile
