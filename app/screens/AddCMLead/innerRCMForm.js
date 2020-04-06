import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from 'native-base';
import PickerComponent from '../../components/Picker/index';
import styles from './style';
import AppStyles from '../../AppStyles';
import ErrorMessage from '../../components/ErrorMessage'
import { connect } from 'react-redux';
import MultiSelect from 'react-native-multiple-select';

class InnerRCMForm extends Component {
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
      propertyType,
      subType,
      sizeUnit,
      size,
      getAreas,
    } = this.props

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
            <PickerComponent onValueChange={handleForm} data={cities} name={'city_id'} placeholder='select City' />
            {
              checkValidation === true && formData.city_id === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            {/* <PickerComponent onValueChange={handleForm} data={getAreas} name={'leadAreas'} placeholder='Select Area' /> */}
            <MultiSelect
              hideTags
              items={getAreas}
              uniqueKey="value"
              displayKey="name"
              ref={(component) => { this.multiSelect = component }}
              onSelectedItemsChange={(text) => handleForm(text, 'leadAreas')}
              selectedItems={formData.leadAreas}
              styleDropdownMenuSubsection={{
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 15,
                paddingRight: 10,
                backgroundColor: '#ffffff',
                borderWidth: 1,
                position: 'relative',
                borderRadius: 5,
                borderColor: '#f0f0f0',
                minHeight: 45,
              }}
              styleListContainer={styles.formControlMulti}
              searchInputStyle={styles.formControlMulti}
              searchInputPlaceholderText="Search Items..."
              selectedItemTextColor="#000"
              selectedItemIconColor="#757575"
              // submitButtonColor="#000"
              submitButtonText="Done"
            />
            {
              checkValidation === true && formData.leadAreas === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent onValueChange={handleForm} data={propertyType} name={'type'} placeholder='Property Type' />
            {
              checkValidation === true && formData.type === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent onValueChange={handleForm} data={subType} name={'subtype'} placeholder='Property Sub Type' />
            {
              checkValidation === true && formData.subtype === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={AppStyles.multiFormInput}>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap, AppStyles.flexOne]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={sizeUnit} name={'size_unit'} placeholder='Unit Size' />
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={size} name={'size'} placeholder='Size' />
            </View>
          </View>

        </View>

        {/* **************************************** */}
        <View style={AppStyles.multiFormInput}>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap, AppStyles.flexOne]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={size} name={'bed'} placeholder='Bed' />
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={size} name={'bath'} placeholder='Bath' />
            </View>
          </View>

        </View>


        {/* **************************************** */}
        <View style={AppStyles.multiFormInput}>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap, AppStyles.flexOne]}>
            <View style={[AppStyles.inputWrap]}>
              <TextInput onChangeText={(text) => { handleForm(text, 'min_price') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'min_price'} placeholder={'Min Price'} />
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
            <View style={[AppStyles.inputWrap]}>
              <TextInput onChangeText={(text) => { handleForm(text, 'max_price') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'max_price'} placeholder={'Max Price'} />
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

export default connect(mapStateToProps)(InnerRCMForm)

