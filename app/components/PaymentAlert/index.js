import React from 'react'
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import { Button, } from 'native-base';
import styles from './style'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal';
import DateComponent from '../../components/DatePicker'
import times from '../../../assets/img/times.png'
import ErrorMessage from '../../components/ErrorMessage'

class PaymentAlert extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { openModal, active, deletePayments, cancelDeletePayments, checkPaymentTypeValue } = this.props
    return (
      <Modal isVisible={active}>
        <View style={[styles.modalMain]}>
          <Text>
            Changing payment plan will remove previously added
            {checkPaymentTypeValue === 'installments' ? ' payments' : ' installments'}.
            Are you sure you want to continue?
          </Text>
          <View style={styles.mainViewBtn}>
            <TouchableOpacity style={styles.mainBtnAction} onPress={() => { deletePayments(checkPaymentTypeValue) }}>
              <Text style={styles.whiteColor}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mainBtnAction} onPress={() => { cancelDeletePayments(checkPaymentTypeValue) }}>
              <Text style={styles.whiteColor}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
}

export default PaymentAlert;