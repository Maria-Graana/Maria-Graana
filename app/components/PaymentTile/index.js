/** @format */

import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import styles from './style'
import { connect } from 'react-redux'
import { formatPrice } from '../../PriceFormate'
import moment from 'moment'
import StaticData from '../../StaticData'
import PaymentMethods from '../../PaymentMethods'

class PaymentTile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menuShow: false,
    }
  }

  render() {
    const {
      currencyConvert,
      data,
      count,
      editTile,
      tileForToken,
      editTileForscreenOne,
      checkLeadClosedOrNot,
      onPaymentLongPress,
    } = this.props
    let price = data.installmentAmount
    var showStatus =
      data.status != ''
        ? StaticData.statusOptions.find((item) => {
            return item.value === data.status && item
          })
        : { label: '', value: '' }
    var statusColor =
      showStatus != null && showStatus.value === 'cleared'
        ? styles.statusGreen
        : showStatus.value === 'notCleared' || showStatus.value === 'pendingSales'
        ? styles.statusRed
        : styles.statusYellow
    console.log('PaymentTile taxIncluded')
    console.log('PaymentTile data.installmentAmount: ', data.installmentAmount)
    console.log('PaymentTile data.taxAmount: ', data.taxAmount)
    console.log(
      'PaymentTile data.installmentAmount: ',
      PaymentMethods.findTaxIncluded(data.installmentAmount, data.taxAmount)
    )
    if (data.taxIncluded) {
      price = PaymentMethods.findTaxIncluded(data.installmentAmount, data.taxAmount)
      price = data.installmentAmount - price
    }

    return (
      <TouchableOpacity
        onLongPress={
          data.status === 'pendingSales' ||
          data.status === 'notCleared' ||
          data.status === 'pendingAccount'
            ? onPaymentLongPress
            : null
        }
        onPress={() => {
          data.status !== 'cleared' &&
          data.status !== 'pendingAccountHq' &&
          data.status !== 'bankPending'
            ? tileForToken === true
              ? editTileForscreenOne()
              : checkLeadClosedOrNot === true
              ? editTile(data)
              : null
            : null
        }}
      >
        <View style={styles.tileTopWrap}>
          <View style={styles.upperLayer}>
            <Text style={styles.paymnetHeading}>
              {`${data.paymentCategory} ${data.paymentCategory != 'token' ? count : ''}`}{' '}
              <Text style={{ textTransform: 'capitalize' }}>({data.type && data.type})</Text>
            </Text>
            {data.status != '' && (
              <Text style={[styles.tileStatus, statusColor]}>{showStatus.label}</Text>
            )}
          </View>
          <View style={styles.bottomLayer}>
            <Text style={styles.formatPrice}>{currencyConvert(price != null ? price : '')}</Text>
            <Text style={styles.totalPrice}>{formatPrice(price)}</Text>
            <Text style={styles.priceDate}>
              {moment(data.createdAt).format('DD MMM YY - h:mm a')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    contacts: store.contacts.contacts,
  }
}

export default connect(mapStateToProps)(PaymentTile)
