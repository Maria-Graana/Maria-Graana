/** @format */

import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity, Image, Text, Modal, SafeAreaView } from 'react-native'
import AppStyles from '../../AppStyles'
import RadioComponent from '../RadioButton'
import close from '../../../assets/img/times.png'
import TouchableButton from '../TouchableButton'

const AddLeadCategoryModal = ({ visible, toggleCategoryModal, onCategorySelected, loading }) => {
  const [selectedCategory, setCategory] = useState('')
  return (
    <Modal visible={visible}>
      <SafeAreaView style={AppStyles.mb1}>
        <View style={[styles.modalMain]}>
          <View style={styles.row}>
            <Text style={styles.title}>Select Lead Category</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => toggleCategoryModal(false)}>
              <Image source={close} style={styles.closeImg} />
            </TouchableOpacity>
          </View>

          <RadioComponent
            onGradeSelected={(val) => setCategory(val)}
            selected={selectedCategory === 'Hot' ? true : false}
            value="Hot"
            marginVertical={styles.spacingVertical.marginVertical}
            extraTextStyle={styles.extraTextStyle}
          >
            Hot
          </RadioComponent>

          <RadioComponent
            onGradeSelected={(val) => setCategory(val)}
            selected={selectedCategory === 'Warm' ? true : false}
            value="Warm"
            marginVertical={styles.spacingVertical.marginVertical}
            extraTextStyle={styles.extraTextStyle}
          >
            Warm
          </RadioComponent>

          <RadioComponent
            onGradeSelected={(val) => setCategory(val)}
            selected={selectedCategory === 'Cold' ? true : false}
            value="Cold"
            marginVertical={styles.spacingVertical.marginVertical}
            extraTextStyle={styles.extraTextStyle}
          >
            Cold
          </RadioComponent>

          <RadioComponent
            onGradeSelected={(val) => setCategory(val)}
            selected={selectedCategory === 'Call back' ? true : false}
            value="Call back"
            marginVertical={styles.spacingVertical.marginVertical}
            extraTextStyle={styles.extraTextStyle}
          >
            Call back
          </RadioComponent>

          <RadioComponent
            onGradeSelected={(val) => setCategory(val)}
            selected={selectedCategory === 'Powered off' ? true : false}
            value="Powered off"
            marginVertical={styles.spacingVertical.marginVertical}
            extraTextStyle={styles.extraTextStyle}
          >
            Powered off
          </RadioComponent>

          <RadioComponent
            onGradeSelected={(val) => setCategory(val)}
            selected={selectedCategory === 'No response' ? true : false}
            value="No response"
            marginVertical={styles.spacingVertical.marginVertical}
            extraTextStyle={styles.extraTextStyle}
          >
            No response
          </RadioComponent>

          <RadioComponent
            onGradeSelected={(val) => setCategory(val)}
            selected={selectedCategory === 'Interested to Meet' ? true : false}
            value="Interested to Meet"
            marginVertical={styles.spacingVertical.marginVertical}
            extraTextStyle={styles.extraTextStyle}
          >
            Interested to Meet
          </RadioComponent>
        </View>

        <TouchableButton
          containerStyle={styles.button}
          fontFamily={AppStyles.fonts.boldFont}
          fontSize={16}
          onPress={() => {
            selectedCategory
              ? onCategorySelected(selectedCategory)
              : alert('Please select a category to continue')
          }}
          label={'Done'}
          loading={loading}
        />
      </SafeAreaView>
    </Modal>
  )
}

export default AddLeadCategoryModal

const styles = StyleSheet.create({
  modalMain: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  spacingVertical: {
    marginVertical: 15,
  },
  extraTextStyle: {
    fontSize: AppStyles.fontSize.medium,
    fontFamily: AppStyles.fonts.defaultFont,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
    width: '10%',
  },
  closeImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  button: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
    minHeight: 55,
    borderRadius: 4,
    padding: 10,
    width: '95%',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    width: '90%',
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: AppStyles.fontSize.large,
  },
})
