import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button, Textarea } from 'native-base';
import PickerComponent from '../../components/Picker/index';
import styles from './style';
import AppStyles from '../../AppStyles';
import ErrorMessage from '../../components/ErrorMessage'
import { connect } from 'react-redux';
import StaticData from '../../StaticData'
import { formatPrice } from '../../PriceFormate'
import PriceSlider from '../../components/PriceSlider';
import TouchableInput from '../../components/TouchableInput';

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
      clientName,
      selectedCity,
      handleCityClick,
      handleClientClick,
      getProject,
      onSliderValueChange,
      getProductType,
    } = this.props
    
    return (
      <View>

        <TouchableInput placeholder="Client"
          onPress={() => handleClientClick()}
          value={clientName}
          showError={checkValidation === true && formData.customerId === ''}
          errorMessage="Required" />

        <TouchableInput placeholder="Select City"
          onPress={() => handleCityClick()}
          value={selectedCity ? selectedCity.name : ''}
          showError={checkValidation === true && formData.cityId === ''}
          errorMessage="Required" />

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
            <PickerComponent onValueChange={handleForm} data={getProductType} name={'projectType'} value={''} placeholder='Product Type' />
            {/* {
              checkValidation === true && formData.projectType === '' && <ErrorMessage errorMessage={'Required'} />
            } */}
          </View>
        </View>
        <View style={[AppStyles.multiFormInput, AppStyles.mainInputWrap, { justifyContent: 'space-between', alignItems: 'center' }]}>

          <TextInput placeholderTextColor={'#a8a8aa'} placeholder='Price Min'
            value={formData.minPrice === StaticData.Constants.any_value ? 'Any' : formatPrice(formData.minPrice)}
            style={[AppStyles.formControl, styles.priceStyle]}
            editable={false}
          />
          <Text style={styles.toText}>to</Text>
          <TextInput placeholderTextColor={'#a8a8aa'} placeholder='Price Max'
            value={formData.maxPrice === StaticData.Constants.any_value ? 'Any' : formatPrice(formData.maxPrice)}
            style={[AppStyles.formControl, styles.priceStyle]}
            editable={false}
          />
        </View>

        <PriceSlider priceValues={StaticData.PricesProject} initialValue={0} finalValue={StaticData.PricesProject.length - 1} onSliderValueChange={(values) => onSliderValueChange(values)} />
        <View style={[AppStyles.mainInputWrap]}>
          <Textarea
            value={formData.description}
            style={[AppStyles.formControl, Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 }, AppStyles.formFontSettings, { height: 100, paddingTop: 10, }]} rowSpan={5}
            placeholder="Description"
            onChangeText={(text) => handleForm(text, 'description')}
          />
        </View>

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

