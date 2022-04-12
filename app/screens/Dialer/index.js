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
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import { getPermissionValue } from '../../hoc/Permissions'
import PhonebookContactsTile from '../../components/PhonebookContactsTile'
import { setContacts } from '../../actions/contacts'

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
      isPhoneContactExpanded: false,
      allContacts: [],
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    const { contacts } = this.props
    if (contacts) {
      let newContactsArr = contacts.map((item) => {
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
    } else {
      this.props.dispatch(setContacts())
    }
  }

  onPhoneContactPress = (data) => {
    const { navigation, dispatch } = this.props
    const { isPhoneContactExpanded } = this.state
    dispatch(setSelectedContact(data), false).then((res) => {
      this.setState({ isPhoneContactExpanded: !isPhoneContactExpanded })
    })
  }

  callNumber = () => {
    const { numberTxt } = this.state
    const { dispatch, navigation, selectedContact } = this.props
    let body = {}
    let newArr = []
    if (numberTxt !== '') {
      if (selectedContact) {
        body = Object.assign({ ...selectedContact, phone: numberTxt })
      } else {
        newArr.push({
          number: numberTxt,
          countryCode: 'PK',
          callingCode: '+92',
        }),
          (body = {
            phone: numberTxt,
            phoneNumbers: newArr,
            firstName: '',
            lastName: '',
            id: null,
          })
      }
      dispatch(setSelectedContact(body, true)).then((res) => {
        navigation.navigate('ContactFeedback')
      })
    } else {
      alert('Please enter a valid number')
    }
  }

  FirstRoute = () => {
    const { numberTxt, allContacts, isPhoneContactExpanded } = this.state
    const { contacts } = this.props
    let data = []
    data = allContacts.filter((item) => {
      if (numberTxt !== '' && numberTxt.length >= 3) {
        for (let i = 0; i < item.phoneNumbers.length; i++) {
          if (
            item.phoneNumbers[i].number
              .replace(/[() .+-]/g, '')
              .match(numberTxt.replace(/[() .+-]/g, ''))
          ) {
            return item
          }
        }
      }
    })
    return (
      <View style={AppStyles.containerWithoutPadding}>
        <ScrollView style={{ height: heightPercentageToDP('45%') }}>
          {data &&
            data.map((item) => (
              <PhonebookContactsTile
                key={item.id.toString()}
                data={item}
                onPress={(data) => this.onPhoneContactPress(data)}
                isPhoneContactExpanded={isPhoneContactExpanded}
                showCallIcon={false}
                callNumber={(number) =>
                  this.setState({ numberTxt: number.replace(/[() .+-]/g, '') })
                }
              />
            ))}
        </ScrollView>
        <View style={styles.underLine} />
        <View
          style={{
            paddingVertical: 10,
            height: '55%',
          }}
        >
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
    const { searchText, isPhoneContactExpanded } = this.state
    const { contacts, permissions } = this.props
    let data = []
    if (searchText !== '' && data && data.length === 0) {
      data = fuzzy.filter(searchText, contacts, {
        extract: (e) => (e.firstName ? e.firstName + ' ' + e.lastName : ''),
      })
      data = data.map((item) => item.original)
    } else {
      data = contacts
    }

    let createPermission = getPermissionValue(
      PermissionFeatures.CONTACTS,
      PermissionActions.CreateUpdateContact,
      permissions
    )
    return (
      <View style={AppStyles.containerWithoutPadding}>
        <Search
          placeholder={'Search Phonebook'}
          searchText={searchText}
          setSearchText={(text) => this.setState({ searchText: text })}
        />
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <PhoneBookContactsTile
              data={item}
              onPress={(data) => this.onPhoneContactPress(data)}
              isPhoneContactExpanded={isPhoneContactExpanded}
              createPermission={createPermission}
              callNumber={(number) =>
                this.setState({ numberTxt: number }, () => {
                  this.callNumber()
                })
              }
            />
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
        borderTopWidth: 0.5,
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
    const { navigation } = this.props

    return (
      <View style={{ flex: 1 }}>
        {index === 0 ? (
          <TouchableOpacity style={styles.callButton} onPress={() => this.callNumber()}>
            <Image source={require(`../../../assets/img/dialer_call.png`)} />
          </TouchableOpacity>
        ) : null}

        <TabView
          renderTabBar={this.renderTabBar}
          navigationState={{ index, routes }}
          renderScene={this.renderScene}
          onIndexChange={(value) => {
            navigation.setOptions({ title: value === 0 ? 'Dialer' : 'Phonebook' })
            this.setState({ index: value })
          }}
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
    fontSize: 26,
    textAlign: 'center',
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
  }
}

export default connect(mapStateToProps)(Dialer)
