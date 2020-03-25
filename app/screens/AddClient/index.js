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
    }

    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        console.log(value, name)
        this.setState({ formData })
    }

    formSubmit = () => {
        const { formData } = this.state
        console.log(formData)
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.cnic || !formData.contactNumber || !formData.address || !formData.secondaryAddress) {
            this.setState({
                checkValidation: true
            })
        } else {
            const { user } = this.props
            let body = {
                ...formData,
            }
            axios.post(`/api/leads/project`, body)
                .then((res) => {
                    RootNavigation.navigate('Lead')
                })
        }
    }

    render() {
        const { formData, cities, getClients, getProject } = this.state

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


