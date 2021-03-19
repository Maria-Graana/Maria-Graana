/** @format */

import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons'
import { CheckBox } from 'native-base'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Menu } from 'react-native-paper'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles'
import { formatPrice } from '../../PriceFormate'
import helper from '../../helper'
import styles from './style'

class AgentTile extends React.Component {
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

  getOtherDiary = (property) => {
    const { user } = this.props
    if (property.diaries && property.diaries.length) {
      let diaries = property.diaries
      for (let i = 0; i < diaries.length; i++) {
        if (Number(diaries[i].userId) !== Number(user.id) && diaries[i].status === 'pending') {
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

  render() {
    let {
      data,
      isMenuVisible,
      showCheckBoxes,
      viewingMenu,
      menuShow,
      screen,
      bookAnotherViewing,
      toggleCheckListModal,
      propertyGeoTagging,
      user,
    } = this.props
    let ownDiary = this.getOwnDiary(data) || null
    let otherAgentdiary = this.getOtherDiary(data) || null;
    let agentName = data ? this.displayName(data) : ''
    let show = isMenuVisible
    // let showDone = this.checkDiaryStatus(data)
    if (isMenuVisible) {
      if (ownDiary) {
        if (ownDiary.status === 'completed') viewingMenu = false
      } else {
        let completedDiary = this.getOwnCompletedDiary(data)
        if (completedDiary) viewingMenu = false
      }
    }
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row' }}
        onLongPress={() => {
          this.props.displayChecks()
          this.props.addProperty(data)
        }}
        onPress={() => {
          this.props.addProperty(data)
        }}
      >
        <View style={styles.tileContainer}>
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
                  {data && data.price === 0 ? '0' : formatPrice(data && data.price && data.price)}
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
          <View style={styles.underLine} />
          <View style={[styles.pad5, { marginRight: 5 }]}>
            <View style={{ flexDirection: 'row', height: 20 }}>
              <View style={{ flex: 1 }}></View>
              {screen !== 'match' && screen !== 'viewing' && screen !== 'propsure' ? (
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
              {screen === 'propsure' ? (
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
                    {!helper.checkPropsureDocs(data.propsures, 'buyer') ? (
                      <Menu.Item
                        onPress={() => {
                          this.props.goToPropertyComments(data)
                        }}
                        title="Comments"
                      />
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
                            this.props.cancelPropsureRequest(data)
                          }}
                          title="Cancel Request"
                        />
                      </View>
                    )}
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
                                propertyGeoTagging(data)
                              }}
                              title="GeoTag"
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
                           {
                            otherAgentdiary ?
                              <>
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
                              </> :
                              <>
                                <Menu.Item
                                  onPress={() => {
                                    bookAnotherViewing(data)
                                  }}
                                  title="Book Another Viewing"
                                />
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
                              </>
                          }
                        </View>
                      )}
                    </View>
                  </Menu>
                </View>
              ) : null}
              {showCheckBoxes ? (
                <View style={{ marginTop: 5, marginRight: 15 }}>
                  <CheckBox
                    onPress={() => {
                      this.props.addProperty(data)
                    }}
                    color={AppStyles.colors.primaryColor}
                    checked={data.checkBox}
                  />
                </View>
              ) : null}
            </View>
            <View style={{ marginTop: 10, height: 125, justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.agentText}> Agent Name </Text>
                <Text numberOfLines={1} style={styles.labelText}>
                  {agentName}
                </Text>
              </View>
              <View style={{ flexDirection: 'row-reverse' }}>
                {/* <View style={{ flex: 1 }}></View> */}
                <FontAwesome
                  onPress={() => {
                    if (show) this.call(data)
                  }}
                  style={{ paddingTop: 40, paddingRight: 0 }}
                  name="phone"
                  size={30}
                  color={AppStyles.colors.subTextColor}
                />
              </View>
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

export default connect(mapStateToProps)(AgentTile)
