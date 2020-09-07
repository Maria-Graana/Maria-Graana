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
                size: 0,
                city_id: '',
                area_id: '',
                size_unit: 'marla',
                customer_id: '',
                price: 0,
                grade: '',
                status: 'pending',
                imageIds: [],
                lat: '',
                lng: '',
                description: '',
                general_size: null,
                lisitng_type: 'mm',
                features: {},
                custom_title: '',
                show_address: true,
                address: '',
                video: '',
                year_built: null,
                floors: 0,
                parking_space: 0,
                downpayment: 0,
            },
            showAdditional: false,
            features: StaticData.residentialFeatures,
            facing: StaticData.facing,
            utilities: StaticData.residentialUtilities,
            selectedFeatures: [],
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
        let parsedFeatures = JSON.parse(property.features);
        let amentities = _.isEmpty(parsedFeatures) ? [] : (_.keys(parsedFeatures));
        if (amentities.length) {
            amentities = _.map(amentities, amentity => (amentity.split('_').join(' ').replace(/\b\w/g, l => l.toUpperCase())))
            amentities = _.without(amentities, 'Year Built', 'Floors', 'Downpayment', 'Parking Space');
        }
        this.setState({
            formData: {
                id: property.id,
                type: property.type,
                subtype: property.subtype,
                purpose: property.purpose,
                bed: property.bed ? property.bed : '',
                bath: property.bath ? property.bath : '',
                size_unit: property.size_unit,
                size: property.size ? property.size : 0,
                city_id: property.city_id,
                area_id: property.area_id,
                address: property.address,
                customer_id: property.customer_id ? property.customer_id : '',
                price: property.price ? property.price : 0,
                imageIds: property.armsPropertyImages.length === 0 || property.armsPropertyImages === undefined
                    ?
                    []
                    : property.armsPropertyImages,
                grade: property.grade,
                status: property.status,
                lat: property.lat,
                lng: property.lng,
                description: property.description,
                year_built: parsedFeatures && parsedFeatures.year_built ? parsedFeatures.year_built : '',
                floors: parsedFeatures && parsedFeatures.floors ? parsedFeatures.floors : 0,
                parking_space: parsedFeatures && parsedFeatures.parking_space ? parsedFeatures.parking_space : '',
                downpayment: parsedFeatures && parsedFeatures.downpayment ? parsedFeatures.downpayment : 0,
                general_size: null,
                lisitng_type: 'mm',
                custom_title: '',
                show_address: true,
                video: property.video,
            },
            selectedClient: property.customer ? property.customer : null,
            selectedCity: property.city ? { ...property.city, value: property.city.id } : null,
            selectedFeatures: amentities,
            selectedArea: property.area ? { ...property.area, value: property.area.id } : null,
            clientName: property.customer && property.customer.first_name + ' ' + property.customer.last_name,
            buttonText: 'UPDATE PROPERTY'
        }, () => {
            //console.log(this.state.formData)
            this.selectSubtype(property.type);
            this.setFeatures(property.type);
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

    setFeatures = (type) => {
        if (type !== '') {
            if (type === 'residential') {
                this.setState({ features: StaticData.residentialFeatures, utilities: StaticData.residentialUtilities })
            }
            else if (type === 'plot') {
                this.setState({ features: StaticData.plotFeatures, utilities: StaticData.plotUtilities })
            }
            else if (type === 'commercial') {
                this.setState({ features: StaticData.commercialFeatures, utilities: StaticData.commercialUtilities })
            }
        }
    }

    // ********* Form Handle Function
    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData }, () => {
            //  console.log(formData);
        });
        if (formData.type !== '') {
            this.setFeatures(formData.type);
            this.selectSubtype(formData.type)
        }
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
        let features = {};
        const { navigation, route, dispatch } = this.props;
        const { selectedFeatures } = this.state;
        if (formData.year_built) { features["year_built"] = formData.year_built };
        if (formData.floors) { features["floors"] = formData.floors };
        if (formData.parking_space) { features["parking_space"] = formData.parking_space };
        if (formData.downpayment) { features["downpayment"] = this.convertToIntegerForZero(formData.downpayment) };
        selectedFeatures && selectedFeatures.length ? selectedFeatures.map((amenity, index) => {
            features[amenity.replace(/\s+/g, '_').toLowerCase()] = true;
        })
            : {}
        const { property } = route.params;
        const { images } = this.props;
        formData.lat = this.convertLatitude(formData.lat);
        formData.lng = this.convertLongitude(formData.lng);
        formData.size = this.convertToInteger(formData.size)
        formData.price = this.convertToInteger(formData.price)
        formData.features = features || {};
        formData.imageIds = _.pluck(images, 'id');
        // deleting these keys below from formdata as they are sent in features instead of seperately
        delete formData.parking_space;
        delete formData.floors;
        delete formData.year_built;
        delete formData.downpayment;
        if (route.params.update) {
            axios.patch(`/api/inventory/${property.id}`, formData)
                .then((res) => {
                    //console.log(res.data)
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

    getImagesFromGallery = () => {
        this.getPermissionAsync().then(result => {
            if (result === true) {
                this.setState({ isModalOpen: true })
            }
            else {
                // Perimission denied, perform action or display alert
            }
        });
    }

    takePhotos = async () => {
        let { status: camStatus } = await Permissions.getAsync(Permissions.CAMERA);
        if (camStatus !== 'granted') {
            const status = await Permissions.askAsync(Permissions.CAMERA).status;
            if (status !== 'granted') {
                return;
            }
        }

        let result = await ImagePicker.launchCameraAsync({
            quality: 0.5,
        });

        if (!result.cancelled) {
            this._compressImageAndUpload(result.uri, result)
        }
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
        let orginalWidth = object.width;
        let originalHeight = object.height;
        const manipResult = await ImageManipulator.manipulateAsync(uri, orginalWidth * 0.5 > 1920 ? [{ resize: { width: orginalWidth * 0.5, height: originalHeight * 0.5 } }] : [], {
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

    handleFeatures(feature) {
        if (this.state.selectedFeatures.includes(feature)) {
            let temp = this.state.selectedFeatures;
            delete temp[temp.indexOf(feature)];
            this.setState({ selectedFeatures: temp })
        } else {
            let temp = this.state.selectedFeatures;
            temp.push(feature);
            this.setState({ selectedFeatures: temp })
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
            showAdditional,
            additionalInformation,
            features,
            utilities,
            facing,
            selectedFeatures,
        } = this.state
        return (
            <StyleProvider style={getTheme(formTheme)}>
                <KeyboardAvoidingView enabled>
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
                                getImagesFromGallery={() => this.getImagesFromGallery()}
                                takePhotos={() => this.takePhotos()}
                                selectSubType={selectSubType}
                                sizeUnit={sizeUnit}
                                selectedGrade={formData.grade}
                                size={StaticData.oneToTen}
                                latitude={formData.lat}
                                longitude={formData.lng}
                                price={formData.price}
                                deleteImage={(image, index) => this.deleteImage(image, index)}
                                buttonDisabled={buttonDisabled}
                                showAdditional={showAdditional}
                                showAdditionalInformation={() => this.setState({ showAdditional: !showAdditional })}
                                additionalInformation={additionalInformation}
                                features={features}
                                utilities={utilities}
                                facing={facing}
                                selectedFeatures={selectedFeatures}
                                handleFeatures={(value) => this.handleFeatures(value)}
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


