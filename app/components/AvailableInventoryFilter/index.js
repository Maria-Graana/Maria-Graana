/** @format */

import React, { useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Modal, TouchableOpacity, Image } from 'react-native'
import AppStyles from '../../AppStyles'
import close from '../../../assets/img/times.png'
import StaticData from '../../StaticData'
import PickerComponent from '../Picker'
import helper from '../../helper'
import TouchableInput from '../TouchableInput'
import PriceSliderModal from '../PriceSliderModal'
import TouchableButton from '../TouchableButton'

const AvailableInventoryFilter = ({
  status,
  changeStatus,
  toggleFilterModal,
  showFilterModal,
  onFilterApplied,
}) => {
  return (
    <Modal visible={showFilterModal} animationType="slide">
      <SafeAreaView style={AppStyles.mb1}>
        {/* <PriceSliderModal
          isVisible={isPriceModalVisible}
          initialValue={minPrice}
          finalValue={maxPrice}
          onModalPriceDonePressed={(minValue, maxValue) =>
            onModalPriceDonePressed(minValue, maxValue)
          }
          onModalCancelPressed={() => showPriceModal(false)}
          arrayValues={StaticData.PricesProject}
        /> */}
        <View style={styles.modalMain}>
          <View style={styles.row}>
            <Text style={styles.title}>Filter Inventory</Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                toggleFilterModal(false)
                changeStatus('')
              }}
            >
              <Image source={close} style={styles.closeImg} />
            </TouchableOpacity>
          </View>
          <View style={styles.pickerView}>
            <PickerComponent
              onValueChange={(value) => changeStatus(value)}
              data={StaticData.unitStatuses}
              // enabled={!loading}
              placeholder="Status"
              selectedItem={status}
            />
            {/* **************************************** */}
            {/* <View style={styles.pickerView}>
              <TouchableInput
                placeholder="Price"
                showIconOrImage={false}
                onPress={() => showPriceModal(true)}
                value={`${helper.convertPriceToString(
                  minPrice,
                  maxPrice,
                  StaticData.PricesProject[StaticData.PricesProject.length - 1]
                )}`}
              />
            </View> */}
          </View>
          <TouchableButton
            label={'Done'}
            onPress={() => {
              toggleFilterModal(false)
              onFilterApplied()
            }}
            containerStyle={styles.button}
          />
          <TouchableOpacity onPress={() => changeStatus('')}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default AvailableInventoryFilter

const styles = StyleSheet.create({
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
  modalMain: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#e7ecf0',
  },
  closeImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },
  button: {
    justifyContent: 'center',
    minHeight: 55,
    borderRadius: 4,
    padding: 10,
  },
  pickerView: {
    marginVertical: 15,
  },
  resetText: {
    color: AppStyles.colors.primaryColor,
    fontSize: 18,
    marginVertical: 10,
  },
})
