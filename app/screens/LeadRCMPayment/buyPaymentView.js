/** @format */

import moment from 'moment'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { CheckBox } from 'native-base'
import _ from 'underscore'
import AppStyles from '../../AppStyles'
import CommissionTile from '../../components/CommissionTile'
import DocTile from '../../components/DocTile'
import InputField from '../../components/InputField'
import Ability from '../../hoc/Ability'
import StaticData from '../../StaticData'
import ErrorMessage from '../../components/ErrorMessage'
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
      tokenNotZero,
      agreedNotZero,
      deleteDoc,
      activityBool,
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
    if (sellerCommission === true) {
      if (property.origin === null) {
        sellerCommission = false
      }
    }
    let singleCommission = buyerCommission && sellerCommission ? true : false
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
        {agreedNotZero ? <ErrorMessage errorMessage={'Amount must be greater than 0'} /> : null}
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
        {tokenNotZero ? <ErrorMessage errorMessage={'Amount must be greater than 0'} /> : null}
        <DocTile
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
          title={'CheckList'}
          uploadDocument={uploadDocument}
          category={'checklist'}
          uploadDocToServer={uploadDocToServer}
          checkListDoc={checkListDoc}
          legalCheckList={legalCheckList}
          downloadLegalDocs={downloadLegalDocs}
          deleteDoc={deleteDoc}
          activityBool={activityBool}
        />

        {
          // Checkbox
          singleCommission && !buyer && !isLeadClosed ? (
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
          ) : null
        }

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
                  disabled={singleCommission ? commissionNotApplicableBuyer : false}
                  style={[
                    styles.addPaymentBtn,
                    {
                      backgroundColor: commissionNotApplicableBuyer ? '#ddd' : '#fff',
                      borderColor: commissionNotApplicableBuyer ? '#ddd' : '#fff',
                    },
                  ]}
                  onPress={() => onAddCommissionPayment('buyer')}
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
        {
          // Checkbox
          singleCommission && !seller && !isLeadClosed ? (
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
          ) : null
        }

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
                  disabled={singleCommission ? commissionNotApplicableSeller : false}
                  style={[
                    styles.addPaymentBtn,
                    {
                      backgroundColor: commissionNotApplicableSeller ? '#ddd' : '#fff',
                      borderColor: commissionNotApplicableSeller ? '#ddd' : '#fff',
                    },
                  ]}
                  onPress={() => onAddCommissionPayment('seller')}
                >
                  <Image
                    style={styles.addPaymentBtnImg}
                    source={require('../../../assets/img/roundPlus.png')}
                  ></Image>
                  <Text style={styles.addPaymentBtnText}>ADD SELLER COMMISSION PAYMENT</Text>
                </TouchableOpacity>
              ) : (
                <View style={[styles.addPaymentBtn, { borderColor: '#ddd' }]}>
                  <Text style={[styles.addPaymentBtnText, { color: '#ddd' }]}>
                    {' '}
                    SELLER COMMISSION NOT APPLICABLE
                  </Text>
                </View>
              )}
            </View>
          )
        ) : null}
      </View>
    )
  }
}

export default BuyPaymentView
