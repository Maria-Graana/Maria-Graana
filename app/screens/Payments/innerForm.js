import React, { Component } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios'
import styles from './style'
import PickerComponent from '../../components/Picker/index';
import AppStyles from '../../AppStyles'
import { Button } from 'native-base';
import { connect } from 'react-redux';
import * as RootNavigation from '../../navigation/RootNavigation';

class InnerForm extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    const { checkValidation, handleForm, getProject, getFloor, getUnit } = this.props
    return (
      <View style={[styles.modalMain]}>
        <View style={[styles.formMain]}>

          {/* **************************************** */}
          <View style={[styles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getProject} name={'customerId'} placeholder='Project' />
              {
                checkValidation === true && formData.customerId === '' && <ErrorMessage errorMessage={'Required'} />
              }
            </View>
          </View>

          {/* **************************************** */}
          <View style={[styles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getFloor} name={'customerId'} placeholder='Floors' />
              {
                checkValidation === true && formData.customerId === '' && <ErrorMessage errorMessage={'Required'} />
              }
            </View>
          </View>

          {/* **************************************** */}
          <View style={[styles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent onValueChange={handleForm} data={getUnit} name={'customerId'} placeholder='Unit' />
              {
                checkValidation === true && formData.customerId === '' && <ErrorMessage errorMessage={'Required'} />
              }
            </View>
          </View>

          {/* **************************************** */}
          <View style={[styles.mainBlackWrap]}>
            <View style={[styles.blackInputWrap, styles.blackBorder]}>
              <Text style={[styles.blackInputText]}>Token</Text>
              <View style={[styles.blackInput]}>
                <TextInput style={[styles.blackInput]} />
              </View>
            </View>

            <View style={[styles.blackInputdate]}>
              <Text style={styles.dateText}>10:30am Mar 29</Text>
            </View>
          </View>


          {/* **************************************** */}
          <View style={[styles.mainBlackWrap]}>
            <View style={[styles.blackInputWrap, styles.blackBorder]}>
              <Text style={[styles.blackInputText]}>Down Payment</Text>
              <View style={[styles.blackInput]}>
                <TextInput style={[styles.blackInput]} />
              </View>
            </View>

            <View style={[styles.blackInputdate]}>
              <Text style={styles.dateText}>10:30am Mar 29</Text>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[styles.mainBlackWrap]}>
            <View style={[styles.blackInputWrap, styles.blackBorder]}>
              <Text style={[styles.blackInputTextTwo]}>Installments</Text>
              <View style={[styles.blackInput]}>
                <TextInput style={[styles.blackInput]} />
              </View>
            </View>
          </View>


          {/* **************************************** */}
          <View style={[styles.mainBlackWrap, styles.lessMargin]}>
            <View style={[styles.blackInputWrap, styles.blackBorder]}>
              <Text style={[styles.blackInputTextTwo]}>Installments 1</Text>
              <View style={[styles.blackInput]}>
                <TextInput style={[styles.blackInput]} />
              </View>
            </View>

            <View style={[styles.blackInputdateTwo]}>
              <Text style={styles.dateText}>10:30am Mar 29</Text>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[styles.mainBlackWrap, styles.lessMargin]}>
            <View style={[styles.blackInputWrap, styles.blackBorder]}>
              <Text style={[styles.blackInputTextTwo]}>Installments 2</Text>
              <View style={[styles.blackInput]}>
                <TextInput style={[styles.blackInput]} />
              </View>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[styles.mainBlackWrap, styles.lessMargin]}>
            <View style={[styles.blackInputWrap, styles.blackBorder]}>
              <Text style={[styles.blackInputTextTwo]}>Installments 3</Text>
              <View style={[styles.blackInput]}>
                <TextInput style={[styles.blackInput]} />
              </View>
            </View>
          </View>


          {/* **************************************** */}
          <View style={[styles.mainBlackWrap, styles.topMargin]}>
            <View style={[styles.blackInputWrap, styles.blackBorder]}>
              <Text style={[styles.blackInputText]}>Commission Payment</Text>
              <View style={[styles.blackInput]}>
                <TextInput style={[styles.blackInput]} />
              </View>
            </View>
          </View>

          {/* **************************************** */}
          <View style={[styles.mainInputWrap]}>
            <Button
              onPress={() => { formSubmit() }}
              style={[AppStyles.formBtn, styles.addInvenBtn]}>
              <Text style={AppStyles.btnText}>ADD Meeting</Text>
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


