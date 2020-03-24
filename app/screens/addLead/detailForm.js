import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from 'native-base';
import PickerComponent from '../../components/Picker/index';
import styles from './style';
import AppStyles from '../../AppStyles';
import ErrorMessage from '../../components/ErrorMessage'
import { connect } from 'react-redux';

class DetailForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      formData: {
        client: '',
        city: '',
        project: '',
        productType: '',
        minInvestment: '',
        maxInvestment: '',
      }
    }

    this.city = [
      { id: 1, name: 'object 1' },
      { id: 2, name: 'object 2' },
      { id: 3, name: 'object 3' },
      { id: 4, name: 'object 4' },
      { id: 5, name: 'object 5' },
      { id: 6, name: 'object 6' },
    ]
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
    } = this.props

    return (
      <View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent onValueChange={handleForm} data={getClients} name={'client'} placeholder='Client' />
            {
              checkValidation === true && formData.client === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent onValueChange={handleForm} data={cities} name={'city'} placeholder='Select City' />
            {
              checkValidation === true && formData.city === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent onValueChange={handleForm} data={this.city} value={''} name={'project'} value={''} placeholder='Project' />
            {
              checkValidation === true && formData.project === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent onValueChange={handleForm} data={this.city} value={''} name={'productType'} value={''} placeholder='Product Type' />
            {
              checkValidation === true && formData.productType === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        <View style={AppStyles.multiFormInput}>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap, AppStyles.flexOne]}>
            <View style={[AppStyles.inputWrap]}>
              <TextInput onChangeText={(text) => { handleForm(text, 'minInvestment') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'ownerNumber'} placeholder={'Owner Number'} />
              {
                checkValidation === true && formData.minInvestment === '' && <ErrorMessage errorMessage={'Required'} />
              }
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
            <View style={[AppStyles.inputWrap]}>
              <TextInput onChangeText={(text) => { handleForm(text, 'maxInvestment') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'ownerNumber'} placeholder={'Owner Number'} />
              {
                checkValidation === true && formData.maxInvestment === '' && <ErrorMessage errorMessage={'Required'} />
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

export default connect(mapStateToProps)(DetailForm)

