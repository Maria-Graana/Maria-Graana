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
      editable,
      fromatName,
      onChangeHandle,
      noMargin,
    } = this.props
    const val = value != null || '' ? value.toString() : ''
    return (
      <View
        style={[styles.mainInputParent, noMargin === true && { marginBottom: 0, marginTop: 0 }]}
      >
        {/* label */}
        <Text style={[styles.labelStyle]}>{label}</Text>

        {/* Input Wrap */}
        <View style={[styles.mainInputWrap]}>
          {/* Main Input */}
          <View style={[styles.mainInputView]}>
            <TextInput
              style={[styles.inputTextStyle]}
              placeholder={placeholder}
              name={name}
              keyboardType={keyboardType}
              value={name === fromatName && fromatName != false ? this.currencyConvert(val) : val}
              onChangeText={(e) => {
                onChangeHandle(e, name)
              }}
              placeholderTextColor="#96999E"
              placeholderFontWeight="400"
              editable={editable}
            />
            <Text style={[styles.BottomFormat]}>
              {formatPrice(formatValue != null ? formatValue : '')}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

export default SimpleInputField
