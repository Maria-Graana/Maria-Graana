/** @format */

import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import _ from 'underscore'
import RoundPlus from '../../../assets/img/roundPlus.png'
import CommissionTile from '../../components/CommissionTile'
import InputField from '../../components/InputField'
import RCMBTN from '../../components/RCMBTN'
import TokenTile from '../../components/TokenTile'
import helper from '../../helper'
import Ability from '../../hoc/Ability'
import StaticData from '../../StaticData'
import styles from './styles'

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
      requestLegalServices,
      toggleTokenMenu,
      tokenMenu,
      confirmTokenAction,
      closeLegalDocument,
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
    let buyerCommission =
      lead.assigned_to_armsuser_id === user.id &&
      (Ability.canEdit(subRole, 'Leads') || property.origin !== 'arms')
        ? true
        : false
    let sellerCommission =
      property.assigned_to_armsuser_id === user.id ||
      (lead.assigned_to_armsuser_id === user.id && property.origin !== 'arms') ||
      !Ability.canEdit(subRole, 'Leads')
        ? true
        : false
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
        commission.addedBy === 'buyer' &&
        commission.paymentCategory === 'token' &&
        commission.active
    )
    let showMenu = helper.showSellerTokenMenu(tokenPayment)
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
          editable={false}
          showDate={true}
          dateStatus={{ status: tokenDateStatus, name: 'token' }}
        /> */}
        <RCMBTN
          onClick={() => closeLegalDocument('buyer')}
          btnImage={RoundPlus}
          btnText={'UPLOAD LEGAL DOCUMENTS'}
          checkLeadClosedOrNot={false}
        />
        {lead.commissions ? (
          buyer ? (
            <CommissionTile
              data={buyer}
              editTile={editTile}
              commissionEdit={!buyerCommission}
              onPaymentLongPress={() => onPaymentLongPress(buyer)}
              title={buyer ? 'Buyer Commission Payment' : ''}
            />
          ) : (
            <View>
              {buyerCommission ? (
                <TouchableOpacity
                  disabled={isLeadClosed}
                  style={styles.addPaymentBtn}
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

        {lead.commissions ? (
          seller ? (
            <CommissionTile
              data={seller}
              commissionEdit={!sellerCommission}
              editTile={editTile}
              onPaymentLongPress={() => onPaymentLongPress(seller)}
              title={'Seller Commission Payment'}
            />
          ) : (
            <View>
              {sellerCommission ? (
                <TouchableOpacity
                  disabled={isLeadClosed}
                  style={styles.addPaymentBtn}
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
}

export default BuyPaymentView
