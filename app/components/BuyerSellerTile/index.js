/** @format */

import React from 'react'
import styles from './style'
import { Text, View, Switch } from 'react-native'
import { connect } from 'react-redux'
import RCMBTN from '../RCMBTN'
import CommissionTile from '../CommissionTile'
import RoundPlus from '../../../assets/img/roundPlus.png'
import helper from '../../helper'
class BuyerSellerTile extends React.Component {
  constructor(props) {
    super(props)
  }

  checkReadOnlyMode = () => {
    const { isLeadClosed, commissionNotApplicableBuyerSeller } = this.props
    if (isLeadClosed || commissionNotApplicableBuyerSeller) {
      return true
    } else return false
  }

  switchToggle = () => {
    const { payment } = this.props
    if (
      (payment && payment.status === 'open') ||
      (payment && payment.status === 'pendingSales') ||
      (payment && payment.status === 'notCleared')
    )
      return false
    else if (!payment) return false
    else return true
  }

  checkSwitchVisibility = () => {
    const { payment, singleCommission, isLeadClosed, tileType, leadType } = this.props
    let toggleVisibility = false
    if (!isLeadClosed && singleCommission) {
      if (
        (payment && payment.status === 'open') ||
        (payment && payment.status === 'pendingSales') ||
        (payment && payment.status === 'notCleared')
      )
        toggleVisibility = true
      if (!payment) toggleVisibility = true
    } else if (!isLeadClosed && !singleCommission) {
      // if (leadType === 'rcm' && tileType === 'buyer') toggleVisibility = true
      // if (leadType === 'sellRentOut' && tileType === 'seller') toggleVisibility = true
    }
    return toggleVisibility
  }

  checkTileVisibility = () => {
    const { singleCommission, tileType, leadType, commissionNotApplicableBuyerSeller } = this.props
    let tileVisibility = true
    if (!singleCommission) {
      if (leadType === 'rcm' && tileType === 'buyer' && commissionNotApplicableBuyerSeller)
        tileVisibility = false
      if (leadType === 'sellRentOut' && tileType === 'seller' && commissionNotApplicableBuyerSeller)
        tileVisibility = false
    }
    if (singleCommission) {
      if (leadType === 'rcm' && tileType === 'buyer' && commissionNotApplicableBuyerSeller)
        tileVisibility = false
      if (leadType === 'rcm' && tileType === 'seller' && commissionNotApplicableBuyerSeller)
        tileVisibility = false
    }
    return tileVisibility
  }

