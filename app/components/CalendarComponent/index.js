import React from 'react';
import { Calendar } from 'react-native-calendars'
import styles from './styles'

const CalendarComponent = (props) => {
    return (
        <Calendar
            theme={styles.calendarTheme}
            onDayPress={(day) => props.updateDay(day)}
            markedDates={{
                [props.startDate]: { selected: true, marked: true ,},
                '2020-03-16': { marked: true },
                '2020-03-17': { marked: true },
            }} />
    )
}

export default CalendarComponent
