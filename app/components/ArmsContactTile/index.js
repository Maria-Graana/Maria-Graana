/** @format */

import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import Avatar from '../Avatar'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import AppStyles from '../../AppStyles'
import { Ionicons } from '@expo/vector-icons'
import _ from 'underscore'
import DiaryHelper from '../../screens/Diary/diaryHelper'
import moment from 'moment'
import TouchableButton from '../TouchableButton'
import { connect } from 'react-redux'

const ArmsContactTile = ({
  data,
  onPress,
  callNumber,
  isExpanded = false,
  selectedContact,
  registerAsClient,
  updatePermission,
}) => {
  const getName = () => {
    const { firstName, lastName } = data
    if (firstName && lastName && firstName !== '' && lastName !== '') {
      return firstName + ' ' + lastName
    } else if (firstName && firstName !== '') {
      return firstName
    }
  }

  let sortedArray = _.sortBy(data ? data.armsContactCalls : [], 'time')
  let armsCallLatest = sortedArray && sortedArray.length > 0 ? _.last(sortedArray) : null

  return (
    <TouchableOpacity
      style={{ backgroundColor: AppStyles.whiteColor }}
      activeOpacity={0.7}
      onPress={() => {
        onPress(data)
      }}
    >
      <View style={styles.listItem}>
        <View style={{ width: '85%', flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.imageViewStyle}>
            <Avatar data={data} />
          </View>
          <View
            style={{
              flexDirection: 'column',
              // justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
              <Text style={[styles.textFont, { fontSize: 16, width: ' 50%' }]} numberOfLines={1}>
                {getName()}
              </Text>
              {armsCallLatest ? (
                <Text
                  style={{
                    width: '45%',
                    fontSize: 12,
                    marginRight: 10,
                    color:
                      armsCallLatest.feedback === 'needs_further_contact'
                        ? AppStyles.colors.primaryColor
                        : AppStyles.colors.redBg,
                    textAlign: 'right',
                  }}
                >
                  {DiaryHelper.removeUnderscore(armsCallLatest.feedback)}
                </Text>
              ) : null}
            </View>

            {armsCallLatest ? (
              <View
                style={{
                  alignItems: 'flex-end',
                  marginRight: 10,
                  width: '45%',
                  alignSelf: 'flex-end',
                }}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.textFont, { fontSize: 12, color: AppStyles.colors.subTextColor }]}
                >
                  {armsCallLatest ? moment(armsCallLatest.time).format('DD MMM hh:mm a') : null}{' '}
                </Text>
              </View>
            ) : null}

            {isExpanded &&
            selectedContact &&
            data.id === selectedContact.id &&
            selectedContact.phone ? (
              <View style={styles.expandedListItem}>
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  data={selectedContact.phoneNumbers}
                  style={{ backgroundColor: '#fff' }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.phoneContactTile}
                      onPress={() => callNumber(item.number)}
                      disabled={!updatePermission}
                    >
                      <View style={{ width: '80%' }}>
                        <Text style={[styles.textFont]}>{item.number}</Text>
                      </View>
                      {updatePermission ? (
                        <TouchableOpacity
                          style={{ width: '20%' }}
                          onPress={() => callNumber(item.number)}
                        >
                          <Ionicons
                            name="ios-call-outline"
                            style={{ alignSelf: 'flex-start' }}
                            size={24}
                            color={AppStyles.colors.primaryColor}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </TouchableOpacity>
                  )}
                />
                {updatePermission && (
                  <TouchableButton
                    label="Register as Client"
                    containerStyle={styles.button}
                    disabled={!updatePermission}
                    fontSize={12}
                    onPress={() => registerAsClient(data)}
                  />
                )}
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
  }
}

export default connect(mapStateToProps)(ArmsContactTile)

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    marginVertical: 15,
    marginHorizontal: widthPercentageToDP('2%'),
    alignItems: 'center',
    width: '100%',
  },
  expandedListItem: {
    marginVertical: 10,
    width: '100%',
  },
  imageViewStyle: {
    paddingRight: 10,
    alignSelf: 'flex-start',
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
  button: {
    padding: 5,
    borderRadius: 4,
    width: '45%',
    height: 35,
    justifyContent: 'center',
    // alignSelf: 'center',
    marginVertical: 5,
    // marginHorizontal: widthPercentageToDP('2%'),
  },
  phoneContactTile: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 5,
    paddingVertical: 5,
    alignItems: 'center',
  },
})
