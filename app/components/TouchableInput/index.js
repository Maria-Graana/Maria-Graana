/** @format */

import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { isEmpty } from 'underscore'
import AppStyles from '../../AppStyles'
import ErrorMessage from '../ErrorMessage'

const TouchableInput = ({
  semiBold = false,
  width = null,
  onPress,
  placeholder,
  value,
  showError,
  errorMessage,
  arrowType = false,
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
              semiBold ? styles.semi : styles.iconStyle,

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
            showDropDownIcon ?
              <>
                {(semiBold && arrowType) ?

                  <Ionicons
                    style={styles.iconStyle}
                    name="chevron-up-outline"
                    size={26}
                    color={AppStyles.colors.subTextColor}
                  /> :
                  <Ionicons
                    style={styles.iconStyle}
                    name="chevron-down-outline"
                    size={26}
                    color={AppStyles.colors.subTextColor}
                  />}
              </>
              : (
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
  semi: {

    fontFamily: 'OpenSans_semi_bold'
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
