/** @format */

import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import AppStyles from '../../AppStyles'
import styles from './styles'
import { Ionicons } from '@expo/vector-icons'
import PickerComponent from '../../components/Picker'
import moment from 'moment'
import { formatPrice } from '../../PriceFormate'
import InputField from '../../components/InputField'
import CommissionTile from '../../components/CommissionTile'
import { connect } from 'react-redux'

const RentPaymentView = (props) => {
  const {
    token,
    pickerData,
    handleForm,
    formData,
    handleMonthlyRentPress,
    handleTokenAmountChange,
    handleTokenAmountPress,
    lead,
    showAndHideStyling,
    showStylingState,
    tokenPriceFromat,
    tokenDateStatus,
    monthlyFormatStatus,
    onAddCommissionPayment,
    editTile,
  } = props
  const isLeadClosed =
    lead.status === StaticData.Constants.lead_closed_lost ||
    lead.status === StaticData.Constants.lead_closed_won
  const buyer = lead.commissions.find(
    (commission) => commission.addedBy && commission.addedBy === 'seller'
  )
  return (
    <View>
      <InputField
        label={'MONTHLY RENT'}
        placeholder={'Enter Monthly Rent'}
        name={'monthlyRent'}
        value={formData.monthlyRent}
        priceFormatVal={formData.monthlyRent != null ? formData.monthlyRent : ''}
        keyboardType={'numeric'}
        onChange={handleForm}
        paymentDone={handleMonthlyRentPress}
        showStyling={showAndHideStyling}
        showStylingState={showStylingState}
        editPriceFormat={{ status: monthlyFormatStatus, name: 'monthlyRent' }}
        editable={false}
        showDate={false}
      />

      <View style={[AppStyles.mainInputWrap]}>
        <View style={[AppStyles.inputWrap]}>
          <PickerComponent
            enabled={false}
            onValueChange={handleForm}
            name={'contract_months'}
            data={pickerData}
            selectedItem={formData.contract_months}
            enabled={!isLeadClosed}
            placeholder="Contact duration (No of months)"
          />
        </View>
      </View>

      <View style={[AppStyles.mainInputWrap]}>
        <View style={[AppStyles.inputWrap]}>
          <PickerComponent
            enabled={false}
            onValueChange={handleForm}
            name={'advance'}
            data={pickerData}
            selectedItem={formData.advance}
            enabled={!isLeadClosed}
            placeholder="Advance (No of months)"
          />
        </View>
      </View>

      <View style={[AppStyles.mainInputWrap]}>
        <View style={[AppStyles.inputWrap]}>
          <PickerComponent
            enabled={false}
            onValueChange={handleForm}
            name={'security'}
            data={pickerData}
            selectedItem={formData.security}
            enabled={!isLeadClosed}
            placeholder="Security (No of months)"
          />
        </View>
      </View>

      <InputField
        label={'TOKEN'}
        placeholder={'Enter Token Amount'}
        name={'token'}
        value={token}
        priceFormatVal={token != null ? token : ''}
        keyboardType={'numeric'}
        onChange={handleTokenAmountChange}
        paymentDone={handleTokenAmountPress}
        showStyling={showAndHideStyling}
        showStylingState={showStylingState}
        editPriceFormat={{ status: tokenPriceFromat, name: 'token' }}
        date={lead.tokenPaymentTime && moment(lead.tokenPaymentTime).format('hh:mm A, MMM DD')}
        editable={false}
        showDate={true}
        dateStatus={{ status: tokenDateStatus, name: 'token' }}
      />

      {lead.commissions ? (
        buyer ? (
          <CommissionTile data={buyer} editTile={editTile} title={'Commission Payment'} />
        ) : (
          <TouchableOpacity
            style={styles.addPaymentBtn}
            onPress={() => onAddCommissionPayment(true)}
          >
            <Image
              style={styles.addPaymentBtnImg}
              source={require('../../../assets/img/roundPlus.png')}
            ></Image>
            <Text style={styles.addPaymentBtnText}>ADD COMMISSION PAYMENT</Text>
          </TouchableOpacity>
        )
      ) : null}
    </View>
  )
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
    rcmPayment: store.RCMPayment.RCMPayment,
  }
}

export default connect(mapStateToProps)(RentPaymentView)
