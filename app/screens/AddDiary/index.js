import React, { Component } from 'react';
import { View, Text, ScrollView, Platform, TouchableWithoutFeedback, SafeAreaView, Keyboard, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import axios from 'axios';
import { connect } from 'react-redux';
import styles from './style'
import DetailForm from './detailForm';
import AppStyles from '../../AppStyles'
import StaticData from '../../StaticData'

const _format = 'YYYY-MM-DD';
const _today = moment(new Date().dateString).format(_format);

class AddDiary extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <KeyboardAwareScrollView style={[AppStyles.container]} keyboardShouldPersistTaps="always" enableOnAndroid>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} onLongPress={Keyboard.dismiss}>
                    <SafeAreaView style={AppStyles.mb1} >
                        <DetailForm />
                    </SafeAreaView>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(AddDiary)


