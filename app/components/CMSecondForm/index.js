/** @format */

import React from 'react'
import { Text, View, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux'
import RoundPlus from '../../../assets/img/roundPlus.png'
import AppStyles from '../../AppStyles'
import CMBTN from '../../components/CMBTN'
import PaymentTile from '../../components/PaymentTile'
import SimpleInputText from '../../components/SimpleInputField'
import styles from './style'
import PendingTokenImg from '../../../assets/img/booking_pending.png'
import { heightPercentageToDP } from 'react-native-responsive-screen'

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
      <View style={[styles.removePad, { flex: 1 }]}>
        <View style={[styles.mainFormWrap, { flex: 1 }]}>
          <View
            style={{
              flexDirection: 'row',
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

          {payment && payment.length > 0 ? (
            <>
              <Text style={styles.paymentsHeading}>PAYMENTS</Text>
              <View style={[styles.mainPaymentWrap, { flex: 1 }]}>
                <View style={[styles.paymentTileMain, { flex: 1 }]}>
                  <View style={[styles.scrollHeight]}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                      {paymentPreviewLoading === true ? (
                        <Text style={{ padding: 10 }}>Loading...</Text>
                      ) : payment && payment.length > 0 ? (
                        payment.map((item, index) => {
                          return item && item.installmentAmount ? (
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
                          ) : null
                        })
                      ) : null}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View
              style={{
                alignItems: 'center',
                padding: 10,
                backgroundColor: 'white',
                // height: heightPercentageToDP('50%'),
                flex: 1,
              }}
            >
              <Image source={PendingTokenImg} style={styles.tokenPendingImg} />
              <Text style={{ fontWeight: 'bold', textAlign: 'center', padding: 15 }}>
                Booking Confirmation is Pending
              </Text>
              <Text style={{ textAlign: 'center', padding: 10 }}>
                Booking will be confirmed after Token/Payment added by accounts user
              </Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', bottom: 0 }}>
            <View style={{ width: '49%', marginRight: 7, paddingBottom: 10 }}>
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
