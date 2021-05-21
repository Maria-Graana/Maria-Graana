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
      let duplicate = false
      for (let i = 0; i < newValues.length; i++) {
        if (i === 0) {
          newString = newString + newValues[i]
        }
        if (i > 0) {
          if (newString === newValues[i]) helper.capitalize(newString.toString()).replace(/_/g, ' ')
          else {
            newString =
              helper.capitalize(newString.toString()).replace(/_/g, ' ') +
              ` ${delimeter} ` +
              helper.capitalize(newValues[i].toString()).replace(/_/g, ' ')
          }
        }
      }
      return newString
    }
  }

  setRange = (values, delimeter, parseBol) => {
    if (values) {
      let newValues = values
      if (parseBol) newValues = JSON.parse(values)
      let newString = ''
      if (newValues.length === 2) {
        if (newValues[0] === newValues[1]) return [newValues[1]]
      }
      for (let i = 0; i < Number(newValues[newValues.length - 1]); i++) {
        if (i === 0) {
          let increment = Number(i) + 1
          newString = newString + increment.toString()
        }
        if (i > 0) {
          let increment = Number(i) + 1
          newString = newString + ` ${delimeter} ` + increment.toString()
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
                title: 'Discount',
                value: `${this.handleEmptyValueReturnZero(
                  projectProduct && projectProduct.discount
                )}%`,
              })}
              {this.detailTile({
                title: 'Reservation Amount Option',
                value: helper.capitalize(projectProduct && projectProduct.reservationAmount),
              })}
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
                title: 'Rayment Plan',
                value: `${helper.capitalize(projectProduct && projectProduct.paymentPlan)} (Years)`,
              })}
              {this.detailTile({
                title: 'Payment Plan Duration',
                value: this.setRange(
                  projectProduct && projectProduct.paymentPlanDuration,
                  '-',
                  true
                ),
              })}
              {this.detailTile({
                title: 'Installment Frequency',
                value: this.setParseArrayValues(
                  projectProduct && projectProduct.installmentFrequency,
                  '/',
                  false
                ),
              })}
              {this.detailTile({
                title: 'Annual Profit',
                value: projectProduct && formatPrice(projectProduct.annualProfit),
              })}
              {this.detailTile({
                title: 'Annual Rent',
                value: projectProduct && formatPrice(projectProduct.monthlyRent),
              })}
              {this.detailTile({
                title: 'Investment Duration',
                value: `${projectProduct && projectProduct.value} (Months)`,
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    )
  }
}

export default ProductDetailsModal
