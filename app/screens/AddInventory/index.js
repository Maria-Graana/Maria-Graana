import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { StyleProvider } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import getTheme from '../../../native-base-theme/components';
import formTheme from '../../../native-base-theme/variables/formTheme';
import axios from 'axios'
import DetailForm from './detailForm';
import StaticData from '../../StaticData'
import AppStyles from '../../AppStyles';
import helper from '../../helper';


class AddInventory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkValidation: false,
            cities: [],
            areas: [],
            selectSubType: [],
            selectedGrade: '',
            formData: {
                type: '',
                subtype: '',
                purpose: '',
                bed: null,
                bath: null,
                size: null,
                city_id: '',
                area_id: '',
                size_unit: null,
                price: '',
                grade: '',
                status: 'pending',
                lat: '',
                lng: '',
                ownerName: '',
                phone: '',
                address: '',
                description: '',
                generale_size: null,
                lisitng_type: 'mm',
                features: JSON.stringify({}),
                custom_title: '',
                show_address: true,
                video: '',

            }
        }
    }

    componentDidMount() {
        this.getCities();
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

    getAreas = (cityId) => {
        axios.get(`/api/areas?city_id=${cityId}&&all=${true}`)
            .then((res) => {
                let areas = [];
                res && res.data.items.map((item, index) => { return (areas.push({ value: item.id, name: item.name })) })
                this.setState({
                    areas: areas
                })
            })
    }

    selectSubtype = (type) => {
        this.setState({ selectSubType: StaticData.subType[type] })
    }

    // ********* Form Handle Function
    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData }, () => {

        })
        if (formData.type != '') { this.selectSubtype(formData.type) }
        if (formData.city_id != '') { this.getAreas(formData.city_id) }
    }

    // ********* On form Submit Function
    formSubmit = () => {
        const { formData } = this.state

        // ********* Form Validation Check
        if (!formData.type ||
            !formData.subtype ||
            !formData.city_id ||
            !formData.purpose ||
            !formData.area_id ||
            !formData.size_unit ||
            !formData.size
        ) {
            this.setState({
                checkValidation: true
            })
        } else {
            // ********* Call Add Inventory API here :)
            this.addProperty(formData);
        }
    }

    addProperty = (formData) => {
        const { navigation } = this.props;
        formData.lat = this.convertLatitude(formData.lat);
        formData.lng = this.convertLongitude(formData.lng);
        formData.size = this.convertToInteger(formData.size)
        formData.bed = this.convertToInteger(formData.bed)
        formData.bath = this.convertToInteger(formData.bath)
        formData.price = this.convertToInteger(formData.price)
        axios.post(`/api/inventory/create`, formData)
            .then((res) => {
                if (res.status === 200) {
                    helper.successToast('PROPERTY ADDED SUCCESSFULLY!')
                    navigation.goBack();
                }
                else {
                    helper.errorToast('ERROR: SOMETHING WENT WRONG')
                }

            })
            .catch((error) => {
                helper.errorToast('ERROR: ADDING PROPERTY')
                console.log('error', error.message)
            })
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            alert('Permission to access location was denied')
        }
        else {
            let location = await Location.getCurrentPositionAsync();
            this.handleForm(location.coords.latitude, 'lat');
            this.handleForm(location.coords.longitude, 'lng');
        }

    };

    convertLongitude = (val) => {
        if (val === '') {
            return null
        }
        else if (typeof (val) === 'string' && val != '') {
            return parseFloat(val);
        }
        else {
            return val;
        }

    }

    convertLatitude = (val) => {
        if (val === '') {
            return null
        }
        else if (typeof (val) === 'string' && val != '') {
            return parseFloat(val);
        }
        else {
            return val;
        }
    }

    convertToInteger = (val) => {
        if (val === '') {
            return null;
        }
        else if (typeof (val) === 'string' && val != '') {
            return parseInt(val);
        }
    }

    render() {
        const {
            formData,
            cities,
            areas,
            selectSubType,
            checkValidation,
        } = this.state
        return (
            <StyleProvider style={getTheme(formTheme)}>
                <KeyboardAvoidingView behavior="padding" enabled>
                    <ScrollView>
                        {/* ********* Form Component */}
                        <View style={AppStyles.container}>
                            <DetailForm
                                formSubmit={this.formSubmit}
                                checkValidation={checkValidation}
                                handleForm={this.handleForm}
                                formData={formData}
                                purpose={StaticData.purpose}
                                cities={cities}
                                areas={areas}
                                propertyType={StaticData.type}
                                getCurrentLocation={this._getLocationAsync}
                                selectSubType={selectSubType}
                                sizeUnit={StaticData.sizeUnit}
                                selectedGrade={formData.grade}
                                size={StaticData.oneToTen}
                                latitude={formData.lat}
                                longitude={formData.lng}
                                price={formData.price}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </StyleProvider>
        )
    }
}

export default AddInventory;


