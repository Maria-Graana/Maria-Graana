/** @format */

import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
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
 const MonthlyTile = () => {
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

  const {
    pickerData,
    formData,
    lead,
    onAddCommissionPayment,
    editTile,
    currentProperty,
    user,
    onPaymentLongPress,
    toggleTokenMenu,
    tokenMenu,
    confirmTokenAction,
    closeLegalDocument,
    toggleMonthlyDetails,
    rentMonthlyToggle,
    call,
    updatePermission,
    closedLeadEdit,
  } = props
  const isLeadClosed =
    lead.status === StaticData.Constants.lead_closed_lost ||
    lead.status === StaticData.Constants.lead_closed_won
  let property = currentProperty[0]
  let subRole =
    property &&
    property.armsuser &&
    property.armsuser.armsUserRole &&
    property.armsuser.armsUserRole.subRole
  let buyerCommission = helper.setBuyerAgent(lead, 'buyerSide', user, property)
  let sellerCommission = helper.setSellerAgent(lead, property, 'sellerSide', user)
  // if (sellerCommission === true) {
  //   if (property.origin === null) {
  //     sellerCommission = false
  //   }
  // }
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
  let showMenu = helper.showSellerTokenMenu(tokenPayment)
  return (
    <View>
     { MonthlyTile()}
      {/* <MonthlyTile /> */}
      <View style={{ paddingVertical: 5 }} />
      <RCMRentMonthlyModal
        isVisible={rentMonthlyToggle}
        closeModal={toggleMonthlyDetails}
        formData={formData}
        handleForm={() => {}}
        pickerData={pickerData}
        isLeadClosed={isLeadClosed}
        updateRentLead={() => {}}
        leadAgentType={'seller'}
        lead={lead}
      />
      {!tokenPayment ? (
        <RCMBTN
          onClick={() => onAddCommissionPayment('buyer', 'token')}
          btnImage={RoundPlus}
          btnText={'ADD TOKEN'}
          checkLeadClosedOrNot={false}
          hiddenBtn={true}
        />
      ) : null}
      {tokenPayment ? (
        <TokenTile
          data={tokenPayment}
          editTile={editTile}
          onPaymentLongPress={() => onPaymentLongPress(tokenPayment)}
          commissionEdit={
            tokenPayment.status === 'pendingSales' || tokenPayment.status === 'notCleared'
              ? false
              : true
          }
          title={tokenPayment ? 'Token' : ''}
          toggleTokenMenu={toggleTokenMenu}
          tokenMenu={tokenMenu}
          showMenu={showMenu}
          confirmTokenAction={confirmTokenAction}
        />
      ) : null}
      <BuyerSellerTile
        singleCommission={false}
        isLeadClosed={isLeadClosed}
        setComissionApplicable={() => {}}
        commissionNotApplicableBuyerSeller={true}
        tileType={'buyer'}
        tileTitle={'Buyer Side'}
        closeLegalDocument={closeLegalDocument}
        onPaymentLongPress={onPaymentLongPress}
        payment={buyer}
        paymentCommission={buyerCommission}
        onAddCommissionPayment={onAddCommissionPayment}
        editTile={editTile}
        lead={lead}
        commissionTitle={'Buyer Commission Payment'}
        RCMBTNTitle={'ADD COMMISSION PAYMENT'}
        call={call}
        leadType={'sellRentout'}
        updatePermission={updatePermission}
        closedLeadEdit={closedLeadEdit}
        commissionBuyer={!buyerCommission}
      />
      <BuyerSellerTile
        singleCommission={false}
        isLeadClosed={isLeadClosed}
        setComissionApplicable={() => {}}
        commissionNotApplicableBuyerSeller={false}
        tileType={'seller'}
        tileTitle={'Seller Side'}
        closeLegalDocument={closeLegalDocument}
        onPaymentLongPress={onPaymentLongPress}
        payment={seller}
        paymentCommission={sellerCommission}
        onAddCommissionPayment={onAddCommissionPayment}
        editTile={editTile}
        lead={lead}
        commissionTitle={'Seller Commission Payment'}
        RCMBTNTitle={'ADD COMMISSION PAYMENT'}
        call={call}
        leadType={'sellRentout'}
        updatePermission={updatePermission}
        closedLeadEdit={closedLeadEdit}
        commissionSeller={!sellerCommission}
      />
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
