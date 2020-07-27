import React, { Component } from 'react';
import { TouchableWithoutFeedback, SafeAreaView, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment-timezone';
import axios from 'axios';
import { connect } from 'react-redux';
import DetailForm from './detailForm';
import helper from '../../helper';
import AppStyles from '../../AppStyles'
import TimerNotification from '../../LocalNotifications';
import StaticData from '../../StaticData';

class AddDiary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkValidation: false,
            taskValues: [],
        }
    }

    componentDidMount() {
        const { route, navigation } = this.props;
        const {tasksList = StaticData.taskValues} = route.params;
        if (route.params.update) {
            navigation.setOptions({ title: 'EDIT TASK' })
        }
        this.setState({taskValues:tasksList});
    }

    formSubmit = (data) => {
        if (!data.taskType || !data.date || !data.startTime) {
            this.setState({
                checkValidation: true
            })
        } else {
            this.createDiary(data)
        }
    }



    generatePayload = (data) => {
        const { route } = this.props;
        const { rcmLeadId, cmLeadId, managerId, addedBy } = route.params;
        let payload = null;
        let start = moment(data.date + data.startTime, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:ss')
        let end = data.endTime !== '' ? 
        moment(data.date + data.endTime, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:ss') // Actual end date is selected
        : 
        moment(start).add(1, 'hours').format('YYYY-MM-DDTHH:mm:ss'); // If end date is not selected by user, add plus 1 hour in start time
        if (route.params.update) {
            // payload for update contains id of diary from existing api call and other user data
            payload = Object.assign({}, data);
            payload.date = start;
            payload.time = data.startTime
            payload.userId = route.params.agentId;
            payload.diaryTime = start
            payload.start = start
            payload.end = end
            payload.taskCategory = 'simpleTask';
           
            if (rcmLeadId) {
                payload.rcmLeadId = rcmLeadId
            }
            else if (cmLeadId) {
                payload.cmLeadId = cmLeadId
            }

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
            payload.taskCategory = 'simpleTask';
            if (rcmLeadId) {
                payload.rcmLeadId = rcmLeadId
            }
            else if (cmLeadId) {
                payload.cmLeadId = cmLeadId
            }
            payload.addedBy = addedBy;
            payload.managerId = managerId;
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
        const { rcmLeadId, cmLeadId} = route.params;
        let diary = this.generatePayload(data)
        if (rcmLeadId || cmLeadId) {
            // create task for lead
            axios.post(`/api/leads/task`, diary)
                .then((res) => {
                    if (res.status === 200) {
                        helper.successToast('TASK ADDED SUCCESSFULLY!')
                        let timeStamp = helper.convertTimeZoneTimeStamp(res.data.start)
                        let start = helper.convertTimeZone(res.data.start)
                        let end = helper.convertTimeZone(res.data.end)
                        let data = {
                            title: res.data.subject,
                            body: moment(start).format("hh:mm") + ' - ' + moment(end).format("hh:mm")
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
                        let timeStamp = helper.convertTimeZoneTimeStamp(res.data.start)
                        let start = helper.convertTimeZone(res.data.start)
                        let end = helper.convertTimeZone(res.data.end)
                        let data = {
                            title: res.data.subject,
                            body: moment(start).format("hh:mm") + ' - ' + moment(end).format("hh:mm")
                        }
                        TimerNotification(data, timeStamp, start)
                        navigation.navigate('Diary',
                            {
                                'agentId': this.props.route.params.agentId,
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
        const { checkValidation, taskValues } = this.state;
        const { route } = this.props;
        return (
            <KeyboardAwareScrollView style={[AppStyles.container]} keyboardShouldPersistTaps="always" enableOnAndroid>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} onLongPress={Keyboard.dismiss}>
                    <SafeAreaView style={AppStyles.mb1} >
                        <DetailForm formSubmit={this.formSubmit} props={this.props} editableData={route.params.update ? route.params.data : null} taskValues={taskValues} checkValidation={checkValidation} />
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


