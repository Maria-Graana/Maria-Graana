import React from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import { formatPrice } from '../PriceFormate'
import formTheme from '../../../native-base-theme/variables/formTheme';
import styles from './style'


class PricePicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        // tokenValue: ''
    }
  }

  onChange = (itemValue) => {
      this.setState({
        tokenValue: itemValue
      })
    this.props.onValueChange(itemValue)
  }

  render() {
    const {
        placeholder,
        selectedPrice
    } = this.props;
    const tokenValue= selectedPrice || ''
    const placeholderLabel = placeholder || 'Demand Price';
    return (
        <View style={[styles.textFieldProp]}>
          <View style={styles.mainInputwrap}>
            <View style={styles.mainInput}>
              <TextInput
                  placeholder={placeholderLabel}
                  name='Price'
                  keyboardType='number-pad'
                  style={styles.formControl}
                  onChangeText={(value) => { this.onChange(value) }}
              />
              <Text style={styles.countPrice}>{formatPrice(tokenValue)}</Text>
            </View>
          </View>
        </View>
    )}
}



export default PricePicker;