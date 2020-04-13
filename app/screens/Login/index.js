import React, { Component } from 'react';
import { Text, View, KeyboardAvoidingView, Image, SafeAreaView } from 'react-native';
import styles from './style';
import TouchableButton from '../../components/TouchableButton/index';
import { connect } from 'react-redux';
import { setuser } from '../../actions/user';
import { Item, Input, Label } from 'native-base';
import AppStyles from '../../AppStyles';
import AppJson from '../../../app.json';
import ErrorMessage from '../../components/ErrorMessage'

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            checkValidation: false,
            checkLogin: false,
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
        console.log(formData)
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
        }
    }

    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData })
    }

    onFocus = () => {
        console.log('i am here')
        this.setState({ checkLogin: true })
    }

    render() {
        const { checkValidation, formData, checkLogin } = this.state
        console.log('checkLogin: ', checkLogin)

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <KeyboardAvoidingView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <Image
                            style={styles.logo}
                            source={require('../../../assets/img/login.png')}
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 15 }}>
                        {
                            !checkLogin && <Text style={styles.checkLogin}> Incorrect Info Please Check! </Text>
                        }
                        <View>
                            <Item floatingLabel>
                                <Label
                                    style={{ color: AppStyles.colors.subTextColor, fontFamily: AppStyles.fonts.defaultFont, fontSize: 12 }}
                                >USERNAME</Label>
                                <Input
                                    focus={this.onFocus}
                                    keyboardType='email-address'
                                    textContentType='emailAddress'
                                    autoCompleteType='email'
                                    onChangeText={(text) => { this.handleForm(text, 'email') }} />
                            </Item>
                        </View>
                        {
                            (checkValidation === true && formData.email === '') ? <ErrorMessage errorMessage={'Required'}/> 
                            : <ErrorMessage errorMessage={''}/>
                        }
                        <View style={{ marginTop: 0 }}>
                            <Item floatingLabel>
                                <Label
                                    style={{ color: AppStyles.colors.subTextColor, fontFamily: AppStyles.fonts.defaultFont, fontSize: 12 }}>
                                    PASSWORD</Label>
                                <Input
                                    focus={this.onFocus}
                                    secureTextEntry={true} onChangeText={(text) => { this.handleForm(text, 'password') }} />
                            </Item>
                        </View>
                        {
                            (checkValidation === true && formData.password === '') ? <ErrorMessage errorMessage={'Required'}/> 
                            : <ErrorMessage errorMessage={''}/>
                        }
                        <View style={{ marginTop: 10 }}>
                            <TouchableButton
                                style={{}}
                                label='Sign In'
                                onPress={this.submitForm} 
                                loading={this.props.loading}
                                color= 'white'
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
                <View style={{ alignSelf: 'center', alignItems: 'center', position: 'absolute', bottom: 0, center: 0 }}>
                    <Text style={AppStyles.blackInputText}>v{AppJson.expo.version}</Text>
                </View>
            </SafeAreaView>
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

