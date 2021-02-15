/** @format */

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native'
import styles from './style'
import PickerComponent from '../../components/Picker/index'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux'
import moment from 'moment'
import SimpleInputText from '../../components/SimpleInputField'
import { SafeAreaView } from 'react-native-safe-area-context'
import { formatPrice } from '../../PriceFormate'
import ErrorMessage from '../../components/ErrorMessage'
import PaymentTile from '../../components/PaymentTile'
import { ScrollView } from 'react-native-gesture-handler'
import CMBTN from '../../components/CMBTN'
import CheckWhite from '../../../assets/img/checkWhite.png'
import RoundPlus from '../../../assets/img/roundPlus.png'

class CMSecondForm extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { addPaymentModalToggle, toggleBookingDetailsModal } = this.props
    return (
      <View style={styles.mainFormWrap}>
        <CMBTN
          onClick={toggleBookingDetailsModal(true)}
          btnImage={CheckWhite}
          btnText={'BOOKING DETAILS'}
        />
        <View style={{ padding: 5 }} />
        <Text style={styles.paymentsHeading}>PAYMENTS</Text>
        <View style={{ padding: 10 }} />
        <View style={{ backgroundColor: '#fff' }}>
          <CMBTN
            onClick={() => addPaymentModalToggle(true, 'payment')}
            btnImage={RoundPlus}
            btnText={'ADD PAYMENT'}
          />
          <CMBTN
            onClick={() => addPaymentModalToggle(true, 'tax')}
            btnImage={RoundPlus}
            btnText={'ADD TAX'}
          />
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '49%', marginRight: 7 }}>
            <SimpleInputText
              name={'remainingPayment'}
              fromatName={'remainingPayment'}
              placeholder={'Remaining Payment'}
              label={'REMAINING PAYMENT'}
              value={0}
              formatValue={0}
              editable={false}
              keyboardType={'numeric'}
            />
          </View>
          <View style={{ width: '49%' }}>
            <SimpleInputText
              name={'outstandingTax'}
              fromatName={'outstandingTax'}
              placeholder={'Outstanding Tax'}
              label={'OUTSTANDING TAX'}
              value={0}
              formatValue={0}
              editable={false}
              keyboardType={'numeric'}
            />
          </View>
        </View>
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(CMSecondForm)
