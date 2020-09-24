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
      tileForToken,
    } = this.props
    return (
      <SafeAreaView style={styles.removePad}>
        <KeyboardAvoidingView>
          <View style={[styles.firstContainer]}>
            {/* Top Booked Text */}
            <View style={styles.bookedBtn}>
              <Image source={require('../../../assets/img/checkWhite.png')} style={styles.bookedBtnImage} />
              <Text style={styles.bookedBtnText}>BOOKED</Text>
            </View>

            {/* Top Details Wrap */}
            <View style={styles.mainTopDetailsWrap}>
              <View style={styles.detailsRow}>
                <Text style={styles.leftDetailsText}>
                  Project
                </Text>
                <Text style={styles.rightDetailsText}>
                  {data.project.name}
                </Text>
              </View>

              {/* ================================= */}
              <View style={styles.detailsRow}>
                <Text style={styles.leftDetailsText}>
                  Floor
                    </Text>
                <Text style={styles.rightDetailsText}>
                  {data.floor && data.floor.name}
                </Text>
              </View>

              {/* ================================= */}
              <View style={styles.detailsRow}>
                <Text style={styles.leftDetailsText}>
                  Unit
                    </Text>
                <Text style={styles.rightDetailsText}>
                  {data.unit && data.unit.name}
                </Text>
              </View>

              {/* ================================= */}
              <View style={styles.detailsRow}>
                <Text style={styles.leftDetailsText}>
                  Final Price
                    </Text>
                <Text style={styles.rightDetailsText}>
                  {formatPrice(data.unit ? data.unit.finalPrice : '')}
                </Text>
              </View>

              {/* ================================= */}
              <View style={styles.detailsRow}>
                <Text style={styles.leftDetailsText}>
                  Payment Plan
                    </Text>
                <Text style={styles.rightDetailsText}>
                  {data.installmentDue}
                </Text>
              </View>
            </View>

          </View>

          <Text style={styles.paymentsHeading}>
            PAYMENTS
              </Text>

          <View style={styles.mainPaymentWrap}>

            <View style={styles.paymentTileMain}>
              <View style={[styles.tileWrap, styles.scrollHeight, data.payment != null && data.payment.length < 3 ? styles.scrollHeightAuto : null]}>
                <ScrollView>

                  {
                    paymentPreviewLoading === true ?
                      <Text style={{ padding: 10, }}>Loading...</Text>
                      :
                      data && data.payment && data.payment.length > 0 ?
                        data.payment.map((item, index) => {
                          return (
                            <PaymentTile tileForToken={false} currencyConvert={currencyConvert} key={index} count={index} data={item} editTile={editTile} />
                          )
                        })
                        : <Text style={{ padding: 0, fontWeight: 'bold', textAlign: 'center' }}></Text>
                  }
                </ScrollView>
              </View>
            </View>

            {
              checkLeadClosedOrNot === true &&
              <TouchableOpacity style={styles.addPaymentBtn} onPress={() => { addPaymentModalToggle(true) }}>
                <Image style={styles.addPaymentBtnImg} source={require('../../../assets/img/roundPlus.png')}></Image>
                <Text style={styles.addPaymentBtnText}>ADD {data.payment && data.payment.length > 0 ? "MORE" : ''} PAYMENT</Text>
              </TouchableOpacity>
            }

          </View>

          <View style={styles.firstContainer}>
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


