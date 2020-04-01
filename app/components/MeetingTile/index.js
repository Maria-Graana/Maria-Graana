import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import dots from '../../../assets/img/dots.png'
import moment from 'moment'

class MeetingTile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data, openStatus, doneStatusId, doneStatus } = this.props
    return (
      <View style={[styles.mainTileView]}>
        <View style={[styles.contentView, AppStyles.flexDirectionRow]}>
          <Text style={[AppStyles.mrTen, styles.meetingCon]}>Meeting @</Text>
          <Text style={[styles.fontBold]}>{data.time} </Text>
          <Text style={[styles.fontBold]}>{moment(data.date).format("MMM DD")}</Text>
          <View style={[styles.dotsWrap]}>
            {
              data.status === 'done' ?
                <Text style={[styles.doneText]}>{data.status}</Text>
                :
                <TouchableOpacity onPress={() => { openStatus(data.id) }}>
                  <Image source={dots} style={[styles.dotsImg]} />
                </TouchableOpacity>
            }
            {
              doneStatus === true && doneStatusId == data.id &&
              <View style={[styles.dropDownMain]}>
                <TouchableOpacity style={[styles.doneBtn]} onPress={() => { openStatus(data.id) }}>
                  <Text style={styles.blueColor}>Done</Text>
                </TouchableOpacity>
              </View>
            }
          </View>
        </View>
      </View>
    )
  }
}

export default MeetingTile;