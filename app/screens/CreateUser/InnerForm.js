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

    return (
      <View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput onChangeText={(text) => { handleForm(text, 'firstName') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'First Name'} />
            {
              checkValidation === true && formData.firstName === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput onChangeText={(text) => { handleForm(text, 'lastName') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Last Name'} />
            {
              checkValidation === true && formData.lastName === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>


        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput onChangeText={(text) => { handleForm(text, 'email') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Email'} />
            {
              checkValidation === true && formData.email === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>


        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput onChangeText={(text) => { handleForm(text, 'password') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Password'} />
            {
              checkValidation === true && formData.password === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput onChangeText={(text) => { handleForm(text, 'confirmPassword') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Confirm Password'} />
            {
              checkValidation === true && formData.confirmPassword === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <Image source={mobileIcon} style={styles.mobileIcon}/>
            <TextInput onChangeText={(text) => { handleForm(text, 'contactNumber') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Contact Number'} />
            {
              checkValidation === true && formData.contactNumber === '' && <ErrorMessage errorMessage={'Required'} />
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
            <TextInput onChangeText={(text) => { handleForm(text, 'city') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'City'} />
            {
              checkValidation === true && formData.city === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput onChangeText={(text) => { handleForm(text, 'graana') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Graana'} />
            {
              checkValidation === true && formData.graana === '' && <ErrorMessage errorMessage={'Required'} />
            }
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap,]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput onChangeText={(text) => { handleForm(text, 'areaManager') }} style={[AppStyles.formControl, styles.padLeft]} placeholder={'Area Manager'} />
            {
              checkValidation === true && formData.areaManager === '' && <ErrorMessage errorMessage={'Required'} />
            }
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

