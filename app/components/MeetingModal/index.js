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
      selectedOption: 'tomorrow',
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
      formSubmitDiary,
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

            <View style={styles.row}>

              <TouchableButton label={"Tomorrow"}
                loading={false}
                onPress={() => this.setState({ selectedOption: 'tomorrow' })}
                containerStyle={styles.button}
                containerBackgroundColor={selectedOption === 'tomorrow' ? AppStyles.colors.primaryColor : '#8baaef'}
              />

              <TouchableButton label={"Next Week"}
                loading={false}
                onPress={() => this.setState({ selectedOption: 'next week' })}
                containerBackgroundColor={selectedOption === 'next week' ? AppStyles.colors.primaryColor : '#8baaef'}
                containerStyle={styles.button}
              />

            </View>


            <View style={styles.row}>

              <TouchableButton label={"Next Month"}
                loading={false}
                onPress={() => this.setState({ selectedOption: 'next month' })}
                containerStyle={styles.button}
                containerBackgroundColor={selectedOption === 'next month' ? AppStyles.colors.primaryColor : '#8baaef'}
              />

              <TouchableButton label={"Custom"}
                loading={false}
                onPress={() => this.setState({ selectedOption: 'custom' })}
                containerBackgroundColor={selectedOption === 'custom' ? AppStyles.colors.primaryColor : '#8baaef'}
                containerStyle={styles.button}
              />

            </View>

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
                  label={'ADD FOLLOW UP TASK'}
                  onPress={() => formSubmitDiary()}
                  loading={loading}
                />
              </View>
            </View>
          </View>
        </Modal>
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