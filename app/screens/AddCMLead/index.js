import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { StyleProvider } from 'native-base';
import CMLeadFrom from './CMLeadFrom';
import AppStyles from '../../AppStyles';
import getTheme from '../../../native-base-theme/components';
import formTheme from '../../../native-base-theme/variables/formTheme';
import axios from 'axios'
import { connect } from 'react-redux';
import * as RootNavigation from '../../navigation/RootNavigation';
import StaticData from '../../StaticData'
import helper from '../../helper';

class AddCMLead extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkValidation: false,
            cities: [],
            getClients: [],
            getProject: [],
            formType: 'sale',
            selectSubType: [],
            getAreas: [],
            formData: {
                customerId: '',
                cityId: '',
                projectId: '',
                projectType: '',
                minPrice: '',
                maxPrice: '',
            }
        }
    }

    componentDidMount() {
        const { user } = this.props
        this.getCities();
        this.getAllProjects();
        this.getClients(user.id);
    }

    getClients = (id) => {
        axios.get(`/api/customer/find?userId=${id}`)
            .then((res) => {
                let clientsArray = [];
                res && res.data.rows.map((item, index) => { return (clientsArray.push({ value: item.id, name: item.firstName })) })
                this.setState({
                    getClients: clientsArray
                })
            })
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

    getAllProjects = () => {
        axios.get(`/api/project/all`)
            .then((res) => {
                let projectArray = [];
                res && res.data.items.map((item, index) => { return (projectArray.push({ value: item.id, name: item.name })) })
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

    selectSubtype = (type) => {
        this.setState({ selectSubType: StaticData.subType[type] })
    }

    formSubmit = () => {
        const { formData } = this.state
        if (!formData.customerId || !formData.projectId || !formData.projectType || !formData.minPrice || !formData.maxPrice) {
            this.setState({
                checkValidation: true
            })
        } else {
            let body = {
                ...formData,
            }
            axios.post(`/api/leads/project`, body)
                .then((res) => {
                    helper.errorToast(res.data)
                    RootNavigation.navigate('Lead')
                })
        }
    }

    changeStatus = (status) => {
        this.setState({
            formType: status,
        })
    }

    render() {
        const {
            formData,
            cities,
            getClients,
            getProject,
            checkValidation,
        } = this.state
        const { route } = this.props
        return (
            <View style={[route.params.pageName === 'CM' && AppStyles.container]}>
                <StyleProvider style={getTheme(formTheme)}>
                    <KeyboardAvoidingView behavior="padding" enabled>
                        <ScrollView>
                            <View>
                                <CMLeadFrom
                                    formSubmit={this.formSubmit}
                                    checkValidation={checkValidation}
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

export default connect(mapStateToProps)(AddCMLead)


