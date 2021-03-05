/** @format */

import { CheckBox } from 'native-base'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import _ from 'underscore'
import RoundPlus from '../../../assets/img/roundPlus.png'
import AppStyles from '../../AppStyles'
import CommissionTile from '../../components/CommissionTile'
import DocTile from '../../components/DocTile'
import ErrorMessage from '../../components/ErrorMessage'
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
      agreedNotZero,
      deleteDoc,
      activityBool,
      requestLegalServices,
      toggleTokenMenu,
      tokenMenu,
      confirmTokenAction,
      closeLegalDocument,
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
        commission.addedBy === 'buyer' &&
        commission.paymentCategory === 'token' &&
        commission.active
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
          editable={!isLeadClosed}
          showDate={true}
          dateStatus={{ status: tokenDateStatus, name: 'token' }}
        /> */}
        {/* {tokenNotZero ? <ErrorMessage errorMessage={'Amount must be greater than 0'} /> : null} */}
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
          title={'Legal Process Checklist'}
          uploadDocument={uploadDocument}
          category={'checklist'}
          uploadDocToServer={uploadDocToServer}
          checkListDoc={checkListDoc}
          legalCheckList={legalCheckList}
          downloadLegalDocs={downloadLegalDocs}
          deleteDoc={deleteDoc}
          activityBool={activityBool}
        />
        <RCMBTN
          onClick={closeLegalDocument}
          btnImage={RoundPlus}
          btnText={'UPLOAD LEGAL DOCUMENTS'}
          checkLeadClosedOrNot={false}
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
                  disabled={singleCommission ? commissionNotApplicableBuyer : isLeadClosed}
                  style={[
                    styles.addPaymentBtn,
                    {
                      backgroundColor:
                        commissionNotApplicableBuyer || isLeadClosed ? '#ddd' : '#fff',
                      borderColor: commissionNotApplicableBuyer || isLeadClosed ? '#ddd' : '#fff',
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
                  disabled={singleCommission ? commissionNotApplicableSeller : isLeadClosed}
                  style={[
                    styles.addPaymentBtn,
                    {
                      backgroundColor:
                        commissionNotApplicableSeller || isLeadClosed ? '#ddd' : '#fff',
                      borderColor: commissionNotApplicableSeller || isLeadClosed ? '#ddd' : '#fff',
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
}

export default BuyPaymentView
