import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button, Toast, Textarea } from 'native-base';
import PickerComponent from '../../components/Picker/index';
import AppStyles from '../../AppStyles';
import { connect } from 'react-redux';
import moment from 'moment'
import StaticData from '../../StaticData'
import DateComponent from '../../components/DatePicker'
import ErrorMessage from '../../components/ErrorMessage'

const _format = 'YYYY-MM-DD';
const _today = (new Date());

class DetailForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formData: {
                subject: '',
                taskSelected: '',
                startTime: '',
                endTime: '',
                date: '',
                description: '',
            }
        }
        this.taskValues = StaticData.taskValues;
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData });
    }

    render() {
        const { taskValues, selectedTask, date, startTime, endTime } = this.state;

        return (

            <View>
                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.formFontSettings]} placeholder={'Subject/Title'} onChangeText={(text) => this.handleForm(text, 'subject')} />
                    </View>
                    <ErrorMessage errorMessage={'*Required Field'} />
                </View>


                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent onValueChange={this.handleForm} name={'taskSelected'} selectedItem={selectedTask} data={this.taskValues} value={taskValues} placeholder='Task Type' />
                    </View>
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <DateComponent
                        date={date} mode='date' placeholder='Select Date' onDateChange={(date) => this.handleForm(date, 'date')}
                    />
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <DateComponent date={startTime} mode='time' placeholder='Select Start Time' onTimeChange={(value) => this.handleForm(moment(value, 'h:mm ').format('hh:mm a'), 'startTime')} />
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <DateComponent date={endTime} mode='time' placeholder='Select End Time' disabled={startTime === '' ? true : false} onTimeChange={(value) => this.handleForm(moment(value, 'h:mm ').format('hh:mm a'), 'endTime')} />
                </View>


                <View style={[AppStyles.mainInputWrap]}>
                    <Textarea
                        placeholderTextColor="#bfbbbb"
                        style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.formFontSettings, { height: 100 }]} rowSpan={5}
                        placeholder="Description"
                        onChangeText={(text) => this.handleForm(text, 'description')}
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

