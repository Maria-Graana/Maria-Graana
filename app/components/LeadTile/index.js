/** @format */

import axios from 'axios'
import moment from 'moment'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Menu } from 'react-native-paper'
import { connect } from 'react-redux'
import phone from '../../../assets/img/phone2.png'
import AppStyles from '../../AppStyles'
import helper from '../../helper'
import StaticData from '../../StaticData'
import styles from './style'
import { Entypo } from '@expo/vector-icons'

class LeadTile extends React.Component {
  constructor(props) {
    super(props)
  }

  leadSize = () => {
    const { data } = this.props
    let minSize = !data.projectId && data.size !== null && data.size !== undefined ? data.size : ''
    let maxSize =
      !data.projectId && data.max_size !== null && data.max_size !== undefined ? data.max_size : ''
    let size = helper.convertSizeToStringV2(
      minSize,
      maxSize,
      StaticData.Constants.size_any_value,
      data.size_unit
    )
    size = size === '' ? '' : size + ' '
    return size
  }

  render() {
    const {
      data,
      navigateTo,
      callNumber,
      user,
      purposeTab,
      contacts,
      handleLongPress,
      displayPhone,
      propertyLead,
      serverTime,
      screen,
      isMenuVisible,
      setIsMenuVisible,
      lead,
      navigateFromMenu,
      checkAssignedLead,
      navigateToShareScreen,
      wanted,
    } = this.props
    var changeColor =
      data.assigned_to_armsuser_id == user.id ||
      data.shared_with_armsuser_id == user.id ||
      propertyLead
        ? styles.blueColor
        : AppStyles.darkColor
    var changeStatusColor =
      data.assigned_to_armsuser_id == user.id ||
      data.shared_with_armsuser_id == user.id ||
      propertyLead
        ? styles.tokenLabel
        : styles.tokenLabelDark
    var descriptionColor =
      data.assigned_to_armsuser_id == user.id ||
      data.shared_with_armsuser_id == user.id ||
      propertyLead
        ? styles.desBlue
        : styles.desDark
    let projectName = data.project ? helper.capitalize(data.project.name) : data.projectName
    let customerName =
      data.customer && data.customer.customerName && helper.capitalize(data.customer.customerName)
    let areasLength =
      !data.projectId && data.armsLeadAreas && data.armsLeadAreas.length > 1
        ? ` (+${Number(data.armsLeadAreas.length) - 1} ${
            data.armsLeadAreas.length > 2 ? 'areas' : 'area'
          })`
        : ''
    let leadSize = this.leadSize()
    let showPhone = displayPhone === false || displayPhone ? displayPhone : true
    return (
      <TouchableOpacity
        disabled={screen === 'Leads' ? true : false}
        onLongPress={() => {
          if (
            (!user.organization && user.subRole === 'group_management') ||
            (user.organization && !user.organization.isPP)
          )
            handleLongPress(data)
        }}
        onPress={() => {
          if (
            (!user.organization && user.subRole === 'group_management') ||
            (user.organization && !user.organization.isPP)
          )
            navigateTo(data)
        }}
      >
        <View
          style={[
            styles.tileMainWrap,
            { borderLeftColor: helper.timeStatusColors(data, serverTime) },
            data.readAt === null && styles.selectedInventory,
          ]}
        >
          <View style={[styles.rightContentView]}>
            <View style={[styles.topIcons, screen === 'Leads' && { top: 12, right: 40 }]}>
              <View style={styles.extraStatus}>
                <Text
                  style={[changeStatusColor, AppStyles.mrFive, styles.viewStyle]}
                  numberOfLines={1}
                >
                  {/* Disabled Sentry in development  Sentry in */}
                  {data.status === 'token' ? (
                    <Text>TOKEN</Text>
                  ) : data.status === 'meeting' ? (
                    data.status.split('_').join(' ').toUpperCase() + ' PLANNED'
                  ) : (
                    helper.showStatus(data.status.replace(/_+/g, ' ')).toUpperCase()
                  )}
                </Text>
                {data.shared_with_armsuser_id && (
                  <View style={styles.sharedLead}>
                    <Text
                      style={[
                        AppStyles.mrFive,
                        styles.viewStyle,
                        {
                          color: AppStyles.colors.primaryColor,
                          fontSize: AppStyles.noramlSize.fontSize,
                          fontFamily: AppStyles.fonts.lightFont,
                        },
                      ]}
                    >
                      Referred Lead
                    </Text>
                  </View>
                )}

                {data && data.leadCategory ? (
                  <View style={[styles.sharedLead, screen === 'Leads' && { padding: 0 }]}>
                    <Text
                      style={[
                        AppStyles.mrFive,
                        styles.viewStyle,
                        {
                          color: AppStyles.colors.primaryColor,
                          fontSize: AppStyles.noramlSize.fontSize,
                          fontFamily: AppStyles.fonts.lightFont,
                        },
                        {
                          color: AppStyles.colors.primaryColor,
                          fontSize: AppStyles.noramlSize.fontSize,
                          fontFamily: AppStyles.fonts.lightFont,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {data.leadCategory}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            <View style={[styles.contentMainWrap]}>
              <View style={styles.leftContent}>
                {/* ****** Name Wrap */}
                <View style={[styles.contentMain, AppStyles.mbTen, { flexDirection: 'row' }]}>
                  <Text style={[styles.largeText, changeColor]} numberOfLines={1}>
                    {/* Disabled Sentry in development  Sentry in */}
                    {customerName != ''
                      ? customerName
                      : data.customer && data.customer.customerName}
                  </Text>
                  {/* 3 dots menu */}
                  <View style={{ position: 'absolute', right: -55 }}>
                    {screen === 'Leads' && !wanted ? (
                      <Menu
                        visible={isMenuVisible && data.id === lead.id}
                        onDismiss={() => setIsMenuVisible(false, data)}
                        anchor={
                          <View>
                            <Entypo
                              onPress={() => setIsMenuVisible(true, data)}
                              name="dots-three-vertical"
                              size={22}
                            />
                          </View>
                        }
                      >
                        <Menu.Item
                          onPress={() => {
                            navigateFromMenu(data, 'ScheduledTasks')
                          }}
                          title="Scheduled Tasks"
                        />
                        <Menu.Item
                          onPress={() => {
                            navigateFromMenu(data, 'LeadDetail')
                          }}
                          title="Details"
                        />
                        <Menu.Item
                          onPress={() => {
                            navigateToShareScreen(data), setIsMenuVisible(false, data)
                          }}
                          title="Refer"
                        />
                        <Menu.Item
                          onPress={() => {
                            checkAssignedLead(lead), setIsMenuVisible(false, data)
                          }}
                          title="Re-Assign"
                        />
                        <Menu.Item onPress={() => {}} title="Delete" disabled />
                      </Menu>
                    ) : null}
                    {screen === 'Leads' && wanted ? (
                      <Menu
                        visible={isMenuVisible && data.id === lead.id}
                        onDismiss={() => setIsMenuVisible(false, data)}
                        anchor={
                          <View>
                            <Entypo
                              onPress={() => setIsMenuVisible(true, data)}
                              name="dots-three-vertical"
                              size={22}
                            />
                          </View>
                        }
                      >
                        <Menu.Item
                          onPress={() => {
                            navigateFromMenu(data, 'ScheduledTasks')
                          }}
                          title="Scheduled Tasks"
                        />
                        <Menu.Item
                          onPress={() => {
                            navigateFromMenu(data, 'LeadDetail')
                          }}
                          title="Details"
                        />
                      </Menu>
                    ) : null}
                  </View>
                </View>

                {/* ****** Price Wrap */}
                {data.description != null && data.description != '' && purposeTab === 'invest' && (
                  <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                    <Text
                      style={[
                        styles.normalText,
                        AppStyles.darkColor,
                        AppStyles.mrTen,
                        descriptionColor,
                      ]}
                      numberOfLines={1}
                    >
                      {data.description}
                    </Text>
                  </View>
                )}
                {purposeTab != 'invest' ? (
                  <View style={[styles.contentMultiMain]}>
                    {!data.projectId && data.min_price && data.price ? (
                      <Text style={[styles.priceText, changeColor, AppStyles.mbFive]}>
                        {helper.convertPriceToIntegerString(
                          data.min_price,
                          data.price,
                          StaticData.Constants.any_value
                        )}
                      </Text>
                    ) : null}
                  </View>
                ) : (
                  <View style={[styles.contentMultiMain]}>
                    {data.projectId && data.minPrice && data.maxPrice ? (
                      <Text style={[styles.priceText, changeColor, AppStyles.mbFive]}>
                        {helper.convertPriceToIntegerString(
                          data.minPrice,
                          data.maxPrice,
                          StaticData.Constants.any_value
                        )}
                      </Text>
                    ) : null}
                  </View>
                )}
                {/* ****** Address Wrap */}
                <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                  {data.size != null && !data.projectId && (
                    <Text
                      style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}
                      numberOfLines={1}
                    >
                      {leadSize}
                      {helper.capitalize(data.subtype)} {data.purpose != null && 'to '}
                      {data.purpose === 'sale' ? 'Buy' : 'Rent'}
                    </Text>
                  )}
                </View>
                {/* ****** Location Wrap */}
                <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                  <Text
                    style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}
                    numberOfLines={1}
                  >
                    {!data.projectId &&
                    data.armsLeadAreas &&
                    data.armsLeadAreas.length > 0 &&
                    data.armsLeadAreas[0].area
                      ? data.armsLeadAreas[0].area.name + `${areasLength}` + ' - '
                      : ''}
                    {!data.projectId && data.city && data.city.name}
                    {purposeTab === 'invest' &&
                      helper.capitalize(projectName != '' ? projectName : 'Project not specified')}
                    {data.projectType &&
                      data.projectType != '' &&
                      ` - ${helper.capitalize(data.projectType)}`}
                  </Text>
                </View>
                {/* ****** Location Wrap */}
                <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                  <Text
                    style={[styles.normalText, styles.lightColor, AppStyles.mrTen]}
                    numberOfLines={1}
                  >
                    {data.id ? `ID: ${data.id}, ` : ''}{' '}
                    {`Created: ${moment(data.createdAt).format('MMM DD YYYY, hh:mm A')}`}
                  </Text>
                </View>
              </View>
              {screen === 'Leads' ? (
                <></>
              ) : (
                <View style={styles.phoneMain}>
                  {showPhone ? (
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => {
                        callNumber(data)
                      }}
                    >
                      <Image style={[styles.fireIcon, AppStyles.mlFive]} source={phone} />
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
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
    lead: store.lead.lead,
  }
}

export default connect(mapStateToProps)(LeadTile)
