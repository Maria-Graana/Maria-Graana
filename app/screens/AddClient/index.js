import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { StyleProvider } from 'native-base';
import DetailForm from './detailForm';
import AppStyles from '../../AppStyles';
import getTheme from '../../../native-base-theme/components';
import formTheme from '../../../native-base-theme/variables/formTheme';
import axios from 'axios'
import { connect } from 'react-redux';
import helper from '../../helper';
import _ from 'underscore';
import { getAllCountries } from 'react-native-country-picker-modal'

class AddClient extends Component {
    constructor(props) {
        super(props)
        var defaultCountry = { name: 'PK', code: '+92' }
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
                contactNumber: '',
                address: '',
                secondaryAddress: '',
                contact1: '',
                contact2: ''
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
            countries: []
        }
    }
    componentDidMount() {
        const { route, navigation } = this.props
        navigation.setParams({ title: 'ADD CLIENT INFO' })
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
        if (client.customerContacts.length) {
            for (let i = 0; i < client.customerContacts.length; i++) {
                if (i === 0) phone = client.customerContacts[i].phone.substring(1)
                if (i === 1) contact1 = client.customerContacts[i].phone.substring(1)
                if (i === 2) contact2 = client.customerContacts[i].phone.substring(1)
            }
        }
        let result = _.map(
            _.where(countries),
            function (country) {
                return { callingCode: country.callingCode, cca2: country.cca2 }
            }
        )
        let newResult = []
        if (result.length) {
            result.map(item => {
                let callingCode = item.callingCode
                if (callingCode.length) {
                    callingCode.map(code => {
                        let obj = {
                            cca2: item.cca2,
                            callingCode: Number(code)
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
                        countryCode = '+' + newResult[i].callingCode;
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
                        countryCode1 = '+' + newResult[i].callingCode;
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
                        countryCode2 = '+' + newResult[i].callingCode;
                        cca2Contact2 = newResult[i].cca2
                        contact2Bool = true
                    } else {
                        countryCode2 = client.customerContacts[2].dialCode
                        cca2Contact2 = client.customerContacts[2].countryCode
                    }
                }
            }
            if (contactBool && contact1Bool && contact2Bool) break;
        }
        this.setState({
            countryCode: cca2Contact ? cca2Contact : 'PK',
            countryCode1: cca2Contact1 ? cca2Contact1 : 'PK',
            countryCode2: cca2Contact2 ? cca2Contact2 : 'PK',
            callingCode: countryCode ? countryCode : '+92',
            callingCode1: countryCode1 ? countryCode1 : '+92',
            callingCode2: countryCode2 ? countryCode2 : '+92'
        }, () => this.updateFields())
    }

    updateFields = () => {
        const { route } = this.props
        const { client } = route.params
        const { callingCode, callingCode1, callingCode2 } = this.state
        let formData = {
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email,
            cnic: client.cnic,
            contactNumber: client.phone,
            address: client.address,
            contact1: client.contact1 ? client.contact1 : '',
            contact2: client.contact2 ? client.contact2 : '',
        }
        if (client.customerContacts.length) {
            for (let i = 0; i < client.customerContacts.length; i++) {
                if (i === 0) {
                    formData.contactNumber = client.customerContacts[i].phone.replace(callingCode, '')
                    formData.contactNumber = client.customerContacts[i].phone.replace('+', '')
                }
                if (i === 1) {
                    formData.contact1 = client.customerContacts[i].phone.replace(callingCode1, '')
                    formData.contact1 = client.customerContacts[i].phone.replace('+', '')
                }
                if (i === 2) {
                    formData.contact2 = client.customerContacts[i].phone.replace(callingCode2, '')
                    formData.contact2 = client.customerContacts[i].phone.replace('+', '')
                }
            }
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
        if (value.length < 15 && value !== '') this.setState({ cnicValidate: true })
        else this.setState({ cnicValidate: false })
    }

    handleForm = (value, name) => {
        const { formData } = this.state
        if (name == 'cnic') {
            value = helper.normalizeCnic(value)
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

    createPayload = () => {
        const {
            formData,
            countryCode,
            countryCode1,
            countryCode2,
            callingCode,
            callingCode1,
            callingCode2,
        } = this.state

        let body = {
            first_name: helper.capitalize(formData.firstName),
            last_name: helper.capitalize(formData.lastName),
            email: formData.email,
            cnic: formData.cnic,
            phone: {
                countryCode: countryCode,
                phone: formData.contactNumber != '' ? callingCode + '' + formData.contactNumber : '',
                dialCode: callingCode,
            },
            address: formData.address,
            secondary_address: formData.secondaryAddress,
            contact1: {
                countryCode: countryCode1,
                contact1: formData.contact1 != '' ? callingCode1 + '' + formData.contact1 : '',
                dialCode: callingCode1,
            },
            contact2: {
                countryCode: countryCode2,
                contact2: formData.contact2 != '' ? callingCode2 + '' + formData.contact2 : '',
                dialCode: callingCode2,
            }
        }
        return body
    }

    updatePayload = () => {
        const {
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
        let body = {
            first_name: helper.capitalize(formData.firstName),
            last_name: helper.capitalize(formData.lastName),
            email: formData.email,
            cnic: formData.cnic,
            phone: {
                countryCode: countryCode,
                phone: checkForPlus === '+' ? formData.contactNumber : callingCode + '' + formData.contactNumber,
                dialCode: callingCode,
            },
            address: formData.address,
            secondary_address: formData.secondaryAddress,
            contact1: {
                countryCode: countryCode1,
                phone: checkForPlus2 == '+' ? formData.contact1 : formData.contact1 != '' ? callingCode1 + '' + formData.contact1 : null,
                dialCode: callingCode1,
            },
            contact2: {
                countryCode: countryCode2,
                phone: checkForPlus3 == '+' ? formData.contact2 : formData.contact2 != '' ? callingCode2 + '' + formData.contact2 : null,
                dialCode: callingCode2,
            }
        }
        body.customersContacts = []
        body.customersContacts.push(body.phone)
        if (body.contact1.phone && body.contact1.phone !== '') body.customersContacts.push(body.contact1)
        if (body.contact2.phone && body.contact2.phone !== '') body.customersContacts.push(body.contact2)
        delete body.contact1
        delete body.contact2
        return body
    }

    formSubmit = () => {
        const {
            formData,
            emailValidate,
            phoneValidate,
            cnicValidate,
            callingCode,
            callingCode1,
            callingCode2,
        } = this.state
        const { route, navigation, contacts } = this.props
        const { update, client, isFromDropDown, screenName } = route.params
        if (formData.cnic && formData.cnic !== '') formData.cnic = formData.cnic.replace(/\-/g, '')
        if (!formData.firstName || !formData.lastName || !formData.contactNumber) {
            this.setState({
                checkValidation: true
            })
        } else {
            if (emailValidate && !phoneValidate && !cnicValidate) {
                if (formData.cnic === '') formData.cnic = null
                if (!update) {
                    let body = this.createPayload()
                    this.setState({ loading: true })
                    axios.post(`/api/customer/create`, body)
                        .then((res) => {
                            if (res.status === 200 && res.data) {
                                if (res.data.original_owner) {
                                    Alert.alert('Alert', res.data.message, [
                                        {
                                            text: 'OK', onPress: () => {
                                                isFromDropDown ?
                                                    navigation.navigate(screenName, { client: res.data.id ? res.data : null, name: res.data.first_name ? res.data.first_name + ' ' + res.data.last_name : '' }) :
                                                    navigation.goBack();

                                                helper.successToast('CLIENT CREATED');
                                            }
                                        },
                                    ],
                                        { cancelable: false })
                                } else {
                                    if (res.data.message === 'Client already exists') {
                                        helper.errorToast(res.data.message)
                                    }
                                    else {
                                        helper.successToast(res.data.message)
                                    }
                                    isFromDropDown ? navigation.navigate(screenName, { client: res.data.id ? res.data : null, name: res.data.first_name ? res.data.first_name + ' ' + res.data.last_name : null }) : navigation.goBack();
                                }
                            }
                            body.name = body.first_name + ' ' + body.last_name
                        })
                        .catch((error) => {
                            console.log(error)
                            helper.errorToast('ERROR CREATING CLIENT')
                        }).finally(() => {
                            this.setState({ loading: false })
                        })
                } else {
                    let body = this.updatePayload()
                    this.setState({ loading: true })
                    axios.patch(`/api/customer/update?id=${client.id}`, body)
                        .then((res) => {
                            helper.successToast('CLIENT UPDATED')
                            body.name = body.first_name + ' ' + body.last_name
                            // this.call(body)
                            navigation.goBack();
                        })
                        .catch((error) => {
                            console.log(error)
                            helper.errorToast('ERROR UPDATING CLIENT')
                        }).finally(() => {
                            this.setState({ loading: false })
                        })
                }
            }
        }
    }

    getTrimmedPhone = (number) => {
        let phone = number;
        if (phone.startsWith('92')) {
            phone = phone.substring(2);
        } else
            if (phone.startsWith('092')) {
                phone = phone.substring(3);
            } else
                if (phone.startsWith('0092')) {
                    phone = phone.substring(4);
                } else
                    if (phone.startsWith('03')) {
                        phone = phone.substring(1);
                    }
        return phone
    }

    validate(text, type) {
        var phonenum = /(?=.{10})/
        if (type == 'phone') {
            this.setState({ phone: text });
            if (phonenum.test(text)) {
                this.setState({ phoneVerified: true })
            }
            else {
                this.setState({ phoneVerified: false })
            }
        }
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
            callingCode,
            contactNumberCheck,
            loading,
        } = this.state
        const { route } = this.props
        const { update } = route.params
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
    }
}

export default connect(mapStateToProps)(AddClient)


