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

class AddLead extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkValidation: false,
            cities: [],
            getClients: [],
            getProject: [],
            formData: {
                customerId: '',
                cityId: '',
                projectId: '',
                projectType: '',
                minPrice: '',
                maxPrice: '',
            },
        }
    }
    componentDidMount() {
        const { user } = this.props
        this.getCities();
        this.getClients(user.id);
        this.getAllProjects();
    }

    getClients = (id) => {
        axios.get(`/api/customer/find?userId=${id}`)
            .then((res) => {
                let clientsArray = [];
                res && res.data.rows.map((item, index) => { return (clientsArray.push({ id: item.id, name: item.firstName })) })
                this.setState({
                    getClients: clientsArray
                })
            })
    }


    getCities = () => {
        axios.get(`/api/cities`)
            .then((res) => {
                let citiesArray = [];
                res && res.data.map((item, index) => { return (citiesArray.push({ id: item.id, name: item.name })) })
                this.setState({
                    cities: citiesArray
                })
            })
    }



    getAllProjects = () => {
        axios.get(`/api/project/all`)
            .then((res) => {
                let projectArray = [];
                res && res.data.items.map((item, index) => { return (projectArray.push({ id: item.id, name: item.name })) })
                this.setState({
                    getProject: projectArray
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
        if (!formData.customerId || !formData.projectId || !formData.projectType || !formData.minPrice || !formData.maxPrice) {
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

export default connect(mapStateToProps)(AddLead)


