/** @format */

import { Entypo, Feather, FontAwesome, Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Menu } from 'react-native-paper'
import Carousel from 'react-native-snap-carousel'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles'
import helper from '../../helper'
import { formatPrice } from '../../PriceFormate'
import MyCheckBox from '../MyCheckBox'
import styles from './style'

class PropMatchTile extends React.Component {
  _renderItem = (item) => {
    return <Image style={styles.noImage} source={{ uri: item.item }} />
  }

  displayName = (data) => {
    if (data.armsuser) {
      return data.armsuser.firstName + ' ' + data.armsuser.lastName
    } else if (data.user) {
      return data.user.first_name + ' ' + data.user.last_name
    } else {
      return '- - -'
    }
  }

  displayPhoneNumber = (data) => {
    if (data.armsuser) {
      return data.armsuser.phoneNumber
    } else if (data.user) {
      return data.user.phone
      r
    } else {
      return null
    }
  }

  call = (data) => {
    let name = this.displayName(data)
    let newContact = {
      phone: this.displayPhoneNumber(data),
      name: name !== '- - -' ? name : '',
      url: `tel:${this.displayPhoneNumber(data)}`,
      payload: [
        {
          label: 'mobile',
          number: this.displayPhoneNumber(data),
        },
      ],
    }
    const { contacts } = this.props
    helper.callNumber(newContact, contacts)
  }

  checkImages = () => {
    const { data, organization } = this.props
    let imagesList = []
    if (organization) {
      if (organization === 'arms') {
        if (data.images.length > 0) {
          imagesList = data.images.map((item) => {
            return item.url
          })
        }
      } else {
        if (data.property_images.length > 0) {
          imagesList = data.property_images.map((item) => {
            return item.url
          })
        }
      }
    } else {
      if (data.arms_id) {
        if (data.images.length > 0) {
          imagesList = data.images.map((item) => {
            return item.url
          })
        }
      } else {
        if (data.property_images.length > 0) {
          imagesList = data.property_images.map((item) => {
            return item.url
          })
        }
      }
    }
    return imagesList
  }

  checkDiaryStatus = (property) => {
    const { user } = this.props
    let othersCompleted = false
    let ownCompleted = false
    let ownDiary = false
    if (property.diaries && property.diaries.length) {
      let diaries = property.diaries
      for (let i = 0; i < diaries.length; i++) {
        if (Number(diaries[i].userId) === Number(user.id)) {
          ownDiary = true
        }
        if (Number(diaries[i].userId) === Number(user.id) && diaries[i].status === 'completed') {
          ownCompleted = true
        }
        if (Number(diaries[i].userId) !== Number(user.id) && diaries[i].status === 'completed') {
          othersCompleted = true
        }
      }
    }
    if (othersCompleted && ownDiary && !ownCompleted) {
      return true
    } else return false
  }

