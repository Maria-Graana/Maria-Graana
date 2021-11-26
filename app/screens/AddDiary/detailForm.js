/** @format */

import React, { Component } from 'react'
import { View, Text, TextInput, Platform, TouchableOpacity } from 'react-native'
import { Button, Toast, Textarea, CheckBox } from 'native-base'
import PickerComponent from '../../components/Picker/index'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux'
import moment from 'moment'
import helper from '../../helper'
import ErrorMessage from '../../components/ErrorMessage'
import DateTimePicker from '../../components/DatePicker'
import TouchableButton from '../../components/TouchableButton'
import Ability from '../../hoc/Ability'
import TouchableInput from '../../components/TouchableInput'
import styles from './style.js'

class DetailForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: {
        subject: 'Scheduled task',
        taskType: '',
        startTime: '',
        endTime: '',
        date: '',
        notes: '',
        status: 'pending',
        isRecurring: false,
        taskCategory: null,
        slots: [],
        addedBy: 'self',
      },
      buttonText: 'ADD TASK',
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
    this.setState({ formData: newObject, buttonText: 'UPDATE TASK' })
  }

  handleForm = (value, name) => {
    const { formData } = this.state
    formData[name] = value
    this.setState({ formData })
  }

  render() {
    const { taskType, date, startTime, endTime, subject, notes, isRecurring } = this.state.formData
    const { formData, buttonText } = this.state
    const {
      formSubmit,
      checkValidation,
      taskValues,
      loading,
      performTaskActions,
      user,
      editableData,
      goToSlotManagement,
      slotsData,
    } = this.props
    return (
      <View>
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent
              // enabled={
              //   formData.status === 'pending' &&
              //   (formData.taskCategory === 'simpleTask' || formData.taskCategory === null)
              //     ? true
              //     : false
              // }
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
        <TouchableInput
          placeholder="Book Slot"
          iconSource={require('../../../assets/img/calendar.png')}
          showIconOrImage={true}
          showDropDownIcon={false}
          iconMarginHorizontal={15}
          onPress={() => goToSlotManagement()}
          value={
            slotsData
              ? `${slotsData.date} (${helper.formatTime(slotsData.startTime)} - ${helper.formatTime(
                  slotsData.endTime
                )})`
              : ``
          }
        />

        <TouchableOpacity
          onPress={() => this.handleForm(!isRecurring, 'isRecurring')}
          style={styles.checkBoxRow}
        >
          <CheckBox
            color={AppStyles.colors.primaryColor}
            checked={isRecurring}
            style={styles.checkBox}
            onPress={() => this.handleForm(!isRecurring, 'isRecurring')}
          />
          <Text style={styles.checkBoxText}>Recurring</Text>
        </TouchableOpacity>

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
            placeholder="Comment"
            onChangeText={(text) => this.handleForm(text, 'notes')}
            // disabled={formData.status === 'pending' ? false : true}
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
