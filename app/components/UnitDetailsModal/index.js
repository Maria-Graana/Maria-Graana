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
    var optionalArray = data && data.optional_fields != null && data.optional_fields
    var optional = []
    optional = data && data != '' && JSON.parse([optionalArray])

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
                optional && optional[0] &&
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Custom Field 1</Text>
                    <Text style={styles.largeText}>
                      {optional[0].data}
                    </Text>
                  </View>
                </View>
              }

              {/* ===================== */}
              {
                optional && optional[1] &&
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Custom Field 2</Text>
                    <Text style={styles.largeText}>
                      {optional[1].data}
                    </Text>
                  </View>
                </View>
              }

              {/* ===================== */}
              {
                optional && optional[2] &&
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Custom Field 3</Text>
                    <Text style={styles.largeText}>
                      {optional[2].data}
                    </Text>
                  </View>
                </View>
              }

              {
                // optional && optional.map((item, key) => {
                //   return (
                //     <View style={styles.MainTileView}>
                //       <View>
                //         <Text style={styles.smallText}>{item.fieldName}</Text>
                //         <Text style={styles.largeText}>
                //           {
                //             item.fieldType && item.fieldType.value === 'dropdown' &&
                //             item.value && item.value.map((items, index) => {
                //               return (
                //                 items.value + ', '
                //               )
                //             })
                //           }
                //         </Text>
                //       </View>
                //     </View>
                //   )
                // })
              }

              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Size</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.area)}</Text>
                </View>
              </View>
              {/* ===================== */}
              {
                data.category_charges !== null &&
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Standard Rate</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.pricePerSqFt)}</Text>
                  </View>
                </View>
              }
              {
                data.category_charges !== null &&
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Category Charges</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.category_charges + '%')}</Text>
                  </View>
                </View>
              }
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Rate/Sqft</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.rate_per_sqft)}</Text>
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
              {
                data.rentPerSqFt !== null &&
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Rent/Sqft</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.rentPerSqFt)}</Text>
                  </View>
                </View>
              }
              {/* ===================== */}
              {
                data.rentPerSqFt !== null &&
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Rent Amount</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.rent)}</Text>
                  </View>
                </View>
              }

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