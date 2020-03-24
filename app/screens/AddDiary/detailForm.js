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

class DetailForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formData: {
                subject: '',
                taskType: 'Meeting',
                startTime: '',
                endTime: '',
                date: '',
                notes: '',
                status: 'pending',
            },
            buttonText: 'ADD'
        }
        this.taskValues = StaticData.taskValues;
    }

    componentDidMount() {
        const { editableData } = this.props;
        if (editableData != null) {
            this.setFormValues(editableData)
        }
    }



    setFormValues = (data) => {
        const { formData } = this.state;
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

        const newObject = Object.assign({}, formData, data)
        newObject.subject = data.subject;
        newObject.notes = data.notes;
        newObject.date = moment(data.date).format("YYYY-MM-DD");
        newObject.status = data.status;
        newObject.startTime = startReplace;
        newObject.endTime = endReplace;
        newObject.taskType = data.taskType;
        newObject.status = data.status;

        this.setState({ formData: newObject, buttonText: 'UPDATE' })

    }


    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData });
    }

    render() {
        const { taskValues, taskType, date, startTime, endTime, subject, notes } = this.state.formData;
        const { formData, buttonText } = this.state;
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
                        <PickerComponent onValueChange={this.handleForm} name={'taskType'} selectedItem={taskType} data={this.taskValues} value={taskValues} placeholder='Task Type' />
                    </View>
                    {
                        checkValidation === true && taskType === '' && <ErrorMessage errorMessage={'Required'} />
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
                        onChangeText={(text) => this.handleForm(text, 'notes')}
                        value={notes}
                    />
                </View>


                <View style={{ marginVertical: 10 }}>
                    <Button onPress={() => { formSubmit(formData) }}
                        style={[AppStyles.formBtn]}>
                        <Text style={AppStyles.btnText}>{buttonText}</Text>
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

