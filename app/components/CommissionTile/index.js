/** @format */

import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Image } from 'react-native'
import { formatPrice } from '../../PriceFormate'
import StaticData from '../../StaticData'
import moment from 'moment'

class CommissionTile extends Component {
  currencyConvert = (x) => {
    x = x.toString()
    var lastThree = x.substring(x.length - 3)
    var otherNumbers = x.substring(0, x.length - 3)
    if (otherNumbers != '') lastThree = ',' + lastThree
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
    return res
  }
  render() {
    const {
      data,
      editTile,
      title,
      commissionEdit,
      onPaymentLongPress,
      showAccountPhone = false,
      call,
      updatePermission,
      closedLeadEdit,
      disabledCall,
    } = this.props
    var showStatus =
      data && data.status != ''
        ? StaticData.statusOptions.find((item) => {
            return item.value === data.status && item
          })
        : { label: '', value: '' }
    var statusColor =
      showStatus && showStatus.value === StaticData.leadClearedStatus
        ? styles.statusGreen
        : showStatus.value === 'notCleared' || showStatus.value === 'rejected'
        ? styles.statusRed
        : styles.statusYellow
    return data ? (
      <TouchableOpacity
        onLongPress={
          data.status === 'pendingSales' || data.status === 'notCleared' || data.status === 'open'
            ? onPaymentLongPress
            : null
        }
        disabled={disabledCall}
        onPress={() => {
          if (updatePermission && closedLeadEdit) {
            data.status !== StaticData.leadClearedStatus && data.status !== 'notCleared'
              ? editTile(data)
              : null
          }
        }}
      >
        <View style={[styles.tileTopWrap, { backgroundColor: disabledCall ? '#ddd' : '#fff' }]}>
          <View style={styles.upperLayer}>
            <Text style={styles.paymnetHeading}>{title}</Text>
            <Text style={[styles.tileStatus, statusColor]}>{showStatus.label}</Text>
          </View>
          <View style={styles.bottomLayer}>
            {data.installmentAmount ? (
              <Text style={styles.formatPrice}>{this.currencyConvert(data.installmentAmount)}</Text>
            ) : null}
            {data.installmentAmount ? (
              <Text style={styles.totalPrice}>{formatPrice(data.installmentAmount)}</Text>
            ) : null}
            {data.createdAt ? (
              <Text style={styles.priceDate}>
                {moment(data.createdAt).format('hh:mm A, MMM DD')}
              </Text>
            ) : null}
            {showAccountPhone && data.status !== 'open' ? (
              <TouchableHighlight
                onPress={() => {
                  call(data)
                }}
                style={[styles.phoneView]}
                underlayColor={AppStyles.colors.backgroundColor}
                disabled={disabledCall}
              >
                <Image
                  source={require('../../../assets/img/call.png')}
                  style={[styles.callImage, data.checkBox ? { tintColor: '#fff' } : null]}
                />
              </TouchableHighlight>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    ) : null
    // ) : (
    //   <TouchableOpacity disabled={true}>
    //     <View style={[styles.tileTopWrap, { backgroundColor: true ? '#ddd' : '#fff' }]}>
    //       <View style={styles.upperLayer}>
    //         <Text style={styles.paymnetHeading}></Text>
    //         <Text style={[styles.tileStatus]}></Text>
    //       </View>
    //       <View style={styles.bottomLayer}>
    //         <Text style={styles.formatPrice}></Text>
    //         <Text style={styles.totalPrice}></Text>
    //         <Text style={styles.priceDate}></Text>
    //       </View>
    //     </View>
    //   </TouchableOpacity>
    // )
  }
}

export default CommissionTile

const styles = StyleSheet.create({
  tileTopWrap: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 6,
    padding: 5,
    marginBottom: 5,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  upperLayer: {
    position: 'relative',
    marginBottom: 5,
    paddingTop: 5,
  },
  paymnetHeading: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tileStatus: {
    position: 'absolute',
    right: 0,
    fontSize: 10,
    paddingTop: 3,
    paddingBottom: 2,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    overflow: 'hidden',
  },
  statusRed: {
    borderColor: '#b38f8d',
    backgroundColor: '#ecc8c4',
    color: '#615643',
  },
  statusYellow: {
    borderColor: '#d1d0a1',
    backgroundColor: '#f9f4d5',
    color: '#615743',
  },
  statusGreen: {
    borderColor: '#c0ccb7',
    backgroundColor: '#ddf3d4',
    color: '#4c6143',
  },
  bottomLayer: {
    flexDirection: 'row',
    marginTop: 1,
  },
  formatPrice: {
    flex: 0.9,
    color: '#0070f2',
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 10,
  },
  totalPrice: {
    flex: 0.9,
    color: '#0070f2',
    fontWeight: 'bold',
    fontSize: 16,
    paddingTop: 12,
  },
  priceDate: {
    flex: 1,
    color: '#1d1d27',
    fontSize: 12,
    textAlign: 'right',
    paddingTop: 14,
  },
  phoneView: {
    borderRadius: 20,
    padding: 10,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
})
