/** @format */

import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { formatPrice } from '../../PriceFormate'
import StaticData from '../../StaticData'
import { Menu } from 'react-native-paper'
import moment from 'moment'
import helper from '../../helper'
import { includes } from 'underscore'

class TokenTile extends Component {
  currencyConvert = (x) => {
    x = x.toString()
    var lastThree = x.substring(x.length - 3)
    var otherNumbers = x.substring(0, x.length - 3)
    if (otherNumbers != '') lastThree = ',' + lastThree
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
    return res
  }
  MenuItems = () => {
    const { data } = this.props
    let menuList = helper.selectBuyerTokenMenu(data)
    {
      menuList && menuList.length
        ? menuList.map((item) => {
            return <Menu.Item onPress={() => {}} title={item.label} />
          })
        : null
    }
  }

  findStatusLabel = () => {
    const { data } = this.props
    let showStatus = { label: '', value: '' }
    if (data && data.status != '') {
      StaticData.tokenStatusOptions.map((item) => {
        if (item.value === data.status) {
          showStatus.label = item.label
          showStatus.value = item.value
        }
      })
      if (showStatus) {
        if (StaticData.paymentStatuses.includes(showStatus.value)) {
          showStatus.label = `At Account${'\n'}(${showStatus.label})`
          return showStatus
        } else {
          return showStatus
        }
      }
    }
    return showStatus
  }

  findStatusColor = (showStatus) => {
    const { showMenu } = this.props
    let statusColor = styles.statusGreen
    if (showMenu) statusColor = styles.statusYellow
    if (showStatus && showStatus.value === 'pendingSales') statusColor = styles.statusYellow
    if (showStatus && showStatus.value === 'notCleared') statusColor = styles.statusRed
    if (showStatus && showStatus.value === 'rejected') statusColor = styles.statusRed
    if (showStatus && showStatus.value === 'given_back_to_buyer') statusColor = styles.statusRed
    if (showStatus && showStatus.value === 'given_to_property_owner')
      statusColor = styles.statusGreen
    return statusColor
  }

  render() {
    const {
      editTile,
      title,
      commissionEdit = false,
      onPaymentLongPress,
      toggleTokenMenu,
      tokenMenu,
      showMenu,
      data,
      confirmTokenAction,
      singleCommission = false,
      onSubmitNewToken,
      isLeadClosed,
      updatePermission,
      closedLeadEdit,
    } = this.props
    let showStatus = { label: '', value: '' }
    showStatus = this.findStatusLabel()
    var statusColor = this.findStatusColor(showStatus)
    let menuList = helper.selectBuyerTokenMenu(data)
    if (singleCommission) menuList = helper.selectSingleBuyerTokenMenu(data)
    // showStatus = this.findAccountsStatus(showStatus)
    return data ? (
      <TouchableOpacity
        onLongPress={() => {
          data.status === 'at_buyer_agent' ? onPaymentLongPress(data) : null
        }}
        disabled={commissionEdit || isLeadClosed}
        style={{ zIndex: 10, flex: 1 }}
        onPress={() => {
          if (updatePermission && closedLeadEdit) {
            data.status === 'at_buyer_agent' ||
            data.status === 'pendingSales' ||
            data.status === 'notCleared'
              ? editTile(data)
              : null
          }
        }}
      >
        <View
          style={[
            styles.tileTopWrap,
            { backgroundColor: commissionEdit || isLeadClosed ? '#ddd' : '#fff' },
          ]}
        >
          <View style={styles.upperLayer}>
            <Text style={styles.paymnetHeading}>{title}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.tileStatus, statusColor]}>{showStatus.label}</Text>
              {showMenu && (
                <Menu
                  visible={tokenMenu}
                  onDismiss={() => toggleTokenMenu()}
                  anchor={
                    <Entypo
                      onPress={() => toggleTokenMenu()}
                      onDismiss={toggleTokenMenu}
                      name="dots-three-vertical"
                      size={20}
                    />
                  }
                >
                  <View>
                    {menuList && menuList.length
                      ? menuList.map((item) => {
                          return (
                            <Menu.Item
                              onPress={() => {
                                if (data.status === 'given_back_to_buyer')
                                  onSubmitNewToken('buyer', 'token')
                                else confirmTokenAction(data, item.value)
                              }}
                              title={item.label}
                            />
                          )
                        })
                      : null}
                  </View>
                </Menu>
              )}
            </View>
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
          </View>
        </View>
      </TouchableOpacity>
    ) : null
  }
}

export default TokenTile

const styles = StyleSheet.create({
  tileTopWrap: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 6,
    padding: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  upperLayer: {
    // position: 'relative',
    marginBottom: 5,
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymnetHeading: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tileStatus: {
    // position: 'absolute',
    // right: 0,
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
    width: '40%',
    color: '#0070f2',
    fontWeight: 'bold',
    fontSize: 20,
  },
  totalPrice: {
    width: '30%',
    color: '#0070f2',
    fontWeight: 'bold',
    paddingTop: 2,
    fontSize: 16,
  },
  priceDate: {
    width: '30%',
    color: '#1d1d27',
    fontSize: 12,
    textAlign: 'right',
    paddingTop: 4,
  },
})
