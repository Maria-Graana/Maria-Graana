import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { StyleProvider } from 'native-base';
import InnerForm from './InnerForm';
import AppStyles from '../../AppStyles';
import getTheme from '../../../native-base-theme/components';
import formTheme from '../../../native-base-theme/variables/formTheme';
import axios from 'axios'
import { connect } from 'react-redux';
import helper from '../../helper'

class CreateUser extends Component {
    constructor(props) {
        super(props)
        const { user } = this.props
        this.state = {
            checkValidation: false,
            cities: [],
            getRoles: [],
            organization: [{ value: user.organizationId, name: user.organizationName }],
            formData: {
                email: '',
                password: '',
                confirmPassword: '',
                phoneNumber: '',
                cnic: '',
                organizationId: user.organizationId,
                armsUserRoleId: '',
                firstName: '',
                lastName: '',
                zoneId: user.zoneId,
                cityId: '',
                managerId: user.id,
            }
        }
    }

    componentDidMount() {
        const { user } = this.props
        this.getCities();
        this.getRoles(user.organizationId)
    }

    getCities = () => {
        axios.get(`/api/cities`)
            .then((res) => {
                let citiesArray = [];
                res && res.data.map((item, index) => { return (citiesArray.push({ value: item.id, name: item.name })) })
                this.setState({
                    cities: citiesArray
                })
            })
    }

    getRoles = (id) => {
        axios.get(`/api/user/roles?orgId=${id}`)
            .then((res) => {
                this.setState({
                    getRoles: res.data['sub_admin 2'][0],
                    formData: {
                        armsUserRoleId: res.data['sub_admin 2'][0].id
                    }
                })
            })
    }

    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData })
    }

    formSubmit = () => {
        const { formData } = this.state
        if (
            !formData.firstName &&
            !formData.lastName &&
            !formData.phoneNumber &&
            !formData.password &&
            !formData.phoneNumber &&
            !formData.cityId &&
            !formData.armsUserRoleId &&
            !formData.confirmPassword
        ) {
            this.setState({
                checkValidation: true
            })
        } else {
            if (formData.confirmPassword == formData.password) {
                axios.post(`/api/user/signup`, formData)
                    .then((res) => {
                        helper.successToast('User Added')
                        const { navigation } = this.props
                        navigation.navigate('Landing')
                    })
            }
        }
    }

    render() {
        const {
            formData,
            cities,
            checkValidation,
            getRoles,
            organization,
        } = this.state
        return (
            <View style={[AppStyles.container]}>
                <StyleProvider style={getTheme(formTheme)}>
                    <KeyboardAvoidingView behavior="padding" enabled>
                        <ScrollView>
                            <View>
                                <InnerForm
                                    formSubmit={this.formSubmit}
                                    checkValidation={checkValidation}
                                    handleForm={this.handleForm}
                                    formData={formData}
                                    getRoles={getRoles}
                                    cities={cities}
                                    organization={organization}
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

export default connect(mapStateToProps)(CreateUser)


