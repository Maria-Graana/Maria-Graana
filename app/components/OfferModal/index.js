/** @format */

import moment from 'moment'
import React from 'react'
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import addImg from '../../../assets/img/add.png'
import checkImg from '../../../assets/img/check.png'
import AppStyles from '../../AppStyles'
import BackButton from '../../components/BackButton'
import ErrorMessage from '../../components/ErrorMessage'
import TouchableButton from '../../components/TouchableButton'
import Ability from '../../hoc/Ability'
import { formatNumericPrice } from '../PriceFormate'
import styles from './style'

class OfferModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      active,
      isVisible,
      handleForm,
      placeCustomerOffer,
      placeSellerOffer,
      placeAgreedOffer,
      offerChat,
      disableButton,
      leadData,
      property,
      lead,
      user,
      loading,
      agreedAmount,
      showWarning,
      customerNotZero,
      sellerNotZero,
      agreedNotZero,
      offerReadOnly,
      customerNotNumeric,
      sellerNotNumeric,
      agreedNotNumeric,
      showBuyerSide,
      showSellerSide,
    } = this.props
    let subRole =
      property &&
      property.armsuser &&
      property.armsuser.armsUserRole &&
      property.armsuser.armsUserRole.subRole

    return (
      <Modal
        visible={active}
        animationType="slide"
        onRequestClose={() => {
          this.props.openModal()
        }}
      >
        <SafeAreaView style={[AppStyles.mb1, { backgroundColor: '#e7ecf0' }]}>
          <View style={{ flexDirection: 'row-reverse', marginHorizontal: 10 }}>
            <View style={{ flex: 1 }} />
            <BackButton
              onClick={() => {
                this.props.openModal()
              }}
            />
          </View>

          {/* **************************************** */}
          <View style={[styles.mainTopHeader]}>
            {/* ******************Left Input */}
            {showBuyerSide && !offerReadOnly ? (
              <View style={styles.mainInputWrap}>
                <Text style={styles.offerColor}>Client's Offers</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    placeholderTextColor={'#a8a8aa'}
                    value={leadData.customer}
                    keyboardType={'numeric'}
                    style={[styles.formControl]}
                    placeholder={'Amount'}
                    onChangeText={(text) => {
                      handleForm(text, 'customer')
                    }}
                  />
                  <TouchableOpacity
                    disabled={disableButton}
                    onPress={placeCustomerOffer}
                    style={[styles.addBtnColorLeft, styles.sideBtnInput]}
                  >
                    <Image source={addImg} style={[styles.addImg]} />
                  </TouchableOpacity>
                </View>
                {customerNotNumeric ? (
                  <ErrorMessage errorMessage={'Enter Only digits 0 to 9'} />
                ) : null}
                {customerNotZero ? (
                  <ErrorMessage errorMessage={'Amount must be greater than 0'} />
                ) : null}
              </View>
            ) : (
              <View style={styles.mainInputWrap}>
                <Text style={styles.offerColor}>Client's Offers</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    editable={false}
                    selectTextOnFocus={false}
                    placeholderTextColor={'#a8a8aa'}
                    value={leadData.customer}
                    keyboardType={'numeric'}
                    style={[styles.formControl]}
                    placeholder={'Amount'}
                    onChangeText={(text) => {
                      handleForm(text, 'customer')
                    }}
                  />
                  <TouchableOpacity
                    disabled={true}
                    onPress={placeCustomerOffer}
                    style={[styles.sideBtnInput, styles.disabledBtnText]}
                  >
                    <Image source={addImg} style={[styles.addImg]} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {/* {!theirsCheck ? ( */}
            {showSellerSide && !offerReadOnly ? (
              <View style={styles.mainInputWrap}>
                <Text style={styles.offerColor}>Owner's Offers</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    placeholderTextColor={'#a8a8aa'}
                    value={leadData.seller}
                    keyboardType={'numeric'}
                    style={[styles.formControl]}
                    placeholder={'Amount'}
                    onChangeText={(text) => {
                      handleForm(text, 'seller')
                    }}
                  />
                  <TouchableOpacity
                    disabled={disableButton}
                    onPress={placeSellerOffer}
                    style={[styles.addBtnColorRight, styles.sideBtnInput]}
                  >
                    <Image source={addImg} style={[styles.addImg]} />
                  </TouchableOpacity>
                </View>
                {sellerNotNumeric ? (
                  <ErrorMessage errorMessage={'Enter Only digits 0 to 9'} />
                ) : null}
                {sellerNotZero ? (
                  <ErrorMessage errorMessage={'Amount must be greater than 0'} />
                ) : null}
              </View>
            ) : (
              <View style={styles.mainInputWrap}>
                <Text style={styles.offerColor}>Owner's Offers</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    editable={false}
                    selectTextOnFocus={false}
                    placeholderTextColor={'#a8a8aa'}
                    value={leadData.seller}
                    keyboardType={'numeric'}
                    style={[styles.formControl]}
                    placeholder={'Amount'}
                    onChangeText={(text) => {
                      handleForm(text, 'seller')
                    }}
                  />
                  <TouchableOpacity
                    disabled={true}
                    onPress={placeSellerOffer}
                    style={[styles.sideBtnInput, styles.disabledBtnText]}
                  >
                    <Image source={addImg} style={[styles.addImg]} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {/* ) : null} */}
            {/* ******************Right Input */}
          </View>

          {/* **************************************** */}
          <View style={[styles.chatContainer]}>
            <FlatList
              data={offerChat}
              ref={(ref) => (this._flatList = ref)}
              keyExtractor={(item, index) => {}}
              onContentSizeChange={(contentWidth, contentHeight) => {
                if (contentHeight > 0) {
                  this._flatList.scrollToEnd()
                }
              }}
              renderItem={(item, index) => (
                <View>
                  {item.item.from === 'customer' ? (
                    <View style={[styles.mainChatWrap]}>
                      <View style={[styles.caret, styles.caretRight]}></View>
                      <Text style={[styles.priceStyle, styles.priceBlue]}>
                        {formatNumericPrice(item.item.offer)}
                      </Text>
                      <Text style={[styles.dataTime]}>
                        {moment(item.item.createdAt).format('YYYY-MM-DD hh:mm a')}
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.alignRight]}>
                      <View style={[styles.mainChatWrap]}>
                        <View style={[styles.caret, styles.caretLeft]}></View>
                        <Text style={[styles.priceStyle, styles.priceBlack, styles.textRight]}>
                          {formatNumericPrice(item.item.offer)}
                        </Text>
                        <Text style={[styles.dataTime, styles.textRight]}>
                          {moment(item.item.createdAt).format('YYYY-MM-DD hh:mm a')}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            />
          </View>

          {/* **************************************** */}
          {showBuyerSide && showSellerSide ? (
            <View style={[{ marginHorizontal: 10, marginBottom: 20 }]}>
              <Text style={styles.offerColorLast}>AGREED AMOUNT</Text>
              <View style={styles.inputWrapLast}>
                <TextInput
                  placeholderTextColor={'#a8a8aa'}
                  keyboardType={'numeric'}
                  style={[styles.formControlLast]}
                  placeholder={'Amount'}
                  onChangeText={(text) => {
                    handleForm(text, 'agreed')
                  }}
                />
                <TouchableOpacity
                  disabled={disableButton || offerReadOnly}
                  onPress={placeAgreedOffer}
                  style={[styles.addBtnColorLeft, styles.sideBtnInputLast]}
                >
                  <Image source={checkImg} style={[styles.checkImg]} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
              <TouchableButton
                disabled={offerReadOnly}
                containerBackgroundColor={offerReadOnly ? '#999' : '#0f73ee'}
                containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
                label={'ACCEPT OFFER'}
                onPress={() => agreedAmount(showBuyerSide === true ? 'showCustomer' : 'showSeller')}
                loading={loading}
              />
            </View>
          )}
          {agreedNotNumeric ? <ErrorMessage errorMessage={'Enter Only digits 0 to 9'} /> : null}
          {agreedNotZero ? <ErrorMessage errorMessage={'Amount must be greater than 0'} /> : null}
          {showWarning ? (
            <View style={{ paddingHorizontal: 10 }}>
              <Text>Other agent has not made an offer yet</Text>
            </View>
          ) : null}
        </SafeAreaView>
      </Modal>
    )
  }
}

export default OfferModal
