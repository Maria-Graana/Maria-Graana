/** @format */

import React from 'react'
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Button } from 'native-base'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal'
import times from '../../../assets/img/times.png'
import styles from './style'
import { formatPrice } from '../../PriceFormate'
import { connect } from 'react-redux'
import Loader from '../loader'

class FirstScreenConfirmModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      active,
      firstFormConfirmModal,
      data,
      getAllProject,
      getAllFloors,
      allUnits,
      submitFirstScreen,
      firstScreenConfirmLoading,
      oneProductData,
      lead,
      selectedClient
    } = this.props
    var project =
      getAllProject &&
      getAllProject.find((item) => {
        return data.project === item.id && item
      })
    var floors =
      getAllFloors &&
      getAllFloors.find((item) => {
        return data.floor === item.id && item
      })
    var units =
      allUnits != '' &&
      allUnits.find((item) => {
        return data.unit === item.id && item
      })
    let productName =
      oneProductData && oneProductData.projectProduct && oneProductData.projectProduct.name
    return (
      <Modal isVisible={active}>
        <View style={[styles.modalMain]}>
          <TouchableOpacity
            style={styles.timesBtn}
            onPress={() => {
              firstFormConfirmModal(false)
            }}
          >
            <Image source={times} style={styles.timesImg} />
          </TouchableOpacity>
          <View style={styles.mainTextWrap}>
            <Text style={styles.topTextMain}>Are you sure you want to book?</Text>
            <Text style={styles.noramlText}>
              Project: <Text style={styles.mainTextLarge}>{project && project.name}</Text>
            </Text>
            <Text style={styles.noramlText}>
              Floor: <Text style={styles.mainTextLarge}>{floors && floors.name}</Text>
            </Text>

            <Text style={styles.noramlText}>
              Unit:{' '}
              {data.unitType === 'pearl' ? (
                <Text style={styles.mainTextLarge}>New Pearl</Text>
              ) : (
                <Text style={styles.mainTextLarge}>{units && units.name}</Text>
              )}
            </Text>
            <Text style={styles.noramlText}>
              Approved Discount:{' '}
              <Text style={styles.mainTextLarge}>
                {data.approvedDiscount ? data.approvedDiscount + '%' : 'N/A'}
              </Text>
            </Text>
            {lead.noProduct ? (
              <Text style={styles.noramlText}>
                Payment Plan: <Text style={styles.mainTextLarge}>{data.paymentPlan}</Text>
              </Text>
            ) : (
              <Text style={styles.noramlText}>
                Product Name: <Text style={styles.mainTextLarge}>{productName && productName}</Text>
              </Text>
            )}
            <Text style={styles.noramlText}>
              Final Price:{' '}
              <Text style={styles.mainTextLarge}>
                {formatPrice(data.finalPrice ? data.finalPrice : '')}
              </Text>
            </Text>
            {(selectedClient) ? <Text style={styles.noramlText}>
              Booking For: <Text style={styles.mainTextLarge}>{selectedClient && selectedClient.firstName} {selectedClient && selectedClient.lastName}</Text>
            </Text> : null}
          </View>
          <View style={styles.confirmBtnView}>
            <TouchableOpacity
              style={[styles.confirmBtn]}
              onPress={() => {
                firstScreenConfirmLoading != true && submitFirstScreen()
              }}
            >
              {firstScreenConfirmLoading === true ? (
                <Text style={styles.loaderStyle}>
                  <ActivityIndicator
                    style={styles.loaderHeight}
                    size="small"
                    color={AppStyles.colors.primaryColor}
                  />
                </Text>
              ) : (
                <Text style={[styles.textCenter, styles.activeBtn]}>BOOK</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={[styles.confirmBtn]}>
              <Text
                style={[styles.textCenter]}
                onPress={() => {
                  firstFormConfirmModal(false)
                }}
              >
                CANCEL
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
}

mapStateToProps = (store) => {
  return {
    lead: store.lead.lead,
  }
}

export default connect(mapStateToProps)(FirstScreenConfirmModal)
