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
                subType: '',
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
                name: '',
                phone: '',
                address: '',

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
        axios.get(`/api/areas?city_id=${cityId}`)
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
           // console.log('formData', formData);
        })
        if (formData.type != '') { this.selectSubtype(formData.type) }
        if (formData.city_id != '') { this.getAreas(formData.city_id) }
    }

    // ********* On form Submit Function
    formSubmit = () => {
        const { formData } = this.state

        // ********* Form Validation Check
        if (!formData.propertyType ||
            !formData.subType ||
            !formData.city ||
            !formData.area ||
            !formData.sizeUnit ||
            !formData.size ||
            !formData.price ||
            !formData.beds ||
            !formData.baths ||
            !formData.ownerName ||
            !formData.ownerNumber) {
            this.setState({
                checkValidation: true
            })
        } else {

            // ********* Call Add Inventory API here :)
         //   console.log(formData)
        }
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


