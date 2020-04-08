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
      this.props.onDateChange(date)
    this.setState({
      date: date
    })
  }

  render() {
    const {
      mode,
      placeholder,
      date,
    } = this.props;


    const placeholderlabel = placeholder || 'Select Date';
    const addMode = mode || 'date';
    const dateTime = date || this.state.date;
    let iconSource = null;
    if (addMode === 'date') {
      iconSource = require('../../../assets/img/calendar.png');
    }

    return (
      <DatePicker
        style={[{
          borderRadius: 4,
          borderWidth: 0,
          height: 50, backgroundColor: '#fff', width: '100%', justifyContent: 'center', paddingRight: 15
        }]}
        mode={addMode}
        date={dateTime}
        format={'YYYY-MM-DD'}
        placeholder={placeholderlabel}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        iconComponent={< Image style={{ width: 26, height: 26 }} source={iconSource} />}
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