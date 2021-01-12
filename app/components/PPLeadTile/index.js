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

class PPLeadTile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openModel: false,
    }
  }

  call = (data) => {
    const { contacts, purposeTab, updateStatus, user } = this.props
    let newContact = helper.createContactPayload(data.customer)
    this.sendCallStatus(data)
    if (purposeTab !== 'invest') if (data.assigned_to_armsuser_id === user.id) updateStatus(data)
    helper.callNumber(newContact, contacts)
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

  changeLeadStatus = () => {
    const { openModel } = this.state
    console.log('openModel: ', openModel)
    this.setState({
      openModel: !openModel,
    })
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
    const { openModel } = this.state
    return (
      <TouchableOpacity
        // onLongPress={() => handleLongPress(data)}
        // onPress={() => {
        //   navigateTo(data)
        // }}
        style={[styles.tileMainWrap, data.readAt === null && styles.selectedInventory, { flex: 1 }]}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            {/* ****** Name Wrap */}
            <View style={[styles.contentMain, AppStyles.mbTen]}>
              <Text style={[styles.largeText, changeColor]} numberOfLines={1}>
                {customerName != '' ? customerName : data.customer && data.customer.customerName}
              </Text>
            </View>
            <View style={[styles.contentMultiMain]}>
              {data.projectId && data.minPrice && data.maxPrice ? (
                <Text style={[styles.priceText, changeColor, AppStyles.mbFive]}>
                  Price Range - 5 lacs to 10 lacs
                  {/* {helper.convertPriceToString(
                        data.minPrice,
                        data.maxPrice,
                        StaticData.Constants.any_value
                      )} */}
                </Text>
              ) : null}
            </View>
            {/* ****** Price Range */}
            <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
              <Text
                style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}
                numberOfLines={1}
              >
                Price Range - 5 lacs to 10 lacs
              </Text>
            </View>
            {/* ****** Description */}
            <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
              <Text
                style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}
                numberOfLines={1}
              >
                This is a property for rent
              </Text>
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
              </Text>
            </View>
            {/* ****** Compare URL */}
            <TouchableOpacity
              onPress={() =>
                redirectToCompare(
                  `https://www.graana.com/compare?&propertyId=269312&propertyId=253394&propertyId=237261&compareType=residential`
                )
              }
              style={[styles.contentMultiMain, AppStyles.mbFive]}
            >
              <Text
                style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}
                numberOfLines={1}
              >
                {`https://www.graana.com/compare?&propertyId=269312&propertyId=253394&propertyId=237261&compareType=residential`}
              </Text>
            </TouchableOpacity>
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
              visible={openModel}
              onDismiss={() => this.changeLeadStatus()}
              anchor={
                <TouchableOpacity onPress={() => this.changeLeadStatus()} style={{}}>
                  <View style={{}}>
                    <Text style={[changeStatusColor, AppStyles.mrFive]} numberOfLines={1}>
                      {data.status.split('_').join(' ').toUpperCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
              }
            >
              <View>
                <Menu.Item onPress={() => {}} title="Called" />
                <Menu.Item onPress={() => {}} title="Viewing" />
                <Menu.Item onPress={() => {}} title="Closed Won" />
                <Menu.Item onPress={() => {}} title="Closed Lost" />
              </View>
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
