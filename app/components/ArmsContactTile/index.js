/** @format */

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Avatar from '../Avatar'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import AppStyles from '../../AppStyles'
import { Ionicons } from '@expo/vector-icons'
import _ from 'underscore'
import DiaryHelper from '../../screens/Diary/diaryHelper'
import moment from 'moment'

const ArmsContactTile = ({ data, onPress, showCallButton = false }) => {
  const getName = () => {
    const { firstName, lastName } = data
    if (firstName && lastName && firstName !== '' && lastName !== '') {
      return firstName + ' ' + lastName
    } else if (firstName && firstName !== '') {
      return firstName
    }
  }

  let sortedArray = _.sortBy(data ? data.armsContactCalls : [], 'time')
  let armsCallLatest = sortedArray && sortedArray.length > 0 ? _.last(sortedArray) : null

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
          <View style={{ flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
              <Text style={[styles.textFont, { fontSize: 14, width: ' 50%' }]}>{getName()}</Text>
              {armsCallLatest ? (
                <Text
                  style={{
                    width: '45%',
                    fontSize: 13,
                    marginHorizontal: 2,
                    color:
                      armsCallLatest.feedback === 'needs_further_contact'
                        ? AppStyles.colors.primaryColor
                        : AppStyles.colors.redBg,
                    textAlign: 'center',
                  }}
                >
                  ({DiaryHelper.removeUnderscore(armsCallLatest.feedback)})
                </Text>
              ) : null}
            </View>
            {data.phone !== '' && data.phone !== null ? (
              <View style={{ paddingTop: 5 }}>
                <Text
                  numberOfLines={1}
                  style={[styles.textFont, { fontSize: 12, color: AppStyles.colors.subTextColor }]}
                >
                  {data.phone}{' '}
                  {armsCallLatest ? moment(armsCallLatest.time).format('DD MMM hh:mm a') : null}{' '}
                  {armsCallLatest ? 'Outgoing' : null}
                </Text>
              </View>
            ) : null}
          </View>
          {/* {showCallButton ? (
            <TouchableOpacity style={{ width: '15%' }} onPress={() => console.log('call')}>
              <Ionicons name="ios-call-outline" size={24} color={AppStyles.colors.primaryColor} />
            </TouchableOpacity>
          ) : null} */}
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
