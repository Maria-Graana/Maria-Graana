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

export class Contacts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
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

  render() {
    const { searchText } = this.state
    const { armsContacts, armsContactsLoading, dispatch, navigation } = this.props
    return (
      <View style={AppStyles.containerWithoutPadding}>
        {armsContactsLoading ? (
          <Loader loading={armsContactsLoading} />
        ) : (
          <>
            <TouchableOpacity style={styles.keypadButton} onPress={() => this.goToDialer()}>
              <Image source={require(`../../../assets/img/keypad.png`)} />
            </TouchableOpacity>

            <Search
              placeholder={'Search Contacts'}
              searchText={searchText}
              setSearchText={(text) => this.setState({ searchText: text })}
            />
            <FlatList
              data={armsContacts.rows}
              renderItem={({ item }) => (
                <ArmsContactTile
                  data={item}
                  onPress={(contact) =>
                    dispatch(setSelectedContact(contact)).then((res) => {
                      navigation.navigate('ContactFeedback')
                    })
                  }
                />
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  keypadButton: {
    position: 'absolute',
    bottom: 15,
    zIndex: 15,
    right: widthPercentageToDP(60),
    left: widthPercentageToDP(40),
  },
})

mapStateToProps = (store) => {
  return {
    armsContacts: store.armsContacts.armsContacts,
    armsContactsLoading: store.armsContacts.armsContactsLoading,
  }
}

export default connect(mapStateToProps)(Contacts)
