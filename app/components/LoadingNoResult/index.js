/** @format */

import React from 'react'
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'

import styles from './style'
import AppStyles from '../../AppStyles'
import noData from '../../../assets/img/no-result-found.png'

class LoadingNoResult extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { loading } = this.props
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: '70%' }}>
        {loading === true ? (
          <ActivityIndicator size={'large'} color={AppStyles.colors.primaryColor} />
        ) : (
          <Image source={noData} style={styles.noResultImg} />
        )}
      </View>
    )
  }
}

export default LoadingNoResult
