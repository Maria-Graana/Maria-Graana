/** @format */

import React, { Component } from 'react'
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native'
import { StyleProvider } from 'native-base'
import DetailForm from './detailForm'
import AppStyles from '../../AppStyles'
import getTheme from '../../../native-base-theme/components'
import formTheme from '../../../native-base-theme/variables/formTheme'
import axios from 'axios'
import { connect } from 'react-redux'
import helper from '../../helper'
import _ from 'underscore'
import { getAllCountries } from 'react-native-country-picker-modal'
import { setSelectedContact } from '../../actions/armsContacts'

var defaultCountry = { name: 'PK', code: '+92' }
class AddClient extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkValidation: false,
      cities: [],
      getClients: [],
      getProject: [],
      loading: false,
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        cnic: '',
        familyMember: '',
        contactNumber: '',
        address: '',
        secondaryAddress: '',
        contact1: '',
        contact2: '',
        accountTitle: '',
        bank: '',
        iBan: '',
        bookUnit: true,
        contactRegistrationId: null,
      },
      emailValidate: true,
      phoneValidate: false,
      cnicValidate: false,
      contact1Validate: false,
      contact2Validate: false,
      phoneVerified: false,
      countryCode: defaultCountry.name,
      countryCode1: defaultCountry.name,
      countryCode2: defaultCountry.name,
      callingCode: defaultCountry.code,
      callingCode1: defaultCountry.code,
      callingCode2: defaultCountry.code,
      contactNumberCheck: '',
      countries: [],
      accountsOptionFields: false,
    }
  }
  componentDidMount() {
    const { route, navigation } = this.props
    navigation.setParams({ title: 'ADD CLIENT INFO' })

    const { isFromScreen, data } = route.params
    if (isFromScreen === 'ContactRegistration' && data) {
      let copyForm = { ...this.state.formData }
      copyForm.firstName = data.firstName
      copyForm.lastName = data.lastName
      copyForm.contactNumber = data.phone ? data.phone.phone : ''
      copyForm.contact1 = data.contact1 ? data.contact1.contact1 : ''
      copyForm.contact2 = data.contact2 ? data.contact2.contact2 : ''
      copyForm.contactRegistrationId = data.contactRegistrationId
      this.setState(
        {
          formData: copyForm,
          countryCode: data.phone ? data.phone.countryCode : defaultCountry.name,
          callingCode: data.phone ? data.phone.dialCode : defaultCountry.code,
          countryCode1: data.contact1 ? data.contact1.countryCode : defaultCountry.name,
          callingCode1: data.contact1 ? data.contact1.dialCode : defaultCountry.code,
          countryCode2: data.contact2 ? data.contact2.countryCode : defaultCountry.name,
          callingCode2: data.contact2 ? data.contact2.dialCode : defaultCountry.code,
        },
        () => { }
      )
    }
    if ('update' in route.params && route.params.update) {
      navigation.setParams({ title: 'UPDATE CLIENT INFO' })
      getAllCountries().then((countries) => {
        this.setState({ countries }, () => this.fetchCountryCode())
      })
    }
  }

  fetchCountryCode = () => {
    const { countries } = this.state
    const { client } = this.props.route.params
    let contact1 = client.contact1 ? client.contact1.substring(1) : null
    let contact2 = client.contact2 ? client.contact1.substring(1) : null
    let phone = client.phone ? client.phone.substring(1) : null
    let countryCode = null
    let countryCode1 = null
    let countryCode2 = null
    let cca2Contact = null
    let cca2Contact1 = null
    let cca2Contact2 = null
    let contactBool = false
    let contact1Bool = false
    let contact2Bool = false
    for (let i = 0; i < client.customerContacts.length; i++) {
      if (i === 0)
        phone = client.customerContacts[i].phone
          ? client.customerContacts[i].phone.substring(1)
          : null
      if (i === 1)
        contact1 = client.customerContacts[i].phone
          ? client.customerContacts[i].phone.substring(1)
          : null
      if (i === 2)
        contact2 = client.customerContacts[i].phone
          ? client.customerContacts[i].phone.substring(1)
          : null
    }
    let result = _.map(_.where(countries), function (country) {
      return { callingCode: country.callingCode, cca2: country.cca2 }
    })
    let newResult = []
    if (result.length) {
      result.map((item) => {
        let callingCode = item.callingCode
        if (callingCode.length) {
          callingCode.map((code) => {
            let obj = {
              cca2: item.cca2,
              callingCode: Number(code),
            }
            newResult.push(obj)
          })
        }
      })
    }
    newResult = _.sortBy(newResult, 'callingCode').reverse()
    for (let i = 0; i < newResult.length; i++) {
      if (phone && phone.startsWith(newResult[i].callingCode)) {
        if (!contactBool) {
          if (!client.customerContacts[0].dialCode) {
            countryCode = '+' + newResult[i].callingCode
            cca2Contact = newResult[i].cca2
            contactBool = true
          } else {
            countryCode = client.customerContacts[0].dialCode
            cca2Contact = client.customerContacts[0].countryCode
          }
        }
      }
      if (contact1 && contact1.startsWith(newResult[i].callingCode)) {
        if (!contact1Bool) {
          if (!client.customerContacts[1].dialCode) {
            countryCode1 = '+' + newResult[i].callingCode
            cca2Contact1 = newResult[i].cca2
            contact1Bool = true
          } else {
            countryCode1 = client.customerContacts[1].dialCode
            cca2Contact1 = client.customerContacts[1].countryCode
          }
        }
      }
      if (contact2 && contact2.startsWith(newResult[i].callingCode)) {
        if (!contact2Bool) {
          if (!client.customerContacts[2].dialCode) {
            countryCode2 = '+' + newResult[i].callingCode
            cca2Contact2 = newResult[i].cca2
            contact2Bool = true
          } else {
            countryCode2 = client.customerContacts[2].dialCode
            cca2Contact2 = client.customerContacts[2].countryCode
          }
        }
      }
      if (contactBool && contact1Bool && contact2Bool) break
    }
    this.setState(
      {
        countryCode: cca2Contact ? cca2Contact.toUpperCase() : 'PK',
        countryCode1: cca2Contact1 ? cca2Contact1.toUpperCase() : 'PK',
        countryCode2: cca2Contact2 ? cca2Contact2.toUpperCase() : 'PK',
        callingCode: countryCode ? countryCode : '+92',
        callingCode1: countryCode1 ? countryCode1 : '+92',
        callingCode2: countryCode2 ? countryCode2 : '+92',
      },
      () => this.updateFields()
    )
  }
  setDialCode = (callingCode) => {
    return callingCode.startsWith('+') ? callingCode : '+' + callingCode
  }
  setPhoneNumber = (dialCode, phone) => {
    let number = ''
    let withoutPlus = dialCode.replace('+', '')
    if (phone && phone.startsWith('+')) {
      if (phone && phone.startsWith(dialCode)) number = phone.replace(dialCode, '')
      else number = phone
    } else {
      if (phone && phone.startsWith(withoutPlus)) number = number.replace(withoutPlus, '')
      else number = phone
    }
    return number
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

  validateEmail = (value) => {
    let res = helper.validateEmail(value)
    if (value !== '') this.setState({ emailValidate: res })
    else this.setState({ emailValidate: true })
  }

  validatePhone = (value) => {
    if (value.length < 4 && value !== '') this.setState({ phoneValidate: true })
    else this.setState({ phoneValidate: false })
  }

  validateContact1 = (value) => {
    if (value.length < 4 && value !== '') this.setState({ contact1Validate: true })
    else this.setState({ contact1Validate: false })
  }

  validateContact2 = (value) => {
    if (value.length < 4 && value !== '') this.setState({ contact2Validate: true })
    else this.setState({ contact2Validate: false })
  }

  validateCnic = (value) => {
    if (value.length < 7 || (value.length > 8 && value.length < 13 && value !== ''))
      this.setState({ cnicValidate: true })
    else this.setState({ cnicValidate: false })
  }

  handleForm = (value, name) => {
    const { formData } = this.state
    if (name == 'cnic') {
      this.validateCnic(value)
    }
    if (name == 'email') this.validateEmail(value)
    if (name === 'contactNumber') {
      this.validatePhone(value)
    }
    if (name == 'contact1') this.validateContact1(value)
    if (name == 'contact2') this.validateContact2(value)
    formData[name] = value
    this.setState({ formData, contactNumberCheck: name })
  }
  call = (body) => {
    const { contacts } = this.props
    let response = helper.contacts(body.phone, contacts)
    if (!response) helper.addContact(body)
    else console.log('Contact is Already Saved!')
  }
  checkUndefined = (callingCode) => {
    if (callingCode) {
      let withoutPlus = callingCode.replace('+', '')
      callingCode = callingCode.startsWith('+') ? callingCode : '+' + callingCode
      return withoutPlus === 'undefined' || !withoutPlus ? '+92' : callingCode
    } else return (callingCode = '+92')
  }
  checkNum = (num, callingCode) => {
    if (num != '') {
      if (num.startsWith('+')) return num
      else return callingCode + '' + num
    }
    return null
  }
  createPayload = () => {
    let {
      formData,
      countryCode,
      countryCode1,
      countryCode2,
      callingCode,
      callingCode1,
      callingCode2,
    } = this.state
    callingCode = this.checkUndefined(callingCode)
    callingCode1 = this.checkUndefined(callingCode1)
    callingCode2 = this.checkUndefined(callingCode2)
    let phone1 = this.checkNum(formData.contactNumber, callingCode)
    let phone2 = this.checkNum(formData.contact1, callingCode1)
    let phone3 = this.checkNum(formData.contact2, callingCode2)
    const { screenName } = this.props.route.params
    if (screenName === 'Payments') {
      let body = {
        first_name: helper.capitalize(formData.firstName),
        last_name: helper.capitalize(formData.lastName),
        email: formData.email,
        cnic: formData.cnic,
        phone: {
          countryCode: callingCode === '+92' ? 'PK' : countryCode,
          phone: phone1 ? phone1.replace(/\s+/g, '') : null,
          dialCode: callingCode,
        },
        address: formData.address,
        secondary_address: formData.secondaryAddress,
        contact1: {
          countryCode: callingCode1 === '+92' ? 'PK' : countryCode1,
          contact1: phone2 ? phone2.replace(/\s+/g, '') : null,
          dialCode: callingCode1,
        },
        contact2: {
          countryCode: callingCode2 === '+92' ? 'PK' : countryCode2,
          contact2: phone3 ? phone3.replace(/\s+/g, '') : null,
          dialCode: callingCode2,
        },
        familyMember: formData.familyMember,
        bank: formData.bank,
        accountTitle: formData.accountTitle,
        iBan: formData.iBan,
        bookUnit: formData.bookUnit,
      }
      if (!body.contact1.contact1) delete body.contact1
      if (!body.contact2.contact2) delete body.contact2
      return body
    } else {
      let body = {
        first_name: helper.capitalize(formData.firstName),
        last_name: helper.capitalize(formData.lastName),
        email: formData.email,
        cnic: formData.cnic,
        phone: {
          countryCode: callingCode === '+92' ? 'PK' : countryCode,
          phone: phone1 ? phone1.replace(/\s+/g, '') : null,
          dialCode: callingCode,
        },
        address: formData.address,
        secondary_address: formData.secondaryAddress,
        contact1: {
          countryCode: callingCode1 === '+92' ? 'PK' : countryCode1,
          contact1: phone2 ? phone2.replace(/\s+/g, '') : null,
          dialCode: callingCode1,
        },
        contact2: {
          countryCode: callingCode2 === '+92' ? 'PK' : countryCode2,
          contact2: phone3 ? phone3.replace(/\s+/g, '') : null,
          dialCode: callingCode2,
        },
        familyMember: formData.familyMember,
        bank: formData.bank,
        accountTitle: formData.accountTitle,
        iBan: formData.iBan,
      }
      if (!body.contact1.contact1) delete body.contact1
      if (!body.contact2.contact2) delete body.contact2
      return body
    }
  }

  updatePayload = () => {
    let {
      formData,
      countryCode,
      countryCode1,
      countryCode2,
      callingCode,
      callingCode1,
      callingCode2,
    } = this.state
    let checkForPlus = formData.contactNumber.substring(0, 1)
    let checkForPlus2 = formData.contact1.substring(0, 1)
    let checkForPlus3 = formData.contact2.substring(0, 1)
    let newCallingCode = this.setDialCode(callingCode)
    let newCallingCode1 = this.setDialCode(callingCode1)
    let newCallingCode2 = this.setDialCode(callingCode2)
    newCallingCode = this.checkUndefined(callingCode)
    newCallingCode1 = this.checkUndefined(newCallingCode1)
    newCallingCode2 = this.checkUndefined(newCallingCode2)
    let body = {
      first_name: helper.capitalize(formData.firstName),
      last_name: helper.capitalize(formData.lastName),
      email: formData.email,
      cnic: formData.cnic & (formData.cnic === '') ? null : formData.cnic,
      phone: {
        countryCode: newCallingCode === '+92' ? 'PK' : countryCode,
        phone:
          checkForPlus === '+'
            ? formData.contactNumber
            : newCallingCode + '' + formData.contactNumber,
        dialCode: newCallingCode,
      },
      address: formData.address,
      secondary_address: formData.secondaryAddress,
      contact1: {
        countryCode: newCallingCode1 === '+92' ? 'PK' : countryCode1,
        phone:
          checkForPlus2 == '+'
            ? formData.contact1
            : formData.contact1 != ''
              ? newCallingCode1 + '' + formData.contact1
              : null,
        dialCode: newCallingCode1,
      },
      contact2: {
        countryCode: newCallingCode2 === '+92' ? 'PK' : countryCode2,
        phone:
          checkForPlus3 == '+'
            ? formData.contact2
            : formData.contact2 != ''
              ? newCallingCode2 + '' + formData.contact2
              : null,
        dialCode: newCallingCode2,
      },
      familyMember: formData.familyMember,
      bank: formData.bank,
      accountTitle: formData.accountTitle,
      iBan: formData.iBan,
      bookunit: formData.bookunit,
    }
    body.customersContacts = []
    body.customersContacts.push(body.phone)
    if (body.contact1.phone && body.contact1.phone !== '')
      body.customersContacts.push(body.contact1)
    if (body.contact2.phone && body.contact2.phone !== '')
      body.customersContacts.push(body.contact2)
    delete body.contact1
    delete body.contact2
    return body
  }
  checkRequiredField = () => {
    const { formData } = this.state
    let checkOptionalFields = false
    if (formData.bank === '') {
      if (
        (formData.iBan && formData.iBan !== '') ||
        (formData.accountTitle && formData.accountTitle !== '')
      )
        checkOptionalFields = true
    }
    if (formData.iBan === '') {
      if (
        (formData.bank && formData.bank !== '') ||
        (formData.accountTitle && formData.accountTitle !== '')
      )
        checkOptionalFields = true
    }
    if (formData.accountTitle === '') {
      if ((formData.iBan && formData.iBan !== '') || (formData.bank && formData.bank !== ''))
        checkOptionalFields = true
    }
    return checkOptionalFields
  }
  formSubmit = () => {
    const { formData, emailValidate, phoneValidate, cnicValidate } = this.state
    const { route, navigation, contacts, armsContacts } = this.props
    const { update, client, isFromDropDown, screenName, isPOC, isFromScreen = null } = route.params
    if (formData.cnic && formData.cnic !== '') formData.cnic = formData.cnic.replace(/\-/g, '')
    if (
      !formData.firstName ||
      !formData.lastName ||
      (screenName === 'Payments' ? !formData.cnic : !formData.contactNumber) ||
      this.checkRequiredField()
    ) {
      this.setState({
        checkValidation: true,
        accountsOptionFields: this.checkRequiredField(),
      })
    } else {
      if (emailValidate && !phoneValidate && !cnicValidate) {
        if (formData.cnic === '') formData.cnic = null
        if (!update) {
          let body = this.createPayload()
          body.name = body.first_name + ' ' + body.last_name
          this.setState({ loading: true })
          axios
            .post(`/api/customer/create`, body)
            .then((res) => {
              if (res.status === 200 && res.data) {
                if (formData.contactRegistrationId) {
                  let isContactExists = armsContacts.find(
                    (item) => item.id === formData.contactRegistrationId
                  )
                  if (isContactExists) {
                    this.deleteARMSContact(formData.contactRegistrationId)
                  }
                }
                if (res.data.message !== 'CLIENT CREATED') {
                  // Error Messages
                  if (res.data.message === 'Client already exists') {
                    helper.errorToast(res.data.message)
                  }
                } else {
                  helper.successToast(res.data.message)
                  isFromDropDown
                    ? isPOC
                      ? navigation.navigate(screenName, {
                        selectedPOC: res.data.id
                          ? {
                            ...res.data,
                            firstName: res.data.first_name ? res.data.first_name : '',
                            lastName: res.data.last_name ? res.data.last_name : '',
                          }
                          : null,
                      })
                      : navigation.navigate(screenName, {
                        client: res.data.id ? res.data : null,
                        name: res.data.first_name
                          ? res.data.first_name + ' ' + res.data.last_name
                          : null,
                      })
                    : isFromScreen
                      ? navigation.navigate('Contacts')
                      : navigation.navigate('Client', {
                        isUnitBooking: false,                 
                      })
           
                }
              }
            })
            .catch((error) => {
              console.log(error)
              helper.errorToast('ERROR CREATING CLIENT')
            })
            .finally(() => {
              this.setState({ loading: false })
            })
        } else {
          let body = this.updatePayload()
          this.setState({ loading: true })
          axios
            .patch(`/api/customer/update?id=${client.id}`, body)
            .then((res) => {
              if (res.data.message) {
                helper.errorToast(res.data.message)
              } else {
                helper.successToast('CLIENT UPDATED')
                body.name = body.first_name + ' ' + body.last_name
                //this.call(body)
                navigation.goBack()
              }
            })
            .catch((error) => {
              console.log(error)
              helper.errorToast('ERROR UPDATING CLIENT')
            })
            .finally(() => {
              this.setState({ loading: false })
            })
        }
      }
    }
  }

  getTrimmedPhone = (number) => {
    if (number.startsWith('03')) {
      number = number.substring(1)
    }
    return number
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

  deleteARMSContact = (id) => {
    let endPoint = ``
    const { dispatch } = this.props
    endPoint = `/api/contacts/delete`
    axios
      .delete(endPoint, { data: { id } })
      .then(function (response) { })
      .catch(function (error) {
        console.log(error)
      })
      .finally(() => {
        dispatch(setSelectedContact(null))
      })
  }

  hello = (object, name) => {
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

  render() {
    const {
      formData,
      cities,
      getClients,
      getProject,
      phoneValidate,
      emailValidate,
      cnicValidate,
      contact2Validate,
      contact1Validate,
      countryCode,
      countryCode1,
      countryCode2,
      contactNumberCheck,
      loading,
      accountsOptionFields,
    } = this.state
    const { route } = this.props
    const { update, client, screenName } = route.params
    return (
      <View style={[AppStyles.container]}>
        <StyleProvider style={getTheme(formTheme)}>
          <KeyboardAvoidingView enabled>
            <ScrollView keyboardShouldPersistTaps="always">
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                  <DetailForm
                    formSubmit={this.formSubmit}
                    checkValidation={this.state.checkValidation}
                    handleForm={this.handleForm}
                    formData={formData}
                    cities={cities}
                    getClients={getClients}
                    getProject={getProject}
                    update={update}
                    phoneValidate={phoneValidate}
                    emailValidate={emailValidate}
                    cnicValidate={cnicValidate}
                    contact2Validate={contact2Validate}
                    contact1Validate={contact1Validate}
                    countryCode={countryCode}
                    countryCode1={countryCode1}
                    countryCode2={countryCode2}
                    contactNumberCheck={contactNumberCheck}
                    getTrimmedPhone={this.getTrimmedPhone}
                    validate={this.validate}
                    loading={loading}
                    hello={this.hello}
                    accountsOptionFields={accountsOptionFields}
                    client={client}
                    screenName={screenName}
                  />
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </KeyboardAvoidingView>
        </StyleProvider>
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    contacts: store.contacts.contacts,
    armsContacts: store.armsContacts.armsContacts,
  }
}

export default connect(mapStateToProps)(AddClient)
