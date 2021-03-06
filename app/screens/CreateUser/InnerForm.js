import React, { Component } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
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
      emailValidate,
      organization,
      cnicValidate,
      phoneValidate,
      handleAreaClick,
      showAreaDropdown,
    } = this.props

    let getRole = getRoles && getRoles.subRole && getRoles.subRole.replace(/\_/g, ' ')

    return (
      <View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput placeholderTextColor={'#a8a8aa'} onChangeText={(text) => { handleForm(text, 'firstName') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'First Name*'} />
            {
              checkValidation === true && formData.firstName == '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput placeholderTextColor={'#a8a8aa'} onChangeText={(text) => { handleForm(text, 'lastName') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Last Name*'} />
            {
              checkValidation === true && formData.lastName === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>


        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput placeholderTextColor={'#a8a8aa'} onChangeText={(text) => { handleForm(text, 'email') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Email*'} />
            {
              emailValidate == false && <ErrorMessage errorMessage={'Enter a Valid Email Address'} />
            }
            {
              checkValidation === true && formData.email === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>


        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput placeholderTextColor={'#a8a8aa'} onChangeText={(text) => { handleForm(text, 'password') }} secureTextEntry={true} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Password*'} />
            {
              checkValidation === true && formData.password === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput placeholderTextColor={'#a8a8aa'} onChangeText={(text) => { handleForm(text, 'confirmPassword') }} secureTextEntry={true} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Confirm Password*'} />
            {
              checkValidation === true && formData.confirmPassword === '' && <ErrorMessage errorMessage={'Required'} />
            }
            {
              checkValidation === true && formData.confirmPassword != '' && formData.confirmPassword != formData.password && <ErrorMessage errorMessage={'Password do not match'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <Image source={mobileIcon} style={styles.mobileIcon} />
            <TextInput placeholderTextColor={'#a8a8aa'} onChangeText={(text) => { handleForm(text, 'phoneNumber') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Contact Number*'} keyboardType={'number-pad'} maxLength={11} autoCompleteType='cc-number' />
            {
              checkValidation === true && formData.phoneNumber === '' && <ErrorMessage errorMessage={'Required'} />
            }
            {
              phoneValidate == true && <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput placeholderTextColor={'#a8a8aa'} onChangeText={(text) => { handleForm(text, 'cnic') }} keyboardType={'number-pad'} maxLength={15} style={[AppStyles.formControl, styles.padLeft]} placeholder={'CNIC*'} />
            {
              checkValidation === true && formData.cnic === '' && <ErrorMessage errorMessage={'Required'} />
            }
            {
              cnicValidate == true && <ErrorMessage errorMessage={'Enter a Valid CNIC Number'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent onValueChange={handleForm} data={cities} selectedItem={formData.cityId} name={'cityId'} value={''} placeholder='City*' />
            {
              checkValidation === true && formData.cityId === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput placeholderTextColor={'#a8a8aa'} style={[AppStyles.formControl, styles.padLeft]} value={organization[0].name} editable={false} />
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput placeholderTextColor={'#a8a8aa'} style={[AppStyles.formControl, styles.padLeft]} value={getRole} editable={false} />
          </View>
        </View>


        {
          showAreaDropdown === true &&
          // {/* **************************************** */ }
          < TouchableOpacity onPress={() => handleAreaClick()}  >
            <View style={[AppStyles.mainInputWrap, AppStyles.inputPadLeft, AppStyles.formControl, { justifyContent: 'center' }]} >
              <Text style={[AppStyles.formFontSettings, { color: formData.areas.length > 0 ? AppStyles.colors.textColor : AppStyles.colors.subTextColor }]} >
                {formData.areas.length > 0 ? `${formData.areas.length} Areas Selected` : 'Select Areas'}
              </Text>
            </View>
          </TouchableOpacity>
        }



        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <Button
            onPress={() => { formSubmit(formData) }}
            style={[AppStyles.formBtn, styles.addInvenBtn]}>
            <Text style={AppStyles.btnText}>CREATE USER</Text>
          </Button>
        </View>
      </View >
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(InnerForm)

