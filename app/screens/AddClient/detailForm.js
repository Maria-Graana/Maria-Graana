/** @format */

import { Textarea } from 'native-base'
import React, { Component, useState } from 'react'
import { TextInput, View, Text, ScrollView, Pressable } from 'react-native'
import { connect } from 'react-redux'
import InnerRCMForm from './../AddRCMLead/innerRCMForm'
import AppStyles from '../../AppStyles'
import axios from 'axios'
import CMLeadFrom from './../AddCMLead/CMLeadFrom'
import ErrorMessage from '../../components/ErrorMessage'
import _ from 'underscore'
import PhoneInputComponent from '../../components/PhoneCountry/PhoneInput'

import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import styles from './style'
import TouchableInput from '../../components/TouchableInput'
import PickerComponent from '../../components/Picker/index'
import StaticData from '../../StaticData'
import DateTimePicker from '../../components/DatePicker'
import helper from '../../helper'
import CountriesPicker from './../../components/CountriesPicker'
class DetailForm extends Component {
  constructor(props) {
    super(props)
    this.scrollRef = React.createRef()
    this.AddInfoRef = React.createRef()
    this.state = {
      relationStatus: '',
      openAdditionalInfo: false,
      addLeadRequirements: false,
      phone: '+92432342432334',
    }
  }

  goToFormPage = (page, status, client) => {
    const { navigation } = this.props
    navigation.navigate(page, { pageName: status, client, name: client && client.customerName })
  }

  onPressTouch = () => {
    // console.log("this.AddInfoRef.current?.offsetTop", this.AddInfoRef.current?.offsetTop);
    this.scrollRef.current?.scrollTo({
      x: 0,
      y: this.AddInfoRef.current?.offsetTop,
      //600
      animated: true,
    })
  }

