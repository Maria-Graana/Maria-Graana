/** @format */

import React, { Component } from 'react'
import { View, Text, TextInput, Platform } from 'react-native'
import { Button, Toast, Textarea } from 'native-base'
import PickerComponent from '../../components/Picker/index'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux'
import moment from 'moment'
import helper from '../../helper'
import ErrorMessage from '../../components/ErrorMessage'
import DateTimePicker from '../../components/DatePicker'
import TouchableButton from '../../components/TouchableButton'
import Ability from '../../hoc/Ability'

class DetailForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: {
        subject: '',
        taskType: '',
        startTime: '',
        endTime: '',
        date: '',
        notes: '',
        status: 'pending',
        taskCategory: null,
      },
      buttonText: 'ADD',
    }
  }

  componentDidMount() {
    const { editableData, props } = this.props
    if (editableData != null) {
      this.setFormValues(editableData)
    }
  }

  setFormValues = (data) => {
    const { formData } = this.state
    const newObject = Object.assign({}, formData, data)
    newObject.subject = data.subject
    newObject.notes = data.notes
    newObject.date = moment(data.date)
    newObject.status = data.status
    newObject.startTime = data.start
    newObject.endTime = data.end
    newObject.taskType = data.taskType
    newObject.status = data.status
    newObject.taskCategory = data.taskCategory
    this.setState({ formData: newObject, buttonText: 'UPDATE' })
  }

  handleForm = (value, name) => {
    const { formData } = this.state
    formData[name] = value
    this.setState({ formData })
  }

  render() {
    const { taskType, date, startTime, endTime, subject, notes } = this.state.formData
    const { formData, buttonText } = this.state
    const {
      formSubmit,
      checkValidation,
      taskValues,
      loading,
      performTaskActions,
      user,
      screenName,
      editableData,
    } = this.props
    return (
      <View>
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              placeholderTextColor={'#a8a8aa'}
              style={[
                AppStyles.formControl,
                { backgroundColor: formData.status === 'pending' ? '#fff' : '#ddd' },
                Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
                AppStyles.formFontSettings,
              ]}
              placeholder={'Subject/Title'}
              value={subject}
              editable={formData.status === 'pending'}
              onChangeText={(text) => this.handleForm(text, 'subject')}
            />
          </View>
          {checkValidation === true && formData.subject === '' && (
            <ErrorMessage errorMessage={'Required'} />
          )}
        </View>

        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent
              enabled={
                formData.status === 'pending' &&
                (formData.taskCategory === 'simpleTask' || formData.taskCategory === null)
                  ? true
                  : false
              }
              onValueChange={this.handleForm}
              selectedItem={taskType}
              data={taskValues}
              name={'taskType'}
              placeholder="Task Type"
            />
          </View>
          {checkValidation === true && taskType === '' && (
            <ErrorMessage errorMessage={'Required'} />
          )}
        </View>
        <DateTimePicker
          placeholderLabel={'Select Date'}
          disabled={formData.status !== 'pending'}
          name={'date'}
          mode={'date'}
          showError={checkValidation === true && date === ''}
          errorMessage={'Required'}
          iconSource={require('../../../assets/img/calendar.png')}
          date={date ? new Date(date) : new Date()}
          selectedValue={date ? moment(date).format(moment.HTML5_FMT.DATE) : ''}
          handleForm={(value, name) => this.handleForm(value, name)}
        />
        <DateTimePicker
          placeholderLabel={'Select Start Time'}
          disabled={formData.status !== 'pending'}
          name={'startTime'}
          mode={'time'}
          showError={checkValidation === true && startTime === ''}
          errorMessage={'Required'}
          iconSource={require('../../../assets/img/clock.png')}
          date={startTime ? new Date(startTime) : new Date()}
          selectedValue={startTime ? moment(startTime).format('hh:mm a') : ''}
          handleForm={(value, name) => this.handleForm(value, name)}
        />
        <DateTimePicker
          placeholderLabel={'Select End Time'}
          name={'endTime'}
          disabled={formData.status !== 'pending' || startTime === '' ? true : false}
          mode={'time'}
          iconSource={require('../../../assets/img/clock.png')}
          date={endTime ? new Date(endTime) : new Date()}
          selectedValue={endTime ? moment(endTime).format('hh:mm a') : ''}
          handleForm={(value, name) => this.handleForm(value, name)}
        />

        <View style={[AppStyles.mainInputWrap]}>
          <Textarea
            placeholderTextColor="#bfbbbb"
            style={[
              AppStyles.formControl,
              Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
              AppStyles.formFontSettings,
              {
                height: 100,
                paddingTop: 10,
                backgroundColor: formData.status === 'pending' ? '#fff' : '#ddd',
              },
            ]}
            rowSpan={5}
            placeholder="Description"
            onChangeText={(text) => this.handleForm(text, 'notes')}
            editable={formData.status === 'pending' ? true : false}
            value={notes}
          />
        </View>

        {formData.status === 'pending' && (
          <View style={{ marginVertical: 10 }}>
            <TouchableButton
              containerStyle={[AppStyles.formBtn]}
              label={buttonText}
              onPress={() => formSubmit(formData)}
              loading={loading}
            />
          </View>
        )}

        {Ability.canEdit(user.subRole, screenName) &&
        editableData &&
        formData.status !== 'completed' &&
        formData.taskCategory === 'simpleTask' ? (
          <View style={{ marginVertical: 10 }}>
            <TouchableButton
              containerStyle={AppStyles.formBtn}
              label={'Mark Task as Done'}
              containerBackgroundColor={
                formData.status == 'completed' ? '#8baaef' : AppStyles.colors.primaryColor
              }
              onPress={() => {
                performTaskActions('completed')
              }}
              disabled={formData.status == 'completed'}
            />
          </View>
        ) : null}
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
