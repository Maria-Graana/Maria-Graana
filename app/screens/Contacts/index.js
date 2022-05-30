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
import FilterLeadsView from '../../components/FilterLeadsView'
import RBSheet from 'react-native-raw-bottom-sheet'
import TextFilterComponent from '../../components/TextFilterComponent'

export class Contacts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isExpanded: false,
      nameFilter: null,
      phoneFilter: null,
      filterType: null,
      searchText: '',
      statusFilterType: '',
      clear: false,
    }
  }

  componentDidMount() {
    const { dispatch, navigation } = this.props
    const { searchText, statusFilterType } = this.state
    this._unsubscribe = navigation.addListener('focus', () => {
      dispatch(getARMSContacts(searchText, statusFilterType))
    })
  }

  goToDialer = () => {
    const { navigation, dispatch } = this.props
    dispatch(setSelectedContact(null, false)).then((res) => {
      navigation.navigate('Dialer')
    })
  }
  clearStateValues = () => {
    this.setState({
      nameFilter: null,
      phoneFilter: null,
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
  clearSearch = () => {
    this.setState({ searchText: '', statusFilterType: '', clear: false })
  }

  onClearAll = () => {
    const { dispatch } = this.props
    this.clearSearch()
    this.clearStateValues()
    dispatch(getARMSContacts())
  }

  setBottomSheet = (value) => {
    this.setState(
      {
        filterType: value,
      },
      () => {
        this.clearSearch()

        this.RBSheet.open()
      }
    )
  }
  setTextSearch = (text) => {
    this.setState({ searchText: text })
  }
  changeStatusType = (status, text) => {
    const { dispatch } = this.props
    const { searchText } = this.state
    this.clearStateValues()
    if (status == 'name') {
      this.setState({ nameFilter: text, clear: true })
    } else {
      this.setState({ phoneFilter: text, clear: true })
    }
    this.setState({ statusFilterType: status }, () => {
      this.RBSheet.close()
      dispatch(getARMSContacts(searchText, status))
    })
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
    const { searchText, isExpanded, nameFilter, phoneFilter, filterType } = this.state
    const { armsContacts, armsContactsLoading, permissions } = this.props
    let data = []
    data = _.sortBy(armsContacts ? armsContacts : [], 'updatedAt').reverse()

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
            {/* <Search
              placeholder={'Search Contacts'}
              searchText={searchText}
              setSearchText={(text) => this.setState({ searchText: text })}
            /> */}
            <FilterLeadsView
              nameLead={nameFilter}
              phoneLead={phoneFilter}
              setBottomSheet={this.setBottomSheet}
              contactScreen={true}
              clear={this.state.clear}
              onClear={this.onClearAll}
              // hasBooking={true}
            />
            <RBSheet
              ref={(ref) => {
                this.RBSheet = ref
              }}
              openDuration={250}
              closeOnDragDown={true}
              height={300}
            >
              {filterType == 'name' ? (
                <TextFilterComponent
                  name={'Name'}
                  type={'name'}
                  searchText={searchText}
                  setTextSearch={this.setTextSearch}
                  changeStatusType={this.changeStatusType}
                />
              ) : filterType == 'phone' ? (
                <TextFilterComponent
                  name={'Phone #'}
                  type={'phone'}
                  searchText={searchText}
                  setTextSearch={this.setTextSearch}
                  changeStatusType={this.changeStatusType}
                />
              ) : null}
            </RBSheet>
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
