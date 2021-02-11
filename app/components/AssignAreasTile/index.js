/** @format */

import { Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from './style'

class AssignAreas extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data, index, onPress = null } = this.props
    return (
      <TouchableOpacity onPress={() => onPress(data)} style={styles.mainTile}>
        <View style={styles.leftWrap}>
          <View style={styles.mainView}>
            <Text style={styles.textStyle}>{index + 1}</Text>
          </View>
        </View>
        <View style={styles.rightWrap}>
          {<Text style={styles.cityName}>{data.name}</Text>}
          <Text style={styles.areaName}>{data.city && data.city.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

export default AssignAreas
