import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from 'native-base';
import PickerComponent from '../../components/Picker/index';
import styles from './style';
import AppStyles from '../../AppStyles';
import ErrorMessage from '../../components/ErrorMessage'
import { connect } from 'react-redux';
import StaticData from '../../StaticData'
import { formatPrice } from '../../PriceFormate'

class CMLeadFrom extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() { }

  render() {

    const {
      formSubmit,
      checkValidation,
      handleForm,
      formData,
      cities,
      getClients,
      getProject,
    } = this.props

    let minPrice = formData.minPrice

    return (
      <View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent onValueChange={handleForm} data={getClients} name={'customerId'} placeholder='Client' />
            {
              checkValidation === true && formData.customerId === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent onValueChange={handleForm} data={cities} name={'cityId'} placeholder='Select City' />
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent onValueChange={handleForm} data={getProject} name={'projectId'} value={''} placeholder='Project' />
            {
              checkValidation === true && formData.projectId === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent onValueChange={handleForm} data={StaticData.projectType} selectedItem={formData.projectType} name={'projectType'} value={''} placeholder='Product Type' />
            {
              checkValidation === true && formData.projectType === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        <View style={AppStyles.multiFormInput}>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap, AppStyles.flexOne]}>
            <View style={[AppStyles.inputWrap]}>
              <TextInput onChangeText={(text) => { handleForm(text, 'minPrice') }} style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.minMaxPrice]} placeholder={'Min Price'} />
              <Text style={[AppStyles.countPrice]}>{formatPrice(minPrice)}</Text>
              {
                checkValidation === true && formData.minPrice === '' && <ErrorMessage errorMessage={'Required'} />
              }
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
            <View style={[AppStyles.inputWrap]}>
              <TextInput onChangeText={(text) => { handleForm(text, 'maxPrice') }} style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.minMaxPrice]} placeholder={'Max Price'} />
              <Text style={[AppStyles.countPrice]}>{formatPrice(formData.maxPrice)}</Text>
              {
                checkValidation === true && formData.maxPrice === '' && <ErrorMessage errorMessage={'Required'} />
              }
            </View>
          </View>

        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <Button
            onPress={() => { formSubmit(formData) }}
            style={[AppStyles.formBtn, styles.addInvenBtn]}>
            <Text style={AppStyles.btnText}>ADD</Text>
          </Button>
        </View>
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(CMLeadFrom)

