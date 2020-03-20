import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Button } from 'native-base';
import PickerComponent from '../../components/Picker/index';
import styles from './style';
import AppStyles from '../../AppStyles';
import LocationImg from '../../../assets/img/location.png'
import ErrorMessage from '../../components/ErrorMessage'
import { connect } from 'react-redux';

class DetailForm extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { formSubmit, checkValidation, handleForm, formData, dummyData } = this.props
        return (
            <View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent onValueChange={handleForm} name={'propertyType'} data={dummyData} value={''} placeholder='Property Type' />
                        {
                            checkValidation === true && formData.propertyType === '' && <ErrorMessage errorMessage={'Required'} />
                        }
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent onValueChange={handleForm} name={'subType'} data={dummyData} value={''} placeholder='Property Sub Type' />
                        {
                            checkValidation === true && formData.subType === '' && <ErrorMessage errorMessage={'Required'} />
                        }
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent onValueChange={handleForm} name={'city'} data={dummyData} value={''} placeholder='Select City' />
                        {
                            checkValidation === true && formData.city === '' && <ErrorMessage errorMessage={'Required'} />
                        }
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent onValueChange={handleForm} name={'area'} data={dummyData} value={''} placeholder='Select Area' />
                        {
                            checkValidation === true && formData.area === '' && <ErrorMessage errorMessage={'Required'} />
                        }
                    </View>
                </View>

                <View style={AppStyles.multiFormInput}>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.flexOne]}>
                        <View style={[AppStyles.inputWrap]}>
                            <PickerComponent onValueChange={handleForm} name={'sizeUnit'} data={dummyData} value={''} placeholder='Size Unit' />
                            {
                                checkValidation === true && formData.sizeUnit === '' && <ErrorMessage errorMessage={'Required'} />
                            }
                        </View>
                    </View>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
                        <View style={[AppStyles.inputWrap]}>
                            <TextInput onChangeText={(text) => { handleForm(text, 'size') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'size'} placeholder={'Size'} />
                            {
                                checkValidation === true && formData.size === '' && <ErrorMessage errorMessage={'Required'} />
                            }
                        </View>
                    </View>

                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput onChangeText={(text) => { handleForm(text, 'price') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'price'} placeholder={'Demand Price'} />
                        {
                            checkValidation === true && formData.price === '' && <ErrorMessage errorMessage={'Required'} />
                        }
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TouchableOpacity style={styles.uploadImg}>
                            <Text style={styles.uploadImageText}>Upload Images</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent onValueChange={handleForm} name={'grade'} data={dummyData} value={''} placeholder='Select Grade' />
                    </View>
                </View>

                <View style={AppStyles.multiFormInput}>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.flexOne]}>
                        <View style={[AppStyles.inputWrap]}>
                            <PickerComponent onValueChange={handleForm} name={'beds'} data={dummyData} value={''} placeholder='Beds' />
                            {
                                checkValidation === true && formData.beds === '' && <ErrorMessage errorMessage={'Required'} />
                            }
                        </View>
                    </View>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
                        <View style={[AppStyles.inputWrap]}>
                            <PickerComponent onValueChange={handleForm} name={'baths'} data={dummyData} value={''} placeholder='Baths' />
                            {
                                checkValidation === true && formData.baths === '' && <ErrorMessage errorMessage={'Required'} />
                            }
                        </View>
                    </View>

                </View>


                <View style={AppStyles.latLngMain}>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.latLngInputWrap, AppStyles.noMargin, AppStyles.borderrightLat]}>
                        <View style={[AppStyles.inputWrap]}>
                            <TextInput onChangeText={(text) => { handleForm(text, 'lat') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'lat'} placeholder={'Latitude'} />
                        </View>
                    </View>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.latLngInputWrap, AppStyles.noMargin]}>
                        <View style={[AppStyles.inputWrap]}>
                            <TextInput onChangeText={(text) => { handleForm(text, 'lng') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'lng'} placeholder={'Longitude'} />
                        </View>
                    </View>

                    {/* **************************************** */}
                    <TouchableOpacity style={AppStyles.locationBtn}>
                        <Image source={LocationImg} style={AppStyles.locationIcon} />
                    </TouchableOpacity>

                </View>


                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput onChangeText={(text) => { handleForm(text, 'ownerName') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'ownerName'} placeholder={'Owner Name'} />
                        {
                            checkValidation === true && formData.ownerName === '' && <ErrorMessage errorMessage={'Required'} />
                        }
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput onChangeText={(text) => { handleForm(text, 'ownerNumber') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'ownerNumber'} placeholder={'Owner Number'} />
                        {
                            checkValidation === true && formData.ownerNumber === '' && <ErrorMessage errorMessage={'Required'} />
                        }
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput onChangeText={(text) => { handleForm(text, 'ownerAddress') }} style={[AppStyles.formControl, AppStyles.inputPadLeft]} name={'ownerAddress'} placeholder={'Owner Address'} />
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <Button
                        style={[AppStyles.formBtn, styles.addInvenBtn]} onPress={() => { formSubmit() }}>
                        <Text style={AppStyles.btnText}>ADD INVENTORY</Text>
                    </Button>
                </View>
            </View>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user,
    }
}

export default connect(mapStateToProps)(DetailForm)

