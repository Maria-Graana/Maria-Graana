/** @format */

import { Text, View } from 'react-native'
import React from 'react'
import styles from './style'
import Item from '../../../native-base-theme/components/Item'
import Avatar from '../../components/Avatar'

class AssignAreas extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data, index } = this.props
    return (
      <View style={styles.mainTile}>
        <View style={styles.leftWrap}>
          <View style={styles.mainView}>
            <Text style={styles.textStyle}>{index + 1}</Text>
          </View>
        </View>
        <View style={styles.rightWrap}>
          {<Text style={styles.cityName}>{data.name}</Text>}
          <Text style={styles.areaName}>{data.city && data.city.name}</Text>
        </View>
      </View>
    )
  }
}

export default AssignAreas
