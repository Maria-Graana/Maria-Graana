/** @format */

import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import Modal from 'react-native-modal'
import { Calendar } from 'react-native-calendars'
import { Ionicons } from '@expo/vector-icons'
import _ from 'underscore'
import AppStyles from '../../AppStyles'
import styles from './styles'

const CalendarComponent = ({
  showCalendar,
  updateDay,
  diaryData,
  selectedDate,
  updateMonth,
  onPress,
}) => {
  return (
    <Modal isVisible={showCalendar} onBackdropPress={() => onPress()}>
      <View style={{ backgroundColor: AppStyles.colors.primaryColor, paddingBottom: 25 }}>
        <Calendar
          current={selectedDate}
          theme={styles.calendarTheme}
          onDayPress={(day) => updateDay(day)}
          // markedDates={selectedDate}
          onMonthChange={(month) => updateMonth(month)}
          hideExtraDays={true}
        />

        {/* <TouchableWithoutFeedback onPress={() => onPress()}>
          <View style={styles.buttonShadowView}>
            <Ionicons name="ios-arrow-up" size={20} color={AppStyles.colors.primaryColor} />
          </View>
        </TouchableWithoutFeedback> */}
      </View>
    </Modal>
  )
}

export default CalendarComponent
