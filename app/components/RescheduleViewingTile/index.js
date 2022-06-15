/** @format */

import React, { useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  Platform,
  TextInput,
} from 'react-native'
import helper from '../../helper.js'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { formatPrice } from '../../PriceFormate'
import AppStyles from '../../AppStyles'
import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons'
import moment from 'moment'
import _, { filter } from 'underscore'
import { useDispatch } from 'react-redux'
import { setConnectFeedback } from '../../actions/diary.js'
import MyCheckBox from '../MyCheckBox/index.js'

const RescheduleViewingTile = ({
  data,
  user,
  goToTimeSlots,
  contacts,
  showCheckboxes = false,
  toggleCheckBox,
  selectedDiary,
  connectFeedback,
  fromScreen,
  mode,
}) => {
  const dispatch = useDispatch()
  let selectedProperties = []
  const checkImages = () => {
    let imagesList = []
    if (data.arms_id) {
      if (data.images.length > 0) {
        imagesList = data.images.map((item) => {
          return item.url
        })
      }
    } else {
      if (data.property_images.length > 0) {
        imagesList = data.property_images.map((item) => {
          return item.url
        })
      }
    }
    return imagesList
  }

  const displayName = (data) => {
    if (data.armsuser) {
      return data.armsuser.firstName + ' ' + data.armsuser.lastName
    } else if (data.user) {
      return data.user.first_name + ' ' + data.user.last_name
    } else {
      return '- - -'
    }
  }

  const displayPhoneNumber = (data) => {
    if (data.armsuser) {
      return data.armsuser.phoneNumber
    } else if (data.user) {
      return data.user.phone
    } else {
      return null
    }
  }

  const call = (item) => {
    let name = displayName(item)
    let newContact = {
      phone: displayPhoneNumber(item),
      name: name !== '- - -' ? name : '',
      url: `tel:${displayPhoneNumber(item)}`,
      payload: [
        {
          label: 'mobile',
          number: displayPhoneNumber(item),
        },
      ],
    }
    helper.callNumber(newContact, contacts)
  }

  const checkStatus = (property) => {
    // const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(user, lead)
    let diaries = property.diaries
    let diary = _.find(diaries, (item) => user.id === item.userId && item.status === 'pending')
    return (
      <View>
        {diary && diary.status === 'pending' ? (
          <TouchableOpacity
            style={styles.viewingAtBtn}
            onPress={() => {
              mode === 'cancelViewing' || fromScreen === 'DiaryFeedback'
                ? null
                : goToTimeSlots(diary)
            }}
          >
            <Text style={styles.viewingAtText2}>
              Viewing at{' '}
              <Text style={styles.viewingAtText1}>{moment(diary.start).format('LLL')}</Text>
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    )
  }
  let imagesList = checkImages()
  return (
    <View>
      <TouchableOpacity style={[{ flexDirection: 'row', marginVertical: 2 }]}>
        <View style={[styles.tileContainer]}>
          <View style={[styles.pad5]}>
            {imagesList.length > 0 ? (
              <Image source={{ uri: imagesList[0] }} style={styles.noImage} />
            ) : (
              <Image
                source={require('../../../assets/images/no-image-found.png')}
                style={styles.noImage}
              />
            )}
          </View>
          <View
            style={[
              AppStyles.mb1,
              styles.pad5,
              { paddingBottom: 2, justifyContent: 'space-between' },
            ]}
          >
            <View style={[styles.textPadTop]}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Text style={[styles.priceText]}>
                  {' '}
                  {data && data.price === 0 ? '0' : formatPrice(data && data.price && data.price)}
                </Text>
                {showCheckboxes ? (
                  <View style={{ width: '5%' }}>
                    <MyCheckBox
                      disabled={
                        selectedDiary && selectedDiary.propertyId
                          ? data.id == selectedDiary.propertyId
                          : false
                      }
                      onPress={() => {
                        toggleCheckBox(!data.checkBox, data.id)
                        if (data.checkBox) {
                          if (mode === 'cancelViewing') {
                            dispatch(
                              setConnectFeedback({
                                ...connectFeedback,
                                otherTasksToUpdate: [
                                  ...connectFeedback.otherTasksToUpdate,
                                  {
                                    comments: connectFeedback.comments,
                                    response: connectFeedback.comments,
                                    feedbackId: connectFeedback.feedbackId,
                                    status: 'cancelled',
                                    feedbackTag: connectFeedback.tag,
                                    id: _.find(
                                      data.diaries,
                                      (item) => user.id === item.userId && item.status === 'pending'
                                    ).id,
                                  },
                                ],
                              })
                            )
                          } else {
                            // done viewing
                            dispatch(
                              setConnectFeedback({
                                ...connectFeedback,
                                otherTasksToUpdate: [
                                  ...connectFeedback.otherTasksToUpdate,
                                  {
                                    comments: connectFeedback.comments,
                                    response: connectFeedback.comments,
                                    feedbackId: connectFeedback.feedbackId,
                                    feedbackTag: connectFeedback.tag,
                                    status: 'completed',
                                    feedbackTag: connectFeedback.tag,
                                    id: _.find(
                                      data.diaries,
                                      (item) => user.id === item.userId && item.status === 'pending'
                                    ).id,
                                  },
                                ],
                              })
                            )
                          }
                        } else {
                          if (mode === 'cancelViewing') {
                            let copyArray = [...connectFeedback.otherTasksToUpdate]
                            copyArray = _.filter(
                              copyArray,
                              (item) =>
                                item.id !==
                                _.find(
                                  data.diaries,
                                  (item) => user.id === item.userId && item.status === 'pending'
                                ).id
                            )
                            dispatch(
                              setConnectFeedback({
                                ...connectFeedback,
                                otherTasksToUpdate: copyArray,
                              })
                            )
                          } else {
                            // viewing done case
                            let copyArray = [...connectFeedback.otherTasksToUpdate]
                            copyArray = _.filter(
                              copyArray,
                              (item) =>
                                item.id !==
                                _.find(
                                  data.diaries,
                                  (item) => user.id === item.userId && item.status === 'pending'
                                ).id
                            )
                            dispatch(
                              setConnectFeedback({
                                ...connectFeedback,
                                otherTasksToUpdate: copyArray,
                              })
                            )
                          }
                        }
                      }}
                      status={data.checkBox}
                    />
                  </View>
                ) : null}
              </View>

              <Text numberOfLines={1} style={[styles.marlaText]}>
                {' '}
                {data.size} {data.size_unit} {data.subtype && helper.capitalize(data.subtype)} For{' '}
                {data.purpose && helper.capitalize(data.purpose)}{' '}
              </Text>
              <Text numberOfLines={1} style={[styles.addressText]}>
                {' '}
                {data.area ? data.area.name : null}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <View style={[styles.iconInner, { paddingBottom: 0 }]}>
                {data.bed && Number(data.bed) > 0 ? <Ionicons name="ios-bed" size={25} /> : null}
                <Text style={[{ fontSize: 18 }]}> {data.bed} </Text>
              </View>
              <View style={[styles.iconInner, { paddingBottom: 0 }]}>
                {data.bath && Number(data.bath) > 0 ? <FontAwesome name="bath" size={22} /> : null}
                <Text style={[{ fontSize: 18 }]}> {data.bath} </Text>
              </View>
            </View>
          </View>
          <TouchableHighlight
            onPress={() => call(data)}
            style={styles.phoneView}
            underlayColor={AppStyles.colors.backgroundColor}
          >
            <Image source={require('../../../assets/img/call.png')} style={[styles.callImage]} />
          </TouchableHighlight>
        </View>
      </TouchableOpacity>
      <View>{checkStatus(data)}</View>
      {data.checkBox && mode !== 'cancelViewing' ? (
        <View style={[AppStyles.mainInputWrap]}>
          <TextInput
            placeholderTextColor={'#a8a8aa'}
            style={[
              AppStyles.formControl,
              Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
              AppStyles.formFontSettings,
              styles.commentContainer,
            ]}
            multiline
            //autoFocus
            placeholder={'Comments'}
            onChangeText={(text) => {
              if (selectedDiary.propertyId !== data.id) {
                let diaryId = _.find(
                  data.diaries,
                  (item) => user.id === item.userId && item.status === 'pending'
                ).id
                let copyArray = [...connectFeedback.otherTasksToUpdate]
                let objToFind = copyArray.find((item) => item.id === diaryId)
                objToFind.comments = text === '' ? connectFeedback.tag : text
                objToFind.response = text === '' ? connectFeedback.tag : text

                dispatch(
                  setConnectFeedback({
                    ...connectFeedback,
                    otherTasksToUpdate: [
                      ...connectFeedback.otherTasksToUpdate.filter((item) => item.id !== diaryId),
                      objToFind,
                    ],
                  })
                )
              } else {
                dispatch(
                  setConnectFeedback({
                    ...connectFeedback,
                    comments: text === '' ? connectFeedback.tag : text,
                  })
                )
              }
            }}
          />
        </View>
      ) : null}
    </View>
  )
}

export default RescheduleViewingTile

const styles = StyleSheet.create({
  noImage: {
    width: 130,
    height: 140,
    borderRadius: 5,
  },
  callImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  tileContainer: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    height: 150,
    flexDirection: 'row',
  },
  pad5: {
    padding: 5,
  },
  currencyText: {
    paddingTop: 5,
    fontSize: 15,
    fontFamily: AppStyles.fonts.lightFont,
  },
  priceText: {
    fontSize: 22,
    fontFamily: AppStyles.fonts.semiBoldFont,
    color: AppStyles.colors.primaryColor,
    width: '99%',
  },
  marlaText: {
    fontSize: 17,
    paddingTop: 2,
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.textColor,
  },
  addressText: {
    fontSize: 17,
    paddingTop: 5,
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.textColor,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  textStyle: {
    fontSize: 12,
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.primaryColor,
  },
  mainView: {
    borderColor: AppStyles.colors.primaryColor,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInner: {
    flexDirection: 'row',
    padding: 5,
  },
  phoneIcon: {
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingBottom: 0,
  },
  imageCountViewStyle: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    top: 10,
    left: 10,
    opacity: 0.7,
  },
  imageCount: {
    color: 'white',
    paddingLeft: wp('1%'),
  },
  menuView: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  phoneView: {
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    marginRight: 5,
    alignSelf: 'flex-end',
  },
  checkBox: {
    width: 22,
    height: 22,
    alignItems: 'center',
  },
  textPadTop: {
    paddingTop: 5,
  },
  viewingBtn: {
    backgroundColor: AppStyles.colors.primaryColor,
    height: 50,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewingAtBtn: {
    backgroundColor: 'white',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewingText: {
    color: 'white',
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 18,
  },
  viewingAtText1: {
    color: AppStyles.colors.primaryColor,
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 18,
  },
  viewingAtText2: { fontFamily: AppStyles.fonts.lightFont, fontSize: 18 },
  viewingDoneBtn: {
    backgroundColor: AppStyles.colors.primaryColor,
    height: 50,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  commentContainer: {
    height: 100,
    paddingTop: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: AppStyles.colors.subTextColor,
    color: AppStyles.colors.textColor,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    borderRadius: 4,
    fontFamily: 'OpenSans_regular',
  },
  viewDoneText: { color: 'white', fontFamily: AppStyles.fonts.defaultFont, fontSize: 18 },
})
