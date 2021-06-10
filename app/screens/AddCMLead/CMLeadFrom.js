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

  render() {
    const {
      formSubmit,
      checkValidation,
      handleForm,
      formData,
      clientName,
      selectedCity,
      handleCityClick,
      handleClientClick,
      getProject,
      getProductType,
      loading,
      isPriceModalVisible,
      showPriceModal,
      onModalPriceDonePressed,
      onModalCancelPressed,
    } = this.props
    console.log('formData: ', formData)
    return (
      <View>
        <PriceSliderModal
          isVisible={isPriceModalVisible}
          initialValue={formData.minPrice}
          finalValue={formData.maxPrice}
          onModalPriceDonePressed={onModalPriceDonePressed}
          onModalCancelPressed={onModalCancelPressed}
          arrayValues={StaticData.PricesProject}
        />

        <TouchableInput
          placeholder="Client"
          onPress={() => handleClientClick()}
          value={clientName}
          showError={checkValidation === true && formData.customerId === ''}
          errorMessage="Required"
        />

        <TouchableInput
          placeholder="Select City"
          onPress={() => handleCityClick()}
          value={selectedCity ? selectedCity.name : ''}
          showError={checkValidation === true && formData.cityId === ''}
          errorMessage="Required"
        />

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent
              onValueChange={handleForm}
              data={getProject}
              name={'projectId'}
              value={''}
              placeholder="Project"
            />
            {checkValidation === true && formData.projectId === '' && (
              <ErrorMessage errorMessage={'Required'} />
            )}
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent
              onValueChange={handleForm}
              data={getProductType}
              name={'projectType'}
              value={''}
              placeholder="Product Type"
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
              onPress={() => showPriceModal()}
              value={`${helper.convertPriceToString(
                formData.minPrice,
                formData.maxPrice,
                StaticData.PricesProject[StaticData.PricesProject.length - 1]
              )}`}
            />
          </View>
        </View>

        {/* **************************************** */}
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
            label={'CREATE LEAD'}
            onPress={() => formSubmit(formData)}
            loading={loading}
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

export default connect(mapStateToProps)(CMLeadFrom)
