/** @format */

import { Text, View, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { Component } from 'react'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux'
import TouchableButton from '../../components/TouchableButton'
import ErrorMessage from '../../components/ErrorMessage'
import {
  addCall,
  createARMSContactPayload,
  createContact,
  setSelectedContact,
  updateARMSContact,
  updateContact,
} from '../../actions/armsContacts'
import moment from 'moment'
import { getAllCountries } from 'react-native-country-picker-modal'
import PhoneInputComponent from '../../components/PhoneCountry/PhoneInput'
import _ from 'underscore'

export class ContactRegistrationFeedback extends Component {
  constructor(props) {
    var defaultCountry = { name: 'PK', code: '+92' }
    super(props)
    this.state = {
      formData: {
        id: null,
        firstName: '',
        lastName: '',
        contactNumber: '',
        contact1: '',
        contact2: '',
      },
      phoneValidate: false,
      checkValidation: false,
      contact1Validate: false,
      contact2Validate: false,
      phoneVerified: false,
      countryCode: defaultCountry.name,
      countryCode1: defaultCountry.name,
      countryCode2: defaultCountry.name,
      callingCode: defaultCountry.code,
      callingCode1: defaultCountry.code,
      callingCode2: defaultCountry.code,
      countries: [],
    }
  }
  componentDidMount() {
    getAllCountries().then((countries) => {
      this.setState({ countries }, () => this.fetchCountryCode())
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(setSelectedContact(null))
  }

  fetchCountryCode = () => {
    const { countries } = this.state
    const { selectedContact } = this.props
    // console.log(selectedContact)
    this.setState(
      {
        countryCode:
          selectedContact && selectedContact.countryCode
            ? selectedContact.countryCode.toUpperCase()
            : 'PK',
        countryCode1:
          selectedContact && selectedContact.countryCode2
            ? selectedContact.countryCode2.toUpperCase()
            : 'PK',
        countryCode2:
          selectedContact && selectedContact.countryCode3
            ? selectedContact.countryCode3.toUpperCase()
            : 'PK',
        callingCode: selectedContact && selectedContact.dialCode ? selectedContact.dialCode : '+92',
        callingCode1:
          selectedContact && selectedContact.dialCode ? selectedContact.dialCode2 : '+92',
        callingCode2:
          selectedContact && selectedContact.dialCode ? selectedContact.dialCode3 : '+92',
      },
      () => this.updateFields()
    )
  }

  updateFields = () => {
    const { selectedContact } = this.props
    let number = selectedContact.phoneNumbers.length
      ? selectedContact.phoneNumbers[0].number.replace(/[() .+-]/g, '')
      : ''
    let number1 =
      selectedContact.phoneNumbers.length > 1
        ? selectedContact.phoneNumbers[1].number.replace(/[() .+-]/g, '')
        : ''
    let number2 =
      selectedContact.phoneNumbers.length > 2
        ? selectedContact.phoneNumbers[2].number.replace(/[() .+-]/g, '')
        : ''
    let formData = {
      firstName: selectedContact.firstName,
      lastName: selectedContact.lastName,
      id: selectedContact.id,
      contactNumber: number,
      contact1: number1,
      contact2: number2,
    }
    this.setState({ formData })
  }

  validatePhone = (value) => {
    if (value.length < 4 && value !== '') this.setState({ phoneValidate: true })
    else this.setState({ phoneValidate: false })
  }

  // ********* Form Handle Function
  handleForm = (value, name) => {
    const { formData } = this.state
    if (name === 'contactNumber') {
      this.validatePhone(value)
    }
    if (name == 'contact1') this.validateContact1(value)
    if (name == 'contact2') this.validateContact2(value)
    formData[name] = value
    this.setState({ formData })
  }

  navigateToClientScreen = () => {
    const { navigation, route } = this.props
    const {
      formData,
      countryCode,
      countryCode1,
      countryCode2,
      callingCode,
      callingCode1,
      callingCode2,
    } = this.state
    let body = createARMSContactPayload({
      ...formData,
      countryCode,
      countryCode1,
      countryCode2,
      callingCode,
      callingCode1,
      callingCode2,
    })
    navigation.navigate('AddClient', {
      title: 'ADD CLIENT INFO',
      data: body,
      isFromScreen: 'ContactRegistration',
    })
  }

  checkNum = (num, callingCode) => {
    if (num != '') {
      if (num.startsWith('+')) return num
      else return callingCode + '' + num
    }
    return null
  }

  performAction = (action) => {
    const {
      formData,
      phoneValidate,
      countryCode,
      countryCode1,
      countryCode2,
      callingCode,
      callingCode1,
      callingCode2,
      contact1Validate,
      contact2Validate,
    } = this.state
    const { dispatch, armsContacts, navigation } = this.props
    if (!formData.firstName || !formData.contactNumber) {
      this.setState({
        checkValidation: true,
      })
    } else {
      if (!phoneValidate && !contact1Validate && !contact2Validate) {
        if (action === 'register_as_client') {
          this.navigateToClientScreen()
        } else if (action === 'needs_further_contact' || action === 'not_interested') {
          let isContactExists = armsContacts.find((item) => item.id === formData.id)
          if (isContactExists) {
            // already exists in arms db
            addCall({
              feedback: action,
              armsContactId: formData.id,
              time: moment(),
            }).then((callRes) => {
              navigation.replace('Contacts')
            })
          } else {
            // Adding new contact to ARMS Contact DB
            delete formData.id
            let body = createARMSContactPayload({
              ...formData,
              countryCode,
              countryCode1,
              countryCode2,
              callingCode,
              callingCode1,
              callingCode2,
            })
            createContact(body).then((res) => {
              if (res) {
                addCall({
                  feedback: action,
                  armsContactId: res.id,
                  time: moment(),
                }).then((callRes) => {
                  navigation.replace('Contacts')
                })
              }
            })
          }
        } else if ('updateContact') {
          let body = updateARMSContact({
            ...formData,
            countryCode,
            countryCode1,
            countryCode2,
            callingCode,
            callingCode1,
            callingCode2,
          })
          updateContact(body).then((res) => {
            if (res) {
              navigation.replace('Contacts')
            }
          })
        }
      }
    }
  }

  validate(text, type) {
    var phonenum = /(?=.{10})/
    if (type == 'phone') {
      this.setState({ phone: text })
      if (phonenum.test(text)) {
        this.setState({ phoneVerified: true })
      } else {
        this.setState({ phoneVerified: false })
      }
    }
  }

  validateContact1 = (value) => {
    if (value.length < 4 && value !== '') this.setState({ contact1Validate: true })
    else this.setState({ contact1Validate: false })
  }

  validateContact2 = (value) => {
    if (value.length < 4 && value !== '') this.setState({ contact2Validate: true })
    else this.setState({ contact2Validate: false })
  }

  setCountryCode = (object, name) => {
    if (name === 'contactNumber') {
      this.setState({ countryCode: object.cca2, callingCode: '+' + object.callingCode[0] })
    }
    if (name === 'contact1') {
      this.setState({ countryCode1: object.cca2, callingCode1: '+' + object.callingCode[0] })
    }
    if (name === 'contact2') {
      this.setState({ countryCode2: object.cca2, callingCode2: '+' + object.callingCode[0] })
    }
  }

  setDialCode = (callingCode) => {
    return callingCode.startsWith('+') ? callingCode : '+' + callingCode
  }
  getTrimmedPhone = (number) => {
    if (number.startsWith('03')) {
      number = number.substring(1)
    }
    return number
  }

  render() {
    const {
      formData,
      phoneValidate,
      checkValidation,
      countryCode,
      countryCode1,
      countryCode2,
      contact2Validate,
      contact1Validate,
    } = this.state
    const { armsContacts } = this.props
    let isContactExists = armsContacts.find((item) => item.id === formData.id)
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView style={AppStyles.container}>
          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <TextInput
                onChangeText={(text) => {
                  this.handleForm(text, 'firstName')
                }}
                placeholderTextColor={'#a8a8aa'}
                value={formData.firstName}
                style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                placeholder={'First Name'}
              />
            </View>
            {checkValidation === true &&
              (formData.firstName === '' || formData.firstName === undefined) && (
                <ErrorMessage errorMessage={'Required'} />
              )}
          </View>
          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <TextInput
                onChangeText={(text) => {
                  this.handleForm(text, 'lastName')
                }}
                placeholderTextColor={'#a8a8aa'}
                value={formData.lastName}
                style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                placeholder={'Last Name'}
              />
            </View>
            {/* {checkValidation === true &&
              (formData.lastName === '' || formData.lastName === undefined) && (
                <ErrorMessage errorMessage={'Required'} />
              )} */}
          </View>

          {/* **************************************** */}

          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PhoneInputComponent
                phoneValue={
                  formData.contactNumber != '' && this.getTrimmedPhone(formData.contactNumber)
                }
                countryCodeValue={countryCode}
                containerStyle={AppStyles.phoneInputStyle}
                setPhone={(value) => this.validate(value, 'phone')}
                setFlagObject={(object) => {
                  this.setCountryCode(object, 'contactNumber')
                }}
                onChangeHandle={this.handleForm}
                name={'contactNumber'}
                placeholder={'Phone'}
                applyMaxLengthLimit={false}
              />
              {phoneValidate == true && (
                <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />
              )}
              {phoneValidate == false &&
                checkValidation === true &&
                formData.contactNumber === '' && <ErrorMessage errorMessage={'Required'} />}
            </View>
          </View>
          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PhoneInputComponent
                phoneValue={formData.contact1 != '' && this.getTrimmedPhone(formData.contact1)}
                countryCodeValue={countryCode1}
                containerStyle={AppStyles.phoneInputStyle}
                setPhone={(value) => this.validate(value, 'phone')}
                setFlagObject={(object) => {
                  this.setCountryCode(object, 'contact1')
                }}
                onChangeHandle={this.handleForm}
                name={'contact1'}
                placeholder={'Contact Number 2'}
                applyMaxLengthLimit={false}
              />
              {contact1Validate == true && (
                <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />
              )}
            </View>
          </View>
          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PhoneInputComponent
                phoneValue={formData.contact2 != '' && this.getTrimmedPhone(formData.contact2)}
                countryCodeValue={countryCode2}
                containerStyle={AppStyles.phoneInputStyle}
                setPhone={(value) => this.validate(value, 'phone')}
                setFlagObject={(object) => {
                  this.setCountryCode(object, 'contact2')
                }}
                onChangeHandle={this.handleForm}
                name={'contact2'}
                placeholder={'Contact Number 3'}
                applyMaxLengthLimit={false}
              />
              {contact2Validate == true && (
                <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />
              )}
            </View>
          </View>

          {/* **************************************** */}

          {isContactExists ? (
            <View style={[AppStyles.mainInputWrap]}>
              <TouchableButton
                containerStyle={[AppStyles.formBtn]}
                label={'UPDATE'}
                onPress={() => this.performAction('updateContact')}
              />
            </View>
          ) : null}

          {/* **************************************** */}

          <View style={[AppStyles.mainInputWrap]}>
            <TouchableButton
              containerStyle={[AppStyles.formBtn]}
              label={'REGISTER AS CLIENT'}
              onPress={() => this.performAction('register_as_client')}
            />
          </View>
          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <TouchableButton
              containerStyle={[AppStyles.formBtn]}
              containerBackgroundColor={'#fff'}
              borderColor={AppStyles.colors.primaryColor}
              textColor={AppStyles.colors.primaryColor}
              borderWidth={0.5}
              label={'NEEDS FURTHER CONTACT'}
              onPress={() => this.performAction('needs_further_contact')}
            />
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <TouchableButton
              containerStyle={[AppStyles.formBtn]}
              containerBackgroundColor={'#fff'}
              borderColor={AppStyles.colors.redBg}
              textColor={AppStyles.colors.redBg}
              borderWidth={0.5}
              label={'NOT INTERESTED'}
              onPress={() => this.performAction('not_interested')}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    )
  }
}

mapStateToProps = (store) => {
  return {
    armsContacts: store.armsContacts.armsContacts,
    selectedContact: store.armsContacts.selectedContact,
  }
}

export default connect(mapStateToProps)(ContactRegistrationFeedback)
