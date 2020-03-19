import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { StyleProvider } from 'native-base';
import getTheme from '../../../native-base-theme/components';
import formTheme from '../../../native-base-theme/variables/formTheme';
import DetailForm from './detailForm';
import AppStyles from '../../AppStyles';

class AddInventory extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <StyleProvider style={getTheme(formTheme)}>
                <KeyboardAvoidingView behavior="padding" enabled>
                    <ScrollView>
                        <View style={AppStyles.container}>
                            <DetailForm />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </StyleProvider>
        )
    }
}

export default AddInventory;


