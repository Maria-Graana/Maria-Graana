/** @format */

import { Text, View, TextInput } from 'react-native'
import React, { Component } from 'react'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux'
import TouchableButton from '../../components/TouchableButton'
import ErrorMessage from '../../components/ErrorMessage'
import { addCall, createContact, setSelectedContact } from '../../actions/armsContacts'
import moment from 'moment'

export class ContactRegistrationFeedback extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: {
        firstName: '',
        lastName: '',
        phone: '',
        id: null,
      },
      phoneValidate: false,
      checkValidation: false,
    }
  }
  componentDidMount() {
    const { selectedContact } = this.props
    if (selectedContact) {
      let copyContact = { ...this.state.formData }
      copyContact.firstName = selectedContact.firstName
      copyContact.lastName = selectedContact.lastName
      copyContact.phone = selectedContact.phone
      copyContact.id = selectedContact.id
      this.setState({ formData: copyContact })
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(setSelectedContact({}))
  }

  validatePhone = (value) => {
    if (value.length < 4 && value !== '') this.setState({ phoneValidate: true })
    else this.setState({ phoneValidate: false })
  }

  // ********* Form Handle Function
  handleForm = (value, name) => {
    const { formData } = this.state
    if (name === 'phone') {
      this.validatePhone(value)
    }
    formData[name] = value
    this.setState({ formData })
  }

  navigateToClientScreen = () => {
    const { navigation } = this.props
    const { formData } = this.state
    navigation.replace('AddClient', {
      title: 'ADD CLIENT INFO',
      data: formData,
      isFromScreen: 'ContactRegistration',
    })
  }

  performAction = (action) => {
    const { formData, phoneValidate } = this.state
    const { dispatch, armsContacts, navigation } = this.props
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      this.setState({
        checkValidation: true,
      })
    } else {
      if (!phoneValidate) {
        if (action === 'register_as_client') {
          this.navigateToClientScreen()
        } else if (action === 'needs_further_contact' || action === 'not_interested') {
          let isContactExists = armsContacts.rows.find((item) => item.id === formData.id)
          if (isContactExists) {
            // already exists in arms db
            addCall({
              feedback: action,
              armsContactId: formData.id,
              time: moment(),
            }).then((callRes) => {
              navigation.replace('Contacts')
            })
          } else {
            delete formData.id
            createContact(formData).then((res) => {
              if (res) {
                addCall({
                  feedback: action,
                  armsContactId: res.id,
                  time: moment(),
                }).then((callRes) => {
                  navigation.replace('Contacts')
                })
              }
            })
          }
        }
      }
    }
  }

  render() {
    const { formData, phoneValidate, checkValidation } = this.state
    return (
      <View style={AppStyles.container}>
        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              onChangeText={(text) => {
                this.handleForm(text, 'firstName')
              }}
              placeholderTextColor={'#a8a8aa'}
              value={formData.firstName}
              style={[AppStyles.formControl, AppStyles.inputPadLeft]}
              placeholder={'First Name'}
              // editable={formData.firstName === ''}
            />
          </View>
          {checkValidation === true && formData.firstName === '' && (
            <ErrorMessage errorMessage={'Required'} />
          )}
        </View>
        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              onChangeText={(text) => {
                this.handleForm(text, 'lastName')
              }}
              placeholderTextColor={'#a8a8aa'}
              value={formData.lastName}
              style={[AppStyles.formControl, AppStyles.inputPadLeft]}
              placeholder={'Last Name'}
              // editable={formData.lastName === ''}
            />
          </View>
          {checkValidation === true && formData.lastName === '' && (
            <ErrorMessage errorMessage={'Required'} />
          )}
        </View>

        {/* **************************************** */}

        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              onChangeText={(text) => {
                this.handleForm(text, 'phone')
              }}
              placeholderTextColor={'#a8a8aa'}
              value={formData.phone}
              style={[AppStyles.formControl, AppStyles.inputPadLeft]}
              placeholder={'Phone'}
            />
          </View>
          {phoneValidate == true && <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />}
          {phoneValidate == false && checkValidation === true && formData.phone === '' && (
            <ErrorMessage errorMessage={'Required'} />
          )}
        </View>

        {/* **************************************** */}

        <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            containerStyle={[AppStyles.formBtn]}
            label={'REGISTER AS CLIENT'}
            onPress={() => this.performAction('register_as_client')}
          />
        </View>
        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            containerStyle={[AppStyles.formBtn]}
            containerBackgroundColor={'#fff'}
            borderColor={AppStyles.colors.primaryColor}
            textColor={AppStyles.colors.primaryColor}
            borderWidth={0.5}
            label={'NEEDS FURTHER CONTACT'}
            onPress={() => this.performAction('needs_further_contact')}
          />
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            containerStyle={[AppStyles.formBtn]}
            containerBackgroundColor={'#fff'}
            borderColor={AppStyles.colors.redBg}
            textColor={AppStyles.colors.redBg}
            borderWidth={0.5}
            label={'NOT INTERESTED'}
            onPress={() => this.performAction('not_interested')}
          />
        </View>
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    armsContacts: store.armsContacts.armsContacts,
    selectedContact: store.armsContacts.selectedContact,
  }
}

export default connect(mapStateToProps)(ContactRegistrationFeedback)
