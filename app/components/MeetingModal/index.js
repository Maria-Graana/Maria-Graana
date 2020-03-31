import React from 'react'
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import { Button, } from 'native-base';
import styles from './style'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal';
import DateComponent from '../../components/DatePicker'
import times from '../../../assets/img/times.png'
import ErrorMessage from '../../components/ErrorMessage'

class MeetingModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { openModal, active, handleForm, formSubmit, formData, checkValidation } = this.props
    return (
      <Modal isVisible={active}>
        <View style={[styles.modalMain]}>
          <TouchableOpacity style={styles.timesBtn} onPress={() => { openModal() }}>
            <Image source={times} style={styles.timesImg} />
          </TouchableOpacity>

          <View style={[styles.formMain]}>

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <View style={[AppStyles.inputWrap]}>
                <DateComponent date={formData.date} mode='date' placeholder='Select Date' onDateChange={(value) => {handleForm(value, 'date')}} />
                {
                  checkValidation === true && formData.date === '' && <ErrorMessage errorMessage={'Required'} />
                }
              </View>
            </View>

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <View style={[AppStyles.inputWrap]}>
                <DateComponent date={formData.time} mode='time' placeholder='Select Start Time' onTimeChange={(value) => {handleForm(value, 'time')}} />
                {
                  checkValidation === true && formData.time === '' && <ErrorMessage errorMessage={'Required'} />
                }
              </View>
            </View>

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap]}>
              <Button
                onPress={() => { formSubmit() }}
                style={[AppStyles.formBtn, styles.addInvenBtn]}>
                <Text style={AppStyles.btnText}>ADD Meeting</Text>
              </Button>
            </View>

          </View>
        </View>
      </Modal>
    )
  }
}

export default MeetingModal;