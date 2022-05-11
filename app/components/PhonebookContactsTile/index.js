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
  showCallIcon = true,
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
            <Text style={[styles.textFont, { fontSize: 16, paddingVertical: 5 }]}>
              {data?.name}
            </Text>
            {isPhoneContactExpanded && selectedContact && data.id === selectedContact.id ? (
              <View style={styles.expandedListItem}>
                <FlatList
                  data={selectedContact?.phoneNumbers}
                  style={{ backgroundColor: '#fff' }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.phoneContactTile}
                      onPress={() => callNumber(item.number)}
                    >
                      <View style={{ width: '75%' }}>
                        <Text style={[styles.textFont]}>{item.number}</Text>
                      </View>
                      {showCallIcon ? (
                        <TouchableOpacity
                          style={{ width: '20%' }}
                          onPress={() => callNumber(item.number)}
                        >
                          <Ionicons
                            name="ios-call-outline"
                            size={24}
                            style={{ alignSelf: 'flex-start' }}
                            color={AppStyles.colors.primaryColor}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </TouchableOpacity>
                  )}
                />
              </View>
            ) : null}
          </View>
        </View>
      </View>

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
  },
  imageViewStyle: {
    paddingRight: 10,
  },
  textFont: {
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 14,
  },
  underLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#f5f5f6',
  },
  expandedListItem: {
    width: '100%',
  },
  phoneContactTile: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
})
