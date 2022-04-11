/** @format */

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
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
import { formatPrice } from '../../PriceFormate'
import styles from './styles'
import RCMBuyerModal from '../../components/RCMBuyerModal'
class BuyPaymentView extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {}
  render() {
    const {
      agreedAmount,
      handleAgreedAmountPress,
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
      agreedNotZero,
      toggleTokenMenu,
      tokenMenu,
      confirmTokenAction,
      closeLegalDocument,
      buyerSellerCounts,
      buyerToggleModal,
      toggleBuyerDetails,
      formData,
      handleForm,
      advanceNotZero,
      call,
      readPermission,
      updatePermission,
      closedLeadEdit,
    } = this.props
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
    let buyerCommission = helper.setBuyerAgent(lead, 'buyerSide', user, property)
    let sellerCommission = helper.setSellerAgent(lead, property, 'buyerSide', user)
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
        <RCMBuyerModal
          isVisible={buyerToggleModal}
          closeModal={toggleBuyerDetails}
          formData={formData}
          handleForm={handleForm}
          isLeadClosed={isLeadClosed}
          updateRentLead={handleAgreedAmountPress}
          leadAgentType={'buyer'}
          lead={lead}
          agreedNotZero={agreedNotZero}
          advanceNotZero={advanceNotZero}
          readPermission={readPermission}
          updatePermission={updatePermission}
          closedLeadEdit={closedLeadEdit}
        />
        <View style={styles.monthlyTile}>
          <View style={{ justifyContent: 'space-between' }}>
            <Text style={styles.monthlyPayment}>AGREED AMOUNT</Text>
            <Text style={styles.monthlyText}>{formatPrice(formData.agreedAmount)}</Text>
          </View>
          <TouchableOpacity onPress={toggleBuyerDetails} style={styles.monthlyDetailsBtn}>
            <Text style={styles.monthlyDetailText}>DETAILS</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingVertical: 5 }} />
        {!tokenPayment ? (
          <RCMBTN
            onClick={() => {
              if (updatePermission && closedLeadEdit) onAddCommissionPayment('buyer', 'token')
            }}
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
            onPaymentLongPress={() => {
              if (updatePermission && closedLeadEdit) onPaymentLongPress(tokenPayment)
            }}
            commissionEdit={!buyerCommission}
            title={tokenPayment ? 'Token' : ''}
            toggleTokenMenu={toggleTokenMenu}
            tokenMenu={tokenMenu}
            showMenu={showMenu}
            confirmTokenAction={confirmTokenAction}
            singleCommission={singleCommission}
            onSubmitNewToken={onAddCommissionPayment}
            isLeadClosed={isLeadClosed}
            updatePermission={updatePermission}
          />
        ) : null}
        <BuyerSellerTile
          singleCommission={singleCommission}
          isLeadClosed={isLeadClosed}
          setComissionApplicable={setBuyerCommissionApplicable}
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
          call={call}
          leadType={'rcm'}
          readPermission={readPermission}
          updatePermission={updatePermission}
          closedLeadEdit={closedLeadEdit}
          commissionBuyer={!buyerCommission}
          commissionNotApplicableSeller={commissionNotApplicableSeller}
          commissionNotApplicableBuyer={commissionNotApplicableBuyer}
        />
        <BuyerSellerTile
          singleCommission={singleCommission}
          isLeadClosed={isLeadClosed}
          setComissionApplicable={setSellerCommissionApplicable}
          commissionSeller={!sellerCommission}
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
          readPermission={readPermission}
          updatePermission={updatePermission}
          closedLeadEdit={closedLeadEdit}
          commissionNotApplicableSeller={commissionNotApplicableSeller}
          commissionNotApplicableBuyer={commissionNotApplicableBuyer}
        />
      </View>
    )
  }
}

export default BuyPaymentView
