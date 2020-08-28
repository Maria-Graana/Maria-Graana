import React, { Component } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import styles from './style'
import PickerComponent from '../../components/Picker/index';
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux';
import moment from 'moment'
import InputField from '../../components/InputField'
import { SafeAreaView } from 'react-native-safe-area-context';
import StaticData from '../../StaticData';


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
      formData,
      totalInstalments,
      handleInstalments,
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
      unitDetails,
      discountAmount,
      discountedPrice,
      checkMonthlyOption,
      possessionCharges,
      possessionFormat,
    } = this.props
    let checkForEdit = closedLeadEdit == false || checkForUnassignedLeadEdit == false ? false : true
    let remainingPay = remainingPayment && remainingPayment.toString()
    let no_installments = instalments.toString()
    var unitDetail = unitDetails && unitDetails != null && unitDetails != '' && unitDetails
    var installmentsPlans = formData.installmentDue === 'quarterly' ? StaticData.getInstallments : StaticData.getInstallmentsMonthly
    var installmentsDueOption = checkMonthlyOption === true ? StaticData.installmentDue : StaticData.onlyQuarterly
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
                  <View style={[AppStyles.inputWrap, styles.unitDetailInput]}>
                    <PickerComponent onValueChange={handleForm} data={getUnit} name={'unitId'} placeholder='Unit' selectedItem={formData.unitId} enabled={checkForEdit} />
                  </View>
                  <View style={styles.mainDetailViewBtn}>
                    <TouchableOpacity style={[styles.unitDetailBtn]} onPress={() => { formData.unitId != '' && openUnitDetailsModal(true) }}>
                      <Text style={styles.detailBtnText}>Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* **************************************** */}
              <InputField
                label={'UNIT PRICE'}
                placeholder={'Unit Price'}
                name={'unitPrice'}
                priceFormatVal={unitDetail && unitDetail.unit_price != null ? unitDetail.unit_price.toString() : ''}
                value={unitDetail && unitDetail.unit_price != null ? unitDetail.unit_price.toString() : ''}
                keyboardType={'numeric'}
                showDate={false}
                dateStatus={false}
                editable={false}
                editPriceFormat={{ status: true, name: 'unitPrice' }}
              />

              {/* **************************************** */}
              <InputField
                label={'DISCOUNT PARCENTAGE'}
                placeholder={'Discount Percentage'}
                name={'discountPercentage'}
                priceFormatVal={false}
                value={formData.discountPercentage ? formData.discountPercentage.toString() : ''}
                keyboardType={'numeric'}
                onChange={handleForm}
                paymentDone={submitValues}
                showStyling={showAndHideStyling}
                showStylingState={showStylingState}
                showDate={false}
                dateStatus={false}
                editable={checkForEdit}
                editPriceFormat={{ status: false, name: 'discountPercentage' }}
                isPercentageValue={true}
              />

              {/* **************************************** */}
              <InputField
                label={'DISCOUNT AMOUNT'}
                placeholder={'Discount Amount'}
                name={'discountAmount'}
                priceFormatVal={discountAmount ? discountAmount.toString() : ''}
                value={discountAmount ? discountAmount.toString() : ''}
                keyboardType={'numeric'}
                showDate={false}
                dateStatus={false}
                editable={false}
                editPriceFormat={{ status: true, name: 'discountAmount' }}
              />

              {/* **************************************** */}
              <InputField
                label={'DISCOUNTED PRICE'}
                placeholder={'Discounted Price'}
                name={'discountedPrice'}
                priceFormatVal={discountedPrice ? discountedPrice.toString() : ''}
                value={discountedPrice ? discountedPrice.toString() : ''}
                keyboardType={'numeric'}
                showDate={false}
                dateStatus={false}
                editable={false}
                editPriceFormat={{ status: true, name: 'discountedPrice' }}
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
              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <PickerComponent onValueChange={handleForm} data={paymentOptions} name={'paymentType'} enabled={checkForEdit} placeholder='Select Payment Type' selectedItem={formData.paymentType} />
                </View>
              </View>

              {
                formData.paymentType === 'installments' ?
                  <View>
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
                        <PickerComponent onValueChange={handleForm} data={installmentsDueOption} enabled={checkForEdit} name={'installmentDue'} placeholder='Installment Due' selectedItem={formData.installmentDue} />
                      </View>
                    </View>
                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap]}>
                      <View style={[AppStyles.inputWrap]}>
                        <PickerComponent onValueChange={handleForm} data={installmentsPlans} enabled={checkForEdit} name={'no_installments'} placeholder='Installment Plan' selectedItem={no_installments} />
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
                    {/* **************************************** */}
                    <InputField
                      label={'POSSESSION CHARGES'}
                      placeholder={'Possession Charges'}
                      name={'possessionCharges'}
                      priceFormatVal={possessionCharges ? possessionCharges.toString() : ''}
                      value={possessionCharges ? possessionCharges.toString() : ''}
                      keyboardType={'numeric'}
                      onChange={handleForm}
                      paymentDone={submitValues}
                      showStyling={showAndHideStyling}
                      showStylingState={showStylingState}
                      showDate={false}
                      dateStatus={false}
                      editable={checkForEdit}
                      editPriceFormat={{ status: possessionFormat, name: 'possessionCharges' }}
                    />
                  </View>
                  :
                  formData.paymentType === 'full_payment' &&
                  <View>
                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap]}>
                      <View style={[AppStyles.inputWrap]}>
                        <PickerComponent onValueChange={handleForm} data={StaticData.planOptions} name={'unitStatus'} enabled={checkForEdit} placeholder='Plan' selectedItem={formData.unitStatus} />
                      </View>
                    </View>
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
                      <View style={[styles.addMoreBtnMain]}>
                        <TouchableOpacity onPress={() => checkForEdit == true ? addFullpaymentFields() : closedLead()}>
                          <Text style={styles.addMore}>Add More Payments</Text>
                        </TouchableOpacity>
                      </View>
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


