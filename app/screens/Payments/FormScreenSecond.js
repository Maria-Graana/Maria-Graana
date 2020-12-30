import React, { Component } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import styles from './style'
import PickerComponent from '../../components/Picker/index';
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux';
import moment from 'moment'
import SimpleInputText from '../../components/SimpleInputField'
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatPrice } from '../../PriceFormate';
import ErrorMessage from '../../components/ErrorMessage'
import PaymentTile from '../../components/PaymentTile'
import { ScrollView } from 'react-native-gesture-handler';


class FormScreenSecond extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    const {
      data,
      currencyConvert,
      addPaymentModalToggle,
      editTile,
      remainingPayment,
      paymentPreviewLoading,
      checkLeadClosedOrNot,
      onlyReadFormData,
      toggleBookingDetailsModal,
      tileForToken,
      onPaymentLongPress,
    } = this.props
    return (
      <SafeAreaView style={styles.removePad}>
        <KeyboardAvoidingView>
          <View style={[styles.firstContainer]}>
            {/* Top Booked Text */}
            <TouchableOpacity style={[styles.addPaymentBtn, styles.noMargTop]} onPress={() => { toggleBookingDetailsModal(true) }}>
              <Image style={styles.addPaymentBtnImg} source={require('../../../assets/img/checkWhite.png')}></Image>
              <Text style={styles.addPaymentBtnText}>BOOKING DETAILS</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.paymentsHeading}>
            PAYMENTS
          </Text>

          <View style={styles.mainPaymentWrap}>

            <View style={styles.paymentTileMain}>
              {/* <View style={[styles.tileWrap, styles.scrollHeight, data.payment != null && data.payment.length < 3 ? styles.scrollHeightAuto : null]}> */}
              <View style={[styles.tileWrap, styles.scrollHeight]}>
                <ScrollView>

                  {
                    paymentPreviewLoading === true ?
                      <Text style={{ padding: 10, }}>Loading...</Text>
                      :
                      data && data.payment && data.payment.length > 0 ?
                        data.payment.map((item, index) => {
                          return (
                            <PaymentTile onPaymentLongPress={() => onPaymentLongPress(item)} tileForToken={false} currencyConvert={currencyConvert} key={index} count={index} data={item} editTile={editTile} checkLeadClosedOrNot={checkLeadClosedOrNot} />
                          )
                        })
                        : <Text style={{ padding: 0, fontWeight: 'bold', textAlign: 'center' }}></Text>
                  }
                </ScrollView>
              </View>
            </View>

            {
              checkLeadClosedOrNot === true &&
              <TouchableOpacity style={styles.addPaymentBtn} onPress={() => { addPaymentModalToggle(true, 'paymentModal') }}>
                <Image style={styles.addPaymentBtnImg} source={require('../../../assets/img/roundPlus.png')}></Image>
                <Text style={styles.addPaymentBtnText}>ADD PAYMENT</Text>
              </TouchableOpacity>
            }

            {
              checkLeadClosedOrNot === true &&
              <TouchableOpacity style={styles.addPaymentBtn} onPress={() => { addPaymentModalToggle(true, 'taxModal') }}>
                <Image style={styles.addPaymentBtnImg} source={require('../../../assets/img/roundPlus.png')}></Image>
                <Text style={styles.addPaymentBtnText}>ADD TAX</Text>
              </TouchableOpacity>
            }

          </View>

          <View style={styles.firstContainer}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{width: '49%', marginRight: 7}}>
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
              <View  style={{width: '49%'}}>
                <SimpleInputText
                  name={'outstandingTax'}
                  fromatName={'outstandingTax'}
                  placeholder={'Outstanding Tax'}
                  label={'OUTSTANDING TAX'}
                  value={data.outstandingTax}
                  formatValue={data.outstandingTax}
                  editable={false}
                  keyboardType={'numeric'}
                />
              </View>
            </View>


          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}


mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead
  }
}

export default connect(mapStateToProps)(FormScreenSecond)


