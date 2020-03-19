import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { StyleProvider } from 'native-base';
import DetailForm from './detailForm';
import AppStyles from '../../AppStyles';

class AddLead extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={[AppStyles.container]}>
                <StyleProvider>
                    <KeyboardAvoidingView>
                        <ScrollView>
                            <DetailForm />
                        </ScrollView>
                    </KeyboardAvoidingView>
                </StyleProvider>
            </View>
        )
    }
}

export default AddLead;


