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

  currencyConvert = (x) => {
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '')
      lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
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
      editable,
      editPriceFormat,
      typeArray,
      arrayName,
    } = this.props
    var val = editPriceFormat && editPriceFormat != false && editPriceFormat.name == name && editPriceFormat.status == true ? this.currencyConvert(value) : value
    var checkForStyling = dateStatus && dateStatus != false && dateStatus.status === true ? true : false
    return (
      <View style={[styles.mainInputParent, showStylingState === name && styles.paddingTopBottom]}>
        {/* label */}
        <Text style={[styles.labelStyle]}>{label}</Text>

        {/* Input Wrap */}
        <View style={[styles.mainInputWrap]}>

          {/* Main Input */}
          <View style={[styles.mainInputView, checkForStyling === true && showDate === false && styles.inputFullWidth]}>
            <TextInput
              style={[styles.inputTextStyle, showStylingState === name && styles.showInputBorder]}
              placeholder={placeholder}
              name={name}
              keyboardType={keyboardType}
              value={val}
              onChangeText={(val) => { onChange(val, name, arrayName) }}
              onTouchStart={() => { editable != false && showStyling(name, false, arrayName) }}
              placeholderTextColor="#96999E"
              placeholderFontWeight="400"
              editable={editable}
            />
            <Text style={[showStylingState === name ? styles.BottomFormat : styles.priceFormat]}>
              {formatPrice(priceFormatVal != false ? priceFormatVal : '')}
            </Text>
          </View>

          {/* Check Button */}
          {
            showStylingState === name &&
            <TouchableOpacity style={[styles.inputCheckBtn]} onPress={() => { typeArray != true ? paymentDone(name) : paymentDone(arrayName, name) }}>
              <Image source={InputCheckImg} style={[styles.inputCheckImg]} />
            </TouchableOpacity>
          }


          {/* Times Button */}
          {
            showStylingState === name &&
            <View style={[styles.timesBtnParent]}>
              <TouchableOpacity style={[styles.timesBtn]} onPress={() => { showStyling(name, true, arrayName) }}>
                <Image source={inputTimesImg} style={[styles.inputTimesImg]} />
              </TouchableOpacity>
            </View>
          }
          {
            checkForStyling === true &&
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