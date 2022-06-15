/** @format */

import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { Button, Textarea, Body } from 'native-base'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import PickerComponent from '../../components/Picker/index'
import styles from './style'
import AppStyles from '../../AppStyles'
import LocationImg from '../../../assets/img/location.png'
import ErrorMessage from '../../components/ErrorMessage'
import RadioComponent from '../../components/RadioButton/index'
import { formatPrice } from '../../PriceFormate'
import TouchableInput from '../../components/TouchableInput'
import TouchableButton from '../../components/TouchableButton'
import PhoneInputComponent from '../../components/PhoneCountry/PhoneInput'
import { connect } from 'react-redux'
import { LogBox } from 'react-native'
import MyCheckBox from '../../components/MyCheckBox'
const { width } = Dimensions.get('window')

LogBox.ignoreLogs(['VirtualizedLists should never be nested'])

class DetailForm extends Component {
  constructor(props) {
    super(props)
  }

  renderImageTile = (item) => {
    const { deleteImage } = this.props
    return (
      <View style={styles.backGroundImg}>
        <AntDesign
          style={styles.close}
          name="closecircle"
          size={26}
          onPress={(e) => deleteImage(item.id)}
        />
        <Image source={{ uri: item.uri }} style={{ width: 120, height: 120 }} borderRadius={5} />
      </View>
    )
  }

  getItemLayout = (data, index) => {
    let length = width / 2
    return { length, offset: length * index, index }
  }

  _getYears = () => {
    var min = 1947
    var max = new Date().getFullYear()
    this.years = []
    for (var i = min; i <= max; i++) {
      this.years.push({ value: i, name: i.toString() })
    }
    return this.years.reverse()
  }

