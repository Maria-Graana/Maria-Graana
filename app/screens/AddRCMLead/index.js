import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { StyleProvider } from 'native-base';
import RCMLeadFrom from './RCMLeadFrom';
import AppStyles from '../../AppStyles';
import getTheme from '../../../native-base-theme/components';
import formTheme from '../../../native-base-theme/variables/formTheme';
import axios from 'axios'
import { connect } from 'react-redux';
import * as RootNavigation from '../../navigation/RootNavigation';
import StaticData from '../../StaticData'
import helper from '../../helper';


class AddRCMLead extends Component {
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
            RCMFormData: {
                type: "",
                subtype: "",
                bed: null,
                bath: null,
                size: null,
                leadAreas: [],
                customerId: '',
                city_id: '',
                size_unit: null,
                max_price: null,
                min_price: null,
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


    handleRCMForm = (value, name) => {
        const { RCMFormData } = this.state
        RCMFormData[name] = value
        this.setState({ RCMFormData })
        if (RCMFormData.type != '') { this.selectSubtype(RCMFormData.type) }
        if (RCMFormData.city_id != '') { this.getAreas(RCMFormData.city_id) }
    }

    getAreas = (cityId) => {
        axios.get(`/api/areas?city_id=${cityId}&all=true`)
            .then((res) => {
                let getArea = [];
                res && res.data.items.map((item, index) => { return (getArea.push({ value: item.id, name: item.name })) })
                this.setState({
                    getAreas: getArea
                })
            })
    }

    selectSubtype = (type) => {
        this.setState({ selectSubType: StaticData.subType[type] })
    }

    RCMFormSubmit = () => {
        const { formType, RCMFormData } = this.state
        if (
            !RCMFormData.customerId ||
            !RCMFormData.city_id ||
            !RCMFormData.leadAreas ||
            !RCMFormData.type ||
            !RCMFormData.subtype
        ) {
            this.setState({
                checkValidation: true
            })
        } else {
            if (RCMFormData.min_price > RCMFormData.max_price) {
                helper.errorToast('Min Price Greater Then Max Price')
            } else {
                let payLoad = {
                    purpose: formType,
                    type: RCMFormData.type,
                    subtype: RCMFormData.subtype,
                    bed: RCMFormData.bed,
                    bath: RCMFormData.bath,
                    size: RCMFormData.size,
                    leadAreas: RCMFormData.leadAreas,
                    customerId: RCMFormData.customerId,
                    city_id: RCMFormData.city_id,
                    size_unit: RCMFormData.size_unit,
                    price: RCMFormData.max_price,
                    min_price: RCMFormData.min_price,
                }
                axios.post(`/api/leads`, payLoad)
                    .then((res) => {
                        helper.successToast(res.data)
                        RootNavigation.navigate('Lead')
                    })
            }

        }
    }

    changeStatus = (status) => {
        this.setState({
            formType: status,
        })
    }

    render() {
        const {
            cities,
            getClients,
            formType,
            RCMFormData,
            selectSubType,
            getAreas,
            checkValidation,
        } = this.state
        const { route } = this.props
        return (
            <View style={[route.params.pageName === 'CM' && AppStyles.container]}>
                <StyleProvider style={getTheme(formTheme)}>
                    <KeyboardAvoidingView behavior="padding" enabled>
                        <ScrollView>
                            <View>
                                <RCMLeadFrom
                                    formSubmit={this.RCMFormSubmit}
                                    checkValidation={checkValidation}
                                    handleForm={this.handleRCMForm}
                                    changeStatus={this.changeStatus}
                                    size={StaticData.oneToTen}
                                    sizeUnit={StaticData.sizeUnit}
                                    propertyType={StaticData.type}
                                    formData={RCMFormData}
                                    cities={cities}
                                    getAreas={getAreas}
                                    getClients={getClients}
                                    formType={formType}
                                    subType={selectSubType}
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

export default connect(mapStateToProps)(AddRCMLead)


