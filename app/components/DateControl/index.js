/** @format */

import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import moment from 'moment'

const DateControl = ({
  selectedDate,
  setSelectedDate,
  today,
  tomorrow,
  setCalendarVisible,
  loading,
}) => {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => {
          setSelectedDate(moment(selectedDate).subtract(1, 'days').format('YYYY-MM-DD'))
        }}
        disabled={loading}
      >
        <Ionicons name="md-chevron-back" size={24} color="black" style={styles.icon} />
      </TouchableOpacity>

      <Text
        onPress={() => {
          setSelectedDate(today)
        }}
        style={selectedDate === today ? styles.dateSelected : styles.dateUnselected}
      >
        {'Today'}
      </Text>
      <Text
        onPress={() => {
          setSelectedDate(moment(today).add(1, 'days').format('YYYY-MM-DD'))
        }}
        style={selectedDate === tomorrow ? styles.dateSelected : styles.dateUnselected}
      >
        {'Tomorrow'}
      </Text>
      <Text
        onPress={() => {
          setSelectedDate(moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD'))
          setCalendarVisible(true)
        }}
        style={
          selectedDate !== today && selectedDate !== tomorrow
            ? styles.dateSelected
            : styles.dateUnselected
        }
      >
        {moment(selectedDate).format('DD MMM')}
      </Text>
      <TouchableOpacity
        onPress={() => {
          setSelectedDate(moment(selectedDate).add(1, 'days').format('YYYY-MM-DD'))
        }}
        disabled={loading}
      >
        <Ionicons name="md-chevron-forward" size={24} style={styles.icon} />
      </TouchableOpacity>
    </View>
  )
}

export default DateControl

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 5,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
  },
  dateSelected: {
    backgroundColor: '#d9f1ff',
    borderWidth: 0.5,
    borderColor: AppStyles.colors.textColor,
    padding: 5,
    color: AppStyles.colors.textColor,
    minWidth: wp('15%'),
    textAlign: 'center',
    fontFamily: AppStyles.fonts.defaultFont,
  },
  dateUnselected: {
    borderWidth: 0.5,
    borderColor: AppStyles.colors.textColor,
    padding: 5,
    color: AppStyles.colors.textColor,
    minWidth: wp('15%'),
    textAlign: 'center',
    fontFamily: AppStyles.fonts.defaultFont,
    backgroundColor: 'white',
  },
  icon: {
    marginHorizontal: 5,
  },
})
