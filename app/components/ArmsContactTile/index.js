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
              <Text style={[styles.textFont, { fontSize: 16, width: ' 50%' }]}>{getName()}</Text>
              {armsCallLatest ? (
                <Text
                  style={{
                    width: '45%',
                    fontSize: 13,
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

            {isExpanded && data.id === selectedContact.id && selectedContact.phone ? (
              <View style={styles.expandedListItem}>
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  data={selectedContact.phoneNumbers}
                  style={{ backgroundColor: '#fff' }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.phoneContactTile}
                      onPress={() => callNumber(item.phone)}
                    >
                      <View style={{ width: '82%' }}>
                        <Text style={[styles.textFont]}>{item.phoneWithDialCode}</Text>
                      </View>
                      <TouchableOpacity style={{ width: '10%' }}>
                        <Ionicons
                          name="ios-call-outline"
                          size={24}
                          color={AppStyles.colors.primaryColor}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )}
                />
                <TouchableButton
                  label="Register as Client"
                  containerStyle={styles.button}
                  fontSize={14}
                  onPress={() => registerAsClient(data)}
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
    padding: 10,
    borderRadius: 4,
    width: '50%',
    height: 50,
    justifyContent: 'center',
    // alignSelf: 'center',
    marginVertical: 5,
    // marginHorizontal: widthPercentageToDP('2%'),
  },
  phoneContactTile: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 5,
    alignItems: 'center',
  },
})
