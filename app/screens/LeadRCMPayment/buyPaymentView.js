/** @format */

import React from 'react'
import { View } from 'react-native'
import _ from 'underscore'
import RoundPlus from '../../../assets/img/roundPlus.png'
import BuyerSellerTile from '../../components/BuyerSellerTile'
import ErrorMessage from '../../components/ErrorMessage'
import InputField from '../../components/InputField'
import RCMBTN from '../../components/RCMBTN'
import TokenTile from '../../components/TokenTile'
import helper from '../../helper'
import Ability from '../../hoc/Ability'
import StaticData from '../../StaticData'
class BuyPaymentView extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {}
  render() {
    const {
      agreedAmount,
      handleAgreedAmountChange,
      handleAgreedAmountPress,
      lead,
      showAndHideStyling,
      showStylingState,
      agreeAmountFromat,
      onAddCommissionPayment,
      editTile,
      user,
      currentProperty,
      commissionNotApplicableBuyer,
      commissionNotApplicableSeller,
      setBuyerCommissionApplicable,
      setSellerCommissionApplicable,
      onPaymentLongPress,
      agreedNotZero,
      toggleTokenMenu,
      tokenMenu,
      confirmTokenAction,
      closeLegalDocument,
      buyerSellerCounts,
    } = this.props
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
      (Ability.canEdit(subRole, 'Leads') || property.origin !== 'arms')
        ? true
        : false
    let sellerCommission =
      property.assigned_to_armsuser_id === user.id || !Ability.canEdit(subRole, 'Leads')
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
        commission.addedBy === 'buyer' &&
        commission.paymentCategory === 'token' &&
        commission.active
    )
    let showMenu = helper.showBuyerTokenMenu(tokenPayment)
    if (singleCommission) showMenu = helper.showSingleBuyerTokenMenu(tokenPayment)
    return (
      <View>
        <InputField
          label={'AGREED AMOUNT'}
          placeholder={'Enter Agreed Amount'}
          name={'agreeAmount'}
          value={agreedAmount}
          priceFormatVal={agreedAmount != null ? agreedAmount : ''}
          keyboardType={'numeric'}
          onChange={handleAgreedAmountChange}
          paymentDone={handleAgreedAmountPress}
          showStyling={showAndHideStyling}
          showStylingState={showStylingState}
          editPriceFormat={{ status: agreeAmountFromat, name: 'agreeAmount' }}
          editable={!isLeadClosed}
          showDate={false}
        />
        {agreedNotZero ? <ErrorMessage errorMessage={'Amount must be greater than 0'} /> : null}
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
        <BuyerSellerTile
          singleCommission={singleCommission}
          isLeadClosed={isLeadClosed}
          setComissionApplicable={setBuyerCommissionApplicable}
          commissionNotApplicableBuyerSeller={buyerCommission ? commissionNotApplicableBuyer : true}
          tileType={'buyer'}
          tileTitle={commissionNotApplicableBuyer ? 'Buyer Side Not Applicable' : 'Buyer Side'}
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
        />
        <BuyerSellerTile
          singleCommission={singleCommission}
          isLeadClosed={isLeadClosed}
          setComissionApplicable={setSellerCommissionApplicable}
          commissionNotApplicableBuyerSeller={
            sellerCommission ? commissionNotApplicableSeller : true
          }
          tileType={'seller'}
          tileTitle={commissionNotApplicableBuyer ? 'Seller Side Not Applicable' : 'Seller Side'}
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
        />
      </View>
    )
  }
}

export default BuyPaymentView
