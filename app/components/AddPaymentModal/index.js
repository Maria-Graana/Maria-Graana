import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal';
import SimpleInputText from '../SimpleInputField'
import PickerComponent from '../Picker/index';
import StaticData from '../../StaticData';
import ErrorMessage from '../../components/ErrorMessage'
import times from '../../../assets/img/times.png'

class AddPaymentModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      active,
      secondHandleForm,
      addPaymentModalToggle,
      secondFormData,
      secondFormSubmit,
      secondCheckValidation,
      modalLoading,
      addPaymentLoading,
      attechmentModalToggle,
      formData,
      goToPayAttachments,
      secondFormLeadData,
      remarks,
    } = this.props
    return (

      <Modal isVisible={active}>
        <View style={[styles.modalMain]}>

          {
            modalLoading === false ?
              <View style={styles.topHeader}>
                <Text style={styles.headingText}>Enter Details</Text>
                <TouchableOpacity style={styles.timesBtn} onPress={() => { addPaymentModalToggle(false) }}>
                  <Image source={times} style={styles.timesImg} />
                </TouchableOpacity>
              </View>
              : <Text style={{ padding: 10, }}>Fetching Data...</Text>
          }
          {
            modalLoading === false ?
              <ScrollView>
                <View style={styles.moreViewContainer}>
                  <SimpleInputText
                    name={'installmentAmount'}
                    fromatName={false}
                    placeholder={'Enter Amount'}
                    label={'ENTER AMOUNT'}
                    value={secondFormData.installmentAmount != null ? secondFormData.installmentAmount : null}
                    formatValue={secondFormData.installmentAmount != null ? secondFormData.installmentAmount : null}
                    editable={true}
                    keyboardType={'numeric'}
                    onChangeHandle={secondHandleForm}
                  />
                  {
                    secondCheckValidation === true ?
                      secondFormData.installmentAmount === null || secondFormData.installmentAmount === '' ?
                        <ErrorMessage errorMessage={'Required'} />
                        : null
                      : null
                  }

                  <View style={[AppStyles.mainInputWrap]}>
                    <View style={[AppStyles.inputWrap]}>
                      <PickerComponent onValueChange={secondHandleForm} data={StaticData.fullPaymentType} name={'type'} placeholder='Type' selectedItem={secondFormData.type} />
                      {secondCheckValidation === true && secondFormData.type === '' && <ErrorMessage errorMessage={'Required'} />}
                    </View>
                  </View>

                  <SimpleInputText
                    name={'details'}
                    fromatName={false}
                    placeholder={'Details'}
                    label={'DETAILS'}
                    value={secondFormData.details != '' ? secondFormData.details : ''}
                    formatValue={''}
                    editable={true}
                    onChangeHandle={secondHandleForm}
                  />

                  {
                    remarks != null &&
                    <SimpleInputText
                      name={'remarks'}
                      fromatName={false}
                      placeholder={'Remarks'}
                      label={'REMARKS'}
                      value={remarks}
                      formatValue={''}
                      editable={false}
                    />
                  }

                  {
                    secondFormData.installmentAmount != null && secondFormData.installmentAmount != '' &&
                    secondFormData.type != '' &&
                    <TouchableOpacity style={styles.addPaymentBtn} onPress={() => { goToPayAttachments(true) }}>
                      <Image style={styles.addPaymentBtnImg} source={require('../../../assets/img/roundPlus.png')}></Image>
                      <Text style={styles.addPaymentBtnText}>ADD ATTACHMENT</Text>
                    </TouchableOpacity>
                  }

                  {
                    secondFormLeadData.status === 'rejected' ?
                      <View style={styles.reSubmiitBtnMain}>
                        <TouchableOpacity style={[styles.bookedBtn, styles.reSubmitBtns, styles.cancelLight]} onPress={() => { addPaymentModalToggle(false) }}>
                          {/* <Image source={require('../../../assets/img/checkWhite.png')} style={styles.bookedBtnImage} /> */}
                          <Text style={[styles.bookedBtnText, styles.reSubmitText]}>
                            CANCEL
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.bookedBtn, styles.reSubmitBtns, styles.reSubmitLight]} onPress={() => { addPaymentLoading != true && secondFormSubmit() }}>
                          {/* <Image source={require('../../../assets/img/checkWhite.png')} style={styles.bookedBtnImage} /> */}
                          <Text style={[styles.bookedBtnText, styles.reSubmitText, styles.reSubmitTextDark]}>
                            {addPaymentLoading === true ? 'Wait...' : 'RE-SUBMIT'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      :
                      <TouchableOpacity style={styles.bookedBtn} onPress={() => { addPaymentLoading != true && secondFormSubmit() }}>
                        <Image source={require('../../../assets/img/checkWhite.png')} style={styles.bookedBtnImage} />
                        <Text style={styles.bookedBtnText}>
                          {addPaymentLoading === true ? 'Wait...' : 'OK'}
                        </Text>
                      </TouchableOpacity>
                  }


                </View>
              </ScrollView>
              : null
          }

        </View>
      </Modal>
    )
  }
}

export default AddPaymentModal;