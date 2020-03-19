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
        this.state = {
            checkValidation: false,
        }
    }

    formSubmit = (data) => {
        if (!data.client || !data.city || !data.project || !data.productType || !data.minInvestment || !data.maxInvestment) {
            this.setState({
                checkValidation: true
            })
        } else {
            console.log(data)
        }
    }

    render() {
        return (
            <View style={[AppStyles.container]}>
                <StyleProvider style={getTheme(formTheme)}>
                    <KeyboardAvoidingView behavior="padding" enabled>
                        <ScrollView>
                            <View>
                                <DetailForm formSubmit={this.formSubmit} checkValidation={this.state.checkValidation}/>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </StyleProvider>
            </View>
        )
    }
}

export default AddLead;


