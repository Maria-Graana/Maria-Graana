import React from 'react'
import { Image, Text, TouchableOpacity, View, TextInput, Button } from 'react-native'
import styles from './style'
import InputCheckImg from '../../../assets/img/inputCheck.png'
import inputTimesImg from '../../../assets/img/inputTimes.png'
import moment from 'moment'
import { formatPrice } from '../../PriceFormate'

class InputField extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showStyling: ''
    }
  }

  componentDidMount() { }



  render() {

    const {
      label,
      placeholder,
      name,
      onChange,
      date,
      priceFormatVal,
      keyboardType,
      showStyling,
      showStylingState,
      value,
      paymentDone,
      showDate,
    } = this.props
    let val = ''
    // val = refreshInput === true ? val = '' : val = value
    return (
      <View style={[styles.mainInputParent]}>
        {/* label */}
        <Text style={[styles.labelStyle]}>{label}</Text>

        {/* Input Wrap */}
        <View style={[styles.mainInputWrap]}>

          {/* Main Input */}
          <View style={[styles.mainInputView, showDate === true && styles.inputFullWidth]}>
            <TextInput
              style={[styles.inputTextStyle, showStylingState === name && styles.showInputBorder]}
              placeholder={placeholder}
              name={name}
              onChangeText={(val) => { onChange(val, name) }}
              onTouchStart={() => { showStyling(name, false) }}
              keyboardType={keyboardType}
              value={value}
            />
            <Text style={[styles.priceFormat]}>
              {formatPrice(priceFormatVal)}
            </Text>
          </View>

          {/* Check Button */}
          {
            showStylingState == name &&
              <TouchableOpacity style={[styles.inputCheckBtn]} onPress={() => { paymentDone(name) }}>
                <Image source={InputCheckImg} style={[styles.inputCheckImg]} />
              </TouchableOpacity>
          }


          {/* Times Button */}
          {
            showStylingState == name &&
            <View style={[styles.timesBtnParent]}>
              <TouchableOpacity style={[styles.timesBtn]} onPress={() => { showStyling(name, true) }}>
                <Image source={inputTimesImg} style={[styles.inputTimesImg]} />
              </TouchableOpacity>
            </View>
          }
          {
            showDate === true &&
            <View style={[styles.dateView]}>
              <Text style={styles.dateStyle}>{moment(date).format('MMM DD, hh:mm a')}</Text>
            </View>
          }


        </View>
      </View>
    )
  }
}

export default InputField;