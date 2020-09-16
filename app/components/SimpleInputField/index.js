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


  render() {
    const {
      label,
      name,
      placeholder,
      value,
      formatValue,
      keyboardType,
      editable,
    } = this.props
    return (
      <View style={[styles.mainInputParent]}>
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
              value={value}
              onChangeText={(val) => { onChange(val, name) }}
              placeholderTextColor="#96999E"
              placeholderFontWeight="400"
              editable={editable}
            />
            <Text style={[styles.BottomFormat]}>
              {formatPrice(formatValue)}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

export default SimpleInputField;