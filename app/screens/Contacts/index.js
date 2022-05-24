/** @format */

import { Text, View, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import Search from '../../components/Search'
import AppStyles from '../../AppStyles'
import ArmsContactTile from '../../components/ArmsContactTile'
import Loader from '../../components/loader'
import { connect } from 'react-redux'
import {
  createARMSContactPayload,
  getARMSContacts,
  setSelectedContact,
} from '../../actions/armsContacts'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import fuzzy from 'fuzzy'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import _ from 'underscore'

export class Contacts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      isExpanded: false,
    }
  }

  componentDidMount() {
    const { dispatch, navigation } = this.props
    this._unsubscribe = navigation.addListener('focus', () => {
      dispatch(getARMSContacts())
    })
  }

  goToDialer = () => {
    const { navigation, dispatch } = this.props
    dispatch(setSelectedContact(null, false)).then((res) => {
      navigation.navigate('Dialer')
    })
  }

  onContactPress = (contact) => {
    const { dispatch, navigation } = this.props
    const { isExpanded } = this.state
    dispatch(setSelectedContact(contact)).then((res) => {
      this.setState({ numberTxt: contact.phone, isExpanded: !isExpanded })
    })
  }

  callNumber = () => {
    const { numberTxt } = this.state
    const { dispatch, navigation, selectedContact } = this.props
    if (numberTxt !== '') {
      let body = Object.assign({ ...selectedContact, phone: numberTxt })
      dispatch(setSelectedContact(body, true)).then((res) => {
        navigation.navigate('ContactFeedback')
      })
    }
  }

  registerAsClient = () => {
    const { dispatch, navigation, selectedContact } = this.props
    let body = createARMSContactPayload({
      ...selectedContact,
      callingCode: selectedContact.dialCode,
      callingCode1: selectedContact.dialCode2,
      callingCode2: selectedContact.dialCode3,
      countryCode: selectedContact.countryCode,
      countryCode1: selectedContact.countryCode2,
      countryCode2: selectedContact.countryCode3,
      contactNumber: selectedContact.phone,
      contact1: selectedContact.phone2,
      contact2: selectedContact.phone3,
    })
    navigation.navigate('AddClient', {
      title: 'ADD CLIENT INFO',
      data: body,
      isFromScreen: 'ContactRegistration',
    })
  }

  render() {
    const { searchText, isExpanded } = this.state
    const { armsContacts, armsContactsLoading, permissions } = this.props
    let data = []
    if (searchText !== '' && data && data.length === 0) {
      data = fuzzy.filter(searchText, armsContacts, {
        extract: (e) => (e.firstName ? e.firstName + ' ' + e.lastName : ''),
      })
      data = data.map((item) => item.original)
    } else {
      data = _.sortBy(armsContacts ? armsContacts : [], 'updatedAt')
    }

    let createUpdatePermission = getPermissionValue(
      PermissionFeatures.CONTACTS,
      PermissionActions.CreateUpdateContact,
      permissions
    )

    return (
      <View style={AppStyles.containerWithoutPadding}>
        {armsContactsLoading ? (
          <Loader loading={armsContactsLoading} />
        ) : (
          <>
            <Search
              placeholder={'Search Contacts'}
              searchText={searchText}
              setSearchText={(text) => this.setState({ searchText: text })}
            />
            <FlatList
              data={data}
              style={{ paddingHorizontal: 5 }}
              renderItem={({ item }) => (
                <ArmsContactTile
                  data={item}
                  onPress={(contact) => this.onContactPress(contact)}
                  isExpanded={isExpanded}
                  callNumber={(number) =>
                    this.setState({ numberTxt: number }, () => {
                      this.callNumber()
                    })
                  }
                  updatePermission={createUpdatePermission}
                  registerAsClient={(contact) => this.registerAsClient(contact)}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
            />
            {createUpdatePermission ? (
              <TouchableOpacity style={styles.keypadButton} onPress={() => this.goToDialer()}>
                <Image source={require(`../../../assets/img/keypad.png`)} />
              </TouchableOpacity>
            ) : null}
          </>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  keypadButton: {
    alignSelf: 'center',
    marginBottom: 10,
    zIndex: 10,
    elevation: 15,
  },
})

mapStateToProps = (store) => {
  return {
    armsContacts: store.armsContacts.armsContacts,
    armsContactsLoading: store.armsContacts.armsContactsLoading,
    selectedContact: store.armsContacts.selectedContact,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(Contacts)
