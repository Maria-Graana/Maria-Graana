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

  showStyling = (val) => {
    this.setState({
      showStyling: val
    })
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
    } = this.props
    const { showStyling } = this.state
    console.log(showStyling)
    return (
      <View style={[styles.mainInputParent]}>
        {/* label */}
        <Text style={[styles.labelStyle]}>{label}</Text>

        {/* Input Wrap */}
        <View style={[styles.mainInputWrap]}>

          {/* Main Input */}
          <View style={[styles.mainInputView]}>
            <TextInput
              style={[styles.inputTextStyle, showStyling === name && styles.showInputBorder]}
              placeholder={placeholder}
              name={name}
              onChangeText={(val) => { onChange(val, name) }}
              onTouchStart={() => { this.showStyling(name) }}
              keyboardType={keyboardType}
            />
            <Text style={[styles.priceFormat]}>
              {formatPrice(priceFormatVal)}
            </Text>
          </View>

          {/* Check Button */}
          {
            showStyling == name ?
              <TouchableOpacity style={[styles.inputCheckBtn]}>
                <Image source={InputCheckImg} style={[styles.inputCheckImg]} />
              </TouchableOpacity>
              : <Text></Text>
          }


          {/* Times Button */}
          {
            showStyling == name &&
            <View style={[styles.timesBtnParent]}>
              <TouchableOpacity style={[styles.timesBtn]} onPress={() => { this.showStyling('') }}>
                <Image source={inputTimesImg} style={[styles.inputTimesImg]} />
              </TouchableOpacity>
            </View>
          }

          {/* <View style={[styles.dateView]}>
            <Text style={styles.dateStyle}>{moment(date).format('MMM DD, hh:mm a')}</Text>
          </View> */}

        </View>
      </View>
    )
  }
}

export default InputField;