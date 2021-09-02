/** @format */

import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import styles from './style'
import Modal from 'react-native-modal'
import times from '../../../assets/img/times.png'
import PaymentMethods from '../../PaymentMethods'
import helper from '../../helper'
import ViewDocs from '../ViewDocs'
import * as MediaLibrary from 'expo-media-library'
import * as Permissions from 'expo-permissions'
import * as FileSystem from 'expo-file-system'

class BookingDetailsModal extends React.Component {
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

  downloadImage = async (image) => {
    let fileUri = FileSystem.documentDirectory + image.fileName
    FileSystem.downloadAsync(image.url, fileUri)
      .then(({ uri }) => {
        FileSystem.getInfoAsync(fileUri).then((res) => {
          this.saveFile(res.uri)
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  saveFile = async (fileUri) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (status === 'granted') {
      const asset = await MediaLibrary.createAssetAsync(fileUri)
      MediaLibrary.createAlbumAsync('ARMS', asset, false).then((res) => {
        FileSystem.getContentUriAsync(fileUri).then((cUri) => {
          {
            this.setState({
              showWebView: true,
              imageUrl: cUri,
            })
          }
        })
      })
    }
  }

  render() {
    let { active, data, pearlModal, finalPrice, lead } = this.props
    if (!data.unit) active = false
    const { unit } = data
    const { imageUrl, showWebView } = this.state
    let product = lead && lead.projectProduct && lead.projectProduct
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Modal isVisible={active}>
          {showWebView ? (
            <ViewDocs
              imageView={true}
              isVisible={showWebView}
              closeModal={() => {
                this.setState({ imageUrl: null, showWebView: false })
              }}
              url={imageUrl}
            />
          ) : null}
          {pearlModal === false && data && data.unit != null && (
            <View style={[styles.modalMain]}>
              <TouchableOpacity
                style={styles.timesBtn}
                onPress={() => {
                  this.props.toggleBookingDetailsModal(false)
                }}
              >
                <Image source={times} style={styles.timesImg} />
              </TouchableOpacity>
              <ScrollView>
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Project</Text>
                    <Text style={styles.largeText}>
                      {this.handleEmptyValue(data.project && data.project.name)}
                    </Text>
                  </View>
                </View>
                {product ? (
                  <View style={styles.MainTileView}>
                    <View>
                      <Text style={styles.smallText}>Investment product</Text>
                      <Text style={styles.largeText}>
                        {this.handleEmptyValue(product && product.name)}
                      </Text>
                    </View>
                  </View>
                ) : null}
                {/* ===================== */}
                <View style={styles.MainTileView}>
                  <View style={styles.row}>
                    <View>
                      <Text style={styles.smallText}>Unit Name</Text>
                      <Text style={styles.largeText}>
                        {this.handleEmptyValue(data.unit && data.unit.name)}
                      </Text>
                    </View>
                    {data.unit.projectInventoryImage && (
                      <TouchableOpacity
                        onLongPress={() => this.downloadImage(data.unit.projectInventoryImage)}
                        onPress={() => {
                          this.setState({
                            imageUrl: data.unit.projectInventoryImage.url,
                            showWebView: true,
                          })
                        }}
                      >
                        <Image
                          source={{ uri: data.unit.projectInventoryImage.url }}
                          style={{ width: 70, height: 70 }}
                          borderRadius={5}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {/* ===================== */}
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Floor</Text>
                    <Text style={styles.largeText}>
                      {this.handleEmptyValue(data.floor && data.floor.name)}
                    </Text>
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
                {data.category_charges !== null && (
                  <View style={styles.MainTileView}>
                    <View>
                      <Text style={styles.smallText}>Standard Rate / sqft</Text>
                      <Text style={styles.largeText}>
                        {helper.currencyConvert(this.handleEmptyValue(data.unit.pricePerSqFt))}
                      </Text>
                    </View>
                  </View>
                )}
                {data.category_charges !== null && (
                  <View style={styles.MainTileView}>
                    <View>
                      <Text style={styles.smallText}>Category Charges</Text>
                      <Text style={styles.largeText}>
                        {data.unit.category_charges != null
                          ? this.handleEmptyValue(data.unit.category_charges + '%')
                          : '0%'}
                      </Text>
                    </View>
                  </View>
                )}
                {/* ===================== */}
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Rate/Sqft</Text>
                    <Text style={styles.largeText}>
                      {helper.currencyConvert(PaymentMethods.findRatePerSqft(unit))}
                    </Text>
                  </View>
                </View>
                {/* ===================== */}
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Unit Price</Text>
                    <Text style={styles.largeText}>
                      {helper.currencyConvert(PaymentMethods.findUnitPrice(unit))}
                    </Text>
                  </View>
                </View>
                {/* ===================== */}
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Discount</Text>
                    <Text style={styles.largeText}>
                      {this.handleEmptyValue(data.unit.discount) +
                        `${data.unit.discount > 0 ? '%' : '0%'}`}
                    </Text>
                  </View>
                </View>
                {/* ===================== */}
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Discount Amount</Text>
                    <Text style={styles.largeText}>
                      {helper.currencyConvert(
                        PaymentMethods.findApprovedDiscountAmount(unit, unit.discount)
                      )}
                    </Text>
                  </View>
                </View>
                {/* ===================== */}
                {data.installmentDue === 'Sold on Investment Plan' ||
                  (product && (
                    <View style={styles.MainTileView}>
                      <View>
                        <Text style={styles.smallText}>Final Price</Text>
                        <Text style={styles.largeText}>
                          {helper.currencyConvert(this.handleEmptyValueReturnZero(finalPrice))}
                        </Text>
                      </View>
                    </View>
                  ))}
                {/* ===================== */}
                {data &&
                  data.unit &&
                  data.unit.rentPerSqFt !== null &&
                  data.installmentDue === 'Sold on Rental Plan' && (
                    <View style={styles.MainTileView}>
                      <View>
                        <Text style={styles.smallText}>Rent/Sqft</Text>
                        <Text style={styles.largeText}>
                          {this.handleEmptyValueReturnZero(
                            data && data.unit && data.unit.rentPerSqFt
                          )}
                        </Text>
                      </View>
                    </View>
                  )}
                {/* ===================== */}
                {data.rentPerSqFt !== null && data.installmentDue === 'Sold on Rental Plan' && (
                  <View style={styles.MainTileView}>
                    <View>
                      <Text style={styles.smallText}>Rent Amount</Text>
                      <Text style={styles.largeText}>
                        {helper.currencyConvert(this.handleEmptyValueReturnZero(data.unit.rent))}
                      </Text>
                    </View>
                  </View>
                )}
                {/* ===================== */}
                {data.installmentDue === 'Sold on Installments Plan' ||
                data.installmentDue === 'Sold on Monthly Installments Plan' ? (
                  <View style={styles.MainTileView}>
                    <View>
                      <Text style={styles.smallText}>Down Payment</Text>
                      <Text style={styles.largeText}>
                        {helper.currencyConvert(
                          this.handleEmptyValueReturnZero(data.unit && data.unit.down_payment)
                        )}
                      </Text>
                    </View>
                  </View>
                ) : null}
                {/* ===================== */}
                {data.installmentDue === 'Sold on Monthly Installments Plan' ? (
                  <View style={styles.MainTileView}>
                    <View>
                      <Text style={styles.smallText}>Monthly Installment</Text>
                      <Text style={styles.largeText}>
                        {this.handleEmptyValueReturnZero(
                          data.unit && data.unit.monthly_installments
                        )}
                      </Text>
                    </View>
                  </View>
                ) : (
                  data.installmentDue === 'Sold on Installments Plan' && (
                    <View style={styles.MainTileView}>
                      <View>
                        <Text style={styles.smallText}>Quarterly Installment</Text>
                        <Text style={styles.largeText}>
                          {this.handleEmptyValueReturnZero(
                            data.unit && data.unit.quarterly_installments
                          )}
                        </Text>
                      </View>
                    </View>
                  )
                )}
                {/* ===================== */}
                {data.installmentDue === 'Sold on Installments Plan' && (
                  <View style={styles.MainTileView}>
                    <View>
                      <Text style={styles.smallText}>Possession Charges</Text>
                      <Text style={styles.largeText}>
                        {this.handleEmptyValue(
                          data.project &&
                            data.project.possession_charges +
                              `${data.project.possession_charges > 0 ? '%' : '0%'}`
                        )}
                      </Text>
                    </View>
                  </View>
                )}
                {/* ===================== */}
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Status</Text>
                    <Text style={styles.largeText}>
                      {this.handleEmptyValue(data.unit.bookingStatus)}
                    </Text>
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
          )}
          {pearlModal === true && data && data != '' && (
            <View style={[styles.modalMain]}>
              <TouchableOpacity
                style={styles.timesBtn}
                onPress={() => {
                  this.props.toggleBookingDetailsModal(false)
                }}
              >
                <Image source={times} style={styles.timesImg} />
              </TouchableOpacity>
              <ScrollView>
                <View style={styles.MainTileView}>
                  {/* ===================== */}
                  <View>
                    <Text style={styles.smallText}>Project</Text>
                    <Text style={styles.largeText}>
                      {this.handleEmptyValue(data.project && data.project.name)}
                    </Text>
                  </View>
                </View>

                {/* ===================== */}
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Floor</Text>
                    <Text style={styles.largeText}>
                      {this.handleEmptyValue(data.floor && data.floor.name)}
                    </Text>
                  </View>
                </View>

                {/* ===================== */}
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Pearl Name</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(unit && unit.name)}</Text>
                  </View>
                </View>

                {/* ===================== */}
                {data && data.unit && data.unit.discount ? (
                  <View style={styles.MainTileView}>
                    <View>
                      <Text style={styles.smallText}>Discount</Text>
                      <Text style={styles.largeText}>
                        {this.handleEmptyValue(data.unit.discount) +
                          `${data.unit.discount > 0 ? '%' : '0%'}`}
                      </Text>
                    </View>
                  </View>
                ) : null}

                {/* ===================== */}
                {data && data.unit && unit.discounted_price ? (
                  <View style={styles.MainTileView}>
                    <View>
                      <Text style={styles.smallText}>Discount Amount</Text>
                      <Text style={styles.largeText}>
                        {helper.currencyConvert(
                          PaymentMethods.findApprovedDiscountAmount(unit, unit.discount)
                        )}
                      </Text>
                    </View>
                  </View>
                ) : null}

                {/* ===================== */}
                {data && data.unit && unit.discounted_price ? (
                  <View style={styles.MainTileView}>
                    <View>
                      <Text style={styles.smallText}>Final Price</Text>
                      <Text style={styles.largeText}>
                        {helper.currencyConvert(this.handleEmptyValueReturnZero(unit.finalPrice))}
                      </Text>
                    </View>
                  </View>
                ) : null}

                {data && data.unit && data.unit.area ? (
                  <View style={styles.MainTileView}>
                    <View>
                      <Text style={styles.smallText}>Size</Text>
                      <Text style={styles.largeText}>
                        {this.handleEmptyValue(unit && unit.area)}
                      </Text>
                    </View>
                  </View>
                ) : null}

                {/* ===================== */}
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Rate/Sqft</Text>
                    <Text style={styles.largeText}>
                      {unit && helper.currencyConvert(PaymentMethods.findRatePerSqft(unit))}
                    </Text>
                  </View>
                </View>
                {/* ===================== */}
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Unit Price</Text>
                    <Text style={styles.largeText}>
                      {data && helper.currencyConvert(PaymentMethods.findPearlUnitPrice(data))}
                    </Text>
                  </View>
                </View>
                {/* ===================== */}
                {data.rentPerSqFt !== null && (
                  <View style={styles.MainTileView}>
                    <View>
                      <Text style={styles.smallText}>Rent/Sqft</Text>
                      <Text style={styles.largeText}>
                        {helper.currencyConvert(this.handleEmptyValue(unit && unit.rentPerSqFt))}
                      </Text>
                    </View>
                  </View>
                )}
                {/* ===================== */}
                {data.rentPerSqFt !== null && (
                  <View style={styles.MainTileView}>
                    <View>
                      <Text style={styles.smallText}>Rent Amount</Text>
                      <Text style={styles.largeText}>
                        {helper.currencyConvert(
                          this.handleEmptyValue(unit && unit.rentPerSqFt) *
                            this.handleEmptyValue(unit && unit.area)
                        )}
                      </Text>
                    </View>
                  </View>
                )}

                {/* ===================== */}
                {data && data.unit && data.unit.bookingStatus ? (
                  <View style={styles.MainTileView}>
                    <View>
                      <Text style={styles.smallText}>Status</Text>
                      <Text style={styles.largeText}>
                        {this.handleEmptyValue(unit.bookingStatus)}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </ScrollView>
            </View>
          )}
        </Modal>
      </SafeAreaView>
    )
  }
}

mapStateToProps = (store) => {
  return {
    lead: store.lead.lead,
  }
}

export default connect(mapStateToProps)(BookingDetailsModal)
