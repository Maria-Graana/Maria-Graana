/** @format */

import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Modal,
  SafeAreaView,
  FlatList,
} from 'react-native'
import AppStyles from '../../AppStyles'
import RadioComponent from '../RadioButton'
import close from '../../../assets/img/times.png'
import TouchableButton from '../TouchableButton'
import StaticData from '../../StaticData'

const AddLeadCategoryModal = ({
  visible,
  toggleCategoryModal,
  onCategorySelected,
  selectedCategory,
}) => {
  return (
    <Modal visible={visible}>
      <SafeAreaView style={AppStyles.mb1}>
        <View style={[styles.modalMain]}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              toggleCategoryModal(false)
            }}
          >
            <Image source={close} style={styles.closeImg} />
          </TouchableOpacity>
          <FlatList
            data={StaticData.leadCategories}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => (
              <TouchableButton
                label={item.label}
                textColor={
                  selectedCategory && item.label === selectedCategory ? 'white' : item.color
                }
                containerBackgroundColor={
                  selectedCategory && item.label === selectedCategory ? item.color : 'white'
                }
                containerStyle={styles.button}
                borderWidth={0.5}
                borderColor={item.color}
                onPress={() => onCategorySelected(item.label)}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
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
  list: {
    justifyContent: 'center',
    flex: 1,
  },
  closeBtn: {
    backgroundColor: '#fff',
    position: 'absolute',
    right: 15,
    top: 0,
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
  title: {
    width: '90%',
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: AppStyles.fontSize.large,
  },
})
