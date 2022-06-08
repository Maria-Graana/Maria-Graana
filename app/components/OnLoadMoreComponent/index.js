/** @format */

import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import styles from './styles'

const OnLoadMoreComponent = (props) => {
  return props.onEndReached ? (
    <View
      style={[
        // props.styles,
        styles.rowStyle,
      ]}
    >
      <ActivityIndicator size="small" color={AppStyles.colors.primaryColor} />
    </View>
  ) : null
}

export default OnLoadMoreComponent
