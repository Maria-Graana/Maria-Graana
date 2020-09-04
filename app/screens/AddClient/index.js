import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { StyleProvider } from 'native-base';
import DetailForm from './detailForm';
import AppStyles from '../../AppStyles';
import getTheme from '../../../native-base-theme/components';
import formTheme from '../../../native-base-theme/variables/formTheme';
import axios from 'axios'
import { connect } from 'react-redux';
import helper from '../../helper';
import _ from 'underscore';

class AddClient extends Component {
    constructor(props) {
        super(props)
        var defaultCountry = { name: 'PK', code: '+92' }
        this.state = {
            checkValidation: false,
            cities: [],
            getClients: [],
            getProject: [],
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
        }
    }
    componentDidMount() {
        const { route, navigation } = this.props
        navigation.setParams({ title: 'ADD CLIENT INFO' })
        if ('update' in route.params && route.params.update) {
            navigation.setParams({ title: 'UPDATE CLIENT INFO' })
            this.updateFields()
        }
    }

    updateFields = () => {
        const { route } = this.props
        const { client } = route.params
        console.log(client)
        let formData = {
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email,
            cnic: client.cnic,
            contactNumber: client.phone,
            address: client.address,
            contact1: client.contact1,
            contact2: client.contact2,
        }
        if (client.customerContacts.length) {
            for (let i = 0; i < client.customerContacts.length; i++) {
                if (i === 0) formData.contactNumber = client.customerContacts[i].phone
                if (i === 1) formData.contact1 = client.customerContacts[i].phone
                if (i === 2) formData.contact2 = client.customerContacts[i].phone
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

    formSubmit = () => {
        const {
            formData,
            emailValidate,
            phoneValidate,
            cnicValidate,
            contact1Validate,
            contact2Validate,
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
                let body = {
                    first_name: helper.capitalize(formData.firstName),
                    last_name: helper.capitalize(formData.lastName),
                    email: formData.email,
                    cnic: formData.cnic,
                    phone: callingCode + '' + formData.contactNumber,
                    address: formData.address,
                    secondary_address: formData.secondaryAddress,
                    contact1: formData.contact1 != '' ? callingCode1 + '' + formData.contact1 : '',
                    contact2: formData.contact2 != '' ? callingCode2 + '' + formData.contact2 : '',
                }
                if (!update) {
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
                        })
                } else {
                    body.customersContacts = []
                    body.customersContacts.push(body.phone)
                    if (body.contact1) body.customersContacts.push(body.contact1)
                    if (body.contact2) body.customersContacts.push(body.contact2)
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
        } = this.state
        const { route } = this.props
        const { update } = route.params
        return (
            <View style={[AppStyles.container]}>
                <StyleProvider style={getTheme(formTheme)}>
                    <KeyboardAvoidingView enabled>
                        <ScrollView>
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
                                    hello={this.hello}
                                />
                            </View>
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


