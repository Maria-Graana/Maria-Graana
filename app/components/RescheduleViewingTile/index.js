/** @format */

import React, { useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import helper from '../../helper.js'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { formatPrice } from '../../PriceFormate'
import AppStyles from '../../AppStyles'
import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons'
import moment from 'moment'
import _ from 'underscore'

const RescheduleViewingTile = ({ data, user, goToTimeSlots }) => {
  console.log(data)
  let imagesList = []
  const checkImages = () => {
    if (data.origin) {
      if (data.origin === 'arms') {
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
    } else {
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
    }
    return imagesList
  }
  useEffect(() => {
    checkImages()
  }, [imagesList])

  const checkStatus = (property) => {
    // const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(user, lead)
    if (helper.checkMyDiary(property, user)) {
      let diaries = property.diaries
      let diary = _.find(diaries, (item) => user.id === item.userId && item.status === 'pending')
      return (
        <View>
          {diary && diary.status === 'pending' ? (
            <TouchableOpacity
              style={styles.viewingAtBtn}
              onPress={() => {
                goToTimeSlots(diary)
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
  }

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
            <View style={styles.textPadTop}>
              <Text style={[styles.priceText]}>
                {' '}
                {data && data.price === 0 ? '0' : formatPrice(data && data.price && data.price)}
              </Text>
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
        </View>
      </TouchableOpacity>
      <View>{checkStatus(data)}</View>
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
    marginRight: 7,
  },
  notCheckBox: {
    width: 25,
    height: 25,
    borderColor: AppStyles.colors.primaryColor,
    backgroundColor: '#fff',
  },
  checkBox: {
    width: 25,
    height: 25,
    borderColor: '#fff',
    backgroundColor: '#fff',
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
  viewDoneText: { color: 'white', fontFamily: AppStyles.fonts.defaultFont, fontSize: 18 },
})
