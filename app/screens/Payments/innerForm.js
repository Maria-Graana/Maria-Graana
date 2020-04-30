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
              <PickerComponent onValueChange={handleForm} data={getProject} name={'projectId'} placeholder='Project' selectedItem={formData.projectId} />
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getFloor} name={'floorId'} placeholder='Floors' selectedItem={formData.floorId} />
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getUnit} name={'unitId'} placeholder='Unit' selectedItem={formData.unitId} />
            </View>
          </View>

          {/* **************************************** */}
          < View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>TOTAL SIZE</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'10 SQFT'} value={totalSize} editable={false} />
              </View>
            </View>
          </View>


          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>RATE</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'10 LAC'} value={formatPrice(rate)} editable={false} />
              </View>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>TOTAL PRICE</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'10 LAC'} value={formatPrice(totalPrice)} editable={false} />
              </View>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.fullWidthPad, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>PROMOTIONAL OFFER</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} value={formData.discount} placeholder={'10 LAC'} onChangeText={(text) => { handleForm(text, 'discount') }} keyboardType={'numeric'} />
                {
                  formData.discount != '' && arrowCheck.discount === true &&
                  <TouchableOpacity style={styles.checkBtnMain} onPress={() => { submitValues('discount') }}>
                    <Image source={targetArrow} style={styles.arrowImg} />
                  </TouchableOpacity>
                }
                <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(formData.discount != null ? formData.discount : '')}</Text>
              </View>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>TOKEN</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} value={formData.token} placeholder={'10 LAC'} onChangeText={(text) => { handleForm(text, 'token') }} keyboardType={'numeric'} />
                {
                  formData.token != '' && arrowCheck.token === true ?
                  <TouchableOpacity style={styles.checkBtnMain} onPress={() => { submitValues('token') }}>
                    <Image source={targetArrow} style={styles.arrowImg} />
                  </TouchableOpacity>
                  : null
                }
                <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(formData.token != null ? formData.token : '')}</Text>
              </View>
            </View>

            <View style={[AppStyles.blackInputdate]}>
              <Text style={AppStyles.dateText}>{tokenDate}</Text>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>DOWN PAYMENT</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} value={formData.downPayment} placeholder={'10 LAC'} onChangeText={(text) => { handleForm(text, 'downPayment') }} keyboardType={'numeric'} />
                {
                  formData.downPayment != '' && arrowCheck.downPayment === true &&
                  <TouchableOpacity style={styles.checkBtnMain} onPress={() => { submitValues('downPayment') }}>
                    <Image source={targetArrow} style={styles.arrowImg} />
                  </TouchableOpacity>
                }
                <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(formData.downPayment != null ? formData.downPayment : '')}</Text>
              </View>
            </View>

            <View style={[AppStyles.blackInputdate]}>
              <Text style={AppStyles.dateText}>{downPaymentTime}</Text>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getInstallments} name={'instalments'} placeholder='Installments' selectedItem={no_installments} />
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
                    <Text style={[AppStyles.blackInputText]}>INSTALLMENTS {key + 1}</Text>
                    <View style={[AppStyles.blackInput]}>
                      <TextInput style={[AppStyles.blackInput]} value={amount} placeholder={'10 LAC'} onChangeText={(text) => { handleInstalments(text, key) }} keyboardType={'numeric'} />
                      {
                        totalInstalments[key].installmentAmount != '' && arrowCheck.installments === true &&
                        <TouchableOpacity style={styles.checkBtnMain} onPress={() => { submitValues('installments') }}>
                          <Image source={targetArrow} style={styles.arrowImg} />
                        </TouchableOpacity>
                      }
                      <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(totalInstalments[key].installmentAmount)}</Text>
                    </View>
                  </View>

                  <View style={[AppStyles.blackInputdate]}>
                    <Text style={AppStyles.dateText}>{moment(installmentDate).format('hh:mm a') + ' ' + moment(installmentDate).format('MMM DD')}</Text>
                  </View>
                </View>
              )
            })
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
          <View style={[AppStyles.mainInputWrap]}>
            <Button
              onPress={() => { formSubmit() }}
              style={[AppStyles.formBtn, styles.addInvenBtn]}>
              <Text style={AppStyles.btnText}>CLOSE LEAD</Text>
            </Button>
          </View>

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


