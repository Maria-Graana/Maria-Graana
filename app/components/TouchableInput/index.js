import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { isEmpty } from 'underscore';
import AppStyles from '../../AppStyles';
import ErrorMessage from '../ErrorMessage';

const TouchableInput = ({onPress, placeholder, value, showError, errorMessage}) => {
    return (
        <View>
        <TouchableOpacity onPress={onPress}>
        <View style={[AppStyles.mainInputWrap, AppStyles.inputPadLeft, AppStyles.formControl, styles.rowStyle]} >
          <Text style={[AppStyles.formFontSettings, { color: isEmpty(value) ? AppStyles.colors.subTextColor : AppStyles.colors.textColor }]} >
            {isEmpty(value) ? placeholder : value}
          </Text>
          <Ionicons style={styles.iconStyle} name="ios-arrow-down" size={26} color={AppStyles.colors.subTextColor} />
        </View>
      </TouchableOpacity>
      {
          showError &&  <ErrorMessage errorMessage={errorMessage}/>
      }
      </View>
    )
}

export default TouchableInput

const styles = StyleSheet.create({
    rowStyle:{
        alignItems: 'center', 
        justifyContent:'space-between', 
        flexDirection:'row'
    },
    iconStyle:{
        paddingRight: 15
    },
})
