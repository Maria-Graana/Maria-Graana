import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './style';
import AppStyles from '../../AppStyles';
import dots from '../../../assets/img/dots.png';
import moment from 'moment';
import StaticData from '../../StaticData'

class MeetingTile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data, openStatus, doneStatusId, doneStatus, sendStatus, editFunction } = this.props
    let taskTypeData = []
    data.taskType === 'meeting' ?
      taskTypeData = StaticData.meetingStatus
      :
      taskTypeData = StaticData.callStatus
      let zindex = doneStatus === true && doneStatusId == data.id && styles.tileIndex
    return (
      <TouchableOpacity style={[zindex]} onPress={() => {data.taskType === 'meeting' && editFunction(data.id)}}>
        <View style={[styles.mainTileView, doneStatus === true && doneStatusId == data.id && styles.tileIndex]}>
          <View style={[styles.contentView, AppStyles.flexDirectionRow]}>
            <View style={styles.border}>
              <Text style={[AppStyles.mrTen, styles.meetingCon]}>{data.taskType} @</Text>
              <Text style={[styles.fontBold]}>{data.time} </Text>
              <Text style={[styles.fontBold]}>{moment(data.date).format("MMM DD")}</Text>
            </View>
            <View style={[styles.dotsWrap]}>
              {
                data.taskType === 'called' && data.status != 'pending' &&
                <Text style={[styles.doneText]}>{data.status}</Text>
              }

              {
                data.taskType === 'meeting' &&
                <Text style={[styles.doneText]}>{data.status}</Text>
              }
              <TouchableOpacity style={[styles.doneBtn]} onPress={() => { openStatus(data.id) }}>
                <Image source={dots} style={styles.dotsImg} />
              </TouchableOpacity>
              {
                doneStatus === true && doneStatusId == data.id &&
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
              }
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default MeetingTile;