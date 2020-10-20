import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Button, } from 'native-base';
import styles from './style'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal';
import times from '../../../assets/img/times.png'

class BookingDetailsModal extends React.Component {
  constructor(props) {
    super(props)
  }

  handleEmptyValue = (value) => {
    return value != null && value != '' ? value : ''
  }

  render() {
    const {
      active,
      openUnitDetailsModal,
      data,
      pearlModal,
      formData,
      unitPrice,
      toggleBookingDetailsModal,
    } = this.props
    return (
      <Modal isVisible={active}>
        {
          pearlModal === false && data && data.unit != null &&
          <View style={[styles.modalMain]}>
            <TouchableOpacity style={styles.timesBtn} onPress={() => { toggleBookingDetailsModal(false) }}>
              <Image source={times} style={styles.timesImg} />
            </TouchableOpacity>
            <ScrollView>
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Project</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.paidProject && data.paidProject.name)}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Floor</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.floor && data.floor.name)}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Unit Size (sqft)</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.unit.area)}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Rate/Sqft</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.unit.rate_per_sqft)}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Unit Price</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.unit.unit_price)}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Discount</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.unit.discount) + `${data.unit.discount > 0 ? '%': ''}`}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Discounted Price</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.unit.discounted_price)}</Text>
                </View>
              </View>
              {/* ===================== */}
              {
                data.installmentDue === 'Sold on Investment Plan' &&
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Full Payment Option Price</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.unit.full_payment_price)}</Text>
                  </View>
                </View>
              }
              {/* ===================== */}
              {
                data.category_charges !== null &&
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Standard Rate / sqft</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.unit.pricePerSqFt)}</Text>
                  </View>
                </View>
              }
              {
                data.category_charges !== null &&
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Category Charges</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.unit.category_charges + '%')}</Text>
                  </View>
                </View>
              }
              {/* ===================== */}
              {
                data.unit.rentPerSqFt !== null && data.installmentDue === 'Sold on Rental Plan' &&
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Rent/Sqft</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.unit.rentPerSqFt)}</Text>
                  </View>
                </View>
              }
              {/* ===================== */}
              {
                data.rentPerSqFt !== null && data.installmentDue === 'Sold on Rental Plan' &&
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Rent Amount</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.unit.rent)}</Text>
                  </View>
                </View>
              }
              {/* ===================== */}
              {
                data.installmentDue === 'Sold on Installments Plan' &&
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Down Payment</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.downPayment)}</Text>
                  </View>
                </View>
              }
              {/* ===================== */}
              {
                data.installmentDue === 'Sold on Monthly Installments Plan' && data.paidProject && data.paidProject.monthly_installment_availablity === 'yes' ?
                  <View style={styles.MainTileView}>
                    <View>
                      <Text style={styles.smallText}>Installment Plan</Text>
                      <Text style={styles.largeText}>{this.handleEmptyValue('Monthly installment')}</Text>
                    </View>
                  </View>
                  :
                  data.installmentDue === 'Sold on Quarterly Installments Plan' &&
                  <View style={styles.MainTileView}>
                    <View>
                      <Text style={styles.smallText}>Installment Plan</Text>
                      <Text style={styles.largeText}>{this.handleEmptyValue('Quarterly installment')}</Text>
                    </View>
                  </View>
              }
              {/* ===================== */}
              {
                data.installmentDue === 'Sold on Installments Plan' &&
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Possession Charges</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.paidProject && data.paidProject.possession_charges  + `${data.paidProject.possession_charges > 0 ? '%': ''}`)}</Text>
                  </View>
                </View>
              }
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Status</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.unit.bookingStatus)}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={[styles.MainTileView, styles.noBorder]}>
                <View>
                  <Text style={[styles.smallText]}>Remarks</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.unit.remarks)}</Text>
                </View>
              </View>
              {/* ===================== */}
            </ScrollView>
          </View>
        }
        {
          pearlModal === true && data && data != '' &&
          <View style={[styles.modalMain]}>
            <TouchableOpacity style={styles.timesBtn} onPress={() => { openUnitDetailsModal(null, false) }}>
              <Image source={times} style={styles.timesImg} />
            </TouchableOpacity>
            <ScrollView>
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Size</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(formData.pearl)}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Rate/Sqft</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.pricePerSqFt)}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Unit Price</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(unitPrice)}</Text>
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
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.rentPerSqFt * formData.pearl)}</Text>
                  </View>
                </View>
              }
            </ScrollView>
          </View>
        }
      </Modal>
    )
  }
}

export default BookingDetailsModal;