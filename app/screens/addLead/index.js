import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { StyleProvider } from 'native-base';
import DetailForm from './detailForm';
import AppStyles from '../../AppStyles';
import getTheme from '../../../native-base-theme/components';
import formTheme from '../../../native-base-theme/variables/formTheme';
import axios from 'axios'
import { connect } from 'react-redux';
import config from '../../config'

class AddLead extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkValidation: false,
            cities: [],
            getClients: [],
            formData: {
                client: '',
                city: '',
                project: '',
                productType: '',
                minInvestment: '',
                maxInvestment: '',
            },
        }
    }
    componentDidMount() {
        const { user } = this.props
        this.getCities();
        this.getClients(user.id);
    }

    getClients = (id) => {
        axios.get(`/api/customer/find?userId=${id}`)
            .then((res) => {
                this.setState({
                    getClients: res.data.rows
                })
            })
    }


    getCities = () => {
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
        const { formData, cities, getClients } = this.state
        let citiesArray = [];
        let clientsArray = [];
        cities && cities.map((item, index) => { return (citiesArray.push({ id: item.id, name: item.name })) })
        getClients && getClients.map((item, index) => { return (clientsArray.push({ id: item.id, name: item.firstName })) })
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
                                    getClients={clientsArray}
                                />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </StyleProvider>
            </View>
        )
    }
}


mapStateToProps = (store) => {
    return {
      user: store.user.user,
    }
  }
  
  export default connect(mapStateToProps)(AddLead)


