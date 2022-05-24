/** @format */

import React from 'react'
import { Pressable, Text, View } from 'react-native'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import AppStyles from '../../AppStyles'
import styles from './style'

export default function DateFilterComponent({ dateFromTo, setDateFromTo, changeDateFromTo }) {
  return (
    <View style={styles.dateView}>
      <RNDateTimePicker
        display="inline"
        value={dateFromTo ? dateFromTo : new Date()}
        onChange={setDateFromTo}
      />
      <Pressable
        onPress={() => {
          changeDateFromTo('date')
        }}
        style={styles.dateButton}
      >
        <Text style={styles.dateElement}>Search</Text>
      </Pressable>
    </View>
  )
}
