/** @format */

import React from 'react'
import { View } from 'react-native'
import _ from 'underscore'
import RoundPlus from '../../../assets/img/roundPlus.png'
import BuyerSellerTile from '../../components/BuyerSellerTile'
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
      onPaymentLongPress,
      toggleTokenMenu,
      tokenMenu,
      confirmTokenAction,
      closeLegalDocument,
      call,
      closedLeadEdit,
    } = this.props
    let property = currentProperty[0]
    const isLeadClosed =
      lead.status === StaticData.Constants.lead_closed_lost ||
      lead.status === StaticData.Constants.lead_closed_won
    let subRole =
      property &&
      property.armsuser &&
      property.armsuser.armsUserRole &&
      property.armsuser.armsUserRole.subRole
    let buyerCommission = helper.setBuyerAgent(lead, 'buyerSide', user, property)
    let sellerCommission = helper.setSellerAgent(lead, property, 'sellerSide', user)
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
    let showMenu = helper.showSellerTokenMenu(tokenPayment)

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
          editable={false}
          showDate={false}
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
            onPaymentLongPress={() => {}}
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
          commissionBuyer={!buyerCommission}
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
          closedLeadEdit={closedLeadEdit}
        />
        <BuyerSellerTile
          singleCommission={false}
          isLeadClosed={isLeadClosed}
          setComissionApplicable={() => {}}
          commissionSeller={!sellerCommission}
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
          closedLeadEdit={closedLeadEdit}
        />
      </View>
    )
  }
}

export default BuyPaymentView
