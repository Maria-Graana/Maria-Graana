import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Button, } from 'native-base';
import styles from './style'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal';
import times from '../../../assets/img/times.png'
import SimpleInputText from '../SimpleInputField'
import PickerComponent from '../Picker/index';

class AddPaymentModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      active,
      handleForm,
      addPaymentModalToggle,
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
                name={'amount'}
                fromatName={'amount'}
                placeholder={'Enter Amount'}
                label={'ENTER AMOUNT'}
                value={''}
                formatValue={''}
                editable={false}
                keyboardType={'numeric'}
              />

              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <PickerComponent onValueChange={handleForm} data={''} name={'type'} placeholder='Type' selectedItem={''} />
                </View>
              </View>

              <SimpleInputText
                name={'details'}
                fromatName={false}
                placeholder={'Details'}
                label={'DETIALS'}
                value={''}
                formatValue={''}
                editable={false}
                keyboardType={'numeric'}
              />

              <TouchableOpacity style={styles.addPaymentBtn} onPress={() => { addPaymentModalToggle(false) }}>
                <Image style={styles.addPaymentBtnImg} source={require('../../../assets/img/roundPlus.png')}></Image>
                <Text style={styles.addPaymentBtnText}>ADD ATTACHMENT</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.bookedBtn}>
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