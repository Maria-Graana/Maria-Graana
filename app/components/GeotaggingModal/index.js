/** @format */

import React from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import Modal from 'react-native-modal'
import AppStyles from '../../AppStyles'
import TouchableButton from '../TouchableButton'
import LocationImg from '../../../assets/img/location.png'
import { apps } from 'firebase'
import MyCheckBox from '../MyCheckBox'

const GeoTaggingModal = ({
  isGeoTaggingModalVisible,
  hideGeoTaggingModal,
  handleMarkProperty,
  locate_manually,
  latitude,
  longitude,
  propsure_id,
  getCurrentLocation,
  handleLatLngChange,
  propertyGeoTaggingDone,
  goToMapsForGeotagging,
}) => {
  return (
    <Modal isVisible={isGeoTaggingModalVisible}>
      <View style={[styles.modalMain]}>
        {/* **************************************** */}
        <TouchableOpacity
          onPress={() => handleMarkProperty(!locate_manually)}
          style={styles.checkBoxRow}
        >
          <MyCheckBox
            status={locate_manually ? true : false}
            onPress={() => handleMarkProperty(!locate_manually)}
          />
          <Text
            style={{
              marginHorizontal: 15,
              color: AppStyles.colors.textColor,
              fontFamily: AppStyles.fonts.semiBoldFont,
              fontSize: AppStyles.fontSize.medium,
            }}
          >
            Mark property manually
          </Text>
        </TouchableOpacity>
        {/* **************************************** */}

        {locate_manually ? (
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
                    handleLatLngChange(text, 'lat')
                  }}
                  value={latitude === null ? '' : latitude ? Number(latitude).toFixed(7) : ''}
                  style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                  keyboardType="numeric"
                  placeholder={'Latitude'}
                  editable={false}
                />
              </View>
            </View>

            {/* **************************************** */}
            <View style={[AppStyles.mainInputWrap, AppStyles.noMargin, { width: '50%' }]}>
              <View style={[AppStyles.inputWrap]}>
                <TextInput
                  placeholderTextColor={'#a8a8aa'}
                  onChangeText={(text) => {
                    handleLatLngChange(text, 'lng')
                  }}
                  value={longitude === null ? '' : longitude ? Number(longitude).toFixed(7) : ''}
                  style={[AppStyles.formControl, AppStyles.inputPadLeft]}
                  keyboardType="numeric"
                  placeholder={'Longitude'}
                  editable={false}
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
              label={propsure_id ? 'GEO TAGGED' : 'GEO TAGGING'}
              iconName="ios-checkmark-circle-outline"
              showIcon={propsure_id ? true : false}
              onPress={() => goToMapsForGeotagging()}
            />
          </View>
        )}
        <View style={styles.buttonContainer}>
          <TouchableButton
            containerStyle={[styles.buttonStyle, { marginRight: 10 }]}
            label={'CANCEL'}
            loading={false}
            fontSize={14}
            fontFamily={AppStyles.fonts.boldFont}
            onPress={() => hideGeoTaggingModal()}
          />
          <TouchableButton
            containerStyle={[styles.buttonStyle]}
            label={'DONE'}
            loading={false}
            fontSize={14}
            fontFamily={AppStyles.fonts.boldFont}
            onPress={() => propertyGeoTaggingDone()}
          />
        </View>
      </View>
    </Modal>
  )
}

export default GeoTaggingModal

const styles = StyleSheet.create({
  modalMain: {
    backgroundColor: '#e7ecf0',
    borderRadius: 7,
    overflow: 'hidden',
    zIndex: 5,
    position: 'relative',
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  buttonStyle: {
    borderColor: '#006ff1',
    backgroundColor: '#006ff1',
    width: '30%',
    borderRadius: 4,
    borderWidth: 1,
    color: '#006ff1',
    textAlign: 'center',
    borderRadius: 4,
    marginBottom: 0,
    justifyContent: 'center',
    minHeight: 40,
  },
  geotagButton: {
    justifyContent: 'center',
    minHeight: 55,
    borderRadius: 4,
    padding: 15,
  },
  checkBox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    marginRight: 10,
  },
  checkBoxMargin: {
    marginRight: 10,
  },
  buttonWidth: {
    width: '80%',
  },
  checkBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
})
