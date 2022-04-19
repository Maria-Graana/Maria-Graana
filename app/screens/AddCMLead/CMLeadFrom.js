/** @format */

import React, { Component } from 'react'
import { View } from 'react-native'
import { Textarea } from 'native-base'
import PickerComponent from '../../components/Picker/index'
import styles from './style'
import AppStyles from '../../AppStyles'
import ErrorMessage from '../../components/ErrorMessage'
import { connect } from 'react-redux'
import TouchableInput from '../../components/TouchableInput'
import helper from '../../helper'
import PriceSliderModal from '../../components/PriceSliderModal'
import TouchableButton from '../../components/TouchableButton'
import StaticData from '../../StaticData'

class CMLeadFrom extends Component {
  constructor(props) {
    super(props)
  }
  onModalCancelPressed = () => {
    this.props.setParentState({ isPriceModalVisible: false });
  }

  handleCityClick = () => {
    const { navigation } = this.props
    const { selectedCity } = this.props

    navigation.navigate('SingleSelectionPicker', {
      screenName: this.props?.screenName ? this.props?.screenName : 'AddCMLead',
      mode: 'city',
      selectedCity,
    })
  }

  handleClientClick = () => {
    const { navigation } = this.props
    const { selectedClient } = this.props
    navigation.navigate('Client', { isFromDropDown: true, selectedClient, screenName: 'AddCMLead' })
  }

  showPriceModal = () => {

    this.props.setParentState({ isPriceModalVisible: true });
  }
  onModalPriceDonePressed = (minValue, maxValue) => {

    const { formData } = this.props
    const copyObject = { ...formData }
    copyObject.minPrice = minValue
    copyObject.maxPrice = maxValue

    if (this.props?.screenName === 'AddClient') {
      this.props.setParentState({
        investFormData: copyObject,
        isPriceModalVisible: false
      })

    }
    else {

      this.props.setParentState({
        formData: copyObject,
        isPriceModalVisible: false
      })
    }

  }

  render() {
    const {
      hideClient = false,
      formSubmit,
      checkValidation,
      handleForm,
      formData,
      clientName,
      selectedCity,
      getProject,
      getProductType,
      loading,
      isPriceModalVisible,

    } = this.props

    return (
      <View>
        <PriceSliderModal
          isVisible={isPriceModalVisible}
          initialValue={formData?.minPrice}
          finalValue={formData?.maxPrice}
          onModalPriceDonePressed={this.onModalPriceDonePressed}
          onModalCancelPressed={this.onModalCancelPressed}
          arrayValues={StaticData.PricesProject}
        />


        {!hideClient && <TouchableInput
          placeholder="Client"
          onPress={() => this.handleClientClick()}
          value={clientName}
          showError={checkValidation === true && formData?.customerId === ''}
          errorMessage="Required"
        />}

        <TouchableInput
          placeholder="Select City"
          onPress={() => this.handleCityClick()}
          value={selectedCity ? selectedCity.name : ''}
          showError={checkValidation === true && formData?.cityId === ''}
          errorMessage="Required"
        />

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent
              onValueChange={handleForm}
              data={getProject}
              name={'projectId'}
              selectedItem={formData?.projectId}
              placeholder="Project"
            />
            {/* {checkValidation === true && formData.projectId === '' && (
              <ErrorMessage errorMessage={'Required'} />
            )} */}
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent
              onValueChange={handleForm}
              data={getProductType}
              name={'projectType'}
              selectedItem={formData?.armsProjectTypeId}
              placeholder="Product Type"
              enabled={formData?.projectId === '' || formData?.projectId === null ? false : true}
            />
            {/* {
              checkValidation === true && formData.projectType === '' && <ErrorMessage errorMessage={'Required'} />
            } */}
          </View>
        </View>

        <View style={AppStyles.multiFormInput}>
          <View style={{ width: '100%' }}>
            <TouchableInput
              placeholder="Price"
              showIconOrImage={false}
              onPress={() => this.showPriceModal()}
              value={`${helper.convertPriceToString(
                formData?.minPrice,
                formData?.maxPrice,
                StaticData.PricesProject[StaticData.PricesProject.length - 1]
              )}`}
            />
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <Textarea
            value={formData?.description}
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


        {!hideClient && <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
            label={'CREATE LEAD'}
            onPress={() => formSubmit(formData)}
            loading={loading}
            disabled={loading}
          />
        </View>}
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(CMLeadFrom)
