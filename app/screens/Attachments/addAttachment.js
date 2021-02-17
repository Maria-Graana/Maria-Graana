/** @format */

import React from 'react'
import { View, Text } from 'react-native'
import { Button } from 'native-base'
import AppStyles from '../../AppStyles'

const AddAttachment = (props) => {
  return (
    <View style={[AppStyles.mainInputWrap, { marginLeft: 15, marginRight: 15 }]}>
      <Button style={[AppStyles.formBtn, { marginTop: 10 }]} onPress={props.onPress}>
        <Text style={AppStyles.btnText}>ADD ATTACHMENT</Text>
      </Button>
    </View>
  )
}

export default AddAttachment
