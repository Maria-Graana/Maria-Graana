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
import PriceSlider from '../../components/PriceSlider';

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
      onSliderValueChange
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
            {/* {
              checkValidation === true && formData.projectType === '' && <ErrorMessage errorMessage={'Required'} />
            } */}
          </View>
        </View>
        <View style={[AppStyles.multiFormInput, AppStyles.mainInputWrap, { justifyContent: 'space-between', alignItems: 'center' }]}>

          <TextInput placeholder='Price Min'
           value={formatPrice(formData.minPrice)}
            style={[AppStyles.formControl, styles.priceStyle]}
            editable={false}
          />
          <Text style={styles.toText}>to</Text>
          <TextInput placeholder='Price Max'
             value={formatPrice(formData.maxPrice)}
            style={[AppStyles.formControl, styles.priceStyle]}
            editable={false}
          />
        </View>

        <PriceSlider priceValues={StaticData.PricesProject} onSliderValueChange={(values)=> onSliderValueChange(values)}/>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <Button
            onPress={() => { formSubmit(formData) }}
            style={[AppStyles.formBtn, styles.addInvenBtn]}>
            <Text style={AppStyles.btnText}>CREATE LEAD</Text>
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

