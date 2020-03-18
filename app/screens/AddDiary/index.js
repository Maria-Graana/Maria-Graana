import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableWithoutFeedback, SafeAreaView, Keyboard } from 'react-native';
import { Container, Header, Content, Input, Item, Picker, Form, Textarea, Button, StyleProvider } from 'native-base';
import { AntDesign, Entypo, Ionicons, EvilIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import getTheme from '../../../native-base-theme/components';
import formTheme from '../../../native-base-theme/variables/formTheme';
import axios from 'axios';
import { connect } from 'react-redux';
import helper from '../../helper';
import PickerComponent from '../../components/Picker/index';
import DateComponent from '../../components/DatePicker/index';
import styles from './style';
import AppStyles from '../../AppStyles';

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
            taskValues: ['Meeting', 'Follow Up', 'Day Structure', 'Other']
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
            <SafeAreaView style={styles.safeAreaViewcontainer}>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="always" enableOnAndroid
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.innerViewStyle}>
                            <View style={{ marginHorizontal: 15 }}>
                                <Item style={{ borderRadius: 4, backgroundColor: '#ffffff', paddingHorizontal: 12, paddingVertical: 4 }}  >
                                    <Input style={{ fontFamily: AppStyles.fonts.defaultFont, fontSize: 16, color: AppStyles.colors.textColor }} defaultValue={this.state.subject} placeholder='Subject/Title' onChangeText={this.subjectData} />
                                </Item>
                            </View>
                            {subjectText}
                            <PickerComponent selectedItem={this.state.selectedTask} itemStyle={styles.itemWrap} data={this.state.taskValues} value={this.state.taskValues} placeholder='Task Type' onValueChange={this.taskType} />
                            <DateComponent date={this.state.date} mode='date' placeholder='Select Date' onDateChange={this.onDateChange} />
                            {dateText}
                            <DateComponent date={this.state.startTime} mode='time' placeholder='Select Start Time' is24Hour={this.state.is24Hour} onTimeChange={this.onStartTimeChange} />
                            {startText}
                            <DateComponent date={this.state.endTime} disabled={this.state.startTime === '' ? true : false} mode='time' placeholder='Select End Time' is24Hour={this.state.is24Hour} onTimeChange={this.onEndTimeChange} />
                            {endText}
                            <Form style={{ marginVertical: 10, marginHorizontal: 15 }}>
                                <Textarea
                                    placeholderTextColor="#bfbbbb"
                                    style={{ backgroundColor: '#ffffff', height: 80, borderRadius: 5 }} rowSpan={5} defaultValue={this.state.description}
                                    bordered
                                    placeholder="Description"
                                    onChangeText={this.descriptionData}
                                />
                            </Form>
                            {descriptionText}
                            <View>
                                <Button onPress={this.submitForm}
                                    style={{ marginVertical: 10, marginHorizontal: 15, backgroundColor: '#ffffff', height: 60, justifyContent: 'center', borderRadius: 5 }} bordered dark>
                                    <Text style={{ color: '#484848' }}>{this.state.btnText}</Text>
                                </Button>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user
    }
}

export default connect(mapStateToProps)(AddDiary)


