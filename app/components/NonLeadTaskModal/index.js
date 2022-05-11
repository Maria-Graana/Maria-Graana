/** @format */

import React, { useState } from 'react'
import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import AppStyles from '../../AppStyles'
import ErrorMessage from '../ErrorMessage'
import TouchableButton from '../TouchableButton'
import { Textarea } from 'native-base'
import { AntDesign } from '@expo/vector-icons'

const NonLeadTaskModal = ({ isVisible, showHideModal, markTaskasDone }) => {
  const [comment, setComment] = useState(null)
  const markTaskasDoneAndClear = () => {
    showHideModal(false)
    setComment(null)
    markTaskasDone(comment)
  }
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => {
        showHideModal(false)
        setComment(null)
      }}
    >
      <View style={styles.modalMain}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: AppStyles.fonts.semiBoldFont,
            color: AppStyles.colors.textColor,
          }}
        >
          Comment
        </Text>

        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <Textarea
              value={comment}
              style={[
                AppStyles.formControl,
                Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
                AppStyles.formFontSettings,
                { height: 100, paddingTop: 10 },
              ]}
              rowSpan={5}
              placeholder={'Write here'}
              onChangeText={(text) => {
                setComment(text)
              }}
            />
            {comment === '' && <ErrorMessage errorMessage={'Required*'} />}
          </View>

          <View style={[AppStyles.mainInputWrap]}>
            <TouchableButton
              containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
              label={'DONE'}
              loading={false}
              fontSize={16}
              fontFamily={AppStyles.fonts.boldFont}
              onPress={() =>
                comment !== '' && comment !== null
                  ? markTaskasDoneAndClear(comment)
                  : alert('Please enter a comment')
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default NonLeadTaskModal

const styles = StyleSheet.create({
  modalMain: {
    backgroundColor: '#e7ecf0',
    borderRadius: 7,
    overflow: 'hidden',
    zIndex: 5,
    position: 'relative',
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  closeStyle: {
    position: 'absolute',
    right: 15,
    top: Platform.OS == 'android' ? 10 : 40,
    paddingVertical: 5,
  },
  // buttonStyle: {
  //   borderColor: '#006ff1',
  //   backgroundColor: '#006ff1',
  //   width: '30%',
  //   borderRadius: 4,
  //   borderWidth: 1,
  //   color: '#006ff1',
  //   textAlign: 'center',
  //   borderRadius: 4,
  //   marginBottom: 0,
  //   justifyContent: 'center',
  //   minHeight: 55,
  // },
})
