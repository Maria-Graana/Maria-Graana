/** @format */

import React, { useState } from 'react'
import { useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import AppStyles from '../../AppStyles'
import ErrorMessage from '../ErrorMessage'
import TouchableButton from '../TouchableButton'
import { CheckBox } from 'native-base'

const RWRModal = ({ isVisible, selectedReason = '', showHideModal, rejectLead, message = '' }) => {
  // const [validate, checkValidation] = useState(false)
  const [isBlacklist, setIsBlacklist] = useState(false)
  const rejectLeadAndClear = () => {
    rejectLead(selectedReason, isBlacklist)
    // setReason(null)
    setIsBlacklist(false)
  }
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalMain}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: AppStyles.fonts.semiBoldFont,
            color: AppStyles.colors.textColor,
          }}
        >
          {message == ''
            ? 'Do you really want to reject this lead? This process cannot be undone.'
            : message}
        </Text>
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              // onChangeText={(text) => {
              //   setReason(text)
              // }}
              editable={false}
              placeholderTextColor={'#a8a8aa'}
              value={selectedReason}
              style={[AppStyles.formControl, AppStyles.inputPadLeft]}
              placeholder={'Reason'}
            />
            {selectedReason === '' && <ErrorMessage errorMessage={'Required*'} />}
          </View>
          <TouchableOpacity onPress={() => setIsBlacklist(!isRated)} style={styles.checkBoxRow}>
            <CheckBox
              color={AppStyles.colors.primaryColor}
              checked={isBlacklist ? true : false}
              style={styles.checkBox}
              onPress={() => setIsBlacklist(!isBlacklist)}
            />
            <Text style={styles.checkBoxText}>Blacklist</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableButton
              containerStyle={[styles.buttonStyle, { marginRight: 10 }]}
              label={'NO'}
              loading={false}
              fontSize={16}
              fontFamily={AppStyles.fonts.boldFont}
              onPress={() => {
                showHideModal(false)
                // setReason(null)
                setIsBlacklist(false)
              }}
            />
            <TouchableButton
              containerStyle={[styles.buttonStyle]}
              label={'YES'}
              loading={false}
              fontSize={16}
              fontFamily={AppStyles.fonts.boldFont}
              onPress={() =>
                selectedReason !== '' && selectedReason !== null
                  ? rejectLeadAndClear(selectedReason)
                  : alert('Please enter a reason to reject the lead')
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default RWRModal

const styles = StyleSheet.create({
  modalMain: {
    backgroundColor: '#e7ecf0',
    borderRadius: 7,
    overflow: 'hidden',
    zIndex: 5,
    position: 'relative',
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  buttonStyle: {
    borderColor: '#006ff1',
    backgroundColor: '#006ff1',
    width: '30%',
    borderRadius: 4,
    borderWidth: 1,
    color: '#006ff1',
    textAlign: 'center',
    borderRadius: 4,
    marginBottom: 0,
    justifyContent: 'center',
    minHeight: 55,
  },

  checkBoxRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  checkBoxText: {
    marginHorizontal: 15,
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 14,
  },
  checkBox: {
    width: 22,
    height: 22,
    alignItems: 'center',
  },
})
