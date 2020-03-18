import React, { Component } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { Button, Icon, StyleProvider, Toast } from 'native-base';
import { AntDesign, Entypo, Ionicons, EvilIcons } from '@expo/vector-icons';
import getTheme from '../../../native-base-theme/components';
import formTheme from '../../../native-base-theme/variables/formTheme';
import axios from 'axios';
import PickerComponent from '../../components/Picker/index';
import PricePicker from '../../components/PricePicker/index';
import InputField from '../../components/TextInput/index';
import RadioComponent from '../../components/RadioButton/index';
import _ from 'underscore';
import { formatPrice } from '../../components/PriceFormate';
import styles from './style';
import { connect } from 'react-redux';
// import * as ImagePicker from 'expo-image-picker';
// import * as Permissions from 'expo-permissions';
// import * as Location from 'expo-location';
import Constants from 'expo-constants';
import helper from '../../helper';
// import Validator from '../../validation';
// import { threshold } from 'react-native-color-matrix-image-filters';

class DetailForm extends Component {
    constructor(props) {
        super(props)
   
    }

    componentDidMount() {

    }


    render() {
        var currentLocation = ''

        return (
            <View style={{ margin: 10 }}>
                <PickerComponent selectedItem={''} data={''} value={''} placeholder='Property Type' />
                <PickerComponent selectedItem={''} data={''} value={''} placeholder='Property Sub Type' />
                <PickerComponent selectedItem={''} data={''} value={''} placeholder='Select City' />
                <PickerComponent selectedItem={''} data={''} value={''} placeholder='Select Area' />
                <View style={styles.viewWrap}>
                    <PickerComponent selectedItem={''} itemStyle={styles.itemWrap} data={''} value={''} placeholder='Size Unit' />
                    <View style={{ width: 15 }}></View>
                    <InputField  style={{ flex: 1 }} placeholder='Size' keyboardType='numeric' />
                </View>
                <PricePicker  placeholder='Demand Price' />
                <View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Button
                            style={{ flex: 1, marginVertical: 10, backgroundColor: '#ffffff', height: 60, justifyContent: 'center', borderRadius: 5 }} bordered dark>
                            <Icon name={currentLocation === null ? 'ios-locate' : 'ios-checkmark-circle-outline'} style={{ color: '#484848' }} />
                        </Button>
                        <Button
                            style={{ flex: 2, marginLeft: 10, marginVertical: 10, backgroundColor: '#ffffff', height: 60, justifyContent: 'center', borderRadius: 5 }} bordered dark>
                            <Text style={{ color: '#484848' }}>UPLOAD IMAGES</Text>
                        </Button>
                    </View>

                </View>
                <View styles={styles.outerImageView}>
                    {/* <View style={styles.innerImageView} >
                                {
                                    this.state.images.map((item, index) => {
                                        return (
                                            <ImageBackground
                                                style={styles.backGroundImg}
                                                source={{ uri: item }} key={index}
                                                borderRadius={5}>
                                                <AntDesign style={styles.close} name="closecircle" size={25} onPress={(e) => { this.deleteImage(item, index) }} />
                                            </ImageBackground>
                                        )
                                    })
                                }
                            </View> */}
                </View>
                <View style={{ ...styles.viewWrap, marginBottom: 10, marginTop: 20 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <RadioComponent
                            selectedButton={''}
                            selected={false}
                            value='Grade A' />
                        <Text style={{ paddingLeft: 10 }}>Grade A</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <RadioComponent
                            selectedButton={''}
                            selected={false}
                            value='Grade B' />
                        <Text style={{ paddingLeft: 10 }}>Grade B</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <RadioComponent
                            selectedButton={''}
                            selected={false}
                            value='Grade C' />
                        <Text style={{ paddingLeft: 10 }}>Grade C</Text>
                    </View>
                </View>
                <View style={styles.inputWrap}>
                    <InputField  placeholder='Beds' keyboardType='numeric'  />
                    <View style={{ width: 15 }}></View>
                    <InputField  placeholder='Baths' keyboardType='numeric'/>
                </View>
                <View style={styles.inputWrap}>
                    <InputField   placeholder='Lattitude' keyboardType='numeric' />
                    <View style={{ width: 15 }}></View>
                    <InputField   placeholder='Longitude' keyboardType='numeric'/>
                </View>
                <View style={{}}>
                    <InputField  placeholder='OwnerName' textContentType='name'/>
                    <InputField  placeholder='OwnerNumber' keyboardType='numeric'/>
                    <InputField  placeholder='OwnerAddress' textContentType='addressState' />
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Button 
                        style={{ backgroundColor: '#ffffff', height: 60, justifyContent: 'center', borderRadius: 5 }} bordered dark>
                        <Text style={{ color: '#484848' }}>Add</Text>
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

