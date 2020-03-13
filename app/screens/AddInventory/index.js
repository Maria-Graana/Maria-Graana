import React, {Component}  from 'react';
import {View, Text, StyleSheet, KeyboardAvoidingView, ScrollView}  from 'react-native';
import { Container, Header, Content, Input, Item, Picker, Form, Button, StyleProvider } from 'native-base';
import { AntDesign,Entypo,Ionicons,EvilIcons } from '@expo/vector-icons';
import getTheme from '../../../native-base-theme/components';
import formTheme from '../../../native-base-theme/variables/formTheme';
import axios from 'axios';
// import devConstants, {apiUrl} from '../../constants';
import PickerComponent from '../../components/Picker/index';
import DetailForm from './detailForm';
import styles from './style';

class AddInventory extends Component {
    constructor(props) {
        super(props)
     
    }

    render() {
        

        return (
            <StyleProvider style={getTheme(formTheme)}>
                <KeyboardAvoidingView style={styles.container} behavior="padding"  enabled>
                    <ScrollView>
                        <View style= {styles.viewMargin}>
                            <Text style= {styles.TextProp}> Enter Client and Property Information </Text>
                        </View>
                        <DetailForm />
                    </ScrollView>
                </KeyboardAvoidingView>
            </StyleProvider>
        )
    }
}

export default AddInventory;