  _renderAdditionalView = () => {
    const { formData, handleForm, features, utilities, facing, selectedFeatures, handleFeatures } =
      this.props
    let _renderFeatures = () => {
      return features.map((item) => {
        return (
          <TouchableOpacity
            key={item.toString()}
            onPress={() => handleFeatures(item)}
            style={styles.featureOpacity}
          >
            <MyCheckBox
              onPress={() => handleFeatures(item)}
              status={selectedFeatures.includes(item) ? true : false}
            />
            <Body style={{ alignItems: 'flex-start' }}>
              <Text style={{ marginLeft: 10 }}>{item}</Text>
            </Body>
          </TouchableOpacity>
        )
      })
    }
    let _renderBeds = () => {
      var min = 0
      var max = 30
      this.beds = []
      for (var i = min; i <= max; i++) {
        if (i == 0 || i == 1) this.beds.push({ name: i.toString() + ' Bedroom', value: i })
        else this.beds.push({ name: i.toString() + ' Bedrooms', value: i })
      }
      return this.beds
    }
    let _renderBaths = () => {
      var min = 0
      var max = 30
      this.baths = []
      for (var i = min; i <= max; i++) {
        if (i == 0 || i == 1) this.baths.push({ name: i.toString() + ' Bathroom', value: i })
        else this.baths.push({ name: i.toString() + ' Bathrooms', value: i })
      }
      return this.baths
    }
    let _renderParkings = () => {
      var min = 0
      var max = 30
      this.parkings = []
      for (var i = min; i <= max; i++) {
        if (i == 0 || i == 1)
          this.parkings.push({ name: i.toString() + ' Parking Space', value: i })
        else this.parkings.push({ name: i.toString() + ' Parking Spaces', value: i })
      }
      return this.parkings
    }
    let _renderFloors = () => {
      var min = 0
      var max = 30
      this.floors = []
      for (var i = min; i <= max; i++) {
        if (i == 0 || i == 1) this.floors.push({ name: i.toString() + ' Floor', value: i })
        else this.floors.push({ name: i.toString() + ' Floors', value: i })
      }
      return this.floors
    }

    let _renderUtilities = () => {
      return utilities.map((item) => {
        return (
          <TouchableOpacity
            key={item.toString()}
            onPress={() => handleFeatures(item)}
            style={styles.featureOpacity}
          >
            <MyCheckBox
              onPress={() => handleFeatures(item)}
              status={selectedFeatures.includes(item) ? true : false}
            />
            <Body style={{ alignItems: 'flex-start' }}>
              <Text style={{ marginLeft: 10 }}>{item}</Text>
            </Body>
          </TouchableOpacity>
        )
      })
    }

    let _renderFacing = () => {
      return facing.map((item) => {
        return (
          <TouchableOpacity
            key={item.toString()}
            onPress={() => handleFeatures(item)}
            style={styles.featureOpacity}
          >
            <MyCheckBox
              onPress={() => handleFeatures(item)}
              status={selectedFeatures.includes(item) ? true : false}
            />
            <Body style={{ alignItems: 'flex-start' }}>
              <Text style={{ marginLeft: 10 }}>{item}</Text>
            </Body>
          </TouchableOpacity>
        )
      })
    }

    return (
      <View style={styles.additionalViewMain}>
        <Text style={styles.headings}>General Info</Text>
        {formData.type === 'plot' ? null : (
          <View style={[AppStyles.mainInputWrap]}>
            <PickerComponent
              data={this._getYears()}
              onValueChange={handleForm}
              clearOnChange={true}
              selectedItem={formData.year_built}
              name={'year_built'}
              placeholder="Build Year"
            />
          </View>
        )}
        {formData.type === 'residential' ? (
          <>
            <View style={[AppStyles.mainInputWrap]}>
              <PickerComponent
                data={_renderBeds()}
                onValueChange={handleForm}
                clearOnChange={true}
                selectedItem={formData.bed}
                name={'bed'}
                placeholder="Select Total Bed(s)"
              />
            </View>

            <View style={[AppStyles.mainInputWrap]}>
              <PickerComponent
                data={_renderBaths()}
                onValueChange={handleForm}
                clearOnChange={true}
                selectedItem={formData.bath}
                name={'bath'}
                placeholder="Select Total Bath(s)"
              />
            </View>

            <View style={[AppStyles.mainInputWrap]}>
              <PickerComponent
                data={_renderParkings()}
                onValueChange={handleForm}
                clearOnChange={true}
                selectedItem={formData.parking_space}
                name={'parking_space'}
                placeholder="Select Total Parking Space(s)"
              />
            </View>
          </>
        ) : null}
        {formData.type === 'commercial' ? (
          <View style={[AppStyles.mainInputWrap]}>
            <PickerComponent
              data={_renderFloors()}
              onValueChange={handleForm}
              clearOnChange={true}
              selectedItem={formData.floors}
              name={'floors'}
              placeholder="Select Total Floor(s)"
            />
          </View>
        ) : null}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              onChangeText={(text) => {
                handleForm(text, 'downpayment')
              }}
              value={formData.downpayment && String(formData.downpayment)}
              placeholderTextColor={'#a8a8aa'}
              keyboardType="numeric"
              style={[AppStyles.formControl, AppStyles.inputPadLeft]}
              placeholder={'Down Payment is PKR (if any)'}
            />
          </View>
        </View>
        <Text style={[styles.headings, { marginBottom: 10 }]}>Property Features</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{_renderFeatures()}</View>
        <Text style={[styles.headings, { marginBottom: 10 }]}>Utilities</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{_renderUtilities()}</View>
        <Text style={[styles.headings, { marginBottom: 10 }]}>Facing</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{_renderFacing()}</View>
      </View>
    )
  }

