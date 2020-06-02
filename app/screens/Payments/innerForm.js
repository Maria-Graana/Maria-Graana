import React, { Component } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity, Image } from 'react-native';
import axios from 'axios'
import styles from './style'
import PickerComponent from '../../components/Picker/index';
import AppStyles from '../../AppStyles'
import { Button } from 'native-base';
import { connect } from 'react-redux';
import * as RootNavigation from '../../navigation/RootNavigation';
import { formatPrice } from '../../PriceFormate'
import targetArrow from '../../../assets/img/targetArrow.png'
import moment from 'moment'

class InnerForm extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { checkValidation,
      handleForm,
      getProject,
      getFloor,
      getUnit,
      getInstallments,
      formData,
      totalInstalments,
      handleInstalments,
      formSubmit,
      readOnly,
      remainingPayment,
      downPaymentTime,
      instalments,
      submitValues,
      tokenDate,
      arrowCheck,
      paymentOptions,
      paymentDate,
      handlePayments,
      paymentFiledsArray,
      addFullpaymentFields,
      closedLeadEdit,
    } = this.props
    let rate = readOnly.rate && readOnly.rate.toString()
    let totalPrice = readOnly.totalPrice && readOnly.totalPrice.toString()
    let totalSize = readOnly.totalSize && readOnly.totalSize
    let remainingPay = remainingPayment && remainingPayment.toString()
    let no_installments = instalments.toString()

    return (
      <View style={[AppStyles.modalMain]}>
        <View style={[AppStyles.formMain]}>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getProject} name={'projectId'} placeholder='Project' selectedItem={formData.projectId} enabled={closedLeadEdit} />
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getFloor} name={'floorId'} placeholder='Floor' selectedItem={formData.floorId} enabled={closedLeadEdit}/>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getUnit} name={'unitId'} placeholder='Unit' selectedItem={formData.unitId} enabled={closedLeadEdit} />
            </View>
          </View>

          {/* **************************************** */}
          < View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>TOTAL SIZE</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'Total Size'} value={totalSize} editable={false} />
              </View>
            </View>
          </View>


          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>RATE</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'Rate'} value={formatPrice(rate)} editable={false} />
              </View>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>TOTAL PRICE</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'Total Price'} value={formatPrice(totalPrice)} editable={false} />
              </View>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.fullWidthPad, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>PROMOTIONAL OFFER </Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} value={formData.discount} placeholder={'Enter Promotional Offer Amount'} onChangeText={(text) => { handleForm(text, 'discount') }} keyboardType={'numeric'} editable={closedLeadEdit} />
                {
                  arrowCheck.discount === true &&
                  <TouchableOpacity style={[styles.checkBtnMain, styles.customArrowRight]} onPress={() => { submitValues('discount') }}>
                    <Image source={targetArrow} style={styles.arrowImg} />
                  </TouchableOpacity>
                }
                <Text style={[AppStyles.countPrice, styles.customTop, styles.customRight]}>{formatPrice(formData.discount != null ? formData.discount : '')}</Text>
              </View>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>TOKEN</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} value={formData.token} editable={closedLeadEdit} placeholder={'Enter Token Amount'} onChangeText={(text) => { handleForm(text, 'token') }} keyboardType={'numeric'} />
                <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(formData.token != null ? formData.token : '')}</Text>
              </View>
            </View>

            <View style={[AppStyles.blackInputdate]}>
              <Text style={AppStyles.dateText}>{tokenDate}</Text>
              {
                arrowCheck.token === true ?
                  <TouchableOpacity style={styles.checkBtnMain} onPress={() => { submitValues('token') }}>
                    <Image source={targetArrow} style={styles.arrowImg} />
                  </TouchableOpacity>
                  : null
              }
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>DOWN PAYMENT</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} value={formData.downPayment} editable={closedLeadEdit} placeholder={'Enter Down Payment'} onChangeText={(text) => { handleForm(text, 'downPayment') }} keyboardType={'numeric'} />
                <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(formData.downPayment != null ? formData.downPayment : '')}</Text>
              </View>
            </View>

            <View style={[AppStyles.blackInputdate]}>
              <Text style={AppStyles.dateText}>{downPaymentTime}</Text>
              {
                arrowCheck.downPayment === true &&
                <TouchableOpacity style={styles.checkBtnMain} onPress={() => { submitValues('downPayment') }}>
                  <Image source={targetArrow} style={styles.arrowImg} />
                </TouchableOpacity>
              }
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={paymentOptions} name={'paymentType'}  enabled={closedLeadEdit} placeholder='Select Payment Type' selectedItem={formData.paymentType} />
            </View>
          </View>

          {
            formData.paymentType === 'installments' ?
              <View>
                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                  <View style={[AppStyles.inputWrap]}>
                    <PickerComponent onValueChange={handleForm} data={getInstallments}  enabled={closedLeadEdit} name={'instalments'} placeholder='Installment Plan' selectedItem={no_installments} />
                  </View>
                </View>

                {/* **************************************** */}
                {
                  totalInstalments != '' && totalInstalments.map((item, key) => {
                    let amount = item.installmentAmount && item.installmentAmount.toString()
                    let installmentDate = totalInstalments[key].installmentAmountDate === '' ? item.installmentDate : totalInstalments[key].installmentAmountDate
                    return (
                      <View style={[AppStyles.mainBlackWrap]} key={key}>
                        <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
                          <Text style={[AppStyles.blackInputText]}>INSTALLMENT {key + 1}</Text>
                          <View style={[AppStyles.blackInput]}>
                            <TextInput style={[AppStyles.blackInput]} editable={closedLeadEdit} value={amount} placeholder={`Enter Installment ${key + 1}`} onChangeText={(text) => { handleInstalments(text, key) }} keyboardType={'numeric'} />
                            <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(totalInstalments[key].installmentAmount > 0 ? totalInstalments[key].installmentAmount : '')}</Text>
                          </View>
                        </View>

                        <View style={[AppStyles.blackInputdate]}>
                          <Text style={AppStyles.dateText}>{installmentDate}</Text>
                          {
                            arrowCheck.installments === true &&
                            <TouchableOpacity style={styles.checkBtnMain} onPress={() => { submitValues('installments') }}>
                              <Image source={targetArrow} style={styles.arrowImg} />
                            </TouchableOpacity>
                          }
                        </View>
                      </View>
                    )
                  })
                }
              </View>
              :
              formData.paymentType === 'full_payment' &&
              <View>
                {/* **************************************** */}
                {
                  paymentFiledsArray && paymentFiledsArray.map((item, index) => {
                    let itemDate = item && item.createdAt ?
                      moment(item.createdAt).format('hh:mm a') + ' ' + moment(item.createdAt).format('MMM DD')
                      :
                      item.installmentDate
                    return (
                      <View style={[AppStyles.mainBlackWrap]}>
                        <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
                          <Text style={[AppStyles.blackInputText]}>Payment {index + 1}</Text>
                          <View style={[AppStyles.blackInput]}>
                            <TextInput style={[AppStyles.blackInput]} editable={closedLeadEdit} value={item.installmentAmount} placeholder={'Enter Payment'} onChangeText={(text) => { handlePayments(text, index) }} keyboardType={'numeric'} />
                            <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(item.installmentAmount != null ? item.installmentAmount : '')}</Text>
                          </View>
                        </View>

                        <View style={[AppStyles.blackInputdate]}>
                          <Text style={AppStyles.dateText}>{itemDate}</Text>
                          {
                            arrowCheck.payments === true ?
                              <TouchableOpacity style={styles.checkBtnMain} onPress={() => { submitValues('payments') }}>
                                <Image source={targetArrow} style={styles.arrowImg} />
                              </TouchableOpacity>
                              : null
                          }
                        </View>
                      </View>
                    )
                  })
                }


                <TouchableOpacity onPress={() => addFullpaymentFields()}>
                  <Text style={styles.addMore}>Add More Payments</Text>
                </TouchableOpacity>
              </View>
          }

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.fullWidth]}>
              <Text style={[AppStyles.blackInputText]}>REMAINING PAYMENT</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} value={remainingPayment === 'no' ? '' : formatPrice(remainingPay)} editable={false} />
              </View>
            </View>
          </View>

          {/* **************************************** */}
          {
            closedLeadEdit == true &&
            <View style={[AppStyles.mainInputWrap]}>
              <Button
                onPress={() => { formSubmit() }}
                style={[AppStyles.formBtn, styles.addInvenBtn]}>
                <Text style={AppStyles.btnText}>CLOSE LEAD</Text>
              </Button>
            </View>
          }


        </View>
      </View >

    )
  }
}


mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(InnerForm)


