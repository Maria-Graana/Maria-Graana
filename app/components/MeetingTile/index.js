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
    const { data, openStatus, doneStatusId, doneStatus } = this.props
    let taskTypeData = []
    data.taskType !== 'meeting'? 
    taskTypeData = StaticData.meetingStatus
    : 
    taskTypeData = StaticData.callStatus

    return (
      <View style={[styles.mainTileView,doneStatus === true && doneStatusId == data.id && styles.tileIndex]}>
        <View style={[styles.contentView, AppStyles.flexDirectionRow]}>
          <View style={styles.border}>
            <Text style={[AppStyles.mrTen, styles.meetingCon]}>{data.taskType} @</Text>
            <Text style={[styles.fontBold]}>{data.time} </Text>
            <Text style={[styles.fontBold]}>{moment(data.date).format("MMM DD")}</Text>
          </View>
          <View style={[styles.dotsWrap]}>
            {
              data.status === 'completed' ?
                <Text style={[styles.doneText]}>{data.status}</Text>
                :
                <TouchableOpacity style={[styles.doneBtn]} onPress={() => { openStatus(data.id) }}>
                  {/* <Text style={styles.blueColor}>Mark As Done</Text> */}
                  <Image source={dots} style={styles.dotsImg} />
                </TouchableOpacity>
            }
            {
              doneStatus === true && doneStatusId == data.id &&
              <View style={[styles.dropDownMain]}>
                {
                  taskTypeData.map((item, key) => {
                    return (
                      <TouchableOpacity style={[styles.doneBtnBottom]} onPress={() => { openStatus(item.value) }} key={key}>
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
    )
  }
}

export default MeetingTile;