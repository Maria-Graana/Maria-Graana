/** @format */

import moment from 'moment'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { CheckBox } from 'native-base'
import _ from 'underscore'
import AppStyles from '../../AppStyles'
import CommissionTile from '../../components/CommissionTile'
import DocTile from '../../components/DocTile'
import InputField from '../../components/InputField'
import PickerComponent from '../../components/Picker'
import Ability from '../../hoc/Ability'
import ErrorMessage from '../../components/ErrorMessage'
import styles from './styles'

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
    commissionNotApplicableBuyer,
    commissionNotApplicableSeller,
    setBuyerCommissionApplicable,
    setSellerCommissionApplicable,
    uploadDocument,
    uploadDocToServer,
    agreementDoc,
    checkListDoc,
    legalAgreement,
    legalCheckList,
    downloadLegalDocs,
    onPaymentLongPress,
    tokenNotZero,
    rentNotZero,
    deleteDoc,
    activityBool,
  } = props
  let property = currentProperty[0]
  let subRole =
    property &&
    property.armsuser &&
    property.armsuser.armsUserRole &&
    property.armsuser.armsUserRole.subRole
  const isLeadClosed =
    lead.status === StaticData.Constants.lead_closed_lost ||
    lead.status === StaticData.Constants.lead_closed_won
  let buyerCommission =
    lead.assigned_to_armsuser_id === user.id &&
    (Ability.canView(subRole, 'Leads') || property.origin !== 'arms')
      ? true
      : false
  let sellerCommission =
    property.assigned_to_armsuser_id === user.id || !Ability.canView(subRole, 'Leads')
      ? true
      : false
  // if (sellerCommission === true) {
  //   if (property.origin === null) {
  //     sellerCommission = false
  //   }
  // }
  let singleCommission = buyerCommission && sellerCommission ? true : false
  const buyer = _.find(
    lead.commissions,
    (commission) => commission.addedBy === 'buyer' && commission.paymentCategory === 'commission'
  )
  const seller = _.find(
    lead.commissions,
    (commission) => commission.addedBy === 'seller' && commission.paymentCategory === 'commission'
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
        editable={!isLeadClosed}
        showDate={false}
      />
      {rentNotZero ? <ErrorMessage errorMessage={'Amount must be greater than 0'} /> : null}
      <DocTile
        title={'Signed Agreement'}
        uploadDocument={uploadDocument}
        category={'agreement'}
        uploadDocToServer={uploadDocToServer}
        agreementDoc={agreementDoc}
        legalAgreement={legalAgreement}
        downloadLegalDocs={downloadLegalDocs}
        deleteDoc={deleteDoc}
        activityBool={activityBool}
      />
      <DocTile
        title={'Legal Process Checklist'}
        uploadDocument={uploadDocument}
        category={'checklist'}
        uploadDocToServer={uploadDocToServer}
        checkListDoc={checkListDoc}
        legalCheckList={legalCheckList}
        downloadLegalDocs={downloadLegalDocs}
        deleteDoc={deleteDoc}
        activityBool={activityBool}
      />

      <View style={[AppStyles.mainInputWrap]}>
        <View style={[AppStyles.inputWrap]}>
          <PickerComponent
            onValueChange={handleForm}
            name={'contract_months'}
            data={pickerData}
            selectedItem={formData.contract_months}
            enabled={!isLeadClosed}
            placeholder="Contract duration (No of months)"
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
      {tokenNotZero ? <ErrorMessage errorMessage={'Amount must be greater than 0'} /> : null}

      {singleCommission && !buyer && !isLeadClosed ? (
        <TouchableOpacity
          disabled={commissionNotApplicableSeller === true}
          onPress={() => setBuyerCommissionApplicable(!commissionNotApplicableBuyer)}
          style={styles.checkBoxRow}
        >
          <CheckBox
            color={AppStyles.colors.primaryColor}
            checked={commissionNotApplicableBuyer ? true : false}
            onPress={() => setBuyerCommissionApplicable(!commissionNotApplicableBuyer)}
            style={styles.checkBox}
          />
          <Text
            style={{
              color:
                commissionNotApplicableSeller === true
                  ? AppStyles.colors.subTextColor
                  : AppStyles.colors.textColor,
            }}
          >
            Set Buyer Commission As Not Applicable
          </Text>
        </TouchableOpacity>
      ) : null}

      {lead.commissions ? (
        buyer ? (
          <CommissionTile
            data={buyer}
            editTile={editTile}
            onPaymentLongPress={() => onPaymentLongPress(buyer)}
            commissionEdit={!buyerCommission}
            title={buyer ? 'Buyer Commission Payment' : ''}
          />
        ) : (
          <View>
            {buyerCommission ? (
              <TouchableOpacity
                disabled={singleCommission ? commissionNotApplicableBuyer : isLeadClosed}
                style={[
                  styles.addPaymentBtn,
                  {
                    backgroundColor: commissionNotApplicableBuyer ? '#ddd' : '#fff',
                    borderColor: commissionNotApplicableBuyer ? '#ddd' : '#fff',
                  },
                ]}
                onPress={() => onAddCommissionPayment('buyer')}
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

      {singleCommission && !seller && !isLeadClosed ? (
        <TouchableOpacity
          disabled={commissionNotApplicableBuyer === true}
          onPress={() => setSellerCommissionApplicable(!commissionNotApplicableSeller)}
          style={styles.checkBoxRow}
        >
          <CheckBox
            color={AppStyles.colors.primaryColor}
            checked={commissionNotApplicableSeller ? true : false}
            onPress={() => setSellerCommissionApplicable(!commissionNotApplicableSeller)}
            style={styles.checkBox}
          />
          <Text
            style={{
              color:
                commissionNotApplicableBuyer === true
                  ? AppStyles.colors.subTextColor
                  : AppStyles.colors.textColor,
            }}
          >
            Set Seller Commission As Not Applicable
          </Text>
        </TouchableOpacity>
      ) : null}

      {lead.commissions ? (
        seller ? (
          <CommissionTile
            data={seller}
            commissionEdit={!sellerCommission}
            onPaymentLongPress={() => onPaymentLongPress(seller)}
            editTile={editTile}
            title={'Seller Commission Payment'}
          />
        ) : (
          <View>
            {sellerCommission ? (
              <TouchableOpacity
                disabled={singleCommission ? commissionNotApplicableSeller : isLeadClosed}
                style={[
                  styles.addPaymentBtn,
                  {
                    backgroundColor: commissionNotApplicableSeller ? '#ddd' : '#fff',
                    borderColor: commissionNotApplicableSeller ? '#ddd' : '#fff',
                  },
                ]}
                onPress={() => onAddCommissionPayment('seller')}
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
