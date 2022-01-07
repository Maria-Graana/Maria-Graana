/** @format */

import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import Modal from 'react-native-modal'
import TouchableButton from '../TouchableButton'
import helper from '../../helper'
import AppStyles from '../../AppStyles'

const ReconnectModal = ({ isReconnectModalVisible, setIsReconnectModalVisible, taskType }) => {
  return (
    <Modal isVisible={isReconnectModalVisible}>
      <View style={styles.modalMain}>
        <View style={styles.row}>
          <Text style={styles.title}>What would you like to do next ?</Text>
        </View>
        <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            containerStyle={[AppStyles.formBtn]}
            label={'Connect Again'}
            onPress={() => setIsReconnectModalVisible(false, 'connect_again')}
          />
        </View>

        {taskType !== 'meeting' && taskType !== 'viewing' ? (
          <View style={[AppStyles.mainInputWrap]}>
            <TouchableButton
              containerStyle={[AppStyles.formBtn]}
              label={'Set Follow up'}
              onPress={() => setIsReconnectModalVisible(false, 'set_follow_up')}
            />
          </View>
        ) : null}

        {taskType === 'meeting' ? (
          <View style={[AppStyles.mainInputWrap]}>
            <TouchableButton
              containerStyle={[AppStyles.formBtn]}
              label={'Cancel Meeting'}
              onPress={() => setIsReconnectModalVisible(false, 'cancel_meeting')}
            />
          </View>
        ) : null}

        {taskType === 'viewing' ? (
          <View style={[AppStyles.mainInputWrap]}>
            <TouchableButton
              containerStyle={[AppStyles.formBtn]}
              label={'Cancel Viewing'}
              onPress={() => setIsReconnectModalVisible(false, 'cancel_viewing')}
            />
          </View>
        ) : null}

        {taskType === 'viewing' || taskType === 'meeting' ? (
          <View style={[AppStyles.mainInputWrap]}>
            <TouchableButton
              containerStyle={[AppStyles.formBtn]}
              label={'Do Nothing'}
              onPress={() => setIsReconnectModalVisible(false, 'no_action_required')}
            />
          </View>
        ) : null}
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
  row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  title: {
    width: '90%',
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: AppStyles.fontSize.large,
  },
})
