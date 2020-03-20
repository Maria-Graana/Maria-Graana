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
        this.state = {
            checkValidation: false,
            formData: {
                propertyType: '',
                subType: '',
                city: '',
                area: '',
                sizeUnit: '',
                size: '',
                price: '',
                grade: '',
                beds: '',
                baths: '',
                lat: '',
                lng: '',
                ownerName: '',
                ownerNumber: '',
                ownerAddress: '',
            }
        }
        this.dummyData = ["", "Object 1", "Object 2", "Object 3", "Object 4", "Object 5", "Object 6"]
    }

    // ********* Form Handle Function
    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData })
        console.log(formData)
    }

    // ********* On form Submit Function
    formSubmit = () => {
        const { formData } = this.state

        // ********* Form Validation Check
        if (!formData.propertyType ||
            !formData.subType ||
            !formData.city ||
            !formData.area ||
            !formData.sizeUnit ||
            !formData.size ||
            !formData.price ||
            !formData.beds ||
            !formData.baths ||
            !formData.ownerName ||
            !formData.ownerNumber) {
            this.setState({
                checkValidation: true
            })
        } else {

            // ********* Call Add Inventory API here :)
            console.log(formData)
        }
    }

    render() {
        const { formData } = this.state
        return (
            <StyleProvider style={getTheme(formTheme)}>
                <KeyboardAvoidingView behavior="padding" enabled>
                    <ScrollView>
                        {/* ********* Form Component */}
                        <View style={AppStyles.container}>
                            <DetailForm formSubmit={this.formSubmit} checkValidation={this.state.checkValidation} handleForm={this.handleForm} dummyData={this.dummyData} formData={formData} />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </StyleProvider>
        )
    }
}

export default AddInventory;


