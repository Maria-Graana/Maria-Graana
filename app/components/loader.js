/** @format */

import React from 'react'
import { Image, View, ActivityIndicator } from 'react-native'
import AppStyles from '../AppStyles'
import LottieView from 'lottie-react-native'

class Loader extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { loading, color, size } = this.props
    let loaderColor = color || AppStyles.colors.primaryColor
    let sizeLabel = size || 'large'
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {loading == true ? (
          // <ActivityIndicator size={sizeLabel} color={loaderColor} />
          <LottieView
            autoPlay
            loop
            source={require('../../assets/json/lf30_editor_angaivhu.json')}
            style={{ height: 100, width: 100 }}
          />
        ) : (
          // <Image source={require('../../assets/loader.gif')} style={{ width: 60, height: 60 }} />
          <Image
            source={require('../../assets/img/no-result-found.png')}
            style={{ width: 200, height: 200 }}
          />
        )}
      </View>
    )
  }
}

export default Loader
