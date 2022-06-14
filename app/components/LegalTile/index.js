/** @format */

import axios from 'axios'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { AntDesign, Entypo } from '@expo/vector-icons'
import TouchableButton from '../../components/TouchableButton'
import moment from 'moment-timezone'
import { connect } from 'react-redux'
import { Menu } from 'react-native-paper'
import AppStyles from '../../AppStyles'
import helper from '../../helper'
import StaticData from '../../StaticData'
import styles from './style'
import style from './style'

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
    const {
      data,
      index,
      cancelFileUploading,
      getAttachmentFromStorage,
      addBorder = false,
      isLeadClosed,
      isLeadSCA,
      submitUploadedAttachment,
      formData,
    } = this.props
    let newStyle = {}
    if (addBorder) {
      newStyle = {
        borderColor: AppStyles.colors.primaryColor,
        borderWidth: 1,
      }
    }

    return (
      <TouchableOpacity
        onPress={() => {
          getAttachmentFromStorage(data)
        }}
        style={[styles.legalBtnViewleft, newStyle]}
        disabled={isLeadClosed}
      >
        <View style={styles.legalBtnViewRight}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            {/* {index && (
            <View style={styles.badgeView}>
              <Text style={styles.badgeText}>{index}</Text>
            </View>
          )} */}
            <Text numberOfLines={1} style={styles.tileTitle}>
              {data.name === 'Cnic'
                ? data.name.toUpperCase()
                : isLeadSCA
                ? 'Service Charge Agreement'
                : data.name}
            </Text>
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Text style={[styles.tileStatus, styles.statusYellow]}>
              {data.status === 'pending_upload_by_legal'
                ? 'PENDING UPLOAD BY LEGAL'
                : 'PENDING UPLOAD'}
            </Text>
          </View>
        </View>

        {formData?.category == data?.category && (
          <View style={styles.bottomView}>
            <TouchableOpacity onPress={() => alert(formData.fileName)} style={styles.fileName}>
              <Text style={{ color: AppStyles.colors.primaryColor }} numberOfLines={1}>
                {formData.fileName}
              </Text>
            </TouchableOpacity>
            <View style={styles.bottomViewInner}>
              <TouchableOpacity onPress={() => cancelFileUploading()} style={styles.uplodBtn}>
                <Text style={{ color: AppStyles.colors.primaryColor }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => submitUploadedAttachment(formData)}
                style={styles.uplodBtn}
              >
                <Text style={{ color: AppStyles.colors.primaryColor }}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    const {
      data,
      submitMenu,
      downloadLegalDocs,
      addBorder = false,
      isLeadClosed,
      checkList,
      isLeadSCA,
    } = this.props
    const { menuToggle } = this.state
    let showStatus = this.findStatusLabel()
    let statusColor = this.findStatusColor(showStatus)
    let newStyle = {}
    if (addBorder) {
      newStyle = {
        borderColor: AppStyles.colors.primaryColor,
        borderWidth: 1,
      }
    }
    return (
      <>
        <TouchableOpacity
          onPress={() => downloadLegalDocs(data)}
          style={[styles.legalBtnView, newStyle, { height: 80 }]}
          disabled={isLeadClosed}
        >
          <AntDesign
            style={styles.checkCircle}
            name="checkcircle"
            size={20}
            color={AppStyles.colors.primaryColor}
          />
          <View style={styles.menuTileInner}>
            <View style={[styles.contentCenter, { flex: 1 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                  numberOfLines={1}
                  style={[
                    checkList ? style.hyperLinkPadding : styles.textPadding,
                    { width: '46%' },
                  ]}
                >
                  {data.name === 'Cnic'
                    ? 'Cnic Front'
                    : data.name === 'Police Verification Report Optional'
                    ? data.name.replace(' Optional', '')
                    : isLeadSCA
                    ? 'Service Charge Agreement'
                    : data.name}
                </Text>

                {data.status === 'rejected' && (
                  <Text style={[styles.tileStatus, statusColor]}>{showStatus.name}</Text>
                )}
                {data.status === 'uploaded' && (
                  <Text style={[styles.tileStatus, statusColor]}>{showStatus.name}</Text>
                )}
                {data.status === 'pending_legal' && (
                  <Text style={[styles.tileStatus, statusColor]}>{showStatus.name}</Text>
                )}
                {data.status === 'approved' && (
                  <Text style={[styles.tileStatus, statusColor]}>{showStatus.name}</Text>
                )}
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={styles.uploadedText}>
                    UPLOADED{' '}
                    <Text style={styles.dateText}>
                      @{moment(new Date(data.updatedAt)).format('hh:mm A, MMM DD')}
                    </Text>
                  </Text>
                </View>
              </View>
              {data.name === 'Police Verification Report Optional' && (
                <Text style={[styles.uploadedText, { color: 'black' }]}>(Optional)</Text>
              )}
            </View>
            {!checkList ? (
              <View
                style={[
                  data.status === 'rejected' ||
                  data.status === 'pending_legal' ||
                  data.status === 'approved'
                    ? { paddingTop: 30 }
                    : styles.contentCenter,
                ]}
              >
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
                  <View>
                    {data.status === 'pending_legal' || data.status === 'approved' ? (
                      <View>
                        <Menu.Item
                          onPress={() => {
                            submitMenu('view_legal', data)
                            this.toggleMenu()
                          }}
                          title="View Comments"
                          titleStyle={styles.assignText}
                        />
                      </View>
                    ) : null}
                    {data.status === 'rejected' ? (
                      <View>
                        <Menu.Item
                          onPress={() => {
                            submitMenu('edit', data)
                            this.toggleMenu()
                          }}
                          title="Upload Different File"
                        />
                        <Menu.Item
                          onPress={() => {
                            submitMenu('view_legal', data)
                            this.toggleMenu()
                          }}
                          title="View Comments"
                          titleStyle={styles.assignText}
                        />
                        <Menu.Item
                          onPress={() => {
                            submitMenu('submit_to_legal', data)
                            this.toggleMenu()
                          }}
                          title="Submit to Legal"
                          titleStyle={styles.assignText}
                        />
                      </View>
                    ) : (
                      <>
                        {data.status !== 'pending_legal' && data.status !== 'approved' ? (
                          <View>
                            <Menu.Item
                              onPress={() => {
                                submitMenu('edit', data)
                                this.toggleMenu()
                              }}
                              title="Upload Different File"
                            />
                            <Menu.Item
                              onPress={() => {
                                submitMenu('view_legal', data)
                                this.toggleMenu()
                              }}
                              title="View Comments"
                              titleStyle={styles.assignText}
                            />
                            <Menu.Item
                              onPress={() => {
                                submitMenu('submit_to_legal', data)
                                this.toggleMenu()
                              }}
                              title="Submit to Legal"
                              titleStyle={styles.assignText}
                            />
                          </View>
                        ) : null}
                      </>
                    )}
                  </View>
                </Menu>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      </>
    )
  }

  StatusTile = () => {
    const {
      data,
      downloadLegalDocs,
      addBorder = false,
      isLeadClosed,
      checkList,
      isLeadSCA,
    } = this.props
    let showStatus = this.findStatusLabel()
    let statusColor = this.findStatusColor(showStatus)
    let newStyle = {}
    if (addBorder) {
      newStyle = {
        borderColor: AppStyles.colors.primaryColor,
        borderWidth: 1,
      }
    }
    return (
      <TouchableOpacity
        onPress={() => downloadLegalDocs(data)}
        style={[styles.legalBtnView, newStyle]}
        disabled={isLeadClosed}
      >
        <AntDesign
          style={styles.checkCircle}
          name="checkcircle"
          size={20}
          color={AppStyles.colors.primaryColor}
        />
        <View style={[styles.statusTile]}>
          <View style={[styles.contentSpace, { flexDirection: 'row' }]}>
            <Text numberOfLines={1} style={checkList ? style.hyperLinkPadding : styles.textPadding}>
              {data.name === 'Cnic'
                ? data.name.toUpperCase()
                : isLeadSCA
                ? 'Service Charge Agreement'
                : data.name}
            </Text>
            <Text style={[styles.tileStatus, statusColor]}>{showStatus.name}</Text>
          </View>
          <View style={styles.contentSpace}>
            <Text style={styles.uploadedText}>
              UPLOADED{' '}
              <Text style={styles.dateText}>
                @{moment(new Date(data.updatedAt)).format('hh:mm A, MMM DD')}
              </Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { data, otherDoc } = this.props
    return (
      <>
        <View>
          {data && data.fileKey === null ? <View>{this.UploadTile()}</View> : null}
          {data && data.status !== 'pending' && data.fileKey !== null ? (
            <View>{this.MenuTile()}</View>
          ) : null}
          {data &&
          data.status &&
          data.status !== 'approved' &&
          data.status !== 'pending_legal' &&
          data.status !== 'uploaded' &&
          data.status !== 'pending' &&
          data.status !== 'rejected' &&
          data.fileKey !== null ? (
            <View>{this.StatusTile()}</View>
          ) : null}
        </View>
      </>
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
