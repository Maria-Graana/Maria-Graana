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

  showStatus = (status) => {
    if (status === 'not interested out of city')
      return 'out of city';
    else if (status === 'not interested low budget')
      return 'low budget';
    else if (status === 'not interested re only')
      return 'interested in RE only';
    else if (status === 'no response busy')
      return 'busy'
    else if (status === 'no response no signals')
      return 'no signals';
    else return status;

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
      <TouchableOpacity onPress={() => { data.taskType === 'meeting' && leadClosedCheck && editFunction(data.id) }}>
        <View style={[styles.mainTileView,]}>
          <View style={[styles.contentView, AppStyles.flexDirectionRow]}>
            <View style={styles.border}>
              <Text style={[AppStyles.mrTen, styles.meetingCon]}>{data.taskType} @</Text>
              <Text style={[styles.fontBold]}>{helper.formatTime(data.start)} </Text>
              <Text style={[styles.fontBold]}>{moment(data.date).format("MMM DD")}</Text>
            </View>
            <View style={[styles.dotsWrap]}>
              {
                data.taskType === 'called' && data.response != 'pending' &&
                <View>
                  <Text style={[styles.doneText, response != 'DNC' && styles.uperCase]}>{data.response !== null ? this.showStatus(response) : 'Called'}</Text>
                </View>
              }

              {
                data.taskType === 'meeting' &&
                <View>
                  <Text style={[styles.doneText, styles.uperCase]}>{data.response != null ? response : 'Meeting Planned'}</Text>
                </View>
              }
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