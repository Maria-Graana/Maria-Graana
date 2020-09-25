import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
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
import _ from 'underscore';

class AddCMLead extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkValidation: false,
            clientName: '',
            selectedClient: null,
            selectedCity: null,
            getProject: [],
            getProductType: [],
            formType: 'sale',
            selectSubType: [],
            getAreas: [],
            loading: false,
            formData: {
                customerId: '',
                cityId: '',
                projectId: '',
                projectType: '',
                armsProjectTypeId: null,
                minPrice: StaticData.PricesProject[0],
                maxPrice: StaticData.PricesProject[StaticData.PricesProject.length - 1],
                description: '',
            }
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        navigation.addListener('focus', () => {
            const { client, name, selectedCity } = this.props.route.params;
            const { formData } = this.state;
            let copyObject = Object.assign({}, formData);
            if (client && name) this.setClient()
            if (selectedCity) {
                copyObject.cityId = selectedCity.value;
                this.setState({ formData: copyObject, selectedCity })
            }
        })
        this.getAllProjects();
    }

    setClient = () => {
        const { formData } = this.state
        const { client, name } = this.props.route.params
        let copyObject = Object.assign({}, formData)
        let phones = []
        if (client.customerContacts && client.customerContacts.length) {
            client.customerContacts.map(item => { phones.push(item.phone) })
        }
        copyObject.customerId = client.id
        copyObject.phones = phones
        this.setState({ formData: copyObject, clientName: name, selectedClient: client })
    }

    getAllProjects = () => {
        axios.get(`/api/project/all`)
            .then((res) => {
                let projectArray = [];
                res && res.data.items.map((item, index) => { return (projectArray.push({ value: item.id, name: item.name, productType: item.productTypes })) })
                this.setState({
                    getProject: projectArray
                });
            });
    }

    handleForm = (value, name) => {
        const { formData, getProductType } = this.state
        formData[name] = value
        if (name === 'projectId') {
            this.getProductType(value)
        }
        if (name === 'projectType') {
            const getProName = getProductType.find((item) => { return item.value === value })
            formData['armsProjectTypeId'] = value
            formData['projectType'] = getProName.name
        }
        this.setState({ formData })
    }

    selectSubtype = (type) => {
        this.setState({ selectSubType: StaticData.subType[type] })
    }

    formSubmit = () => {
        const { formData, getProject } = this.state
        if (!formData.customerId || !formData.projectId) {
            this.setState({
                checkValidation: true
            })
        } else {
            if (formData.projectId && formData.projectId !== '') {
                let project = _.find(getProject, function (item) { return item.value === formData.projectId })
                formData.projectName = project.name
            }
            this.setState({ loading: true })
            axios.post(`/api/leads/project`, formData)
                .then((res) => {
                    if (res.data.message) {
                        Alert.alert(
                            'Lead cannot be created as same lead already exists:',
                            `Lead id: ${res.data.leadId}\nAgent Name: ${res.data.agent}\nContact: ${res.data.contact}`,
                            [
                                { text: 'OK', style: 'cancel' },
                            ],
                            { cancelable: false })
                    } else helper.successToast('Lead created successfully')
                    RootNavigation.navigate('Leads')
                })
                .catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.setState({ loading: false })
                })
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
        const { selectedClient } = this.state;
        navigation.navigate('Client', { isFromDropDown: true, selectedClient, screenName: 'AddCMLead' });
    }

    handleCityClick = () => {
        const { navigation } = this.props;
        const { selectedCity } = this.state;
        navigation.navigate('SingleSelectionPicker', { screenName: 'AddCMLead', mode: 'city', selectedCity });
    }

    getProductType = (id) => {
        const { getProject } = this.state
        var getProType = _.pluck(_.filter(getProject, item => item.value === id), 'productType')
        var getPro = []
        getProType[0].map((item) => {
            return (
                getPro.push({ value: item.id, name: item.name })
            )
        })
        this.setState({
            getProductType: getPro
        })
    }

    render() {
        const {
            formData,
            getProject,
            checkValidation,
            selectedCity,
            clientName,
            getProductType,
            loading,
        } = this.state
        const { route } = this.props
        return (
            <View style={[route.params.pageName === 'CM' && AppStyles.container]}>
                <StyleProvider style={getTheme(formTheme)}>
                    <KeyboardAvoidingView enabled>
                        <ScrollView keyboardShouldPersistTaps="always">
                            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                                <View>
                                    <CMLeadFrom
                                        formSubmit={this.formSubmit}
                                        checkValidation={checkValidation}
                                        handleForm={this.handleForm}
                                        clientName={clientName}
                                        selectedCity={selectedCity}
                                        handleCityClick={this.handleCityClick}
                                        handleClientClick={this.handleClientClick}
                                        formData={formData}
                                        getProject={getProject}
                                        onSliderValueChange={(values) => this.onSliderValueChange(values)}
                                        getProductType={getProductType}
                                        loading={loading}
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
    }
}

export default connect(mapStateToProps)(AddCMLead)


