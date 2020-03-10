import React from 'react'
import { Image, View, ActivityIndicator } from 'react-native'

class Loader extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { loading } = this.props
    return (
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        {
          loading == true ?
          <ActivityIndicator size="large" color="#484848" />
          // <Image source={require('../../assets/loader.gif')} style={{ width: 60, height: 60 }} />
          : <Image source={require('../../assets/images/no-result2.png')} style={{ width: 200, height: 200 }} />
        }
      </View>
    )
  }


}

export default Loader;