import React, { Component } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import styles from './style'
import PickerComponent from '../../components/Picker/index';
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux';
import moment from 'moment'
import SimpleInputText from '../../components/SimpleInputField'
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatPrice } from '../../PriceFormate';
import ErrorMessage from '../../components/ErrorMessage'


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
      paymentPlan,
      unitPrice,
      currencyConvert,
      firstScreenValidate,
      firstScreenConfirmModal,
      unitId,
      tokenModalToggle,
      remainingPayment,
    } = this.props
    const checkForTokenEdit = formData.token === '' || formData.token === null ? false : true
    return (
      <SafeAreaView style={styles.removePad}>
        <KeyboardAvoidingView>
          <View style={styles.mainFormWrap}>

            <View style={[AppStyles.mainInputWrap]}>
              <View style={[AppStyles.inputWrap]}>
                <PickerComponent onValueChange={handleForm} data={getProject} name={'projectId'} placeholder='Project' selectedItem={formData.projectId} />
                {firstScreenValidate === true && formData.projectId === null && <ErrorMessage errorMessage={'Required'} />}
              </View>
            </View>

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <View style={[AppStyles.inputWrap]}>
                <PickerComponent onValueChange={handleForm} data={getFloors} name={'floorId'} placeholder='Floor' selectedItem={formData.floorId} />
                {firstScreenValidate === true && formData.floorId === null && <ErrorMessage errorMessage={'Required'} />}
              </View>
            </View>

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <View style={styles.maiinDetailBtn}>
                <View style={[AppStyles.inputWrap, styles.unitDetailInput]}>
                  <PickerComponent onValueChange={handleForm} data={getUnit} name={'unitId'} placeholder='Unit' selectedItem={formData.unitId} />
                  {firstScreenValidate === true && formData.unitId === null && <ErrorMessage errorMessage={'Required'} />}
                </View>
                <View style={styles.mainDetailViewBtn}>
                  <TouchableOpacity style={[styles.unitDetailBtn]} onPress={() => { formData.unitId != null && openUnitDetailsModal(formData.unitId, true) }}>
                    <Text style={styles.detailBtnText}>Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* **************************************** */}
            <SimpleInputText
              name={'unitPrice'}
              fromatName={'unitPrice'}
              placeholder={'Unit Price'}
              label={'UNIT PRICE'}
              value={unitPrice}
              formatValue={unitPrice}
              editable={false}
              keyboardType={'numeric'}
            />

            {/* **************************************** */}
            <SimpleInputText
              name={'discount'}
              placeholder={'Discount'}
              label={'DISCOUNT'}
              value={formData.discount}
              keyboardType={'numeric'}
              onChangeHandle={handleForm}
              formatValue={formData.discountedPrice}
              // editable={checkForTokenEdit}
              fromatName={false}
            />
            {/* {firstScreenValidate === true && formData.projectId === '' && <ErrorMessage errorMessage={'Required'} />} */}

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <View style={[AppStyles.inputWrap]}>
                <PickerComponent
                  onValueChange={handleForm}
                  data={paymentPlan}
                  name={'paymentPlan'}
                  placeholder='Payment Plan'
                  selectedItem={formData.paymentPlan}
                // enabled={checkForTokenEdit}
                />
                {firstScreenValidate === true && formData.paymentPlan === null && <ErrorMessage errorMessage={'Required'} />}
              </View>
            </View>

            {/* **************************************** */}

            {/* **************************************** */}
            {
              formData.token != '' && formData.token != null ?
                <SimpleInputText
                  name={'token'}
                  fromatName={'token'}
                  placeholder={'Token'}
                  label={'TOKEN'}
                  value={formData.token}
                  formatValue={formData.token}
                  editable={false}
                  keyboardType={'numeric'}
                />
                :
                <View style={[AppStyles.mainInputWrap]}>
                  <TouchableOpacity style={styles.bookNowBtn} onPress={() => { tokenModalToggle(true) }}>
                    <Text style={styles.bookNowBtnText}>ADD TOKEN</Text>
                  </TouchableOpacity>
                  {
                    firstScreenValidate === true ?
                      formData.token === null || formData.token === '' ?
                        <ErrorMessage errorMessage={'Token Required'} />
                        : null
                      : null
                  }
                </View>
            }

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <View style={styles.backgroundBlue}>
                <Text style={styles.finalPrice}>FINAL PRICE</Text>
                <Text style={styles.priceValue}>{currencyConvert(remainingPayment != null ? remainingPayment : '')}</Text>
                <Text style={styles.sidePriceFormat}>{formatPrice(remainingPayment != null ? remainingPayment : '')}</Text>
              </View>
            </View>

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <TouchableOpacity style={styles.bookNowBtn} onPress={() => { firstScreenConfirmModal(true) }}>
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
    lead: store.lead.lead
  }
}

export default connect(mapStateToProps)(InnerForm)


