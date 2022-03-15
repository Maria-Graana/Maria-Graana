/** @format */

import { Text, View, TextInput } from 'react-native'
import React, { Component } from 'react'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux'
import TouchableButton from '../../components/TouchableButton'
import ErrorMessage from '../../components/ErrorMessage'
import { addCall, createContact, setSelectedContact } from '../../actions/armsContacts'
import moment from 'moment'
import { getAllCountries } from 'react-native-country-picker-modal'
import PhoneInputComponent from '../../components/PhoneCountry/PhoneInput'

export class ContactRegistrationFeedback extends Component {
  constructor(props) {
    var defaultCountry = { name: 'PK', code: '+92' }
    super(props)
    this.state = {
      formData: {
        firstName: '',
        lastName: '',
        phone: '',
        id: null,
      },
      phoneValidate: false,
      checkValidation: false,
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
    const { selectedContact } = this.props
    if (selectedContact) {
      let copyContact = { ...this.state.formData }
      copyContact.firstName = selectedContact.firstName
      copyContact.lastName = selectedContact.lastName
      copyContact.phone = selectedContact.phone
      copyContact.id = selectedContact.id
      this.setState({ formData: copyContact })
    }
    getAllCountries().then((countries) => {
      this.setState({ countries }, () => this.fetchCountryCode())
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(setSelectedContact({}))
  }

  fetchCountryCode = () => {
    const { countries } = this.state
    const { selectedContact } = this.props
    console.log(selectedContact)
    // let contact1 = selectedContact.contact1 ? selectedContact.contact1.substring(1) : null
    // let contact2 = selectedContact.contact2 ? selectedContact.contact1.substring(1) : null
    // let phone = selectedContact.phone ? selectedContact.phone.substring(1) : null
    // let countryCode = null
    // let countryCode1 = null
    // let countryCode2 = null
    // let cca2Contact = null
    // let cca2Contact1 = null
    // let cca2Contact2 = null
    // let contactBool = false
    // let contact1Bool = false
    // let contact2Bool = false
    // for (let i = 0; i < client.customerContacts.length; i++) {
    //   if (i === 0)
    //     phone = client.customerContacts[i].phone
    //       ? client.customerContacts[i].phone.substring(1)
    //       : null
    //   if (i === 1)
    //     contact1 = client.customerContacts[i].phone
    //       ? client.customerContacts[i].phone.substring(1)
    //       : null
    //   if (i === 2)
    //     contact2 = client.customerContacts[i].phone
    //       ? client.customerContacts[i].phone.substring(1)
    //       : null
    // }
    // let result = _.map(_.where(countries), function (country) {
    //   return { callingCode: country.callingCode, cca2: country.cca2 }
    // })
    // let newResult = []
    // if (result.length) {
    //   result.map((item) => {
    //     let callingCode = item.callingCode
    //     if (callingCode.length) {
    //       callingCode.map((code) => {
    //         let obj = {
    //           cca2: item.cca2,
    //           callingCode: Number(code),
    //         }
    //         newResult.push(obj)
    //       })
    //     }
    //   })
    // }
    // newResult = _.sortBy(newResult, 'callingCode').reverse()
    // for (let i = 0; i < newResult.length; i++) {
    //   if (phone && phone.startsWith(newResult[i].callingCode)) {
    //     if (!contactBool) {
    //       if (!client.customerContacts[0].dialCode) {
    //         countryCode = '+' + newResult[i].callingCode
    //         cca2Contact = newResult[i].cca2
    //         contactBool = true
    //       } else {
    //         countryCode = client.customerContacts[0].dialCode
    //         cca2Contact = client.customerContacts[0].countryCode
    //       }
    //     }
    //   }
    //   if (contact1 && contact1.startsWith(newResult[i].callingCode)) {
    //     if (!contact1Bool) {
    //       if (!client.customerContacts[1].dialCode) {
    //         countryCode1 = '+' + newResult[i].callingCode
    //         cca2Contact1 = newResult[i].cca2
    //         contact1Bool = true
    //       } else {
    //         countryCode1 = client.customerContacts[1].dialCode
    //         cca2Contact1 = client.customerContacts[1].countryCode
    //       }
    //     }
    //   }
    //   if (contact2 && contact2.startsWith(newResult[i].callingCode)) {
    //     if (!contact2Bool) {
    //       if (!client.customerContacts[2].dialCode) {
    //         countryCode2 = '+' + newResult[i].callingCode
    //         cca2Contact2 = newResult[i].cca2
    //         contact2Bool = true
    //       } else {
    //         countryCode2 = client.customerContacts[2].dialCode
    //         cca2Contact2 = client.customerContacts[2].countryCode
    //       }
    //     }
    //   }
    //   if (contactBool && contact1Bool && contact2Bool) break
    // }
    // this.setState(
    //   {
    //     countryCode: cca2Contact ? cca2Contact.toUpperCase() : 'PK',
    //     countryCode1: cca2Contact1 ? cca2Contact1.toUpperCase() : 'PK',
    //     countryCode2: cca2Contact2 ? cca2Contact2.toUpperCase() : 'PK',
    //     callingCode: countryCode ? countryCode : '+92',
    //     callingCode1: countryCode1 ? countryCode1 : '+92',
    //     callingCode2: countryCode2 ? countryCode2 : '+92',
    //   },
    //   () => this.updateFields()
    // )
  }

  updateFields = () => {
    const { route } = this.props
    const { client } = route.params
    let { callingCode, callingCode1, callingCode2 } = this.state
    let newCallingCode = this.setDialCode(callingCode)
    let newCallingCode1 = this.setDialCode(callingCode1)
    let newCallingCode2 = this.setDialCode(callingCode2)
    let number = client.customerContacts.length
      ? this.setPhoneNumber(newCallingCode, client.customerContacts[0].phone)
      : ''
    let number1 =
      client.customerContacts.length > 1
        ? this.setPhoneNumber(newCallingCode1, client.customerContacts[1].phone)
        : ''
    let number2 =
      client.customerContacts.length > 2
        ? this.setPhoneNumber(newCallingCode2, client.customerContacts[2].phone)
        : ''

    //console.log(client)
    let formData = {
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      cnic: client.cnic ? String(client.cnic) : '',
      contactNumber: number,
      address: client.address,
      familyMember: client.familyMember,
      contact1: number1,
      contact2: number2,
      iBan: client.iBan,
      bank: client.bank,
      accountTitle: client.accountTitle,
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
    if (name === 'phone') {
      this.validatePhone(value)
    }
    formData[name] = value
    this.setState({ formData })
  }

  navigateToClientScreen = () => {
    const { navigation } = this.props
    const { formData } = this.state
    navigation.replace('AddClient', {
      title: 'ADD CLIENT INFO',
      data: formData,
      isFromScreen: 'ContactRegistration',
    })
  }

  performAction = (action) => {
    const { formData, phoneValidate } = this.state
    const { dispatch, armsContacts, navigation } = this.props
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      this.setState({
        checkValidation: true,
      })
    } else {
      if (!phoneValidate) {
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
            delete formData.id
            createContact(formData).then((res) => {
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

  setCountryCode = (object, name) => {
    if (name === 'phone') {
      this.setState({ countryCode: object.cca2, callingCode: '+' + object.callingCode[0] })
    }
    if (name === 'contact1') {
      this.setState({ countryCode1: object.cca2, callingCode1: '+' + object.callingCode[0] })
    }
    if (name === 'contact2') {
      this.setState({ countryCode2: object.cca2, callingCode2: '+' + object.callingCode[0] })
    }
  }

  getTrimmedPhone = (number) => {
    if (number.startsWith('03')) {
      number = number.substring(1)
    }
    return number
  }

  render() {
    const { formData, phoneValidate, checkValidation, countryCode } = this.state
    return (
      <View style={AppStyles.container}>
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
              // editable={formData.firstName === ''}
            />
          </View>
          {checkValidation === true && formData.firstName === '' && (
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
              // editable={formData.lastName === ''}
            />
          </View>
          {checkValidation === true && formData.lastName === '' && (
            <ErrorMessage errorMessage={'Required'} />
          )}
        </View>

        {/* **************************************** */}

        <View style={[AppStyles.inputWrap]}>
          <PhoneInputComponent
            phoneValue={formData.phone != '' && this.getTrimmedPhone(formData.phone)}
            countryCodeValue={countryCode}
            containerStyle={AppStyles.phoneInputStyle}
            setPhone={(value) => this.validate(value, 'phone')}
            setFlagObject={(object) => {
              this.setCountryCode(object, 'phone')
            }}
            // editable={client ? client.assigned_to_armsuser_id === user.id : true}
            onChangeHandle={this.handleForm}
            name={'phone'}
            placeholder={'Phone'}
          />
          {phoneValidate == true && <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />}
          {phoneValidate == false && checkValidation === true && formData.phone === '' && (
            <ErrorMessage errorMessage={'Required'} />
          )}
        </View>

        {/* <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              onChangeText={(text) => {
                this.handleForm(text, 'phone')
              }}
              placeholderTextColor={'#a8a8aa'}
              value={formData.phone}
              style={[AppStyles.formControl, AppStyles.inputPadLeft]}
              placeholder={'Phone'}
            />
          </View>
          {phoneValidate == true && <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />}
          {phoneValidate == false && checkValidation === true && formData.phone === '' && (
            <ErrorMessage errorMessage={'Required'} />
          )}
        </View> */}

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
      </View>
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
