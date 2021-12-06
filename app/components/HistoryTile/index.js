/** @format */

import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import dots from '../../../assets/img/dots.png'
import moment from 'moment'
import StaticData from '../../StaticData'
import helper from '../../helper'
import DiaryHelper from "../../screens/Diary/diaryHelper"

class MeetingTile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data, openStatus, editFunction, leadClosedCheck } = this.props
    let taskTypeData = []
    data.taskType === 'meeting'
      ? (taskTypeData = StaticData.meetingStatus)
      : (taskTypeData = StaticData.callStatus)
    const d = new Date(data.createdAt);
    const weekday = new Array(7);
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";
    let day = weekday[d.getDay()];

    let response = data && data.response != null && data.response.replace(/_+/g, ' ')

    return (
      <TouchableOpacity onPress={() => null}>
        <View style={[styles.mainTileView]}>
          <View style={[styles.contentView, AppStyles.flexDirectionRow]}>
            <View style={styles.border}>
              <Text style={[AppStyles.mrTen, styles.meetingCon]}>
                {data.taskType === 'called' && data.calledOn === 'whatsapp' ? 'Whatsapp' : ''}
                {data.taskType === 'called' && (data.calledOn === 'phone' || data.calledOn === null)
                  ? 'Called'
                  : ''}
                {data.taskType !== 'called' ? DiaryHelper.removeUnderscore(data.taskType) : ''}
                {data.calledNumber ? ` (${data.calledNumber})` : null}
              </Text>
              <View style={styles.DayAndTime}>
                <Text style={[styles.fontBold], { color: "grey" }}>
                  {` ${day} ${moment(data.date).format('MMM DD')},${helper.formatTime(data.start).replace("pm", "PM").replace("am" , "AM")}`}{' '}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={[styles.doneText, response != 'DNC' && styles.uperCase]}>
              {data.response !== null ? helper.showStatus(response) : 'Called'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default MeetingTile
