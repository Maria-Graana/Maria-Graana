import React from 'react'
import {
  Image,
} from 'react-native'
import moment from 'moment';
import DatePicker from 'react-native-datepicker'
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
    console.log(date);
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
    let iconSource = null;
    if (addMode === 'date') {
      iconSource = require('../../../assets/img/calendar.png');
    }
    else {
      iconSource = require('../../../assets/img/clock.png');
    }

    return (
      <DatePicker
        style={[AppStyles.formControl, { backgroundColor: `${disabled ? '#ddd' : '#fff'}`, width: '100%', justifyContent: 'center', paddingRight: 15 }]}
        mode={addMode}
        date={dateTime}
        format={addMode == 'time' ? 'hh:mm a' : 'YYYY-MM-DD'}
        placeholder={placeholderlabel}
        minDate={addMode == 'date' ? moment().format("YYYY-MM-DD") : ''}
        disabled={addMode == 'time' ? disabled : false}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        iconComponent={< Image style={{ width: 26, height: 26 }} source={iconSource} />}
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
          disabled: {
            backgroundColor: `${disabled ? '#ddd' : '#fff'}`,
          },
          dateText: {
            alignSelf: 'flex-start',
            fontFamily: AppStyles.fonts.defaultFont,
            padding: 12,
          },
          btnTextConfirm: {
            color: '#fff'
          },
          btnTextCancel: {
            color: '#333'
          },


        }}
        onDateChange={(date) => { this.onChange(date, addMode) }}
      />
    )
  }
}

export default DateComponent;