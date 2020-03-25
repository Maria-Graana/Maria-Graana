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
        }
    }
    componentDidMount() {
        const { route } = this.props
        if ('update' in route.params && route.params.update) {
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

    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData })
    }

    formSubmit = () => {
        const { formData } = this.state
        const { route } = this.props
        const { update, client } = route.params
        if (!formData.firstName || !formData.lastName || !formData.contactNumber) {
            this.setState({
                checkValidation: true
            })
        } else {
            const { user } = this.props
            let body = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.cnic,
                cnic: formData.contactNumber,
                address: formData.address,
            }
            if (!update) {
                axios.post(`/api/customer/create`, body)
                    .then((res) => {
                        RootNavigation.navigate('Client')
                        helper.successToast('CLIENT CREATED')
                    })
                    .catch((error) => {
                        console.log(error)
                        helper.errorToast('ERROR CREATING CLIENT')
                    })
            } else {
                body.id= client.id
                axios.patch(`/api/customer/update?id?${client.id}`, body)
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

    render() {
        const { formData, cities, getClients, getProject } = this.state
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


