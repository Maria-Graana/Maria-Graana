import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import dots from '../../../assets/img/dots.png'
class MeetingTile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data } = this.props
    return (
      <View style={[styles.mainTileView]}>
        <View style={[styles.contentView, AppStyles.flexDirectionRow]}>
          <Text style={[AppStyles.mrTen, styles.meetingCon]}>Meeting @</Text>
          <Text style={[styles.fontBold]}>{data.time} </Text>
          <Text style={[styles.fontBold]}>{data.date}</Text>
          <View style={[styles.dotsWrap]}>
            {
              data.status != '' ?
                <Text style={[styles.doneText]}>{data.status}</Text>
                :
                <Image source={dots} style={[styles.dotsImg]} />
            }
          </View>
        </View>
      </View>
    )
  }
}

export default MeetingTile;