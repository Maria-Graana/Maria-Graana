/** @format */

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getARMSContacts, setSelectedContact } from '../../actions/armsContacts'
import _ from 'underscore'
import ArmsContactTile from '../../components/ArmsContactTile'
import AppStyles from '../../AppStyles'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import fuzzy from 'fuzzy'
import VirtualKeyboard from 'react-native-virtual-keyboard'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import PhoneBookContactsTile from '../../components/PhonebookContactsTile'
import Search from '../../components/Search'

const layout = Dimensions.get('window')

class Dialer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      numberTxt: '',
      index: 0,
      routes: [
        { key: 'first', title: 'Keypad' },
        { key: 'second', title: 'Phonebook' },
      ],
      searchText: '',
    }
  }

  onPhoneContactPress = (data) => {
    const { navigation, dispatch } = this.props
    dispatch(setSelectedContact(data), false).then((res) => {
      navigation.navigate('PhoneContactDetail')
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
      // console.log('body=>', body)
      dispatch(setSelectedContact(body, true)).then((res) => {
        navigation.replace('ContactFeedback')
      })
    } else {
      alert('Please enter a valid number')
    }
  }

  FirstRoute = () => {
    const { numberTxt } = this.state
    const { armsContacts } = this.props
    let data = []
    if (numberTxt !== '' && data && data.length === 0) {
      data = fuzzy.filter(numberTxt, armsContacts.rows, {
        extract: (e) => (e.phone ? e.phone : ''),
      })
      data = data.map((item) => item.original)
    }
    return (
      <View style={AppStyles.containerWithoutPadding}>
        <ScrollView
          style={{ minHeight: heightPercentageToDP('20%'), maxHeight: heightPercentageToDP('40%') }}
        >
          {data &&
            data.map((item) => (
              <ArmsContactTile
                key={item.id.toString()}
                data={item}
                onPress={(data) => this.onContactPress(data)}
                showCallButton={false}
              />
            ))}
        </ScrollView>
        <View style={styles.underLine} />
        <View style={{ paddingVertical: 10 }}>
          <Text style={styles.inputStyle}>{this.state.numberTxt}</Text>
          <VirtualKeyboard
            color="black"
            pressMode="string"
            onPress={(val) => this.setState({ numberTxt: val })}
          />
        </View>
      </View>
    )
  }

  SecondRoute = () => {
    const { searchText } = this.state
    const { contacts } = this.props
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
      <View style={AppStyles.containerWithoutPadding}>
        <Search
          placeholder={'Search Contacts'}
          searchText={searchText}
          setSearchText={(text) => this.setState({ searchText: text })}
        />
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <PhoneBookContactsTile data={item} onPress={(data) => this.onPhoneContactPress(data)} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    )
  }

  renderScene = SceneMap({
    first: this.FirstRoute,
    second: this.SecondRoute,
  })

  renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'white' }}
      tabStyle={{
        backgroundColor: 'white',
        borderTopColor: AppStyles.colors.subTextColor,
        borderTopWidth: 0.2,
      }}
      renderLabel={({ route, focused, color }) => (
        <Text
          style={{
            color: focused ? AppStyles.colors.primaryColor : AppStyles.colors.textColor,
            fontFamily: AppStyles.fonts.defaultFont,
            fontSize: 12,
            margin: 5,
          }}
        >
          {route.title}
        </Text>
      )}
      renderIcon={({ route, focused, color }) =>
        route.key === 'first' ? (
          <Image
            source={
              focused
                ? require(`../../../assets/img/dial_pad_blue.png`)
                : require(`../../../assets/img/dial_pad.png`)
            }
          />
        ) : (
          <Image
            source={
              focused
                ? require(`../../../assets/img/phonebook_blue.png`)
                : require(`../../../assets/img/phonebook.png`)
            }
          />
        )
      }
    />
  )

  render() {
    const { index, routes } = this.state
    const { navigation, dispatch, permissions } = this.props

    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.callButton} onPress={() => this.callNumber()}>
          <Image source={require(`../../../assets/img/dialer_call.png`)} />
        </TouchableOpacity>
        <TabView
          renderTabBar={this.renderTabBar}
          navigationState={{ index, routes }}
          renderScene={this.renderScene}
          onIndexChange={(value) => this.setState({ index: value })}
          initialLayout={{ width: layout.width }}
          tabBarPosition={'bottom'}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputStyle: {
    color: AppStyles.colors.primaryColor,
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: AppStyles.fontSize.large,
    textAlign: 'center',
    marginVertical: 10,
    letterSpacing: 0.5,
  },
  callButton: {
    zIndex: 10,
    elevation: 10,
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  underLine: {
    height: 0.2,
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
