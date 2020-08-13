import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Alert, Modal } from 'react-native';
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
import { ImageBrowser } from 'expo-multiple-media-imagepicker';
import * as ImageManipulator from 'expo-image-manipulator';
import { uploadImage, addImage, flushImages, removeImage, setImageLoading } from '../../actions/property'


class AddInventory extends Component {

    constructor(props) {
        super(props)
        this.state = {
            checkValidation: false,
            areas: [],
            selectSubType: [],
            selectedGrade: '',
            sizeUnit: StaticData.sizeUnit,
            buttonText: 'ADD PROPERTY',
            clientName: '',
            selectedClient: null,
            selectedCity: null,
            selectedArea: null,
            isModalOpen: false,
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
        navigation.addListener('focus', () => {
            this.onScreenFocused()
        })
        if (route.params.update) {
            navigation.setOptions({ title: 'EDIT PROPERTY' })
            this.setEditValues()
        }
    }

    componentDidUpdate(prevProps, prevState) {
        //Typical usage, don't forget to compare the props
        if (prevState.selectedCity && this.state.selectedCity.value !== prevState.selectedCity.value) {
            this.clearAreaOnCityChange(); // clear area field only when city is changed, doesnot get called if same city is selected again..
        }
    }

    componentWillUnmount() {
        this.props.dispatch(flushImages());
        this.props.dispatch((setImageLoading(false)));
    }

    onScreenFocused = () => {
        const { client, name, selectedCity, selectedArea } = this.props.route.params;
        const { formData } = this.state;
        let copyObject = Object.assign({}, formData);
        if (client && name) {
            copyObject.customer_id = client.id;
            this.setState({ formData: copyObject, clientName: name, selectedClient: client })
        }
        if (selectedCity) {
            copyObject.city_id = selectedCity.value;
            this.setState({ formData: copyObject, selectedCity })
        }
        if (selectedArea) {
            copyObject.area_id = selectedArea.value;
            this.setState({ formData: copyObject, selectedArea })
        }
    }

    clearAreaOnCityChange = () => {
        const { formData } = this.state;
        this.setState({ formData: { ...formData, area_id: '' }, selectedArea: null });
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
                bed: property.bed ? String(property.bed) : '',
                bath: property.bath ? String(property.bath) : '',
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
            selectedClient: property.customer ? property.customer : null,
            selectedCity: property.city ? { ...property.city, value: property.city.id } : null,
            selectedArea: property.area ? { ...property.area, value: property.area.id } : null,
            clientName: property.customer && property.customer.first_name + ' ' + property.customer.last_name,
            buttonText: 'UPDATE PROPERTY'
        }, () => {
            this.selectSubtype(property.type);
            // this.getAreas(property.city_id);
            this.state.formData.imageIds.length > 0 && this.setImagesForEditMode();
        })
    }

    setImagesForEditMode = () => {
        const { dispatch } = this.props;
        const { formData } = this.state;
        const { imageIds } = formData;
        imageIds.map(image => {
            dispatch(addImage({
                id: image.id,
                uri: image.url,
                filetype: image.type,
            }))
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
        const { navigation, route, dispatch } = this.props;
        const { property } = route.params;
        const { images } = this.props;
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
                        helper.successToast('PROPERTY UPDATED SUCCESSFULLY!')
                        dispatch(flushImages());
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
                        dispatch(flushImages());
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
        this.getPermissionAsync().then(result => {
            if (result === true) {
                this.setState({ isModalOpen: true })
            }
            else {
                // Perimission denied, perform action or display alert
            }
        });
    }

    imageBrowserCallback = mediaAssets => {
        const { dispatch } = this.props;
        mediaAssets
            .then(photos => {
                this.setState(
                    {
                        isModalOpen: false,
                    },
                    () => {
                        // console.log('@@@', photos)
                        if (photos.length > 0) {
                            dispatch((setImageLoading(true)));
                            this._uploadMultipleImages(photos);
                        }
                        else {
                            helper.errorToast('No pictures selected');
                        }

                    }
                );
            })
            .catch(e => console.log(e));
    };

    _uploadMultipleImages(response) {
        // response contains the array of photos
        response.map(object => {
            // map each photo and upload them one at a time
            //Compress the image so that it can be uploaded to the server
            this._compressImageAndUpload(object.uri, object);
        });
    }

    //Image Compression and image size reduction...
    _compressImageAndUpload = async (uri, object) => {
        const { dispatch } = this.props;
        let finalWidth = object.width;
        let finalHeight = object.height;
        if(finalWidth > 1920){
            finalWidth = finalWidth * 0.5;
            finalHeight = finalHeight * 0.5;
        }
        const manipResult = await ImageManipulator.manipulateAsync(uri, [{resize: {width:finalWidth , height: finalHeight}}], {
            compress: 0.5,
        });
        let filename = manipResult.uri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        let image = {
            name: filename,
            type: type,
            uri: manipResult.uri
        }
       dispatch(uploadImage(image));
    };


    deleteImage = (imageId) => {
        const { dispatch } = this.props;
        if (imageId) {
            dispatch(removeImage(imageId)).then((response) => {
                helper.successToast(response);
            });
        }
        else {
            alert('Please wait while images are processing')
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

    convertToIntegerForZero = (val) => {
        if (val === 0) {
            return 0;
        }
        else if (typeof (val) === 'string' && val != '') {
            return parseInt(val);
        }
    }

    handleClientClick = () => {
        const { navigation } = this.props;
        const { selectedClient } = this.state;
        navigation.navigate('Client', { isFromDropDown: true, selectedClient, screenName: 'AddInventory' });
    }

    handleCityClick = () => {
        const { navigation } = this.props;
        const { selectedCity } = this.state;
        navigation.navigate('SingleSelectionPicker', { screenName: 'AddInventory', mode: 'city', selectedCity });
    }


    handleAreaClick = () => {
        const { navigation } = this.props;
        const { selectedArea, selectedCity } = this.state;
        if (selectedCity) {
            navigation.navigate('SingleSelectionPicker', { screenName: 'AddInventory', mode: 'area', cityId: selectedCity.value, selectedArea });
        }
        else {
            alert('Please select city first!');
        }
    }

    render() {
        const {
            formData,
            selectSubType,
            checkValidation,
            buttonText,
            buttonDisabled,
            sizeUnit,
            clientName,
            selectedCity,
            selectedArea,
            isModalOpen,
        } = this.state
        return (
            <StyleProvider style={getTheme(formTheme)}>
                <KeyboardAvoidingView behavior="padding" enabled>
                    <Modal
                        animated={true}
                        ref={ref => (this._modal = ref)}
                        animationType="slide"
                        visible={isModalOpen}
                        onRequestClose={() => this.setState({ isModalOpen: false })}
                    >
                        <View style={{ flex: 1 }}>
                            <ImageBrowser
                                max={10} // Maximum number of pickable image. default is None
                                callback={this.imageBrowserCallback} // Callback functinon on press Done or Cancel Button. Argument is Asset Infomartion of the picked images wrapping by the Promise.
                            />
                        </View>
                    </Modal>
                    <ScrollView>
                        {/* ********* Form Component */}
                        <View style={AppStyles.container}>
                            <DetailForm
                                formSubmit={this.formSubmit}
                                checkValidation={checkValidation}
                                handleForm={this.handleForm}
                                formData={formData}
                                purpose={StaticData.purpose}
                                selectedCity={selectedCity}
                                selectedArea={selectedArea}
                                handleCityClick={this.handleCityClick}
                                handleAreaClick={this.handleAreaClick}
                                buttonText={buttonText}
                                clientName={clientName}
                                handleClientClick={this.handleClientClick}
                                propertyType={StaticData.type}
                                getCurrentLocation={this._getLocationAsync}
                                getImages={() => this.getImages()}
                                selectSubType={selectSubType}
                                sizeUnit={sizeUnit}
                                selectedGrade={formData.grade}
                                size={StaticData.oneToTen}
                                latitude={formData.lat}
                                longitude={formData.lng}
                                price={formData.price}
                                deleteImage={(image, index) => this.deleteImage(image, index)}
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
        images: store.property.images,
    }
}

export default connect(mapStateToProps)(AddInventory)


