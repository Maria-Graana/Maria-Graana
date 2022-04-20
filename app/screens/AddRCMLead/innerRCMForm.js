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

  showPriceModal = () => {
    this.props.setParentState({ isPriceModalVisible: true })
  }

  onModalCancelPressed = () => {
    this.props.setParentState({
      isBedBathModalVisible: false,
      isPriceModalVisible: false,
      isSizeModalVisible: false,
    })
  }

  onModalSizeDonePressed = (minValue, maxValue, unit) => {
    const { formData } = this.props
    const copyObject = { ...formData }
    copyObject.size = minValue
    copyObject.maxSize = maxValue
    copyObject.size_unit = unit
    this.props.setParentState({
      RCMFormData: copyObject,
      isSizeModalVisible: false,
    })
  }

  onModalPriceDonePressed = (minValue, maxValue) => {
    const { formData } = this.props
    const copyObject = { ...formData }
    copyObject.minPrice = minValue
    copyObject.maxPrice = maxValue
    this.props.setParentState({ RCMFormData: copyObject, isPriceModalVisible: false })
  }

  onBedBathModalDonePressed = (minValue, maxValue) => {
    const { formData, modalType } = this.props
    const copyObject = { ...formData }
    switch (modalType) {
      case 'bed':
        copyObject.bed = minValue
        copyObject.maxBed = maxValue
        this.props.setParentState({
          RCMFormData: copyObject,
        })

        break
      case 'bath':
        copyObject.bath = minValue
        copyObject.maxBath = maxValue
        this.props.setParentState({
          RCMFormData: copyObject,
        })

      default:
        break
    }
    this.props.setParentState({
      isBedBathModalVisible: false,
    })
  }

  handleAreaClick = () => {
    const { formData } = this.props
    const { city_id, leadAreas } = formData
    const { navigation } = this.props
    const isEditMode = `${leadAreas && leadAreas.length > 0 ? true : false}`
    if (city_id !== '' && city_id !== undefined && city_id != null) {
      navigation.navigate('AreaPickerScreen', {
        cityId: city_id,
        isEditMode: isEditMode,
        screenName: this.props?.screenName ? this.props?.screenName : 'AddRCMLead',
      })
    } else {
      alert('Please select city first!')
    }
  }

  showBedBathModal = (modalType) => {
    this.props.setParentState({ isBedBathModalVisible: true, modalType })
  }

  showSizeModal = () => {
    this.props.setParentState({ isSizeModalVisible: true })
  }

  handleClientClick = () => {
    const { navigation } = this.props
    const { selectedClient } = this.props
    navigation.navigate('Client', {
      isFromDropDown: true,
      selectedClient,
      screenName: this.props?.screenName ? this.props?.screenName : 'AddRCMLead',
    })
  }

  handleCityClick = () => {
    const { navigation } = this.props
    const { selectedCity } = this.props
    navigation.navigate('SingleSelectionPicker', {
      screenName: this.props?.screenName ? this.props?.screenName : 'AddRCMLead',
      mode: 'city',
      selectedCity,
    })
  }

  render() {
    const {
      screenName,
      user,
      formSubmit,
      checkValidation,
      handleForm,
      formData,
      selectedClient,
      selectedCity,
      propertyType,
      subTypeData,
      clientName,
      organizations,
      loading,
      hideClient,
      priceList,
      isBedBathModalVisible,
      modalType,
      isPriceModalVisible,

      sizeUnitList,
      isSizeModalVisible,
      showSizeModal,
      onModalSizeDonePressed,
      update,
    } = this.props

    const { leadAreas } = formData
    const leadAreasLength = leadAreas ? leadAreas.length : 0

    return (
      <View>
        <BedBathSliderModal
          isVisible={isBedBathModalVisible}
          modalType={modalType}
          initialValue={this.checkBedBathInitialValue(modalType)}
          finalValue={this.checkBedBathFinalValue(modalType)}
          onBedBathModalDonePressed={this.onBedBathModalDonePressed}
          onModalCancelPressed={this.onModalCancelPressed}
          arrayValues={StaticData.bedBathRange}
        />

        <PriceSliderModal
          isVisible={isPriceModalVisible}
          initialValue={formData.minPrice}
          finalValue={formData.maxPrice}
          onModalPriceDonePressed={this.onModalPriceDonePressed}
          onModalCancelPressed={this.onModalCancelPressed}
          arrayValues={priceList}
        />
        <SizeSliderModal
          isVisible={isSizeModalVisible}
          initialValue={formData.size}
          finalValue={formData.maxSize}
          onModalSizeDonePressed={this.onModalSizeDonePressed}
          onModalCancelPressed={this.onModalCancelPressed}
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

        {!hideClient ? (
          <TouchableInput
            placeholder="Client"
            onPress={() => this.handleClientClick()}
            value={clientName}
            showIconOrImage={false}
            showError={checkValidation === true && formData.customerId === ''}
            errorMessage="Required"
            disabled={update}
          />
        ) : null}

        <TouchableInput
          placeholder="Select City"
          onPress={() => this.handleCityClick()}
          showIconOrImage={false}
          value={selectedCity ? selectedCity.name : ''}
          showError={checkValidation === true && formData.city_id === null}
          errorMessage="Required"
        />

        <TouchableInput
          onPress={() => this.handleAreaClick()}
          value={leadAreasLength > 0 ? leadAreasLength + ' Areas Selected' : ''}
          placeholder="Select Areas"
          showError={checkValidation === true && !leadAreas && typeof leadAreas === 'undefined'}
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
              onPress={() => this.showSizeModal()}
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
              onPress={() => this.showPriceModal()}
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
                  onPress={() => this.showBedBathModal('bed')}
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
                  onPress={() => this.showBedBathModal('bath')}
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

        {!hideClient && (
          <View style={[AppStyles.mainInputWrap]}>
            <TouchableButton
              containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
              label={update ? 'UPDATE' : 'CREATE'}
              onPress={() => formSubmit(formData)}
              loading={loading}
              disabled={loading}
            />
          </View>
        )}
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
