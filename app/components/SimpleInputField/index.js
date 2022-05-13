/** @format */

import React from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
// import { TextInput } from 'react-native-paper'
import { onChange } from 'react-native-reanimated'
import { formatPrice } from '../../PriceFormate'
import AppStyles from '../../AppStyles'
import styles from './style'

class SimpleInputField extends React.Component {
  constructor(props) {
    super(props)
  }

  currencyConvert = (x) => {
    if (x < 0) {
      var newX = x
      newX = newX.toString().split('.')
      var lastThree = newX[0].substring(newX[0].length - 3)
      var otherNumbers = newX[0].substring(0, newX[0].length - 3)
      if (otherNumbers != '') lastThree = ',' + lastThree
      var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
      var afterDotVal = newX[1]
      if (afterDotVal) {
        return res + '.' + afterDotVal.substring(0, 2)
      } else {
        return '' + res
      }
    } else {
      x = x.toString().split('.')
      var lastThree = x[0].substring(x[0].length - 3)
      var otherNumbers = x[0].substring(0, x[0].length - 3)
      if (otherNumbers != '') lastThree = ',' + lastThree
      var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
      var afterDotVal = x[1]
      if (afterDotVal) {
        return res + '.' + afterDotVal.substring(0, 2)
      } else {
        return res
      }
    }
  }

  render() {
    const {
      label,
      name,
      placeholder,
      value,
      formatValue,
      keyboardType,
      editable = true,
      fromatName,
      onChangeHandle,
      noMargin,
      showLable = true,
      onPress = false,
      onClicked,
      maxLength = 50,
      paddingBottomValue
    } = this.props
    const val = value != null || '' ? value.toString() : ''
    return (
      <View
        style={[
          styles.mainInputParent,
          noMargin === true && { marginBottom: 0, marginTop: 0 },
          !showLable ? { marginTop: 0 } : null,
          { backgroundColor: '#fff' },
          paddingBottomValue ? {marginBottom : 0} : null
        ]}
      >
        {showLable ? <Text style={[styles.labelStyle]}>{label}</Text> : null}
        {/* label */}

        {/* Input Wrap */}
        <View style={[styles.mainInputWrap]}>
          {/* Main Input */}
          <View style={[styles.mainInputView]}>
            <TextInput
              style={[styles.inputTextStyle, !showLable ? { height: 30 } : null]}
              placeholder={placeholder}
              name={name}
              keyboardType={keyboardType}
              value={name === fromatName && fromatName != false ? this.currencyConvert(val) : val}
              onChangeText={(e) => {
                onChangeHandle(e, name)
              }}
              maxLength={maxLength}
              placeholderTextColor="#96999E"
              placeholderFontWeight="400"
              editable={editable}
              onFocus={() => {
                if (onPress) onClicked()
              }}
            />
            <Text style={[styles.BottomFormat]}>
              {formatPrice(
                formatValue != null && formatValue ? String(formatValue).replace(/,/g, '') : ''
              )}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

export default SimpleInputField
