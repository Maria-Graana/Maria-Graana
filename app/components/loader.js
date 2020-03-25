import React from 'react'
import { Image, View, ActivityIndicator } from 'react-native'
import AppStyles from '../AppStyles'

class Loader extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { loading } = this.props
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {
          loading == true ?
            <ActivityIndicator size="large" color={AppStyles.colors.primaryColor} />
            // <Image source={require('../../assets/loader.gif')} style={{ width: 60, height: 60 }} />
            : <Image source={require('../../assets/images/no-result2.png')} style={{ width: 200, height: 200 }} />
        }
      </View>
    )
  }


}

export default Loader;