/** @format */

import React from 'react'
import { Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux'
import RoundPlus from '../../../assets/img/roundPlus.png'
import AppStyles from '../../AppStyles'
import CMBTN from '../../components/CMBTN'
import PaymentTile from '../../components/PaymentTile'
import SimpleInputText from '../../components/SimpleInputField'
import styles from './style'

class CMSecondForm extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {
      addPaymentModalToggle,
      onPaymentLongPress,
      currencyConvert,
      editTile,
      checkLeadClosedOrNot,
      paymentPreviewLoading = false,
      lead,
      remainingPayment,
      outStandingTax,
      toggleSchedulePayment,
      call,
      updatePermission,
    } = this.props
    const { payment, projectProduct } = lead
    return (
      <SafeAreaView style={styles.removePad}>
        <View style={styles.mainFormWrap}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              marginHorizontal: 10,
              justifyContent: 'space-between',
            }}
          >
            <CMBTN
              extraStyle={[styles.bookExtraStyle]}
              extraTextStyle={[
                styles.bookExtraTextStyle,
                { fontSize: 12, fontFamily: AppStyles.fonts.boldFont },
              ]}
              onClick={() => {
                this.props.toggleBookingDetailsModal(true)
              }}
              btnText={'BOOKING DETAIL'}
              checkLeadClosedOrNot={checkLeadClosedOrNot}
            />
            <CMBTN
              extraStyle={styles.scheduleExtraStyle}
              extraTextStyle={styles.scheduleExtraTextStyle}
              onClick={() => {
                toggleSchedulePayment()
              }}
              btnText={'SCHEDULE OF PAYMENTS'}
              checkLeadClosedOrNot={checkLeadClosedOrNot}
            />
          </View>
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
                          call={call}
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
              onClick={() => {
                if (updatePermission) addPaymentModalToggle(true, 'payment')
              }}
              btnImage={RoundPlus}
              btnText={'ADD PAYMENT'}
              checkLeadClosedOrNot={checkLeadClosedOrNot}
            />
            <CMBTN
              onClick={() => {
                if (updatePermission) addPaymentModalToggle(true, 'tax')
              }}
              btnImage={RoundPlus}
              btnText={'ADD TAX'}
              checkLeadClosedOrNot={checkLeadClosedOrNot}
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
