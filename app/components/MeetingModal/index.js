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
            Are you sure you want to delete this {checkPaymentTypeValue === 'installments' ? 'payments' : 'installments'}?
          </Text>
          <View style={styles.mainViewBtn}>
            <TouchableOpacity style={styles.mainBtnAction} onPress={() => { deletePayments(checkPaymentTypeValue) }}>
              <Text style={styles.whiteColor}>Delete</Text>
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