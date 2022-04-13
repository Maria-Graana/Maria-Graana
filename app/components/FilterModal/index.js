/** @format */

import { Button } from 'native-base'
import React from 'react'
import { Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import _ from 'underscore'
import AppStyles from '../../AppStyles'
import BackButton from '../../components/BackButton'
import BedBathSliderModal from '../../components/BedBathSliderModal'
import SizeSliderModal from '../../components/SizeSliderModal'
import helper from '../../helper'
import StaticData from '../../StaticData'
import AreaPicker from '../AreaPicker/index'
import PickerComponent from '../Picker/index'
import PriceSliderModal from '../PriceSliderModal'
import SingleSelectionPickerComp from '../SingleSelectionPickerComp/index'
import TouchableInput from '../TouchableInput'
import styles from './style'

class FilterModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showAreaPicker: false,
      showCityPicker: false,
      isPriceModalVisible: false,
      isBedBathModalVisible: false,
      isSizeModalVisible: false,
      modalType: 'none',
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  emptyList = () => {
    this.areaPicker.emptyList()
  }

  openModal = () => {
    const { showAreaPicker } = this.state
    this.setState({
      showAreaPicker: !showAreaPicker,
    })
  }

  openCityModal = () => {
    const { showCityPicker } = this.state
    this.setState({
      showCityPicker: !showCityPicker,
    })
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

  showBedBathModal = (modalType) => {
    this.setState({ isBedBathModalVisible: true, modalType })
  }

  onBedBathModalDonePressed = (minValue, maxValue) => {
    const { modalType } = this.state
    this.setState({ isBedBathModalVisible: false }, () => {
      this.props.onBedBathModalDonePressed(minValue, maxValue, modalType)
    })
  }

  showPricePicker = () => {
    this.setState({ isPriceModalVisible: true })
  }

  showSizePicker = () => {
    this.setState({ isSizeModalVisible: true })
  }

  onModalSizeDonePressed = (minValue, maxValue, unit) => {
    this.setState({ isSizeModalVisible: false }, () => {
      this.props.onModalSizeDonePressed(minValue, maxValue, unit)
    })
  }

  onModalPriceDonePressed = (minValue, maxValue) => {
    this.setState({ isPriceModalVisible: false }, () => {
      this.props.onModalPriceDonePressed(minValue, maxValue)
    })
  }

  onModalCancelPressed = () => {
    this.setState({
      isPriceModalVisible: false,
      isBedBathModalVisible: false,
      isSizeModalVisible: false,
    })
  }

  render() {
    const {
      openPopup,
      areas,
      cities,
      formData,
      handleForm,
      getSubType,
      subTypVal,
      submitFilter,
      selectedCity,
      lead,
    } = this.props
    const {
      showAreaPicker,
      showCityPicker,
      isPriceModalVisible,
      isBedBathModalVisible,
      isSizeModalVisible,
      modalType,
    } = this.state
    const { sizeUnit, type } = StaticData
    let prices = formData.purpose === 'rent' ? StaticData.PricesRent : StaticData.PricesBuy
    return (
      <Modal visible={openPopup} animationType="slide" onRequestClose={this.props.filterModal}>
        <SafeAreaView style={[AppStyles.mb1, styles.container]}>
          <ScrollView>
            <View style={styles.topHeader}>
              <BackButton
                onClick={() => {
                  this.props.filterModal()
                }}
              />
              <View style={styles.header}>
                <Text style={styles.headerText}>SEARCH FILTERS</Text>
              </View>
            </View>

            {/* **************************************** */}

            <AreaPicker
              onRef={(ref) => (this.areaPicker = ref)}
              handleForm={handleForm}
              openModal={this.openModal}
              selectedAreaIds={_.clone(formData.leadAreas)}
              editable={false}
              isVisible={showAreaPicker}
              cityId={formData.cityId}
              areas={_.clone(areas)}
            />

            {/* **************************************** */}

            <SingleSelectionPickerComp
              mode={'city'}
              handleForm={handleForm}
              openModal={this.openCityModal}
              isVisible={showCityPicker}
              cityId={formData.cityId}
              cities={cities.length ? _.clone(cities) : []}
            />
            {/* **************************************** */}
            <BedBathSliderModal
              isVisible={isBedBathModalVisible}
              modalType={modalType}
              initialValue={this.checkBedBathInitialValue(modalType)}
              finalValue={this.checkBedBathFinalValue(modalType)}
              onBedBathModalDonePressed={this.onBedBathModalDonePressed}
              onModalCancelPressed={this.onModalCancelPressed}
              arrayValues={StaticData.bedBathRange}
            />
            {/* **************************************** */}
            <PriceSliderModal
              isVisible={isPriceModalVisible}
              initialValue={formData.minPrice}
              finalValue={formData.maxPrice}
              onModalPriceDonePressed={this.onModalPriceDonePressed}
              onModalCancelPressed={this.onModalCancelPressed}
              arrayValues={prices}
            />

            <SizeSliderModal
              isVisible={isSizeModalVisible}
              initialValue={formData.size}
              finalValue={formData.maxSize}
              onModalSizeDonePressed={this.onModalSizeDonePressed}
              onModalCancelPressed={this.onModalCancelPressed}
              sizeUnit={formData.sizeUnit}
            />

            {/* **************************************** */}

            <View style={[styles.pickerView, { padding: 0, paddingHorizontal: 15 }]}>
              <TouchableInput
                placeholder="Select City"
                onPress={() => this.openCityModal()}
                value={selectedCity ? selectedCity.name : ''}
              />
            </View>
            <TouchableOpacity onPress={() => this.openModal()} style={styles.btnMargin}>
              <View
                style={[
                  AppStyles.mainInputWrap,
                  AppStyles.inputPadLeft,
                  AppStyles.formControl,
                  { justifyContent: 'center' },
                ]}
              >
                <Text
                  style={[
                    AppStyles.formFontSettings,
                    {
                      color:
                        formData.leadAreas.length > 0
                          ? AppStyles.colors.textColor
                          : AppStyles.colors.subTextColor,
                    },
                  ]}
                >
                  {formData.leadAreas.length > 0
                    ? `${formData.leadAreas.length} Areas Selected`
                    : 'Select Areas'}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.pickerView}>
              <PickerComponent
                selectedItem={formData.propertyType}
                onValueChange={(text) => {
                  handleForm(text, 'propertyType')
                  getSubType(text)
                }}
                data={type}
                name={'type'}
                placeholder="Property Type"
              />
            </View>
            <View style={styles.pickerView}>
              <PickerComponent
                selectedItem={formData.propertySubType}
                onValueChange={(text) => {
                  handleForm(text, 'propertySubType')
                }}
                data={subTypVal}
                name={'type'}
                placeholder="Property Sub Type"
              />
            </View>

            <View style={[styles.pickerView, { padding: 0, paddingHorizontal: 15 }]}>
              <TouchableInput
                placeholder="Size"
                showIconOrImage={false}
                onPress={() => this.showSizePicker()}
                value={`${helper.convertSizeToString(
                  formData.size,
                  formData.maxSize,
                  StaticData.Constants.size_any_value,
                  formData.sizeUnit
                )}`}
              />
            </View>
            {/* **************************************** */}
            <View style={[styles.pickerView, { padding: 0, paddingHorizontal: 15 }]}>
              <TouchableInput
                placeholder="Price"
                showIconOrImage={false}
                onPress={() => this.showPricePicker()}
                value={`${helper.convertPriceToString(
                  formData.minPrice,
                  formData.maxPrice,
                  prices[prices.length - 1]
                )}`}
              />
            </View>

            {/* **************************************** */}
            {lead.type !== 'plot' && lead.type !== 'commercial' ? (
              <View style={styles.textInputView}>
                <View style={styles.textView}>
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
                <View style={AppStyles.mb1}>
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
            ) : null}
            <View style={[AppStyles.mainInputWrap, styles.matchBtn, { marginBottom: 15 }]}>
              <Button
                onPress={() => {
                  submitFilter()
                }}
                style={[AppStyles.formBtn]}
              >
                <Text style={AppStyles.btnText}>MATCH</Text>
              </Button>
            </View>

            <View style={[styles.matchBtn]}>
              <Button
                onPress={() => {
                  this.props.resetFilter()
                }}
                style={[AppStyles.formBtnWithWhiteBg, styles.btn1]}
              >
                <Text style={AppStyles.btnTextBlue}>RESET</Text>
              </Button>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
  }
}

export default connect(mapStateToProps)(FilterModal)
