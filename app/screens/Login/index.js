import { Image, Keyboard, KeyboardAvoidingView, SafeAreaView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { Input, Item, Label } from 'native-base';
import React, { Component } from 'react';

import AppJson from '../../../app.json';
import AppStyles from '../../AppStyles';
import ErrorMessage from '../../components/ErrorMessage'
import TouchableButton from '../../components/TouchableButton/index';
import { connect } from 'react-redux';
import { setuser } from '../../actions/user';
import styles from './style';

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
                if(!response.data) {
                    this.setState({showError: true})
                }
            })
            .catch((error) => {
                // console.log('caughtError', error)
            })
        }
    }

    handleForm = (value, name) => {
        const { formData, showError } = this.state
        if(showError) {
            this.setState({showError: false})
        }
        formData[name] = value
        this.setState({ formData, checkLogin: false })
    }

    onFocus = () => {
        this.setState({ checkLogin: true, showError: false })
    }

    render() {
        const { checkValidation, formData, checkLogin,showError } = this.state

        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
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
                            showError && <ErrorMessage errorMessage={'Invlaid Email or Password'} />
                        }
                        <View style={{ marginTop: 25 ,marginBottom:25}}>
                            <TouchableButton
                                style={{}}
                                label='Sign In'
                                onPress={this.submitForm}
                                loading={this.props.loading}
                                color='white'
                            />
                        </View>
                        <View style={{ alignSelf: 'center', alignItems: 'center' }}>
                            <Text style={AppStyles.blackInputText}>v{AppJson.expo.version}</Text>
                        </View>
                    </View>

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

    componentDidUpdate(prevProps, prevState) {
        // console.log('prevProps <<<<<>>>>>>>>>>>> ', prevProps)
        // console.log('prevState <<<<<>>>>>>>>>>>> ', prevState)
        //    if(prevState.id!==this.state.id){
        //     this.props.navigation.navigate('drawer')
        //    }
    }
}

mapStateToProps = (store) => {
    return {
        loading: store.user.loading,
        store: store,
        storeData: store,
        error: store.user.error
    }
}

export default connect(mapStateToProps)(Login)

