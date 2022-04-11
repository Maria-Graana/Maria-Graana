/** @format */

import { Textarea } from 'native-base'
import React, { Component } from 'react'
import { TextInput, View } from 'react-native'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles'
import ErrorMessage from '../../components/ErrorMessage'
import PhoneInputComponent from '../../components/PhoneCountry/PhoneInput'
import TouchableButton from '../../components/TouchableButton'
import styles from './style'

class DetailForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      phone: '+92432342432334',
    }
  }

  componentDidMount() {}

  render() {
    const {
      formSubmit,
      checkValidation,
      handleForm,
      formData,
      update,
      phoneValidate,
      emailValidate,
      cnicValidate,
      contact1Validate,
      contact2Validate,
      getTrimmedPhone,
      validate,
      hello,
      countryCode,
      countryCode1,
      countryCode2,
      loading,
      accountsOptionFields,
      client,
      user,
      screenName,
    } = this.props
    let btnText = update ? 'UPDATE' : 'ADD'
    return (
      <View>
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              placeholderTextColor={'#a8a8aa'}
              value={formData.firstName}
              onChangeText={(text) => {
                handleForm(text, 'firstName')
              }}
              style={[AppStyles.formControl, AppStyles.inputPadLeft]}
              name={'firstName'}
              placeholder={'First Name *'}
            />
            {checkValidation === true && formData.firstName === '' && (
              <ErrorMessage errorMessage={'Required'} />
            )}
          </View>
        </View>

        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              placeholderTextColor={'#a8a8aa'}
              value={formData.lastName}
              onChangeText={(text) => {
                handleForm(text, 'lastName')
              }}
              style={[AppStyles.formControl, AppStyles.inputPadLeft]}
              name={'lastName'}
              placeholder={'Last Name *'}
            />
            {checkValidation === true && formData.lastName === '' && (
              <ErrorMessage errorMessage={'Required'} />
            )}
          </View>
        </View>
        <View style={[AppStyles.mainInputWrap]}>
          {screenName === 'Payments' ? (
            <View style={[AppStyles.inputWrap]}>
              <PhoneInputComponent
                phoneValue={formData.contactNumber != '' && getTrimmedPhone(formData.contactNumber)}
                countryCodeValue={countryCode}
                containerStyle={AppStyles.phoneInputStyle}
                setPhone={(value) => validate(value, 'phone')}
                setFlagObject={(object) => {
                  hello(object, 'contactNumber')
                }}
                editable={client ? client.assigned_to_armsuser_id === user.id : true}
                onChangeHandle={handleForm}
                name={'contactNumber'}
                placeholder={'Contact Number'}
              />
              {contact1Validate == true && (
                <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />
              )}
            </View>
          ) : (
            <View style={[AppStyles.inputWrap]}>
              <PhoneInputComponent
                phoneValue={formData.contactNumber != '' && getTrimmedPhone(formData.contactNumber)}
                countryCodeValue={countryCode}
                containerStyle={AppStyles.phoneInputStyle}
                setPhone={(value) => validate(value, 'phone')}
                setFlagObject={(object) => {
                  hello(object, 'contactNumber')
                }}
                editable={client ? client.assigned_to_armsuser_id === user.id : true}
                onChangeHandle={handleForm}
                name={'contactNumber'}
                placeholder={'Contact Number*'}
              />
              {phoneValidate == true && (
                <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />
              )}
              {phoneValidate == false &&
                checkValidation === true &&
                formData.contactNumber === '' && <ErrorMessage errorMessage={'Required'} />}
            </View>
          )}
        </View>
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PhoneInputComponent
              phoneValue={formData.contact1 != '' && getTrimmedPhone(formData.contact1)}
              countryCodeValue={countryCode1}
              containerStyle={AppStyles.phoneInputStyle}
              setPhone={(value) => validate(value, 'phone')}
              setFlagObject={(object) => {
                hello(object, 'contact1')
              }}
              onChangeHandle={handleForm}
              name={'contact1'}
              placeholder={'Contact Number 2'}
            />
            {contact1Validate == true && (
              <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />
            )}
          </View>
        </View>
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PhoneInputComponent
              phoneValue={formData.contact2 != '' && getTrimmedPhone(formData.contact2)}
              countryCodeValue={countryCode2}
              containerStyle={AppStyles.phoneInputStyle}
              setPhone={(value) => validate(value, 'phone')}
              setFlagObject={(object) => {
                hello(object, 'contact2')
              }}
              onChangeHandle={handleForm}
              name={'contact2'}
              placeholder={'Contact Number 3'}
            />
            {contact2Validate == true && (
              <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />
            )}
          </View>
        </View>
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              placeholderTextColor={'#a8a8aa'}
              value={formData.email}
              keyboardType="email-address"
              autoCompleteType="email"
              onChangeText={(text) => {
                handleForm(text, 'email')
              }}
              style={[AppStyles.formControl, AppStyles.inputPadLeft]}
              name={'email'}
              placeholder={'Email'}
            />
            {emailValidate == false && (
              <ErrorMessage errorMessage={'Enter a Valid Email Address'} />
            )}
          </View>
        </View>
        <View style={[AppStyles.mainInputWrap]}>
          {screenName === 'Payments' ? (
            <View style={[AppStyles.inputWrap]}>
              <TextInput
                placeholderTextColor={'#a8a8aa'}
                keyboardType={'number-pad'}
                maxLength={15}
                value={formData.cnic}
                onChangeText={(text) => {
                  handleForm(text, 'cnic')
                }}
                style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                name={'cnic'}
                placeholder={'CNIC/NTN *'}
              />
              {cnicValidate && <ErrorMessage errorMessage={'Invalid CNIC/NTN format'} />}
              {checkValidation && formData.cnic === '' && (
                <ErrorMessage errorMessage={'Required'} />
              )}
            </View>
          ) : (
            <View style={[AppStyles.inputWrap]}>
              <TextInput
                placeholderTextColor={'#a8a8aa'}
                keyboardType={'number-pad'}
                maxLength={13}
                value={formData.cnic}
                onChangeText={(text) => {
                  handleForm(text, 'cnic')
                }}
                style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                name={'cnic'}
                placeholder={'CNIC/NTN'}
              />
              {cnicValidate == true && <ErrorMessage errorMessage={'Invalid CNIC/NTN format'} />}
            </View>
          )}
        </View>
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              placeholderTextColor={'#a8a8aa'}
              value={formData.familyMember}
              onChangeText={(text) => {
                handleForm(text, 'familyMember')
              }}
              style={[AppStyles.formControl, AppStyles.inputPadLeft]}
              name={'familyMember'}
              placeholder={'Son / Daughter/ Spouse of'}
            />
          </View>
        </View>
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              placeholderTextColor={'#a8a8aa'}
              value={formData.accountTitle}
              onChangeText={(text) => {
                handleForm(text, 'accountTitle')
              }}
              style={[AppStyles.formControl, AppStyles.inputPadLeft]}
              name={'accountTitle'}
              placeholder={'Account Title'}
            />
            {accountsOptionFields && formData.accountTitle === '' ? (
              <ErrorMessage errorMessage={'Required'} />
            ) : null}
          </View>
        </View>
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              placeholderTextColor={'#a8a8aa'}
              value={formData.iBan}
              onChangeText={(text) => {
                handleForm(text, 'iBan')
              }}
              style={[AppStyles.formControl, AppStyles.inputPadLeft]}
              name={'iBan'}
              placeholder={'IBAN'}
            />
            {accountsOptionFields && formData.iBan === '' ? (
              <ErrorMessage errorMessage={'Required'} />
            ) : null}
          </View>
        </View>
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              placeholderTextColor={'#a8a8aa'}
              value={formData.bank}
              onChangeText={(text) => {
                handleForm(text, 'bank')
              }}
              style={[AppStyles.formControl, AppStyles.inputPadLeft]}
              name={'bank'}
              placeholder={'Bank'}
            />
            {accountsOptionFields && formData.bank === '' ? (
              <ErrorMessage errorMessage={'Required'} />
            ) : null}
          </View>
        </View>
        <View style={[AppStyles.mainInputWrap]}>
          <Textarea
            placeholderTextColor={AppStyles.colors.subTextColor}
            style={[
              AppStyles.formControl,
              AppStyles.inputPadLeft,
              AppStyles.formFontSettings,
              styles.textArea,
            ]}
            rowSpan={5}
            placeholder="Address"
            onChangeText={(text) => handleForm(text, 'address')}
            value={formData.address}
          />
        </View>
        <View style={[AppStyles.mainInputWrap]}>
          <Textarea
            placeholderTextColor={AppStyles.colors.subTextColor}
            style={[
              AppStyles.formControl,
              AppStyles.inputPadLeft,
              AppStyles.formFontSettings,
              styles.textArea,
            ]}
            rowSpan={5}
            placeholder="Secondary Address"
            onChangeText={(text) => handleForm(text, 'secondaryAddress')}
            value={formData.secondaryAddress}
          />
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
            label={btnText}
            onPress={() => formSubmit(formData)}
            loading={loading}
          />
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
