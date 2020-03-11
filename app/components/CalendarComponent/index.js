import React from 'react';
import { Calendar } from 'react-native-calendars'

const CalendarComponent = (props) => {
    return (
            <Calendar
                theme={{
                    calendarBackground: '#444',
                    selectedDayTextColor: 'black',
                    selectedDayBackgroundColor: '#ffffff',
                    monthTextColor: 'white',
                    arrowColor: 'white',
                    dayTextColor: '#ffffff',
                    todayTextColor: '#00c44a',
                    textSectionTitleColor: '#ffffff'
                }}
                onDayPress={(day) => props.updateDay(day)}
                markedDates={{
                    [props.startDate]: { selected: true, }
                }} />
    )
}

export default CalendarComponent
