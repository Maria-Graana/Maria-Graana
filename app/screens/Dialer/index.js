/** @format */

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Keyboard,
} from 'react-native'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getARMSContacts } from '../../actions/armsContacts'
import _ from 'underscore'
import ArmsContactTile from '../../components/ArmsContactTile'
import AppStyles from '../../AppStyles'

class Dialer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allContacts: [],
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

  onContactPress = (item) => {
    console.log('item =>', item)
  }

  showKeyboard = () => {}

  render() {
    const { allContacts } = this.state
    const { navigation } = this.props
    return (
      <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
        {/* <FlatList
          data={allContacts}
          renderItem={({ item }) => (
            <ArmsContactTile data={item} onPress={(data) => this.onContactPress(data)} />
          )}
          keyExtractor={(item) => item.id.toString()}
        /> */}
        <View style={styles.bottomTab}>
          <TouchableOpacity style={styles.bottomTabViews} onPress={() => this.showKeyboard()}>
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
    height: 70,
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
})

mapStateToProps = (store) => {
  return {
    contacts: store.contacts.contacts,
    armsContacts: store.armsContacts.armsContacts,
  }
}

export default connect(mapStateToProps)(Dialer)
