/** @format */

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import AppStyles from '../../AppStyles'
import styles from './styles'
import moment from 'moment'

const AttachmentTile = (props) => {
  const { data, deleteAttachment, viewAttachments, docType } = props
  return (
    <TouchableOpacity onPress={() => viewAttachments(data)} style={styles.mainContainer}>
      {/*   First Row    */}
      {docType ? (
        <View style={[styles.horizontalContainer, { paddingTop: 10 }]}>
          <Text style={[styles.headingStyle, { marginRight: 10, paddingVertical: 5 }]}>
            {docType.toUpperCase()}
          </Text>
          <TouchableOpacity
            style={{ flex: 0.1, alignItems: 'flex-end' }}
            onPress={() => deleteAttachment(data)}
            activeOpacity={0.7}
          >
            <AntDesign name="close" size={18} color={AppStyles.colors.subTextColor} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.horizontalContainer}>
          <Text style={[styles.headingStyle, { flex: 0.9, marginRight: 10, paddingTop: 10 }]}>
            {data && data.title.toUpperCase()}
          </Text>
          <TouchableOpacity
            style={{ flex: 0.1, alignItems: 'flex-end' }}
            onPress={() => deleteAttachment(data)}
            activeOpacity={0.7}
          >
            <AntDesign name="close" size={18} color={AppStyles.colors.subTextColor} />
          </TouchableOpacity>
        </View>
      )}

      {docType && (
        <Text style={[styles.headingStyle, styles.docText]}>
          {data && data.title.toUpperCase()}
        </Text>
      )}
      {/*   Second Row    */}

      <View style={styles.horizontalContainer}>
        <Text numberOfLines={1} style={[styles.subHeadingStyle, { flex: 1 }]}>
          {data && data.fileName}
        </Text>
        <Text style={[styles.dateTimeStyle, { textAlign: 'right', flex: 0.5 }]}>
          {moment(data && data.createdAt).format('hh:mm A, MMM DD')}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default AttachmentTile
