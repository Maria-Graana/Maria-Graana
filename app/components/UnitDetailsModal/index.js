import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Button, } from 'native-base';
import styles from './style'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal';
import times from '../../../assets/img/times.png'

class UnitDetailsModal extends React.Component {
  constructor(props) {
    super(props)
  }

  handleEmptyValue = (value) => {
    return value != null ? value : '-'
  }

  render() {
    const {
      active,
      openUnitDetailsModal,
      data,
    } = this.props
    const optional = data && data != '' && JSON.parse(data.project.optional_fields)
    return (

      <Modal isVisible={active}>
        {
          data && data != '' &&
          <View style={[styles.modalMain]}>
            <TouchableOpacity style={styles.timesBtn} onPress={() => { openUnitDetailsModal(false) }}>
              <Image source={times} style={styles.timesImg} />
            </TouchableOpacity>
            <ScrollView>
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Unit ID</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.id)}</Text>
                </View>
              </View>
              {/* ===================== */}
              {
                optional && optional.map((item, key) => {
                  return (
                    <View style={styles.MainTileView}>
                      <View>
                        <Text style={styles.smallText}>{item.fieldName}</Text>
                        <Text style={styles.largeText}>{item.fieldType && item.fieldType.label}</Text>
                      </View>
                    </View>
                  )
                })
              }

              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Size</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.area)}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Standard Rate</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.pricePerSqFt)}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Unit Price</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.unit_price)}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Rent/Sqft</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.rentPerSqFt)}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Rent Amount</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.rent)}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Status</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.bookingStatus)}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={[styles.MainTileView, styles.noBorder]}>
                <View>
                  <Text style={[styles.smallText]}>Remarks</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.remarks)}</Text>
                </View>
              </View>
              {/* ===================== */}
            </ScrollView>
          </View>
        }
      </Modal>
    )
  }
}

export default UnitDetailsModal;