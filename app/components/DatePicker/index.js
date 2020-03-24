import React from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import moment from 'moment';
import DatePicker from 'react-native-datepicker'
import { Ionicons } from '@expo/vector-icons'
import AppStyles from '../../AppStyles';

console.disableYellowBox = true;

const _format = 'YYYY-MM-DD';
const _today = moment(new Date().dateString).format(_format);


class DateComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: '',
    }
  }

  onChange = (date, mode) => {
    if (mode == 'time') {
      this.props.onTimeChange(date)
    } else {
      this.props.onDateChange(date)
    }
    this.setState({
      date: date
    })
  }

  render() {
    const {
      mode,
      placeholder,
      date,
      disabled,
    } = this.props;


    const placeholderlabel = placeholder || 'Select Date';
    const addMode = mode || 'date';
    const dateTime = date || this.state.date;
    return (
      <DatePicker
        style={[AppStyles.formControl, { backgroundColor: `${disabled ? '#ddd' : '#fff'}`, width: '100%', justifyContent: 'center', paddingRight: 15 }]}
        mode={addMode}
        date={dateTime}
        placeholder={placeholderlabel}
        minDate={mode == 'time' ? moment().format("HH:mm") : moment().format("YYYY-MM-DD")}
        disabled={mode == 'time' ? disabled : false}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        iconComponent={<Ionicons style={styles.arrowIcon} name={addMode === 'date' ? 'md-calendar' : 'md-time'} size={26} color={AppStyles.colors.primaryColor} />}
        is24Hour={false}
        customStyles={{
           datePickerCon: { backgroundColor: AppStyles.colors.primaryColor, },
          placeholderText: {
            alignSelf: 'flex-start',
            fontFamily: AppStyles.fonts.defaultFont,
            padding: 12,
          },
          dateInput: {
            borderWidth: 0
          },
          disabled:{
            backgroundColor:`${disabled ? '#ddd' : '#fff'}`,
          },
          dateText: {
            alignSelf: 'flex-start',
            fontFamily: AppStyles.fonts.defaultFont,
            padding: 12,
          },
          btnTextConfirm: {
            color: '#fff'
          },
          btnTextCancel:{
            color:'#333'
          },
          
          
        }}
        onDateChange={(date) => { this.onChange(date, addMode) }}
      />
    )
  }
}

export default DateComponent;