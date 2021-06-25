/** @format */

import { Feather, FontAwesome, Foundation, Ionicons, Entypo } from '@expo/vector-icons'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

import AppStyles from '../../AppStyles'
import Carousel from 'react-native-snap-carousel'
import React from 'react'
import _ from 'underscore'
import { formatPrice } from '../../PriceFormate'
import styles from './style'
import helper from '../../helper'
import { Menu } from 'react-native-paper'

class InventoryTile extends React.Component {
  constructor(props) {
    super(props)
  }

  onPress = (data) => {
    this.props.onPress(data)
  }

  onLongPress = (id) => {
    this.props.onLongPress(id)
  }

  _renderItem = (item) => {
    return <Image style={styles.imageStyle} source={{ uri: item.item.url }} />
  }

  checkCustomerName = (data) => {
    if (data.customer) {
      return (
        helper.capitalize(data.customer.first_name) +
        ' ' +
        helper.capitalize(data.customer.last_name)
      )
    } else {
      return ''
    }
  }

  render() {
    const {
      data,
      onCall,
      checkForArmsProperty,
      whichProperties,
      graanaVerifeyModal,
      index,
      screen,
      approveProperty,
      selectedProperty,
      showMenu,
      showMenuOptions,
      hideMenu,
      showHideRejectPropertyModal,
      showGraanaMenu,
      showGraanaMenuOptions,
      hideGraanaMenu,
      propertyGeoTagging,
    } = this.props
    const imagesList = data.armsuser ? data.armsPropertyImages : data.property_images
    const imagesCount =
      data.armsuser && data.armsPropertyImages
        ? data.armsPropertyImages.length
        : data.user && data.property_images
        ? data.property_images.length
        : null
    const ownerName = this.checkCustomerName(data)
    const checkForGraanaProperties = whichProperties === 'graanaProperties'
    return (
      <TouchableOpacity
        style={[
          styles.mainContainer,
          {
            backgroundColor:
              checkForGraanaProperties && data.verifiedStatus && data.verifiedStatus != 'verified'
                ? '#ddd'
                : screen === 'fields' && data.status === 'rejected'
                ? '#ddd'
                : '#fff',
          },
        ]}
        onPress={() => this.onPress(data)}
        onLongPress={() => checkForArmsProperty === true && this.onLongPress(data.id)}
        activeOpacity={0.7}
      >
        <View>
          {imagesList && imagesList.length ? (
            <Carousel
              // ref={(c) => { this._carousel = c; }}
              data={imagesList}
              renderItem={this._renderItem}
              sliderWidth={wp('34%')}
              itemWidth={wp('33%')}
              enableSnap={true}
              enableMomentum={false}
              autoplay={true}
              lockScrollWhileSnapping={true}
              autoplayDelay={3000}
              loop={true}
              containerCustomStyle={{ position: 'relative' }}
            />
          ) : (
            <Image
              source={require('../../../assets/images/no-image-found.png')}
              style={styles.imageStyle}
            />
          )}
        </View>
        <View style={styles.imageCountViewStyle}>
          <Feather name={'camera'} color={'#fff'} size={16} />
          <Text style={styles.imageCount}>{imagesCount}</Text>
        </View>

        <View style={{ width: checkForGraanaProperties === true ? wp('50%') : wp('60%') }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.currencyTextStyle}>PKR</Text>
            <Text style={styles.priceTextStyle} numberOfLines={1}>
              {helper.checkPrice(data.price)}
            </Text>
            {data && data.propsure_id ? (
              <Image
                style={styles.propsureIcon}
                source={require('../../../assets/img/pp_logo.png')}
              />
            ) : null}
            {screen === 'fields' && data.status === 'onhold' ? (
              <View
                style={{
                  alignSelf: 'flex-end',
                }}
              >
                <Menu
                  visible={showMenu && data.id === selectedProperty.id}
                  onDismiss={() => hideMenu()}
                  anchor={
                    <Entypo
                      onPress={() => showMenuOptions(data)}
                      name="dots-three-vertical"
                      size={24}
                    />
                  }
                >
                  <View>
                    <Menu.Item
                      onPress={() => {
                        approveProperty(data.id)
                      }}
                      title="Approve Property"
                    />

                    <Menu.Item
                      onPress={() => {
                        showHideRejectPropertyModal(true)
                      }}
                      title="Reject Property"
                    />
                  </View>
                </Menu>
              </View>
            ) : null}
          </View>

          <Text style={styles.textControlStyle} numberOfLines={1}>
            {data.custom_title === null || data.custom_title === ''
              ? data.title
                ? data.title
                : ''
              : data.custom_title}
          </Text>

          {screen === 'fields' ? (
            <Text style={[styles.textControlStyle, { paddingTop: 2 }]} numberOfLines={1}>
              {data.poc_name && data.poc_name}
            </Text>
          ) : (
            <Text style={[styles.textControlStyle, { paddingTop: 2 }]} numberOfLines={1}>
              {ownerName}
            </Text>
          )}

          <Text
            style={[styles.textControlStyle, { fontFamily: AppStyles.fonts.lightFont }]}
            numberOfLines={1}
          >
            {`${data.area.name}, ${data.city.name}`}
          </Text>

          {data.type === 'residential' && (
            <View style={styles.bedBathViewStyle}>
              <Ionicons name={'ios-bed'} color={AppStyles.colors.subTextColor} size={18} />
              <Text style={styles.bedTextStyle}>{data.bed === null ? '0' : String(data.bed)}</Text>
              <FontAwesome
                style={{ paddingLeft: 8 }}
                name={'bathtub'}
                color={AppStyles.colors.subTextColor}
                size={18}
              />
              <Text style={styles.bedTextStyle}>
                {data.bath === null ? '0' : String(data.bath)}
              </Text>
            </View>
          )}
        </View>

        {checkForGraanaProperties === true ? (
          <View style={{ marginHorizontal: 5, marginVertical: 5 }}>
            <Menu
              visible={showGraanaMenu && data.id === selectedProperty.id}
              onDismiss={() => hideGraanaMenu()}
              anchor={
                <Entypo
                  onPress={() => showGraanaMenuOptions(data)}
                  name="dots-three-vertical"
                  size={24}
                />
              }
            >
              <View>
                {data.verifiedStatus && data.verifiedStatus != 'verified' ? (
                  <Menu.Item
                    onPress={() => {
                      graanaVerifeyModal(true, data.id)
                    }}
                    title="Verify Property"
                  />
                ) : null}

                <Menu.Item onPress={() => propertyGeoTagging(data)} title="GeoTag" />
              </View>
            </Menu>
          </View>
        ) : null}

        {(data.customer && data.customer.phone !== '') || screen === 'fields' ? ( // for arms & field app properties
          <View style={{ position: 'absolute', bottom: 5, left: wp('88%') }}>
            <Foundation
              name={'telephone'}
              onPress={() => onCall(data)}
              color={AppStyles.colors.subTextColor}
              size={30}
              style={styles.phoneButton}
            />
          </View>
        ) : null}

        {data && checkForGraanaProperties ? (
          <View style={{ position: 'absolute', bottom: 5, left: wp('88%') }}>
            <Foundation
              name={'telephone'}
              onPress={() => onCall(data)}
              color={AppStyles.colors.subTextColor}
              size={30}
              style={styles.phoneButton}
            />
          </View>
        ) : null}
      </TouchableOpacity>
    )
  }
}

export default InventoryTile
