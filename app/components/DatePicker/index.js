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

console.disableYellowBox = true;


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
      is24Hour,
      date,
      disabled,
    } = this.props;


    const placeholderlabel = placeholder || 'Select Date';
    const addMode = mode || 'date';
    const addis24Hour = is24Hour || false;
    const dateTime = date || this.state.date;
    return (
      <DatePicker
        style={{ marginVertical: 10, marginHorizontal: 15, width: "89%", height: 60, borderRadius: 5 }}
        mode={addMode}
        date={dateTime}
        placeholder={placeholderlabel}
        minDate={mode == 'time' ? moment().format("HH:mm") : moment().format("YYYY-MM-DD")}
        disabled={mode == 'time' ? disabled : false}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        is24Hour={addis24Hour}
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          },
          btnTextConfirm: {
            color: '#484848'
          }
        }}
        onDateChange={(date) => { this.onChange(date, addMode) }}
      />
    )
  }
}

export default DateComponent;