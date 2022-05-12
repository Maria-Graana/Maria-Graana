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
import DiaryHelper from '../Diary/diaryHelper.js'

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
        selectedLead: null,
        selectedProperty: null,
      },
      buttonText: 'ADD TASK',
      editableField: true,
    }
  }

  componentDidMount() {
    const { editableData, navigation } = this.props

    navigation.addListener('focus', () => {
      const { lead, property, navFrom, rcmLeadId } = this.props
      const { formData } = this.state
      if (editableData != null) {
        this.setFormValues(editableData)
      } else {
        let copyObject = Object.assign({}, formData)
        if (lead) copyObject.selectedLead = lead
        if (navFrom) {
          copyObject.taskType = 'meeting'
          this.setState({ editableField: false })
        }
        if (rcmLeadId) {
          copyObject.taskType = 'follow_up'
          this.setState({ editableField: false })
        }
        this.setState({ formData: copyObject })
        if (property) {
          copyObject.selectedProperty = property
          this.setState({ formData: copyObject })
        }
      }
    })
  }

  setFormValues = (data) => {
    const { formData } = this.state
    let leadObj = data.armsProjectLeadId
      ? data.armsProjectLead
      : data.armsLeadId
      ? data.armsLead
      : null
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
    newObject.isRecurring = data.isRecurring
    newObject.selectedProperty = data.property ? data.property : null
    if (leadObj && leadObj.customer) {
      leadObj.customer = {
        ...leadObj.customer,
        customerName: leadObj.customer.first_name + ' ' + leadObj.customer.last_name,
      }

      newObject.selectedLead = leadObj
    }
    this.setState({ formData: newObject, buttonText: 'UPDATE TASK' })
  }

  handleForm = (value, name) => {
    const { formData } = this.state
    formData[name] = value
    if (name === 'taskType') {
      this.clearLeadAndProperty()
      return
    }
    this.setState({ formData })
  }

  clearLeadAndProperty = () => {
    let copyObject = Object.assign({}, this.state.formData)
    copyObject.selectedLead = null
    copyObject.selectedProperty = null
    this.setState({ formData: copyObject })
  }

  render() {
    const {
      taskType,
      date,
      startTime,
      endTime,
      subject,
      notes,
      isRecurring,
      taskCategory,
      selectedLead,
      selectedProperty,
    } = this.state.formData
    const { formData, buttonText, editableField } = this.state
    const {
      formSubmit,
      checkValidation,
      taskValues,
      loading,
      user,
      goToSlotManagement,
      slotsData,
      editableData,
      feedbackReasonFilter,
      goToDiaryReasons,
      goBackToDiary,
      goToLeads,
      goToLeadProperties,
      lead,
    } = this.props
    return (
      <View>
        {editableData ? (
          <View style={styles.editViewContainer}>
            <Text style={styles.headingText}> Task Type: </Text>
            <Text style={styles.labelText}> {`${DiaryHelper.showTaskType(taskType)}`} </Text>
          </View>
        ) : (
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent
                enabled={editableData === null && editableField}
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
        )}

        {(taskType == 'viewing' || taskType == 'follow_up' || taskType == 'meeting') &&
          lead !== null && (
            <View>
              <TouchableInput
                placeholder="Select Lead"
                showDropDownIcon={false}
                disabled={
                  formData.status === 'completed' || taskType === '' || editableData !== null
                }
                onPress={() => goToLeads(formData)}
                value={
                  selectedLead
                    ? selectedLead.id
                        .toString()
                        .concat(' - ', selectedLead.customer.customerName.toString())
                    : ''
                }
              />
              {checkValidation === true && selectedLead === null && (
                <ErrorMessage errorMessage={'Required'} />
              )}
            </View>
          )}

        {taskType == 'viewing' && (
          <View>
            <TouchableInput
              placeholder="Select Property"
              showDropDownIcon={false}
              disabled={formData.status === 'completed' || taskType === '' || editableData !== null}
              onPress={() => goToLeadProperties(formData)}
              value={
                selectedProperty
                  ? selectedProperty.size
                      .toString()
                      .concat(' ', selectedProperty.size_unit)
                      .concat(' ', selectedProperty.subtype)
                      .concat(' in ')
                      .concat(' ', selectedProperty.area && selectedProperty.area.name)
                  : ''
              }
            />
            {checkValidation === true && selectedProperty === null && (
              <ErrorMessage errorMessage={'Required'} />
            )}
          </View>
        )}

        {editableData && editableData.taskType === 'follow_up' ? (
          <View style={styles.editViewContainer}>
            <Text style={styles.headingText}> Reason: </Text>
            <View style={{ alignSelf: 'flex-start', marginVertical: 10 }}>
              <Text
                style={[
                  styles.taskResponse,
                  {
                    borderColor: editableData.reason
                      ? editableData.reason.colorCode
                      : 'transparent',
                  },
                ]}
              >
                {editableData.reasonTag}
              </Text>
            </View>
          </View>
        ) : taskType === 'follow_up' ? (
          <View style={[AppStyles.inputWrap]}>
            <TouchableInput
              onPress={() => goToDiaryReasons()}
              showIconOrImage={false}
              value={feedbackReasonFilter ? feedbackReasonFilter.name : ''}
              placeholder={'Select Reason'}
            />
          </View>
        ) : null}

        <TouchableInput
          placeholder="Book Slot"
          iconSource={require('../../../assets/img/calendar.png')}
          showIconOrImage={true}
          showDropDownIcon={false}
          iconMarginHorizontal={15}
          disabled={formData.status === 'completed' || taskType === ''}
          onPress={() => goToSlotManagement(formData)}
          value={
            slotsData
              ? `${slotsData.date} (${helper.formatTime(slotsData.startTime)} - ${helper.formatTime(
                  slotsData.endTime
                )})`
              : ``
          }
        />
        {checkValidation === true && slotsData === null && (
          <ErrorMessage errorMessage={'Required'} />
        )}

        {editableData === null &&
        (taskType === 'morning_meeting' ||
          taskType === 'daily_update' ||
          taskType === 'meeting_with_pp') ? (
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
            <Text style={styles.checkBoxText}>Recurring Task</Text>
          </TouchableOpacity>
        ) : null}

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
            maxLength={1000}
            onChangeText={(text) => this.handleForm(text, 'notes')}
            disabled={formData.status === 'pending' ? false : true}
            value={notes}
          />
        </View>

        {formData.status === 'pending' && (
          <View style={{ marginVertical: 10 }}>
            <TouchableButton
              containerStyle={[AppStyles.formBtn]}
              label={buttonText}
              disabled={loading}
              onPress={() => formSubmit(formData)}
              loading={loading}
            />
          </View>
        )}

        {formData.status === 'pending' && (
          <View style={{ marginVertical: 10 }}>
            <TouchableButton
              containerStyle={[AppStyles.formBtn]}
              label={'CANCEL'}
              onPress={() => goBackToDiary()}
            />
          </View>
        )}
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    feedbackReasonFilter: store.diary.feedbackReasonFilter,
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(DetailForm)
