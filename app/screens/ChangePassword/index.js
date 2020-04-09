import React, { Component } from 'react'
import { Text, View, TextInput, Alert } from 'react-native'
import { connect } from 'react-redux';
import { Button } from 'native-base'
import AppStyles from '../../AppStyles';
import axios from 'axios'
import ErrorMessage from '../../components/ErrorMessage'
import helper from '../../helper'

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkValidation: false,
            formData: {
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            }
        }
    }

    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData });
    }

    formSubmit = () => {
        const { formData } = this.state;
        const { oldPassword, newPassword, confirmNewPassword } = formData;
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            this.setState({
                checkValidation: true
            })
        } else {
            this.changePassword(formData)
        }

    }

    changePassword = (data) => {
        if (data.newPassword !== data.confirmNewPassword) {
            alert('Please make sure new password and confirm password are same!')
            return;
        }

        const body = {
            password: data.newPassword,
            oldPassword: data.oldPassword
        }
        
        axios.patch(`/api/user/resetpassword`, body).then(response => {
            if (response.status === 400) {
                helper.errorToast(response.data)
            }
            else {
                helper.successToast('Password Changed Successfully!')
                this.setState({ formData: { oldPassword: '', newPassword: '', confirmNewPassword: '' } })
            }

        }).catch(error => {
            helper.errorToast(error.response.data)
        })
    }


    render() {
        const { checkValidation, formData } = this.state;
        const { oldPassword, newPassword, confirmNewPassword } = formData;

        return (
            <View style={AppStyles.container}>
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.formFontSettings]} value={oldPassword} secureTextEntry={true} placeholder={'Current Password'} onChangeText={(text) => this.handleForm(text, 'oldPassword')} />
                    </View>
                    {
                        checkValidation === true && oldPassword === '' && <ErrorMessage errorMessage={'Required'} />
                    }
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.formFontSettings]} value={newPassword} secureTextEntry={true} placeholder={'New Password'} onChangeText={(text) => this.handleForm(text, 'newPassword')} />
                    </View>
                    {
                        checkValidation === true && newPassword === '' && <ErrorMessage errorMessage={'Required'} />
                    }
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.formFontSettings]} value={confirmNewPassword} secureTextEntry={true} placeholder={'Confirm new password'} onChangeText={(text) => this.handleForm(text, 'confirmNewPassword')} />
                    </View>
                    {
                        checkValidation === true && confirmNewPassword === '' && <ErrorMessage errorMessage={'Required'} />
                    }
                </View>

                <View style={{ marginVertical: 10 }}>
                    <Button onPress={() => { this.formSubmit() }}
                        style={[AppStyles.formBtn]}>
                        <Text style={AppStyles.btnText}>CHANGE PASSWORD</Text>
                    </Button>
                </View>

            </View >

        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(ChangePassword)

