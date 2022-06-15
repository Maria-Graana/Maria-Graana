/** @format */

import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { ListItem, Body, Switch } from 'native-base'
import styles from './style'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal'
import SimpleInputText from '../SimpleInputField'
import PickerComponent from '../Picker/index'
import StaticData from '../../StaticData'
import ErrorMessage from '../../components/ErrorMessage'
import times from '../../../assets/img/times.png'

class AddTokenModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      active,
      handleForm,
      formData,
      firstScreenValidate,
      addPaymentLoading,
      tokenModalToggle,
      tokenNotZero,
    } = this.props
    return (
      <Modal isVisible={active}>
        <View style={[styles.modalMain]}>
          <View style={styles.topHeader}>
            <Text style={styles.headingText}>Enter Token Details</Text>
            <TouchableOpacity
              style={styles.timesBtn}
              onPress={() => {
                tokenModalToggle(false)
              }}
            >
              <Image source={times} style={styles.timesImg} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View>
              <ListItem
                style={{ borderBottomWidth: 0, paddingBottom: 0 }}
                onPress={() => {
                  handleForm(!formData.taxIncluded, 'taxIncluded')
                }}
              >
                <Switch
                  value={formData.taxIncluded}
                  trackColor={{ true: AppStyles.colors.primaryColor, false: 'grey' }}
                  onValueChange={() => {
                    handleForm(!formData.taxIncluded, 'taxIncluded')
                  }}
                  thumbColor={'#fff'}
                />
                <Body>
                  <Text style={{ marginLeft: 5, fontSize: 16, fontWeight: 'bold' }}>
                    {formData.taxIncluded === false || formData.taxIncluded === null
                      ? 'Tax Not Included'
                      : 'Tax Included'}
                  </Text>
                </Body>
              </ListItem>
            </View>
            <View style={styles.moreViewContainer}>
              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <PickerComponent
                    onValueChange={handleForm}
                    data={StaticData.paymentTypeForToken}
                    name={'paymentTypeForToken'}
                    placeholder="Payment Type"
                    selectedItem={formData.paymentTypeForToken}
                  />
                  {firstScreenValidate === true && formData.paymentTypeForToken === '' && (
                    <ErrorMessage errorMessage={'Required'} />
                  )}
                </View>
              </View>

              <SimpleInputText
                name={'token'}
                fromatName={false}
                placeholder={'Enter Amount'}
                label={'ENTER AMOUNT'}
                value={formData.token != null ? formData.token : null}
                formatValue={formData.token != null ? formData.token : null}
                editable={true}
                keyboardType={'numeric'}
                onChangeHandle={handleForm}
              />
              {tokenNotZero ? (
                <ErrorMessage errorMessage={'Amount must be greater than 0'} />
              ) : null}
              {(firstScreenValidate === true && formData.token === null) ||
              formData.token === '' ? (
                <ErrorMessage errorMessage={'Required'} />
              ) : null}

              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <PickerComponent
                    onValueChange={handleForm}
                    data={StaticData.investFullPaymentType}
                    name={'type'}
                    placeholder="Type"
                    selectedItem={formData.type}
                  />
                  {firstScreenValidate === true && formData.type === '' && (
                    <ErrorMessage errorMessage={'Required'} />
                  )}
                </View>
              </View>

              <SimpleInputText
                name={'details'}
                fromatName={false}
                placeholder={'Details'}
                label={'DETAILS'}
                value={formData.details != '' ? formData.details : ''}
                formatValue={''}
                editable={true}
                onChangeHandle={handleForm}
              />

              <TouchableOpacity
                style={styles.bookedBtn}
                onPress={() => {
                  tokenModalToggle(false)
                }}
              >
                <Image
                  source={require('../../../assets/img/checkWhite.png')}
                  style={styles.bookedBtnImage}
                />
                <Text style={styles.bookedBtnText}>
                  {addPaymentLoading === true ? 'Wait...' : 'OK'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    )
  }
}

export default AddTokenModal
