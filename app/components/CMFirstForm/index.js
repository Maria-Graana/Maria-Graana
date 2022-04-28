/** @format */

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native'
import styles from './style'
import PickerComponent from '../../components/Picker/index'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux'
import SimpleInputText from '../../components/SimpleInputField'
import { formatPrice } from '../../PriceFormate'
import ErrorMessage from '../../components/ErrorMessage'
import PaymentTile from '../../components/PaymentTile'
import PaymentMethods from '../../PaymentMethods'
import StaticData from '../../StaticData'
import helper from '../../helper'
import TouchableInput from '../TouchableInput'

class CMFirstForm extends Component {
  constructor(props) {
    super(props)
  }

  checkUnitPearl = () => {
    const { unitPearlDetailsData } = this.props
    if (unitPearlDetailsData && 'pearlArea' in unitPearlDetailsData) {
      return unitPearlDetailsData.pearlArea < 50 ? StaticData.onlyUnitType : StaticData.unitType
    } else {
      return StaticData.onlyUnitType
    }
  }

  checkForUnitDetail = () => {
    const { firstFormData, checkLeadClosedOrNot } = this.props
    const checkForUnitIdavail =
      (firstFormData.unit != '' &&
        firstFormData.unit != null &&
        firstFormData.unit != 'no' &&
        checkLeadClosedOrNot === true) ||
      (firstFormData.pearl != null && firstFormData.pearl != '')
        ? true
        : false
    return checkForUnitIdavail
  }

  setPaymentTile = () => {
    const { CMPayment } = this.props
    return {
      installmentAmount: CMPayment.installmentAmount,
      id: null,
      status: '',
      details: CMPayment.details,
      type: CMPayment.type,
      createdAt: new Date(),
      paymentCategory: CMPayment.paymentCategory,
    }
  }

