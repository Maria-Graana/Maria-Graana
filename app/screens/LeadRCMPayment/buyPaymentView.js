/** @format */

import React from 'react'
import { View, TextInput, TouchableOpacity, Image, Text } from 'react-native'
import moment from 'moment'
import StaticData from '../../StaticData'
import InputField from '../../components/InputField'
import CommissionTile from '../../components/CommissionTile'
import _ from 'underscore'
import styles from './styles'
import { connect } from 'react-redux'
import Ability from '../../hoc/Ability'

class BuyPaymentView extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {}
  render() {
    const {
      agreedAmount,
      token,
      handleAgreedAmountChange,
      handleTokenAmountChange,
      handleAgreedAmountPress,
      handleTokenAmountPress,
      lead,
      showAndHideStyling,
      showStylingState,
      tokenPriceFromat,
      tokenDateStatus,
      agreeAmountFromat,
      onAddCommissionPayment,
      editTile,
      user,
      currentProperty,
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
      (Ability.canView(subRole, 'Leads') || property.origin !== 'arms')
        ? true
        : false
    let sellerCommission =
      property.assigned_to_armsuser_id === user.id ||
      (lead.assigned_to_armsuser_id === user.id && property.origin !== 'arms') ||
      !Ability.canView(subRole, 'Leads')
        ? true
        : false
    const buyer = _.find(lead.commissions, (commission) => commission.addedBy === 'buyer')
    const seller = _.find(lead.commissions, (commission) => commission.addedBy === 'seller')

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
          buyerCommission ? (
            <CommissionTile
              data={buyer}
              editTile={editTile}
              title={buyer ? 'Buyer Commission Payment' : ''}
            />
          ) : (
            <TouchableOpacity
              style={styles.addPaymentBtn}
              onPress={() => onAddCommissionPayment('buyer')}
            >
              <Image
                style={styles.addPaymentBtnImg}
                source={require('../../../assets/img/roundPlus.png')}
              ></Image>
              <Text style={styles.addPaymentBtnText}>ADD BUYER COMMISSION PAYMENT</Text>
            </TouchableOpacity>
          )
        ) : null}

        {lead.commissions ? (
          sellerCommission ? (
            <CommissionTile data={seller} editTile={editTile} title={'Seller Commission Payment'} />
          ) : (
            <TouchableOpacity
              style={styles.addPaymentBtn}
              onPress={() => onAddCommissionPayment('seller')}
            >
              <Image
                style={styles.addPaymentBtnImg}
                source={require('../../../assets/img/roundPlus.png')}
              ></Image>
              <Text style={styles.addPaymentBtnText}>ADD SELLER COMMISSION PAYMENT</Text>
            </TouchableOpacity>
          )
        ) : null}
      </View>
    )
  }
}

export default BuyPaymentView
