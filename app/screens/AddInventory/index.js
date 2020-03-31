import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { StyleProvider } from 'native-base';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import getTheme from '../../../native-base-theme/components';
import formTheme from '../../../native-base-theme/variables/formTheme';
import axios from 'axios'
import DetailForm from './detailForm';
import StaticData from '../../StaticData'
import AppStyles from '../../AppStyles';
import helper from '../../helper';
import _ from 'underscore';


class AddInventory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkValidation: false,
            cities: [],
            areas: [],
            selectSubType: [],
            images: [],
            showImages: false,
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
                //imageIds: [],
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
        const { route, navigation } = this.props;
        if (route.params.update) {
            navigation.setOptions({ title: 'EDIT PROPERTY' })
            this.setEditValues()
        }
        this.getCities();
    }

    setEditValues = () => {
        const { route } = this.props
        const { property } = route.params
        this.setState({
            formData: {
                id: property.id,
                type: property.type,
                subtype: property.subtype,
                purpose: property.purpose,
                bed: String(property.bed),
                bath: String(property.bath),
                size_unit: property.size_unit,
                size: String(property.size),
                city_id: property.city_id,
                area_id: property.area_id,
                price: String(property.price),
                grade: property.grade,
                status: property.status,
                //imageIds: [],
                lat: property.lat,
                lng: property.lng,
                ownerName: property.customer.first_name,
                phone: property.phone,
                address: property.address,
                description: property.description,
                generale_size: null,
                lisitng_type: 'mm',
                features: JSON.stringify({}),
                custom_title: '',
                show_address: true,
                video: property.video,
            },
            buttonText: 'EDIT PROPERTY'
        }, () => {
            this.selectSubtype(property.type);
            this.getAreas(property.city_id)
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
            // console.log('formData', formData)
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
            this.createOrEditProperty(formData);
        }
    }

    createOrEditProperty = (formData) => {
        const { navigation, route } = this.props;
        const { property } = route.params;
        console.log(property.id);
        formData.lat = this.convertLatitude(formData.lat);
        formData.lng = this.convertLongitude(formData.lng);
        formData.size = this.convertToInteger(formData.size)
        formData.bed = this.convertToInteger(formData.bed)
        formData.bath = this.convertToInteger(formData.bath)
        formData.price = this.convertToInteger(formData.price)

        if (route.params.update) {
            axios.patch(`/api/inventory/${property.id}`, formData)
                .then((res) => {
                    if (res.status === 200) {
                        helper.successToast('PROPERTY UPDATED SUCCESSFULLY!')
                        navigation.navigate('Inventory', { update: false })
                    }
                    else {
                        console.log('wrong');
                        helper.errorToast('ERROR: SOMETHING WENT WRONG')
                    }

                })
                .catch((error) => {
                    helper.errorToast('ERROR: UPDATING PROPERTY')
                    console.log('error', error.message)
                })
        }
        else {
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

    getPermissionAsync = async () => {
        let { status: camStatus } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
        //  console.log('status of Camera permission: ', camStatus);
        if (camStatus !== 'granted') {
            const status = await Permissions.askAsync(Permissions.CAMERA_ROLL).status;
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                // console.log('Asked for permission, but not granted!');
                return false;
            }
        }
        // If permission is granted multiple selection dialog opens and image browser callback is called after user presses 'done'
        return true;
    };

    getImages = () => {
        this.getPermissionAsync().then(result => {
            if (result === true) {
                this._pickImage()
            }
            else {
                // Perimission denied, perform action or display alert
                Alert.alert('Permission Required !', 'Please provide permission to access gallery!');
            }
        });
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsMultipleSelection: true,
            base64: true
        });
        if (!result.cancelled) {

            // let filename = result.uri.split('/').pop();
            // // let match = /\.(\w+)$/.exec(filename);
            // // let type = match ? `image/${match[1]}` : `image`;
           let ext = result.uri.split('.').pop()


            // axios.post(`api/inventory/image`, fd)
            //     .then((res) => {
            //         if (res.status === 200) {
            //             console.log('response', res)
            //         }
            //         else {
            //         }

            //     })
            //     .catch((error) => {
            //         console.log('error', error.message)
            //     })

            this.setState(prevState => ({
                images: [...prevState.images, `data:image/${ext};base64,` + result.base64],
                showImages: true
            })
            )
        }
    };

    deleteImage = (image) => {
        const { images } = this.state;
        let deletedImage = _.without(images, image)
        this.setState({
            images: deletedImage,
        }, () => {
            // show images false if no images exists
            if (this.state.images.length === 0) {
                this.setState({ showImages: false })
            }
        })
    }

    render() {
        const {
            formData,
            cities,
            areas,
            selectSubType,
            checkValidation,
            showImages,
            images,
            buttonText
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
                                buttonText={buttonText}
                                propertyType={StaticData.type}
                                getCurrentLocation={this._getLocationAsync}
                                getImages={this.getImages}
                                selectSubType={selectSubType}
                                sizeUnit={StaticData.sizeUnit}
                                selectedGrade={formData.grade}
                                size={StaticData.oneToTen}
                                latitude={formData.lat}
                                longitude={formData.lng}
                                price={formData.price}
                                showImages={showImages}
                                imagesData={images}
                                deleteImage={(image) => this.deleteImage(image)}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </StyleProvider>
        )
    }
}

export default AddInventory;


