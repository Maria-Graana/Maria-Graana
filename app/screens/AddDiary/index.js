import React, { Component } from 'react';
import { View, Text, ScrollView, Platform, TouchableWithoutFeedback, SafeAreaView, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import axios from 'axios';
import { connect } from 'react-redux';
import DetailForm from './detailForm';
import helper from '../../helper';
import AppStyles from '../../AppStyles'

class AddDiary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkValidation: false,
        }
    }

    formSubmit = (data) => {
        if (!data.subject || !data.taskSelected || !data.date || !data.startTime || !data.endTime) {
            this.setState({
                checkValidation: true
            })
        } else {
            this.addDiary(data)
        }
    }

    generatePayload = (data) => {
        let start = moment(data.date + data.startTime, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:ss')
        let end = moment(data.date + data.endTime, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:ss')
        let payload = {
            subject: data.subject,
            date: start,
            notes: data.description,
            taskType: data.taskSelected,
            time: data.startTime,
            status: data.status,
            userId: this.props.user.id,
            diaryTime: start,
            start: start,
            end: end
        }
        return payload
    }

    addDiary = (data) => {
        let diary = this.generatePayload(data)
        axios.post(`/api/diary/create`, diary)
            .then((res) => {
                console.log('response=>', res);
                helper.successToast('DIARY ADDED SUCCESSFULLY!')
                this.props.navigation.navigate('Diary', { 'agent': false, 'agentId': this.state.agentId })
            })
            .catch((error) => {
                helper.errorToast('ERROR: ADDING DIARY')
                console.log(error)
            })
    }

    render() {
        const { checkValidation } = this.state;
        return (
            <KeyboardAwareScrollView style={[AppStyles.container]} keyboardShouldPersistTaps="always" enableOnAndroid>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} onLongPress={Keyboard.dismiss}>
                    <SafeAreaView style={AppStyles.mb1} >
                        <DetailForm formSubmit={this.formSubmit} checkValidation={checkValidation} />
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


