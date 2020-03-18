import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableWithoutFeedback, SafeAreaView, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import axios from 'axios';
import { connect } from 'react-redux';
import styles from './style'
import helper from '../../helper';
import StaticData from '../../StaticData'

const _format = 'YYYY-MM-DD';
const _today = moment(new Date().dateString).format(_format);

class AddDiary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mode: "date",
            show: false,
            date: _today,
            time: '',
            selectedTask: 'Meeting',
            btnText: 'Add',
            defaultStatus: 'pending',
            description: '',
            subject: '',
            is24Hour: true,
            subjectEmpty: false,
            agentId: props.user.id,
            dateEmpty: false,
            startEmpty: false,
            endEmpty: false,
            startTime: '',
            endTime: '',
            taskValues: StaticData.taskValues,
        }
    }

    componentDidMount() {
        // if (this.props.navigation.state.params.update) {
        //     this.setFormValues(this.props.navigation.state.params.data)
        // }
    }

    setFormValues = (data) => {
        let startReplace
        let endReplace
        if (data.start) {
            startReplace = data.start.replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1")
        }
        else {
            startReplace = data.time.replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1")
        }
        if (data.end) {
            endReplace = data.end.replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1")
        }
        else {
            endReplace = data.time.replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1")
        }
        this.setState({
            subject: data.subject,
            description: data.notes,
            date: moment(data.date).format("YYYY-MM-DD"),
            startTime: startReplace,
            endTime: endReplace,
            selectedTask: data.taskType,
            btnText: 'UPDATE DIARY'
        })
    }

    taskType = (itemValue) => {
        this.setState({
            selectedTask: itemValue
        })
    }

    subjectData = (subject) => {
        if (subject == '') {
            this.setState({ subjectEmpty: true })
        }
        else {
            this.setState({
                subjectEmpty: false,
                subject: subject
            })
        }
    }

    descriptionData = (description) => {
        this.setState({
            description: description
        })
    }

    onDateChange = (onDateChange) => {
        if (onDateChange == '') {
            this.setState({ dateEmpty: true })
        } else {
            this.setState({
                date: onDateChange,
                dateEmpty: false
            })
        }
    }

    onStartTimeChange = (time) => {
        if (time == '') {
            this.setState({ startEmpty: true })
        } else {
            this.setState({
                startTime: moment(time, 'h:mm ').format('hh:mm a'),
                startEmpty: false
            })
        }
    }

    onEndTimeChange = (time) => {
        if (time == '') {
            this.setState({ endEmpty: true })
        } else {
            this.setState({
                endTime: moment(time, 'h:mm ').format('hh:mm a'),
                endEmpty: false
            })
        }
    }

    submitForm = () => {
        if (this.state.subject == '' && this.state.start == '' && this.state.startTime == '' && this.state.endTime == '') {
            this.setState({ subjectEmpty: true, dateEmpty: true, startEmpty: true, endEmpty: true })
        }
        else if (this.state.subject == '') {
            this.setState({ subjectEmpty: true })
        }
        else if (this.state.date == '') {
            this.setState({ dateEmpty: true })
        }
        else if (this.state.startTime == '') {
            this.setState({ startEmpty: true })
        }
        else if (this.state.endTime == '') {
            this.setState({ endEmpty: true })
        }
        else {
            this.setState({ subjectEmpty: false, dateEmpty: false, startEmpty: false, endEmpty: false })
            this.createDiary()
        }
    }

    updateDiaryPayload = () => {
        payload = this.props.navigation.state.params.data
        start = moment(this.state.date + this.state.startTime, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:ss')
        end = moment(this.state.date + this.state.endTime, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:ss')
        payload.subject = this.state.subject
        payload.date = start
        payload.notes = this.state.description
        payload.taskType = this.state.selectedTask
        payload.time = this.state.startTime
        payload.userId = this.state.agentId
        payload.diaryTime = start
        payload.start = start
        payload.end = end

        return payload
    }

    generatePayload = () => {
        let start = moment(this.state.date + this.state.startTime, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:ss')
        let end = moment(this.state.date + this.state.endTime, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:ss')
        let payload = {
            subject: this.state.subject,
            date: start,
            notes: this.state.description,
            taskType: this.state.selectedTask,
            status: this.state.defaultStatus,
            time: this.state.startTime,
            userId: this.state.agentId,
            diaryTime: start,
            start: start,
            end: end
        }
        return payload
    }

    createDiary = () => {
        // if (this.props.navigation.state.params.update) {
        //     this.updateDiary()
        // } else {
        this.addDiary()
        //  }
    }

    updateDiary = (diary) => {
        diary = this.updateDiaryPayload()
        delete diary.hour
        axios.patch(`/api/diary/update?id=${diary.id}`, diary)
            .then((res) => {
                helper.successToast('DIARY UPDATED SUCCESSFULLY!')
                this.props.navigation.navigate('Diary', { 'agent': false, 'agentId': this.state.agentId })
            })
            .catch((error) => {
                helper.errorToast('ERROR: UPDATING DIARY')
                console.log(error)
            })
    }

    addDiary = () => {
        let diary = this.generatePayload()
        axios.post(`/api/diary/create`, diary)
            .then((res) => {
                helper.successToast('DIARY ADDED SUCCESSFULLY!')
                this.props.navigation.navigate('Diary', { 'agent': false, 'agentId': this.state.agentId })
            })
            .catch((error) => {
                helper.errorToast('ERROR: ADDING DIARY')
                console.log(error)
            })
    }



    render() {
        let subjectText = <View style={{}}></View>
        let descriptionText = <View style={{}}></View>
        let dateText = <View style={{}}></View>
        let startText = <View style={{}}></View>
        let endText = <View style={{}}></View>

        if (this.state.subjectEmpty)
            subjectText = <Text style={{ color: "red", paddingLeft: 18 }}>This Field is Required</Text>

        if (this.state.dateEmpty)
            dateText = <Text style={{ color: "red", paddingLeft: 18 }}>This Field is Required</Text>

        if (this.state.startEmpty)
            startText = <Text style={{ color: "red", paddingLeft: 18 }}>This Field is Required</Text>

        if (this.state.endEmpty)
            endText = <Text style={{ color: "red", paddingLeft: 18 }}>This Field is Required</Text>

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.safeAreaViewcontainer}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps="always" enableOnAndroid
                    >
                        
                    </KeyboardAwareScrollView>
                </SafeAreaView>
            </TouchableWithoutFeedback>



        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(AddDiary)


