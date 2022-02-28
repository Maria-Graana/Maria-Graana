/** @format */

import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import Avatar from '../../components/Avatar'
import AppStyles from '../../AppStyles'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { Ionicons } from '@expo/vector-icons'

export class PhoneContactDetail extends Component {
  componentDidMount() {
    const { route, navigation } = this.props
    const { selectedContact } = route?.params
    navigation.setOptions({ title: selectedContact?.name })
  }

  render() {
    const { route, navigation } = this.props
    const { selectedContact } = route?.params
    return (
      <View
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
                {selectedContact?.name}
              </Text>
            </View>
          </View>
        </View>
        <FlatList
          data={selectedContact?.phoneNumbers}
          style={{ backgroundColor: '#fff' }}
          renderItem={({ item }) => (
            <View style={styles.phoneContactTile}>
              <View style={{ width: '85%' }}>
                <Text style={{ fontFamily: AppStyles.fonts.lightFont }}>Phone Number</Text>
                <Text style={[styles.textFont]}>{item.number}</Text>
              </View>
              <TouchableOpacity style={{ width: '15%' }} onPress={() => console.log('call')}>
                <Ionicons name="ios-call-outline" size={24} color={AppStyles.colors.primaryColor} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
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

export default PhoneContactDetail