  render() {
    const {
      data,
      isMenuVisible,
      showCheckBoxes,
      viewingMenu,
      menuShow,
      screen,
      toggleCheckListModal,
      propertyGeoTagging,
    } = this.props
    let imagesList = this.checkImages()
    let show = isMenuVisible
    let phoneNumber = null
    let totalImages = imagesList.length
    let showDone = this.checkDiaryStatus(data)
    if (isMenuVisible) {
      if (data.diaries && data.diaries.length) {
        if (data.diaries[0].status === 'pending') show = true
        else show = false
      } else show = false
    }
    phoneNumber = this.displayPhoneNumber(data)
    if (showDone) show = false
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row', marginVertical: 2 }}
        onLongPress={() => {
          this.props.displayChecks()
          this.props.addProperty(data)
        }}
        onPress={() => {
          this.props.addProperty(data)
        }}
      >
        <View style={styles.tileContainer}>
          <View style={[styles.pad5]}>
            {imagesList.length ? (
              <Carousel
                // ref={(c) => { this._carousel = c; }}
                data={imagesList}
                renderItem={this._renderItem}
                sliderWidth={130}
                itemWidth={130}
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
                style={styles.noImage}
              />
            )}
          </View>
          <View style={styles.imageCountViewStyle}>
            <Feather name={'camera'} color={'#fff'} size={16} />
            <Text style={styles.imageCount}>{totalImages}</Text>
          </View>
          <View
            style={[
              AppStyles.mb1,
              styles.pad5,
              { paddingBottom: 2, justifyContent: 'space-between' },
            ]}
          >
            <View>
              <Text style={styles.currencyText}>
                {' '}
                PKR{' '}
                <Text style={styles.priceText}>
                  {formatPrice(data && data.price && data.price)}
                </Text>{' '}
              </Text>
              <Text numberOfLines={1} style={styles.marlaText}>
                {' '}
                {data.size} {data.size_unit} {data.subtype && helper.capitalize(data.subtype)} For{' '}
                {data.purpose && helper.capitalize(data.purpose)}{' '}
              </Text>
              <Text numberOfLines={1} style={styles.addressText}>
                {' '}
                {data.area ? data.area.name + ', ' : null} {data.city ? data.city.name : null}{' '}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <View style={[styles.iconInner, { paddingBottom: 0 }]}>
                <Ionicons name="ios-bed" size={25} color={AppStyles.colors.subTextColor} />
                <Text style={{ fontSize: 18 }}> {data.bed} </Text>
              </View>
              <View style={[styles.iconInner, { paddingBottom: 0 }]}>
                <FontAwesome name="bath" size={22} color={AppStyles.colors.subTextColor} />
                <Text style={{ fontSize: 18 }}> {data.bath} </Text>
              </View>
            </View>
          </View>
          <View style={styles.phoneIcon}>
            {screen === 'propsure' && helper.checkPropsureDocs(data.propsures, 'seller') ? (
              <Menu
                visible={data.checkBox}
                onDismiss={() => this.props.toggleMenu(false, data.id)}
                anchor={
                  <Entypo
                    onPress={() => this.props.toggleMenu(true, data.id)}
                    name="dots-three-vertical"
                    size={20}
                  />
                }
              >
                <View>
                  <View>
                    <Menu.Item
                      onPress={() => {
                        this.props.goToPropertyComments(data)
                      }}
                      title="Comments"
                    />
                    <Menu.Item
                      onPress={() => {
                        this.props.cancelPropsureRequest(data)
                      }}
                      title="Cancel Request"
                    />
                  </View>
                </View>
              </Menu>
            ) : null}
            {screen === 'payment' ||
            screen === 'offer' ||
            (screen === 'propsure' && !helper.checkPropsureDocs(data.propsures, 'seller')) ? (
              <Menu
                visible={data.checkBox}
                onDismiss={() => this.props.toggleMenu(false, data.id)}
                anchor={
                  <Entypo
                    onPress={() => this.props.toggleMenu(true, data.id)}
                    name="dots-three-vertical"
                    size={20}
                  />
                }
              >
                <View>
                  <Menu.Item
                    onPress={() => {
                      this.props.goToPropertyComments(data)
                    }}
                    title="Comments"
                  />
                </View>
              </Menu>
            ) : null}
            {showDone && screen === 'viewing' ? (
              <Menu
                visible={data.checkBox}
                onDismiss={() => this.props.toggleMenu(false, data.id)}
                anchor={
                  <Entypo
                    onPress={() => this.props.toggleMenu(true, data.id)}
                    name="dots-three-vertical"
                    size={20}
                  />
                }
              >
                <View>
                  <Menu.Item
                    onPress={() => {
                      this.props.goToPropertyComments(data)
                    }}
                    title="Comments"
                  />
                  <Menu.Item
                    onPress={() => {
                      toggleCheckListModal(true, data)
                    }}
                    title="Viewing done"
                  />
                </View>
              </Menu>
            ) : null}
            {screen === 'viewing' && !showDone ? (
              <Menu
                visible={data.checkBox}
                onDismiss={() => this.props.toggleMenu(false, data.id)}
                anchor={
                  <Entypo
                    onPress={() => this.props.toggleMenu(true, data.id)}
                    name="dots-three-vertical"
                    size={20}
                  />
                }
              >
                <View>
                  {viewingMenu && screen && screen === 'viewing' ? (
                    <View>
                      {show ? (
                        <View>
                          <Menu.Item
                            onPress={() => {
                              propertyGeoTagging(data)
                            }}
                            title="GeoTag"
                          />
                          <Menu.Item
                            onPress={() => {
                              toggleCheckListModal(true, data)
                            }}
                            title="Viewing done"
                          />
                        </View>
                      ) : (
                        <View>
                          <Menu.Item
                            onPress={() => {
                              propertyGeoTagging(data)
                            }}
                            title="GeoTag"
                          />
                          <Menu.Item
                            onPress={() => {
                              this.props.goToPropertyComments(data)
                            }}
                            title="Comments"
                          />
                        </View>
                      )}
                    </View>
                  ) : (
                    <View>
                      <Menu.Item
                        onPress={() => {
                          propertyGeoTagging(data)
                        }}
                        title="GeoTag"
                      />
                      <Menu.Item
                        onPress={() => {
                          this.props.goToPropertyComments(data)
                        }}
                        title="Comments"
                      />
                    </View>
                  )}
                </View>
              </Menu>
            ) : null}
            {showCheckBoxes ? (
              <View style={{ marginRight: 15, marginTop: 5 }}>
                <MyCheckBox
                  onPress={() => {
                    this.props.addProperty(data)
                  }}
                  status={data.checkBox}
                />
              </View>
            ) : (
              <View />
            )}
            <View style={{ flexDirection: 'row-reverse' }}>
              <FontAwesome
                onPress={() => {
                  // this.call(data)
                }}
                name="phone"
                size={30}
                color={AppStyles.colors.subTextColor}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    contacts: store.contacts.contacts,
  }
}

export default connect(mapStateToProps)(PropMatchTile)
