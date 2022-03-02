/** @format */

import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import Avatar from '../../components/Avatar'
import AppStyles from '../../AppStyles'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { Ionicons } from '@expo/vector-icons'
import { setSelectedContact } from '../../actions/armsContacts'
import { connect } from 'react-redux'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import { getPermissionValue } from '../../hoc/Permissions'

class PhoneContactDetail extends Component {
  componentDidMount() {
    const { route, navigation, selectedContact } = this.props
    navigation.setOptions({ title: selectedContact?.firstName + ' ' + selectedContact?.lastName })
  }

  callNumber = (number) => {
    const { dispatch, navigation, route, selectedContact } = this.props
    dispatch(
      setSelectedContact(
        {
          phone: number ? number : '',
          id: selectedContact && selectedContact.id ? selectedContact.id : null,
          firstName: selectedContact && selectedContact.firstName ? selectedContact.firstName : '',
          lastName: selectedContact && selectedContact.lastName ? selectedContact.lastName : '',
        },
        true
      )
    ).then((res) => {
      navigation.replace('ContactFeedback')
    })
  }

  getName = (data) => {
    const { firstName, lastName } = data
    if (firstName && lastName && firstName !== '' && lastName !== '') {
      return firstName + ' ' + lastName
    } else if (firstName && firstName !== '') {
      return firstName
    }
  }

  render() {
    const { route, navigation, selectedContact, permissions } = this.props

    let createPermission = getPermissionValue(
      PermissionFeatures.CONTACTS,
      PermissionActions.CREATE,
      permissions
    )
    return (
      <TouchableOpacity
        style={[
          AppStyles.containerWithoutPadding,
          { backgroundColor: AppStyles.colors.backgroundColor },
        ]}
      >
        <View style={styles.listItem}>
          <View style={styles.imageViewStyle}>
            <Avatar data={selectedContact} />
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <View>
              <Text style={[styles.textFont, { fontFamily: AppStyles.fonts.defaultFont }]}>
                {this.getName(selectedContact)}
              </Text>
            </View>
          </View>
        </View>
        <FlatList
          data={selectedContact?.phoneNumbers}
          style={{ backgroundColor: '#fff' }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.phoneContactTile}
              onPress={() => (createPermission ? this.callNumber(item.number) : null)}
            >
              <View style={{ width: '85%' }}>
                <Text style={{ fontFamily: AppStyles.fonts.lightFont }}>Phone Number</Text>
                <Text style={[styles.textFont]}>{item.number}</Text>
              </View>
              {createPermission ? (
                <TouchableOpacity style={{ width: '15%' }}>
                  <Ionicons
                    name="ios-call-outline"
                    size={24}
                    color={AppStyles.colors.primaryColor}
                  />
                </TouchableOpacity>
              ) : null}
            </TouchableOpacity>
          )}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  imageViewStyle: {
    paddingRight: 10,
    marginVertical: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginVertical: 15,
    marginHorizontal: widthPercentageToDP('2%'),
    alignItems: 'center',
  },
  textFont: {
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 14,
  },
  phoneContactTile: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 10,
    marginHorizontal: 15,
    alignItems: 'center',
  },
})

mapStateToProps = (store) => {
  return {
    contacts: store.contacts.contacts,
    selectedContact: store.armsContacts.selectedContact,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(PhoneContactDetail)
