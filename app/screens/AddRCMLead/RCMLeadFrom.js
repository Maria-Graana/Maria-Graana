/** @format */

import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import InnerRCMForm from './innerRCMForm'
import ErrorMessage from '../../components/ErrorMessage'
import { connect } from 'react-redux'
import _ from 'underscore'

class CMLeadFrom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formType: 'buy',
    }
  }

  render() {
    const {
      formType,
      changeStatus,
      formData,
      handleForm,
      selectedClient,
      selectedCity,
      propertyType,
      subTypeData,
      sizeUnit,
      size,
      formSubmit,
      checkValidation,
      handleAreaClick,
      clientName,
      handleClientClick,
      priceList,
      organizations,
      loading,
      sizeUnitList,
      isBedBathModalVisible,
      modalType,

      setParentState,

      isPriceModalVisible,

      
      isSizeModalVisible,
    

    } = this.props
    const checkBuy = formType === 'buy'
    const checkRent = formType === 'rent'
    return (
      <View>
        <View style={[styles.multiButton]}>
          <TouchableOpacity
            style={[AppStyles.flexOne, styles.buttonDesign, checkBuy && styles.activeBtn]}
            onPress={() => {
              changeStatus('buy')
            }}
          >
            <Text style={[styles.textCenter, checkBuy && styles.textBold]}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[AppStyles.flexOne, styles.buttonDesign, checkRent && styles.activeBtn]}
            onPress={() => {
              changeStatus('rent')
            }}
          >
            <Text style={[styles.textCenter, checkRent && styles.textBold]}>Rent</Text>
          </TouchableOpacity>
        </View>

        {/* *********** Main Container *********** */}
        <View style={[AppStyles.container]}>
          <InnerRCMForm
            navigation={this.props.navigation}
            sizeUnitList={sizeUnitList}
            organizations={_.clone(organizations)}
            clientName={clientName}
            handleClientClick={handleClientClick}
            formData={formData}
            handleForm={handleForm}
            selectedCity={selectedCity}
            selectedClient={selectedClient}
            propertyType={propertyType}
            subTypeData={subTypeData}
            sizeUnit={sizeUnit}
            size={size}
            formSubmit={formSubmit}
            checkValidation={checkValidation}
            handleAreaClick={handleAreaClick}
            priceList={priceList}
            modalType={modalType}
            loading={loading}
            isBedBathModalVisible={isBedBathModalVisible}
            isPriceModalVisible={isPriceModalVisible}
            isSizeModalVisible={isSizeModalVisible}     
            setParentState={setParentState}
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
