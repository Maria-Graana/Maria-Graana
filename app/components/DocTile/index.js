/** @format */

import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import AppStyles from '../../AppStyles'
import moment from 'moment'

class DocTile extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {
      title,
      uploadDocument,
      category,
      legalAgreement,
      legalCheckList,
      downloadLegalDocs,
      agreementDoc,
      checkListDoc,
      deleteDoc,
      activityBool,
    } = this.props
    let data = null
    let file = null
    if (category === 'agreement') {
      file = agreementDoc
      data = legalAgreement
    }
    if (category === 'checklist') {
      data = legalCheckList
      file = checkListDoc
    }

    return (
      <TouchableOpacity
        disabled={false}
        onPress={() => {
          if (data && data.uploaded) {
            downloadLegalDocs(data)
          } else uploadDocument(category)
        }}
        activeOpacity={0.7}
        style={{
          marginVertical: 10,
          flexDirection: 'row',
          height: 60,
          borderRadius: 5,
          backgroundColor: '#fff',
          flex: 1,
          paddingHorizontal: 10,
          justifyContent: 'space-between',
        }}
      >
        {data ? (
          <View style={styles.firstView}>
            <Text
              style={[styles.pendingText, { color: AppStyles.colors.textColor }]}
              numberOfLines={2}
            >
              {title}
            </Text>
            <Text style={styles.firstText} numberOfLines={1}>
              {data && data.fileName}
            </Text>
          </View>
        ) : (
          <View style={styles.titleView}>
            <Text style={styles.pendingText} numberOfLines={2}>
              Upload {title}
            </Text>
          </View>
        )}
        {!data ? (
          <TouchableOpacity disabled={false} onPress={() => {}} style={styles.secView}>
            <MaterialCommunityIcons
              onPress={() => {
                uploadDocument(category)
              }}
              name="file-upload-outline"
              size={30}
              color={AppStyles.colors.primaryColor}
            />
          </TouchableOpacity>
        ) : null}
        {data ? (
          <View style={styles.activityView}>
            <AntDesign
              name="close"
              size={25}
              color={AppStyles.colors.subTextColor}
              style={{ alignSelf: 'flex-end', marginRight: 10 }}
              onPress={() => {
                deleteDoc(data)
              }}
            />
            <Text style={[styles.dateTimeStyle, { textAlign: 'right', marginRight: 10 }]}>
              {moment(data && data.createdAt).format('hh:mm A, MMM DD')}
            </Text>
          </View>
        ) : null}
        {false ? <ActivityIndicator size={'large'} color={AppStyles.colors.primaryColor} /> : null}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  titleView: {
    justifyContent: 'space-evenly',
    flex: 0.8,
  },
  firstView: {
    justifyContent: 'space-evenly',
    flex: 0.6,
  },
  firstText: {
    letterSpacing: 1,
    fontFamily: AppStyles.fonts.semiBoldFont,
    color: AppStyles.colors.primaryColor,
  },
  pendingText: {
    letterSpacing: 1,
    fontFamily: AppStyles.fonts.semiBoldFont,
    color: AppStyles.colors.subTextColor,
  },
  secView: {
    justifyContent: 'center',
    borderColor: AppStyles.colors.subTextColor,
  },
  activityView: {
    flex: 0.4,
    justifyContent: 'space-evenly',
  },
})

export default DocTile
