/** @format */

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native'
import styles from './style'
import PickerComponent from '../../components/Picker/index'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux'
import moment from 'moment'
import SimpleInputText from '../../components/SimpleInputField'
import { SafeAreaView } from 'react-native-safe-area-context'
import { formatPrice } from '../../PriceFormate'
import ErrorMessage from '../../components/ErrorMessage'
import PaymentTile from '../../components/PaymentTile'
import StaticData from '../../StaticData'

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
      getProject,
      getFloors,
      getUnit,
      formData,
      handleForm,
      openUnitDetailsModal,
      openPearlDetailsModal,
      paymentPlan,
      unitPrice,
      currencyConvert,
      firstScreenValidate,
      firstScreenConfirmModal,
      unitId,
      tokenModalToggle,
      remainingPayment,
      checkLeadClosedOrNot,
      editTileForscreenOne,
      leftSqft,
      cnicEditable,
      unitPearlDetailsData,
      cnicValidate,
    } = this.props
    const checkForTokenEdit = formData.token === '' || formData.token === null ? false : true
    const checkForUnitIdavail =
      (formData.unitId != '' &&
        formData.unitId != null &&
        formData.unitId != 'no' &&
        checkLeadClosedOrNot === true) ||
      (formData.pearl != null && formData.pearl != '')
        ? true
        : false
    const dataForPaymentTile = {
      installmentAmount: formData.token,
      id: null,
      status: '',
      details: formData.details,
      type: formData.type,
      createdAt: new Date(),
      paymentCategory: formData.paymentTypeForToken,
    }
    let checkForPearlArea =
      unitPearlDetailsData.pearlArea < 50 ? StaticData.onlyUnitType : StaticData.unitType
    let checkForPaymentPlan =
      formData.paymentPlan === '' || formData.paymentPlan === null || checkForUnitIdavail === false
        ? false
        : true
    return (
      <SafeAreaView style={styles.removePad}>
        <KeyboardAvoidingView>
          <View style={styles.mainFormWrap}>
            <View style={[AppStyles.mainInputWrap]}>
              <View style={[AppStyles.inputWrap]}>
                <PickerComponent
                  onValueChange={handleForm}
                  data={getProject}
                  name={'projectId'}
                  placeholder="Project"
                  selectedItem={formData.projectId}
                  enabled={checkLeadClosedOrNot}
                />
                {firstScreenValidate === true && formData.projectId === null && (
                  <ErrorMessage errorMessage={'Required'} />
                )}
              </View>
            </View>

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <View style={[AppStyles.inputWrap]}>
                <PickerComponent
                  onValueChange={handleForm}
                  data={getFloors}
                  name={'floorId'}
                  placeholder="Floor"
                  selectedItem={formData.floorId}
                  enabled={checkLeadClosedOrNot}
                />
                {firstScreenValidate === true && formData.floorId === null && (
                  <ErrorMessage errorMessage={'Required'} />
                )}
              </View>
            </View>

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <View style={[AppStyles.inputWrap]}>
                <PickerComponent
                  onValueChange={handleForm}
                  data={checkForPearlArea}
                  name={'unitType'}
                  placeholder="Unit Type"
                  selectedItem={formData.unitType}
                  enabled={checkLeadClosedOrNot}
                />
                {firstScreenValidate === true && formData.unitType === null && (
                  <ErrorMessage errorMessage={'Required'} />
                )}
              </View>
            </View>

            {/* **************************************** */}

            {formData.unitType === 'pearl' ? (
              <View style={[AppStyles.mainInputWrap]}>
                <View style={styles.maiinDetailBtn}>
                  <View style={[AppStyles.inputWrap, styles.unitDetailInput]}>
                    <SimpleInputText
                      name={'pearl'}
                      fromatName={false}
                      placeholder={`${unitPearlDetailsData.pearlArea} sqft available`}
                      label={'PEARL'}
                      value={formData.pearl}
                      formatValue={''}
                      onChangeHandle={handleForm}
                      editable={true}
                      keyboardType={'numeric'}
                      noMargin={true}
                    />
                    {firstScreenValidate === true && formData.pearl === null ? (
                      <ErrorMessage errorMessage={'Required'} />
                    ) : null}
                    {formData.pearl > unitPearlDetailsData.pearlArea ? (
                      <ErrorMessage
                        errorMessage={`Cannot be greater than ${unitPearlDetailsData.pearlArea} sqft `}
                      />
                    ) : null}
                    {formData.pearl < 50 && formData.pearl > 0 ? (
                      <ErrorMessage errorMessage={'Must be greater than or equal to 50 sqft'} />
                    ) : null}
                    {leftSqft < 50 && leftSqft > 0 ? (
                      <ErrorMessage
                        errorMessage={`Remaining area (${leftSqft} sqft) must be 0 or greater than or equal to 50 sqft`}
                      />
                    ) : null}
                  </View>
                  <View style={styles.mainDetailViewBtn}>
                    <TouchableOpacity
                      style={[styles.unitDetailBtn]}
                      onPress={() => {
                        formData.pearl != null &&
                          formData.pearl >= 50 &&
                          openPearlDetailsModal(true)
                      }}
                    >
                      <Text style={styles.detailBtnText}>Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : null}
            {formData.unitType === 'fullUnit' ? (
              <View style={[AppStyles.mainInputWrap]}>
                <View style={styles.maiinDetailBtn}>
                  <View style={[AppStyles.inputWrap, styles.unitDetailInput]}>
                    <PickerComponent
                      onValueChange={handleForm}
                      data={getUnit}
                      name={'unitId'}
                      placeholder="Unit"
                      selectedItem={formData.unitId}
                      enabled={checkLeadClosedOrNot}
                      customStyle={styles.equalHeight}
                    />
                    {firstScreenValidate === true && formData.unitId === null && (
                      <ErrorMessage errorMessage={'Required'} />
                    )}
                  </View>
                  <View style={styles.mainDetailViewBtn}>
                    <TouchableOpacity
                      style={[styles.unitDetailBtn]}
                      onPress={() => {
                        formData.unitId != null && openUnitDetailsModal(formData.unitId, true)
                      }}
                    >
                      <Text style={styles.detailBtnText}>Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : null}

            {/* **************************************** */}
            <SimpleInputText
              name={'unitPrice'}
              fromatName={'unitPrice'}
              placeholder={'Unit Price'}
              label={'UNIT PRICE'}
              value={unitPrice != null ? unitPrice : ''}
              formatValue={unitPrice != null ? unitPrice : ''}
              editable={false}
              keyboardType={'numeric'}
            />

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <View style={[AppStyles.inputWrap]}>
                <PickerComponent
                  onValueChange={handleForm}
                  data={paymentPlan}
                  name={'paymentPlan'}
                  placeholder="Payment Plan"
                  selectedItem={formData.paymentPlan}
                  enabled={checkForUnitIdavail}
                />
                {firstScreenValidate === true && formData.paymentPlan === 'no' && (
                  <ErrorMessage errorMessage={'Required'} />
                )}
              </View>
            </View>

            {/* **************************************** */}
            <SimpleInputText
              name={'discount'}
              placeholder={'Approved Discount'}
              label={'APPROVED DISCOUNT%'}
              value={formData.discount}
              keyboardType={'numeric'}
              onChangeHandle={handleForm}
              formatValue={formData.discountedPrice}
              editable={checkForPaymentPlan}
              fromatName={false}
            />
            {/* {firstScreenValidate === true && formData.projectId === '' && <ErrorMessage errorMessage={'Required'} />} */}

            {/* **************************************** */}

            {/* **************************************** */}
            {formData.token != '' && formData.token != null ? (
              <View>
                <PaymentTile
                  currencyConvert={currencyConvert}
                  count={''}
                  data={dataForPaymentTile}
                  editTileForscreenOne={editTileForscreenOne}
                  tileForToken={true}
                />
                {firstScreenValidate === true ? (
                  formData.token === null || formData.token === '' || formData.type === '' ? (
                    <ErrorMessage errorMessage={'Token Required'} />
                  ) : null
                ) : null}
              </View>
            ) : (
              <View style={[AppStyles.mainInputWrap]}>
                <TouchableOpacity
                  style={styles.bookNowBtn}
                  onPress={() => {
                    checkForUnitIdavail === true && tokenModalToggle(true)
                  }}
                >
                  <Text style={styles.bookNowBtnText}>ADD TOKEN</Text>
                </TouchableOpacity>
                {firstScreenValidate === true ? (
                  formData.token === null || formData.token === '' || formData.type === '' ? (
                    <ErrorMessage errorMessage={'Required'} />
                  ) : null
                ) : null}
              </View>
            )}

            {cnicEditable != false && (
              <SimpleInputText
                name={'cnic'}
                placeholder={'Client CNIC'}
                label={'CLIENT CNIC'}
                value={formData.cnic}
                keyboardType={'numeric'}
                onChangeHandle={handleForm}
                formatValue={''}
                editable={cnicEditable}
                fromatName={false}
              />
            )}
            {(firstScreenValidate === true && formData.cnic === null) || formData.cnic === '' ? (
              <ErrorMessage errorMessage={'Required'} />
            ) : cnicValidate ? (
              <ErrorMessage errorMessage={'Enter a Valid CNIC Number'} />
            ) : null}

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              {formData.finalPrice === null ? (
                <View style={styles.backgroundBlue}>
                  <Text style={styles.finalPrice}>FINAL PRICE</Text>

                  <Text style={styles.priceValue}>
                    {unitPrice != null ? currencyConvert(unitPrice) : null}
                  </Text>
                  <Text style={styles.sidePriceFormat}>
                    {unitPrice != null ? formatPrice(unitPrice) : null}
                  </Text>
                </View>
              ) : (
                <View style={styles.backgroundBlue}>
                  <Text style={styles.finalPrice}>FINAL PRICE</Text>

                  <Text style={styles.priceValue}>
                    {formData.finalPrice != null ? currencyConvert(formData.finalPrice) : null}
                  </Text>
                  <Text style={styles.sidePriceFormat}>
                    {formData.finalPrice != null ? formatPrice(formData.finalPrice) : null}
                  </Text>
                </View>
              )}
            </View>

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <TouchableOpacity
                style={styles.bookNowBtn}
                onPress={() => {
                  checkLeadClosedOrNot === true && firstScreenConfirmModal(true)
                }}
              >
                <Text style={styles.bookNowBtnText}>BOOK NOW</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
  }
}

export default connect(mapStateToProps)(InnerForm)
