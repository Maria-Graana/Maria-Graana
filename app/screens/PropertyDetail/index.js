/** @format */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import axios from 'axios'
import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import _ from 'underscore'
import AppStyles from '../../AppStyles'
import Loader from '../../components/loader'
import TouchableButton from '../../components/TouchableButton'
import helper from '../../helper'
import styles from './style'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'

const PlaceHolderImage = require('../../../assets/img/img-3.png')

class PropertyDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      property: props.route.params.property ? props.route.params.property : null,
      loading: true,
    }
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchProperty()
    })
  }

  navigateTo = () => {
    const { route, navigation } = this.props
    const { property, update, screenName } = route.params
    if (screenName === 'FieldsInventories') {
      navigation.navigate('EditFieldAppProperty', {
        property: property,
        update: update,
      })
    } else {
      navigation.navigate('AddInventory', {
        property: property,
        update: update,
      })
    }
  }

  fetchProperty = () => {
    const { route, navigation } = this.props
    const { screenName, screen } = route.params
    const { property } = this.state
    let url = ''
    if (screenName === 'FieldsInventories' || screenName === 'GraanaInventories') {
      // calling different api in case of field app and graana inventories, fetching graana/ field app property
      url = `/api/inventory/portalproperty?id=${property.id}`
    } else {
      url = `/api/inventory/${property.id}` // for getting normal arms property
      if ('screen' in route.params) {
        if (screen === 'LeadDetail') {
          url = `/api/inventory/${property.arms_id}` // for shortlist properties, call this url
        }
      }
    }

    axios
      .get(url)
      .then((res) => {
        this.setState({ property: res.data, loading: false })
      })
      .catch((error) => {
        console.log('ERROR API: /api/inventory/', error)
      })
  }

  checkUserName = (property) => {
    if (property && property.customer) {
      if (property.customer.first_name && property.customer.last_name) {
        return property.customer.first_name + ' ' + property.customer.last_name
      } else if (property && property.customer.first_name) {
        return property.customer.first_name
      }
    } else {
      return ''
    }
  }

  approveProperty = (id) => {
    const { navigation } = this.props
    let url = `/api/inventory/fieldProperty?id=${id}`
    this.setState({ loading: true }, () => {
      axios
        .patch(url)
        .then((res) => {
          helper.successToast('PROPERTY APPROVED!')
          navigation.navigate('InventoryTabs', {
            screen: 'Field App',
            params: { screen: 'InventoryTabs' },
          })
        })
        .catch((error) => {
          console.log('ERROR API: /api/inventory/fieldProperty', error)
        })
        .finally(() => {
          this.setState({ loading: false })
        })
    })
  }

  updatePermission = () => {
    const { permissions } = this.props
    return getPermissionValue(PermissionFeatures.PROPERTIES, PermissionActions.UPDATE, permissions)
  }

  render() {
    const { loading, property } = this.state
    const { route, navigation } = this.props
    const { editButtonHide, screenName } = route.params
    let type = ''
    let subtype = ''
    let areaName = ''
    let propertyAddress = ''
    let cityName = ''
    let size = ''
    let sizeUnit = ''
    let purpose = ''
    let demandPrice = ''
    let description = ''
    let grade = ''
    let lattitude = ''
    let longitude = ''
    let ownerName = ''
    let ownerPhoneNumber = ''
    let address = ''
    let images = ''
    let parsedFeatures = ''
    let amentities = ''
    let yearBuilt = ''
    let parkingSpace = ''
    let downPayment = ''
    let floors = ''
    let pocName = ''
    let pocPhone = ''
    let riderName = ''
    let riderPhone = ''
    let rider = null
    let riderCustomeTile = ''
    let updatePermission = this.updatePermission()

    if (!loading) {
      type = property && property.type.charAt(0).toUpperCase() + property.type.slice(1)
      subtype = property && property.subtype.charAt(0).toUpperCase() + property.subtype.slice(1)
      areaName = property && property.area.name
      propertyAddress = property && property.address
      cityName = property && property.city.name
      size = property && property.size
      sizeUnit =
        property && property.size_unit.charAt(0).toUpperCase() + property.size_unit.slice(1)
      purpose = property && property.purpose.charAt(0).toUpperCase() + property.purpose.slice(1)
      demandPrice = property && property.price
      description = property && property.description

      grade =
        (property && property.grade && property.grade === null) ||
        (property && property.grade === '')
          ? ''
          : property && property.grade
      lattitude = property && property.lat === null ? '' : property.lat.toFixed(7) + '/'
      longitude =
        property && (property.lng === null || property.lon === null)
          ? ''
          : property && property.lng && property.lng.toFixed(7)
          ? property && property.lng && property.lng.toFixed(7)
          : property && property.lon && property.lon.toFixed(7)
      ownerName = this.checkUserName(property)
      ownerPhoneNumber =
        property && property.customer && property.customer.phone && property.customer.phone.trim()
      address =
        property && property.customer && property.customer.address && property.customer.address
      pocName = property && property.poc_name ? property.poc_name : ''
      pocPhone = property && property.poc_phone ? property.poc_phone : ''
      images = property && property.armsPropertyImages
      parsedFeatures = JSON.parse(property && property.features)
      amentities = _.isEmpty(parsedFeatures) ? [] : _.keys(parsedFeatures)
      if (amentities.length) {
        amentities = _.map(amentities, (amentity) =>
          amentity
            .split('_')
            .join(' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())
        )
        amentities = _.without(amentities, 'Year Built', 'Floors', 'Downpayment', 'Parking Space')
      }
      yearBuilt = parsedFeatures && parsedFeatures.year_built ? parsedFeatures.year_built : null
      parkingSpace =
        parsedFeatures && parsedFeatures.parking_space ? parsedFeatures.parking_space : null
      downPayment = parsedFeatures && parsedFeatures.downpayment ? parsedFeatures.downpayment : null
      floors = parsedFeatures && parsedFeatures.floors ? parsedFeatures.floors : null
      rider = property && property.rider ? property.rider : null
      if (rider) {
        if (rider.phone) riderPhone = rider.phone
        if (rider.first_name) riderName = rider.first_name
        if (rider.last_name) riderName = riderName + ' ' + rider.last_name
      }
      riderCustomeTile = property && property.title ? property.title : null
    }

    return !loading ? (
      <ScrollView
        style={[
          AppStyles.container,
          styles.container,
          { backgroundColor: AppStyles.colors.backgroundColor },
        ]}
      >
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            {riderCustomeTile ? (
              <>
                <Text style={styles.headingText}> Customer Title </Text>
                <Text style={styles.labelText}> {riderCustomeTile} </Text>
              </>
            ) : null}
            <Text style={styles.headingText}> Property Type </Text>
            <Text style={styles.labelText}> {type} </Text>
            <Text style={styles.headingText}> Property Sub Type </Text>
            <Text style={styles.labelText}> {subtype + ', ' + type} </Text>
            <Text style={styles.headingText}> Area </Text>
            <Text style={styles.labelText}> {areaName} </Text>
            {propertyAddress ? (
              <>
                <Text style={styles.headingText}> Address </Text>
                <Text style={styles.labelText}> {propertyAddress} </Text>
              </>
            ) : null}

            <Text style={styles.headingText}> City </Text>
            <Text style={styles.labelText}> {cityName} </Text>
            <Text style={styles.headingText}> Size/Unit </Text>
            <Text style={styles.labelText}> {size + ' ' + sizeUnit + ' ' + subtype} </Text>
            <Text style={styles.headingText}> Available for </Text>
            <Text style={styles.labelText}> {purpose} </Text>
            <Text style={styles.headingText}> Demand Price </Text>
            <Text style={styles.labelText}> {helper.checkPrice(demandPrice, true)} </Text>
            {description ? (
              <>
                <Text style={styles.headingText}> Description </Text>
                <Text style={styles.labelText}> {helper.removeHtmlTags(description)} </Text>
              </>
            ) : null}

            {images && images.length && screenName !== 'FieldsInventories' ? (
              <Text style={styles.headingText}> Images </Text>
            ) : null}
            <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row' }}>
              {images && images.length
                ? images.map((item, index) => {
                    return (
                      <Image key={index} source={{ uri: item.url }} style={[styles.imageStyle]} />
                    )
                  })
                : null}
            </View>

            {grade ? (
              <View>
                <Text style={styles.headingText}> Grade </Text>
                <Text style={styles.labelText}> {grade} </Text>
              </View>
            ) : null}

            {type === 'Residential' && (
              <View>
                <Text style={styles.headingText}> Beds </Text>
                <Text style={styles.labelText}>
                  {' '}
                  {property.bed === null ? '0' + ' Bed(s)' : String(property.bed) + ' Bed(s)'}{' '}
                </Text>
                <Text style={styles.headingText}> Baths </Text>
                <Text style={styles.labelText}>
                  {' '}
                  {property.bath === null
                    ? '0' + ' Bath(s)'
                    : String(property.bath) + ' Bath(s)'}{' '}
                </Text>
                {parkingSpace ? (
                  <>
                    <Text style={styles.headingText}> Parking </Text>
                    <Text style={styles.labelText}>
                      {' '}
                      {String(parkingSpace) + ' Parking Space(s)'}{' '}
                    </Text>
                  </>
                ) : null}
                {yearBuilt ? (
                  <>
                    <Text style={styles.headingText}> Year Built </Text>
                    <Text style={styles.labelText}> {String(yearBuilt)} </Text>
                  </>
                ) : null}
              </View>
            )}
            {type === 'plot' && (
              <View>
                {floors ? (
                  <>
                    <Text style={styles.headingText}> Floor </Text>
                    <Text style={styles.labelText}> {String(floors)} </Text>
                  </>
                ) : null}
              </View>
            )}

            {downPayment ? (
              <>
                <Text style={styles.headingText}> Down Payment </Text>
                <Text style={styles.labelText}> {helper.checkPrice(downPayment, true)} </Text>
              </>
            ) : null}

            {lattitude || longitude ? (
              <View>
                <Text style={styles.headingText}> Lattitude/Longitude </Text>
                <Text style={styles.labelText} numberOfLines={1}>
                  {' '}
                  {lattitude + longitude}{' '}
                </Text>
              </View>
            ) : null}
            {ownerName ? (
              <View>
                <Text style={styles.headingText}> Owner Name </Text>
                <Text style={styles.labelText}> {ownerName} </Text>
              </View>
            ) : null}
            {ownerPhoneNumber ? (
              <View>
                <Text style={styles.headingText}> Owner Number </Text>
                <Text style={styles.labelText}> {ownerPhoneNumber}</Text>
              </View>
            ) : null}
            {address ? (
              <View>
                <Text style={styles.headingText}> Owner Address </Text>
                <Text style={styles.labelText}> {address}</Text>
              </View>
            ) : null}
            {pocName ? (
              <View>
                <Text style={styles.headingText}>Point of Contact Name </Text>
                <Text style={styles.labelText}> {pocName}</Text>
              </View>
            ) : null}
            {pocPhone ? (
              <View>
                <Text style={styles.headingText}> Point of Contact Phone </Text>
                <Text style={styles.labelText}> {pocPhone}</Text>
              </View>
            ) : null}
            {rider ? (
              <View>
                <Text style={styles.headingText}> Added By Contact Name </Text>
                <Text style={styles.labelText}> {riderName}</Text>
              </View>
            ) : null}
            {rider ? (
              <View>
                <Text style={styles.headingText}> Added By Contact Phone </Text>
                <Text style={styles.labelText}> {riderPhone}</Text>
              </View>
            ) : null}
            <View>
              <Text style={styles.headingText}> ID </Text>
              <Text style={styles.labelText}> {property && property.id}</Text>
            </View>
            {amentities && amentities.length ? (
              <>
                <Text style={styles.headingText}> Property Features </Text>
                {
                  <FlatList
                    data={amentities}
                    keyExtractor={(item) => item.toString()}
                    scrollEnabled={false}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <View key={item.toString()} style={styles.featureOpacity}>
                        <Ionicons
                          name="ios-checkmark-circle-outline"
                          size={24}
                          color={AppStyles.colors.primaryColor}
                        />
                        <Text style={[styles.featureText, { padding: 5 }]}>{item}</Text>
                      </View>
                    )}
                  />
                }
              </>
            ) : null}
          </View>
          {editButtonHide === false && (
            <View style={styles.pad}>
              {
                <MaterialCommunityIcons
                  onPress={() => {
                    if (updatePermission) this.navigateTo()
                  }}
                  name="square-edit-outline"
                  size={26}
                  color={AppStyles.colors.primaryColor}
                />
              }
            </View>
          )}
        </View>
        {/* **************************************** */}
        {property && property.status === 'onhold' && property.rider_id ? (
          <View style={{ marginBottom: 25 }}>
            <TouchableButton
              containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
              label={'APPROVE PROPERTY'}
              onPress={() => {
                if (updatePermission) this.approveProperty(property.id)
              }}
              loading={loading}
            />
          </View>
        ) : null}
      </ScrollView>
    ) : (
      <Loader loading={loading} />
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(PropertyDetail)
