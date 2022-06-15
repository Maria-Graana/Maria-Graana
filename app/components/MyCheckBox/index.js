/** @format */

import { StyleSheet, Text, View } from 'react-native'
import Checkbox from 'expo-checkbox'
import React from 'react'
import AppStyles from '../../AppStyles'

const MyCheckBox = ({
  status,
  onPress,
  selectedColor = AppStyles.colors.primaryColor,
  unselectedColor = undefined,
  disabled,
}) => {
  return (
    <Checkbox
      value={status}
      disabled={disabled}
      onValueChange={onPress}
      color={status ? selectedColor : unselectedColor}
    />
  )
}

export default MyCheckBox
