import React, { Component } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import styles from './style'
import PickerComponent from '../../components/Picker/index';
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux';
import moment from 'moment'
import SimpleInputText from '../../components/SimpleInputField'
import { SafeAreaView } from 'react-native-safe-area-context';
import StaticData from '../../StaticData';
import { formatPrice } from '../../PriceFormate';


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
    } = this.props
    return (
      <SafeAreaView style={styles.removePad}>
        <KeyboardAvoidingView>
          <View style={styles.mainFormWrap}>

            <View style={[AppStyles.mainInputWrap]}>
              <View style={[AppStyles.inputWrap]}>
                <PickerComponent onValueChange={handleForm} data={getProject} name={'projectId'} placeholder='Project' selectedItem={formData.projectId} />
              </View>
            </View>

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <View style={[AppStyles.inputWrap]}>
                <PickerComponent onValueChange={handleForm} data={getFloors} name={'floorId'} placeholder='Floor' selectedItem={formData.floorId} />
              </View>
            </View>

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <View style={styles.maiinDetailBtn}>
                <View style={[AppStyles.inputWrap, styles.unitDetailInput]}>
                  <PickerComponent onValueChange={handleForm} data={getUnit} name={'unitId'} placeholder='Unit' selectedItem={formData.unitId} />
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
              placeholder={'Unit Price'}
              label={'UNIT PRICE'}
              value={formData.unitPrice}
              formatValue={formData.unitPrice}
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
              formatValue={'2000000'}
            />

            <View>

            </View>
            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <View style={styles.backgroundBlue}>
                <Text style={styles.finalPrice}>FINAL PRICE</Text>
                <Text style={styles.priceValue}>100,00,00</Text>
                <Text style={styles.sidePriceFormat}>{formatPrice('10000000')}</Text>
              </View>
            </View>

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <View style={[AppStyles.inputWrap]}>
                <PickerComponent onValueChange={handleForm} data={paymentPlan} name={'floorId'} placeholder='Payment Plan' selectedItem={formData.floorId} />
              </View>
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


