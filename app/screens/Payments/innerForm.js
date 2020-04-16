import React, { Component } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios'
import styles from './style'
import PickerComponent from '../../components/Picker/index';
import AppStyles from '../../AppStyles'
import { Button } from 'native-base';
import { connect } from 'react-redux';
import * as RootNavigation from '../../navigation/RootNavigation';
import { formatPrice } from '../../PriceFormate'

class InnerForm extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    const { checkValidation,
      handleForm,
      getProject,
      getFloor,
      getUnit,
      getInstallments,
      formData,
      totalInstalments,
      handleInstalments,
      formSubmit,
      readOnly,
      remainingPayment,
      downPayment,
      tokenDate,
    } = this.props
    console.log('remainingPayment',remainingPayment)
    return (
      <View style={[AppStyles.modalMain]}>
        <View style={[AppStyles.formMain]}>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getProject} name={'projectId'} placeholder='Project' />
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getFloor} name={'floorId'} placeholder='Floors' />
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getUnit} name={'unitId'} placeholder='Unit' />
            </View>
          </View>

          {/* **************************************** */}
          < View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>TOTAL SIZE</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'10 SQFT'} value={readOnly.totalSize} editable={false} />
              </View>
            </View>
          </View>


          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>RATE</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'10 LAC'} value={formatPrice(readOnly.rate.toString())} editable={false} />
              </View>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>TOTAL PRICE</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'10 LAC'} value={formatPrice(readOnly.totalPrice.toString())} editable={false} />
              </View>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.fullWidthPad, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>DISCOUNT</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'10 LAC'} onChangeText={(text) => { handleForm(text, 'discount') }} keyboardType={'numeric'}/>
                <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(formData.discount != null ? formData.discount : '')}</Text>
              </View>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>TOKEN</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'10 LAC'} onChangeText={(text) => { handleForm(text, 'token') }} keyboardType={'numeric'}/>
                <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(formData.token != null ? formData.token : '')}</Text>
              </View>
            </View>

            <View style={[AppStyles.blackInputdate]}>
              <Text style={AppStyles.dateText}>{tokenDate}</Text>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>DOWN PAYMENT</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'10 LAC'} onChangeText={(text) => { handleForm(text, 'downPayment') }} keyboardType={'numeric'}/>
                <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(formData.downPayment != null ? formData.downPayment : '')}</Text>
              </View>
            </View>

            <View style={[AppStyles.blackInputdate]}>
              <Text style={AppStyles.dateText}>{downPayment}</Text>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getInstallments} name={'instalments'} placeholder='Installments' />
            </View>
          </View>

          {/* **************************************** */}
          {
            totalInstalments != '' && totalInstalments.map((item, key) => {
              return (
                <View style={[AppStyles.mainBlackWrap]} key={key}>
                  <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
                    <Text style={[AppStyles.blackInputText]}>INSTALLMENTS {key + 1}</Text>
                    <View style={[AppStyles.blackInput]}>
                      <TextInput style={[AppStyles.blackInput]} placeholder={'10 LAC'} onChangeText={(text) => { handleInstalments(text, key) }} keyboardType={'numeric'}/>
                      <Text style={[AppStyles.countPrice, styles.customTop]}>{formatPrice(totalInstalments[key].installmentAmount)}</Text>
                    </View>
                  </View>

                  <View style={[AppStyles.blackInputdate]}>
                    <Text style={AppStyles.dateText}>{totalInstalments[key].installmentDate}</Text>
                  </View>
                </View>
              )
            })
          }

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.fullWidth]}>
              <Text style={[AppStyles.blackInputText]}>REMAINING PAYMENT</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} value={formatPrice(remainingPayment.toString())} editable={false} />
              </View>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <Button
              onPress={() => { formSubmit() }}
              style={[AppStyles.formBtn, styles.addInvenBtn]}>
              <Text style={AppStyles.btnText}>CLOSE LEAD</Text>
            </Button>
          </View>

        </View>
      </View >

    )
  }
}


mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(InnerForm)


