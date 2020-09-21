import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal';
import SimpleInputText from '../SimpleInputField'
import PickerComponent from '../Picker/index';
import StaticData from '../../StaticData';
import ErrorMessage from '../../components/ErrorMessage'

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
    } = this.props
    return (

      <Modal isVisible={active}>
        <View style={[styles.modalMain]}>
          <View style={styles.topHeader}>
            <Text style={styles.headingText}>Enter Details</Text>
          </View>
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
              {secondCheckValidation === true && secondFormData.installmentAmount === null && <ErrorMessage errorMessage={'Required'} />}

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
                label={'DETIALS'}
                value={secondFormData.details != '' ? secondFormData.details : ''}
                formatValue={''}
                editable={true}
                onChangeHandle={secondHandleForm}
              />

              <TouchableOpacity style={styles.addPaymentBtn} onPress={() => { addPaymentModalToggle(false) }}>
                <Image style={styles.addPaymentBtnImg} source={require('../../../assets/img/roundPlus.png')}></Image>
                <Text style={styles.addPaymentBtnText}>ADD ATTACHMENT</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.bookedBtn} onPress={() => {secondFormSubmit()}}>
                <Text style={styles.bookedBtnText}>
                  <Image source={require('../../../assets/img/checkWhite.png')} style={styles.bookedBtnImage} /> OK
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    )
  }
}

export default AddPaymentModal;