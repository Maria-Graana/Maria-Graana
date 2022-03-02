/** @format */

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getARMSContacts, setSelectedContact } from '../../actions/armsContacts'
import _ from 'underscore'
import ArmsContactTile from '../../components/ArmsContactTile'
import AppStyles from '../../AppStyles'
import { Feather } from '@expo/vector-icons'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import fuzzy from 'fuzzy'
import VirtualKeyboard from 'react-native-virtual-keyboard'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'

class Dialer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allContacts: [],
      numberTxt: '',
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getARMSContacts()).then((res) => {
      const { armsContacts, contacts } = this.props
      let newContactsArr = _.uniq(armsContacts.rows.concat(contacts), false)
      newContactsArr = newContactsArr.map((item) => {
        if (item.phone) {
          return item
        } else {
          return {
            ...item,
            phone: item.phoneNumbers[0].number,
          }
        }
      })
      this.setState({ allContacts: newContactsArr })
    })
  }

  onContactPress = (contact) => {
    const { dispatch, navigation } = this.props
    dispatch(setSelectedContact(contact)).then((res) => {
      this.setState({ numberTxt: contact.phone })
    })
  }

  callNumber = () => {
    const { numberTxt } = this.state
    const { dispatch, navigation, selectedContact } = this.props
    if (numberTxt !== '') {
      let body = {
        phone: numberTxt,
        id: selectedContact && selectedContact.id ? selectedContact.id : null,
        firstName: selectedContact && selectedContact.firstName ? selectedContact.firstName : '',
        lastName: selectedContact && selectedContact.lastName ? selectedContact.lastName : '',
      }
      console.log('body=>', body)
      dispatch(setSelectedContact(body, true)).then((res) => {
        navigation.replace('ContactFeedback')
      })
    } else {
      alert('Please enter a valid number')
    }
  }

  render() {
    const { allContacts, numberTxt } = this.state
    const { navigation, dispatch, permissions } = this.props
    let data = []
    if (numberTxt !== '' && data && data.length === 0) {
      data = fuzzy.filter(numberTxt, allContacts, {
        extract: (e) => (e.phone ? e.phone : ''),
      })
      data = data.map((item) => item.original)
    }

    let createPermission = getPermissionValue(
      PermissionFeatures.CONTACTS,
      PermissionActions.CREATE,
      permissions
    )

    return (
      <SafeAreaView style={AppStyles.containerWithoutPadding}>
        <FlatList
          style={{ height: heightPercentageToDP('35%') }}
          data={data}
          renderItem={({ item }) => (
            <ArmsContactTile
              data={item}
              onPress={(data) => this.onContactPress(data)}
              showCallButton={false}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
        {createPermission ? (
          <TouchableOpacity style={styles.callButton} onPress={() => this.callNumber()}>
            <Image source={require(`../../../assets/img/dialer_call.png`)} />
          </TouchableOpacity>
        ) : null}

        <View style={styles.underLine} />

        <View style={{ height: heightPercentageToDP('40%') }}>
          <Text style={styles.inputStyle}>{this.state.numberTxt}</Text>
          <VirtualKeyboard
            color="black"
            pressMode="string"
            onPress={(val) => this.setState({ numberTxt: val })}
          />
        </View>

        <View style={styles.bottomTab}>
          <TouchableOpacity
            style={styles.bottomTabViews}
            onPress={() => console.log('focus to control')}
          >
            <Image source={require(`../../../assets/img/dial_pad.png`)} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomTabViews}
            onPress={() => navigation.navigate('PhoneContacts')}
          >
            <Image source={require(`../../../assets/img/phonebook.png`)} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  bottomTab: {
    position: 'absolute', //Here is the trick
    bottom: 0,
    height: 50,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderTopColor: AppStyles.colors.subTextColor,
  },
  bottomTabViews: {
    width: '50%',
    alignItems: 'center',
  },
  inputStyle: {
    color: AppStyles.colors.primaryColor,
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: AppStyles.fontSize.large,
    textAlign: 'center',
    marginVertical: 10,
    letterSpacing: 0.5,
  },
  callButton: {
    position: 'absolute',
    bottom: 15,
    zIndex: 15,
    right: widthPercentageToDP(60),
    left: widthPercentageToDP(40),
  },
  underLine: {
    height: 0.5,
    width: '100%',
    backgroundColor: AppStyles.colors.subTextColor,
  },
})

mapStateToProps = (store) => {
  return {
    contacts: store.contacts.contacts,
    armsContacts: store.armsContacts.armsContacts,
    selectedContact: store.armsContacts.selectedContact,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(Dialer)
