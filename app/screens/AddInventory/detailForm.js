import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, FlatList, Dimensions } from 'react-native';
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
import { connect } from 'react-redux';
import { YellowBox } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
const { width } = Dimensions.get('window')

YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);

class DetailForm extends Component {
    constructor(props) {
        super(props)
    }


    renderImageTile = ({ item }) => {
        const { deleteImage } = this.props;
        return (
            <ImageBackground
                style={styles.backGroundImg}
                source={{ uri: item.uri }}
                borderRadius={5}>
                    <AntDesign style={styles.close} name="closecircle" size={20} onPress={(e) => deleteImage(item)}  />
            </ImageBackground>
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
            cities,
            areas,
            sizeUnit,
            selectedGrade,
            purpose,
            size,
            getCurrentLocation,
            getImages,
            showImages,
            imagesData,
            longitude,
            latitude,
            buttonText,
            buttonDisabled
        } = this.props

        const { size_unit} = this.props.formData;

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
                            checkValidation === true && formData.subType === '' && <ErrorMessage errorMessage={'Required'} />
                        }
                    </View>
                </View>

                {/* **************************************** */}

                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent onValueChange={handleForm} data={cities} selectedItem={formData.city_id} name={'city_id'} placeholder='Select City' />
                        {
                            checkValidation === true && formData.city_id === '' && <ErrorMessage errorMessage={'Required'} />
                        }
                    </View>
                </View>

                {/* **************************************** */}

                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent onValueChange={handleForm} name={'area_id'} data={areas} selectedItem={formData.area_id} placeholder='Select Area' />
                        {
                            checkValidation === true && formData.area_id === '' && <ErrorMessage errorMessage={'Required'} />
                        }
                    </View>
                </View>

                {/* **************************************** */}

                <View style={AppStyles.multiFormInput}>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.flexOne]}>
                        <View style={[AppStyles.inputWrap]}>
                            <PickerComponent onValueChange={handleForm} name={'size_unit'} selectedItem={size_unit} data={sizeUnit}  placeholder='Size Unit' />
                            {
                                checkValidation === true && formData.city_id === '' && <ErrorMessage errorMessage={'Required'} />
                            }
                        </View>
                    </View>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
                        <View style={[AppStyles.inputWrap]}>
                            <TextInput onChangeText={(text) => { handleForm(text, 'size') }} value={formData.size} keyboardType='numeric' style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'size'} placeholder={'Size'} />
                            {
                                checkValidation === true && formData.size === null && <ErrorMessage errorMessage={'Required'} />
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
                            <TextInput onChangeText={(text) => { handleForm(text, 'price') }}
                                value={price}
                                keyboardType='number-pad'
                                style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                                placeholder={'Demand Price'} />
                        </View>
                    </View>
                    {/* **************************************** */}

                    <Text style={[styles.countPrice,{textAlignVertical:'center'}]}>{formatPrice(price)}</Text>


                </View>



                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>

                    {
                        showImages === true ?
                            <View style={styles.imageContainerStyle}>
                                <FlatList
                                    data={imagesData}
                                    numColumns={2}
                                    renderItem={this.renderImageTile}
                                    keyExtractor={(index) => index}
                                    getItemLayout={this.getItemLayout}
                                />
                                <TouchableOpacity style={styles.addMoreImg} onPress={getImages}>
                                    <Text style={styles.uploadImageText}>Add More</Text>
                                </TouchableOpacity>

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
                                    <PickerComponent onValueChange={handleForm} data={size} selectedItem={formData.bed} name={'bed'} placeholder='Bed' />
                                </View>
                            </View>

                            {/* **************************************** */}
                            <View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
                                <View style={[AppStyles.inputWrap]}>
                                    <PickerComponent onValueChange={handleForm} data={size} selectedItem={formData.bath} name={'bath'} placeholder='Bath' />
                                </View>
                            </View>

                        </View>
                        : null
                }


                <View style={AppStyles.latLngMain}>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.latLngInputWrap, AppStyles.noMargin, AppStyles.borderrightLat]}>
                        <View style={[AppStyles.inputWrap]}>
                            <TextInput onChangeText={(text) => { handleForm((text), 'lat') }} value={latitude === null ? '' : String(latitude)} style={[AppStyles.formControl, AppStyles.inputPadLeft]} keyboardType='numeric' placeholder={'Latitude'} />
                        </View>
                    </View>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.latLngInputWrap, AppStyles.noMargin]}>
                        <View style={[AppStyles.inputWrap]}>
                            <TextInput onChangeText={(text) => { handleForm((text), 'lng') }} value={longitude === null ? '' : String(longitude)} style={[AppStyles.formControl, AppStyles.inputPadLeft]} keyboardType='numeric' placeholder={'Longitude'} />
                        </View>
                    </View>

                    {/* **************************************** */}
                    <TouchableOpacity style={AppStyles.locationBtn} onPress={getCurrentLocation}>
                        <Image source={LocationImg} style={AppStyles.locationIcon} />
                    </TouchableOpacity>

                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput onChangeText={(text) => { handleForm(text, 'ownerName') }} value={formData.ownerName} style={[AppStyles.formControl, AppStyles.inputPadLeft]} placeholder={'Owner Name'} />
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput onChangeText={(text) => { handleForm(text, 'phone') }} value={formData.phone} style={[AppStyles.formControl, AppStyles.inputPadLeft]} placeholder={'Owner Number'} />
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput onChangeText={(text) => { handleForm(text, 'address') }} value={formData.address} style={[AppStyles.formControl, AppStyles.inputPadLeft]} placeholder={'Owner Address'} />
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <Button
                        disabled={buttonDisabled}
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
    }
}

export default connect(mapStateToProps)(DetailForm)

