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
    const { buyerSellerCounts = 0, tileType, lead } = this.props
    let legalCount =
      tileType === 'seller' ? buyerSellerCounts.selerCount : buyerSellerCounts.buyerCount
    if (helper.checkSwitchChange(lead, tileType, legalCount)) {
      return false
    } else {
      return true
    }
  }

  render() {
    const {
      isLeadClosed,
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
    } = this.props
    let onReadOnly = this.checkReadOnlyMode()
    let disabledSwitch = this.switchToggle()
    return (
      <View style={styles.tileView}>
        <View style={[styles.titleView, { paddingVertical: 0, paddingBottom: 10 }]}>
          <Text style={styles.titleText}>{tileTitle}</Text>
          {singleCommission && !payment && !isLeadClosed && (
            <Switch
              disabled={disabledSwitch}
              trackColor={{ false: '#81b0ff', true: AppStyles.colors.primaryColor }}
              thumbColor={false ? AppStyles.colors.primaryColor : '#fff'}
              ios_backgroundColor="#81b0ff"
              onValueChange={() => {
                if (!this.switchToggle())
                  setComissionApplicable(!commissionNotApplicableBuyerSeller)
              }}
              value={commissionNotApplicableBuyerSeller ? false : true}
              style={styles.switchView}
            />
          )}
        </View>
        {!commissionNotApplicableBuyerSeller || !singleCommission ? (
          <View>
            <RCMBTN
              onClick={() => closeLegalDocument(tileType)}
              btnImage={null}
              btnText={'LEGAL SERVICES'}
              checkLeadClosedOrNot={false}
              hiddenBtn={commissionNotApplicableBuyerSeller}
              addBorder={true}
            />
            {lead.commissions ? (
              payment ? (
                <CommissionTile
                  data={payment}
                  editTile={editTile}
                  onPaymentLongPress={() => onPaymentLongPress(payment)}
                  commissionEdit={onReadOnly}
                  title={payment ? commissionTitle : ''}
                />
              ) : (
                <View style={{ paddingTop: 10 }}>
                  {paymentCommission ? (
                    <RCMBTN
                      onClick={() => onAddCommissionPayment(tileType, 'commission')}
                      btnImage={RoundPlus}
                      btnText={RCMBTNTitle}
                      checkLeadClosedOrNot={false}
                      hiddenBtn={onReadOnly}
                      addBorder={true}
                    />
                  ) : null}
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
