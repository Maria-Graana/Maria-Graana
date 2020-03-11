import React, {Component} from 'react';
import { Text, View, Form, AsyncStorage, ScrollView, KeyboardAvoidingView, Button, Alert, TextInput , Image} from 'react-native';
import styles from './style';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TouchableButton  from '../../components/TouchableButton/index';
import {connect} from 'react-redux';
import { setuser } from '../../actions/user';
import store from '../../store';
import { Item, Input, Icon } from 'native-base';
import * as RootNavigation from '../..//navigation/RootNavigation.js';

class Login extends Component {

    constructor (props) {
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
            this.setState({emailEmpty : true})
        }
        else if (!this.validateEmail(email)) {
            this.setState({checkLogin : true})
        }
        else{
            this.setState({checkLogin : false})
            this.setState({emailEmpty : false})
            this.state.email = email
        }
    }



    validateEmail = (email) => {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    onPasswordChangeText = (password) => {
        if (password == '') {
            this.setState({passwordEmpty : true})
        }else{
            this.setState({passwordEmpty : false})
            this.state.password = password
        }
    }

    submitForm= () => {
        creds= {
            email: 'sharjeel@agency21.com.pk',
            password: '1234'
        }
        let res= this.props.dispatch(setuser(creds))
        if (res) {
            this.props.navigation.navigate('Landing');
        } else {
            console.log('Error signing in user')
        }
    }
    
    render() {
        // const isRequired = value => value ? undefined : 'This Field is Required'
        
        let emailText = <View style= {{justifyContent:"center"}}></View>
        let passwordText = <View style= {{justifyContent:"center"}}></View>
        let checkLoginText = <View style= {{justifyContent:"center"}}></View>

        if(this.state.emailEmpty)
            emailText = <Text style= {styles.requiredTextColor}>This Field is Required</Text>
        // 
        if(this.state.passwordEmpty)
            passwordText = <Text style= {styles.requiredTextColor}>This Field is Required</Text>

        if (this.state.checkLogin)
            checkLoginText = <Text style= {styles.checkLogin}> Incorrect Info Please Check! </Text>
        
        return (
            <LinearGradient style={{ flex: 1}} colors={['#2f2f2f','#444']}>
                <KeyboardAvoidingView style={{ flex: 1}} behavior="padding"  enabled>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <Image
                            style= {styles.logo}
                            source={require('../../../assets/images/loginCheck.png')}
                        />
                    </View>
                    {checkLoginText}
                    <View style={{ flex: 1}}>
                        <View style={{flexDirection: "row", justifyContent: 'center', alignItems: "center",marginVertical : 20, marginHorizontal : 35}}>
                                <Image
                                    style={styles.profileImage}
                                    source={require('../../../assets/images/profile.png')}
                                />
                                <Item>
                                    <Input 
                                        placeholder='Email'
                                        keyboardType= 'email-address'
                                        textContentType= 'emailAddress'
                                        autoCompleteType= 'email'
                                        style={{ color: 'white' }}
                                        placeholderTextColor= 'white'
                                        onChangeText = {this.onEmailChangeText}
                                    />
                                </Item>
                        </View>
                        {emailText}
                        <View style= {{flexDirection: "row", justifyContent: "center", alignItems: "center",marginVertical : 20, marginHorizontal : 35}}>
                            <Image
                                style={styles.lockImage}
                                source={require('../../../assets/images/lock.png')}
                            />
                            <Item>
                                <Input 
                                secureTextEntry={true}
                                placeholder='Password'
                                style={{ color: 'white', borderBottomEndRadius: 50 }}
                                placeholderTextColor= 'white'
                                onChangeText={this.onPasswordChangeText}
                                />
                                <Image
                                    style={styles.infoImage}
                                    source={require('../../../assets/images/info.png')}
                                />                            
                            </Item>
                        </View>
                        {passwordText}
                        <View style= {{flex: 1}}>
                            <TouchableButton style={{marginTop : 30}} label= 'Login' onPress={this.submitForm} loading= {this.props.loading}/>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </LinearGradient>
        );
    }
    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.id!==prevState.id){
            return { id: nextProps.id, checkLogin: false, loading: nextProps.loading};
        } else if (nextProps.error!==prevState.error) {
            return { error: nextProps.error, checkLogin: true, loading: nextProps.loading};
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

mapStateToProps = (store) =>{
    return {
        loading: store.user.loading,
        store: store,
        storeData: store,
        error: store.user.error
    }
}

export default connect(mapStateToProps)(Login)

