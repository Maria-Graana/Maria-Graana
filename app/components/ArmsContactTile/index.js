/** @format */

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Avatar from '../Avatar'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import AppStyles from '../../AppStyles'
import { Ionicons } from '@expo/vector-icons'

const ArmsContactTile = ({ data, onPress, showCallButton = false }) => {
  const getName = () => {
    const { firstName, lastName } = data
    if (firstName && lastName && firstName !== '' && lastName !== '') {
      return firstName + ' ' + lastName
    } else if (firstName && firstName !== '') {
      return firstName
    }
  }

  return (
    <TouchableOpacity
      style={{ backgroundColor: AppStyles.whiteColor }}
      activeOpacity={0.7}
      onPress={() => {
        onPress(data)
      }}
    >
      <View style={styles.listItem}>
        <View style={{ width: '85%', flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.imageViewStyle}>
            <Avatar data={data} />
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center', width: '85%' }}>
            <View>
              <Text style={[styles.textFont, { fontSize: 15 }]}>{getName()}</Text>
            </View>
            {data.phone !== '' && data.phone !== null ? (
              <View style={{ paddingTop: 5 }}>
                <Text
                  numberOfLines={1}
                  style={[styles.textFont, { fontSize: 12, color: AppStyles.colors.subTextColor }]}
                >
                  {data.phone}
                </Text>
              </View>
            ) : null}
          </View>
          <TouchableOpacity style={{ width: '15%' }} onPress={() => console.log('call')}>
            <Ionicons name="ios-call-outline" size={24} color={AppStyles.colors.primaryColor} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.underLine} />
    </TouchableOpacity>
  )
}

export default ArmsContactTile

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    marginVertical: 15,
    marginHorizontal: widthPercentageToDP('2%'),
    alignItems: 'center',
    width: '100%',
  },
  imageViewStyle: {
    paddingRight: 10,
  },
  textFont: {
    fontFamily: AppStyles.fonts.defaultFont,
  },
  underLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#f5f5f6',
  },
})
