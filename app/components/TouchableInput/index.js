import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { isEmpty } from 'underscore';
import AppStyles from '../../AppStyles';
import ErrorMessage from '../ErrorMessage';

const TouchableInput = ({ onPress, placeholder, value, showError, errorMessage, showDropDownIcon = true, iconSource = '', disabled=false }) => {
  return (
    <View>
      <TouchableOpacity disabled={disabled} onPress={onPress}>
        <View style={[AppStyles.mainInputWrap, AppStyles.inputPadLeft, AppStyles.formControl, styles.rowStyle,{backgroundColor: disabled ? '#ddd' : '#fff'}]} >
          <Text style={[AppStyles.formFontSettings, { color: isEmpty(value) ? AppStyles.colors.subTextColor : AppStyles.colors.textColor }]} >
            {isEmpty(value) ? placeholder : value}
          </Text>
          {
            showDropDownIcon ? <Ionicons style={styles.iconStyle} name="ios-arrow-down" size={26} color={AppStyles.colors.subTextColor} />
              :
              < Image style={{ width: 26, height: 26, marginRight:12 }} source={iconSource} />
          }

        </View>
      </TouchableOpacity>
      {
        showError && <ErrorMessage errorMessage={errorMessage} />
      }
    </View>
  )
}

export default TouchableInput

const styles = StyleSheet.create({
  rowStyle: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  iconStyle: {
    paddingRight: 15
  },

})
