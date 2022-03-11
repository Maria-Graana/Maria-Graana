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
  isFromDateFilter = false,
  iconMarginHorizontal = 6,
  isRow = false,
}) => {
  return (
    <View>
      <TouchableOpacity disabled={disabled} onPress={onPress}>
        <View
          style={[
            AppStyles.mainInputWrap,
            !isFromDateFilter && AppStyles.formControl,
            styles.rowStyle,
            isRow && styles.isRow,
            { backgroundColor: disabled ? '#ddd' : '#fff' },
          ]}
        >
          {isFromDateFilter && (
            <Image style={{ width: 26, height: 26, marginHorizontal: 10 }} source={iconSource} />
          )}
          <Text
            style={[
              AppStyles.formFontSettings,
              !isRow && isFromDateFilter === false && AppStyles.inputPadLeft,
              isRow && styles.rightPad,
              {
                color: isEmpty(value) ? AppStyles.colors.subTextColor : AppStyles.colors.textColor,
              },
            ]}
          >
            {isEmpty(value) ? placeholder : value}
          </Text>
          {showIconOrImage && !isFromDateFilter ? (
            showDropDownIcon ? (
              <Ionicons
                style={styles.iconStyle}
                name="chevron-down-outline"
                size={26}
                color={AppStyles.colors.subTextColor}
              />
            ) : (
              <Image
                style={{
                  width: isRow ? 20 : 26,
                  height: isRow ? 20 : 26,
                  marginHorizontal: iconMarginHorizontal,
                }}
                source={iconSource}
              />
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
    // paddingRight: 20,
  },
  isRow: {
    borderRadius: 4,
    padding: 15,
  },
  rightPad: {
    paddingRight: '8%',
    minWidth: '29%',
  },
})
