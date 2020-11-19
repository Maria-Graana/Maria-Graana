/** @format */

import React from 'react'
import { View, Text, Modal, SafeAreaView, TouchableOpacity, FlatList, Alert } from 'react-native'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import styles from './styles'
import AppStyles from '../../AppStyles'
import { Button } from 'native-base'
import ErrorMessage from '../../components/ErrorMessage'
import Loader from '../loader'
import { ActivityIndicator } from 'react-native-paper'

const PropsureDocumentPopup = (props) => {
  const {
    isVisible,
    closeModal,
    onPress,
    pendingPropsures,
    getAttachmentFromStorage,
    uploadReport,
    downloadFile,
  } = props
  // console.log('pendingPropsures: ', pendingPropsures)
  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={closeModal}>
      <SafeAreaView
        style={[AppStyles.mb1, { justifyContent: 'center', backgroundColor: '#e7ecf0' }]}
      >
        <AntDesign
          style={styles.closeStyle}
          onPress={closeModal}
          name="close"
          size={26}
          color={AppStyles.colors.textColor}
        />
        <FlatList
          data={pendingPropsures}
          style={{ marginTop: 35 }}
          renderItem={({ item }) => (
            <View style={[styles.viewContainer]}>
              <Text
                style={{ color: AppStyles.colors.textColor, marginVertical: 5 }}
              >{`${item.package}`}</Text>
              <TouchableOpacity
                disabled={item.isLoading && item.status === 'verified'}
                onPress={() => {
                  if (item.status === 'verified') {
                    downloadFile(item)
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={[AppStyles.flexDirectionRow, AppStyles.bgcWhite]}>
                  <View
                    style={[
                      {
                        backgroundColor: '#fff',
                        borderRadius: 4,
                        borderWidth: 0,
                        height: 50,
                        marginHorizontal: 10,
                        flex: 0.8,
                        justifyContent: 'center',
                      },
                    ]}
                  >
                    {item.status === 'verified' ? (
                      <Text
                        style={[
                          {
                            letterSpacing: 1,
                            fontFamily: AppStyles.fonts.semiBoldFont,
                            color: AppStyles.colors.textColor,
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {item.propsureDocs && item.propsureDocs.length > 0
                          ? item.propsureDocs[0].name
                            ? item.propsureDocs[0].name
                            : item.propsureDocs[0].fileName
                          : ``}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          {
                            letterSpacing: 1,
                            fontFamily: AppStyles.fonts.semiBoldFont,
                            color: AppStyles.colors.subTextColor,
                          },
                        ]}
                        numberOfLines={2}
                      >
                        Pending Propsure
                      </Text>
                    )}
                  </View>
                  {item.status === 'pending' ? (
                    <TouchableOpacity
                      disabled={item.isLoading}
                      onPress={() => {}}
                      style={{
                        flex: 0.2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: AppStyles.colors.subTextColor,
                        borderLeftWidth: item.status === 'pending' ? 0 : 0.5,
                      }}
                    >
                      {item.isLoading ? (
                        <ActivityIndicator size={'large'} color={AppStyles.colors.primaryColor} />
                      ) : null}
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={{
                        flex: 0.2,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <AntDesign
                        name="checkcircleo"
                        size={32}
                        color={AppStyles.colors.primaryColor}
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
        {/* {
                        checkValidation === true && selectedFile === null && <ErrorMessage errorMessage={'Required'} />
                    } */}

        <View style={[AppStyles.mainInputWrap, { marginLeft: 25, marginRight: 25 }]}>
          <Button style={[AppStyles.formBtn, { marginVertical: 10 }]} onPress={onPress}>
            <Text style={AppStyles.btnText}>DONE</Text>
          </Button>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default PropsureDocumentPopup