  render() {
    const {
      formSubmit,
      checkValidation,
      handleForm,
      formData,
      propertyType,
      selectSubType,
      price,
      selectedCity,
      handleCityClick,
      selectedArea,
      handleAreaClick,
      sizeUnit,
      selectedGrade,
      purpose,
      getCurrentLocation,
      getImagesFromGallery,
      takePhotos,
      longitude,
      latitude,
      buttonText,
      images,
      imageLoading,
      showAdditional,
      showAdditionalInformation,
      loading,
      handleWaterMark,
      showCustomTitle,
      showCustomTitleField,
      setFlagObject,
      getTrimmedPhone,
      countryCode,
      countryCode1,
      phoneValidate,
      pocPhoneValidate,
      handleMarkProperty,
    } = this.props

    const { size_unit } = this.props.formData
    return (
      <View>
        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent
              onValueChange={handleForm}
              data={propertyType}
              selectedItem={formData.type}
              name={'type'}
              placeholder="Property Type"
            />
            {checkValidation === true && formData.type === '' && (
              <ErrorMessage errorMessage={'Required'} />
            )}
          </View>
        </View>

        {/* **************************************** */}
        {formData.type ? (
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent
                onValueChange={handleForm}
                data={selectSubType}
                selectedItem={formData.subtype}
                name={'subtype'}
                placeholder="Property Sub Type"
              />
              {checkValidation === true && formData.subtype === '' && (
                <ErrorMessage errorMessage={'Required'} />
              )}
            </View>
          </View>
        ) : null}

        {/* **************************************** */}

        <TouchableInput
          placeholder="Select City"
          onPress={() => handleCityClick()}
          value={selectedCity ? selectedCity.name : ''}
          showError={checkValidation === true && formData.city_id === ''}
          errorMessage="Required"
        />
        {/* **************************************** */}

        <TouchableInput
          placeholder="Select Area"
          onPress={() => handleAreaClick()}
          value={selectedArea ? selectedArea.name : ''}
          showError={checkValidation === true && formData.area_id === ''}
          errorMessage="Required"
        />

        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              onChangeText={(text) => {
                handleForm(text, 'address')
              }}
              placeholderTextColor={'#a8a8aa'}
              value={formData.address}
              style={[AppStyles.formControl, AppStyles.inputPadLeft]}
              placeholder={'Address'}
            />
          </View>
        </View>
        {/* **************************************** */}
        <TouchableOpacity
          onPress={() => handleMarkProperty(!formData.show_address)}
          style={styles.checkBoxRow}
        >
          <MyCheckBox
            status={formData.locate_manually ? true : false}
            onPress={() => handleMarkProperty(!formData.locate_manually)}
          />
          <Text style={{ marginHorizontal: 15 }}>Mark property manually</Text>
        </TouchableOpacity>

        {/* **************************************** */}

        {formData.locate_manually ? (
          <View style={AppStyles.latLngMain}>
            <View
              style={[
                AppStyles.mainInputWrap,
                AppStyles.noMargin,
                AppStyles.borderrightLat,
                { width: '50%' },
              ]}
            >
              <View style={[AppStyles.inputWrap]}>
                <TextInput
                  placeholderTextColor={'#a8a8aa'}
                  onChangeText={(text) => {
                    handleForm(text, 'lat')
                  }}
                  value={latitude === null ? '' : String(latitude)}
                  style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                  keyboardType="numeric"
                  placeholder={'Latitude'}
                />
              </View>
            </View>

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap, AppStyles.noMargin, { width: '50%' }]}>
              <View style={[AppStyles.inputWrap]}>
                <TextInput
                  placeholderTextColor={'#a8a8aa'}
                  onChangeText={(text) => {
                    handleForm(text, 'lon')
                  }}
                  value={longitude === null ? '' : String(longitude)}
                  style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                  keyboardType="numeric"
                  placeholder={'Longitude'}
                />
              </View>
            </View>
            <TouchableOpacity style={AppStyles.locationBtn} onPress={() => getCurrentLocation()}>
              <Image source={LocationImg} style={AppStyles.locationIcon} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableButton
              containerStyle={[AppStyles.mainInputWrap, styles.geotagButton, { width: '100%' }]}
              containerBackgroundColor={'white'}
              textColor={AppStyles.colors.primaryColor}
              label={formData.propsure_id ? 'GEO TAGGED' : 'GEO TAGGING'}
              iconName="ios-checkmark-circle-outline"
              showIcon={formData.propsure_id ? true : false}
              onPress={() => {
                this.props.navigation.navigate('MapContainer', {
                  mapValues: {
                    lat: formData.lat,
                    lng: formData.lon,
                    propsure_id: formData.propsure_id,
                  },
                  screenName: 'EditFieldAppProperty',
                })
              }}
            />
          </View>
        )}

