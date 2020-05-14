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
    console.log('props',checkPaymentTypeValue)
    return (
      <Modal isVisible={active}>
        <View style={[styles.modalMain]}>
          <TouchableOpacity style={styles.timesBtn} onPress={() => { openModal() }}>
            <Image source={times} style={styles.timesImg} />
          </TouchableOpacity>
          <Text>
            Are you sure you want to delete this Payments?
          </Text>
          <View>
            <TouchableOpacity onPress={() => { deletePayments(checkPaymentTypeValue) }}>
              <Text>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { cancelDeletePayments(checkPaymentTypeValue) }}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
}

export default PaymentAlert;