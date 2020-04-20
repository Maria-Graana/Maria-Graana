import React, { Component } from 'react';
import { View, Text, ScrollView, Platform, TouchableWithoutFeedback, SafeAreaView, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment-timezone';
import axios from 'axios';
import { connect } from 'react-redux';
import DetailForm from './detailForm';
import helper from '../../helper';
import AppStyles from '../../AppStyles'
import TimerNotification from '../../LocalNotifications';

class AddDiary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkValidation: false,
        }
    }

    componentDidMount() {
        const { route, navigation } = this.props;
        if (route.params.update) {
            navigation.setOptions({ title: 'EDIT TASK' })
        }
    }

    formSubmit = (data) => {
        if (!data.subject || !data.taskType || !data.date || !data.startTime || !data.endTime) {
            this.setState({
                checkValidation: true
            })
        } else {
            this.createDiary(data)
        }
    }



    generatePayload = (data) => {
        const { route } = this.props;
        const { rcmLeadId, cmLeadId } = route.params;
        let payload = null;
        let start = moment(data.date + data.startTime, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:ss')
        let end = moment(data.date + data.endTime, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:ss')
        if (route.params.update) {
            // payload for update contains id of diary from existing api call and other user data
            payload = Object.assign({}, data);
            payload.date = start;
            payload.time = data.startTime
            payload.userId = route.params.agentId;
            payload.diaryTime = start
            payload.start = start
            payload.end = end

            delete payload.startTime
            delete payload.endTime
            delete payload.hour;

            return payload
        }
        else {
            // add payload contain these keys below                         

            payload = Object.assign({}, data);
            payload.date = start;
            payload.userId = route.params.agentId;
            payload.time = data.startTime
            payload.diaryTime = start
            payload.start = start
            payload.end = end
            if (rcmLeadId) {
                payload.rcmLeadId = rcmLeadId
            }
            else {
                payload.cmLeadId = cmLeadId
            }

            delete payload.startTime
            delete payload.endTime

            return payload;
        }

    }


    createDiary = (diary) => {
        const { route } = this.props;
        if (route.params.update) {
            this.updateDiary(diary)
        }
        else {
            this.addDiary(diary)
        }
    }

    addDiary = (data) => {
        const { route, navigation } = this.props;
        const { rcmLeadId, cmLeadId } = route.params;
        let diary = this.generatePayload(data)
        console.log(diary);
        if (rcmLeadId || cmLeadId) {
            // create task for lead
            axios.post(`/api/leads/task`, diary)
                .then((res) => {
                    if (res.status === 200) {
                        helper.successToast('DIARY ADDED SUCCESSFULLY!')
                        let timeStamp = helper.convertTimeZone(res.data.start)
                        let data = {
                            title: res.data.taskType,
                            body: res.data.taskType + ' in 15 Minutes'
                        }
                        TimerNotification(data, timeStamp)
                        navigation.goBack();
                    }
                    else {
                        helper.errorToast('ERROR: SOMETHING WENT WRONG')
                    }

                })
                .catch((error) => {
                    helper.errorToast('ERROR: ADDING DIARY')
                    console.log('error', error.message)
                })

        }
        else {
            axios.post(`/api/diary/create`, diary)
                .then((res) => {
                    if (res.status === 200) {
                        helper.successToast('TASK ADDED SUCCESSFULLY!')
                        let timeStamp = helper.convertTimeZone(res.data.start)
                        let data = {
                            title: res.data.taskType,
                            body: res.data.taskType + ' in 15 Minutes'
                        }
                        TimerNotification(data, timeStamp)
                        navigation.navigate('Diary',
                            {
                                'agentId': this.props.route.params.agentId
                            });
                    }
                    else {
                        helper.errorToast('ERROR: SOMETHING WENT WRONG')
                    }

                })
                .catch((error) => {
                    helper.errorToast('ERROR: ADDING TASK')
                    console.log('error', error.message)
                })
        }

    }

    updateDiary = (data) => {
        let diary = this.generatePayload(data)
        axios.patch(`/api/diary/update?id=${diary.id}`, diary)
            .then((res) => {
                helper.successToast('TASK UPDATED SUCCESSFULLY!')
                this.props.navigation.navigate('Diary', { update: false, 'agentId': this.props.route.params.agentId })
            })
            .catch((error) => {
                //console.log('error', error)
                helper.errorToast('ERROR: UPDATING TASK')
                console.log(error)
            })
    }

    render() {
        const { checkValidation } = this.state;
        const { route } = this.props;
        return (
            <KeyboardAwareScrollView style={[AppStyles.container]} keyboardShouldPersistTaps="always" enableOnAndroid>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} onLongPress={Keyboard.dismiss}>
                    <SafeAreaView style={AppStyles.mb1} >
                        <DetailForm formSubmit={this.formSubmit} editableData={route.params.update ? route.params.data : null} checkValidation={checkValidation} />
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


