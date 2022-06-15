/** @format */

import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import AppStyles from '../../AppStyles'
import ErrorMessage from '../ErrorMessage'
import { Textarea } from 'native-base'
import TouchableButton from '../TouchableButton'
import MyCheckBox from '../MyCheckBox'

const AppRatingModalPP = ({ isVisible, submitRating }) => {
  const [isRated, setIsRated] = useState(false)
  const [ratingComments, setRatingComment] = useState(null)
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalMain}>
        <Text style={styles.title}>Graana App Feedback</Text>
        <TouchableOpacity onPress={() => setIsRated(!isRated)} style={styles.checkBoxRow}>
          <MyCheckBox status={isRated ? true : false} onPress={() => setIsRated(!isRated)} />
          <Text style={styles.checkBoxText}>Has PP downloaded and rated Graana App?</Text>
        </TouchableOpacity>
        <View style={[AppStyles.mainInputWrap]}>
          <Textarea
            placeholderTextColor={'#a8a8aa'}
            style={[
              AppStyles.formControl,
              Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
              AppStyles.formFontSettings,
              { height: 100, paddingTop: 10 },
            ]}
            rowSpan={5}
            placeholder="Comments"
            onChangeText={(text) => setRatingComment(text)}
            value={ratingComments}
          />
        </View>
        <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            containerStyle={[AppStyles.formBtn]}
            label="Submit"
            onPress={() => {
              submitRating(isRated, ratingComments)
              setIsRated(false)
              setRatingComment(null)
            }}
          />
        </View>
      </View>
    </Modal>
  )
}

export default AppRatingModalPP

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
  checkBoxRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  checkBoxText: {
    marginHorizontal: 15,
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 14,
  },
  title: {
    width: '90%',
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: AppStyles.fontSize.large,
    marginBottom: 5,
  },
  checkBox: {
    width: 22,
    height: 22,
    alignItems: 'center',
  },
})
