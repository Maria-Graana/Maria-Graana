/** @format */

import { CheckBox } from 'native-base'
import React from 'react'
import { Image, Text, TouchableOpacity, Switch, View } from 'react-native'
import _ from 'underscore'
import { formatPrice } from '../../PriceFormate'
import RoundPlus from '../../../assets/img/roundPlus.png'
import AppStyles from '../../AppStyles'
import CommissionTile from '../../components/CommissionTile'
import ErrorMessage from '../../components/ErrorMessage'
import InputField from '../../components/InputField'
import PickerComponent from '../../components/Picker'
import RCMBTN from '../../components/RCMBTN'
import RCMRentMonthlyModal from '../../components/RCMRentMonthlyModal'
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
    toggleMonthlyDetails,
    rentMonthlyToggle,
    updateRentLead,
  } = props

  MonthlyTile = () => {
    return (
      <View style={styles.monthlyTile}>
        <View style={{ justifyContent: 'space-between' }}>
          <Text style={styles.monthlyPayment}>MONTHLY RENT</Text>
          <Text style={styles.monthlyText}>{formatPrice(formData.monthlyRent)}</Text>
        </View>
        <TouchableOpacity onPress={toggleMonthlyDetails} style={styles.monthlyDetailsBtn}>
          <Text style={styles.monthlyDetailText}>DETAILS</Text>
        </TouchableOpacity>
      </View>
    )
  }

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
  console.log('subRole: ', subRole)
  console.log('user.id: ', user.id)
  console.log('property.assigned_to_armsuser_id: ', property.assigned_to_armsuser_id)
  console.log('property: ', property.id)
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
      <MonthlyTile />
      <View style={{ paddingVertical: 5 }} />
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
      <RCMRentMonthlyModal
        isVisible={rentMonthlyToggle}
        closeModal={toggleMonthlyDetails}
        formData={formData}
        handleForm={handleForm}
        pickerData={pickerData}
        isLeadClosed={isLeadClosed}
        updateRentLead={updateRentLead}
      />

      <View
        style={{
          minHeight: 100,
          backgroundColor: '#fff',
          marginVertical: 10,
          padding: 10,
          borderRadius: 5,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}
        >
          <Text
            style={{ alignSelf: 'center', fontFamily: AppStyles.fonts.semiBoldFont, fontSize: 16 }}
          >
            Buyer Side
          </Text>
          {singleCommission && !buyer && !isLeadClosed && (
            <Switch
              trackColor={{ false: '#81b0ff', true: AppStyles.colors.primaryColor }}
              thumbColor={false ? AppStyles.colors.primaryColor : '#fff'}
              ios_backgroundColor="#81b0ff"
              onValueChange={() => setBuyerCommissionApplicable(!commissionNotApplicableBuyer)}
              // value={commissionNotApplicableBuyer ? true : false}
              value={false}
              style={{
                borderColor: AppStyles.colors.primaryColor,
                borderWidth: 0,
                justifyContent: 'center',
                alignSelf: 'center',
              }}
            />
          )}
        </View>
        <RCMBTN
          onClick={() => closeLegalDocument('buyer')}
          btnImage={RoundPlus}
          btnText={'UPLOAD LEGAL DOCUMENTS'}
          checkLeadClosedOrNot={false}
          // isLeadClosed={}
          hiddenBtn={commissionNotApplicableBuyer}
          addBorder={true}
        />

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
      </View>

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