  render() {
    const {
      allProjects,
      handleFirstForm,
      pickerFloors,
      pickerProjects,
      pickerUnits,
      firstFormData,
      checkLeadClosedOrNot,
      unitPearlDetailsData,
      openUnitDetailsModal,
      pearlUnit,
      oneUnitData,
      paymentPlan,
      submitFirstForm,
      firstFormValidate,
      cnicValidate,
      leftPearlSqft,
      pearlModal,
      pearlUnitPrice,
      addPaymentModalToggle,
      checkFirstFormPayment,
      currencyConvert,
      cnicEditable,
      productsPickerData,
      openProductDetailsModal,
      showInstallmentFields,
      installmentFrequency,
      lead,
      openUnitsTable,
      checkValidation,
      handleClientClick,
      updatePermission,
      oneProduct,
    } = this.props

    let unitTypeData = this.checkUnitPearl()
    const checkUnitDetail = this.checkForUnitDetail()
    const dataForPaymentTile = this.setPaymentTile()
    const { noProduct } = lead

    return (
      <View style={styles.mainFormWrap}>
        <View style={{ paddingVertical: 10 }}>
          <PickerComponent
            onValueChange={handleFirstForm}
            data={pickerProjects}
            name={'project'}
            placeholder="Project"
            selectedItem={firstFormData.project}
            enabled={updatePermission}
          />
          {firstFormValidate === true && !firstFormData.project && firstFormData.project === '' && (
            <ErrorMessage errorMessage={'Required'} />
          )}
        </View>
        <View style={{ paddingVertical: 10 }}>
          <PickerComponent
            onValueChange={handleFirstForm}
            data={pickerFloors}
            name={'floor'}
            placeholder="Floor"
            selectedItem={firstFormData.floor}
            enabled={updatePermission}
          />
          {firstFormValidate === true && !firstFormData.floor && firstFormData.floor === '' && (
            <ErrorMessage errorMessage={'Required'} />
          )}
        </View>
        <View style={{ paddingVertical: 10 }}>
          <PickerComponent
            onValueChange={handleFirstForm}
            data={unitTypeData}
            name={'unitType'}
            placeholder="Unit Type"
            selectedItem={firstFormData.unitType}
            enabled={updatePermission}
          />
          {firstFormValidate === true && !firstFormData.floor && firstFormData.floor === '' && (
            <ErrorMessage errorMessage={'Required'} />
          )}
        </View>
        {pearlUnit ? (
          <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
            <View style={[AppStyles.inputWrap, styles.unitDetailInput]}>
              <SimpleInputText
                name={'pearl'}
                fromatName={false}
                placeholder={`${unitPearlDetailsData.pearlArea} sqft available`}
                label={'PEARL'}
                value={firstFormData.pearl}
                formatValue={''}
                onChangeHandle={handleFirstForm}
                editable={true}
                keyboardType={'numeric'}
                noMargin={true}
              />
              {firstFormValidate === true && !firstFormData.pearl && firstFormData.pearl === '' && (
                <ErrorMessage errorMessage={'Required'} />
              )}
              {firstFormData.pearl > unitPearlDetailsData.pearlArea ? (
                <ErrorMessage
                  errorMessage={`Cannot be greater than ${unitPearlDetailsData.pearlArea} sqft `}
                />
              ) : null}
              {firstFormData.pearl && firstFormData.pearl !== '' && firstFormData.pearl < 50 ? (
                <ErrorMessage errorMessage={'Must be greater than or equal to 50 sqft'} />
              ) : null}
              {leftPearlSqft < 50 && leftPearlSqft > 0 ? (
                <ErrorMessage
                  errorMessage={`Remaining area (${leftPearlSqft} sqft) must be 0 or greater than or equal to 50 sqft`}
                />
              ) : null}
            </View>
            <View style={styles.mainDetailViewBtn}>
              <TouchableOpacity
                style={[styles.unitDetailBtn]}
                onPress={() => {
                  firstFormData.pearl != null &&
                    firstFormData.pearl != '' &&
                    firstFormData.pearl >= 50 &&
                    openUnitDetailsModal()
                }}
              >
                <Text style={styles.detailBtnText}>Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {!pearlUnit ? (
          <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
            {firstFormData.unit === '' || !firstFormData.unit ? (
              <View style={[styles.unitSubmitView, { paddingTop: 10 }]}>
                <TouchableOpacity
                  disabled={firstFormData.unitType === '' || !firstFormData.unitType ? true : false}
                  style={[styles.unitDetailBtn]}
                  onPress={openUnitsTable}
                >
                  <Text style={styles.detailBtnText}>Select Unit</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.unitDetailInput}>
                <SimpleInputText
                  name={'Selected Unit'}
                  fromatName={''}
                  placeholder={'Selected Unit'}
                  label={'UNIT'}
                  value={firstFormData.unitName}
                  formatValue={''}
                  editable={true}
                  keyboardType={'numeric'}
                  onClicked={openUnitsTable}
                  onPress={true}
                  onChangeHandle={() => {}}
                />
              </View>
            )}
            <View
              style={[
                [styles.mainDetailViewBtn, { paddingTop: 10 }],
                firstFormData.unit === '' || !firstFormData.unit ? { width: '50%' } : null,
              ]}
            >
              <TouchableOpacity
                style={[styles.unitDetailBtn]}
                onPress={() => {
                  firstFormData.unit != null && firstFormData.unit != '' && openUnitDetailsModal()
                }}
              >
                <Text style={styles.detailBtnText}>Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        <SimpleInputText
          name={'unitPrice'}
          fromatName={'unitPrice'}
          placeholder={'Unit Price'}
          label={'UNIT PRICE'}
          value={pearlModal ? pearlUnitPrice : PaymentMethods.findUnitPrice(oneUnitData)}
          formatValue={''}
          editable={false}
          keyboardType={'numeric'}
        />
        {!noProduct ? (
          <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
            <View style={[AppStyles.inputWrap, styles.unitDetailInput]}>
              <PickerComponent
                onValueChange={handleFirstForm}
                data={productsPickerData}
                name={'productId'}
                placeholder="Investment Product"
                selectedItem={firstFormData.productId}
                enabled={updatePermission}
                customStyle={styles.equalHeight}
              />
              {firstFormValidate === true && !firstFormData.productId && (
                <ErrorMessage errorMessage={'Required'} />
              )}
            </View>
            <View style={styles.mainDetailViewBtn}>
              <TouchableOpacity
                style={[styles.unitDetailBtn]}
                onPress={() => {
                  updatePermission &&
                    firstFormData.productId != null &&
                    firstFormData.productId != '' &&
                    openProductDetailsModal()
                }}
              >
                <Text style={styles.detailBtnText}>Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* **************************************** */}
        {noProduct ? (
          <View style={{ paddingVertical: 10 }}>
            <PickerComponent
              onValueChange={handleFirstForm}
              data={paymentPlan}
              name={'paymentPlan'}
              placeholder="Payment Plan"
              selectedItem={firstFormData.paymentPlan}
              enabled={updatePermission}
            />
            {firstFormValidate === true && firstFormData.paymentPlan === 'no' && (
              <ErrorMessage errorMessage={'Required'} />
            )}
          </View>
        ) : null}
        {showInstallmentFields ? (
          <View>
            <SimpleInputText
              name={'downPaymentPercentage'}
              placeholder={'Down Payment %'}
              label={`Down Payment % (${oneProduct.downPaymentMin}% - ${oneProduct.downPaymentMax}%)`}
              value={firstFormData.downPaymentPercentage}
              keyboardType={'numeric'}
              onChangeHandle={handleFirstForm}
              editable={
                updatePermission && oneProduct.downPaymentMin !== oneProduct.downPaymentMax
                  ? true
                  : false
              }
              formatValue={''}
              fromatName={false}
            />

            {firstFormData.downPaymentPercentage !== '' &&
              (Number(firstFormData.downPaymentPercentage) > oneProduct.downPaymentMax ||
                Number(firstFormData.downPaymentPercentage) < oneProduct.downPaymentMin) && (
                <ErrorMessage errorMessage={'Invalid Input'} />
              )}
            {/* **************************************** */}

            <SimpleInputText
              name={'downPayment'}
              placeholder={'Down Payment'}
              label={`Down Payment`}
              value={firstFormData.downPayment}
              keyboardType={'numeric'}
              onChangeHandle={handleFirstForm}
              formatValue={''}
              fromatName={false}
              editable={
                updatePermission && oneProduct.downPaymentMin !== oneProduct.downPaymentMax
                  ? true
                  : false
              }
            />
            {firstFormData.downPaymentPercentage !== '' &&
              (Number(firstFormData.downPaymentPercentage) > oneProduct.downPaymentMax ||
                Number(firstFormData.downPaymentPercentage) < oneProduct.downPaymentMin) && (
                <ErrorMessage errorMessage={'Invalid Input'} />
              )}
            {/* **************************************** */}

            <SimpleInputText
              name={'noOfInstallment'}
              placeholder={'Number of Installments'}
              label={`Number of Installments (Range ${oneProduct.noInstallmentsMin}-${oneProduct.noInstallmentsMax}) `}
              value={firstFormData.noOfInstallment}
              keyboardType={'numeric'}
              onChangeHandle={handleFirstForm}
              formatValue={''}
              fromatName={false}
              editable={
                updatePermission && oneProduct.noInstallmentsMin !== oneProduct.noInstallmentsMax
                  ? true
                  : false
              }
            />

            {firstFormData.noOfInstallment !== '' &&
              (Number(firstFormData.noOfInstallment) > oneProduct.noInstallmentsMax ||
                Number(firstFormData.noOfInstallment) < oneProduct.noInstallmentsMin) && (
                <ErrorMessage errorMessage={'Invalid Input'} />
              )}

            {/* **************************************** */}

            <SimpleInputText
              name={'installmentFrequency'}
              placeholder={'Frequency(Months)'}
              label={`Frequency (Months) (${oneProduct.installmentFrequencyMin} - ${oneProduct.installmentFrequencyMax})`}
              value={firstFormData.installmentFrequency}
              keyboardType={'numeric'}
              onChangeHandle={handleFirstForm}
              formatValue={''}
              editable={
                updatePermission &&
                oneProduct.installmentFrequencyMin !== oneProduct.installmentFrequencyMax
                  ? true
                  : false
              }
              fromatName={false}
            />
            {firstFormValidate === true && !firstFormData.installmentFrequency && (
              <ErrorMessage errorMessage={'Required'} />
            )}
            {firstFormData.installmentFrequency !== '' &&
              (Number(firstFormData.installmentFrequency) > oneProduct.installmentFrequencyMax ||
                Number(firstFormData.installmentFrequency) <
                  oneProduct.installmentFrequencyMin) && (
                <ErrorMessage errorMessage={'Invalid Input'} />
              )}

            <SimpleInputText
              name={'possessionChargesPercentage'}
              placeholder={'Possession Charges %'}
              label={`Possession Charges % (${oneProduct.possessionChargesMin}%-${oneProduct.possessionChargesMax}%) `}
              value={firstFormData.possessionChargesPercentage}
              keyboardType={'numeric'}
              onChangeHandle={handleFirstForm}
              formatValue={''}
              fromatName={false}
              editable={
                updatePermission &&
                oneProduct.possessionChargesMin !== oneProduct.possessionChargesMax
                  ? true
                  : false
              }
            />

            {firstFormData.possessionChargesPercentage !== '' &&
              (Number(firstFormData.possessionChargesPercentage) >
                oneProduct.possessionChargesMax ||
                Number(firstFormData.possessionChargesPercentage) <
                  oneProduct.possessionChargesMin) && (
                <ErrorMessage errorMessage={'Invalid Input'} />
              )}

            {/* **************************************** */}

            <SimpleInputText
              name={'possessionCharges'}
              placeholder={'Possession Charges'}
              label={`Possession Charges`}
              value={firstFormData.possessionCharges}
              keyboardType={'numeric'}
              onChangeHandle={handleFirstForm}
              formatValue={''}
              fromatName={false}
              editable={
                updatePermission &&
                oneProduct.possessionChargesMin !== oneProduct.possessionChargesMax
                  ? true
                  : false
              }
            />

            {firstFormData.possessionChargesPercentage !== '' &&
              (Number(firstFormData.possessionChargesPercentage) >
                oneProduct.possessionChargestMax ||
                Number(firstFormData.possessionChargesPercentage) <
                  oneProduct.possessionChargesMin) && (
                <ErrorMessage errorMessage={'Invalid Input'} />
              )}
          </View>
        ) : null}

        {/* **************************************** */}
        <SimpleInputText
          name={'approvedDiscount'}
          placeholder={'Approved Discount'}
          label={'APPROVED DISCOUNT%'}
          value={firstFormData.approvedDiscount}
          keyboardType={'numeric'}
          onChangeHandle={handleFirstForm}
          formatValue={''}
          editable={
            (updatePermission &&
              firstFormData.unit != null &&
              firstFormData.unit != '' &&
              firstFormData.productId != null &&
              firstFormData.productId != '') ||
            (updatePermission &&
              pearlUnit &&
              firstFormData.productId != null &&
              firstFormData.productId != '')
          }
          fromatName={false}
        />
        <SimpleInputText
          name={'approvedDiscountPrice'}
          fromatName={'approvedDiscountPrice'}
          placeholder={'APPROVED DISCOUNT AMOUNT'}
          label={'APPROVED DISCOUNT AMOUNT'}
          value={firstFormData.approvedDiscountPrice}
          onChangeHandle={handleFirstForm}
          formatValue={''}
          keyboardType={'numeric'}
          editable={
            (updatePermission &&
              firstFormData.unit != null &&
              firstFormData.unit != '' &&
              firstFormData.productId != null &&
              firstFormData.productId != '') ||
            (updatePermission &&
              pearlUnit &&
              firstFormData.productId != null &&
              firstFormData.productId != '')
          }
        />

        <Text style={styles.parkingAvaiable}>PARKING AVAILABLE </Text>
        <View style={{ paddingVertical: 10 }}>
          <PickerComponent
            onValueChange={handleFirstForm}
            data={StaticData.parkingAvailable}
            name={'parkingAvailable'}
            placeholder="Parking Available"
            selectedItem={firstFormData.parkingAvailable}
            enabled={updatePermission}
          />
          {firstFormValidate === true &&
            !firstFormData.parkingAvailable &&
            firstFormData.parkingAvailable === '' && <ErrorMessage errorMessage={'Required'} />}
        </View>

        {firstFormData.parkingAvailable === 'yes' && (
          <SimpleInputText
            name={'parkingCharges'}
            placeholder={'Parking Charges'}
            label={'PARKING CHARGES'}
            value={firstFormData.parkingCharges}
            // value={lead?.project?.parkingCharges != null && lead?.project?.parkingCharges != "" ? helper.currencyConvert(lead?.project?.parkingCharges) : 0}
            formatValue={''}
            editable={false}
            fromatName={false}
          />
        )}
        {/* **************************************** */}
        <View style={{ paddingVertical: 10 }}>
          <View style={styles.backgroundBlue}>
            <Text style={styles.finalPrice}>FINAL PRICE</Text>

            <Text style={styles.priceValue}>
              {helper.currencyConvert(firstFormData.finalPrice)}
            </Text>
            <Text style={styles.sidePriceFormat}>{formatPrice(firstFormData.finalPrice)}</Text>
          </View>
        </View>
        <View>
          <TouchableInput
            placeholder="Primary Applicant"
            label={'Primary Applicant'}
            onPress={() => {
              if (updatePermission) handleClientClick()
            }}
            value={firstFormData.clientName}
            showError={checkValidation === true && firstFormData.customerId === ''}
            errorMessage="Required"
          />
        </View>
        {/* **************************************** */}
        {cnicEditable && (
          <SimpleInputText
            name={'cnic'}
            placeholder={'Client CNIC/NTN'}
            label={'CLIENT CNIC/NTN'}
            value={firstFormData.cnic}
            maxLength={13}
            keyboardType={'numeric'}
            onChangeHandle={handleFirstForm}
            formatValue={''}
            editable={cnicEditable && updatePermission}
            fromatName={false}
          />
        )}
        {/* {cnicEditable != false && firstFormData.cnic === null && (
         <ErrorMessage errorMessage={'Required'} />
        )}
        // {cnicValidate ? (
        //   <ErrorMessage errorMessage={'Enter a Valid CNIC Number'} />
        // ) : null} */}
        {firstFormData.cnic === null && firstFormValidate ? (
          <ErrorMessage errorMessage={'Required'} />
        ) : cnicValidate ? (
          <ErrorMessage errorMessage={'Invalid CNIC/NTN format'} />
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            // marginHorizontal: 10,
          }}
        >
          <View style={[styles.btnView]}>
            <TouchableOpacity
              style={styles.bookNowBtn}
              onPress={() => {
                if (updatePermission) submitFirstForm('schedulePayment')
              }}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.bookNowBtnText,
                  checkFirstFormPayment
                    ? { fontSize: 14, fontFamily: AppStyles.fonts.boldFont }
                    : { fontSize: 12, fontFamily: AppStyles.fonts.boldFont },
                ]}
              >
                SCHEDULE OF PAYMENT
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingVertical: 10, paddingBottom: 20 }}>
          <TouchableOpacity
            style={styles.bookNowBtn}
            onPress={() => {
              checkLeadClosedOrNot === true && updatePermission && submitFirstForm('confirmation')
            }}
          >
            <Text style={styles.bookNowBtnText}>BOOK NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
    CMPayment: store.CMPayment.CMPayment,
  }
}

export default connect(mapStateToProps)(CMFirstForm)
