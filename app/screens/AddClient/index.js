import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { StyleProvider } from 'native-base';
import DetailForm from './detailForm';
import AppStyles from '../../AppStyles';
import getTheme from '../../../native-base-theme/components';
import formTheme from '../../../native-base-theme/variables/formTheme';
import axios from 'axios'
import { connect } from 'react-redux';
import * as RootNavigation from '../../navigation/RootNavigation';
import helper from '../../helper';

class AddClient extends Component {
    constructor(props) {
        super(props)
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
            },
            emailValidate: true,
            phoneValidate: false,
            cnicValidate: false
        }
    }
    componentDidMount() {
        const { route, navigation } = this.props
        navigation.setParams({ title: 'ADD CLIENT INFO'})
        if ('update' in route.params && route.params.update) {
            navigation.setParams({ title: 'UPDATE CLIENT INFO'})
            this.updateFields()
        }
    }

    updateFields = () => {
        const { route } = this.props
        const { client } = route.params
        this.setState({
            formData: {
                firstName: client.firstName,
                lastName: client.lastName,
                email: client.email,
                cnic: client.cnic,
                contactNumber: client.contact1,
                address: client.address,
            }
        })
    }

    validateEmail = (value) => {
        let res = helper.validateEmail(value)
        if (value !== '') this.setState({ emailValidate: res })
        else this.setState({ emailValidate: true })
    }

    validatePhone = (value) => {
        if (value.length < 11 && value !== '') this.setState({ phoneValidate: true })
        else this.setState({ phoneValidate: false })
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
        if (name == 'contactNumber') this.validatePhone(value)

        formData[name] = value
        this.setState({ formData })
    }

    formSubmit = () => {
        const { formData, emailValidate, phoneValidate, cnicValidate } = this.state
        const { route } = this.props
        const { update, client } = route.params
        if (formData.cnic && formData.cnic !== '') formData.cnic = formData.cnic.replace(/\-/g, '')
        if (!formData.firstName || !formData.lastName || !formData.contactNumber) {
            this.setState({
                checkValidation: true
            })
        } else {
            if (emailValidate && !phoneValidate && !cnicValidate) {
                if (formData.cnic === '') formData.cnic = null
                let body = {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    cnic: formData.cnic,
                    phone: formData.contactNumber,
                    address: formData.address,
                    secondary_address: formData.secondaryAddress
                }
                if (!update) {
                    axios.post(`/api/customer/create`, body)
                        .then((res) => {
                            if (res.status === 200) {
                                if(res.data.message){
                                    helper.errorToast(res.data.message)
                                }
                                else{
                                    RootNavigation.navigate('Client')
                                    helper.successToast('CLIENT CREATED')
                                }
                               
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                            helper.errorToast('ERROR CREATING CLIENT')
                        })
                } else {
                    axios.patch(`/api/customer/update?id=${client.id}`, body)
                        .then((res) => {
                            helper.successToast('CLIENT UPDATED')
                            RootNavigation.navigate('Client')
                        })
                        .catch((error) => {
                            console.log(error)
                            helper.errorToast('ERROR UPDATING CLIENT')
                        })
                }
            }
        }
    }

    render() {
        const { formData, cities, getClients, getProject, phoneValidate, emailValidate, cnicValidate } = this.state
        const { route } = this.props
        const { update } = route.params
        return (
            <View style={[AppStyles.container]}>
                <StyleProvider style={getTheme(formTheme)}>
                    <KeyboardAvoidingView behavior="padding" enabled>
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
    }
}

export default connect(mapStateToProps)(AddClient)


