/** @format */

import React from 'react'
import styles from './style'
import { Text, View, Switch } from 'react-native'
import { connect } from 'react-redux'
import RCMBTN from '../RCMBTN'
import CommissionTile from '../CommissionTile'
import RoundPlus from '../../../assets/img/roundPlus.png'

class BuyerSellerTile extends React.Component {
  constructor(props) {
    super(props)
  }

  checkReadOnlyMode = () => {
    const { isLeadClosed, singleCommission, commissionNotApplicableBuyerSeller } = this.props
    console.log('isLeadClosed: ', isLeadClosed)
    console.log('singleCommission: ', singleCommission)
    console.log('commissionNotApplicableBuyerSeller: ', commissionNotApplicableBuyerSeller)
    if (isLeadClosed || singleCommission || commissionNotApplicableBuyerSeller) {
      return true
    } else return false
  }

  render() {
    const {
      setComissionApplicable,
      isLeadClosed,
      singleCommission,
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
    } = this.props
    let onReadOnly = this.checkReadOnlyMode()
    return (
      <View style={styles.tileView}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{tileTitle}</Text>
          {singleCommission && !payment && !isLeadClosed && (
            <Switch
              trackColor={{ false: '#81b0ff', true: AppStyles.colors.primaryColor }}
              thumbColor={false ? AppStyles.colors.primaryColor : '#fff'}
              ios_backgroundColor="#81b0ff"
              onValueChange={() => setComissionApplicable(!commissionNotApplicableBuyerSeller)}
              value={commissionNotApplicableBuyerSeller ? true : false}
              // value={false}
              style={styles.switchView}
            />
          )}
        </View>
        <RCMBTN
          onClick={() => closeLegalDocument(tileType)}
          btnImage={RoundPlus}
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
            <View>
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
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(BuyerSellerTile)
