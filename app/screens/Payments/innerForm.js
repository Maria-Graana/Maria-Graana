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
import InputField from '../../components/InputField'


class InnerForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dummyData: {
        input: '10023123',
        input2: '',
      },
      refreshInput: false,
      showStyling: '',
      showDate: false,
      inputDateStatus: {
        name: '',
        status: false,
      },
      inputDateStatus2: {
        name: '',
        status: false,
      },
      editPriceFormat: {
        status: false,
        name: ''
      },
    }
  }

  changeValue = (value, name) => {
    const { dummyData } = this.state
    var newDummyData = dummyData
    newDummyData[name] = value
    this.setState({ dummyData: newDummyData })
  }

  showAndHideStyling = (name, clear) => {
    const { dummyData, inputDateStatus, inputDateStatus2 } = this.state
    const newDummy = dummyData

    if (clear === true) {
      newDummy[name] = ''
    }

    if (name === 'input') {
      inputDateStatus['name'] = ''
      inputDateStatus['status'] = false
    }

    if (name === 'input2') {
      inputDateStatus2['name'] = ''
      inputDateStatus2['status'] = false
    }



    this.setState({
      showStyling: clear === false ? name : '',
      dummyData: newDummy,
      showDate: false,
      inputDateStatus,
      inputDateStatus2,
      editPriceFormat: {
        status: false,
        name: ''
      },
    })
  }

  submit = (name) => {
    const { dummyData, inputDateStatus, inputDateStatus2 } = this.state
    var body = {
      payment: '',
      payment2: '',
    }
    if (name === 'input') {
      body = {
        payment: dummyData.input,
      }
      inputDateStatus['name'] = name
      inputDateStatus['status'] = true
    }

    if (name === 'input2') {
      body = {
        payment2: dummyData.input2,
      }
      inputDateStatus2['name'] = name
      inputDateStatus2['status'] = true
    }

    this.setState({
      showStyling: '',
      showDate: true,
      inputDateStatus,
      inputDateStatus2,
      editPriceFormat: {
        status: true,
        name: name
      },
    })
  }

  render() {
    const {
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
      handlePayments,
      paymentFiledsArray,
      addFullpaymentFields,
      closedLeadEdit,
      closedLead,
      showAndHideStyling,
      showStylingState,
      promotionDiscountFormat,
      tokenFormat,
      tokenDateStatus,
      downPaymentDateStatus,
      downPaymentFormat,
      dateStatusForPayments,
      paymentFromat,
      checkForUnassignedLeadEdit,
      dateStatusForInstallments,
      installmentsFromat,
    } = this.props
    let checkForEdit = closedLeadEdit == false || checkForUnassignedLeadEdit == false ? false : true
    const { dummyData, showStyling, showDate, inputDateStatus, inputDateStatus2, editPriceFormat } = this.state
    let rate = readOnly.rate && readOnly.rate.toString()
    let totalPrice = readOnly.totalPrice && readOnly.totalPrice.toString()
    let totalSize = readOnly.totalSize && readOnly.totalSize
    let remainingPay = remainingPayment && remainingPayment.toString()
    let no_installments = instalments.toString()
    return (
      <View style={[AppStyles.modalMain, styles.marginBottomFrom]}>
        <View style={[AppStyles.formMain]}>

          {/* <InputField
            label={'DOWN PAYMENT'}
            placeholder={'Enter Amount'}
            name={'input'}
            date={moment(newDate).format('MMM DD, hh:mm a')}
            onChange={this.changeValue}
            showStyling={this.showAndHideStyling}
            priceFormatVal={dummyData.input}
            value={dummyData.input}
            keyboardType={'numeric'}
            showStylingState={showStyling}
            paymentDone={this.submit}
            showDate={false}
            dateStatus={false}
            editable={false}
            editPriceFormat={{status: true, name:'input'}}
          />

          <InputField
            label={'INPUT MAIN 2'}
            placeholder={'Enter Input'}
            name={'input2'}
            value={dummyData.input2}
            keyboardType={'numeric'}
            onChange={this.changeValue}
            editPriceFormat={editPriceFormat}
            date={moment(newDate).format('MMM DD, hh:mm a')}
            priceFormatVal={dummyData.input2}
            showStyling={this.showAndHideStyling}
            showStylingState={showStyling}
            paymentDone={this.submit}
            showDate={true}
            dateStatus={inputDateStatus2}
          /> */}

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getProject} name={'projectId'} placeholder='Project' selectedItem={formData.projectId} enabled={checkForEdit} />
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getFloor} name={'floorId'} placeholder='Floor' selectedItem={formData.floorId} enabled={checkForEdit} />
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getUnit} name={'unitId'} placeholder='Unit' selectedItem={formData.unitId} enabled={checkForEdit} />
            </View>
          </View>

          {/* **************************************** */}
          <InputField
            label={'TOTAL SIZE'}
            placeholder={'Total Size'}
            name={'totalSize'}
            priceFormatVal={false}
            value={totalSize}
            keyboardType={'numeric'}
            showDate={false}
            dateStatus={false}
            editable={false}
            editPriceFormat={{ status: false, name: 'totalSize' }}
          />
          {/* < View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>TOTAL SIZE</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'Total Size'} value={totalSize} editable={false} />
              </View>
            </View>
          </View>*/}


          {/* **************************************** */}
          <InputField
            label={'RATE'}
            placeholder={'Rate'}
            name={'totalRate'}
            priceFormatVal={false}
            value={rate != null ? rate : ''}
            keyboardType={'numeric'}
            showDate={false}
            dateStatus={false}
            editable={false}
            editPriceFormat={{ status: true, name: 'totalRate' }}
          />
          {/* <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>RATE</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'Rate'} value={formatPrice(rate)} editable={false} />
              </View>
            </View>
          </View>  */}

          {/* **************************************** */}
          <InputField
            label={'TOTAL PRICE'}
            placeholder={'Total Price'}
            name={'totalPrice'}
            priceFormatVal={totalPrice != null ? totalPrice : ''}
            value={totalPrice != null ? totalPrice : ''}
            keyboardType={'numeric'}
            showDate={false}
            dateStatus={false}
            editable={false}
            editPriceFormat={{ status: true, name: 'totalPrice' }}
          />
          {/*<View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>TOTAL PRICE</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'Total Price'} value={totalPrice} editable={false} />
                <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(totalPrice != null ? totalPrice : '')}</Text>
              </View>
            </View>
          </View>*/}

          {/* **************************************** */}
          <InputField
            label={'PROMOTIONAL OFFER'}
            placeholder={'Enter Promotional Offer Amount'}
            name={'discount'}
            value={formData.discount}
            priceFormatVal={formData.discount != null ? formData.discount : ''}
            keyboardType={'numeric'}
            onChange={handleForm}
            paymentDone={submitValues}
            showStyling={showAndHideStyling}
            showStylingState={showStylingState}
            editPriceFormat={{ status: promotionDiscountFormat, name: 'discount' }}
            date={''}
            editable={checkForEdit}
            showDate={false}
            dateStatus={false}
          />
          {/* <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.fullWidthPad, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>PROMOTIONAL OFFER </Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} value={formData.discount} placeholder={'Enter Promotional Offer Amount'} onChangeText={(text) => { handleForm(text, 'discount') }} keyboardType={'numeric'} editable={checkForEdit} />
                {
                  arrowCheck.discount === true &&
                  <TouchableOpacity style={[styles.checkBtnMain, styles.customArrowRight]} onPress={() => { submitValues('discount') }}>
                    <Image source={targetArrow} style={styles.arrowImg} />
                  </TouchableOpacity>
                }
                <Text style={[AppStyles.countPrice, styles.customTop, styles.customRight]}>{formatPrice(formData.discount != null ? formData.discount : '')}</Text>
              </View>
            </View>
          </View> */}

          {/* **************************************** */}
          <InputField
            label={'TOKEN'}
            placeholder={'Enter Token Amount'}
            name={'token'}
            value={formData.token}
            priceFormatVal={formData.token != null ? formData.token : ''}
            keyboardType={'numeric'}
            onChange={handleForm}
            paymentDone={submitValues}
            showStyling={showAndHideStyling}
            showStylingState={showStylingState}
            editPriceFormat={{ status: tokenFormat, name: 'token' }}
            date={tokenDate}
            editable={checkForEdit}
            showDate={true}
            dateStatus={tokenDateStatus}
          />
          {/* <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>TOKEN</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} value={formData.token} editable={checkForEdit} placeholder={'Enter Token Amount'} onChangeText={(text) => { handleForm(text, 'token') }} keyboardType={'numeric'} />
                <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(formData.token != null ? formData.token : '')}</Text>
              </View>
            </View>

            <View style={[AppStyles.blackInputdate]}>
              <Text style={[AppStyles.dateText, styles.dateTextTwo]}>{tokenDate}</Text>
              {
                arrowCheck.token === true ?
                  <TouchableOpacity style={styles.checkBtnMain} onPress={() => { submitValues('token') }}>
                    <Image source={targetArrow} style={styles.arrowImg} />
                  </TouchableOpacity>
                  : null
              }
            </View>
          </View> */}

          {/* **************************************** */}
          <InputField
            label={'DOWN PAYMENT'}
            placeholder={'Enter Down Payment'}
            name={'downPayment'}
            value={formData.downPayment != null ? formData.downPayment : ''}
            priceFormatVal={formData.downPayment != null ? formData.downPayment : ''}
            keyboardType={'numeric'}
            onChange={handleForm}
            paymentDone={submitValues}
            showStyling={showAndHideStyling}
            showStylingState={showStylingState}
            editPriceFormat={{ status: downPaymentFormat, name: 'downPayment' }}
            date={downPaymentTime}
            editable={checkForEdit}
            showDate={true}
            dateStatus={downPaymentDateStatus}
          />
          {/* <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>DOWN PAYMENT</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} value={formData.downPayment} editable={checkForEdit} placeholder={'Enter Down Payment'} onChangeText={(text) => { handleForm(text, 'downPayment') }} keyboardType={'numeric'} />
                <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(formData.downPayment != null ? formData.downPayment : '')}</Text>
              </View>
            </View>

            <View style={[AppStyles.blackInputdate]}>
              <Text style={[AppStyles.dateText, styles.dateTextTwo]}>{downPaymentTime}</Text>
              {
                arrowCheck.downPayment === true &&
                <TouchableOpacity style={styles.checkBtnMain} onPress={() => { submitValues('downPayment') }}>
                  <Image source={targetArrow} style={styles.arrowImg} />
                </TouchableOpacity>
              }
            </View>
          </View> */}

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={paymentOptions} name={'paymentType'} enabled={checkForEdit} placeholder='Select Payment Type' selectedItem={formData.paymentType} />
            </View>
          </View>

          {
            formData.paymentType === 'installments' ?
              <View>
                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                  <View style={[AppStyles.inputWrap]}>
                    <PickerComponent onValueChange={handleForm} data={getInstallments} enabled={checkForEdit} name={'instalments'} placeholder='Installment Plan' selectedItem={no_installments} />
                  </View>
                </View>
                {/* **************************************** */}
                {
                  totalInstalments != '' && totalInstalments.map((item, key) => {
                    let amount = item.installmentAmount != null ? item.installmentAmount.toString() : ''
                    let installmentDate = totalInstalments[key].installmentAmountDate === '' ? item.installmentDate : totalInstalments[key].installmentAmountDate
                    console.log(amount)
                    return (
                      <View>
                        <InputField
                          label={`INSTALLMENT ${key + 1}`}
                          placeholder={`Enter Installment ${key + 1}`}
                          name={key}
                          arrayName={'installments'}
                          typeArray={true}
                          value={amount == 'NaN' ? '' : amount}
                          priceFormatVal={totalInstalments[key].installmentAmount > 0 ? totalInstalments[key].installmentAmount : ''}
                          keyboardType={'numeric'}
                          onChange={handleInstalments}
                          paymentDone={submitValues}
                          showStyling={showAndHideStyling}
                          showStylingState={showStylingState}
                          editPriceFormat={installmentsFromat[key]}
                          editable={checkForEdit}
                          date={installmentDate}
                          showDate={true}
                          dateStatus={dateStatusForInstallments[key]}
                        />
                      </View>
                      // <View style={[AppStyles.mainBlackWrap]} key={key}>
                      //   <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
                      //     <Text style={[AppStyles.blackInputText]}>INSTALLMENT {key + 1}</Text>
                      //     <View style={[AppStyles.blackInput]}>
                      //       <TextInput style={[AppStyles.blackInput]} editable={checkForEdit} value={amount} placeholder={`Enter Installment ${key + 1}`} onChangeText={(text) => { handleInstalments(text, key) }} keyboardType={'numeric'} />
                      //       <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(totalInstalments[key].installmentAmount > 0 ? totalInstalments[key].installmentAmount : '')}</Text>
                      //     </View>
                      //   </View>

                      //   <View style={[AppStyles.blackInputdate]}>
                      //     <Text style={[AppStyles.dateText, styles.dateTextTwo]}>{installmentDate}</Text>
                      //     {
                      //       arrowCheck.installments === true &&
                      //       <TouchableOpacity style={styles.checkBtnMain} onPress={() => { submitValues('installments') }}>
                      //         <Image source={targetArrow} style={styles.arrowImg} />
                      //       </TouchableOpacity>
                      //     }
                      //   </View>
                      // </View>
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
                      <View>
                        {/*
                      <View style={[AppStyles.mainBlackWrap]}>
                        <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
                          <Text style={[AppStyles.blackInputText]}>Payment {index + 1}</Text>
                          <View style={[AppStyles.blackInput]}>
                            <TextInput style={[AppStyles.blackInput]} editable={checkForEdit} value={item.installmentAmount} placeholder={'Enter Payment'} onChangeText={(text) => { handlePayments(text, index) }} keyboardType={'numeric'} />
                            <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(item.installmentAmount != null ? item.installmentAmount : '')}</Text>
                          </View>

                          <View style={[AppStyles.blackInputdate]}>
                            <Text style={[AppStyles.dateText, styles.dateTextTwo]}>{itemDate}</Text>
                            {
                              arrowCheck.payments === true ?
                                <TouchableOpacity style={styles.checkBtnMain} onPress={() => { submitValues('payments') }}>
                                  <Image source={targetArrow} style={styles.arrowImg} />
                                </TouchableOpacity>
                                : null
                            }
                          </View>
                        </View> */}
                        <InputField
                          label={`Payment ${index + 1}`}
                          placeholder={'Enter Payment'}
                          name={index}
                          arrayName={'payments'}
                          typeArray={true}
                          value={item.installmentAmount != null ? item.installmentAmount : ''}
                          priceFormatVal={item.installmentAmount != null ? item.installmentAmount : ''}
                          keyboardType={'numeric'}
                          onChange={handlePayments}
                          paymentDone={submitValues}
                          showStyling={showAndHideStyling}
                          showStylingState={showStylingState}
                          editPriceFormat={paymentFromat[index]}
                          editable={checkForEdit}
                          date={itemDate}
                          showDate={true}
                          dateStatus={dateStatusForPayments[index]}
                        />
                      </View>
                    )
                  })
                }

                {
                  checkForEdit == true &&
                  <TouchableOpacity onPress={() => checkForEdit == true ? addFullpaymentFields() : closedLead()}>
                    <Text style={styles.addMore}>Add More Payments</Text>
                  </TouchableOpacity>
                }

              </View>
          }

          {/* **************************************** */}
          <InputField
            label={'REMAINING PAYMENT'}
            placeholder={'Remaining Payment'}
            name={'remainingPayment'}
            priceFormatVal={remainingPay}
            value={remainingPayment === 'no' ? '' : remainingPay}
            keyboardType={'numeric'}
            showDate={false}
            dateStatus={false}
            editable={false}
            editPriceFormat={{ status: true, name: 'remainingPayment' }}
          />
          {/* <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.fullWidth]}>
              <Text style={[AppStyles.blackInputText]}>REMAINING PAYMENT</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} value={remainingPayment === 'no' ? '' : remainingPay} editable={false} />
                <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(remainingPay)}</Text>
              </View>
            </View>
          </View> */}

          {/* **************************************** */}


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


