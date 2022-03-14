/** @format */

import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import Avatar from '../Avatar'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'

const PhoneBookContactsTile = ({
  data,
  onPress,
  selectedContact,
  isPhoneContactExpanded,
  createPermission,
  callNumber,
}) => {
  return (
    <TouchableOpacity style={styles.mainView} activeOpacity={0.7} onPress={() => onPress(data)}>
      <View style={styles.listItem}>
        <View style={styles.imageViewStyle}>
          <Avatar data={data} />
        </View>
        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
          <View>
            <Text style={[styles.textFont, { fontSize: 15 }]}>{data?.name}</Text>
          </View>
        </View>
      </View>
      {isPhoneContactExpanded && data.id === selectedContact.id ? (
        <View style={styles.expandedListItem}>
          <FlatList
            data={selectedContact?.phoneNumbers}
            style={{ backgroundColor: '#fff' }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.phoneContactTile}
                onPress={() => callNumber(item.number)}
              >
                <View style={{ width: '85%' }}>
                  <Text style={[styles.textFont]}>{item.number}</Text>
                </View>
                <TouchableOpacity style={{ width: '15%' }}>
                  <Ionicons
                    name="ios-call-outline"
                    size={24}
                    color={AppStyles.colors.primaryColor}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : null}
      <View style={styles.underLine} />
    </TouchableOpacity>
  )
}

mapStateToProps = (store) => {
  return {
    selectedContact: store.armsContacts.selectedContact,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(PhoneBookContactsTile)

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#fff',
  },
  listItem: {
    flexDirection: 'row',
    marginVertical: 15,
    marginHorizontal: widthPercentageToDP('2%'),
    alignItems: 'center',
  },
  imageViewStyle: {
    paddingRight: 10,
  },
  textFont: {
    fontFamily: AppStyles.fonts.defaultFont,
  },
  underLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#f5f5f6',
  },
  expandedListItem: {
    marginVertical: 5,
    width: '100%',
  },
  phoneContactTile: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 10,
    marginHorizontal: 15,
    alignItems: 'center',
  },
})
