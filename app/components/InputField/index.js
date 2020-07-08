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

  changeFormatToComma = (value) => {
    let val = value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return val;
  }

  changeFormatToNormal = (value) => {
    let val = value.replace(/\D/g, "").replace(/\B(?=(\d{})+(?!\d))/g, ",")
    return val;
  }

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
      dateStatus,
    } = this.props
    
    // val = refreshInput === true ? val = '' : val = value
    var checkForStyling = dateStatus.status === true ? true : false
    return (
      <View style={[styles.mainInputParent, showStylingState === name && styles.paddingTopBottom]}>
        {/* label */}
        <Text style={[styles.labelStyle]}>{label}</Text>

        {/* Input Wrap */}
        <View style={[styles.mainInputWrap]}>

          {/* Main Input */}
          <View style={[styles.mainInputView, checkForStyling === true && styles.inputFullWidth]}>
            <TextInput
              style={[styles.inputTextStyle, showStylingState === name && styles.showInputBorder]}
              placeholder={placeholder}
              name={name}
              onChangeText={(val) => { onChange(val, name) }}
              onTouchStart={() => { showStyling(name, false) }}
              keyboardType={keyboardType}
              value={this.changeFormatToComma(value)}
            />
            {console.log(checkForStyling)}
            <Text style={[showStylingState === name ? styles.BottomFormat : styles.priceFormat]}>
              {formatPrice(this.changeFormatToNormal(priceFormatVal))}
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
            dateStatus && checkForStyling === true &&
            <View style={[styles.dateView]}>
              <Text style={styles.dateStyle}>{date}</Text>
            </View>
          }


        </View>
      </View>
    )
  }
}

export default InputField;