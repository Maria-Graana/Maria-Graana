import React, { Component } from 'react';
import { View, Text, ImageBackground, TextInput } from 'react-native';
import { Button, Icon, StyleProvider, Toast } from 'native-base';
import PickerComponent from '../../components/Picker/index';
import styles from './style';
import AppStyles from '../../AppStyles';
import { connect } from 'react-redux';

class DetailForm extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() { }

    render() {

        return (
            <View>
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft]} placeholder={'Wow'} />
                    </View>
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft]} placeholder={'Wow'} />
                    </View>
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft]} placeholder={'Wow'} />
                    </View>
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft]} placeholder={'Wow'} />
                    </View>
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent selectedItem={''} data={''} value={''} placeholder='Property Type' />
                    </View>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Button
                        style={[AppStyles.formBtn]}>
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

