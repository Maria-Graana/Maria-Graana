import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
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
import _ from 'underscore';

class AddRCMLead extends Component {
    constructor(props) {
        super(props)
        this.state = {
            organizations: [],
            checkValidation: false,
            clientName: '',
            selectedClient: null,
            selectedCity: null,
            getProject: [],
            formType: 'sale',
            priceList: [],
            sizeUnitList: [],
            selectSubType: [],
            loading: false,
            sixKArray: helper.createArray(60000),
            fifteenKArray: helper.createArray(15000),
            fiftyArray: helper.createArray(50),
            hundredArray: helper.createArray(100),
            isBedBathModalVisible: false,
            isPriceModalVisible: false,
            modalType: 'none',
            RCMFormData: {
                type: "",
                subtype: "",
                leadAreas: [],
                customerId: '',
                city_id: '',
                size_unit: 'marla',
                description: '',
                org: '',
                bed: null,
                maxBed: null,
                bath: null,
                maxBath: null,
                size: 0,
                maxSize: 0,
                minPrice: 0,
                maxPrice: 0,
            }
        }
    }


    componentDidUpdate(prevProps, prevState) {
        //Typical usage, don't forget to compare the props
        if (prevState.selectedCity && this.state.selectedCity.value !== prevState.selectedCity.value) {
            this.clearAreaOnCityChange(); // clear area field only when city is changed, doesnot get called if same city is selected again..
        }
    }



    componentDidMount() {
        const { user, navigation } = this.props
        const { purpose } = this.props.route.params;
        if (purpose) {
            this.setState({ formType: purpose }, () => {
                this.setPriceList()
            })
        }
        else {
            this.setPriceList()
        }
        navigation.addListener('focus', () => {
            this.onScreenFocused()
        })
        this.setSizeUnitList('marla')
        this.fetchOrganizations()

    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        // selected Areas should be cleared to be used anywhere else
        dispatch(setSelectedAreas([]));
    }

    onScreenFocused = () => {
        const { client, name, selectedCity } = this.props.route.params;
        const { RCMFormData } = this.state;
        let copyObject = Object.assign({}, RCMFormData);
        if (client && name) this.setClient()
        if (selectedCity) {
            copyObject.city_id = selectedCity.value;
            this.setState({ formData: copyObject, selectedCity })
            setTimeout(() => {
                const { selectedAreasIds } = this.props;
                copyObject.leadAreas = selectedAreasIds;
                this.setState({ RCMFormData: copyObject, selectedCity })
            }, 1000)
        }
    }

    setClient = () => {
        const { RCMFormData } = this.state
        const { client, name } = this.props.route.params
        let copyObject = Object.assign({}, RCMFormData)
        let phones = []
        if (client.customerContacts && client.customerContacts.length) {
            client.customerContacts.map(item => { phones.push(item.phone) })
        }
        copyObject.customerId = client.id
        copyObject.phones = phones
        this.setState({ RCMFormData: copyObject, clientName: name, selectedClient: client })
    }

