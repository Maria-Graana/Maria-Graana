/** @format */

import React from 'react'
import { Image, View, ActivityIndicator } from 'react-native'

class NoRecordFound extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Image
        source={require('../../../assets/img/no-result-found.png')}
        style={{
          width: '100%',
          height: 200,
          resizeMode: 'contain',
          marginTop: 100,
        }}
      />
    )
  }
}

export default NoRecordFound
