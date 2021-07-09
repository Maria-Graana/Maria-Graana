/** @format */

import React from 'react'
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import DateTimePicker from '../../components/DatePicker'
import helper from '../../helper'
import { Ionicons } from '@expo/vector-icons'
import AppStyles from '../../AppStyles'

const DateSearchFilter = ({ applyFilter }) => {
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  const onSearchPressed = () => {
    if (fromDate === null || toDate === null) {
      alert('Both dates are required for search!')
      return
    } else {
      let fromDateFromString = new Date(fromDate).setHours(0, 0, 0, 0)
      let toDateFromString = new Date(toDate).setHours(0, 0, 0, 0)
      if (toDateFromString < fromDateFromString) {
        alert('To Date must be greater than from date!')
        return
      } else {
        applyFilter(fromDate, toDate)
      }
    }
  }

  return (
    <View style={styles.container}>
      <DateTimePicker
        placeholderLabel={'From Date'}
        name={'fromDate'}
        mode={'date'}
        iconSource={require('../../../assets/img/calendar.png')}
        date={fromDate ? new Date(fromDate) : new Date()}
        selectedValue={fromDate ? helper.formatDate(fromDate) : ''}
        handleForm={(value, name) => setFromDate(value)}
      />
      <DateTimePicker
        placeholderLabel={'To Date'}
        name={'toDate'}
        mode={'date'}
        iconSource={require('../../../assets/img/calendar.png')}
        date={toDate ? new Date(toDate) : new Date()}
        selectedValue={toDate ? helper.formatDate(toDate) : ''}
        handleForm={(value, name) => setToDate(value)}
      />
      <Ionicons
        name={'ios-search'}
        size={24}
        color={AppStyles.colors.primaryColor}
        style={styles.search}
        onPress={() => onSearchPressed()}
      />
    </View>
  )
}

export default DateSearchFilter

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '73%',
  },
  search: {
    marginHorizontal: 5,
  },
})
