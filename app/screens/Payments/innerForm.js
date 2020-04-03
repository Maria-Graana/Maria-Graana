import React, { Component } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios'
import styles from './style'
import PickerComponent from '../../components/Picker/index';
import AppStyles from '../../AppStyles'
import { Button } from 'native-base';
import { connect } from 'react-redux';
import * as RootNavigation from '../../navigation/RootNavigation';
import ErrorMessage from '../../components/ErrorMessage'

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
    } = this.props
    return (
      <View style={[AppStyles.modalMain]}>
        <View style={[AppStyles.formMain]}>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getProject} name={'projectId'} placeholder='Project' />
              {
                checkValidation === true && formData.projectId === '' && <ErrorMessage errorMessage={'Required'} />
              }
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getFloor} name={'floorId'} placeholder='Floors' />
              {
                checkValidation === true && formData.floorId === '' && <ErrorMessage errorMessage={'Required'} />
              }
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getUnit} name={'unitId'} placeholder='Unit' />
              {
                checkValidation === true && formData.unitId === '' && <ErrorMessage errorMessage={'Required'} />
              }
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>TOKEN</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'10 LAC'} onChangeText={(text) => { handleForm(text, 'token') }} />
                {
                  checkValidation === true && formData.token === '' && <ErrorMessage errorMessage={'Required'} />
                }
              </View>
            </View>

            <View style={[AppStyles.blackInputdate]}>
              <Text style={AppStyles.dateText}>10:30am Mar 29</Text>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
              <Text style={[AppStyles.blackInputText]}>DOWN PAYMENT</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} placeholder={'10 LAC'} onChangeText={(text) => { handleForm(text, 'downPayment') }} />
                {
                  checkValidation === true && formData.downPayment === '' && <ErrorMessage errorMessage={'Required'} />
                }
              </View>
            </View>

            <View style={[AppStyles.blackInputdate]}>
              <Text style={AppStyles.dateText}>10:30am Mar 29</Text>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getInstallments} name={'instalments'} placeholder='Instalments' />
              {
                checkValidation === true && formData.customerId === '' && <ErrorMessage errorMessage={'Required'} />
              }
            </View>
          </View>

          {/* **************************************** */}
          {
            totalInstalments != '' && totalInstalments.map((item, key) => {
              return (
                <View style={[AppStyles.mainBlackWrap]} key={key}>
                  <View style={[AppStyles.blackInputWrap, styles.blackBorder]}>
                    <Text style={[AppStyles.blackInputText]}>INSTALMENTS {key + 1}</Text>
                    <View style={[AppStyles.blackInput]}>
                      <TextInput style={[AppStyles.blackInput]} placeholder={'10 LAC'} onChangeText={(text) => { handleInstalments(text, key) }} />
                    </View>
                  </View>

                  <View style={[AppStyles.blackInputdate]}>
                    <Text style={AppStyles.dateText}>10:30am Mar 29</Text>
                  </View>
                </View>
              )
            })
          }

          {/* **************************************** */}
          <View style={[AppStyles.mainBlackWrap]}>
            <View style={[AppStyles.blackInputWrap, styles.fullWidth]}>
              <Text style={[AppStyles.blackInputText]}>COMMISSION PAYMENT</Text>
              <View style={[AppStyles.blackInput]}>
                <TextInput style={[AppStyles.blackInput]} onChangeText={(text) => { handleForm(text, 'commisionPayment') }}/>
                {
                  checkValidation === true && formData.commisionPayment === "" && <ErrorMessage errorMessage={'Required'} />
                }
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
      </View>

    )
  }
}


mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(InnerForm)


