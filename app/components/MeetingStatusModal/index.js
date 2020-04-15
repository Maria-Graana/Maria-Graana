import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './style';
import AppStyles from '../../AppStyles';
import dots from '../../../assets/img/dots.png';
import moment from 'moment';
import StaticData from '../../StaticData'
import Modal from 'react-native-modal';

class MeetingStatusModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data, doneStatus, sendStatus } = this.props
    let taskTypeData = []
    data.taskType === 'meeting' ?
      taskTypeData = StaticData.meetingStatus
      :
      taskTypeData = StaticData.callStatus
    return (
      <Modal isVisible={doneStatus}>
        <View style={[styles.dotsWrap]}>
          <View style={[styles.dropDownMain]}>
            {
              taskTypeData.map((item, key) => {
                return (
                  <TouchableOpacity style={[styles.doneBtnBottom]} onPress={() => { sendStatus(item.value) }} key={key}>
                    <Text style={styles.blueColor}>{item.name}</Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </View>
      </Modal>
    )
  }
}

export default MeetingStatusModal;