import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons'
import AppStyles from '../../AppStyles';
import styles from './styles';

const CalendarComponent = (props) => {
    return (
        <View style={{ backgroundColor: AppStyles.colors.primaryColor, paddingBottom: 25, zIndex: 20, }}>
            <Calendar
                theme={styles.calendarTheme}
                onDayPress={(day) => props.updateDay(day)}
               // markingType='custom'
                markedDates={{
                    [props.startDate]: {
                        selected: true, marked: true
                    },
                }} />

            <TouchableWithoutFeedback onPress={props.onPress} >
                <View style={styles.buttonShadowView}>
                    <Ionicons name="ios-arrow-up" size={20} color={AppStyles.colors.primaryColor} />
                </View>
            </TouchableWithoutFeedback>


        </View>
    )
}

export default CalendarComponent
