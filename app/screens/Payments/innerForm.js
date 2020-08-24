import React, { Component } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import styles from './style'
import PickerComponent from '../../components/Picker/index';
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux';
import moment from 'moment'
import InputField from '../../components/InputField'
import { SafeAreaView } from 'react-native-safe-area-context';


class InnerForm extends Component {
  constructor(props) {
    super(props)
  }

  dateFormateForFields = (date) => {
    var newDate = moment(date).format('hh:mm a') + ' ' + moment(date).format('MMM DD')
    return newDate
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
      readOnly,
      remainingPayment,
      downPaymentTime,
      instalments,
      submitValues,
      tokenDate,
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
      openUnitDetailsModal,
    } = this.props
    let checkForEdit = closedLeadEdit == false || checkForUnassignedLeadEdit == false ? false : true
    let rate = readOnly.rate && readOnly.rate.toString()
    let totalPrice = readOnly.totalPrice && readOnly.totalPrice.toString()
    let totalSize = readOnly.totalSize && readOnly.totalSize
    let remainingPay = remainingPayment && remainingPayment.toString()
    let no_installments = instalments.toString()
    return (
      <SafeAreaView style={styles.removePad}>
        <KeyboardAvoidingView>
          <View style={[AppStyles.modalMain, styles.marginBottomFrom]}>

            <View style={[AppStyles.formMain]}>
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
                <View style={styles.maiinDetailBtn}>
                  <View style={[AppStyles.inputWrap,styles.unitDetailInput]}>
                    <PickerComponent onValueChange={handleForm} data={getUnit} name={'unitId'} placeholder='Unit' selectedItem={formData.unitId} enabled={checkForEdit} />
                  </View>
                  <View style={styles.mainDetailViewBtn}>
                    <TouchableOpacity style={[styles.unitDetailBtn]} onPress={() => { formData.unitId != '' && openUnitDetailsModal(true)}}>
                      <Text style={styles.detailBtnText}>Details</Text>
                    </TouchableOpacity>
                  </View>
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
                        let installmentDate = totalInstalments[key].installmentAmount == null ? item.installmentDate : this.dateFormateForFields(totalInstalments[key].updatedAt)
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
              {/* **************************************** */}


            </View>
          </View >
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}


mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(InnerForm)