  render() {
    const {
      formSubmit,
      checkValidation,
      handleForm,
      formData,
      update,
      phoneValidate,
      emailValidate,
      cnicValidate,
      contact1Validate,
      contact2Validate,
      getTrimmedPhone,
      validate,
      hello,
      countryCode,
      countryCode1,
      countryCode2,
      loading,
      accountsOptionFields,
      client,
      user,
      screenName,

      //InvestProps
      handleInvestForm,
      investFormData,
      getProject,
      checkValidations,
      selectedCity,
      clientName,
      getProductType,
      loadings,
      isPriceModalVisible,
      setParentState,

      //rent/buy
      formType,
      changeStatus,
      RCMFormData,
      handleRCMForm,

      propertyType,
      subTypeData,
      sizeUnit,
      size,
      //formSubmit,
      checkRentValidation,
      handleAreaClick,
      //   clientName,

      priceList,
      organizations,
      rentLoading,
      sizeUnitList,
      isBedBathModalVisible,
      modalType,
      showBedBathModal,

      isSizeModalVisible,
    } = this.props

    const { route } = this.props

    const { count, permissions } = this.props

    return (
      <ScrollView
        stickyHeaderIndices={this.state.addLeadRequirements ? [2] : [1]}
        style={{ flex: 1 }} // ref={this.scrollRef}
      >
        <>
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <TextInput
                placeholderTextColor={'#a8a8aa'}
                value={formData.firstName}
                onChangeText={(text) => {
                  handleForm(text, 'firstName')
                }}
                style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                name={'firstName'}
                placeholder={'First Name *'}
              />
              {checkValidation === true && formData.firstName === '' && (
                <ErrorMessage errorMessage={'Required'} />
              )}
            </View>
          </View>

          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <TextInput
                placeholderTextColor={'#a8a8aa'}
                value={formData.lastName}
                onChangeText={(text) => {
                  handleForm(text, 'lastName')
                }}
                style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                name={'lastName'}
                placeholder={'Last Name *'}
              />
              {checkValidation === true && formData.lastName === '' && (
                <ErrorMessage errorMessage={'Required'} />
              )}
            </View>
          </View>
          <View style={[AppStyles.mainInputWrap]}>
            {screenName === 'Payments' ? (
              <View style={[AppStyles.inputWrap]}>
                <PhoneInputComponent
                  phoneValue={
                    formData.contactNumber != '' && getTrimmedPhone(formData.contactNumber)
                  }
                  countryCodeValue={countryCode}
                  containerStyle={AppStyles.phoneInputStyle}
                  setPhone={(value) => validate(value, 'phone')}
                  setFlagObject={(object) => {
                    hello(object, 'contactNumber')
                  }}
                  editable={client ? client.assigned_to_armsuser_id === user.id : true}
                  onChangeHandle={handleForm}
                  name={'contactNumber'}
                  placeholder={'Contact Number'}
                />
                {contact1Validate == true && (
                  <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />
                )}
              </View>
            ) : (
              <View style={[AppStyles.inputWrap]}>
                <PhoneInputComponent
                  phoneValue={
                    formData.contactNumber != '' && getTrimmedPhone(formData.contactNumber)
                  }
                  countryCodeValue={countryCode}
                  containerStyle={AppStyles.phoneInputStyle}
                  setPhone={(value) => validate(value, 'phone')}
                  setFlagObject={(object) => {
                    hello(object, 'contactNumber')
                  }}
                  editable={client ? client.assigned_to_armsuser_id === user.id : true}
                  onChangeHandle={handleForm}
                  name={'contactNumber'}
                  placeholder={'Contact Number*'}
                />
                {phoneValidate == true && (
                  <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />
                )}
                {phoneValidate == false &&
                  checkValidation === true &&
                  formData.contactNumber === '' && <ErrorMessage errorMessage={'Required'} />}
              </View>
            )}
          </View>

          <Text
            style={[
              AppStyles.formFontSettings,
              AppStyles.inputPadLeft,
              {
                color: AppStyles.colors.textColor,
                fontFamily: 'OpenSans_semi_bold',
              },
            ]}
          >
            Client Source
          </Text>

          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent
                enabled={update ? false : true}
                onValueChange={handleForm}
                data={StaticData.clientTypePickerData}
                name={'clientSource'}
                placeholder="Client Source"
                selectedItem={formData.clientSource}
              />
            </View>
          </View>
        </>

        {
          <View>
            <TouchableInput
              semiBold={true}
              ref={this.AddInfoRef}
              placeholder="Additional Info"
              label={'Additional Info'}
              arrowType={this.state.openAdditionalInfo}
              onPress={() => {
                this.setState({
                  openAdditionalInfo: !this.state.openAdditionalInfo,
                  addLeadRequirements: false,
                })
                this.onPressTouch()
              }}
              value={'Additional Info'}
            />
          </View>
        }

        {this.state.openAdditionalInfo && (
          <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="always"
          >
            <View onStartShouldSetResponder={() => true}>
              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <PhoneInputComponent
                    phoneValue={formData.contact1 != '' && getTrimmedPhone(formData.contact1)}
                    countryCodeValue={countryCode1}
                    containerStyle={AppStyles.phoneInputStyle}
                    setPhone={(value) => validate(value, 'phone')}
                    setFlagObject={(object) => {
                      hello(object, 'contact1')
                    }}
                    onChangeHandle={handleForm}
                    name={'contact1'}
                    placeholder={'Contact Number 2'}
                  />
                  {contact1Validate == true && (
                    <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />
                  )}
                </View>
              </View>

              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <PhoneInputComponent
                    phoneValue={formData.contact2 != '' && getTrimmedPhone(formData.contact2)}
                    countryCodeValue={countryCode2}
                    containerStyle={AppStyles.phoneInputStyle}
                    setPhone={(value) => validate(value, 'phone')}
                    setFlagObject={(object) => {
                      hello(object, 'contact2')
                    }}
                    onChangeHandle={handleForm}
                    name={'contact2'}
                    placeholder={'Contact Number 3'}
                  />
                  {contact2Validate == true && (
                    <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />
                  )}
                </View>
              </View>
              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <TextInput
                    placeholderTextColor={'#a8a8aa'}
                    value={formData.email}
                    keyboardType="email-address"
                    autoCompleteType="email"
                    onChangeText={(text) => {
                      handleForm(text, 'email')
                    }}
                    style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                    name={'email'}
                    placeholder={'Email'}
                  />
                  {emailValidate == false && (
                    <ErrorMessage errorMessage={'Enter a Valid Email Address'} />
                  )}
                </View>
              </View>
              <View style={[AppStyles.mainInputWrap]}>
                {screenName === 'Payments' ? (
                  <View style={[AppStyles.inputWrap]}>
                    <TextInput
                      placeholderTextColor={'#a8a8aa'}
                      keyboardType={'number-pad'}
                      maxLength={15}
                      value={formData.cnic}
                      onChangeText={(text) => {
                        handleForm(text, 'cnic')
                      }}
                      style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                      name={'cnic'}
                      placeholder={'CNIC/NTN *'}
                    />
                    {cnicValidate && <ErrorMessage errorMessage={'Invalid CNIC/NTN format'} />}
                    {checkValidation && formData.cnic === '' && (
                      <ErrorMessage errorMessage={'Required'} />
                    )}
                  </View>
                ) : (
                  <View style={[AppStyles.inputWrap]}>
                    <TextInput
                      placeholderTextColor={'#a8a8aa'}
                      keyboardType={'number-pad'}
                      maxLength={13}
                      value={formData.cnic}
                      onChangeText={(text) => {
                        handleForm(text, 'cnic')
                      }}
                      style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                      name={'cnic'}
                      placeholder={'CNIC/NTN'}
                    />
                    {cnicValidate == true && (
                      <ErrorMessage errorMessage={'Invalid CNIC/NTN format'} />
                    )}
                  </View>
                )}
              </View>

              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <PickerComponent
                    onValueChange={handleForm}
                    data={StaticData.relationStatusPickerData}
                    name={'relationStatus'}
                    placeholder="S/O,D/O,W/O"
                    selectedItem={formData.relationStatus}
                  />
                </View>
              </View>

              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <TextInput
                    placeholderTextColor={'#a8a8aa'}
                    value={formData.relativeName}
                    onChangeText={(text) => {
                      handleForm(text, 'relativeName')
                    }}
                    style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                    name={'relativeName'}
                    placeholder={
                      formData.relationStatus
                        ? formData.relationStatus
                        : 'Son / Daughter/ Spouse of'
                    }
                  />
                </View>
              </View>

              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <TextInput
                    placeholderTextColor={'#a8a8aa'}
                    value={formData.passport}
                    onChangeText={(text) => {
                      handleForm(text, 'passport')
                    }}
                    style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                    name={'passport'}
                    placeholder={'Passport'}
                  />
                  {accountsOptionFields && formData.accountTitle === '' ? (
                    <ErrorMessage errorMessage={'Required'} />
                  ) : null}
                </View>
              </View>

              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <TextInput
                    placeholderTextColor={'#a8a8aa'}
                    value={formData.nationality}
                    onChangeText={(text) => {
                      handleForm(text, 'nationality')
                    }}
                    style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                    name={'nationality'}
                    placeholder={'Nationality'}
                  />
                  {accountsOptionFields && formData.accountTitle === '' ? (
                    <ErrorMessage errorMessage={'Required'} />
                  ) : null}
                </View>
              </View>

              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <TextInput
                    placeholderTextColor={'#a8a8aa'}
                    value={formData.profession}
                    onChangeText={(text) => {
                      handleForm(text, 'profession')
                    }}
                    style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                    name={'profession'}
                    placeholder={'Profession'}
                  />
                  {accountsOptionFields && formData.accountTitle === '' ? (
                    <ErrorMessage errorMessage={'Required'} />
                  ) : null}
                </View>
              </View>

              <DateTimePicker
                placeholderLabel={'Date of Birth'}
                name={'dob'}
                mode={'date'}
                iconSource={require('../../../assets/img/calendar.png')}
                date={formData.dob ? new Date(formData.dob) : new Date()}
                selectedValue={formData.dob ? helper.formatDate(formData.dob) : ''}
                handleForm={(value, name) => handleForm(value, name)}
              />

              <Text
                style={[
                  AppStyles.formFontSettings,
                  AppStyles.inputPadLeft,
                  {
                    color: AppStyles.colors.textColor,
                    fontFamily: 'OpenSans_semi_bold',
                  },
                ]}
              >
                Mailing Address
              </Text>

              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <CountriesPicker
                    handleForm={handleForm}
                    customStyle={[
                      AppStyles.formControl,
                      AppStyles.inputPadLeft,
                      { justifyContent: 'center' },
                    ]}
                    country={formData.mCountry}
                    name={'mCountry'}
                  />
                </View>
              </View>
              {formData.mCountry == 'Pakistan' ? (
                <View style={[AppStyles.mainInputWrap]}>
                  <View style={[AppStyles.inputWrap]}>
                    <PickerComponent
                      onValueChange={handleForm}
                      data={StaticData.provincePickerData}
                      name={'mProvince'}
                      placeholder="Province"
                      selectedItem={formData.mProvince}
                    />
                  </View>
                </View>
              ) : (
                <View style={[AppStyles.mainInputWrap]}>
                  <View style={[AppStyles.inputWrap]}>
                    <TextInput
                      placeholderTextColor={'#a8a8aa'}
                      value={formData.mProvince}
                      onChangeText={(text) => {
                        handleForm(text, 'mProvince')
                      }}
                      style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                      name={'mProvince'}
                      placeholder={'Province'}
                    />
                    {accountsOptionFields && formData.accountTitle === '' ? (
                      <ErrorMessage errorMessage={'Required'} />
                    ) : null}
                  </View>
                </View>
              )}

              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <TextInput
                    placeholderTextColor={'#a8a8aa'}
                    value={formData.mDistrict}
                    onChangeText={(text) => {
                      handleForm(text, 'mDistrict')
                    }}
                    style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                    name={'mDistrict'}
                    placeholder={'District'}
                  />
                  {accountsOptionFields && formData.accountTitle === '' ? (
                    <ErrorMessage errorMessage={'Required'} />
                  ) : null}
                </View>
              </View>

              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <TextInput
                    placeholderTextColor={'#a8a8aa'}
                    value={formData.mCity}
                    onChangeText={(text) => {
                      handleForm(text, 'mCity')
                    }}
                    style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                    name={'mCity'}
                    placeholder={'City'}
                  />
                  {accountsOptionFields && formData.accountTitle === '' ? (
                    <ErrorMessage errorMessage={'Required'} />
                  ) : null}
                </View>
              </View>
              <View style={[AppStyles.mainInputWrap]}>
                <Textarea
                  placeholderTextColor={AppStyles.colors.subTextColor}
                  style={[
                    AppStyles.formControl,
                    AppStyles.inputPadLeft,
                    AppStyles.formFontSettings,
                    styles.textArea,
                  ]}
                  rowSpan={5}
                  placeholder="Address"
                  onChangeText={(text) => handleForm(text, 'mAddress')}
                  value={formData.mAddress}
                />
              </View>
              <Text
                style={[
                  AppStyles.formFontSettings,
                  AppStyles.inputPadLeft,
                  {
                    color: AppStyles.colors.textColor,
                    fontFamily: 'OpenSans_semi_bold',
                  },
                ]}
              >
                Permanent Address
              </Text>
              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <CountriesPicker
                    handleForm={handleForm}
                    customStyle={[
                      AppStyles.formControl,
                      AppStyles.inputPadLeft,
                      { justifyContent: 'center' },
                    ]}
                    country={formData.country}
                    name={'country'}
                  />
                </View>
              </View>

              {formData.country == 'Pakistan' ? (
                <View style={[AppStyles.mainInputWrap]}>
                  <View style={[AppStyles.inputWrap]}>
                    <PickerComponent
                      onValueChange={handleForm}
                      data={StaticData.provincePickerData}
                      name={'province'}
                      placeholder="Province"
                      selectedItem={formData.province}
                    />
                  </View>
                </View>
              ) : (
                <View style={[AppStyles.mainInputWrap]}>
                  <View style={[AppStyles.inputWrap]}>
                    <TextInput
                      placeholderTextColor={'#a8a8aa'}
                      value={formData.province}
                      onChangeText={(text) => {
                        handleForm(text, 'province')
                      }}
                      style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                      name={'province'}
                      placeholder={'Province'}
                    />
                    {accountsOptionFields && formData.accountTitle === '' ? (
                      <ErrorMessage errorMessage={'Required'} />
                    ) : null}
                  </View>
                </View>
              )}

              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <TextInput
                    placeholderTextColor={'#a8a8aa'}
                    value={formData.district}
                    onChangeText={(text) => {
                      handleForm(text, 'district')
                    }}
                    style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                    name={'district'}
                    placeholder={'District'}
                  />
                  {accountsOptionFields && formData.accountTitle === '' ? (
                    <ErrorMessage errorMessage={'Required'} />
                  ) : null}
                </View>
              </View>

              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <TextInput
                    placeholderTextColor={'#a8a8aa'}
                    value={formData.city}
                    onChangeText={(text) => {
                      handleForm(text, 'city')
                    }}
                    style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                    name={'city'}
                    placeholder={'City'}
                  />
                  {accountsOptionFields && formData.accountTitle === '' ? (
                    <ErrorMessage errorMessage={'Required'} />
                  ) : null}
                </View>
              </View>

              {/* <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <TextInput
                    placeholderTextColor={'#a8a8aa'}
                    value={formData.accountTitle}
                    onChangeText={(text) => {
                      handleForm(text, 'accountTitle')
                    }}
                    style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                    name={'accountTitle'}
                    placeholder={'Account Title'}
                  />
                  {accountsOptionFields && formData.accountTitle === '' ? (
                    <ErrorMessage errorMessage={'Required'} />
                  ) : null}
                </View>
              </View>
              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <TextInput
                    placeholderTextColor={'#a8a8aa'}
                    value={formData.iBan}
                    onChangeText={(text) => {
                      handleForm(text, 'iBan')
                    }}
                    style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                    name={'iBan'}
                    placeholder={'IBAN'}
                  />
                  {accountsOptionFields && formData.iBan === '' ? (
                    <ErrorMessage errorMessage={'Required'} />
                  ) : null}
                </View>
              </View>
              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <TextInput
                    placeholderTextColor={'#a8a8aa'}
                    value={formData.bank}
                    onChangeText={(text) => {
                      handleForm(text, 'bank')
                    }}
                    style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                    name={'bank'}
                    placeholder={'Bank'}
                  />
                  {accountsOptionFields && formData.bank === '' ? (
                    <ErrorMessage errorMessage={'Required'} />
                  ) : null}
                </View>
              </View> */}
              <View style={[AppStyles.mainInputWrap]}>
                <Textarea
                  placeholderTextColor={AppStyles.colors.subTextColor}
                  style={[
                    AppStyles.formControl,
                    AppStyles.inputPadLeft,
                    AppStyles.formFontSettings,
                    styles.textArea,
                  ]}
                  rowSpan={5}
                  placeholder="Address"
                  onChangeText={(text) => handleForm(text, 'address')}
                  value={formData.address}
                />
              </View>
            </View>
          </ScrollView>
        )}

        <View>
          {!update && (
            <TouchableInput
              semiBold={true}
              arrowType={this.state.addLeadRequirements}
              placeholder="Add Lead Requirements"
              label={'Add Lead Requirements'}
              onPress={() => {
                this.setState({
                  addLeadRequirements: !this.state.addLeadRequirements,
                  openAdditionalInfo: false,
                })
              }}
              value={'Add Lead Requirements'}
            />
          )}

          {(formData.purpose == 'Invest' && checkValidations) ||
          (formData.purpose == 'Rent' && checkRentValidation) ||
          (formData.purpose == 'Buy' && checkRentValidation) ? (
            <ErrorMessage errorMessage={'Please fill out all required fields.'} />
          ) : null}
        </View>

        {this.state.addLeadRequirements && (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always">
            <View onStartShouldSetResponder={() => true}>
              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <PickerComponent
                    onValueChange={(value, name) => {
                      handleForm(value, name)
                      if (value == 'Buy') {
                        this.props.changeStatus('buy')
                      } else if (value == 'Rent') {
                        this.props.changeStatus('rent')
                      }
                    }}
                    data={StaticData.leadTypePickerData.filter(function (el) {
                      if (
                        !getPermissionValue(
                          PermissionFeatures.BUY_RENT_LEADS,
                          PermissionActions.CREATE,
                          permissions
                        ) &&
                        !getPermissionValue(
                          PermissionFeatures.PROJECT_LEADS,
                          PermissionActions.CREATE,
                          permissions
                        )
                      ) {
                        return el.name != 'Rent' && el.name != 'Buy' && el.name != 'Invest'
                      } else {
                        if (
                          !getPermissionValue(
                            PermissionFeatures.PROJECT_LEADS,
                            PermissionActions.CREATE,
                            permissions
                          )
                        ) {
                          return el.name != 'Invest'
                        } else if (
                          !getPermissionValue(
                            PermissionFeatures.BUY_RENT_LEADS,
                            PermissionActions.CREATE,
                            permissions
                          )
                        ) {
                          return el.name != 'Rent' && el.name != 'Buy'
                        } else return el
                      }
                    })}
                    name={'purpose'}
                    placeholder="Select lead Type"
                    selectedItem={formData.purpose}
                  />
                </View>
              </View>

              {formData.purpose == 'Invest' && (
                <CMLeadFrom
                  screenName={'AddClient'}
                  navigation={this.props.navigation}
                  hideClient={true}
                  route={route}
                  formSubmit={this.investSubmitForm}
                  checkValidation={checkValidations}
                  handleForm={handleInvestForm}
                  clientName={clientName}
                  selectedCity={selectedCity}
                  formData={investFormData}
                  getProject={getProject}
                  getProductType={getProductType}
                  loading={loadings}
                  isPriceModalVisible={isPriceModalVisible}
                  setParentState={setParentState}
                />
              )}

              {(formData.purpose == 'Buy' || formData.purpose == 'Rent') && (
                <InnerRCMForm
                  hideClient={true}
                  route={route}
                  screenName={'AddClient'}
                  navigation={this.props.navigation}
                  sizeUnitList={sizeUnitList}
                  organizations={_.clone(organizations)}
                  clientName={clientName}
                  formData={RCMFormData}
                  handleForm={handleRCMForm}
                  selectedCity={selectedCity}
                  propertyType={propertyType}
                  subTypeData={subTypeData}
                  sizeUnit={sizeUnit}
                  size={size}
                  // formSubmit={formSubmit}
                  checkValidation={checkRentValidation}
                  handleAreaClick={handleAreaClick}
                  priceList={priceList}
                  modalType={modalType}
                  loading={rentLoading}
                  isBedBathModalVisible={isBedBathModalVisible}
                  showBedBathModal={showBedBathModal}
                  isPriceModalVisible={isPriceModalVisible}
                  isSizeModalVisible={isSizeModalVisible}
                  setParentState={setParentState}
                />
              )}
            </View>
          </ScrollView>
        )}
      </ScrollView>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(DetailForm)