    fetchOrganizations = () => {
        axios.get('/api/user/organizations?limit=2')
            .then((res) => {
                let organizations = []
                res && res.data.rows.length && res.data.rows.map((item, index) => { return (organizations.push({ value: item.id, name: item.name })) })
                this.setState({ organizations })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    setPriceList = () => {
        const { formType, RCMFormData } = this.state;
        if (formType === 'sale') {
            RCMFormData.minPrice = StaticData.PricesBuy[0];
            RCMFormData.maxPrice = StaticData.PricesBuy[StaticData.PricesBuy.length - 1];
            this.setState({ RCMFormData, priceList: StaticData.PricesBuy })
        }
        else {
            RCMFormData.minPrice = StaticData.PricesRent[0];
            RCMFormData.maxPrice = StaticData.PricesRent[StaticData.PricesRent.length - 1];
            this.setState({ RCMFormData, priceList: StaticData.PricesRent })
        }
    }

    setSizeUnitList = (sizeUnit) => {
        const { RCMFormData, fifteenKArray, fiftyArray, sixKArray, hundredArray } = this.state
        let priceList = []
        if (sizeUnit === 'marla') priceList = fiftyArray
        if (sizeUnit === 'kanal') priceList = hundredArray
        if (sizeUnit === 'sqft') priceList = fifteenKArray
        if (sizeUnit === 'sqyd' || sizeUnit === 'sqm') priceList = sixKArray
        RCMFormData.size = 0;
        RCMFormData.maxSize = priceList.length - 1;
        this.setState({ RCMFormData, sizeUnitList: priceList })
    }

    handleRCMForm = (value, name) => {
        const { RCMFormData } = this.state
        const { dispatch } = this.props;
        RCMFormData[name] = value
        if (name === 'size_unit') this.setSizeUnitList(value)
        this.setState({ RCMFormData });
        if (RCMFormData.type != '') { this.selectSubtype(RCMFormData.type) }
    }

    clearAreaOnCityChange = () => {
        const { dispatch } = this.props;
        const { RCMFormData, } = this.state;
        let copyObject = Object.assign({}, RCMFormData);
        copyObject.leadAreas = [];
        this.setState({ RCMFormData: copyObject });
        dispatch(setSelectedAreas([]))
    }

    handleAreaClick = () => {
        const { RCMFormData } = this.state;
        const { city_id, leadAreas } = RCMFormData;
        const { navigation } = this.props;
        const isEditMode = `${leadAreas.length > 0 ? true : false}`
        if (city_id !== '' && city_id !== undefined) {
            navigation.navigate('AreaPickerScreen', { cityId: city_id, isEditMode: isEditMode, screenName: 'AddRCMLead' });
        }
        else {
            alert('Please select city first!')
        }
    }

    handleClientClick = () => {
        const { navigation } = this.props;
        const { selectedClient } = this.state;
        navigation.navigate('Client', { isFromDropDown: true, selectedClient, screenName: 'AddRCMLead' });
    }

    handleCityClick = () => {
        const { navigation } = this.props;
        const { selectedCity } = this.state;
        navigation.navigate('SingleSelectionPicker', { screenName: 'AddRCMLead', mode: 'city', selectedCity });
    }

    selectSubtype = (type) => {
        this.setState({
            selectSubType: StaticData.subType[type],
        }, () => {
            this.setDefaultValuesForBedBath(type)
        });
    }

    setDefaultValuesForBedBath = (type) => {
        if (type === 'residential') {
            const { RCMFormData } = this.state;
            const copyObject = { ...RCMFormData };
            copyObject.bed = 0;
            copyObject.bath = 0;
            copyObject.maxBed = StaticData.bedBathRange.length - 1;
            copyObject.maxBath = StaticData.bedBathRange.length - 1;
            this.setState({ RCMFormData: copyObject })
        }
    }

    RCMFormSubmit = () => {
        const { RCMFormData } = this.state
        const { user } = this.props
        if (user.subRole === 'group_management') {
            if (
                !RCMFormData.customerId ||
                !RCMFormData.city_id ||
                !RCMFormData.leadAreas ||
                !RCMFormData.type ||
                !RCMFormData.org ||
                !RCMFormData.subtype

            ) {
                this.setState({
                    checkValidation: true
                })
            } else this.sendPayload()
        }
        else {
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
            } else this.sendPayload()
        }
    }

    sendPayload = () => {
        const { formType, RCMFormData, formData, organizations } = this.state
        const { user } = this.props
        if (RCMFormData.size === '') RCMFormData.size = null
        else RCMFormData.size = Number(RCMFormData.size)
        this.setState({ loading: true })
        let payLoad = {
            purpose: formType,
            type: RCMFormData.type,
            subtype: RCMFormData.subtype,
            bed: StaticData.bedBathRange[RCMFormData.bed],
            bath: StaticData.bedBathRange[RCMFormData.bath],
            maxBed: StaticData.bedBathRange[RCMFormData.maxBed],
            maxBath: StaticData.bedBathRange[RCMFormData.maxBath],
            size: RCMFormData.size,
            leadAreas: RCMFormData.leadAreas,
            customerId: RCMFormData.customerId,
            city_id: RCMFormData.city_id,
            size_unit: RCMFormData.size_unit,
            price: RCMFormData.maxPrice,
            min_price: RCMFormData.minPrice,
            description: RCMFormData.description,
            max_size: RCMFormData.maxSize,
            phones: RCMFormData.phones
        }
        if (user.subRole === 'group_management') {
            let newOrg = _.find(organizations, function (item) { return item.value === formData.org })
            payLoad.org = newOrg.name.toLowerCase()
        }
        axios.post(`/api/leads`, payLoad)
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
            }).finally(() => {
                this.setState({ loading: false })
            })
    }

