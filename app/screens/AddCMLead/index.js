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
            formData: {
                customerId: '',
                cityId: '',
                projectId: '',
                projectType: '',
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
            if (client && name) {
                copyObject.customerId = client.id;
                this.setState({ formData: copyObject, clientName: name, selectedClient: client })
            }
            if (selectedCity) {
                copyObject.cityId = selectedCity.value;
                this.setState({ formData: copyObject, selectedCity })
            }
        })
        this.getAllProjects();
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
        const { formData } = this.state
        formData[name] = value
        if (name === 'projectId') {
            this.getProductType(value)
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
            axios.post(`/api/leads/project`, formData)
                .then((res) => {
                    helper.successToast('Lead created successfully')
                    RootNavigation.navigate('Leads')
                })
                .catch((error) => {
                    console.log(error)
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
        var getProType = _.pluck(_.filter(getProject, item => item.value === id ), 'productType')
        var getPro = []
         getProType[0].map((item) => {
            return(
                getPro.push({value: item.id, name: item.name})
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
            getProductType
        } = this.state
        const { route } = this.props
        return (
            <View style={[route.params.pageName === 'CM' && AppStyles.container]}>
                <StyleProvider style={getTheme(formTheme)}>
                    <KeyboardAvoidingView enabled>
                        <ScrollView>
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


