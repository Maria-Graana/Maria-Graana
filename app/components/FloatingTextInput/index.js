import React from 'react'
import { View, Text } from 'react-native'
import { Form, Input, Label, Item, Content } from 'native-base'
import styles from './styles'

const FloatingTextInput = (props) => {
    return (
        <Item floatingLabel style={styles.itemWrap}>
            <Label  style={styles.labelStyle}>{props.children}</Label>
            <Input  />
        </Item>
    )
}

export default FloatingTextInput
