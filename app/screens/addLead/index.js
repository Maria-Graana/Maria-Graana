import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { StyleProvider } from 'native-base';
import DetailForm from './detailForm';
import AppStyles from '../../AppStyles';
import getTheme from '../../../native-base-theme/components';
import formTheme from '../../../native-base-theme/variables/formTheme';

class AddLead extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={[AppStyles.container]}>
                <StyleProvider style={getTheme(formTheme)}>
                <KeyboardAvoidingView behavior="padding" enabled>
                    <ScrollView>
                        <View>
                            <DetailForm />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </StyleProvider>
            </View>
        )
    }
}

export default AddLead;


