/** @format */

import React from 'react'
import { Text } from 'react-native'
import styles from './styles'

const ErrorMessage = ({ errorMessage, containerStyle = null, color = '#B00020' }) => {
  return errorMessage ? (
    <Text style={[styles.errorMessage, containerStyle, { color: color }]}>{errorMessage}</Text>
  ) : null
}

export default ErrorMessage
