/** @format */

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native'
import styles from './style'
import PickerComponent from '../../components/Picker/index'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux'
import moment from 'moment'
import SimpleInputText from '../../components/SimpleInputField'
import { formatPrice } from '../../PriceFormate'
import ErrorMessage from '../../components/ErrorMessage'
import PaymentTile from '../../components/PaymentTile'
import PaymentMethods from '../../PaymentMethods'
import StaticData from '../../StaticData'
import helper from '../../helper'

class CMFirstForm extends Component {
  constructor(props) {
    super(props)
  }

  checkUnitPearl = () => {
    const { unitPearlDetailsData } = this.props
    if (unitPearlDetailsData && 'pearlArea' in unitPearlDetailsData) {
      return unitPearlDetailsData.pearlArea < 50 ? StaticData.onlyUnitType : StaticData.unitType
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
      editTokenPayment,
      cnicEditable,
      productsPickerData,
      openProductDetailsModal,
      showInstallmentFields,
      installmentFrequency,
      paymentPlanDuration,
      lead,
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
            // enabled={checkLeadClosedOrNot}
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
            // enabled={checkLeadClosedOrNot}
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
            // enabled={checkLeadClosedOrNot}
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
            <View style={[AppStyles.inputWrap, styles.unitDetailInput]}>
              <PickerComponent
                onValueChange={handleFirstForm}
                data={pickerUnits}
                name={'unit'}
                placeholder="Unit"
                selectedItem={firstFormData.unit}
                // enabled={checkLeadClosedOrNot}
                customStyle={styles.equalHeight}
              />
              {firstFormValidate === true && !firstFormData.unit && firstFormData.unit === '' && (
                <ErrorMessage errorMessage={'Required'} />
              )}
            </View>
            <View style={styles.mainDetailViewBtn}>
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
                // enabled={checkLeadClosedOrNot}
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
              // enabled={checkLeadClosedOrNot}
            />
            {firstFormValidate === true && firstFormData.paymentPlan === 'no' && (
              <ErrorMessage errorMessage={'Required'} />
            )}
          </View>
        ) : null}
        {showInstallmentFields ? (
          <View>
            <View style={{ paddingVertical: 10 }}>
              <PickerComponent
                onValueChange={handleFirstForm}
                data={paymentPlanDuration}
                name={'paymentPlanDuration'}
                placeholder="Payment Plan Duration"
                selectedItem={firstFormData.paymentPlanDuration}
                enabled={paymentPlanDuration && paymentPlanDuration.length === 1 ? false : true}
              />
              {firstFormValidate === true && !firstFormData.paymentPlanDuration && (
                <ErrorMessage errorMessage={'Required'} />
              )}
            </View>
            <View style={{ paddingVertical: 10 }}>
              <PickerComponent
                onValueChange={handleFirstForm}
                data={installmentFrequency}
                name={'installmentFrequency'}
                placeholder="Installment Frequency"
                selectedItem={firstFormData.installmentFrequency}
                enabled={installmentFrequency && installmentFrequency.length === 1 ? false : true}
              />
              {firstFormValidate === true && !firstFormData.installmentFrequency && (
                <ErrorMessage errorMessage={'Required'} />
              )}
            </View>
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
          // editable={checkForPaymentPlan}
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
        />
        {checkFirstFormPayment && (
          <View>
            <PaymentTile
              currencyConvert={currencyConvert}
              count={''}
              data={dataForPaymentTile}
              editTileForscreenOne={editTokenPayment}
              tileForToken={true}
            />
            {/* {firstFormValidate === true && checkFirstFormPayment ? (
              <ErrorMessage errorMessage={'Token Required'} />
            ) : null} */}
          </View>
        )}

        {/* **************************************** */}
        {cnicEditable != false && (
          <SimpleInputText
            name={'cnic'}
            placeholder={'Client CNIC'}
            label={'CLIENT CNIC'}
            value={firstFormData.cnic}
            keyboardType={'numeric'}
            onChangeHandle={handleFirstForm}
            formatValue={''}
            editable={cnicEditable}
            fromatName={false}
          />
        )}
        {(firstFormValidate === true && firstFormData.cnic === null) ||
        firstFormData.cnic === '' ? (
          <ErrorMessage errorMessage={'Required'} />
        ) : cnicValidate ? (
          <ErrorMessage errorMessage={'Enter a Valid CNIC Number'} />
        ) : null}
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
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            // marginHorizontal: 10,
            justifyContent: 'space-between',
          }}
        >
          {!checkFirstFormPayment && (
            <View style={[styles.btnView, showInstallmentFields ? { flex: 0.9 } : null]}>
              <TouchableOpacity
                style={[styles.bookNowBtn]}
                onPress={() => {
                  checkUnitDetail === true && addPaymentModalToggle(true, 'token')
                }}
              >
                <Text
                  style={[styles.bookNowBtnText, showInstallmentFields ? { fontSize: 12 } : null]}
                >
                  ADD TOKEN
                </Text>
              </TouchableOpacity>
              {firstFormValidate === true && !checkFirstFormPayment ? (
                <ErrorMessage errorMessage={'Token Required'} />
              ) : null}
            </View>
          )}
          {showInstallmentFields ? (
            <View style={[styles.btnView, !checkFirstFormPayment ? { paddingLeft: 10 } : null]}>
              <TouchableOpacity
                style={styles.bookNowBtn}
                onPress={() => {
                  submitFirstForm('schedulePayment')
                }}
              >
                <Text numberOfLines={1} style={[styles.bookNowBtnText, { fontSize: 12 }]}>
                  SCHEDULE OF PAYMENT
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        <View style={{ paddingVertical: 10, paddingBottom: 20 }}>
          <TouchableOpacity
            style={styles.bookNowBtn}
            onPress={() => {
              checkLeadClosedOrNot === true && submitFirstForm('confirmation')
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
