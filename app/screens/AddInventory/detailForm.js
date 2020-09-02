import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { Button } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import PickerComponent from '../../components/Picker/index';
import axios from 'axios'
import styles from './style';
import AppStyles from '../../AppStyles';
import LocationImg from '../../../assets/img/location.png'
import ErrorMessage from '../../components/ErrorMessage'
import RadioComponent from '../../components/RadioButton/index';
import { formatPrice } from '../../PriceFormate'
import TouchableInput from '../../components/TouchableInput';
import { connect } from 'react-redux';
import { YellowBox } from 'react-native';
const { width } = Dimensions.get('window')

YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);

class DetailForm extends Component {
    constructor(props) {
        super(props)
    }


    renderImageTile = (item) => {
        const { deleteImage } = this.props;
        return (
            <View style={styles.backGroundImg}>
                <AntDesign style={styles.close} name="closecircle" size={26} onPress={(e) => deleteImage(item.id)} />
                <Image source={{ uri: item.uri }} style={{ width: 120, height: 120 }} borderRadius={5} />
            </View>
        )
    }

    getItemLayout = (data, index) => {
        let length = width / 2;
        return { length, offset: length * index, index }
    }

    render() {
        const {
            formSubmit,
            checkValidation,
            handleForm,
            formData,
            propertyType,
            selectSubType,
            price,
            selectedCity,
            handleCityClick,
            selectedArea,
            handleAreaClick,
            sizeUnit,
            selectedGrade,
            purpose,
            getCurrentLocation,
            getImages,
            longitude,
            latitude,
            buttonText,
            images,
            imageLoading,
            clientName,
            handleClientClick,
        } = this.props

        const { size_unit } = this.props.formData;
        return (

            <View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent onValueChange={handleForm} data={propertyType} selectedItem={formData.type} name={'type'} placeholder='Property Type' />
                        {
                            checkValidation === true && formData.type === '' && <ErrorMessage errorMessage={'Required'} />
                        }
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent onValueChange={handleForm} data={selectSubType} selectedItem={formData.subtype} name={'subtype'} placeholder='Property Sub Type' />
                        {
                            checkValidation === true && formData.subtype === '' && <ErrorMessage errorMessage={'Required'} />
                        }
                    </View>
                </View>

                {/* **************************************** */}

                <TouchableInput placeholder="Select City"
                    onPress={() => handleCityClick()}
                    value={selectedCity ? selectedCity.name : ''}
                    showError={checkValidation === true && formData.city_id === ''}
                    errorMessage="Required" />
                {/* **************************************** */}


                <TouchableInput placeholder="Select Area"
                    onPress={() => handleAreaClick()}
                    value={selectedArea ? selectedArea.name : ''}
                    showError={checkValidation === true && formData.area_id === ''}
                    errorMessage="Required" />

                {/* **************************************** */}

                <View style={AppStyles.multiFormInput}>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.flexOne]}>
                        <View style={[AppStyles.inputWrap]}>
                            <TextInput placeholderTextColor={'#a8a8aa'} onChangeText={(text) => { handleForm(text, 'size') }} value={formData.size} keyboardType='numeric' style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'size'} placeholder={'Size'} />
                            {
                                checkValidation === true && formData.size === null && <ErrorMessage errorMessage={'Required'} />
                            }
                        </View>
                    </View>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
                        <View style={[AppStyles.inputWrap]}>
                            <PickerComponent onValueChange={handleForm} name={'size_unit'} selectedItem={size_unit} data={sizeUnit} placeholder='Size Unit' />
                            {
                                checkValidation === true && formData.size_unit === '' && <ErrorMessage errorMessage={'Required'} />
                            }
                        </View>
                    </View>



                </View>

                {/* **************************************** */}

                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent onValueChange={handleForm} data={purpose} selectedItem={formData.purpose} name={'purpose'} placeholder='Available for' />
                        {
                            checkValidation === true && formData.purpose === '' && <ErrorMessage errorMessage={'Required'} />
                        }
                    </View>
                </View>

                {/* **************************************** */}


                <View style={[AppStyles.latLngMain]}>

                    {/* **************************************** */}
                    <View style={[{ width: '75%' }, AppStyles.mainInputWrap, AppStyles.noMargin]}>
                        <View style={[AppStyles.inputWrap]}>
                            <TextInput placeholderTextColor={'#a8a8aa'} onChangeText={(text) => { handleForm(text, 'price') }}
                                value={price}
                                keyboardType='number-pad'
                                style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                                placeholder={'Demand Price'} />
                        </View>
                    </View>
                    {/* **************************************** */}

                    <Text style={[styles.countPrice, { textAlignVertical: 'center' }]}>{formatPrice(price)}</Text>


                </View>



                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>

                    {
                        images.length > 0 ?
                            <View style={styles.imageContainerStyle}>
                                <FlatList
                                    data={images}
                                    numColumns={2}
                                    renderItem={({ item }) => this.renderImageTile(item)}
                                    keyExtractor={(element, index) => index.toString()}
                                    getItemLayout={this.getItemLayout}
                                />
                                {
                                    imageLoading ?
                                        <View style={styles.addMoreImg}>
                                            <ActivityIndicator size="large" color={AppStyles.colors.primaryColor} />
                                        </View>
                                        :
                                        <TouchableOpacity style={styles.addMoreImg} onPress={getImages}>
                                            <Text style={styles.uploadImageText}>Add More</Text>
                                        </TouchableOpacity>
                                }


                            </View>
                            :
                            <TouchableOpacity style={styles.uploadImg} onPress={getImages}>
                                <Text style={styles.uploadImageText}>Upload Images</Text>
                            </TouchableOpacity>
                    }

                </View>

                {/* **************************************** */}

                <View style={[AppStyles.multiFormInput, styles.radioComponentStyle]}>
                    <RadioComponent
                        onGradeSelected={(val) => handleForm(val, 'grade')}
                        selected={selectedGrade === 'Grade A' ? true : false}
                        value='Grade A' >
                        Grade A
                        </RadioComponent>
                    <RadioComponent
                        onGradeSelected={(val) => handleForm(val, 'grade')}
                        selected={selectedGrade === 'Grade B' ? true : false}
                        value='Grade B' >
                        Grade B
                        </RadioComponent>
                    <RadioComponent
                        onGradeSelected={(val) => handleForm(val, 'grade')}
                        selected={selectedGrade === 'Grade C' ? true : false}
                        value='Grade C' >
                        Grade C
                        </RadioComponent>
                </View>

                {/* **************************************** */}

                {
                    formData.type === 'residential' ?
                        <View style={AppStyles.multiFormInput}>

                            {/* **************************************** */}
                            <View style={[AppStyles.mainInputWrap, AppStyles.flexOne]}>
                                <View style={[AppStyles.inputWrap]}>
                                    <TextInput placeholderTextColor={'#a8a8aa'} onChangeText={(text) => { handleForm(text, 'bed') }}
                                        value={formData.bed === 0 ? '' : String(formData.bed)}
                                        keyboardType='numeric'
                                        style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                                        name={'bed'}
                                        placeholder={'Bed'} />
                                </View>
                            </View>

                            {/* **************************************** */}
                            <View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
                                <View style={[AppStyles.inputWrap]}>
                                    <TextInput placeholderTextColor={'#a8a8aa'} onChangeText={(text) => { handleForm(text, 'bath') }}
                                        value={formData.bath === 0 ? '' : String(formData.bath)}
                                        keyboardType='numeric'
                                        style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                                        name={'bath'}
                                        placeholder={'Bath'} />
                                </View>
                            </View>

                        </View>
                        : null
                }


                <View style={AppStyles.latLngMain}>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.latLngInputWrap, AppStyles.noMargin, AppStyles.borderrightLat]}>
                        <View style={[AppStyles.inputWrap]}>
                            <TextInput placeholderTextColor={'#a8a8aa'} onChangeText={(text) => { handleForm((text), 'lat') }} value={latitude === null ? '' : String(latitude)} style={[AppStyles.formControl, AppStyles.inputPadLeft]} keyboardType='numeric' placeholder={'Latitude'} />
                        </View>
                    </View>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.latLngInputWrap, AppStyles.noMargin]}>
                        <View style={[AppStyles.inputWrap]}>
                            <TextInput placeholderTextColor={'#a8a8aa'} onChangeText={(text) => { handleForm((text), 'lng') }} value={longitude === null ? '' : String(longitude)} style={[AppStyles.formControl, AppStyles.inputPadLeft]} keyboardType='numeric' placeholder={'Longitude'} />
                        </View>
                    </View>

                    {/* **************************************** */}
                    <TouchableOpacity style={AppStyles.locationBtn} onPress={getCurrentLocation}>
                        <Image source={LocationImg} style={AppStyles.locationIcon} />
                    </TouchableOpacity>

                </View>

                {/* **************************************** */}
                <TouchableInput placeholder="Owner Name"
                    onPress={() => handleClientClick()}
                    value={clientName}
                    showError={checkValidation === true && formData.customerId === ''}
                    errorMessage="Required" />


                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <Button
                        disabled={imageLoading}
                        style={[AppStyles.formBtn, styles.addInvenBtn]} onPress={() => { formSubmit() }}>
                        <Text style={AppStyles.btnText}>{buttonText}</Text>
                    </Button>
                </View>

            </View >
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user,
        images: store.property.images,
        imageLoading: store.property.imageLoader,
    }
}

export default connect(mapStateToProps)(DetailForm)

