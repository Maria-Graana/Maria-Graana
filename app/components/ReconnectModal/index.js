/** @format */

import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import Modal from 'react-native-modal'
import TouchableButton from '../TouchableButton'
import helper from '../../helper'
import AppStyles from '../../AppStyles'

const ReconnectModal = ({ isReconnectModalVisible, setIsReconnectModalVisible }) => {
  return (
    <Modal isVisible={isReconnectModalVisible}>
      <View style={styles.modalMain}>
        <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            containerStyle={[AppStyles.formBtn]}
            label={'CONNECT AGAIN'}
            onPress={() => setIsReconnectModalVisible(false, 'connect_again')}
          />
        </View>

        <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            containerStyle={[AppStyles.formBtn]}
            label={'SET FOLLOW UP'}
            onPress={() => setIsReconnectModalVisible(false, 'set_follow_up')}
          />
        </View>
      </View>
    </Modal>
  )
}

export default ReconnectModal

const styles = StyleSheet.create({
  modalMain: {
    backgroundColor: '#e7ecf0',
    borderRadius: 7,
    overflow: 'hidden',
    zIndex: 5,
    position: 'relative',
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#333333',
    shadowOpacity: 1,
    padding: 15,
  },
})
