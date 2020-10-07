import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './style';
import AppStyles from '../../AppStyles';
import dots from '../../../assets/img/dots.png';
import moment from 'moment';
import StaticData from '../../StaticData'
import helper from '../../helper'

class MeetingTile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data, openStatus, editFunction, leadClosedCheck } = this.props
    let taskTypeData = []
    data.taskType === 'meeting' ?
      taskTypeData = StaticData.meetingStatus
      :
      taskTypeData = StaticData.callStatus

    let response = data && data.response != null && data.response.replace(/_+/g, " ");

    return (
      <TouchableOpacity onPress={() => { }}>
        <View style={[styles.mainTileView,]}>
          <View style={[styles.contentView, AppStyles.flexDirectionRow]}>
            <View style={styles.border}>
              <Text style={[AppStyles.mrTen, styles.meetingCon]}>{data.taskType} @</Text>
              <Text style={[styles.fontBold]}>{helper.formatTime(data.start)} </Text>
              <Text style={[styles.fontBold]}>{moment(data.date).format("MMM DD")}</Text>
            </View>
            <View style={[styles.dotsWrap]}>
              <View>
                <Text style={[styles.doneText, response != 'DNC' && styles.uperCase]}>{data.response !== null ? response : 'Called'}</Text>
              </View>
              {
                leadClosedCheck &&
                <View>
                  <TouchableOpacity style={[styles.doneBtn]} onPress={() => { openStatus(data) }}>
                    <Image source={dots} style={styles.dotsImg} />
                  </TouchableOpacity>
                </View>
              }
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default MeetingTile;