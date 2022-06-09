/** @format */

import React from 'react'
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default class HeaderLeftLogo extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { leftBool, navigation } = this.props
    return (
      <View style={{}}>
        {leftBool ? (
          <View style={styles.viewWrap}>
            <TouchableOpacity
              onPress={() =>
                this.props?.leftClientScreen == 'Client'
                  ? navigation.navigate('Client', {
                      isUnitBooking: false,
                    })
                  : this.props?.leftScreen
                  ? navigation.navigate(this.props.leftScreen)
                  : navigation.goBack()
              }
            >
              <Ionicons name="md-arrow-back" size={26} style={styles.iconWrap} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageViewWrap}>
            <Image source={require('../../../assets/img/logo1.png')} style={styles.imageStyle} />
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  viewWrap: {
    paddingLeft: 15,
    width: 40,
  },
  iconWrap: {
    paddingLeft: 5,
  },
  imageViewWrap: {
    paddingLeft: 15,
    width: 10,
    flexDirection: 'row',
  },
  imageStyle: {
    resizeMode: 'contain',
    width: 100,
    height: 100,
  },
})
