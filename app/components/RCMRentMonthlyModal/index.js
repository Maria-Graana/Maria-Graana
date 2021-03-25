/** @format */

import backArrow from '../../../assets/img/backArrow.png'
import React from 'react'
import { Modal, SafeAreaView, Image, Text, View, TouchableOpacity } from 'react-native'
import AppStyles from '../../AppStyles'
import PickerComponent from '../Picker'
import SimpleInputText from '../SimpleInputField'
import styles from './style'

const RCMRentMonthlyModal = (props) => {
  checkReadOnlyMode = () => {
    const { leadAgentType, isLeadClosed } = props
    if (leadAgentType === 'seller') return false
    else {
      if (isLeadClosed) return false
      else return true
    }
  }

  checkMonthlyRentReadOnlyMode = () => {
    const { lead, leadAgentType } = props
    if (leadAgentType === 'seller') return false
    else return true
  }

  const { isVisible, closeModal, handleForm, formData, pickerData, updateRentLead } = props
  let readOnlyMode = checkReadOnlyMode()
  let monthlyRentReadOnly = checkMonthlyRentReadOnlyMode()

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={closeModal}>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
      <View style={styles.headerView}>
        <TouchableOpacity onPress={closeModal}>
          <Image source={backArrow} style={[styles.backImg]} />
        </TouchableOpacity>
        <View style={styles.headerStyle}>
          <Text style={styles.headerText}>RENT DETAILS</Text>
        </View>
      </View>
      <SafeAreaView style={[AppStyles.mb1, { backgroundColor: '#e7ecf0' }]}>
        <View
          style={[
            AppStyles.mb1,
            { padding: 15, backgroundColor: '#e7ecf0', justifyContent: 'space-between' },
          ]}
        >
          <View>
            <SimpleInputText
              name={'monthlyRent'}
              fromatName={false}
              placeholder={'Enter Monthly Rent'}
              label={'MONTHLY RENT'}
              value={formData.monthlyRent}
              formatValue={formData.monthlyRent}
              keyboardType={'numeric'}
              onChangeHandle={handleForm}
              editable={monthlyRentReadOnly}
            />
            <View style={{ paddingVertical: 10 }}>
              <PickerComponent
                onValueChange={handleForm}
                name={'contract_months'}
                data={pickerData}
                selectedItem={formData.contract_months}
                enabled={readOnlyMode}
                placeholder="Contract duration (No of months)"
              />
            </View>
            <View style={{ paddingVertical: 10 }}>
              <PickerComponent
                onValueChange={handleForm}
                name={'advance'}
                data={pickerData}
                selectedItem={formData.advance}
                enabled={readOnlyMode}
                placeholder="Advance (No of months)"
              />
            </View>
            <View style={{ paddingVertical: 10 }}>
              <PickerComponent
                onValueChange={handleForm}
                name={'security'}
                data={pickerData}
                selectedItem={formData.security}
                enabled={readOnlyMode}
                placeholder="Security (No of months)"
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (!readOnlyMode) closeModal()
              else updateRentLead()
            }}
            style={styles.okBtn}
          >
            <Text style={styles.okBtnText}>OK</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default RCMRentMonthlyModal
