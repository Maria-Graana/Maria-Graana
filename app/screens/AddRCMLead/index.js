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
import { setSelectedAreas } from "../../actions/areas";


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
        const { user, navigation } = this.props
        navigation.addListener('focus', () => {
            setTimeout(() => {
                const { selectedAreasIds } = this.props;
                const { RCMFormData } = this.state;
                let copyObject = Object.assign({}, RCMFormData);
                copyObject.leadAreas = selectedAreasIds;
                this.setState({ RCMFormData: copyObject })
            }, 1000)
        })
        this.getCities();
        this.getAllProjects();
        this.getClients(user.id);
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        // selected Areas should be cleared to be used anywhere else
        dispatch(setSelectedAreas([]));
    }

    getClients = (id) => {
        axios.get(`/api/customer/find?userId=${id}`)
            .then((res) => {
                let clientsArray = [];
                res && res.data.rows.map((item, index) => {
                    return (
                        clientsArray.push(
                            {
                                value: item.id, name: item.firstName === '' || item.firstName === null ? item.contact1 : item.firstName + ' ' + item.lastName
                            }
                        )
                    )
                })
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
        const { dispatch } = this.props;
        RCMFormData[name] = value
        this.setState({ RCMFormData })
        if (RCMFormData.city_id !== '' && name === 'city_id') {
            let copyObject = Object.assign({}, RCMFormData);
            copyObject.leadAreas = [];
            this.setState({ RCMFormData: copyObject });
            dispatch(setSelectedAreas([]))

        }
        if (RCMFormData.type != '') { this.selectSubtype(RCMFormData.type) }

    }


    handleAreaClick = () => {
        const { RCMFormData } = this.state;
        const { city_id, leadAreas } = RCMFormData;
        const { navigation } = this.props;

        const isEditMode = `${leadAreas.length > 0 ? true : false}`

        if (city_id !== '' && city_id !== undefined) {
            navigation.navigate('AreaPickerScreen', { cityId: city_id, isEditMode: isEditMode });
        }
        else {
            alert('Please select city first!')
        }
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
            if (RCMFormData.min_price > RCMFormData.max_price || RCMFormData.min_price == RCMFormData.max_price) {
                helper.errorToast('Max Price cannot be less than Min Price')
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
                    size_unit: parseInt(RCMFormData.size_unit),
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
                                    getClients={getClients}
                                    formType={formType}
                                    subType={selectSubType}
                                    handleAreaClick={this.handleAreaClick}
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

export default connect(mapStateToProps)(AddRCMLead)


