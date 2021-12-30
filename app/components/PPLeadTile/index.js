/** @format */

import axios from 'axios'
import moment from 'moment'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { Entypo, Feather, FontAwesome, Ionicons } from '@expo/vector-icons'
import { Menu } from 'react-native-paper'
import phone from '../../../assets/img/phone2.png'
import AppStyles from '../../AppStyles'
import helper from '../../helper'
import StaticData from '../../StaticData'
import styles from './style'
import _ from 'underscore'

class PPLeadTile extends React.Component {
  constructor(props) {
    super(props)
  }

  call = (data) => {
    const { contacts, purposeTab, updateStatus, user } = this.props
    if (data.customer) {
      let newContact = helper.createContactPayload(data.customer)
      this.sendCallStatus(data)
      helper.callNumber(newContact, contacts)
    } else {
      helper.errorToast(`No Phone Number`)
    }

    if (purposeTab !== 'invest') if (data.assigned_to_armsuser_id === user.id) updateStatus(data)
  }

  sendCallStatus = (data) => {
    const start = moment().format()
    const { purposeTab } = this.props
    let body = {}
    body = {
      start: start,
      end: start,
      time: start,
      date: start,
      taskType: 'called',
      response: 'Called',
      subject: 'Call to client ' + data.customer.customerName,
      cutomerId: data.customer.id,
      taskCategory: 'leadTask',
    }
    if (purposeTab === 'invest') body.leadId = data.id
    else body.armsLeadId = data.id
    axios.post(`api/leads/project/meeting`, body).then((res) => {})
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

  leadMenu = (lead) => {
    let { ppbuyRentFilter } = StaticData
    const { PPLeadStatusUpdate } = this.props
    let { status } = lead
    let items = []
    let statuses = _.reject(ppbuyRentFilter, function (item) {
      return item.value === lead.status
    })
    for (const status of statuses) {
      items.push(
        <Menu.Item
          onPress={() => {
            PPLeadStatusUpdate(lead, status.value)
          }}
          title={status.name}
        />
      )
    }
    return items
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
      redirectToCompare,
      changeLeadStatus,
      fetchShortlistedProperties,
    } = this.props
    const { organization } = user
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
    let leadOwner =
      data.assigned_to_armsuser_id == user.id ||
      data.shared_with_armsuser_id == user.id ||
      propertyLead
    if (data.status === 'closed_won' || data.status === 'closed_lost') leadOwner = false
    return (
      <TouchableOpacity
        // onLongPress={() => handleLongPress(data)}
        // onPress={() => {
        //   navigateTo(data)
        // }}
        style={[
          styles.tileMainWrap,
          data.readAt === null && styles.selectedInventory,
          { flex: 1, padding: 10 },
        ]}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            {/* ****** Name Wrap */}
            <View style={[styles.contentMain, AppStyles.mbTen]}>
              <Text style={[styles.largeText, changeColor]} numberOfLines={1}>
                {customerName != '' ? customerName : data.customer && data.customer.customerName}
              </Text>
            </View>

            {/* ****** Price Range */}
            <View style={[styles.contentMultiMain]}>
              <Text style={[styles.priceText, AppStyles.mbFive]}>
                Price Range{' '}
                {helper.convertPriceToIntegerString(
                  data.minPrice,
                  data.maxPrice,
                  StaticData.Constants.any_value
                )}
              </Text>
            </View>

            {/* ****** Description */}
            {data.description ? (
              <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                <Text
                  style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}
                  numberOfLines={1}
                >
                  {data.description}
                </Text>
              </View>
            ) : null}

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
              </Text>
            </View>

            {/* ****** Compare URL */}
            {data.origin === 'pp-wanted' ? (
              <View style={[AppStyles.mbFive, { flex: 1, alignItems: 'baseline' }]}>
                <Text style={[AppStyles.darkColor]} numberOfLines={1}>
                  Shortlisted Properties:{' '}
                  <Text
                    onPress={() => fetchShortlistedProperties(data)}
                    style={[
                      // AppStyles.mrTen,
                      { textDecorationLine: 'underline', color: AppStyles.colors.primaryColor },
                    ]}
                    numberOfLines={1}
                  >
                    View
                  </Text>
                </Text>
              </View>
            ) : null}
            {data.origin !== 'arms' && data.graana_property_id ? (
              <View style={[AppStyles.mbFive, { flex: 1, alignItems: 'baseline' }]}>
                <Text style={[AppStyles.darkColor]} numberOfLines={1}>
                  Property URL:{' '}
                  <Text
                    onPress={() => redirectToCompare(data)}
                    style={[
                      // AppStyles.mrTen,
                      { textDecorationLine: 'underline', color: AppStyles.colors.primaryColor },
                    ]}
                    numberOfLines={1}
                  >
                    View
                  </Text>
                </Text>
              </View>
            ) : null}
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
          <View style={{ justifyContent: 'space-between' }}>
            <Menu
              visible={data.menu}
              onDismiss={() => changeLeadStatus(data)}
              anchor={
                <TouchableOpacity
                  onPress={() => {
                    if (leadOwner) changeLeadStatus(data)
                  }}
                  style={{}}
                >
                  <View style={{}}>
                    <Text style={[changeStatusColor, AppStyles.mrFive]} numberOfLines={1}>
                      {data.status.split('_').join(' ').toUpperCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
              }
            >
              <View>{this.leadMenu(data)}</View>
            </Menu>
            <View style={{ alignSelf: 'flex-end' }}>
              {showPhone ? (
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => {
                    this.call(data)
                  }}
                >
                  <Image style={[styles.fireIcon, AppStyles.mlFive]} source={phone} />
                </TouchableOpacity>
              ) : null}
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

export default connect(mapStateToProps)(PPLeadTile)
