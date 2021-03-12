/** @format */

import { CheckBox } from 'native-base'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import _ from 'underscore'
import RoundPlus from '../../../assets/img/roundPlus.png'
import AppStyles from '../../AppStyles'
import CommissionTile from '../../components/CommissionTile'
import DocTile from '../../components/DocTile'
import ErrorMessage from '../../components/ErrorMessage'
import InputField from '../../components/InputField'
import PickerComponent from '../../components/Picker'
import RCMBTN from '../../components/RCMBTN'
import TokenTile from '../../components/TokenTile'
import helper from '../../helper'
import Ability from '../../hoc/Ability'
import styles from './styles'

const RentPaymentView = (props) => {
  const {
    pickerData,
    handleForm,
    formData,
    handleMonthlyRentPress,
    lead,
    showAndHideStyling,
    showStylingState,
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
    rentNotZero,
    deleteDoc,
    activityBool,
    requestLegalServices,
    toggleTokenMenu,
    tokenMenu,
    confirmTokenAction,
    closeLegalDocument,
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
  const tokenPayment = _.find(
    lead.commissions,
    (commission) =>
      commission.addedBy === 'buyer' && commission.paymentCategory === 'token' && commission.active
  )
  let showMenu = helper.showBuyerTokenMenu(tokenPayment)
  if (singleCommission) showMenu = helper.showSingleBuyerTokenMenu(tokenPayment)
  return (
    <View>
      <TouchableOpacity
        disabled={lead.legalMailSent}
        style={[
          styles.legalServicesButton,
          {
            marginTop: 10,
            backgroundColor: lead.legalMailSent ? '#ddd' : '#fff',
            borderColor: lead.legalMailSent ? '#ddd' : AppStyles.colors.primaryColor,
          },
        ]}
        onPress={() => requestLegalServices()}
      >
        <Text style={[styles.addPaymentBtnText]}>
          {lead.legalMailSent ? 'LEGAL SERVICES REQUESTED' : 'REQUEST LEGAL SERVICES'}
        </Text>
      </TouchableOpacity>
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
      {!tokenPayment ? (
        <RCMBTN
          onClick={() => onAddCommissionPayment('buyer', 'token')}
          btnImage={RoundPlus}
          btnText={'ADD TOKEN'}
          checkLeadClosedOrNot={false}
        />
      ) : null}

      {tokenPayment ? (
        <TokenTile
          data={tokenPayment}
          editTile={editTile}
          onPaymentLongPress={() => onPaymentLongPress(tokenPayment)}
          commissionEdit={!buyerCommission}
          title={tokenPayment ? 'Token' : ''}
          toggleTokenMenu={toggleTokenMenu}
          tokenMenu={tokenMenu}
          showMenu={showMenu}
          confirmTokenAction={confirmTokenAction}
          singleCommission={singleCommission}
          onSubmitNewToken={onAddCommissionPayment}
        />
      ) : null}
      {/* <DocTile
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
      /> */}

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

      {/* <InputField
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
      /> */}
      {/* {tokenNotZero ? <ErrorMessage errorMessage={'Amount must be greater than 0'} /> : null} */}
      {}
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
      {buyerCommission && (
        <RCMBTN
          onClick={() => closeLegalDocument('buyer')}
          btnImage={RoundPlus}
          btnText={'UPLOAD LEGAL DOCUMENTS'}
          checkLeadClosedOrNot={false}
          // isLeadClosed={}
          hiddenBtn={commissionNotApplicableBuyer}
        />
      )}

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
                onPress={() => onAddCommissionPayment('buyer', 'commission')}
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
      {sellerCommission && (
        <RCMBTN
          onClick={() => closeLegalDocument('seller')}
          btnImage={RoundPlus}
          btnText={'UPLOAD LEGAL DOCUMENTS'}
          checkLeadClosedOrNot={false}
          // isLeadClosed={}
          hiddenBtn={commissionNotApplicableSeller}
        />
      )}
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
                onPress={() => onAddCommissionPayment('seller', 'commission')}
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
