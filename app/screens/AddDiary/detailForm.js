import React, { Component } from 'react';
import { View, Text, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { Button, Icon, StyleProvider, Toast, Textarea } from 'native-base';
import PickerComponent from '../../components/Picker/index';
import AppStyles from '../../AppStyles';
import { connect } from 'react-redux';
import styles from './style';
import moment from 'moment'
import StaticData from '../../StaticData'
import DateComponent from '../../components/DatePicker'

const _format = 'YYYY-MM-DD';
const _today = (new Date());

class DetailForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            subjectText: '',
            selectedTask: '',
            taskValues: StaticData.taskValues,
            startTime: '',
            endTime: '',
            date: '',
            description: '',
        }
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    taskType = (itemValue) => {
        this.setState({
            selectedTask: itemValue
        })
    }

    onDateChange = () => {

    }

    onStartTimeChange = (time) => {
        // if (time == '') {
        //     this.setState({ startEmpty: true })
        // } else {
            this.setState({
                startTime: moment(time, 'h:mm ').format('hh:mm a'),
                //startEmpty: false
            })
    }

    onEndTimeChange = (time) => {
        // if (time == '') {
        //     this.setState({ endEmpty: true })
        // } else {
            this.setState({
                endTime: moment(time, 'h:mm ').format('hh:mm a'),
              //  endEmpty: false
            },()=>{
                console.log(this.state.endTime)
            })
       // }
    }

    render() {
        const { taskValues, selectedTask, date, startTime, endTime} = this.state;

        return (

            <View>
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.formFontSettings]} placeholder={'Subject/Title'} />
                    </View>
                </View>


                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent selectedItem={selectedTask} data={taskValues} value={taskValues} placeholder='Task Type' onValueChange={this.taskType} />
                    </View>
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <DateComponent
                        date={date} mode='date' placeholder='Select Date' onDateChange={this.onDateChange}
                    />
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <DateComponent date={startTime} mode='time' placeholder='Select Start Time'  onTimeChange={this.onStartTimeChange} />
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <DateComponent date={endTime} mode='time' placeholder='Select End Time' disabled={startTime === '' ? true : false} onTimeChange={this.onEndTimeChange} />
                </View>


                <View style={[AppStyles.mainInputWrap]}>
                    <Textarea
                        placeholderTextColor="#bfbbbb"
                        style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.formFontSettings, { height: 100 }]} rowSpan={5}
                        placeholder="Description"
                    />
                </View>



                <View style={{ marginVertical: 10 }}>
                    <Button
                        style={[AppStyles.formBtn]}>
                        <Text style={AppStyles.btnText}>ADD DIARY</Text>
                    </Button>
                </View>
            </View>
        )
    }
}

mapStateToProps = (store) => {
    return {
        user: store.user.user,
    }
}

export default connect(mapStateToProps)(DetailForm)

