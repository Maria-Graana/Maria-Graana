/** @format */

import React from 'react'
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import DateTimePicker from '../../components/DatePicker'
import helper from '../../helper'
import { Ionicons } from '@expo/vector-icons'
import AppStyles from '../../AppStyles'
import moment from 'moment'

const DateSearchFilter = ({ applyFilter, clearFilter }) => {
  const [fromDate, setFromDate] = useState(null)
  //const [toDate, setToDate] = useState(null)

  const onSearchPressed = (value) => {
    if (value === null) {
      alert('Date is required for search!')
      return
    } else {
      value = moment(value).format('YYYY-MM-DD')
      applyFilter(value, value) // using from date as to date in this case
      // let fromDateFromString = new Date(fromDate).setHours(0, 0, 0, 0)
      // let toDateFromString = new Date(toDate).setHours(0, 0, 0, 0)
      // if (toDateFromString < fromDateFromString) {
      //   alert('To Date must be greater than from date!')
      //   return
      // } else {
      //   applyFilter(fromDate, toDate)
      // }
    }
  }

  return (
    <View style={styles.container}>
      <DateTimePicker
        placeholderLabel={'Modified Date'}
        name={'fromDate'}
        mode={'date'}
        iconSource={require('../../../assets/img/calendar.png')}
        date={fromDate ? new Date(fromDate) : new Date()}
        selectedValue={fromDate ? helper.formatDate(fromDate) : ''}
        handleForm={(value, name) => {
          setFromDate(value)
          onSearchPressed(value)
        }}
        isFromDateFilter={true}
      />
      {/* <DateTimePicker
        placeholderLabel={'To Date'}
        name={'toDate'}
        mode={'date'}
        iconSource={require('../../../assets/img/calendar.png')}
        date={toDate ? new Date(toDate) : new Date()}
        selectedValue={toDate ? helper.formatDate(toDate) : ''}
        handleForm={(value, name) => setToDate(value)}
      /> */}
      <Ionicons
        name={'ios-close-circle-outline'}
        size={24}
        color={'grey'}
        style={styles.search}
        onPress={() => {
          setFromDate(null)
          clearFilter()
        }}
      />
    </View>
  )
}

export default DateSearchFilter

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderRadius: 32,
    borderColor: '#ebebeb',
    margin: 10,
    borderWidth: 1,
    paddingHorizontal: 5,
  },
  search: {
    marginHorizontal: 5,
    position: 'absolute',
    right: 10,
  },
})
