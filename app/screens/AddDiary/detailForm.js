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
                status: 'pending',
            },
        }
        this.taskValues = StaticData.taskValues;
    }

    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData });
    }

    render() {
        const { taskValues, taskSelected, date, startTime, endTime, subject, description } = this.state.formData;
        const { formData } = this.state;
        const { formSubmit, checkValidation } = this.props

        return (
            <View>

                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <TextInput style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.formFontSettings]} placeholder={'Subject/Title'} value={subject} onChangeText={(text) => this.handleForm(text, 'subject')} />
                    </View>
                    {
                        checkValidation === true && subject === '' && <ErrorMessage errorMessage={'Required'} />
                    }
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                        <PickerComponent onValueChange={this.handleForm} name={'taskSelected'} selectedItem={taskSelected} data={this.taskValues} value={taskValues} placeholder='Task Type' />
                    </View>
                    {
                        checkValidation === true && taskSelected === '' && <ErrorMessage errorMessage={'Required'} />
                    }
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <DateComponent
                        date={date} mode='date' placeholder='Select Date' onDateChange={(date) => this.handleForm(date, 'date')}
                    />
                    {
                        checkValidation === true && date === '' && <ErrorMessage errorMessage={'Required'} />
                    }
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <DateComponent date={startTime} mode='time' placeholder='Select Start Time' onTimeChange={(value) => this.handleForm(moment(value, 'h:mm ').format('hh:mm a'), 'startTime')} />
                    {
                        checkValidation === true && startTime === '' && <ErrorMessage errorMessage={'Required'} />
                    }
                </View>

                <View style={[AppStyles.mainInputWrap]}>
                    <DateComponent date={endTime} mode='time' placeholder='Select End Time' disabled={startTime === '' ? true : false} onTimeChange={(value) => this.handleForm(moment(value, 'h:mm ').format('hh:mm a'), 'endTime')} />
                    {
                        checkValidation === true && endTime === '' && <ErrorMessage errorMessage={'Required'} />
                    }
                </View>


                <View style={[AppStyles.mainInputWrap]}>
                    <Textarea
                        placeholderTextColor="#bfbbbb"
                        style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.formFontSettings, { height: 100 }]} rowSpan={5}
                        placeholder="Description"
                        onChangeText={(text) => this.handleForm(text, 'description')}
                        value={description}
                    />
                </View>


                <View style={{ marginVertical: 10 }}>
                    <Button onPress={() => { formSubmit(formData) }}
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

