import React, { Component } from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import { Button } from 'native-base';
import PickerComponent from '../../components/Picker/index';
import styles from './style';
import AppStyles from '../../AppStyles';
import ErrorMessage from '../../components/ErrorMessage'
import { connect } from 'react-redux';
import mobileIcon from '../../../assets/img/mobile.png'

class InnerForm extends Component {
  constructor(props) {
    super(props)
  }


  render() {

    const {
      formSubmit,
      checkValidation,
      handleForm,
      formData,
      cities,
      getRoles,
      organization,
    } = this.props
    return (
      <View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput onChangeText={(text) => { handleForm(text, 'firstName') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'First Name*'} />
            {
              checkValidation === true && formData.firstName == '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput onChangeText={(text) => { handleForm(text, 'lastName') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Last Name*'} />
            {
              checkValidation === true && formData.lastName === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>


        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput onChangeText={(text) => { handleForm(text, 'email') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Email*'} />
          </View>
        </View>


        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput onChangeText={(text) => { handleForm(text, 'password') }} secureTextEntry={true} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Password*'} />
            {
              checkValidation === true && formData.password === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput onChangeText={(text) => { handleForm(text, 'confirmPassword') }} secureTextEntry={true} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Confirm Password*'} />
            {
              checkValidation === true && formData.confirmPassword === '' && <ErrorMessage errorMessage={'Required'} />
            }
            {
              formData.confirmPassword != '' && formData.confirmPassword != formData.password && <ErrorMessage errorMessage={'Password do not match'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <Image source={mobileIcon} style={styles.mobileIcon} />
            <TextInput onChangeText={(text) => { handleForm(text, 'phoneNumber') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Contact Number*'} />
            {
              checkValidation === true && formData.phoneNumber === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput onChangeText={(text) => { handleForm(text, 'cnic') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'CNIC'} />
            {
              checkValidation === true && formData.cnic === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent onValueChange={handleForm} data={cities} selectedItem={formData.cityId} name={'cityId'} value={''} placeholder='City' />
            {
              checkValidation === true && formData.cityId === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput style={[AppStyles.formControl, styles.padLeft]} value={organization[0].name} editable={false} />
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput style={[AppStyles.formControl, styles.padLeft]} value={getRoles.name === 'sub_admin 2' && 'Sub-Role'} editable={false} />
          </View>
        </View>


        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <Button
            onPress={() => { formSubmit(formData) }}
            style={[AppStyles.formBtn, styles.addInvenBtn]}>
            <Text style={AppStyles.btnText}>CREATE USER</Text>
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

export default connect(mapStateToProps)(InnerForm)

