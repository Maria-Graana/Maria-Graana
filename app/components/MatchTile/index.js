/** @format */

import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, Text, TouchableOpacity, View, TouchableHighlight } from 'react-native'
import { Menu } from 'react-native-paper'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles'
import helper from '../../helper'
import { formatPrice } from '../../PriceFormate'
import styles from './style'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import MyCheckBox from '../MyCheckBox'

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
        if (Number(diaries[i].userId) === Number(user.id) && diaries[i].status === 'pending') {
          return diaries[i]
        }
      }
    }
  }

  getOwnCompletedDiary = (property) => {
    const { user } = this.props
    if (property.diaries && property.diaries.length) {
      let diaries = property.diaries
      for (let i = 0; i < diaries.length; i++) {
        if (Number(diaries[i].userId) === Number(user.id) && diaries[i].status === 'completed') {
          return diaries[i]
        }
      }
    }
  }

  callToggleFunc = (data) => {
    const { permissions, toggleMenu, user, lead, shortlistedData } = this.props
    let closedLeadEdit = helper.checkAssignedSharedStatus(user, lead, permissions, shortlistedData)
    if (
      getPermissionValue(PermissionFeatures.BUY_RENT_LEADS, PermissionActions.READ, permissions) &&
      closedLeadEdit
    )
      toggleMenu(true, data.id)
  }

  render() {
    let {
      data,
      isMenuVisible,
      showCheckBoxes,
      viewingMenu,
      screen,
      bookAnotherViewing,
      toggleCheckListModal,
      propertyGeoTagging,
      lead,
      permissions,
      user,
      graanaVerifeyModal,
      cancelViewing,
      shortlistedData,
    } = this.props
    let ownDiary = this.getOwnDiary(data) || null
    let imagesList = this.checkImages()
    let show = isMenuVisible
    let phoneNumber = null
    let totalImages = imagesList.length
    let showDone = this.checkDiaryStatus(data)
    let isPP = helper.checkPPFlag(data)
    let closedLeadEdit = helper.checkAssignedSharedStatus(user, lead, permissions, shortlistedData)
    if (isMenuVisible) {
      if (ownDiary) {
        if (ownDiary.status === 'completed') viewingMenu = false
      } else {
        let completedDiary = this.getOwnCompletedDiary(data)
        if (completedDiary) viewingMenu = false
      }
    }
    phoneNumber = this.displayPhoneNumber(data)
    return (
      <TouchableOpacity
        style={[{ flexDirection: 'row', marginVertical: 2 }]}
        onPress={() => {
          if (
            screen !== 'match' &&
            getPermissionValue(
              PermissionFeatures.BUY_RENT_LEADS,
              PermissionActions.UPDATE,
              permissions
            ) &&
            closedLeadEdit
          )
            this.props.addProperty(data)
        }}
      >
        <View style={[styles.tileContainer]}>
          <View style={[styles.pad5]}>
            {imagesList.length ? (
              <Image source={{ uri: imagesList[0] }} style={styles.noImage} />
            ) : (
              <Image
                source={require('../../../assets/images/no-image-found.png')}
                style={styles.noImage}
              />
            )}
          </View>
          {imagesList.length && isPP ? (
            <View style={styles.imageCountViewStyle}>
              <Image
                source={require('../../../assets/img/green-dot.png')}
                style={styles.greenDot}
              />
            </View>
          ) : null}
          <View
            style={[
              AppStyles.mb1,
              styles.pad5,
              { paddingBottom: 2, justifyContent: 'space-between' },
            ]}
          >
            <View style={styles.textPadTop}>
              <Text style={[styles.priceText]}>
                {' '}
                {data && data.price === 0 ? '0' : formatPrice(data && data.price && data.price)}
              </Text>
              <Text numberOfLines={1} style={[styles.marlaText]}>
                {' '}
                {data.size} {data.size_unit} {data.subtype && helper.capitalize(data.subtype)} For{' '}
                {data.purpose && helper.capitalize(data.purpose)}{' '}
              </Text>
              <Text numberOfLines={1} style={[styles.addressText]}>
                {' '}
                {data.area ? data.area.name : null}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <View style={[styles.iconInner, { paddingBottom: 0 }]}>
                {data.bed && Number(data.bed) > 0 ? (
                  <Ionicons
                    name="ios-bed"
                    size={25}
                    color={
                      data.checkBox && screen === 'match' ? '#fff' : AppStyles.colors.subTextColor
                    }
                  />
                ) : null}
                <Text style={[{ fontSize: 18 }]}> {data.bed} </Text>
              </View>
              <View style={[styles.iconInner, { paddingBottom: 0 }]}>
                {data.bath && Number(data.bath) > 0 ? (
                  <FontAwesome
                    name="bath"
                    size={22}
                    color={
                      data.checkBox && screen === 'match' ? '#fff' : AppStyles.colors.subTextColor
                    }
                  />
                ) : null}
                <Text style={[{ fontSize: 18 }]}> {data.bath} </Text>
              </View>
            </View>
          </View>
          <View style={styles.phoneIcon}>
            {screen !== 'match' &&
            screen !== 'viewing' &&
            screen !== 'propsure' &&
            screen !== 'payment' ? (
              <View style={styles.menuView}>
                <Menu
                  visible={data.checkBox}
                  onDismiss={() => this.props.toggleMenu(false, data.id)}
                  anchor={
                    <TouchableHighlight
                      style={styles.menuBtn}
                      onPress={() => this.callToggleFunc(data)}
                      underlayColor={AppStyles.colors.backgroundColor}
                    >
                      <Entypo
                        onPress={() => this.callToggleFunc(data)}
                        name="dots-three-vertical"
                        size={25}
                      />
                    </TouchableHighlight>
                  }
                >
                  <View>
                    <Menu.Item
                      onPress={() => {
                        this.props.goToPropertyComments(data)
                      }}
                      title="Comments"
                    />
                    {(data.armsProperty && data.armsProperty.status !== 'selected_for_payment') ||
                      (data.property && data.property.verifiedStatus !== 'verified' && (
                        <Menu.Item
                          onPress={() => {
                            graanaVerifeyModal(true, data.id)
                            this.props.toggleMenu(false, data.id)
                          }}
                          title="Verify Property"
                        />
                      ))}
                  </View>
                </Menu>
              </View>
            ) : null}
            {screen === 'payment' && lead.shortlist_id && (
              <View style={styles.menuView}>
                <Menu
                  visible={data.checkBox}
                  onDismiss={() => this.props.toggleMenu(false, data.id)}
                  anchor={
                    <TouchableHighlight
                      style={styles.menuBtn}
                      onPress={() => this.callToggleFunc(data)}
                      underlayColor={AppStyles.colors.backgroundColor}
                    >
                      <Entypo
                        onPress={() => this.callToggleFunc(data)}
                        name="dots-three-vertical"
                        size={25}
                      />
                    </TouchableHighlight>
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
              </View>
            )}
            {screen === 'payment' && !lead.shortlist_id && (
              <View style={styles.menuView}>
                <Menu
                  visible={data.checkBox}
                  onDismiss={() => this.props.toggleMenu(false, data.id)}
                  anchor={
                    <TouchableHighlight
                      style={styles.menuBtn}
                      onPress={() => this.callToggleFunc(data)}
                      underlayColor={AppStyles.colors.backgroundColor}
                    >
                      <Entypo
                        onPress={() => this.callToggleFunc(data)}
                        name="dots-three-vertical"
                        size={25}
                      />
                    </TouchableHighlight>
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
              </View>
            )}
            {screen === 'propsure' ? (
              <View style={styles.menuView}>
                <Menu
                  visible={data.checkBox}
                  onDismiss={() => this.props.toggleMenu(false, data.id)}
                  anchor={
                    <TouchableHighlight
                      style={styles.menuBtn}
                      onPress={() => this.callToggleFunc(data)}
                      underlayColor={AppStyles.colors.backgroundColor}
                    >
                      <Entypo
                        onPress={() => this.callToggleFunc(data)}
                        name="dots-three-vertical"
                        size={25}
                      />
                    </TouchableHighlight>
                  }
                >
                  <View>
                    {!helper.checkPropsureDocs(data.propsures, 'buyer') ? (
                      <View>
                        <Menu.Item
                          onPress={() => {
                            this.props.goToPropertyComments(data)
                          }}
                          title="Comments"
                        />
                        {(data.armsProperty &&
                          data.armsProperty.status !== 'selected_for_payment') ||
                          (data.property && data.property.verifiedStatus !== 'verified' && (
                            <Menu.Item
                              onPress={() => {
                                graanaVerifeyModal(true, data.id)
                                this.props.toggleMenu(false, data.id)
                              }}
                              title="Verify Property"
                            />
                          ))}
                      </View>
                    ) : (
                      <View>
                        <Menu.Item
                          onPress={() => {
                            this.props.goToPropertyComments(data)
                          }}
                          title="Comments"
                        />
                        {(data.armsProperty &&
                          data.armsProperty.status !== 'selected_for_payment') ||
                          (data.property && data.property.verifiedStatus !== 'verified' && (
                            <Menu.Item
                              onPress={() => {
                                graanaVerifeyModal(true, data.id)
                                this.props.toggleMenu(false, data.id)
                              }}
                              title="Verify Property"
                            />
                          ))}
                        <Menu.Item
                          onPress={() => {
                            if (
                              getPermissionValue(
                                PermissionFeatures.BUY_RENT_LEADS,
                                PermissionActions.UPDATE,
                                permissions
                              ) &&
                              closedLeadEdit
                            )
                              this.props.cancelPropsureRequest(data)
                          }}
                          title="Cancel Request"
                        />
                      </View>
                    )}
                  </View>
                </Menu>
              </View>
            ) : null}
            {screen === 'viewing' ? (
              <View style={styles.menuView}>
                <Menu
                  visible={data.checkBox}
                  onDismiss={() => this.props.toggleMenu(false, data.id)}
                  anchor={
                    <TouchableHighlight
                      style={styles.menuBtn}
                      onPress={() => this.callToggleFunc(data)}
                      underlayColor={AppStyles.colors.backgroundColor}
                    >
                      <Entypo
                        onPress={() => this.callToggleFunc(data)}
                        name="dots-three-vertical"
                        size={25}
                      />
                    </TouchableHighlight>
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
                                if (
                                  getPermissionValue(
                                    PermissionFeatures.BUY_RENT_LEADS,
                                    PermissionActions.UPDATE,
                                    permissions
                                  ) &&
                                  closedLeadEdit
                                )
                                  propertyGeoTagging(data)
                              }}
                              title="GeoTag"
                            />
                            {(data.armsProperty &&
                              data.armsProperty.status !== 'selected_for_payment') ||
                              (data.property && data.property.verifiedStatus !== 'verified' && (
                                <Menu.Item
                                  onPress={() => {
                                    graanaVerifeyModal(true, data.id)
                                    this.props.toggleMenu(false, data.id)
                                  }}
                                  title="Verify Property"
                                />
                              ))}
                            <Menu.Item
                              onPress={() => {
                                if (
                                  getPermissionValue(
                                    PermissionFeatures.BUY_RENT_LEADS,
                                    PermissionActions.UPDATE,
                                    permissions
                                  ) &&
                                  closedLeadEdit
                                )
                                  toggleCheckListModal(true, data)
                              }}
                              title="Viewing done"
                            />
                            <Menu.Item
                              onPress={() => {
                                if (
                                  getPermissionValue(
                                    PermissionFeatures.BUY_RENT_LEADS,
                                    PermissionActions.UPDATE,
                                    permissions
                                  ) &&
                                  closedLeadEdit
                                ) {
                                  cancelViewing(data)
                                }
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
                                if (
                                  getPermissionValue(
                                    PermissionFeatures.BUY_RENT_LEADS,
                                    PermissionActions.UPDATE,
                                    permissions
                                  ) &&
                                  closedLeadEdit
                                )
                                  propertyGeoTagging(data)
                              }}
                              title="GeoTag"
                            />
                            {(data.armsProperty &&
                              data.armsProperty.status !== 'selected_for_payment') ||
                              (data.property && data.property.verifiedStatus !== 'verified' && (
                                <Menu.Item
                                  onPress={() => {
                                    graanaVerifeyModal(true, data.id)
                                    this.props.toggleMenu(false, data.id)
                                  }}
                                  title="Verify Property"
                                />
                              ))}
                            <Menu.Item
                              onPress={() => {
                                if (
                                  getPermissionValue(
                                    PermissionFeatures.BUY_RENT_LEADS,
                                    PermissionActions.UPDATE,
                                    permissions
                                  ) &&
                                  closedLeadEdit
                                )
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
                            if (
                              getPermissionValue(
                                PermissionFeatures.BUY_RENT_LEADS,
                                PermissionActions.UPDATE,
                                permissions
                              ) &&
                              closedLeadEdit
                            )
                              bookAnotherViewing(data)
                          }}
                          title="Book Another Viewing"
                        />
                        <Menu.Item
                          onPress={() => {
                            if (
                              getPermissionValue(
                                PermissionFeatures.BUY_RENT_LEADS,
                                PermissionActions.UPDATE,
                                permissions
                              ) &&
                              closedLeadEdit
                            )
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
              </View>
            ) : null}
            {showCheckBoxes ? (
              <View style={{ marginRight: 15, marginTop: 5 }}>
                <MyCheckBox
                  onPress={() => {
                    if (
                      getPermissionValue(
                        PermissionFeatures.BUY_RENT_LEADS,
                        PermissionActions.UPDATE,
                        permissions
                      ) &&
                      closedLeadEdit
                    )
                      this.props.addProperty(data)
                  }}
                  status={data.checkBox}
                />
              </View>
            ) : (
              <View />
            )}
            <TouchableHighlight
              onPress={() => {
                if (
                  show &&
                  getPermissionValue(
                    PermissionFeatures.BUY_RENT_LEADS,
                    PermissionActions.UPDATE,
                    permissions
                  ) &&
                  closedLeadEdit
                )
                  this.call(data)
              }}
              style={styles.phoneView}
              underlayColor={AppStyles.colors.backgroundColor}
            >
              <Image
                source={require('../../../assets/img/call.png')}
                style={[styles.callImage, data.checkBox ? { tintColor: '#fff' } : null]}
              />
            </TouchableHighlight>
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
    lead: store.lead.lead,
    permissions: store.user.permissions,
    shortlistedData: store.drawer.shortlistedData,
  }
}

export default connect(mapStateToProps)(MatchTile)
