/** @format */

import React from 'react'
import { View, Text, Image, TouchableOpacity, TouchableHighlight } from 'react-native'
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
      tileForToken = false,
      editTileForscreenOne,
      checkLeadClosedOrNot,
      onPaymentLongPress,
      call,
    } = this.props
    let price = data.installmentAmount
    let taxIncludedAmount = 0
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
    if (data.taxIncluded) {
      taxIncludedAmount = PaymentMethods.findTaxIncluded(data.installmentAmount, data.taxAmount)
      price = data.installmentAmount - taxIncludedAmount
    }

    return (
      <TouchableOpacity
        onLongPress={
          data.status === 'pendingSales' || data.status === 'notCleared' || data.status === 'open'
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
              {`${data.paymentCategory}`}{' '}
              <Text style={{ textTransform: 'capitalize' }}>
                (
                {data.type && data.type === 'asset_adjustment'
                  ? data.type.replace('_', ' ')
                  : data.type && data.type}
                )
              </Text>
            </Text>
            {data.status != '' && (
              <Text style={[styles.tileStatus, statusColor]}>{showStatus.label}</Text>
            )}
          </View>
          {!data.taxIncluded && (
            <View style={styles.bottomLayer}>
              <Text style={styles.formatPrice}>{currencyConvert(price != null ? price : '')}</Text>
              <Text style={styles.totalPrice}>{formatPrice(price)}</Text>
              <Text style={styles.priceDate}>
                {moment(data.createdAt).format('DD MMM YY - h:mm a')}
              </Text>
              {data.status !== 'open' && data.status !== 'cleared' && tileForToken === false ? (
                <TouchableHighlight
                  onPress={() => {
                    call(data)
                  }}
                  style={[styles.phoneView]}
                  underlayColor={AppStyles.colors.backgroundColor}
                >
                  <Image
                    source={require('../../../assets/img/call.png')}
                    style={[styles.callImage, data.checkBox ? { tintColor: '#fff' } : null]}
                  />
                </TouchableHighlight>
              ) : null}
            </View>
          )}
          {data.taxIncluded && (
            <View>
              <View style={styles.bottomLayer}>
                <Text style={styles.formatPrice}>
                  {currencyConvert(price != null ? price : '')}
                </Text>
                <Text style={styles.totalPrice}>{formatPrice(price)}</Text>
              </View>
              <View style={{ paddingVertical: 5 }}>
                <Text style={styles.paymnetHeading}>
                  Tax
                  <Text style={{ textTransform: 'capitalize' }}> ({data.type && data.type})</Text>
                </Text>
              </View>
              <View style={styles.bottomLayer}>
                <Text style={styles.formatPrice}>
                  {currencyConvert(taxIncludedAmount != null ? taxIncludedAmount : '')}
                </Text>
                <Text style={styles.totalPrice}>{formatPrice(taxIncludedAmount)}</Text>
                <Text style={styles.priceDate}>
                  {moment(data.createdAt).format('DD MMM YY - h:mm a')}
                </Text>
                {data.status !== 'open' && tileForToken === false && data.status !== 'cleared' ? (
                  <TouchableHighlight
                    onPress={() => {
                      call(data)
                    }}
                    style={[styles.phoneView]}
                    underlayColor={AppStyles.colors.backgroundColor}
                  >
                    <Image
                      source={require('../../../assets/img/call.png')}
                      style={[styles.callImage, data.checkBox ? { tintColor: '#fff' } : null]}
                    />
                  </TouchableHighlight>
                ) : null}
              </View>
            </View>
          )}
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
