/** @format */

import React, { Component } from 'react'
import { View } from 'react-native'
import { Textarea } from 'native-base'
import PickerComponent from '../../components/Picker/index'
import styles from './style'
import AppStyles from '../../AppStyles'
import ErrorMessage from '../../components/ErrorMessage'
import { connect } from 'react-redux'
import StaticData from '../../StaticData'
import TouchableInput from '../../components/TouchableInput'
import TouchableButton from '../../components/TouchableButton'
import BedBathSliderModal from '../../components/BedBathSliderModal'
import helper from '../../helper'
import PriceSliderModal from '../../components/PriceSliderModal'
import SizeSliderModal from '../../components/SizeSliderModal'
class InnerRCMForm extends Component {
  constructor(props) {
    super(props)
  }

  checkBedBathInitialValue = (modalType) => {
    const { formData } = this.props
    switch (modalType) {
      case 'bed':
        return formData.bed
      case 'bath':
        return formData.bath
      default:
        return 0
    }
  }

  checkBedBathFinalValue = (modalType) => {
    const { formData } = this.props
    switch (modalType) {
      case 'bed':
        return formData.maxBed
      case 'bath':
        return formData.maxBath
      default:
        return 0
    }
  }

  render() {
    const {
      user,
      formSubmit,
      checkValidation,
      handleForm,
      formData,
      handleCityClick,
      selectedCity,
      propertyType,
      subTypeData,
      handleAreaClick,
      clientName,
      handleClientClick,
      organizations,
      loading,
      priceList,
      isBedBathModalVisible,
      modalType,
      showBedBathModal,
      onBedBathModalDonePressed,
      onModalCancelPressed,
      isPriceModalVisible,
      showPriceModal,
      onModalPriceDonePressed,
      sizeUnitList,
      isSizeModalVisible,
      showSizeModal,
      onModalSizeDonePressed,
      update,
    } = this.props

    const { leadAreas } = formData
    const leadAreasLength = leadAreas ? leadAreas.length : 0
    //console.log(formData);
    return (
      <View>
        <BedBathSliderModal
          isVisible={isBedBathModalVisible}
          modalType={modalType}
          initialValue={this.checkBedBathInitialValue(modalType)}
          finalValue={this.checkBedBathFinalValue(modalType)}
          onBedBathModalDonePressed={onBedBathModalDonePressed}
          onModalCancelPressed={onModalCancelPressed}
          arrayValues={StaticData.bedBathRange}
        />

        <PriceSliderModal
          isVisible={isPriceModalVisible}
          initialValue={formData.minPrice}
          finalValue={formData.maxPrice}
          onModalPriceDonePressed={onModalPriceDonePressed}
          onModalCancelPressed={onModalCancelPressed}
          arrayValues={priceList}
        />
        <SizeSliderModal
          isVisible={isSizeModalVisible}
          initialValue={formData.size}
          finalValue={formData.maxSize}
          onModalSizeDonePressed={onModalSizeDonePressed}
          onModalCancelPressed={onModalCancelPressed}
          sizeUnit={formData.size_unit}
        />

        {user.subRole === 'group_management' ? (
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent
                onValueChange={handleForm}
                data={organizations}
                name={'org'}
                placeholder="Organizations"
                selectedItem={formData.org}
              />
              {checkValidation === true && formData.org === '' && (
                <ErrorMessage errorMessage={'Required'} />
              )}
            </View>
          </View>
        ) : null}

        <TouchableInput
          placeholder="Client"
          onPress={() => handleClientClick()}
          value={clientName}
          showIconOrImage={false}
          showError={checkValidation === true && formData.customerId === ''}
          errorMessage="Required"
          disabled={update}
        />

        <TouchableInput
          placeholder="Select City"
          onPress={() => handleCityClick()}
          showIconOrImage={false}
          value={selectedCity ? selectedCity.name : ''}
          showError={checkValidation === true && formData.city_id === ''}
          errorMessage="Required"
        />

        <TouchableInput
          onPress={() => handleAreaClick()}
          value={leadAreasLength > 0 ? leadAreasLength + ' Areas Selected' : ''}
          placeholder="Select Areas"
          showError={checkValidation === true && leadAreas && leadAreas.length === 0}
          errorMessage="Required"
        />

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent
              onValueChange={handleForm}
              data={propertyType}
              name={'type'}
              placeholder="Property Type"
              selectedItem={formData.type}
            />
            {checkValidation === true && formData.type === '' && (
              <ErrorMessage errorMessage={'Required'} />
            )}
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent
              onValueChange={handleForm}
              data={subTypeData}
              name={'subtype'}
              placeholder="Property Sub Type"
              selectedItem={formData.subtype}
            />
            {checkValidation === true && formData.subtype === '' && (
              <ErrorMessage errorMessage={'Required'} />
            )}
          </View>
        </View>
        {/* **************************************** */}
        <View style={AppStyles.multiFormInput}>
          <View style={{ width: '100%' }}>
            <TouchableInput
              placeholder="Size"
              showIconOrImage={false}
              onPress={() => showSizeModal()}
              value={`${helper.convertSizeToString(
                formData.size,
                formData.maxSize,
                StaticData.Constants.size_any_value,
                formData.size_unit
              )}`}
            />
          </View>
        </View>
        {/* **************************************** */}

        <View style={AppStyles.multiFormInput}>
          <View style={{ width: '100%' }}>
            <TouchableInput
              placeholder="Price"
              showIconOrImage={false}
              onPress={() => showPriceModal()}
              value={`${helper.convertPriceToString(
                formData.minPrice,
                formData.maxPrice,
                priceList[priceList.length - 1]
              )}`}
            />
          </View>
        </View>

        {formData.type !== '' &&
          formData.subtype !== '' &&
          formData.type != 'plot' &&
          formData.type != 'commercial' && (
            <View style={AppStyles.multiFormInput}>
              {/* **************************************** */}
              <View style={AppStyles.flexOne}>
                <TouchableInput
                  placeholder="Bed"
                  showIconOrImage={false}
                  onPress={() => showBedBathModal('bed')}
                  value={`Beds: ${helper.showBedBathRangesString(
                    formData.bed,
                    formData.maxBed,
                    StaticData.bedBathRange[StaticData.bedBathRange.length - 1]
                  )}`}
                />
              </View>
              {/* **************************************** */}
              <View style={[AppStyles.flexOne, AppStyles.flexMarginRight]}>
                <TouchableInput
                  placeholder="Bath"
                  showIconOrImage={false}
                  onPress={() => showBedBathModal('bath')}
                  value={`Baths: ${helper.showBedBathRangesString(
                    formData.bath,
                    formData.maxBath,
                    StaticData.bedBathRange[StaticData.bedBathRange.length - 1]
                  )}`}
                />
              </View>
            </View>
          )}

        <View style={[AppStyles.mainInputWrap]}>
          <Textarea
            value={formData.description}
            style={[
              AppStyles.formControl,
              Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
              AppStyles.formFontSettings,
              { height: 100, paddingTop: 10 },
            ]}
            rowSpan={5}
            placeholder="Description"
            onChangeText={(text) => handleForm(text, 'description')}
          />
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
            label={update ? 'EDIT LEAD' : 'CREATE LEAD'}
            onPress={() => formSubmit(formData)}
            loading={loading}
            disabled={loading}
          />
        </View>
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(InnerRCMForm)
