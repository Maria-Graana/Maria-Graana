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
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'

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

  leadStatus = () => {
    const { data } = this.props
    if (data && data.status) {
      if (
        data.status === 'viewing' ||
        data.status === 'propsure' ||
        data.status === 'offer' ||
        data.status === 'offer'
      ) {
        return 'Shortlisting'
      }
      if (data.status === 'meeting' || data.status === 'nurture') {
        return 'In-Progress'
      } else {
        return helper.showStatus(data.status.replace(/_+/g, ' ')).toUpperCase()
      }
    }
  }

  setCustomerName = () => {
    const { user, data } = this.props
    if (data.requiredProperties !== true)
      return (
        data.customer && data.customer.customerName && helper.capitalize(data.customer.customerName)
      )
    else return ' '
  }
  // removed call button temporarily

  render() {
    const {
      data,
      navigateTo,
      callNumber,
      user,
      purposeTab,
      handleLongPress,
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
      permissions,
      screenName,
      navigateToAssignLead,
      assignLeadTo,
      goToHistory,
      getCallHistory,
      addGuideReference = null,
      pageType = '',
    } = this.props
    var changeColor =
      data.assigned_to_armsuser_id == user.id ||
      data.shared_with_armsuser_id == user.id ||
      (data && data.requiredProperties)
        ? styles.blueColor
        : AppStyles.darkColor
    var changeStatusColor =
      data.assigned_to_armsuser_id == user.id ||
      data.shared_with_armsuser_id == user.id ||
      (data && data.requiredProperties)
        ? styles.tokenLabel
        : styles.tokenLabelDark
    var descriptionColor =
      data.assigned_to_armsuser_id == user.id ||
      data.shared_with_armsuser_id == user.id ||
      propertyLead
        ? styles.desBlue
        : styles.desDark
    let projectName = data.project ? helper.capitalize(data.project.name) : data.projectName
    let customerName = this.setCustomerName()
    let areasLength =
      !data.projectId && data.armsLeadAreas && data.armsLeadAreas.length > 1
        ? ` (+${Number(data.armsLeadAreas.length) - 1} ${
            data.armsLeadAreas.length > 2 ? 'areas' : 'area'
          })`
        : ''
    let leadSize = this.leadSize()
    // let showPhone = displayPhone === false || displayPhone ? displayPhone : true
    let leadStatus = this.leadStatus()
    let referPermission = getPermissionValue(
      lead.projectId && lead.project
        ? PermissionFeatures.PROJECT_LEADS
        : PermissionFeatures.BUY_RENT_LEADS,
      PermissionActions.REFER,
      permissions
    )
    let assignPermission = getPermissionValue(
      lead.projectId && lead.project
        ? PermissionFeatures.PROJECT_LEADS
        : PermissionFeatures.BUY_RENT_LEADS,
      PermissionActions.ASSIGN_REASSIGN,
      permissions
    )
    let permissionLeadUpdate = getPermissionValue(
      purposeTab === 'invest'
        ? PermissionFeatures.PROJECT_LEADS
        : PermissionFeatures.BUY_RENT_LEADS,
      PermissionActions.UPDATE,
      permissions
    )
    let showPhone = false
    if (permissionLeadUpdate) {
      // check permission first
      if (pageType === '&pageType=demandLeads&hasBooking=false') {
        // is demand lead
        showPhone = true
      } else {
        // all other leads assigned to user himself
        if (data.assigned_to_armsuser_id == user.id) {
          showPhone = true
        } else {
          showPhone = false
        }
      }
    } else {
      showPhone = false
    }

    return (
      <TouchableOpacity
        // disabled={screen === 'Leads' ? true : false}
        onLongPress={() => {
          if (
            (!user.organization && user.armsUserRole.groupManger) ||
            (user.organization && !user.organization.isPP)
          )
            handleLongPress(data)
        }}
        onPress={() => {
          // if (
          //   (!user.organization && user.armsUserRole.groupManger) ||
          //   (user.organization && !user.organization.isPP)
          // ) {
          navigateTo(data)
          // }
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
            <View
              style={[styles.topIcons, screen === 'Leads' && { top: 12, right: wanted ? 30 : 10 }]}
            >
              <View style={styles.extraStatus}>
                <Text
                  style={[changeStatusColor, AppStyles.mrFive, styles.viewStyle]}
                  numberOfLines={1}
                >
                  {/* Disabled Sentry in development  Sentry in */}
                  {wanted ? data.armsStatus.toUpperCase() : leadStatus && leadStatus.toUpperCase()}
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
                {/* {data && data.requiredProperties && (
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
                      Demand Lead
                    </Text>
                  </View>
                )} */}
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
                  {purposeTab === 'invest' ? (
                    <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                      {data && data.minPrice && data.maxPrice ? (
                        <Text style={[styles.largeText, changeColor]} numberOfLines={1}>
                          {helper.convertPriceToIntegerString(
                            data.minPrice,
                            data.maxPrice,
                            StaticData.Constants.any_value
                          )}
                        </Text>
                      ) : null}
                    </View>
                  ) : (
                    <Text style={[styles.largeText, changeColor]} numberOfLines={1}>
                      {/* Disabled Sentry in development  Sentry in */}
                      {leadSize}
                      {helper.capitalize(data.subtype)} {data.purpose != null && 'to '}
                      {(data.purpose && data.purpose === 'sale') || data.purpose === 'buy'
                        ? 'Buy'
                        : 'Rent'}
                    </Text>
                  )}

                  {/* 3 dots menu */}
                  <View style={{ position: 'absolute', right: -55 }}>
                    {/* {screen === 'Leads' && !wanted ? (
                      <Menu
                        visible={isMenuVisible && data.id === lead.id}
                        onDismiss={() => setIsMenuVisible(false, data)}
                        anchor={
                          <View>
                            <Entypo
                              onPress={() => setIsMenuVisible(true, data)}
                              name="dots-three-vertical"
                              size={26}
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
                            navigateTo(data), setIsMenuVisible(false, data)
                          }}
                          title="Book a Unit"
                        />
                        <Menu.Item
                          onPress={() => {
                            if (referPermission) {
                              navigateToShareScreen(data)
                              setIsMenuVisible(false, data)
                            }
                          }}
                          title="Refer"
                        />
                        <Menu.Item
                          onPress={() => {
                            if (assignPermission) {
                              checkAssignedLead(lead)
                              setIsMenuVisible(false, data)
                            }
                          }}
                          title="Re-Assign"
                        />
                        {data && !data.guideReference ? (
                          <Menu.Item
                            onPress={() => {
                              addGuideReference()
                              setIsMenuVisible(false, data)
                            }}
                            title="Add Guide Reference #"
                          />
                        ) : null}

                        <Menu.Item onPress={() => {}} title="Delete" disabled />
                      </Menu>
                    ) : null} */}
                    {screen === 'Leads' && wanted ? (
                      <Menu
                        visible={isMenuVisible && data.id === lead.id}
                        onDismiss={() => setIsMenuVisible(false, data)}
                        anchor={
                          <View>
                            <Entypo
                              onPress={() => setIsMenuVisible(true, data)}
                              name="dots-three-vertical"
                              size={26}
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
                            navigateToAssignLead(data)
                            setIsMenuVisible(false, data)
                          }}
                          title="Re-Assign"
                        />
                        <Menu.Item
                          onPress={() => {
                            getCallHistory(data)
                            setIsMenuVisible(false, data)
                          }}
                          title="Activity History"
                        />
                        {data && data.purpose == 'invest' ? (
                          <Menu.Item
                            onPress={() => {
                              assignLeadTo(data)
                              setIsMenuVisible(false, data)
                            }}
                            title="Assign To Investment Advisor"
                          />
                        ) : data && (data.purpose == 'sell' || data.purpose == 'rentout') ? (
                          <Menu.Item
                            onPress={() => {
                              assignLeadTo(data)
                              setIsMenuVisible(false, data)
                            }}
                            title="Assign To Cataloger"
                          />
                        ) : (
                          data && (
                            <Menu.Item
                              onPress={() => {
                                assignLeadTo(data)
                                setIsMenuVisible(false, data)
                              }}
                              title="Assign To Area Manager"
                            />
                          )
                        )}
                      </Menu>
                    ) : null}
                  </View>
                </View>

                {/* ****** Price Wrap */}
                {purposeTab != 'invest' ? (
                  <View style={[styles.contentMultiMain]}>
                    {!data && data.min_price && data.price ? (
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
                    {data ? (
                      <Text style={[styles.priceText, changeColor, AppStyles.mbFive]}>
                        {purposeTab === 'invest' &&
                          helper.capitalize(projectName != '' ? projectName : 'Any Project')}
                        {data.projectType &&
                          data.projectType != '' &&
                          ` - ${helper.capitalize(data.projectType)}`}
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
                      {!data.projectId &&
                      data.armsLeadAreas &&
                      data.armsLeadAreas.length > 0 &&
                      data.armsLeadAreas[0].area
                        ? data.armsLeadAreas[0].area.name + `${areasLength}` + ' - '
                        : ''}
                      {!data.projectId && data.city && data.city.name}
                    </Text>
                  )}
                </View>
                {/* ****** Location Wrap */}
                <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                  <Text
                    style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}
                    numberOfLines={1}
                  >
                    {customerName === ' ' ? '' : data.customer && data.customer.customerName}
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

                  {showPhone ? (
                    <TouchableOpacity
                      style={styles.phoneMain}
                      onPress={() => {
                        callNumber(data)
                      }}
                    >
                      <Image
                        style={[
                          styles.fireIcon,
                          AppStyles.mlFive,
                          { alignSelf: purposeTab === 'invest' ? 'flex-end' : 'center' },
                        ]}
                        source={phone}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
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
    lead: store.lead.lead,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(LeadTile)
