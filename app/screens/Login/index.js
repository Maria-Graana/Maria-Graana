import { Image, Keyboard, KeyboardAvoidingView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Item, Label } from 'native-base';
import React, { Component } from 'react';
import AppJson from '../../../app.json';
import AppStyles from '../../AppStyles';
import ErrorMessage from '../../components/ErrorMessage'
import TouchableButton from '../../components/TouchableButton/index';
import { connect } from 'react-redux';
import { setuser } from '../../actions/user';
import styles from './style';
import config from '../../config';
import helper from '../../helper';

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            checkValidation: false,
            checkLogin: false,
            showError: false,
            formData: {
                email: '',
                password: ''
            }
        }
    }

    validateEmail = (email) => {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    submitForm = () => {
        const { formData } = this.state
        const { isInternetConnected } = this.props;
        if (!isInternetConnected) {
            this.showToast();
        }
        else {
            if (!formData.email || !formData.password) {
                this.setState({
                    checkValidation: true
                })
            } else {
                let creds = {
                    email: formData.email.toLocaleLowerCase(),
                    password: formData.password,
                }
                this.props.dispatch(setuser(creds))
                    .then((response) => {
                        if (!response.data) {
                            this.setState({ showError: true })
                        }
                    })
                    .catch((error) => {
                        // console.log('caughtError', error)
                    })
            }
        }
    }

    handleForm = (value, name) => {
        const { formData, showError } = this.state
        if (showError) {
            this.setState({ showError: false })
        }
        formData[name] = value
        this.setState({ formData, checkLogin: false })
    }

    onFocus = () => {
        this.setState({ checkLogin: true, showError: false })
    }

    showToast = () => { helper.internetToast('No Internet Connection!') }

    render() {
        const { checkValidation, formData, checkLogin, showError, isInternetConnected } = this.state
        let label = config.channel === 'development' ? 'Dev ' : ''
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? 'padding' : undefined}>
                        <Image
                            style={styles.logo}
                            source={require('../../../assets/img/login.png')}
                        />
                        <View style={{ flex: 0.6, marginHorizontal: 15, marginTop: 25 }}>
                            <Item floatingLabel>
                                <Label
                                    style={{ color: AppStyles.colors.subTextColor, fontFamily: AppStyles.fonts.defaultFont, fontSize: 12 }}
                                >USERNAME</Label>
                                <Input
                                    onFocus={() => { this.onFocus() }}
                                    keyboardType='email-address'
                                    textContentType='emailAddress'
                                    autoCompleteType='email'
                                    onChangeText={(text) => { this.handleForm(text, 'email') }} />
                            </Item>
                            {
                                (checkValidation === true && formData.email === '') ? <ErrorMessage errorMessage={'Required'} />
                                    : <ErrorMessage errorMessage={''} />
                            }
                            <View style={{ marginTop: 10 }}>
                                <Item floatingLabel>
                                    <Label
                                        style={{ color: AppStyles.colors.subTextColor, fontFamily: AppStyles.fonts.defaultFont, fontSize: 12 }}>
                                        PASSWORD</Label>
                                    <Input
                                        onFocus={() => { this.onFocus() }}
                                        secureTextEntry={true} onChangeText={(text) => { this.handleForm(text, 'password') }} />
                                </Item>
                            </View>
                            {
                                (checkValidation === true && formData.password === '') ? <ErrorMessage errorMessage={'Required'} />
                                    : <ErrorMessage errorMessage={''} />
                            }
                            {
                                showError && <ErrorMessage errorMessage={'Invalid Username or Password'} />
                            }
                            <View style={{ marginTop: 25, marginBottom: 25 }}>
                                <TouchableButton
                                    containerStyle={styles.buttonContainer}
                                    label='Sign In'
                                    fontFamily={AppStyles.fonts.defaultFont}
                                    onPress={this.submitForm}
                                    loading={this.props.loading}
                                    color='white'
                                />
                            </View>
                            <View style={{ alignSelf: 'center', alignItems: 'center' }}>
                                <Text style={AppStyles.blackInputText}>{label}v{AppJson.expo.version}</Text>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </TouchableWithoutFeedback>


        );
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return { id: nextProps.id, checkLogin: false, loading: nextProps.loading };
        } else if (nextProps.error !== prevState.error) {
            return { error: nextProps.error, checkLogin: true, loading: nextProps.loading };
        }
        else return null;
    }

}

mapStateToProps = (store) => {
    return {
        loading: store.user.loading,
        store: store,
        storeData: store,
        error: store.user.error,
        isInternetConnected: store.user.isInternetConnected,
    }
}

export default connect(mapStateToProps)(Login)

