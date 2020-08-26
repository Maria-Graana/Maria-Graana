import React, { useState } from 'react'
import {
  Image,
  Platform,
  View
} from 'react-native'
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import TouchableInput from '../TouchableInput'

const DateTimePicker = ({
  placeholderLabel,
  date,
  selectedValue,
  name,
  handleForm,
  mode,
  showError,
  errorMessage,
  iconSource,
  disabled, }) => {
  const [visible, setVisible] = useState(false);
  
  const handleOnConfirm = (date) => {
    setVisible(false);
    handleForm(date, name);
  }
  return (
    <View>
      <DateTimePickerModal
        date={date}
        isVisible={visible}
        // minimumDate={mode == 'date' ? new Date() : null}
        mode={mode}
        onConfirm={(date) => handleOnConfirm(date)}
        onCancel={() => setVisible(false)}
      />
      <TouchableInput
        disabled={mode == 'time' ? disabled : false}
        placeholder={placeholderLabel}
        onPress={() => setVisible(true)}
        value={selectedValue}
        showError={showError}
        errorMessage={errorMessage}
        showDropDownIcon={false}
        iconSource={iconSource}
      />
    </View>
  )
}

export default DateTimePicker


// class DateComponent extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       date: '',
//     }
//   }

//   render() {
//     const {
//       mode,
//       placeholder,
//       date,
//       disabled,
//     } = this.props;


//     const placeholderlabel = placeholder || 'Select Date';
//     const addMode = mode || 'date';
//     const dateTime = date || this.state.date;
//     let iconSource = null;
//     if (addMode === 'date') {
//       iconSource = require('../../../assets/img/calendar.png');
//     }
//     else {
//       iconSource = require('../../../assets/img/clock.png');
//     }

//     return (
//       <View>

//       </View>
//       // <DatePicker
//       //   style={[{
//       //     borderRadius: 4,
//       //     borderWidth: 0,
//       //     height: 50, backgroundColor: `${disabled ? '#ddd' : '#fff'}`, width: '100%', justifyContent: 'center', paddingRight: 15
//       //   }]}
//       //   mode={addMode}
//       //   date={dateTime}
//       //   format={addMode == 'time' ? 'hh:mm a' : 'YYYY-MM-DD'}
//       //   placeholder={placeholderlabel}
//       //   minDate={addMode == 'date' ? moment().format("YYYY-MM-DD") : ''}
//       //   disabled={addMode == 'time' ? disabled : false}
//       //   confirmBtnText="Confirm"
//       //   cancelBtnText="Cancel"
//       //   iconComponent={< Image style={{ width: 26, height: 26 }} source={iconSource} />}
//       //   is24Hour={false}
//       //   customStyles={{
//       //     datePickerCon: { backgroundColor: '#fff',  },
//       //     placeholderText: {
//       //       alignSelf: 'flex-start',
//       //       fontFamily: AppStyles.fonts.defaultFont,
//       //       padding: Platform.OS === 'android' ? 10 : 15,
//       //     },
//       //     datePicker:{
//       //       backgroundColor: '#fff',
//       //     },
//       //     dateInput: {
//       //       borderWidth: 0
//       //     },
//       //     disabled: {
//       //       backgroundColor: `${disabled ? '#ddd' : '#fff'}`,
//       //     },
//       //     dateText: {
//       //       alignSelf: 'flex-start',
//       //       fontFamily: AppStyles.fonts.defaultFont,
//       //       padding: Platform.OS === 'android' ? 10 : 15,
//       //     },
//       //     btnTextConfirm: {
//       //       color: '#000'
//       //     },
//       //     btnTextCancel: {
//       //       color: '#000'
//       //     },


//       //   }}
//       //   onDateChange={(date) => { this.onChange(date, addMode) }}
//       // />
//     )
//   }
// }

//export default DateComponent;