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
            clientName: '',
            selectedClient: null,
            getProject: [],
            formType: 'sale',
            selectSubType: [],
            getAreas: [],
            formData: {
                customerId: '',
                cityId: '',
                projectId: '',
                projectType: '',
                minPrice: StaticData.PricesProject[0],
                maxPrice: StaticData.PricesProject[StaticData.PricesProject.length - 1],
            }
        }
    }

    componentDidMount() {
        const {navigation} = this.props;
        navigation.addListener('focus', () => {
            const { client, name } = this.props.route.params;
            const { formData } = this.state;
            let copyObject = Object.assign({}, formData);
            if (client && name) {
                copyObject.customerId = client.id;
                this.setState({ formData: copyObject, clientName: name, selectedClient: client })
            }
        })
        this.getCities();
        this.getAllProjects();
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
        if (!formData.customerId || !formData.projectId) {
            this.setState({
                checkValidation: true
            })
        } else {
            let body = {
                ...formData,
            }
            if (body.maxPrice === '') body.maxPrice = null
            if (body.minPrice === '') body.minPrice = null
            if (body.maxPrice && body.maxPrice !== '' && body.minPrice && body.minPrice !== '') {
                if (Number(body.maxPrice) >= Number(body.minPrice)) {
                    axios.post(`/api/leads/project`, body)
                        .then((res) => {
                            helper.successToast(res.data)
                            RootNavigation.navigate('Leads')
                        })
                } else {
                    helper.errorToast('Max Price cannot be less than Min Price')
                }
            } else {
                axios.post(`/api/leads/project`, body)
                    .then((res) => {
                        helper.successToast(res.data)
                        RootNavigation.navigate('Leads')
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }

        }
    }

    changeStatus = (status) => {
        this.setState({
            formType: status,
        })
    }

    onSliderValueChange = (values) => {
        const { formData } = this.state;
        const prices = StaticData.PricesProject;
        formData.minPrice = prices[values[0]];
        formData.maxPrice = prices[values[values.length - 1]];
        this.setState({ formData });
    }

    handleClientClick = () => {
        const { navigation } = this.props;
        const {selectedClient} = this.state;
        navigation.navigate('Client', { isFromDropDown: true, selectedClient, screenName: 'AddCMLead' });
    }

    render() {
        const {
            formData,
            cities,
            getProject,
            checkValidation,
            clientName
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
                                    clientName={clientName}
                                    handleClientClick={this.handleClientClick}
                                    formData={formData}
                                    cities={cities}
                                    getProject={getProject}
                                    onSliderValueChange={(values) => this.onSliderValueChange(values)}
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


