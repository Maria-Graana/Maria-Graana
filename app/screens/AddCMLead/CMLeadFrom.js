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
      CMLead,
      update,
    } = this.props
    return (
      <View>
        <PriceSliderModal
          isVisible={isPriceModalVisible}
          initialValue={CMLead.minPrice}
          finalValue={CMLead.maxPrice}
          onModalPriceDonePressed={onModalPriceDonePressed}
          onModalCancelPressed={onModalCancelPressed}
          arrayValues={StaticData.PricesProject}
        />

        <TouchableInput
          placeholder="Client"
          onPress={() => handleClientClick()}
          value={clientName}
          showError={checkValidation === true && CMLead.customerId === ''}
          errorMessage="Required"
          disabled={update}
        />

        <TouchableInput
          placeholder="Select City"
          onPress={() => handleCityClick()}
          value={selectedCity ? selectedCity.name : ''}
          showError={checkValidation === true && CMLead.cityId === ''}
          errorMessage="Required"
        />

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent
              onValueChange={handleForm}
              data={getProject}
              name={'projectId'}
              selectedItem={CMLead.projectId}
              placeholder="Project"
            />
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent
              onValueChange={handleForm}
              data={getProductType}
              name={'projectType'}
              selectedItem={CMLead.armsProjectTypeId}
              placeholder="Product Type"
              enabled={CMLead.projectId === '' || CMLead.projectId === null ? false : true}
            />
          </View>
        </View>

        <View style={AppStyles.multiFormInput}>
          <View style={{ width: '100%' }}>
            <TouchableInput
              placeholder="Price"
              showIconOrImage={false}
              onPress={() => showPriceModal()}
              value={`${helper.convertPriceToString(
                CMLead.minPrice,
                CMLead.maxPrice,
                StaticData.PricesProject[StaticData.PricesProject.length - 1]
              )}`}
            />
          </View>
        </View>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <Textarea
            value={CMLead.description}
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
            onPress={() => formSubmit()}
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
    CMLead: store.cmLead.CMLead,
  }
}

export default connect(mapStateToProps)(CMLeadFrom)
