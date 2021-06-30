/** @format */

import React from 'react'
import { Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import AppStyles from '../../AppStyles'
import BackButton from '../../components/BackButton'
import ErrorMessage from '../ErrorMessage'
import SimpleInputText from '../SimpleInputField'
import styles from './style'

const RCMBuyerModal = (props) => {
  checkReadOnlyMode = () => {
    const { leadAgentType, isLeadClosed } = props
    if (leadAgentType === 'seller') return false
    else {
      if (isLeadClosed) return false
      else return true
    }
  }

  const {
    isVisible,
    closeModal,
    handleForm,
    formData,
    updateRentLead,
    agreedNotZero,
    advanceNotZero,
    isLeadClosed,
  } = props
  let readOnlyMode = this.checkReadOnlyMode()

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={closeModal}>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
      <View style={styles.headerView}>
        <BackButton onClick={closeModal} />
        <View style={styles.headerStyle}>
          <Text style={styles.headerText}>BUY DETAILS</Text>
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
              name={'agreedAmount'}
              placeholder={'Enter Agreed Amount'}
              label={'AGREED AMOUNT'}
              value={formData.agreedAmount}
              formatValue={formData.agreedAmount}
              keyboardType={'numeric'}
              onChangeHandle={handleForm}
              editable={readOnlyMode}
              fromatName={'agreedAmount'}
            />
            {agreedNotZero ? <ErrorMessage errorMessage={'Amount must be greater than 0'} /> : null}
            <SimpleInputText
              name={'advance'}
              placeholder={'Enter Down Payment'}
              label={'DOWN PAYMENT'}
              value={formData.advance}
              formatValue={formData.advance}
              keyboardType={'numeric'}
              onChangeHandle={handleForm}
              editable={readOnlyMode}
              fromatName={'advance'}
            />
            {advanceNotZero ? (
              <ErrorMessage errorMessage={'Amount must be greater than 0'} />
            ) : null}
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

export default RCMBuyerModal
