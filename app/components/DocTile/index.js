/** @format */

import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import AppStyles from '../../AppStyles'

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
      uploadDocToServer,
      agreementDoc,
      checkListDoc,
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
      <View style={[styles.viewContainer]}>
        <TouchableOpacity
          disabled={false}
          onPress={() => {
            if (data && data.uploaded) {
              downloadLegalDocs(data)
            } else uploadDocument(category)
          }}
          activeOpacity={0.7}
        >
          <View style={[AppStyles.flexDirectionRow, AppStyles.bgcWhite]}>
            <View style={styles.firstView}>
              {data ? (
                <Text style={styles.firstText} numberOfLines={1}>
                  {data && data.fileName}
                </Text>
              ) : (
                <Text style={styles.pendingText} numberOfLines={2}>
                  Upload {title}
                </Text>
              )}
              {file && !data ? (
                <Text style={styles.firstText} numberOfLines={1}>
                  {file.name}
                </Text>
              ) : null}
            </View>
            {!data ? (
              <TouchableOpacity disabled={false} onPress={() => {}} style={styles.secView}>
                <AntDesign
                  onPress={() => {
                    uploadDocToServer(category)
                  }}
                  name="upload"
                  size={30}
                  color={AppStyles.colors.primaryColor}
                />
              </TouchableOpacity>
            ) : null}
            {data && !data.loading && data ? (
              <View style={styles.activityView}>
                <AntDesign
                  onPress={() => {
                    downloadLegalDocs(data)
                  }}
                  name="checkcircleo"
                  size={32}
                  color={AppStyles.colors.primaryColor}
                />
              </View>
            ) : null}
            {data && data.loading ? (
              <ActivityIndicator size={'large'} color={AppStyles.colors.primaryColor} />
            ) : null}
          </View>
        </TouchableOpacity>
        {false ? (
          <View style={{ paddingVertical: 5 }}>
            <Text>File Downloaded!</Text>
          </View>
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 10,
  },
  firstView: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 0,
    height: 50,
    marginHorizontal: 10,
    flex: 0.8,
    justifyContent: 'center',
  },
  firstText: {
    letterSpacing: 1,
    fontFamily: AppStyles.fonts.semiBoldFont,
    color: AppStyles.colors.textColor,
  },
  pendingText: {
    letterSpacing: 1,
    fontFamily: AppStyles.fonts.semiBoldFont,
    color: AppStyles.colors.subTextColor,
  },
  secView: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: AppStyles.colors.subTextColor,
    // borderLeftWidth: item.status === 'pending' ? 0 : 0.5,
  },
  activityView: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default DocTile
