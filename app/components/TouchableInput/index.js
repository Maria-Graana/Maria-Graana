/** @format */

import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { isEmpty } from 'underscore'
import AppStyles from '../../AppStyles'
import ErrorMessage from '../ErrorMessage'

const TouchableInput = ({
  width = null,
  onPress,
  placeholder,
  value,
  showError,
  errorMessage,
  showDropDownIcon = true,
  iconSource = '',
  showIconOrImage = true,
  disabled = false,
}) => {
  return (
    <View>
      <TouchableOpacity disabled={disabled} onPress={onPress}>
        <View
          style={[
            AppStyles.mainInputWrap,
            AppStyles.inputPadLeft,
            AppStyles.formControl,
            styles.rowStyle,
            { backgroundColor: disabled ? '#ddd' : '#fff' },
          ]}
        >
          <Text
            style={[
              AppStyles.formFontSettings,
              {
                color: isEmpty(value) ? AppStyles.colors.subTextColor : AppStyles.colors.textColor,
              },
            ]}
          >
            {isEmpty(value) ? placeholder : value}
          </Text>
          {showIconOrImage ? (
            showDropDownIcon ? (
              <Ionicons
                style={styles.iconStyle}
                name="chevron-down-outline"
                size={26}
                color={AppStyles.colors.subTextColor}
              />
            ) : (
              <Image style={{ width: 26, height: 26, marginHorizontal: 6 }} source={iconSource} />
            )
          ) : null}
        </View>
      </TouchableOpacity>
      {showError && <ErrorMessage errorMessage={errorMessage} />}
    </View>
  )
}

export default TouchableInput

const styles = StyleSheet.create({
  rowStyle: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  iconStyle: {
    paddingRight: 15,
  },
})
