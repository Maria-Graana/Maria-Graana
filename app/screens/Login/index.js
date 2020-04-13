import React, { Component } from 'react';
import { Text, View, KeyboardAvoidingView, Image, SafeAreaView } from 'react-native';
import styles from './style';
import { LinearGradient } from 'expo-linear-gradient';
import TouchableButton from '../../components/TouchableButton/index';
import { connect } from 'react-redux';
import { setuser } from '../../actions/user';
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';
import AppStyles from '../../AppStyles';
import AppJson from '../../../app.json';

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            id: null,
            error: "",
            emailEmpty: false,
            passwordEmpty: false,
            checkLogin: false,
            password: '',
            email: ''
        }
    }

    onEmailChangeText = (email) => {
        if (email == '') {
            this.setState({ emailEmpty: true })
        }
        else if (!this.validateEmail(email)) {
            this.setState({ checkLogin: true })
        }
        else {
            this.setState({ checkLogin: false })
            this.setState({ emailEmpty: false })
            this.state.email = email
        }
    }



    validateEmail = (email) => {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    onPasswordChangeText = (password) => {
        if (password == '') {
            this.setState({ passwordEmpty: true })
        } else {
            this.setState({ passwordEmpty: false })
            this.state.password = password
        }
    }

    submitForm = () => {
        const { email, password } = this.state
        let creds = {
            email: email.toLocaleLowerCase(),
            password: password,
        }
        this.props.dispatch(setuser(creds))
    }

    render() {
        // const isRequired = value => value ? undefined : 'This Field is Required'

        let emailText = <View style={{ justifyContent: "center" }}></View>
        let passwordText = <View style={{ justifyContent: "center" }}></View>
        let checkLoginText = <View style={{ justifyContent: "center" }}></View>

        if (this.state.emailEmpty)
            emailText = <Text style={styles.requiredTextColor}>This Field is Required</Text>
        // 
        if (this.state.passwordEmpty)
            passwordText = <Text style={styles.requiredTextColor}>This Field is Required</Text>

        if (this.state.checkLogin)
            checkLoginText = <Text style={styles.checkLogin}> Incorrect Info Please Check! </Text>

        return (
            // <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20 }}>
            //     <View style={{ justifyContent: "center", height: 400 }}>
            //         <Image
            //             style={styles.logo}
            //             source={require('../../../assets/img/login.png')}
            //         />
            //     </View>
            //     <KeyboardAvoidingView style={{ flex: 1,}}>
            //         <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 20, marginVertical: 5 }}>
            //             <View>
            //                 <Item floatingLabel>
            //                     <Label>Username</Label>
            //                     <Input />
            //                 </Item>
            //             </View>
            //             <View style={{ marginVertical: 15 }}>
            //                 <Item floatingLabel>
            //                     <Label>Password</Label>
            //                     <Input />
            //                 </Item>
            //             </View>
            //         </View>
            //         <View style={{ flex: 1, marginVertical: 25 }}>
            //             <TouchableButton
            //                 style={{ }}
            //                 label='Sign In'
            //                 onPress={this.submitForm} loading={this.props.loading}
            //             />
            //         </View>
            //     </KeyboardAvoidingView>
            // </SafeAreaView>
            <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20 }}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Image
                            style={styles.logo}
                            source={require('../../../assets/img/login.png')}
                        />
                    </View>
                    {/* {checkLoginText} */}
                    <View style={{ flex: 1, marginBottom: 10 }}>
                        <View style={{ paddingLeft: 2 }}>
                            <Text style={{ color: AppStyles.colors.subTextColor, fontSize: 12 }}>
                                USERNAME
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: "center", marginBottom: 15 }}>
                            <Item>
                                <Input
                                    // placeholder='USERNAME'
                                    keyboardType='email-address'
                                    textContentType='emailAddress'
                                    autoCompleteType='email'
                                    style={{ color: 'black', fontSize: 14, minHeight: 40 }}
                                    placeholderTextColor={AppStyles.colors.subTextColor}
                                    onChangeText={this.onEmailChangeText}
                                />
                            </Item>
                        </View>
                        {emailText}
                        <View style={{ marginTop: 5, paddingLeft: 2 }}>
                            <Text style={{ color: AppStyles.colors.subTextColor, fontSize: 12 }}>
                                PASSWORD
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 15 }}>
                            <Item>
                                <Input
                                    secureTextEntry={true}
                                    // placeholder='Password'
                                    style={{ color: 'black', borderBottomEndRadius: 50, fontSize: 14, }}
                                    placeholderTextColor={AppStyles.colors.subTextColor}
                                    onChangeText={this.onPasswordChangeText}
                                />
                            </Item>
                        </View>
                        {passwordText}
                        <View style={{ flex: 1, marginVertical: 10 }}>
                            <TouchableButton
                                style={{ marginTop: 30 }}
                                label='Sign In'
                                onPress={this.submitForm} loading={this.props.loading}
                            />
                        </View>
                        <View style={{alignSelf:'center',alignItems:'center',marginBottom:25 }}>
                            <Text style={AppStyles.blackInputText}>v{AppJson.expo.version}</Text>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
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

