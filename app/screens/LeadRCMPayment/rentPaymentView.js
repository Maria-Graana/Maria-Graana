/** @format */

import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import _ from 'underscore'
import RoundPlus from '../../../assets/img/roundPlus.png'
import BuyerSellerTile from '../../components/BuyerSellerTile'
import RCMBTN from '../../components/RCMBTN'
import RCMRentMonthlyModal from '../../components/RCMRentMonthlyModal'
import TokenTile from '../../components/TokenTile'
import helper from '../../helper'
import Ability from '../../hoc/Ability'
import { formatPrice } from '../../PriceFormate'
import styles from './styles'

const RentPaymentView = (props) => {
  const {
    pickerData,
    handleForm,
    formData,
    lead,
    onAddCommissionPayment,
    editTile,
    user,
    currentProperty,
    commissionNotApplicableBuyer,
    commissionNotApplicableSeller,
    setBuyerCommissionApplicable,
    setSellerCommissionApplicable,
    onPaymentLongPress,
    toggleTokenMenu,
    tokenMenu,
    confirmTokenAction,
    closeLegalDocument,
    toggleMonthlyDetails,
    rentMonthlyToggle,
    updateRentLead,
    buyerSellerCounts,
    call,
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
  let isPP =
    property &&
    property.armsuser &&
    property.armsuser.organization &&
    property.armsuser.organization.isPP
  const isLeadClosed =
    lead.status === StaticData.Constants.lead_closed_lost ||
    lead.status === StaticData.Constants.lead_closed_won
  let buyerCommission =
    lead.assigned_to_armsuser_id === user.id &&
    (Ability.canView(subRole, 'Leads') || property.origin !== 'arms')
      ? true
      : false
  let sellerCommission =
    property.assigned_to_armsuser_id === user.id || !Ability.canView(subRole, 'Leads') || isPP
      ? true
      : false
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
      <MonthlyTile />
      <View style={{ paddingVertical: 5 }} />
      {!tokenPayment ? (
        <RCMBTN
          onClick={() => onAddCommissionPayment('buyer', 'token')}
          btnImage={RoundPlus}
          btnText={'ADD TOKEN'}
          checkLeadClosedOrNot={false}
          isLeadClosed={isLeadClosed}
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
          isLeadClosed={isLeadClosed}
        />
      ) : null}
      {tokenPayment && <View style={{ paddingVertical: 3 }} />}
      <RCMRentMonthlyModal
        isVisible={rentMonthlyToggle}
        closeModal={toggleMonthlyDetails}
        formData={formData}
        handleForm={handleForm}
        pickerData={pickerData}
        isLeadClosed={isLeadClosed}
        updateRentLead={updateRentLead}
        leadAgentType={'buyer'}
        lead={lead}
      />
      <BuyerSellerTile
        singleCommission={singleCommission}
        isLeadClosed={isLeadClosed}
        setComissionApplicable={setBuyerCommissionApplicable}
        commissionNotApplicableBuyerSeller={buyerCommission ? commissionNotApplicableBuyer : true}
        tileType={'buyer'}
        tileTitle={
          buyerCommission && commissionNotApplicableBuyer
            ? 'Buyer Side Not Applicable'
            : 'Buyer Side'
        }
        closeLegalDocument={closeLegalDocument}
        onPaymentLongPress={onPaymentLongPress}
        payment={buyer}
        paymentCommission={buyerCommission}
        onAddCommissionPayment={onAddCommissionPayment}
        editTile={editTile}
        lead={lead}
        commissionTitle={'Buyer Commission Payment'}
        RCMBTNTitle={'ADD COMMISSION PAYMENT'}
        buyerSellerCounts={buyerSellerCounts}
        call={call}
        leadType={'rcm'}
      />
      <BuyerSellerTile
        singleCommission={singleCommission}
        isLeadClosed={isLeadClosed}
        setComissionApplicable={setSellerCommissionApplicable}
        commissionNotApplicableBuyerSeller={sellerCommission ? commissionNotApplicableSeller : true}
        tileType={'seller'}
        tileTitle={
          sellerCommission && commissionNotApplicableSeller
            ? 'Seller Side Not Applicable'
            : 'Seller Side'
        }
        closeLegalDocument={closeLegalDocument}
        onPaymentLongPress={onPaymentLongPress}
        payment={seller}
        paymentCommission={sellerCommission ? sellerCommission : true}
        onAddCommissionPayment={onAddCommissionPayment}
        editTile={sellerCommission ? editTile : true}
        lead={lead}
        commissionTitle={'Seller Commission Payment'}
        RCMBTNTitle={'ADD COMMISSION PAYMENT'}
        buyerSellerCounts={buyerSellerCounts}
        call={call}
        leadType={'rcm'}
      />
    </View>
  )
}

export default RentPaymentView
