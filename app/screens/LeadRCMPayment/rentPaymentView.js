/** @format */

import moment from 'moment'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import _ from 'underscore'
import AppStyles from '../../AppStyles'
import CommissionTile from '../../components/CommissionTile'
import InputField from '../../components/InputField'
import PickerComponent from '../../components/Picker'
import styles from './styles'
import { connect } from 'react-redux'
import Ability from '../../hoc/Ability'

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
    user,
    currentProperty,
  } = props
  let property = currentProperty[0]
  let subRole =
    property &&
    property.armsuser &&
    property.armsuser.armsUserRole &&
    property.armsuser.armsUserRole.subRole
  // console.log('property: ', property)
  const isLeadClosed =
    lead.status === StaticData.Constants.lead_closed_lost ||
    lead.status === StaticData.Constants.lead_closed_won
  let buyerCommission =
    lead.assigned_to_armsuser_id === user.id &&
    (Ability.canView(subRole, 'Leads') || property.origin !== 'arms')
      ? true
      : false
  let sellerCommission =
    property.assigned_to_armsuser_id === user.id ||
    (lead.assigned_to_armsuser_id === user.id && property.origin !== 'arms') ||
    !Ability.canView(subRole, 'Leads')
      ? true
      : false
      if(sellerCommission === true){
        if(property.origin === null){
          sellerCommission = false;
        }
      }
  let singleCommission = buyerCommission && sellerCommission ? true : false;
  const buyer = _.find(lead.commissions, (commission) => commission.addedBy === 'buyer')
  const seller = _.find(lead.commissions, (commission) => commission.addedBy === 'seller')
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
        editable={!isLeadClosed}
        showDate={false}
      />

      <View style={[AppStyles.mainInputWrap]}>
        <View style={[AppStyles.inputWrap]}>
          <PickerComponent
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
        editable={!isLeadClosed}
        showDate={true}
        dateStatus={{ status: tokenDateStatus, name: 'token' }}
      />
      {lead.commissions ? (
          buyer ? (
            <CommissionTile
              data={buyer}
              editTile={editTile}
              commissionEdit={!buyerCommission}
              title={buyer ? 'Buyer Commission Payment' : ''}
            />
          ) : (
              <View>
                {buyerCommission ? (
                  <TouchableOpacity
                    style={styles.addPaymentBtn}
                    onPress={() => onAddCommissionPayment('buyer', singleCommission)}
                  >
                    <Image
                      style={styles.addPaymentBtnImg}
                      source={require('../../../assets/img/roundPlus.png')}
                    ></Image>
                    <Text style={styles.addPaymentBtnText}>ADD BUYER COMMISSION PAYMENT</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )
        ) : null}

        {lead.commissions ? (
          seller ? (
            <CommissionTile data={seller}
             commissionEdit={!sellerCommission}
             editTile={editTile} 
             title={'Seller Commission Payment'} />
          ) : (
            <View>
              {sellerCommission ? (
                <TouchableOpacity
                  style={styles.addPaymentBtn}
                  onPress={() => onAddCommissionPayment('seller', singleCommission)}
                >
                  <Image
                    style={styles.addPaymentBtnImg}
                    source={require('../../../assets/img/roundPlus.png')}
                  ></Image>
                  <Text style={styles.addPaymentBtnText}>ADD SELLER COMMISSION PAYMENT</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )
        ) : null}
      </View>
    )
}

export default RentPaymentView
