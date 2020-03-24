import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { StyleProvider } from 'native-base';
import DetailForm from './detailForm';
import AppStyles from '../../AppStyles';
import getTheme from '../../../native-base-theme/components';
import formTheme from '../../../native-base-theme/variables/formTheme';
import axios from 'axios'
import config from '../../config'

class AddLead extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkValidation: false,
            cities: [],
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
    componentDidMount() {
        axios.get(`/api/cities`)
            .then((res) => {
                this.setState({
                    cities: res.data
                })
            })
    }

    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData })
        console.log(formData)
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
        const { formData, cities } = this.state
        let citiesArray = [];
         cities.map((item, index) => {return(citiesArray.push({id:item.id, name: item.name}))})
        return (
            <View style={[AppStyles.container]}>
                <StyleProvider style={getTheme(formTheme)}>
                    <KeyboardAvoidingView behavior="padding" enabled>
                        <ScrollView>
                            <View>
                                <DetailForm
                                    formSubmit={this.formSubmit}
                                    checkValidation={this.state.checkValidation}
                                    handleForm={this.handleForm}
                                    formData={formData}
                                    cities={citiesArray}
                                />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </StyleProvider>
            </View>
        )
    }
}

export default AddLead;


