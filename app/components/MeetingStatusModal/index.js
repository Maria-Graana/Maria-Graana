import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, Modal } from 'react-native';
import styles from './style';
import times from '../../../assets/img/times.png'
import StaticData from '../../StaticData'
import AppStyles from '../../AppStyles';

class MeetingStatusModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      data,
      doneStatus,
      sendStatus,
      openStatus,
      modalType,
      goToDiaryForm,
      goToAttachments,
      goToComments
    } = this.props
    if (modalType === 'dropdown') {
      let taskTypeData = []
      data.taskType === 'meeting' ?
        taskTypeData = StaticData.meetingStatus
        :
        taskTypeData = StaticData.callStatus
      return (
        <Modal visible={doneStatus}>
          <View style={[AppStyles.mb1, styles.dropDownMain]}>
            <TouchableOpacity style={styles.timesBtn} onPress={() => { openStatus('') }}>
              <Image source={times} style={styles.timesImg} />
            </TouchableOpacity>
            <FlatList
              data={taskTypeData}
              renderItem={({ item }) =>
                <TouchableOpacity style={[styles.doneBtnBottom]} onPress={() => { sendStatus(item.value) }}>
                  <Text style={styles.blueColor}>{item.name}</Text>
                </TouchableOpacity>}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </Modal>
      )
    }
    if (modalType === 'btnOptions') {
      return (
        <Modal visible={doneStatus}>
          <View style={[styles.dotsWrap]}>
            <View style={[styles.dropDownMain]}>
              <TouchableOpacity style={styles.timesBtn} onPress={() => { openStatus('') }}>
                <Image source={times} style={styles.timesImg} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.doneBtnBottom]} onPress={() => { goToAttachments() }}>
                <Text style={styles.blueColor}>Attachments</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.doneBtnBottom]} onPress={() => { goToComments() }}>
                <Text style={styles.blueColor}>Comments</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.doneBtnBottom]} onPress={() => { goToDiaryForm() }}>
                <Text style={styles.blueColor}>Task</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      )
    }
  }
}

export default MeetingStatusModal;