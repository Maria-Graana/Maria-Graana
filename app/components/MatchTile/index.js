/** @format */

import { Entypo, Feather, FontAwesome, Ionicons } from '@expo/vector-icons'
import { CheckBox } from 'native-base'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Menu } from 'react-native-paper'
import Carousel from 'react-native-snap-carousel'
import { formatPrice } from '../../PriceFormate'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles'
import helper from '../../helper'
import styles from './style'

class MatchTile extends React.Component {
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

  getOwnDiary = (property) => {
    const { user } = this.props
    if (property.diaries && property.diaries.length) {
      let diaries = property.diaries
      for (let i = 0; i < diaries.length; i++) {
        if (Number(diaries[i].userId) === Number(user.id)) {
          return diaries[i]
        }
      }
    }
  }

  render() {
    let {
      data,
      isMenuVisible,
      showCheckBoxes,
      viewingMenu,
      menuShow,
      screen,
      bookAnotherViewing,
    } = this.props
    let ownDiary = this.getOwnDiary(data) || null
    let imagesList = this.checkImages()
    let show = isMenuVisible
    let phoneNumber = null
    let totalImages = imagesList.length
    let showDone = this.checkDiaryStatus(data)

    if (isMenuVisible) {
      if (ownDiary) {
        if (ownDiary.status === 'completed') viewingMenu = false
      }
    }
    phoneNumber = this.displayPhoneNumber(data)

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
            {screen !== 'match' && screen !== 'viewing' ? (
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
            {screen === 'viewing' ? (
              <View>
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
                    {viewingMenu ? (
                      <View>
                        {ownDiary && ownDiary.status === 'pending' ? (
                          <View>
                            <Menu.Item
                              onPress={() => {
                                this.props.goToPropertyComments(data)
                              }}
                              title="Comments"
                            />
                            <Menu.Item
                              onPress={() => {
                                this.props.doneViewing(data)
                              }}
                              title="Viewing done"
                            />
                            <Menu.Item
                              onPress={() => {
                                this.props.cancelViewing(data)
                              }}
                              title="Cancel Viewing"
                            />
                          </View>
                        ) : (
                          <View>
                            <Menu.Item
                              onPress={() => {
                                this.props.goToPropertyComments(data)
                              }}
                              title="Comments"
                            />
                            <Menu.Item
                              onPress={() => {
                                this.props.deleteProperty(data)
                              }}
                              title="Remove from the list"
                            />
                          </View>
                        )}
                      </View>
                    ) : (
                      <View>
                        <Menu.Item
                          onPress={() => {
                            bookAnotherViewing(data)
                          }}
                          title="Book Another Viewing"
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
                {showDone ? (
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
                          this.props.doneViewing(data)
                        }}
                        title="Viewing done"
                      />
                    </View>
                  </Menu>
                ) : null}
              </View>
            ) : null}
            {showCheckBoxes ? (
              <View style={{ marginRight: 15, marginTop: 5 }}>
                <CheckBox
                  onPress={() => {
                    this.props.addProperty(data)
                  }}
                  color={AppStyles.colors.primaryColor}
                  checked={data.checkBox}
                />
              </View>
            ) : (
              <View />
            )}
            <View style={{ flexDirection: 'row-reverse' }}>
              <FontAwesome
                onPress={() => {
                  if (show) this.call(data)
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

export default connect(mapStateToProps)(MatchTile)
