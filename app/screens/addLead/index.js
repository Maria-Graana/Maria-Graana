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
            formData: {
                client: '',
                city: '',
                project: '',
                productType: '',
                minInvestment: '',
                maxInvestment: '',
            }
        }
    }

    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData })
    }

    formSubmit = () => {
        const { formData } = this.state
        if (!formData.client || !formData.city || !formData.project || !formData.productType || !formData.minInvestment || !formData.maxInvestment) {
            this.setState({
                checkValidation: true
            })
        } else {
            console.log(formData)
        }
    }

    render() {
        const { formData } = this.state
        return (
            <View style={[AppStyles.container]}>
                <StyleProvider style={getTheme(formTheme)}>
                    <KeyboardAvoidingView behavior="padding" enabled>
                        <ScrollView>
                            <View>
                                <DetailForm formSubmit={this.formSubmit} checkValidation={this.state.checkValidation} handleForm={this.handleForm} formData={formData}/>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </StyleProvider>
            </View>
        )
    }
}

export default AddLead;


