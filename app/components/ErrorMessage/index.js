import React from 'react'
import { Text } from 'react-native'
import styles from './styles'

const ErrorMessage = ({errorMessage, containerStyle = null}) => {
    return (
        errorMessage?
            <Text style={[styles.errorMessage, containerStyle]} >{errorMessage}</Text> :
            null
    )
}

export default ErrorMessage
