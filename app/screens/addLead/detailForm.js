import React, { Component } from 'react';
import { View, Text } from 'react-native';
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

    this.city = ["Object 1", "Object 2", "Object 3", "Object 4", "Object 5", "Object 6"]
  }

  componentDidMount() { }

  handleForm = (value, name) => {
    const { formData } = this.state
    formData[name] = value
    this.setState({ formData })
  }


  render() {

    const { formSubmit, checkValidation } = this.props
    const { formData } = this.state

    console.log(checkValidation)
    
    return (
      <View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent onValueChange={this.handleForm} data={this.city} value={''} name={'client'} placeholder='Client' />
            {
              checkValidation === true && formData.client === '' && <ErrorMessage errorMessage={'Required'}/>
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent onValueChange={this.handleForm} data={this.city} value={''} name={'city'} placeholder='Select City' />
            {
              checkValidation === true && formData.city === '' && <ErrorMessage errorMessage={'Required'}/>
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent onValueChange={this.handleForm} data={this.city} value={''} name={'project'} value={''} placeholder='Project' />
            {
              checkValidation === true && formData.project === '' && <ErrorMessage errorMessage={'Required'}/>
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent onValueChange={this.handleForm} data={this.city} value={''} name={'productType'} value={''} placeholder='Product Type' />
            {
              checkValidation === true && formData.productType === '' && <ErrorMessage errorMessage={'Required'}/>
            }
          </View>
        </View>

        <View style={AppStyles.multiFormInput}>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap, AppStyles.flexOne]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent  onValueChange={this.handleForm} data={this.city} value={''} name={'minInvestment'} value={''} placeholder='Min Investment' />
              {
              checkValidation === true && formData.minInvestment === '' && <ErrorMessage errorMessage={'Required'}/>
            }
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent  onValueChange={this.handleForm} data={this.city} value={''} name={'maxInvestment'} value={''} placeholder='Max Investment' />
              {
              checkValidation === true && formData.maxInvestment === '' && <ErrorMessage errorMessage={'Required'}/>
            }
            </View>
          </View>

        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <Button
          onPress={() => {formSubmit(formData)}}
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

