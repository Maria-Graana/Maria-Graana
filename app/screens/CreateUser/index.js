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
import { setSelectedAreas } from "../../actions/areas";

class CreateUser extends Component {
    constructor(props) {
        super(props)
        const { user } = this.props
        this.state = {
            checkValidation: false,
            cities: [],
            getRoles: {},
            organization: [{ value: user.organizationId, name: user.organizationName }],
            emailValidate: true,
            phoneValidate: false,
            cnicValidate: false,
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
                areas: [],
            }
        }
    }

    componentDidMount() {
        const { user,navigation } = this.props
        navigation.addListener('focus', () => {
            setTimeout(() => {
                // When screen is focused again the areas should be updated...
                const { selectedAreasIds } = this.props;
                const { formData } = this.state;
                let copyObject = Object.assign({}, formData);
                copyObject.areas = selectedAreasIds;
                this.setState({ formData: copyObject })
            }, 1000)
        })
        this.getCities();
        this.getRoles(user.organizationId)
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        // selected Areas should be cleared to be used anywhere else
        dispatch(setSelectedAreas([]));
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

   

    handleAreaClick = () => {
        const { formData } = this.state;
        const { areas } = formData;
        const { navigation } = this.props;

        const isEditMode = `${areas.length > 0 ? true : false}`
        navigation.navigate('AreaPickerScreen', { isEditMode: isEditMode, screenName: 'CreateUser' });
    }

    getRoles = (id) => {
        axios.get(`/api/user/roles?orgId=${id}`)
            .then((res) => {
                const { formData } = this.state
                formData['armsUserRoleId'] = res.data['sub_admin 2'][0].id
                this.setState({
                    getRoles: res.data['sub_admin 2'][0],
                    formData,
                })
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
        formData[name] = value
        if (name == 'cnic') {
            value = helper.normalizeCnic(value)
            this.validateCnic(value)
        }
        if (name == 'email') {
            this.validateEmail(value)
        }
        if (name == 'phoneNumber') {
            this.validatePhone(value)
        }
        this.setState({ formData })
    }


    formSubmit = () => {
        const { formData } = this.state

        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.phoneNumber ||
            !formData.password ||
            !formData.phoneNumber ||
            !formData.cityId ||
            !formData.armsUserRoleId ||
            !formData.confirmPassword
        ) {
            this.setState({
                checkValidation: true
            })
        } else {
            let body = {
                ...formData,
                email: formData.email.toLowerCase()
            }
            if (formData.confirmPassword == formData.password) {
                axios.post(`/api/user/signup`, body)
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
            emailValidate,
            phoneValidate,
            cnicValidate,
        } = this.state
        return (
            <View style={[AppStyles.container]}>
                <StyleProvider style={getTheme(formTheme)}>
                    <KeyboardAvoidingView behavior="padding" enabled>
                        <ScrollView>
                            <View>
                                <InnerForm
                                    formSubmit={this.formSubmit}
                                    handleAreaClick={this.handleAreaClick}
                                    checkValidation={checkValidation}
                                    handleForm={this.handleForm}
                                    formData={formData}
                                    getRoles={getRoles}
                                    cities={cities}
                                    organization={organization}
                                    emailValidate={emailValidate}
                                    phoneValidate={phoneValidate}
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
        selectedAreasIds: store.areasReducer.selectedAreas,
    }
}

export default connect(mapStateToProps)(CreateUser)


