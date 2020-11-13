/** @format */

import React from 'react'
import { View, TextInput, TouchableOpacity, Image, Text } from 'react-native'
import moment from 'moment'
import StaticData from '../../StaticData'
import InputField from '../../components/InputField'
import CommissionTile from '../../components/CommissionTile'
import styles from './styles'

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
    } = this.props
    const isLeadClosed =
      lead.status === StaticData.Constants.lead_closed_lost ||
      lead.status === StaticData.Constants.lead_closed_won
    const buyer = lead.commissions.find(
      (commission) => commission.addedBy && commission.addedBy === 'seller'
    )
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
          editable={false}
          showDate={true}
          dateStatus={{ status: tokenDateStatus, name: 'token' }}
        />
        {lead.commissions ? (
          buyer ? (
            <CommissionTile data={buyer} editTile={editTile} title={'Commission Payment'} />
          ) : (
            <TouchableOpacity
              style={styles.addPaymentBtn}
              onPress={() => onAddCommissionPayment(true)}
            >
              <Image
                style={styles.addPaymentBtnImg}
                source={require('../../../assets/img/roundPlus.png')}
              ></Image>
              <Text style={styles.addPaymentBtnText}>ADD COMMISSION PAYMENT</Text>
            </TouchableOpacity>
          )
        ) : null}
      </View>
    )
  }
}

export default BuyPaymentView
