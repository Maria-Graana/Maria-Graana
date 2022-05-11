/** @format */

import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Button } from 'native-base'
import styles from './style'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal'
import times from '../../../assets/img/times.png'
import PaymentMethods from '../../PaymentMethods'
import ViewDocs from '../ViewDocs'
import * as MediaLibrary from 'expo-media-library'
import * as FileSystem from 'expo-file-system'

class UnitDetailsModal extends React.Component {
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
    const { status } = await MediaLibrary.requestPermissionsAsync()
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
    const { active, openUnitDetailsModal, data, pearlModal, formData, pearlUnitPrice, lead } =
      this.props
    const { noProducts } = lead
    var optionalArray = data && data.optional_fields != null && data.optional_fields
    const { imageUrl, showWebView } = this.state
    var optional = []
    optional = data && data != '' && JSON.parse([optionalArray])
    var optionalObjectKey = Object.keys(optional)
    //console.log(data)
    return (
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
        {pearlModal === false && data && data != '' && (
          <View style={[styles.modalMain]}>
            <TouchableOpacity
              style={styles.timesBtn}
              onPress={() => {
                openUnitDetailsModal(null, false)
              }}
            >
              <Image source={times} style={styles.timesImg} />
            </TouchableOpacity>

            <ScrollView style={{ marginVertical: 10 }}>
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Unit ID</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.id)}</Text>
                </View>
              </View>
              {/* ===================== */}
              {/* {optionalObjectKey &&
                optionalObjectKey.length &&
                optionalObjectKey.map((item, index) => {
                  return (
                    <View style={styles.MainTileView}>
                      <View>
                        <Text style={styles.smallText}>{optional[item].fieldName}</Text>
                        <Text style={styles.largeText}>{optional[item].data}</Text>
                      </View>
                    </View>
                  )
                })} */}

              <View style={styles.MainTileView}>
                <View style={styles.row}>
                  <View>
                    <Text style={styles.smallText}>Unit Name</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.name)}</Text>
                  </View>
                  {data.projectInventoryImage && (
                    <TouchableOpacity
                      onLongPress={() => this.downloadImage(data.projectInventoryImage)}
                      onPress={() => {
                        this.setState({
                          imageUrl: data.projectInventoryImage.url,
                          showWebView: true,
                        })
                      }}
                    >
                      <Image
                        source={{ uri: data.projectInventoryImage.url }}
                        style={{ width: 70, height: 70 }}
                        borderRadius={5}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* ===================== */}
              {optional && optional[1] && (
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>{optional[1].fieldName}</Text>
                    <Text style={styles.largeText}>{optional[1].data}</Text>
                  </View>
                </View>
              )}

              {/* ===================== */}
              {optional && optional[2] && (
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Custom Field 3</Text>
                    <Text style={styles.largeText}>{optional[2].data}</Text>
                  </View>
                </View>
              )}

              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Size (sqft)</Text>
                  <Text style={styles.largeText}>{this.handleEmptyValue(data.area)}</Text>
                </View>
              </View>
              {/* ===================== */}
              {data.category_charges !== null && (
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Standard Rate / sqft</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.pricePerSqFt)}</Text>
                  </View>
                </View>
              )}
              {data.category_charges !== null && (
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Category Charges</Text>
                    <Text style={styles.largeText}>
                      {this.handleEmptyValue(data.category_charges + '%')}
                    </Text>
                  </View>
                </View>
              )}
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Rate/Sqft</Text>
                  <Text style={styles.largeText}>{PaymentMethods.findRatePerSqft(data)}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Unit Price</Text>
                  <Text style={styles.largeText}>{PaymentMethods.findUnitPrice(data)}</Text>
                </View>
              </View>
              {/* ===================== */}
              {data.rentPerSqFt !== null && noProducts && (
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Discount</Text>
                    <Text style={styles.largeText}>
                      {this.handleEmptyValue(formData.approvedDiscount) === ''
                        ? '0'
                        : this.handleEmptyValue(formData.approvedDiscount)}
                      %
                    </Text>
                  </View>
                </View>
              )}
              {data.rentPerSqFt !== null && noProducts && (
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Discount Amount</Text>
                    <Text style={styles.largeText}>{formData.approvedDiscountPrice}</Text>
                  </View>
                </View>
              )}
              {data.rentPerSqFt !== null && noProducts && (
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Discounted Price</Text>
                    <Text style={styles.largeText}>
                      {this.handleEmptyValueReturnZero(formData.finalPrice)}
                    </Text>
                  </View>
                </View>
              )}
              {data.rentPerSqFt !== null && noProducts && (
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Rent/Sqft</Text>
                    <Text style={styles.largeText}>
                      {this.handleEmptyValueReturnZero(data.rentPerSqFt)}
                    </Text>
                  </View>
                </View>
              )}
              {/* ===================== */}
              {data.rentPerSqFt !== null && noProducts && (
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Rent Amount</Text>
                    <Text style={styles.largeText}>
                      {this.handleEmptyValueReturnZero(data.rent)}
                    </Text>
                  </View>
                </View>
              )}

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
        )}
        {pearlModal === true && data && data != '' && (
          <View style={[styles.modalMain]}>
            <TouchableOpacity
              style={styles.timesBtn}
              onPress={() => {
                openUnitDetailsModal(null, false)
              }}
            >
              <Image source={times} style={styles.timesImg} />
            </TouchableOpacity>
            <ScrollView>
              {/* ===================== */}
              {data && data.project && (
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Project</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.project.name)}</Text>
                  </View>
                </View>
              )}

              {/* ===================== */}
              {data && data.name && (
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Floor</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.name)}</Text>
                  </View>
                </View>
              )}

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
                  <Text style={styles.largeText}>{PaymentMethods.findRatePerSqft(data)}</Text>
                </View>
              </View>
              {/* ===================== */}
              <View style={styles.MainTileView}>
                <View>
                  <Text style={styles.smallText}>Unit Price</Text>
                  <Text style={styles.largeText}>{pearlUnitPrice}</Text>
                </View>
              </View>

              {/* ===================== */}
              {noProducts && (
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Discount</Text>
                    <Text style={styles.largeText}>
                      {this.handleEmptyValue(formData.approvedDiscount) === ''
                        ? '0'
                        : this.handleEmptyValue(formData.approvedDiscount)}
                      %
                    </Text>
                  </View>
                </View>
              )}

              {/* ===================== */}
              {noProducts && (
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Discount Amount</Text>
                    <Text style={styles.largeText}>{formData.approvedDiscountPrice}</Text>
                  </View>
                </View>
              )}

              {/* ===================== */}
              {data.rentPerSqFt !== null && (
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Final Amount</Text>
                    <Text style={styles.largeText}>
                      {this.handleEmptyValueReturnZero(formData.finalPrice)}
                    </Text>
                  </View>
                </View>
              )}

              {/* ===================== */}
              {data.rentPerSqFt !== null && noProducts && (
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Rent/Sqft</Text>
                    <Text style={styles.largeText}>{this.handleEmptyValue(data.rentPerSqFt)}</Text>
                  </View>
                </View>
              )}
              {/* ===================== */}
              {data.rentPerSqFt !== null && noProducts && (
                <View style={styles.MainTileView}>
                  <View>
                    <Text style={styles.smallText}>Rent Amount</Text>
                    <Text style={styles.largeText}>
                      {PaymentMethods.findRentAmount(data, formData.pearl)}
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </Modal>
    )
  }
}

export default UnitDetailsModal
