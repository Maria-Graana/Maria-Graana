import React from 'react'
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import { Button, } from 'native-base';
import styles from './style'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal';
import times from '../../../assets/img/times.png'
import ErrorMessage from '../../components/ErrorMessage'
import DateTimePicker from '../DatePicker';
import helper from '../../helper'
import TouchableButton from '../../components/TouchableButton';

class MeetingModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: '',
    }
  }

  render() {
    const {
      openModal,
      active,
      handleForm,
      formSubmit,
      formData,
      checkValidation,
      editMeeting,
      diaryForm,
      diaryTask,
      handleFormDiary,
      addFollowUpTask,
      //formSubmitDiary,
      loading,
    } = this.props
    const { selectedOption } = this.state;
    if (diaryForm === true) {
      return (
        <Modal isVisible={active}>
          <View style={[styles.modalMain]}>
            <TouchableOpacity style={styles.timesBtn} onPress={() => { openModal() }}>
              <Image source={times} style={styles.timesImg} />
            </TouchableOpacity>

            <View style={styles.rowVertical}>
              <TouchableButton label={"Today"}
                loading={false}
                onPress={() => {
                  this.setState({ selectedOption: 'today' })
                  addFollowUpTask('today')
                }}
                containerStyle={styles.button}
              />

              <TouchableButton label={"Tomorrow"}
                loading={false}
                onPress={() => {
                  this.setState({ selectedOption: 'tomorrow' })
                  addFollowUpTask('tomorrow')
                }}
                containerStyle={styles.button}
              />

            <TouchableButton label={"In 3 Days"}
              loading={false}
              onPress={() => {
                this.setState({ selectedOption: 'in_3_days' })
                addFollowUpTask('in_3_days')
              }}
              containerStyle={styles.button}
            />
            <TouchableButton label={"Next Week"}
              loading={false}
              onPress={() => {
                this.setState({ selectedOption: 'next_week' })
                addFollowUpTask('next_week')
              }}
              containerStyle={styles.button}
            />

            <TouchableButton label={"Custom"}
              loading={false}
              onPress={() => this.setState({ selectedOption: 'custom' })}
              containerStyle={styles.button}
            />
          </View>
          {
            selectedOption === 'custom' &&

            <View style={[styles.formMain]}>
              <DateTimePicker
                placeholderLabel={'Select Date'}
                name={'date'}
                mode={'date'}
                disabled={selectedOption != 'custom'}
                showError={checkValidation === true && diaryTask.date === ''}
                errorMessage={'Required'}
                iconSource={require('../../../assets/img/calendar.png')}
                date={diaryTask.date ? new Date(diaryTask.date) : new Date()}
                selectedValue={diaryTask.date ? helper.formatDate(diaryTask.date) : ''}
                handleForm={(value, name) => handleFormDiary(value, name)}
              />

              <DateTimePicker
                placeholderLabel={'Select Time'}
                name={'start'}
                mode={'time'}
                disabled={selectedOption != 'custom'}
                showError={checkValidation === true && diaryTask.start === ''}
                errorMessage={'Required'}
                iconSource={require('../../../assets/img/clock.png')}
                date={diaryTask.start ? new Date(diaryTask.start) : new Date()}
                selectedValue={diaryTask.start ? helper.formatTime(diaryTask.start) : ''}
                handleForm={(value, name) => handleFormDiary(value, name)}
              />
              {/* **************************************** */}
              <View style={[AppStyles.mainInputWrap]}>
                <TouchableButton
                  containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
                  label={'Done'}
                  onPress={() => addFollowUpTask('custom')}
                />
              </View>
            </View>
          }
          </View>
        </Modal >
      )
    } else {
      return (
        <Modal isVisible={active}>
          <View style={[styles.modalMain]}>
            <TouchableOpacity style={styles.timesBtn} onPress={() => { openModal() }}>
              <Image source={times} style={styles.timesImg} />
            </TouchableOpacity>

            <View style={[styles.formMain]}>

              {/* **************************************** */}
              <DateTimePicker
                placeholderLabel={'Select Date'}
                name={'date'}
                mode={'date'}
                showError={checkValidation === true && formData.date === ''}
                errorMessage={'Required'}
                iconSource={require('../../../assets/img/calendar.png')}
                date={formData.date ? new Date(formData.date) : new Date()}
                selectedValue={formData.date ? helper.formatDate(formData.date) : ''}
                handleForm={(value, name) => handleForm(value, name)}
              />

              {/* **************************************** */}
              <DateTimePicker
                placeholderLabel={'Select Start Time'}
                name={'time'}
                mode={'time'}
                showError={checkValidation === true && formData.time === ''}
                errorMessage={'Required'}
                iconSource={require('../../../assets/img/clock.png')}
                date={formData.time ? new Date(formData.time) : new Date()}
                selectedValue={formData.time ? helper.formatTime(formData.time) : ''}
                handleForm={(value, name) => handleForm(value, name)}
              />

              {/* **************************************** */}
              <View style={[AppStyles.mainInputWrap]}>
                <TouchableButton
                  containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
                  label={editMeeting ? 'UPDATE MEETING' : 'ADD MEETING'}
                  onPress={() => formSubmit()}
                  loading={loading}
                />
              </View>
            </View>
          </View>
        </Modal>
      )
    }

  }
}

export default MeetingModal;