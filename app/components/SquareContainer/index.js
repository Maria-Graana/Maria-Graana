/** @format */

import React from 'react'
import { Image, Text, View } from 'react-native'
import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'
import { LinearGradient } from 'expo-linear-gradient'
import { formatPrice } from '../../PriceFormate'

let start = { x: 0, y: 1 }
let end = { x: 1, y: 0 }
let locations = [0.2, 1.0]
let colors = ['#0036b1', '#0f73ee']

class SqaureContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { imagePath, containerStyle, label, total } = this.props
    return (
      <LinearGradient
        start={start}
        end={end}
        colors={colors}
        locations={locations}
        style={[styles.squareContainer, containerStyle]}
      >
        <View>
          <Image source={imagePath} style={styles.containerImg} />
        </View>
        <View style={styles.headView}>
          <Text style={styles.totalText}>
            {total && total !== '' && total !== 0 ? parseInt(formatPrice(total)) : 0}
          </Text>
          <Text style={styles.headingText}>{label}</Text>
        </View>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  headView: {
    marginTop: 20,
  },
  totalText: {
    color: '#ffffff',
    fontSize: 25,
    fontFamily: AppStyles.fonts.semiBoldFont,
  },
  containerImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  squareContainer: {
    flex: 1,
    height: 160,
    borderRadius: 20,
    padding: 15,
  },
  headingText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: AppStyles.fonts.defaultFont,
  },
})

export default SqaureContainer
