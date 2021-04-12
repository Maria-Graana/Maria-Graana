/** @format */

import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AppStyles from '../../AppStyles'
import PickerComponent from '../Picker'

const OfficeLocationSelector = ({
  officeLocations,
  officeLocationId,
  handleOfficeLocationChange,
  disabled,
}) => {
  return (
    <View style={AppStyles.mainInputWrap}>
      <Text style={styles.locationHeading}>Payment Location</Text>
      {
        <View style={[AppStyles.inputWrap]}>
          <PickerComponent
            onValueChange={handleOfficeLocationChange}
            data={officeLocations}
            selectedItem={officeLocationId}
            name={'officeLocation'}
            placeholder="Payment Location"
            enabled={!disabled}
          />
        </View>
      }
    </View>
  )
}

export default OfficeLocationSelector

const styles = StyleSheet.create({
  locationHeading: {
    fontSize: 14,
    fontFamily: AppStyles.fonts.boldFont,
    paddingBottom: 5,
  },
  editText: {
    color: AppStyles.colors.primaryColor,
    fontSize: AppStyles.fontSize.medium,
    fontFamily: AppStyles.fonts.semiBoldFont,
  },
})
