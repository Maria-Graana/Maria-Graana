/** @format */

import { Text, View, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import Search from '../../components/Search'
import AppStyles from '../../AppStyles'
import ArmsContactTile from '../../components/ArmsContactTile'
import Loader from '../../components/loader'
import { connect } from 'react-redux'
import { getARMSContacts, setSelectedContact } from '../../actions/armsContacts'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import fuzzy from 'fuzzy'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'

export class Contacts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      isExpanded: false,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getARMSContacts())
  }

  goToDialer = () => {
    const { navigation } = this.props
    navigation.navigate('Dialer')
  }

  onContactPress = (contact) => {
    const { dispatch, navigation } = this.props
    const { isExpanded } = this.state
    dispatch(setSelectedContact(contact)).then((res) => {
      this.setState({ numberTxt: contact.phone, isExpanded: !isExpanded })
    })
  }

  render() {
    const { searchText, isExpanded } = this.state
    const { armsContacts, armsContactsLoading, permissions } = this.props
    let data = []
    if (searchText !== '' && data && data.length === 0) {
      data = fuzzy.filter(searchText, armsContacts.rows, {
        extract: (e) => (e.firstName ? e.firstName + ' ' + e.lastName : ''),
      })
      data = data.map((item) => item.original)
    } else {
      data = armsContacts.rows
    }

    let createPermission = getPermissionValue(
      PermissionFeatures.CONTACTS,
      PermissionActions.CREATE,
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
              renderItem={({ item }) => (
                <ArmsContactTile
                  data={item}
                  onPress={(contact) => this.onContactPress(contact)}
                  isExpanded={isExpanded}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
            />
            {createPermission ? (
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
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
})

mapStateToProps = (store) => {
  return {
    armsContacts: store.armsContacts.armsContacts,
    armsContactsLoading: store.armsContacts.armsContactsLoading,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(Contacts)
