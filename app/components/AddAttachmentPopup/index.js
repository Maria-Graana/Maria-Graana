/** @format */

import React, { useEffect } from 'react'
import { View, Text, Modal, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import styles from './styles'
import AppStyles from '../../AppStyles'
import { Button } from 'native-base'
import ErrorMessage from '../../components/ErrorMessage'
import TouchableButton from '../TouchableButton'

const AddAttachmentPopup = (props) => {
  const {
    isVisible,
    closeModal,
    formData,
    checkValidation,
    formSubmit,
    getAttachmentFromStorage,
    setTitle,
    doneLoading,
    navigation,
    workflow,
    purpose,
  } = props
  useEffect(() => {
    if (purpose == 'addSCA') {
      setTitle('Service Charge Agreement Document')
    }
  }, [])
  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={closeModal}>
      <SafeAreaView
        style={[AppStyles.mb1, { justifyContent: 'center', backgroundColor: '#e7ecf0' }]}
      >
        <AntDesign
          style={styles.closeStyle}
          onPress={() => {
            closeModal(), purpose == 'addSCA' && navigation.goBack()
          }}
          name="close"
          size={26}
          color={AppStyles.colors.textColor}
        />
        <View style={[styles.viewContainer]}>
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <TextInput
                defaultValue={purpose == 'addSCA' && 'Service Charge Agreement Document'}
                editable={purpose == 'addSCA' ? false : true}
                placeholderTextColor={'#a8a8aa'}
                style={[AppStyles.formControl, AppStyles.inputPadLeft, AppStyles.formFontSettings]}
                placeholder={
                  purpose == 'addSCA' ? 'Service Charge Agreement Document' : 'Subject/Title'
                }
                onChangeText={(text) => setTitle(text)}
              />
            </View>
            {checkValidation === true && purpose != 'addSCA' && formData.title === '' && (
              <ErrorMessage errorMessage={'Required'} />
            )}
          </View>

          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <TouchableOpacity onPress={getAttachmentFromStorage} activeOpacity={0.7}>
                <View style={[AppStyles.flexDirectionRow, AppStyles.bgcWhite]}>
                  <View
                    style={{ alignSelf: 'flex-start', marginTop: 7, marginLeft: 10, flex: 0.1 }}
                  >
                    <MaterialCommunityIcons
                      name="file-upload-outline"
                      size={32}
                      color={AppStyles.colors.primaryColor}
                    />
                  </View>
                  <View
                    style={[
                      {
                        backgroundColor: '#fff',
                        borderRadius: 4,
                        borderWidth: 0,
                        height: 50,
                        marginHorizontal: 10,
                        flex: 0.9,
                        justifyContent: 'center',
                      },
                    ]}
                  >
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
                      {formData.fileName ? formData.fileName : 'UPLOAD ATTACHMENT'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {checkValidation === true && formData.fileName === '' && (
            <ErrorMessage errorMessage={'Required'} />
          )}

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap]}>
            <TouchableButton
              label={'DONE'}
              loading={doneLoading}
              onPress={() => {
                formSubmit()
                // purpose == 'addSCA' && formData.fileName && closeModal()
              }}
              containerStyle={styles.button}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default AddAttachmentPopup
