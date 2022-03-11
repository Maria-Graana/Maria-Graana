/** @format */

import React, { useState } from 'react'
import { Image, Platform, View } from 'react-native'
import moment from 'moment'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
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
  disabled = false,
  isFromDateFilter = false,
}) => {
  const [visible, setVisible] = useState(false)
  const handleOnConfirm = (date) => {
    setVisible(false)
    handleForm(date, name)
  }
  return (
    <View>
      <DateTimePickerModal
        date={date}
        isVisible={visible}
        // minimumDate={mode == 'date' ? new Date() : null}
        headerTextIOS={mode === 'date' ? 'Pick date' : 'Pick Time'}
        mode={mode}
        onConfirm={(date) => handleOnConfirm(date)}
        onCancel={() => setVisible(false)}
      />
      <TouchableInput
        disabled={disabled}
        isRow={true}
        placeholder={placeholderLabel}
        onPress={() => setVisible(true)}
        value={selectedValue}
        showError={showError}
        errorMessage={errorMessage}
        showDropDownIcon={false}
        iconSource={iconSource}
        isFromDateFilter={isFromDateFilter}
      />
    </View>
  )
}

export default DateTimePicker