        {/* **************************************** */}
        <View style={AppStyles.multiFormInput}>
          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap, AppStyles.flexOne]}>
            <View style={[AppStyles.inputWrap]}>
              <TextInput
                placeholderTextColor={'#a8a8aa'}
                onChangeText={(text) => {
                  handleForm(text, 'size')
                }}
                value={formData.size == 0 ? '' : String(formData.size)}
                keyboardType="numeric"
                style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                name={'size'}
                placeholder={'Size'}
              />
              {checkValidation === true && formData.size === 0 && (
                <ErrorMessage errorMessage={'Required'} />
              )}
            </View>
          </View>

          {/* **************************************** */}
          <View style={[AppStyles.mainInputWrap, AppStyles.flexOne, AppStyles.flexMarginRight]}>
            <View style={[AppStyles.inputWrap]}>
              <PickerComponent
                onValueChange={handleForm}
                name={'size_unit'}
                selectedItem={size_unit}
                data={sizeUnit}
                placeholder="Size Unit"
              />
              {checkValidation === true && formData.size_unit === '' && (
                <ErrorMessage errorMessage={'Required'} />
              )}
            </View>
          </View>
        </View>

        {/* **************************************** */}

        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent
              onValueChange={handleForm}
              data={purpose}
              selectedItem={formData.purpose}
              name={'purpose'}
              placeholder="Available for"
            />
            {checkValidation === true && formData.purpose === '' && (
              <ErrorMessage errorMessage={'Required'} />
            )}
          </View>
        </View>

        {/* **************************************** */}

        <View style={[AppStyles.latLngMain]}>
          {/* **************************************** */}
          <View style={[{ width: '75%' }, AppStyles.mainInputWrap, AppStyles.noMargin]}>
            <View style={[AppStyles.inputWrap]}>
              <TextInput
                placeholderTextColor={'#a8a8aa'}
                onChangeText={(text) => {
                  handleForm(text, 'price')
                }}
                value={price === 0 ? '' : String(price)}
                keyboardType="number-pad"
                style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                placeholder={'Demand Price'}
              />
            </View>
          </View>
          {/* **************************************** */}

          <Text style={[styles.countPrice, { textAlignVertical: 'center' }]}>
            {price ? formatPrice(price) : ''}
          </Text>
        </View>

        <View style={[AppStyles.mainInputWrap]}>
          <Textarea
            placeholderTextColor={'#a8a8aa'}
            style={[
              AppStyles.formControl,
              Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
              AppStyles.formFontSettings,
              { height: 100, paddingTop: 10 },
            ]}
            rowSpan={5}
            placeholder="Description"
            onChangeText={(text) => handleForm(text, 'description')}
            value={formData.description}
          />
        </View>

        {/* **************************************** */}
        <TouchableOpacity
          onPress={showCustomTitleField}
          style={[AppStyles.mainInputWrap, styles.additonalViewContainer]}
        >
          <Text style={styles.additionalInformationText}>
            {showCustomTitle ? 'Use System Generated Title' : 'Add a Custom Title'}
          </Text>
          <View style={styles.additionalDetailsIconView}>
            <Ionicons
              name={showCustomTitle ? 'ios-close-circle-outline' : 'ios-add-circle-outline'}
              size={30}
              color={AppStyles.colors.textColor}
            />
          </View>
        </TouchableOpacity>

        {showCustomTitle ? (
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <TextInput
                onChangeText={(text) => {
                  handleForm(text, 'custom_title')
                }}
                placeholderTextColor={'#a8a8aa'}
                value={formData.custom_title}
                style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                placeholder={'Enter Custom title'}
              />
            </View>
          </View>
        ) : null}

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          {images.length > 0 ? (
            <View style={styles.imageContainerStyle}>
              <FlatList
                data={images}
                numColumns={2}
                renderItem={({ item }) => this.renderImageTile(item)}
                keyExtractor={(element, index) => index.toString()}
                getItemLayout={this.getItemLayout}
              />
              {
                <View style={{ flexDirection: 'row', marginHorizontal: 15 }}>
                  <TouchableOpacity
                    disabled={imageLoading}
                    style={[styles.addMoreImg, styles.extraAddMore]}
                    onPress={getImagesFromGallery}
                  >
                    <Text style={styles.uploadImageText}>Add More From Gallery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={imageLoading}
                    style={[styles.addMoreImg, styles.extraAddMore]}
                    onPress={takePhotos}
                  >
                    <Text style={styles.uploadImageText}>Take Photos</Text>
                  </TouchableOpacity>
                </View>
              }
            </View>
          ) : (
            <View style={styles.uploadImg}>
              <Button
                style={[AppStyles.formBtn, styles.buttonWidth]}
                onPress={getImagesFromGallery}
              >
                <Text style={AppStyles.btnText}>Upload From Gallery</Text>
              </Button>
              <Text style={{ marginVertical: 15 }}>OR</Text>
              <Button style={[AppStyles.formBtn, styles.buttonWidth]} onPress={takePhotos}>
                <Text style={AppStyles.btnText}>Take Photos</Text>
              </Button>
            </View>
          )}
        </View>

        {/* **************************************** */}

        {/* <View style={[AppStyles.multiFormInput, styles.radioComponentStyle]}>
          <RadioComponent
            onGradeSelected={(val) => handleForm(val, 'grade')}
            selected={selectedGrade === 'Grade A' ? true : false}
            value="Grade A"
          >
            Grade A
          </RadioComponent>
          <RadioComponent
            onGradeSelected={(val) => handleForm(val, 'grade')}
            selected={selectedGrade === 'Grade B' ? true : false}
            value="Grade B"
          >
            Grade B
          </RadioComponent>
          <RadioComponent
            onGradeSelected={(val) => handleForm(val, 'grade')}
            selected={selectedGrade === 'Grade C' ? true : false}
            value="Grade C"
          >
            Grade C
          </RadioComponent>
        </View> */}

        {formData.type ? (
          <TouchableOpacity
            onPress={showAdditionalInformation}
            style={[AppStyles.mainInputWrap, styles.additonalViewContainer]}
          >
            <Text style={styles.additionalInformationText}>Additional Details</Text>
            <View style={styles.additionalDetailsIconView}>
              <Ionicons
                name={showAdditional ? 'ios-close-circle-outline' : 'ios-add-circle-outline'}
                size={30}
                color={AppStyles.colors.textColor}
              />
            </View>
          </TouchableOpacity>
        ) : null}

        {showAdditional ? this._renderAdditionalView() : null}

        {/* **************************************** */}
        <Text style={AppStyles.mainInputWrap}>Owner Name</Text>
        <View style={[AppStyles.inputWrap]}>
          <TextInput
            onChangeText={(text) => {
              handleForm(text, 'owner_name')
            }}
            placeholderTextColor={'#a8a8aa'}
            value={formData.owner_name}
            style={[AppStyles.formControl, AppStyles.inputPadLeft]}
            placeholder={'Onwer Name'}
          />
        </View>

        {/* **************************************** */}

        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <Text style={AppStyles.mainInputWrap}>Owner Phone</Text>
            <PhoneInputComponent
              phoneValue={
                formData.owner_phone != '' &&
                formData.owner_phone != null &&
                getTrimmedPhone(formData.owner_phone.replace('+92', ''))
              }
              countryCodeValue={countryCode}
              setFlagObject={(object) => {
                setFlagObject(object, 'owner_phone')
              }}
              onChangeHandle={handleForm}
              name={'owner_phone'}
              placeholder={'Owner Phone*'}
            />
            {phoneValidate == true && <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />}
            {phoneValidate == false &&
              checkValidation === true &&
              formData.owner_phone === '' &&
              formData.owner_phone === null && <ErrorMessage errorMessage={'Required'} />}
          </View>
        </View>

        {/* **************************************** */}
        <Text style={AppStyles.mainInputWrap}>Point of Contact Name</Text>
        <View style={[AppStyles.inputWrap]}>
          <TextInput
            onChangeText={(text) => {
              handleForm(text, 'poc_name')
            }}
            placeholderTextColor={'#a8a8aa'}
            value={formData.poc_name}
            style={[AppStyles.formControl, AppStyles.inputPadLeft]}
            placeholder={'Point of Contact Name'}
          />
        </View>

        {/* **************************************** */}

        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <Text style={AppStyles.mainInputWrap}>Point of Contact Phone</Text>
            <PhoneInputComponent
              phoneValue={
                formData.poc_phone != '' &&
                formData.poc_phone != null &&
                getTrimmedPhone(formData.poc_phone.replace('+92', ''))
              }
              countryCodeValue={countryCode1}
              setFlagObject={(object) => {
                setFlagObject(object, 'poc_phone')
              }}
              onChangeHandle={handleForm}
              name={'poc_phone'}
              placeholder={'Point of Contact Phone'}
            />
            {pocPhoneValidate == true && (
              <ErrorMessage errorMessage={'Enter a Valid Phone Number'} />
            )}

            {pocPhoneValidate == false &&
              checkValidation === true &&
              formData.poc_phone === '' &&
              formData.poc_phone === null && <ErrorMessage errorMessage={'Required'} />}
          </View>
        </View>

        {/* **************************************** */}
        {/* **************************************** */}
        <TouchableOpacity
          onPress={() => handleWaterMark(!formData.showWaterMark)}
          style={[styles.checkBoxRow]}
        >
          <MyCheckBox
            status={formData.showWaterMark ? true : false}
            onPress={() => handleWaterMark(!formData.showWaterMark)}
          />
          <Text style={{ marginHorizontal: 15 }}>Show Watermark on Images</Text>
        </TouchableOpacity>

        {/* **************************************** */}
        <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
            label={buttonText}
            onPress={() => formSubmit()}
            loading={imageLoading || loading}
          />
        </View>
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    images: store.property.images,
    imageLoading: store.property.imageLoader,
  }
}

export default connect(mapStateToProps)(DetailForm)