    changeStatus = (status) => {
        this.setState({
            formType: status,
        }, () => {
            this.setPriceList();
        })
    }

    showBedBathModal = (modalType) => {
        this.setState({ isBedBathModalVisible: true, modalType })
    }

    onBedBathModalDonePressed = (minValue, maxValue) => {
        const { RCMFormData, modalType } = this.state;
        const copyObject = { ...RCMFormData };
        switch (modalType) {
            case 'bed':
                copyObject.bed = minValue;
                copyObject.maxBed = maxValue;
                this.setState({ RCMFormData: copyObject });
                break;
            case 'bath':
                copyObject.bath = minValue;
                copyObject.maxBath = maxValue;
                this.setState({ RCMFormData: copyObject });
            default:
                break;
        }
        this.setState({ isBedBathModalVisible: false });
    }

    onModalCancelPressed = () => {
        this.setState({
            isBedBathModalVisible: false,
            isPriceModalVisible: false
        })
    }

    showPriceModal = () => {
        this.setState({ isPriceModalVisible: true })
    }

    onModalPriceDonePressed = (minValue, maxValue) => {
        const { RCMFormData } = this.state;
        const copyObject = { ...RCMFormData };
        copyObject.minPrice = minValue;
        copyObject.maxPrice = maxValue;
        this.setState({ RCMFormData: copyObject,isPriceModalVisible: false });
    }

    render() {
        const {
            organizations,
            cities,
            clientName,
            formType,
            RCMFormData,
            selectedCity,
            selectSubType,
            checkValidation,
            priceList,
            loading,
            sizeUnitList,
            isBedBathModalVisible,
            isPriceModalVisible,
            modalType
        } = this.state
        const { route } = this.props

        return (
            <View style={[route.params.pageName === 'CM' && AppStyles.container]}>
                <StyleProvider style={getTheme(formTheme)}>
                    <KeyboardAvoidingView enabled>
                        <ScrollView keyboardShouldPersistTaps="always">
                            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                                <View>
                                    <RCMLeadFrom
                                        sizeUnitList={sizeUnitList}
                                        organizations={_.clone(organizations)}
                                        handleClientClick={this.handleClientClick}
                                        selectedCity={selectedCity}
                                        handleCityClick={this.handleCityClick}
                                        clientName={clientName}
                                        formSubmit={this.RCMFormSubmit}
                                        checkValidation={checkValidation}
                                        handleForm={this.handleRCMForm}
                                        changeStatus={this.changeStatus}
                                        size={StaticData.oneToTen}
                                        sizeUnit={StaticData.sizeUnit}
                                        propertyType={StaticData.type}
                                        formData={RCMFormData}
                                        formType={formType}
                                        subType={selectSubType}
                                        handleAreaClick={this.handleAreaClick}
                                        priceList={priceList}
                                        onSliderValueChange={(values) => this.onSliderValueChange(values)}
                                        loading={loading}
                                        isBedBathModalVisible={isBedBathModalVisible}
                                        modalType={modalType}
                                        showBedBathModal={(value) => this.showBedBathModal(value)}
                                        onBedBathModalDonePressed={(minValue, maxValue) => this.onBedBathModalDonePressed(minValue, maxValue)}
                                        onModalCancelPressed={() => this.onModalCancelPressed()}
                                        isPriceModalVisible={isPriceModalVisible}
                                        showPriceModal={() => this.showPriceModal()}
                                        onModalPriceDonePressed={(minValue, maxValue) => this.onModalPriceDonePressed(minValue, maxValue)}
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
        selectedAreasIds: store.areasReducer.selectedAreas,
    }
}

export default connect(mapStateToProps)(AddRCMLead)