  render() {
    const {
      singleCommission,
      onPaymentLongPress,
      commissionNotApplicableBuyerSeller,
      tileType,
      tileTitle,
      closeLegalDocument,
      payment,
      paymentCommission,
      onAddCommissionPayment,
      editTile,
      lead,
      commissionTitle,
      RCMBTNTitle,
      setComissionApplicable,
      call,
      leadType,
      updatePermission,
      closedLeadEdit,
      commissionNotApplicableSeller,
      commissionNotApplicableBuyer,
      commissionBuyer,
      commissionSeller,
    } = this.props
    let onReadOnly = this.checkReadOnlyMode()
    let disabledSwitch = this.checkSwitchVisibility() ? false : true
    let showSwitch = this.checkSwitchVisibility()
    let tileVisibility = this.checkTileVisibility()
    return (
      <View style={styles.tileView}>
        <View style={[styles.titleView, { paddingVertical: 0, paddingBottom: 10 }]}>
          <Text style={styles.titleText}>{tileTitle}</Text>
          {showSwitch && leadType === 'rcm' && tileType === 'buyer' && (
            <Switch
              disabled={commissionNotApplicableSeller}
              trackColor={{ false: '#81b0ff', true: AppStyles.colors.primaryColor }}
              thumbColor={false ? AppStyles.colors.primaryColor : '#fff'}
              ios_backgroundColor="#81b0ff"
              onValueChange={() => {
                if (!this.switchToggle() && updatePermission)
                  setComissionApplicable(!commissionNotApplicableBuyer, tileType)
              }}
              value={commissionNotApplicableBuyer ? false : true}
              style={styles.switchView}
            />
          )}
          {showSwitch && leadType === 'rcm' && tileType === 'seller' && (
            <Switch
              disabled={commissionNotApplicableBuyer}
              trackColor={{ false: '#81b0ff', true: AppStyles.colors.primaryColor }}
              thumbColor={false ? AppStyles.colors.primaryColor : '#fff'}
              ios_backgroundColor="#81b0ff"
              onValueChange={() => {
                if (!this.switchToggle() && updatePermission)
                  setComissionApplicable(!commissionNotApplicableSeller, tileType)
              }}
              value={commissionNotApplicableSeller ? false : true}
              style={styles.switchView}
            />
          )}
        </View>
        {!commissionNotApplicableBuyer && tileType === 'buyer' ? (
          <View>
            <RCMBTN
              onClick={() => closeLegalDocument(tileType)}
              btnImage={null}
              btnText={'LEGAL SERVICES'}
              checkLeadClosedOrNot={false}
              hiddenBtn={tileType === 'seller' ? commissionSeller : commissionBuyer}
              addBorder={true}
            />
            {lead.commissions ? (
              payment ? (
                <CommissionTile
                  data={payment}
                  editTile={editTile}
                  onPaymentLongPress={() => {
                    if (updatePermission && closedLeadEdit) onPaymentLongPress(payment)
                  }}
                  commissionEdit={onReadOnly}
                  title={payment ? commissionTitle : ''}
                  call={call}
                  showAccountPhone={true}
                  updatePermission={updatePermission}
                  closedLeadEdit={closedLeadEdit}
                  disabledCall= {tileType === 'seller' ? commissionSeller : commissionBuyer}
                />
              ) : (
                <View style={{ paddingTop: 10 }}>
                  <RCMBTN
                    onClick={() => {
                      if (closedLeadEdit)
                        onAddCommissionPayment(tileType, 'commission')
                    }}
                    btnImage={RoundPlus}
                    btnText={RCMBTNTitle}
                    checkLeadClosedOrNot={false}
                    hiddenBtn={tileType === 'seller' ? commissionSeller : commissionBuyer}
                    addBorder={true}
                  />
                </View>
              )
            ) : null}
          </View>
        ) : null}
        {!commissionNotApplicableSeller && tileType === 'seller' ? (
          <View>
            <RCMBTN
              onClick={() => closeLegalDocument(tileType)}
              btnImage={null}
              btnText={'LEGAL SERVICES'}
              checkLeadClosedOrNot={false}
              hiddenBtn={tileType === 'seller' ? commissionSeller : commissionBuyer}
              addBorder={true}
            />
            {lead.commissions ? (
              payment ? (
                <CommissionTile
                  data={payment}
                  editTile={editTile}
                  onPaymentLongPress={() => {
                    if (updatePermission && closedLeadEdit) onPaymentLongPress(payment)
                  }}
                  commissionEdit={onReadOnly}
                  title={payment ? commissionTitle : ''}
                  call={call}
                  showAccountPhone={true}
                  updatePermission={updatePermission}
                  closedLeadEdit={closedLeadEdit}
                  disabledCall= {tileType === 'seller' ? commissionSeller : commissionBuyer}

                />
              ) : (
                <View style={{ paddingTop: 10 }}>
                  <RCMBTN
                    onClick={() => {
                      if (closedLeadEdit)
                        onAddCommissionPayment(tileType, 'commission')
                    }}
                    btnImage={RoundPlus}
                    btnText={RCMBTNTitle}
                    checkLeadClosedOrNot={false}
                    hiddenBtn={tileType === 'seller' ? commissionSeller : commissionBuyer}
                    addBorder={true}
                  />
                </View>
              )
            ) : null}
          </View>
        ) : null}
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(BuyerSellerTile)
