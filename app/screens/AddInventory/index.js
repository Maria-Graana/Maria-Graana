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
import { connect } from 'react-redux';
import _ from 'underscore';


class AddInventory extends Component {

    img = [];

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
            sizeUnit: StaticData.sizeUnit,
            buttonText: 'ADD PROPERTY',
            buttonDisabled: false,
            getClients: [],
            formData: {
                type: '',
                subtype: '',
                purpose: '',
                bed: 0,
                bath: 0,
                size: null,
                city_id: '',
                area_id: '',
                size_unit: 'marla',
                customer_id: '',
                price: '',
                grade: '',
                status: 'pending',
                imageIds: [],
                lat: '',
                lng: '',
                description: '',
                general_size: null,
                lisitng_type: 'mm',
                features: JSON.stringify({}),
                custom_title: '',
                show_address: true,
                video: '',
            }
        }
    }

    componentDidMount() {
        const { route, navigation, user } = this.props;
        if (route.params.update) {
            navigation.setOptions({ title: 'EDIT PROPERTY' })
            this.setEditValues()
        }
        this.getCities();
        this.getClients(user.id);
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

    setEditValues = () => {
        const { route } = this.props
        const { property } = route.params
        this.setState({
            formData: {
                id: property.id,
                type: property.type,
                subtype: property.subtype,
                purpose: property.purpose,
                bed: property.bed != 0 ? String(property.bed) : '',
                bath: property.bath != 0 ? String(property.bath) : '',
                size_unit: property.size_unit,
                size: String(property.size),
                city_id: property.city_id,
                area_id: property.area_id,
                customer_id: property.customer_id ? property.customer_id : '',
                price: property.price != 0 ? String(property.price) : '',
                imageIds: property.armsPropertyImages.length === 0 || property.armsPropertyImages === undefined
                    ?
                    []
                    : property.armsPropertyImages,
                grade: property.grade,
                status: property.status,
                lat: property.lat,
                lng: property.lng,
                description: property.description,
                general_size: null,
                lisitng_type: 'mm',
                features: JSON.stringify({}),
                custom_title: '',
                show_address: true,
                video: property.video,
            },
            buttonText: 'UPDATE PROPERTY'
        }, () => {
            // console.log(this.state.formData);
            this.selectSubtype(property.type);
            this.getAreas(property.city_id);
            this.state.formData.imageIds.length > 0 && this.setImagesForEditMode();
        })
    }

    setImagesForEditMode = () => {
        const { formData } = this.state;
        const { imageIds } = formData;
        imageIds.map(image => {
            this.img.push({
                id: image.id,
                uri: image.url,
                filename: '',
                filepath: '',
                filetype: image.type,
            })
        })
        // console.log(this.img);
        this.setState({ images: this.img, showImages: true });
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
        if (formData.size === '') {
            formData.size = null;
            this.setState({ formData })
        }
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
            !formData.size ||
            !formData.customer_id
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
        const { images } = this.state;
        formData.lat = this.convertLatitude(formData.lat);
        formData.lng = this.convertLongitude(formData.lng);
        formData.size = this.convertToInteger(formData.size)
        formData.bed = this.convertToIntegerForZero(formData.bed)
        formData.bath = this.convertToIntegerForZero(formData.bath)
        formData.price = this.convertToIntegerForZero(formData.price)
        formData.imageIds = _.pluck(images, 'id');

        if (route.params.update) {
            axios.patch(`/api/inventory/${property.id}`, formData)
                .then((res) => {
                    if (res.status === 200) {
                        console.log(res.data);
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



    getPermissionAsync = async () => {
        let { status: camStatus } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
        if (camStatus !== 'granted') {
            const status = await Permissions.askAsync(Permissions.CAMERA_ROLL).status;
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return false;
            }
        }
        // If permission is granted multiple selection dialog opens and image browser callback is called after user presses 'done'
        return true;
    };

    getImages = () => {
        const { buttonDisabled } = this.state;
        this.getPermissionAsync().then(result => {
            if (result === true) {
                if (buttonDisabled) {
                    alert('Please wait while images are processing')
                }
                else {
                    this._pickImage()
                }

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
            quality: 0.5,
            allowsMultipleSelection: true,
            base64: true
        });
        if (!result.cancelled) {

            let filename = result.uri.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            let ext = result.uri.split('.').pop()

            let image = {
                name: filename,
                type: type,
                uri: result.uri
            }


            this.img.push({
                uri: `data:image/${ext};base64,` + result.base64,
                filename,
                filepath: filename,
                filetype: type,
            });

            this.setState({
                images: this.img,
                showImages: true,
                buttonDisabled: true
            }, () => {
                this.uploadImage(image);
            })

        }
    };

    uploadImage(image) {
        const { images } = this.state;
        let fd = new FormData()
        fd.append('image', image);

        axios.post(`/api/inventory/image`, fd)
            .then((res) => {
                let newImages = images.map(value => {
                    if ('id' in value) {
                        return value;
                    }
                    else {
                        value.id = res.data.id;
                        return value;
                    }
                })

                this.setState({ images: newImages, buttonDisabled: false });

            })
            .catch((error) => {
                console.log('error', error.message)
            })
    }

    deleteImage = (image) => {
        const { images, buttonDisabled } = this.state;
        if (buttonDisabled) {
            alert('Please wait while images are processing')
        }
        else {
            this.img = _.without(images, image);
            // console.log(this.img);
            this.setState({
                images: this.img,
            }, () => {
                // show images false if no images exists
                if (this.state.images.length === 0) {
                    this.setState({ showImages: false })
                }
            })
            this.deleteImageFromServer(image.id);
        }

    }

    deleteImageFromServer(id) {
        // console.log(id);
        axios.delete(`/api/inventory/image/${id}`)
            .then((res) => {
                // console.log('response', res.status);
            })
            .catch((error) => {
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

    convertToIntegerForZero = (val) => {
        if (val === '') {
            return 0;
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
            showImages,
            images,
            buttonText,
            buttonDisabled,
            getClients,
            sizeUnit
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
                                sizeUnit={sizeUnit}
                                selectedGrade={formData.grade}
                                size={StaticData.oneToTen}
                                latitude={formData.lat}
                                longitude={formData.lng}
                                price={formData.price}
                                showImages={showImages}
                                getClients={getClients}
                                imagesData={images}
                                deleteImage={(image) => this.deleteImage(image)}
                                buttonDisabled={buttonDisabled}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </StyleProvider>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user,
    }
}

export default connect(mapStateToProps)(AddInventory)


