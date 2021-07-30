/** @format */

import React from 'react'
import { View, Text, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { AntDesign, Entypo } from '@expo/vector-icons'
import ListItem from '../ListItem/index'
import styles from './style'
import AppStyles from '../../AppStyles'
import moment from 'moment'
import helper from '../../helper'
import AddTaskModal from '../AddTaskModal'

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

  onChange = (date, mode) => {}

  updateDiary = (data) => {
    this.props.updateDiary(data)
  }

  // showPopup = (val) => {
  //     this.props.showPopup(val)
  // }

  handleLongPress = (val) => {
    this.props.onLongPress(val)
  }

  showAddTask = (showTask, time, description) => {
    this.setState({ showTask, selectedTime: time, description })
  }

  handleDescriptionChange = (text) => {
    this.setState({ description: text })
  }

  closeModal = () => {
    this.setState({ active: false })
  }

  removeUnderscore(str) {
    var i,
      frags = str.split('_')
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1)
    }
    return frags.join(' ')
  }

  showTaskType = (val) => {
    let finalValue = ''
    if (val && val.taskType) {
      finalValue = this.removeUnderscore(val.taskType)
      if (finalValue === 'Meeting With Pp') {
        return 'Meeting With PP'
      } else {
        return finalValue
      }
    } else {
      return finalValue
    }
  }

  render() {
    const { data, onLeadLinkPressed, addTask, editTask } = this.props
    const { todayDate, selectedTime, showTask, description, active } = this.state
    return (
      <View style={AppStyles.mb1}>
        <AddTaskModal
          active={active}
          closeModal={() => this.closeModal()}
          handleDescriptionChange={(text) => this.handleDescriptionChange(text)}
          description={description}
          addTask={(description) => {
            addTask(description, selectedTime)
          }}
        />
        <TouchableWithoutFeedback
          style={AppStyles.mb1}
          onPress={() => this.showAddTask(false, null, null)}
        >
          <FlatList
            data={data}
            renderItem={(item, index) => (
              <View>
                {item.item.task && item.item.task.length ? (
                  <View style={styles.container}>
                    <TouchableOpacity
                      onPress={() => this.setState({ active: true, selectedTime: item.item.time })}
                      style={styles.timeWrap}
                    >
                      <Text style={styles.timeText}>{item.item.time}</Text>
                    </TouchableOpacity>
                    {item.item.task.map((val, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => editTask(val)}
                          onLongPress={() => this.handleLongPress(val)}
                          key={index}
                          activeOpacity={0.7}
                          style={[styles.tileWrap, { borderLeftColor: val.statusColor }]}
                        >
                          <View style={styles.innerTile}>
                            <Text style={styles.showTime}>
                              {moment(val.start).format('hh:mm a')} -{' '}
                              {moment(val.end).format('hh:mm a')}{' '}
                            </Text>
                            <Text
                              style={[
                                styles.statusText,
                                { color: val.statusColor, borderColor: val.statusColor },
                              ]}
                            >
                              {helper.setStatusText(val, todayDate)}
                            </Text>
                          </View>
                          <Text style={styles.meetingText}>{val.subject}</Text>
                          {val && val.notes ? (
                            <Text numberOfLines={1} style={styles.meetingText}>
                              {val.notes}
                            </Text>
                          ) : null}
                          <View style={styles.innerTile}>
                            <Text style={styles.meetingText}>{this.showTaskType(val)}</Text>
                            {val.armsLeadId !== null || val.armsProjectLeadId !== null ? (
                              <TouchableOpacity
                                style={styles.lead}
                                onPress={() => onLeadLinkPressed(val)}
                              >
                                <Text style={styles.leadText}>
                                  {`${val.armsLeadId ? val.armsLeadId : val.armsProjectLeadId} `}
                                </Text>
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                ) : (
                  <View>
                    <ListItem
                      handleDescriptionChange={(text) => this.handleDescriptionChange(text)}
                      description={description}
                      showTask={showTask}
                      selectedTime={selectedTime}
                      addTask={(description) => {
                        addTask(description, selectedTime)
                        this.showAddTask(false, null, null)
                      }}
                      showAddTask={(val1, val2) => this.showAddTask(val1, val2)}
                      time={item.item.time}
                    />
                  </View>
                )}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

export default DiaryTile
