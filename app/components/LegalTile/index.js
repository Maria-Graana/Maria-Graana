/** @format */

import axios from 'axios'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { AntDesign, Entypo } from '@expo/vector-icons'
import moment from 'moment-timezone'
import { connect } from 'react-redux'
import { Menu } from 'react-native-paper'
import AppStyles from '../../AppStyles'
import helper from '../../helper'
import StaticData from '../../StaticData'
import styles from './style'

class LegalTile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menuToggle: false,
    }
  }

  findStatusLabel = () => {
    const { data } = this.props
    let showStatus = { name: '', value: '' }
    if (data && data.status != '') {
      StaticData.legalStatuses.map((item) => {
        if (item.value === data.status) {
          showStatus.name = item.name
          showStatus.value = item.value
        }
      })
    }
    return showStatus
  }

  findStatusColor = (showStatus) => {
    let statusColor = styles.statusYellow
    if (showStatus && showStatus.value === 'approved') statusColor = styles.statusGreen
    if (showStatus && showStatus.value === 'rejected') statusColor = styles.statusRed
    return statusColor
  }

  UploadTile = () => {
    const { data, index, getAttachmentFromStorage } = this.props
    return (
      <TouchableOpacity
        onPress={() => {
          getAttachmentFromStorage(data)
        }}
        style={styles.legalBtnView}
      >
        <View style={styles.badgeView}>
          <Text style={styles.badgeText}>{index}</Text>
        </View>
        <Text numberOfLines={1} style={styles.tileTitle}>
          {data.name}
        </Text>
        {/* <View style={{ justifyContent: 'center' }}>
          <Text style={[styles.tileStatus, styles.statusYellow]}>PENDING</Text>
        </View> */}
      </TouchableOpacity>
    )
  }

  toggleMenu = () => {
    const { menuToggle } = this.state
    this.setState({
      menuToggle: !menuToggle,
    })
  }

  MenuTile = () => {
    const { data, submitMenu, downloadLegalDocs } = this.props
    const { menuToggle } = this.state
    return (
      <TouchableOpacity onPress={() => downloadLegalDocs(data)} style={styles.legalBtnView}>
        <AntDesign
          style={styles.checkCircle}
          name="checkcircle"
          size={20}
          color={AppStyles.colors.primaryColor}
        />
        <View style={styles.menuTileInner}>
          <View style={[styles.contentCenter, {}]}>
            <Text style={styles.uploadedText}>
              UPLOADED{' '}
              <Text style={styles.dateText}>
                @{moment(new Date(data.createdAt)).format('hh:mm A, MMM DD')}
              </Text>
            </Text>
            <Text numberOfLines={1} style={styles.textPadding}>
              {data.name}
            </Text>
          </View>
          <View style={styles.contentCenter}>
            <Menu
              visible={menuToggle}
              onDismiss={() => this.toggleMenu()}
              anchor={
                <Entypo
                  onPress={() => this.toggleMenu()}
                  onDismiss={this.toggleMenu}
                  name="dots-three-vertical"
                  size={20}
                  color={menuToggle ? AppStyles.colors.primaryColor : 'black'}
                />
              }
            >
              <Menu.Item
                onPress={() => {
                  submitMenu('edit', data)
                  this.toggleMenu()
                }}
                title="Edit"
              />
              <Menu.Item
                onPress={() => {
                  submitMenu('remove', data)
                  this.toggleMenu()
                }}
                title="Remove"
              />
              <Menu.Item
                onPress={() => {
                  submitMenu('assign_to_legal', data)
                  this.toggleMenu()
                }}
                title="Assign to Legal"
                titleStyle={styles.assignText}
              />
            </Menu>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  StatusTile = () => {
    const { data, downloadLegalDocs } = this.props
    let showStatus = this.findStatusLabel()
    let statusColor = this.findStatusColor(showStatus)

    return (
      <TouchableOpacity onPress={() => downloadLegalDocs(data)} style={styles.legalBtnView}>
        <AntDesign
          style={styles.checkCircle}
          name="checkcircle"
          size={20}
          color={AppStyles.colors.primaryColor}
        />
        <View style={[styles.statusTile]}>
          <View style={[styles.contentSpace, { flexDirection: 'row' }]}>
            <Text style={styles.uploadedText}>
              UPLOADED{' '}
              <Text style={styles.dateText}>
                @{moment(new Date(data.createdAt)).format('hh:mm A, MMM DD')}
              </Text>
            </Text>
            <Text style={[styles.tileStatus, statusColor]}>{showStatus.name}</Text>
          </View>
          <View style={styles.contentSpace}>
            <Text numberOfLines={1} style={styles.textPadding}>
              {data.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { data } = this.props
    return (
      <View>
        {!data.fileKey && <View>{this.UploadTile()}</View>}
        {data.status === 'pending' && data.fileKey !== null && <View>{this.MenuTile()}</View>}
        {data.status && data.status !== 'pending' && data.fileKey !== null && (
          <View>{this.StatusTile()}</View>
        )}
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    contacts: store.contacts.contacts,
  }
}

export default connect(mapStateToProps)(LegalTile)
