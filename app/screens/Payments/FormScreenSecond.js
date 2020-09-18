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


class FormScreenSecond extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    const {
      data,
    } = this.props
    console.log(data)
    return (
      <SafeAreaView style={styles.removePad}>
        <KeyboardAvoidingView>
          <View style={styles.firstContainer}>
            {/* Top Booked Text */}
            <View style={styles.bookedBtn}>
              <Text style={styles.bookedBtnText}>
                <Image source={require('../../../assets/img/checkWhite.png')} style={styles.bookedBtnImage} /> BOOKED
                </Text>
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
            <TouchableOpacity style={styles.addPaymentBtn}>
              <Image style={styles.addPaymentBtnImg} source={require('../../../assets/img/roundPlus.png')}></Image>
              <Text style={styles.addPaymentBtnText}>ADD PAYMENT</Text>
            </TouchableOpacity>
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


