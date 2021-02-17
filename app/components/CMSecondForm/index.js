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
import PaymentMethods from '../../PaymentMethods'

class CMSecondForm extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {
      addPaymentModalToggle,
      toggleBookingDetailsModal,
      onPaymentLongPress,
      currencyConvert,
      editTile,
      checkLeadClosedOrNot,
      paymentPreviewLoading = false,
      data,
      lead,
      remainingPayment,
      outStandingTax,
    } = this.props
    const { payment, unit } = lead

    return (
      <SafeAreaView style={styles.removePad}>
        <View style={styles.mainFormWrap}>
          <CMBTN
            extraStyle={{ marginHorizontal: 10 }}
            onClick={() => {
              this.props.toggleBookingDetailsModal(true)
            }}
            btnImage={CheckWhite}
            btnText={'BOOKING DETAILS'}
          />
          <View style={{ padding: 5 }} />
          <Text style={styles.paymentsHeading}>PAYMENTS</Text>
          <View style={styles.mainPaymentWrap}>
            <View style={styles.paymentTileMain}>
              <View style={[styles.scrollHeight]}>
                <ScrollView>
                  {paymentPreviewLoading === true ? (
                    <Text style={{ padding: 10 }}>Loading...</Text>
                  ) : payment && payment.length > 0 ? (
                    payment.map((item, index) => {
                      return (
                        <PaymentTile
                          onPaymentLongPress={() => onPaymentLongPress(item)}
                          tileForToken={false}
                          currencyConvert={currencyConvert}
                          key={index}
                          count={index}
                          data={item}
                          editTile={editTile}
                          checkLeadClosedOrNot={checkLeadClosedOrNot}
                        />
                      )
                    })
                  ) : (
                    <Text style={{ padding: 0, fontWeight: 'bold', textAlign: 'center' }}></Text>
                  )}
                </ScrollView>
              </View>
            </View>
          </View>

          <View style={{ backgroundColor: '#fff', marginHorizontal: 10 }}>
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
                value={remainingPayment}
                formatValue={remainingPayment}
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
                value={outStandingTax}
                formatValue={outStandingTax}
                editable={false}
                keyboardType={'numeric'}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(CMSecondForm)
