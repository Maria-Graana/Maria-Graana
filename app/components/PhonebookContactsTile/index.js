/** @format */

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Avatar from '../Avatar'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import AppStyles from '../../AppStyles'

const PhoneBookContactsTile = ({ data, onPress }) => {
  return (
    <TouchableOpacity style={styles.mainView} activeOpacity={0.7} onPress={() => onPress(data)}>
      <View style={styles.listItem}>
        <View style={styles.imageViewStyle}>
          <Avatar data={data} />
        </View>
        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
          <View>
            <Text style={[styles.textFont, { fontSize: 15 }]}>{data?.name}</Text>
          </View>
        </View>
      </View>
      <View style={styles.underLine} />
    </TouchableOpacity>
  )
}

export default PhoneBookContactsTile

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#fff',
  },
  listItem: {
    flexDirection: 'row',
    marginVertical: 15,
    marginHorizontal: widthPercentageToDP('2%'),
    alignItems: 'center',
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
