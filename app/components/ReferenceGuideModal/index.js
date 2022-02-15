/** @format */

import React, { createRef, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList } from 'react-native'
import Modal from 'react-native-modal'
import AppStyles from '../../AppStyles'
import close from '../../../assets/img/times.png'
import TouchableButton from '../TouchableButton'
import UploadAttachment from '../UploadAttachment'
import AttachmentTile from '../AttachmentTile'
import _ from 'underscore'
import ErrorMessage from '../ErrorMessage'

const ReferenceGuideModal = ({
  isReferenceModalVisible,
  hideReferenceGuideModal,
  addInvestmentGuide,
  referenceGuideLoading,
  referenceErrorMessage,
}) => {
  const [investmentGuideNo, setInvestmentGuideNo] = useState(null)
  const [showAction, setShowAction] = useState(false)
  const [investmentGuideAttachments, setInvestmentGuideAttachments] = useState([])

  const addInvestment = () => {
    if (investmentGuideNo === null || investmentGuideNo === '') {
      alert('Please enter investment guide number')
    } else {
      addInvestmentGuide(investmentGuideNo, investmentGuideAttachments)
      setInvestmentGuideNo(null)
      setInvestmentGuideAttachments([])
    }
  }

  return (
    <Modal isVisible={isReferenceModalVisible}>
      <View style={styles.modalMain}>
        <UploadAttachment
          showAction={showAction}
          onCancelPressed={() => {
            setShowAction(false)
          }}
          submitUploadedAttachment={(data) => {
            setShowAction(false)
            setInvestmentGuideAttachments([...investmentGuideAttachments, data])
          }}
        />
        <View style={styles.row}>
          <Text style={styles.title}>Investment Guide Detail</Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              setInvestmentGuideNo(null)
              setInvestmentGuideAttachments([])
              hideReferenceGuideModal()
            }}
          >
            <Image source={close} style={styles.closeImg} />
          </TouchableOpacity>
        </View>
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              onChangeText={(text) => setInvestmentGuideNo(text)}
              placeholderTextColor={'#a8a8aa'}
              value={investmentGuideNo}
              style={[AppStyles.formControl, AppStyles.inputPadLeft, styles.input]}
              placeholder={'Investment Guide Reference #'}
            />
          </View>
          <ErrorMessage errorMessage={referenceErrorMessage} />
        </View>

        {investmentGuideAttachments && investmentGuideAttachments.length > 0 && (
          <FlatList
            style={{ minHeight: 20, maxHeight: 200 }}
            contentContainerStyle={{ flexGrow: 1 }}
            data={investmentGuideAttachments}
            renderItem={({ item }) => (
              <AttachmentTile
                data={item}
                viewAttachments={() => null}
                deleteAttachment={(item) =>
                  setInvestmentGuideAttachments(_.without(investmentGuideAttachments, item))
                }
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}

        <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            onPress={() => setShowAction(true)}
            containerStyle={AppStyles.formBtn}
            label={
              investmentGuideAttachments && investmentGuideAttachments.length > 0
                ? 'Add another Attachment'
                : 'Add Attachment'
            }
            // loading={imageLoading || loading}
          />
        </View>

        <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            containerStyle={AppStyles.formBtn}
            label="Save"
            loading={referenceGuideLoading}
            onPress={() => addInvestment()}
          />
        </View>
      </View>
    </Modal>
  )
}

export default ReferenceGuideModal

const styles = StyleSheet.create({
  modalMain: {
    backgroundColor: '#fff',
    borderRadius: 7,
    overflow: 'hidden',
    zIndex: 5,
    position: 'relative',
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
    padding: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ebebeb',
  },
  uploadText: {
    color: AppStyles.colors.primaryColor,
    fontSize: 16,
    fontFamily: AppStyles.fonts.defaultFont,
    letterSpacing: 0.6,
  },
  uploadHelpingText: {
    color: AppStyles.colors.subTextColor,
    fontSize: 14,
    marginVertical: 5,
  },
  uploadAttachmentContainer: {
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#5297F4',
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 15,
    justifyContent: 'center',
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    width: '90%',
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: AppStyles.fontSize.large,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 50,
    width: '10%',
  },
  closeImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
})
