import React from 'react'
import { Text } from 'react-native'
import styles from './styles'

const ErrorMessage = (props) => {
    return (
            props.errorMessage ?
                <Text style={[styles.errorMessage]} >{props.errorMessage}</Text> :
                 null
    )
}

export default ErrorMessage
