/** @format */

import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Loader from '../loader'
import AppStyles from '../../AppStyles'
import { Ionicons } from '@expo/vector-icons'

const TouchableButton = ({
  label = '',
  loading = false,
  onPress,
  containerStyle,
  containerBackgroundColor = AppStyles.colors.primaryColor,
  textColor = 'white',
  fontSize = 18,
  disabled = false,
  fontFamily = AppStyles.fonts.semiBoldFont,
  showIcon = false,
  iconName = '',
  loaderColor = 'white',
  borderColor = null,
  borderWidth = null,
}) => {
  return (
    <TouchableOpacity
      disabled={loading || disabled}
      activeOpacity={0.7}
      style={[
        containerStyle,
        { backgroundColor: containerBackgroundColor, borderColor, borderWidth },
      ]}
      onPress={onPress}
    >
      {loading == true ? (
        <Loader loading={loading} color={loaderColor} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text
            style={{
              color: textColor,
              fontSize: fontSize,
              fontFamily: fontFamily,
              textAlign: 'center',
            }}
          >
            {label}
          </Text>
          {showIcon && (
            <Ionicons
              name={iconName}
              size={32}
              color={AppStyles.colors.primaryColor}
              style={{ marginHorizontal: 10 }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  )
}
export default TouchableButton
