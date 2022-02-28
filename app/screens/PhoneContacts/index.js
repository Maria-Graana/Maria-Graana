/** @format */

import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { Component } from 'react'
import Search from '../../components/Search'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux'
import PhoneBookContactsTile from '../../components/PhonebookContactsTile'

class PhoneContacts extends Component {
  onContactPress = (data) => {
    const { navigation } = this.props
    navigation.navigate('PhoneContactDetail', { selectedContact: data })
  }
  render() {
    const { contacts } = this.props
    return (
      <View>
        <Search
          placeholder={'Search Contacts'}
          // searchText={searchText}
          // setSearchText={(text) => this.setState({ searchText: text })}
        />
        <FlatList
          data={contacts}
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
