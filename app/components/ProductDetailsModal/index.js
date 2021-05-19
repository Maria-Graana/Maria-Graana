/** @format */

import React from 'react'
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
} from 'react-native'
import Modal from 'react-native-modal'
import times from '../../../assets/img/times.png'
import helper from '../../helper'
import styles from './style'
import moment from 'moment-timezone'
import { formatPrice } from '../PriceFormate'

class ProductDetailsModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imageUrl: null,
      showWebView: false,
    }
  }

  handleEmptyValue = (value) => {
    return value != null && value != '' ? value : ''
  }

  handleEmptyValueReturnZero = (value) => {
    return value != null && value != '' ? value : 0
  }

  detailTile = (data) => {
    return (
      <View style={styles.MainTileView}>
        <View>
          <Text style={styles.smallText}>{data.title}</Text>
          <Text style={styles.largeText}>{data.value}</Text>
        </View>
      </View>
    )
  }

  setParseArrayValues = (values, delimeter, parseBol) => {
    if (values) {
      let newValues = values
      if (parseBol) newValues = JSON.parse(values)
      let newString = ''
      for (let i = 0; i < newValues.length; i++) {
        if (i === 0) {
          newString = newString + newValues[i]
        }
        if (i > 0) {
          newString =
            helper.capitalize(newString.toString()).replace(/_/g, ' ') +
            ` ${delimeter} ` +
            helper.capitalize(newValues[i].toString()).replace(/_/g, ' ')
        }
      }
      return newString
    }
  }

  setArrayValues = (values, delimeter) => {
    if (values) {
      let newValues = values
      let newString = ''
      for (let i = 0; i < newValues.length; i++) {
        if (i === 0) {
          newString = newString + newValues[i]
        }
        if (i > 0) {
          newString =
            helper.capitalize(newString.toString()) +
            ` ${delimeter} ` +
            helper.capitalize(newValues[i].toString())
        }
      }
      return newString
    }
  }

  render() {
    const { active, openProductDetailsModal, data } = this.props
    const { projectProduct } = data
    return (
      <Modal isVisible={active}>
        <SafeAreaView>
          <View style={styles.modalMain}>
            <TouchableOpacity
              style={styles.timesBtn}
              onPress={() => {
                openProductDetailsModal(null, false)
              }}
            >
              <Image source={times} style={styles.timesImg} />
            </TouchableOpacity>

            <ScrollView style={{ marginVertical: 10 }}>
              {this.detailTile({
                title: 'Product Name',
                value: helper.capitalize(projectProduct && projectProduct.name),
              })}
              {this.detailTile({
                title: 'Description',
                value: projectProduct && projectProduct.description,
              })}
              {this.detailTile({
                title: 'Valid Through',
                value: `${
                  projectProduct && moment(projectProduct.validFrom).format('YYYY-MM-DD')
                } - ${projectProduct && moment(projectProduct.validTo).format('YYYY-MM-DD')}`,
              })}
              {this.detailTile({
                title: 'Reservation Amount Option',
                value: helper.capitalize(projectProduct && projectProduct.reservationAmount),
              })}
              {/* {this.detailTile({
                title: 'Rayment Plan',
                value: this.setParseArrayValues(
                  projectProduct && projectProduct.paymentPlan,
                  '/',
                  true
                ),
              })} */}
              {this.detailTile({
                title: 'Down Payment',
                value: `${this.handleEmptyValueReturnZero(
                  projectProduct && projectProduct.downPayment
                )}%`,
              })}
              {this.detailTile({
                title: 'Possession Charges',
                value: `${this.handleEmptyValueReturnZero(
                  projectProduct && projectProduct.possessionCharges
                )}%`,
              })}
              {this.detailTile({
                title: 'Discount',
                value: `${this.handleEmptyValueReturnZero(
                  projectProduct && projectProduct.discount
                )}%`,
              })}
              {this.detailTile({
                title: 'Payment Plan Duration',
                value: this.setParseArrayValues(
                  projectProduct && projectProduct.paymentPlanDuration,
                  '/',
                  true
                ),
              })}
              {this.detailTile({
                title: 'Installment Frequency',
                value: this.setParseArrayValues(
                  projectProduct && projectProduct.installmentFrequency,
                  '-',
                  false
                ),
              })}
              {this.detailTile({
                title: 'Annual Profit',
                value: projectProduct && formatPrice(projectProduct.annualProfit),
              })}
              {this.detailTile({
                title: 'Monthly Rent',
                value: projectProduct && formatPrice(projectProduct.monthlyRent),
              })}
              {this.detailTile({
                title: 'Investment Duration',
                value: projectProduct && projectProduct.investmentDurationPeriod,
              })}
              {this.detailTile({
                title: 'Discount',
                value: projectProduct && formatPrice(projectProduct.discount),
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    )
  }
}

export default ProductDetailsModal
