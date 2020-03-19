import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Button } from 'native-base';
import PickerComponent from '../../components/Picker/index';
import styles from './style';
import AppStyles from '../../AppStyles';
import LocationImg from '../../../assets/img/location.png'
import { connect } from 'react-redux';

class DetailForm extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() { }

    render() {

        return (
            <View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent selectedItem={''} data={''} value={''} placeholder='Property Type' />
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent selectedItem={''} data={''} value={''} placeholder='Property Sub Type' />
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent selectedItem={''} data={''} value={''} placeholder='Select City' />
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent selectedItem={''} data={''} value={''} placeholder='Select Area' />
                    </View>
                </View>

                <View style={AppStyles.multiFormInput}>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.flexOne]}>
                        <View style={[AppStyles.inputWrap]}>
                            <PickerComponent selectedItem={''} data={''} value={''} placeholder='Size Unit' />
                        </View>
                    </View>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
                        <View style={[AppStyles.inputWrap]}>
                            <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft]} placeholder={'Size'} />
                        </View>
                    </View>

                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft]} placeholder={'Demand Price'} />
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
                        <PickerComponent selectedItem={''} data={''} value={''} placeholder='Select Grade' />
                    </View>
                </View>

                <View style={AppStyles.multiFormInput}>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.flexOne]}>
                        <View style={[AppStyles.inputWrap]}>
                            <PickerComponent selectedItem={''} data={''} value={''} placeholder='Beds' />
                        </View>
                    </View>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
                        <View style={[AppStyles.inputWrap]}>
                            <PickerComponent selectedItem={''} data={''} value={''} placeholder='Baths' />
                        </View>
                    </View>

                </View>


                <View style={AppStyles.latLngMain}>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.latLngInputWrap, AppStyles.noMargin, AppStyles.borderrightLat]}>
                        <View style={[AppStyles.inputWrap]}>
                            <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft]} placeholder={'Latitude'} />
                        </View>
                    </View>

                    {/* **************************************** */}
                    <View style={[AppStyles.mainInputWrap, AppStyles.latLngInputWrap, AppStyles.noMargin]}>
                        <View style={[AppStyles.inputWrap]}>
                            <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft]} placeholder={'Longitude'} />
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
                        <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft]} placeholder={'Owner Name'} />
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft]} placeholder={'Owner Number'} />
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft]} placeholder={'Owner Address'} />
                    </View>
                </View>

                {/* **************************************** */}
                <View style={[AppStyles.mainInputWrap]}>
                    <Button
                        style={[AppStyles.formBtn, styles.addInvenBtn]}>
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

