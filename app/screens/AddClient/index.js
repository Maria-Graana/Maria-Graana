/** @format */

import React, { Component } from 'react'
import {
  View,
  KeyboardAvoidingView,

  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import { addEditCMLead, getAllProjects, setDefaultCMPayload } from '../../actions/cmLead'
import { setSelectedAreas } from './../../actions/areas'
import TouchableButton from '../../components/TouchableButton'
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import * as RootNavigation from '../../navigation/RootNavigation'
import { StyleProvider } from 'native-base'
import { refreshAddress, refreshMailingAddress, capitalizeFirstLetter } from "./ClientHelper";
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
      //invest states
      checkValidations: false,
      clientName: '',
      selectedClient: null,
      selectedCity: null,
      getInvestProject: [],
      getProductType: [],
      formType: 'sale',
      selectSubType: [],
      getAreas: [],
      loadings: false,
      investFormData: {
        customerId: '',
        cityId: '',
        projectId: '',
        projectType: '',
        armsProjectTypeId: null,
        minPrice: StaticData.PricesProject[0],
        maxPrice: StaticData.PricesProject[StaticData.PricesProject.length - 1],
        description: '',
      },

      //till

      //RentLead States

      organizations: [],
      checkRentValidation: false,
      clientName: '',
      selectedClient: null,
      //  selectedCity: null,
      getProject: [],
      formType: 'buy',
      priceList: [],
      sizeUnitList: [],
      selectSubType: [],
      loading: false,
      isBedBathModalVisible: false,

      isSizeModalVisible: false,
      modalType: 'none',
      RCMFormData: {
        type: '',
        subtype: '',
        leadAreas: [],
        customerId: '',
        city_id: '',
        size_unit: 'marla',
        description: '',
        org: '',
        bed: null,
        maxBed: null,
        bath: null,
        maxBath: null,
        size: StaticData.sizeMarla[0],
        maxSize: StaticData.sizeMarla[StaticData.sizeMarla.length - 1],
        minPrice: 0,
        maxPrice: 0,
      },


      //till

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
        //added 
        relationStatus: '',
        relativeName: '',
        profession: '',
        passport: '',
        nationality: '',
        dob: null,
        country: '',
        province: "",
        district: "",
        city: "",
        mCountry: "",
        mProvince: "",
        mDistrict: "",
        mCity: "",
        mAddress: "",
        purpose: "Select Lead Type",

        //need to confirm from backend
        clientSource: 'Personal Client',


        //till
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

  //Invest Lead

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

    const { user, } = this.props
    const { purpose } = this.props.route.params
    if (purpose) {
      this.setState({ formType: purpose }, () => {
        this.setPriceList()
      })
    } else {
      this.setPriceList()
    }




    const { dispatch, } = this.props
    dispatch(getAllProjects())



    navigation.addListener('focus', () => {
      this.onScreenFocused()

    })

    this.fetchOrganizations()
  }


  setEditValues = () => {
    const { route, CMLead, dispatch } = this.props
    const { lead = null, selectedCity, client, name } = route.params
    let copyObject = Object.assign({}, CMLead)
    copyObject.maxPrice = lead.maxPrice
    copyObject.minPrice = lead.minPrice
    copyObject.projectId = lead.project ? lead.project.id : ''
    copyObject.projectType = lead.projectType ? lead.projectType : ''
    copyObject.armsProjectTypeId = lead.productTypes ? String(lead.productTypes.id) : ''
    copyObject.customerId = client ? client.id : null
    copyObject.cityId = selectedCity ? selectedCity.value : null
    copyObject.description = lead.description
    this.setState({ selectedCity, selectedClient: client, name }, () => {
      dispatch(addEditCMLead(copyObject))
    })
  }



  setClient = () => {
    const { CMLead, route, dispatch } = this.props
    const { client, name } = route.params
    if (client && name) {

      let phones = []
      if (client.customerContacts && client.customerContacts.length) {
        client.customerContacts.map((item) => {
          phones.push(item.phone)
        })
      } else {
        if (client && client.phone) {
          phones.push(client.phone)
        }
      }
      this.setState({ selectedClient: client, clientName: name }, () => {
        dispatch(addEditCMLead({
          ...CMLead,
          phones: phones,
          customerId: client ? client.id : null
        }))
      })
    }
  }
  handleInvestForm = (value, name) => {



    const { CMLead, dispatch } = this.props
    const { getProductType } = this.state
    let copyObject = { ...CMLead }
    copyObject[name] = value;

    if (name === 'projectId') {

      this.getProductType(value)
    }

    if (name === 'projectType') {
      const getProName = getProductType.find((item) => {
        return item.value === value
      })
      copyObject['armsProjectTypeId'] = value
      copyObject['projectType'] = getProName.name
    }
    dispatch(addEditCMLead(copyObject))
  }


  investSubmitForm = (customerId) => {
    const { formData, callingCode, callingCode1, callingCode2, } = this.state;

    const { CMLead, investmentProjects, dispatch, route } = this.props

    const copyObject = { ...CMLead }
    copyObject.customerId = customerId


    let phone1 = this.checkNum(formData.contactNumber, callingCode)



    let phone2 = this.checkNum(formData.contact1, callingCode1)
    let phone3 = this.checkNum(formData.contact2, callingCode2)
    let Arr = [phone1.replace(/\s+/g, '')];
    if (phone2) {
      Arr.push(phone2.replace(/\s+/g, ''))
    }
    if (phone3) {
      Arr.push(phone3.replace(/\s+/g, ''))
    }

    copyObject.phones = phone1 ? Arr : null,


      dispatch(addEditCMLead(copyObject))

    if (!copyObject.customerId || !copyObject.cityId) {
      this.setState({
        checkValidations: true,
      })

    } else {
      if (copyObject.projectId && copyObject.projectId !== '') {
        let project = _.find(investmentProjects, function (item) {
          return item.value === copyObject.projectId
        })
        copyObject.projectName = project.name
      } else {
        copyObject.projectId = null
        copyObject.projectName = null
      }
      this.setState({ loading: true }, () => {

        // add lead
        axios
          .post(`/api/leads/project`, copyObject)
          .then((res) => {

            helper.successToast('Client and Invest lead have been registered successfully.')

            RootNavigation.navigateTo('Leads', {
              screen: 'Invest',
              screenName: 'AddClient'
            })
          })
          .catch((error) => {
            console.log(error)
            this.setState({ loading: false })
          })

      })
    }
  }




  changeStatus = (status) => {
    this.setState({
      formType: status,
    })
  }


  getProductType = async (id) => {
    const { investmentProjects } = this.props
    var getProType = _.pluck(
      _.filter(investmentProjects, (item) => item.value === id),
      'productType'
    )
    var getPro = []
    getProType[0].map((item) => {
      return getPro.push({ value: item.id.toString(), name: item.name })
    })
    this.setState({
      getProductType: getPro,
    })
    return getPro
  }


  //invest till


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
  //runs while updating
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
      contact1: number1,
      contact2: number2,
      country: client.country,
      passport: client.passport,
      province: client.province,
      district: client.district,
      city: client.city,
      relationStatus: client.relationStatus,
      relativeName: client.relativeName,
      profession: client.profession,
      mCountry: client.mCountry,
      mProvince: client.mProvince,
      mDistrict: client.mDistrict,
      mCity: client.mCity,
      mAddress: client.mAddress,
      nationality: client.nationality,
      dob: client.dob,
      clientSource: client.clientSource,

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


    if (name == 'country') {
      refreshAddress(formData)
    }

    if (name == 'mCountry') {
      refreshMailingAddress(formData)
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
        secondary_address: formData.address,
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


        //need to confirm about payment
        relationStatus: formData.relationStatus,
        relativeName: formData.relativeName,
        profession: formData.profession,
        passport: formData.passport,
        province: formData.province,
        district: formData.district,
        city: formData.city,
        mCountry: formData.mCountry,
        mProvince: formData.mProvince,
        mDistrict: formData.mDistrict,
        mCity: formData.mCity,
        mAddress: formData.mAddress,
        nationality: formData.nationality,
        dob: formData.dob,
        //

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
        address: formData.address,
        secondary_address: null,
        country: formData.country,
        email: formData.email,
        cnic: formData.cnic,
        clientSource:formData.clientSource,
        phone: {
          countryCode: callingCode === '+92' ? 'PK' : countryCode,
          phone: phone1 ? phone1.replace(/\s+/g, '') : null,
          dialCode: callingCode,
        },
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
        first_name: helper.capitalize(formData.firstName),
        last_name: helper.capitalize(formData.lastName),
        passport: formData.passport,
        province: formData.province,
        district: formData.district,
        city: formData.city,
        relationStatus: formData.relationStatus,
        relativeName: formData.relativeName,
        profession: formData.profession,
        mCountry: formData.mCountry,
        mProvince: formData.mProvince,
        mDistrict: formData.mDistrict,
        mCity: formData.mCity,
        mAddress: formData.mAddress,
        nationality: formData.nationality,
        dob: formData.dob,
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

      clientSource: formData.clientSource,
      nationality: formData.nationality,
      dob: formData.dob,

      mCountry: formData.mCountry,
      mProvince: formData.mProvince,
      mDistrict: formData.mDistrict,
      mCity: formData.mCity,
      mAddress: formData.mAddress,

      province: formData.province,
      district: formData.district,
      city: formData.city,
      passport: formData.passport,
      country: formData.country,
      relationStatus: formData.relationStatus,
      relativeName: formData.relativeName,
      profession: formData.profession,
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
      // familyMember: formData.familyMember,
      //bank: formData.bank,
      accountTitle: formData.accountTitle,
      //iBan: formData.iBan,
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
    const { formData, emailValidate, phoneValidate, cnicValidate, investFormData, RCMFormData } = this.state

    const { user } = this.props


    const { route, navigation, contacts, armsContacts, CMLead } = this.props
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
    }
    //validations for rent/invest leads


    else if (!CMLead.cityId && formData.purpose == 'Invest') {
      this.setState({
        checkValidations: true,
      })
    }

    else if ((

      !RCMFormData.city_id ||
      !RCMFormData.leadAreas ||
      !RCMFormData.type ||
      !RCMFormData.subtype
    ) && (formData.purpose == 'Buy' || formData.purpose == 'Rent')) {

      this.setState({
        checkRentValidation: true,
      })
    }


    else {
      if (emailValidate && !phoneValidate && !cnicValidate) {
        if (formData.cnic === '') formData.cnic = null
        if (!update) {
          let body = this.createPayload()
          body.name = body.first_name + ' ' + body.last_name
          this.setState({ loading: true })

          axios
            .post(`/api/customer/create`, body)
            .then((res) => {
            
              //id
              if (res?.status === 200 && res?.data) {
                if (formData.contactRegistrationId) {
                  let isContactExists = armsContacts.find(
                    (item) => item.id === formData.contactRegistrationId
                  )
                  if (isContactExists) {
                    this.deleteARMSContact(formData.contactRegistrationId)
                  }
                }
                if (res?.data?.message !== 'CLIENT CREATED') {

                  // Error Messages
                  if (res?.data?.message === 'Client already exists') {
                    helper.errorToast(res.data.message)
                  }
                  else {
                    helper.errorToast(res?.data?.message)
                  }
                } else {

                  if (formData.purpose === 'Select Lead Type') { helper.successToast(res.data.message) }
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
                      : formData.purpose === 'Select Lead Type' ? navigation.navigate('Client', {
                        isUnitBooking: false,
                      }) : (formData.purpose == 'Buy' || formData.purpose == 'Rent') ? this.RCMFormSubmit(res.data.id) : this.investSubmitForm(res.data.id)


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
                navigation.navigate('ClientDetail')
                // navigation.goBack()
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





  //rent/buyy



  componentDidUpdate(prevProps, prevState) {
    //Typical usage, don't forget to compare the props
    if (prevState?.selectedCity && this.state?.selectedCity?.value !== prevState.selectedCity?.value) {
      this.clearAreaOnCityChange() // clear area field only when city is changed, doesnot get called if same city is selected again..
    }


    if (this.state.formData.purpose == 'Invest') {
      const { CMLead, route, dispatch } = this.props
      const { selectedCity, client, name } = route.params
      if (selectedCity && prevProps.CMLead.cityId !== selectedCity.value) {
        this.setState({ selectedCity }, () => {
          dispatch(addEditCMLead({ ...CMLead, cityId: selectedCity.value }))
        })
      }
      if (client && prevProps.CMLead.customerId !== client.id) {
        this.setClient()
      }
    }
  }



  componentWillUnmount() {
    const { dispatch } = this.props
    // selected Areas should be cleared to be used anywhere else
    dispatch(setSelectedAreas([]))

    dispatch(setDefaultCMPayload())
  }



  onScreenFocused = () => {


    const { client, name, selectedCity } = this.props.route.params
    const { RCMFormData } = this.state
    let copyObject = Object.assign({}, RCMFormData)
    let phones = []
    if (client && client.customerContacts && client.customerContacts.length) {
      client.customerContacts.map((item) => {
        phones.push(item.phone)
      })
      copyObject.customerId = client.id
      copyObject.phones = phones
    }

    copyObject.city_id = selectedCity ? selectedCity.value : null
    setTimeout(() => {
      const { selectedAreasIds } = this.props

      copyObject.leadAreas = selectedCity && selectedAreasIds
      this.setState({
        RCMFormData: copyObject,
        selectedCity,
        selectedClient: client,
        clientName: name,
      })
    }, 500)
  }


  fetchOrganizations = () => {
    axios
      .get('/api/user/organizations?limit=2')
      .then((res) => {
        let organizations = []
        res &&
          res.data.rows.length &&
          res.data.rows.map((item, index) => {
            return organizations.push({ value: item.id, name: item.name })
          })
        this.setState({ organizations })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  setPriceList = () => {
    const { formType, RCMFormData } = this.state
    if (formType === 'buy') {
      RCMFormData.minPrice = StaticData.PricesBuy[0]
      RCMFormData.maxPrice = StaticData.PricesBuy[StaticData.PricesBuy.length - 1]
      this.setState({ RCMFormData, priceList: StaticData.PricesBuy })
    } else {
      RCMFormData.minPrice = StaticData.PricesRent[0]
      RCMFormData.maxPrice = StaticData.PricesRent[StaticData.PricesRent.length - 1]
      this.setState({ RCMFormData, priceList: StaticData.PricesRent })
    }
  }

  handleRCMForm = (value, name) => {
    const { RCMFormData } = this.state
    if (name === 'description') {
      const copyObject = { ...RCMFormData }
      copyObject.description = value
      this.setState({ RCMFormData: copyObject })
    } else {
      const { dispatch } = this.props
      RCMFormData[name] = value
      if (name === 'size_unit') this.setSizeUnitList(value)
      this.setState({ RCMFormData })
      if (RCMFormData.type != '') {
        this.selectSubtype(RCMFormData.type)
      }
    }
  }

  clearAreaOnCityChange = () => {
    const { dispatch } = this.props
    const { RCMFormData } = this.state
    let copyObject = Object.assign({}, RCMFormData)
    copyObject.leadAreas = []
    this.setState({ RCMFormData: copyObject })
    dispatch(setSelectedAreas([]))
  }




  selectSubtype = (type) => {
    this.setState(
      {
        selectSubType: StaticData.subType[type],
      },
      () => {
        this.setDefaultValuesForBedBath(type)
      }
    )
  }

  setDefaultValuesForBedBath = (type) => {
    if (type === 'residential') {
      const { RCMFormData } = this.state
      const copyObject = { ...RCMFormData }
      copyObject.bed = 0
      copyObject.bath = 0
      copyObject.maxBed = StaticData.bedBathRange[StaticData.bedBathRange.length - 1]
      copyObject.maxBath = StaticData.bedBathRange[StaticData.bedBathRange.length - 1]
      this.setState({ RCMFormData: copyObject })
    }
  }

  RCMFormSubmit = (customerId) => {


    const { } = this.state

    const { RCMFormData, formData, callingCode, callingCode1, callingCode2 } = this.state;


    let phone1 = this.checkNum(formData.contactNumber, callingCode)
    let phone2 = this.checkNum(formData.contact1, callingCode1)
    let phone3 = this.checkNum(formData.contact2, callingCode2)
    let Arr = [phone1.replace(/\s+/g, '')];
    if (phone2) {
      Arr.push(phone2.replace(/\s+/g, ''))
    }
    if (phone3) {
      Arr.push(phone3.replace(/\s+/g, ''))
    }
    RCMFormData.phones = phone1 ? Arr : null,


      RCMFormData.customerId = customerId;

    const { user } = this.props
    if (user.subRole === 'group_management') {
      if (
        !RCMFormData.customerId ||
        !RCMFormData.city_id ||
        !RCMFormData.leadAreas ||
        !RCMFormData.type ||
        !RCMFormData.org ||
        !RCMFormData.subtype
      ) {
        this.setState({
          checkRentValidation: true,
        })
      } else this.sendPayload()
    } else {

      if (
        !RCMFormData.customerId ||
        !RCMFormData.city_id ||
        !RCMFormData.leadAreas ||
        !RCMFormData.type ||
        !RCMFormData.subtype
      ) {
        this.setState({
          checkRentValidation: true,
        })
      } else this.sendPayload()
    }
  }




  sendPayload = () => {

    const { formType, RCMFormData, formData, organizations } = this.state
    const { user } = this.props
    if (RCMFormData.size === '') RCMFormData.size = null
    else RCMFormData.size = Number(RCMFormData.size)
    let payLoad = {
      purpose: formType,
      type: RCMFormData.type,
      subtype: RCMFormData.subtype,
      bed: RCMFormData.bed,
      bath: RCMFormData.bath,
      maxBed: RCMFormData.maxBed,
      maxBath: RCMFormData.maxBath,
      size: RCMFormData.size,
      max_size: RCMFormData.maxSize,
      leadAreas: RCMFormData.leadAreas,
      customerId: RCMFormData.customerId,
      city_id: RCMFormData.city_id,
      size_unit: RCMFormData.size_unit,
      price: RCMFormData.maxPrice,
      min_price: RCMFormData.minPrice,
      description: RCMFormData.description,
      phones: RCMFormData.phones,
    }

    this.setState({ loading: true }, () => {
      if (user.subRole === 'group_management') {
        let newOrg = _.find(organizations, function (item) {
          return item.value === formData.org
        })
        payLoad.org = newOrg.name.toLowerCase()
      }


      axios
        .post(`/api/leads`, payLoad)
        .then((res) => {

          helper.successToast(`Client and ${capitalizeFirstLetter(payLoad.purpose)} lead have been registered successfully.`)

          if (payLoad.purpose === 'buy') {

            RootNavigation.navigateTo('Leads', {
              screen: 'Buy',
              screenName: 'AddClient'
            })
          }
          else {
            RootNavigation.navigateTo('Leads', {
              screen: 'Rent',
              screenName: 'AddClient'
            })
          }

        })
        .catch((error) => {
          console.log('error on creating lead')
          this.setState({ loading: false })
        })
    })
  }

  changeStatus = (status) => {
    this.setState(
      {
        formType: status,
      },
      () => {
        this.setPriceList()
      }
    )
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
      selectedClient,


      //Invest

      investFormData,
      getInvestProject,
      checkValidations,
      selectedCity,
      clientName,
      getProductType,
      loadings,
      isPriceModalVisible,


      //rent/buy
      organizations,
      rentCities,
      //clientName,
      formType,
      RCMFormData,
      selectSubType,
      checkRentValidation,
      priceList,
      rentLoading,
      sizeUnitList,
      isBedBathModalVisible,

      isSizeModalVisible,
      modalType,
    } = this.state

    const { route } = this.props
    const { update, client, screenName } = route.params
    const { investmentProjects, CMFormLoading } = this.props

    let btnText = update ? 'UPDATE' : 'ADD'

    return (
      <View style={[[AppStyles.container,]]}>
        <StyleProvider style={getTheme(formTheme)}>
          <>
            <KeyboardAvoidingView style={{ flex: 1, }} enabled>
              {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always"> */}
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={{ flex: 1 }}>
                  <DetailForm
                    route={this.props.route}

                    navigation={this.props.navigation}
                    formSubmit={this.formSubmit}
                    checkValidation={this.state.checkValidation}
                    handleForm={this.handleForm}
                    formData={formData}
                    cities={cities}
                    getClients={getClients}
                    //getProject={getProject}
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



                    //Invest
                    handleInvestForm={this.handleInvestForm}
                    investFormData={investFormData}

                    checkValidations={checkValidations}
                    selectedCity={selectedCity}
                    clientName={clientName}
                    getProductType={getProductType}
                    loadings={loadings}
                    isPriceModalVisible={isPriceModalVisible}
                    setParentState={(obj) => { this.setState(obj) }}



                    // formSubmit={this.formSubmit}

                    //handleForm={this.handleForm}



                    getProject={investmentProjects}


                    // update={update}



                    //Rent/Buy


                    sizeUnitList={sizeUnitList}
                    organizations={_.clone(organizations)}


                    selectedClient={selectedClient}

                    // clientName={clientName}
                    //  formSubmit={this.RCMFormSubmit}
                    checkRentValidation={checkRentValidation}
                    handleRCMForm={this.handleRCMForm}
                    changeStatus={this.changeStatus}
                    size={StaticData.oneToTen}
                    sizeUnit={StaticData.sizeUnit}
                    propertyType={StaticData.type}

                    formType={formType}
                    subTypeData={selectSubType}
                    handleAreaClick={this.handleAreaClick}
                    priceList={priceList}
                    onSliderValueChange={(values) => this.onSliderValueChange(values)}
                    RCMFormData={RCMFormData}
                    rentLoading={rentLoading}
                    isBedBathModalVisible={isBedBathModalVisible}
                    modalType={modalType}

                    isSizeModalVisible={isSizeModalVisible}

                  />
                </View>
              </TouchableWithoutFeedback>
              {/* </ScrollView> */}
            </KeyboardAvoidingView>

            <HideWithKeyboard>
              <View style={[AppStyles.bottomStickyButton]} >
                <TouchableButton
                  containerStyle={[AppStyles.formBtn,]}
                  label={btnText}
                  onPress={() => {
                    this.formSubmit(formData)
                  }
                  }
                  loading={loading}
                />

              </View>
            </HideWithKeyboard>
          </>
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
    selectedAreasIds: store.areasReducer.selectedAreas,

    //invest
    CMFormLoading: store.cmLead.CMFormLoading,
    investmentProjects: store.cmLead.investmentProjects,
    CMLead: store.cmLead.CMLead,

  }
}

export default connect(mapStateToProps)(AddClient)
