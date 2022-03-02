/** @format */

import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { Component } from 'react'
import Search from '../../components/Search'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux'
import PhoneBookContactsTile from '../../components/PhonebookContactsTile'
import fuzzy from 'fuzzy'
import { setSelectedContact } from '../../actions/armsContacts'

class PhoneContacts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
    }
  }
  onContactPress = (data) => {
    const { navigation, dispatch } = this.props
    dispatch(setSelectedContact(data), false).then((res) => {
      navigation.navigate('PhoneContactDetail')
    })
  }
  render() {
    const { contacts } = this.props
    const { searchText } = this.state
    let data = []
    if (searchText !== '' && data && data.length === 0) {
      data = fuzzy.filter(searchText, contacts, {
        extract: (e) => (e.firstName ? e.firstName + ' ' + e.lastName : ''),
      })
      data = data.map((item) => item.original)
    } else {
      data = contacts
    }
    return (
      <View>
        <Search
          placeholder={'Search Contacts'}
          searchText={searchText}
          setSearchText={(text) => this.setState({ searchText: text })}
        />
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <PhoneBookContactsTile data={item} onPress={(data) => this.onContactPress(data)} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({})

mapStateToProps = (store) => {
  return {
    contacts: store.contacts.contacts,
  }
}

export default connect(mapStateToProps)(PhoneContacts)
