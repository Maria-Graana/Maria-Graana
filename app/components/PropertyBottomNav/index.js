/** @format */

import axios from 'axios'
import moment from 'moment'
import React from 'react'
import { Image, Linking, Text, TouchableOpacity, View, TouchableHighlight } from 'react-native'
import { Menu, Divider } from 'react-native-paper'
import { Menu as PopupMenu, MenuOptions, MenuTrigger, MenuOption } from 'react-native-popup-menu'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles'
import StaticData from '../../StaticData'
import helper from '../../helper'
import styles from './style'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'

const triggerStyles = {
  triggerText: {
    color: '#fff',
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 16,
    alignSelf: 'center',
  },
  triggerWrapper: {
    padding: 5,
    backgroundColor: AppStyles.colors.primaryColor,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    borderRadius: 5,
  },
  triggerTouchable: {
    underlayColor: '#fff',
    activeOpacity: 70,
  },
  TriggerTouchableComponent: TouchableHighlight,
}

const optionsStyles = {
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: AppStyles.colors.primaryColor,
    padding: 5,
  },
  optionsWrapper: {
    backgroundColor: '#fff',
  },
  optionWrapper: {
    backgroundColor: '#fff',
    margin: 5,
  },
  optionTouchable: {
    // activeOpacity: 70,
  },
  optionText: {},
}
class PropertyBottomNav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  callNumber = (url) => {
    if (url != 'tel:null') {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            console.log("Can't handle url: " + url)
          } else {
            this.sendCallStatus()
            return Linking.openURL(url)
          }
        })
        .catch((err) => console.error('An error occurred', err))
    } else {
      helper.errorToast(`No Phone Number`)
    }
  }

  openMenu = (status) => {
    this.setState({
      visible: status,
    })
  }

  call = () => {
    const { contacts, customer } = this.props
    let newContact = helper.createContactPayload(customer)
    this.updateStatus()
    this.sendCallStatus()
    this.props.getCallHistory()
    helper.callNumber(newContact, contacts)
  }

  sendCallStatus = () => {
    const start = moment().format()
    let body = {
      start: start,
      end: start,
      time: start,
      date: start,
      taskType: 'called',
      response: 'Called',
      subject: 'Call to client ' + this.props.lead.customer.customerName,
      cutomerId: this.props.lead.customer.id,
      armsLeadId: this.props.lead.id,
      taskCategory: 'leadTask',
    }
    axios.post(`api/leads/project/meeting`, body).then((res) => {
      // console.log('sendCallStatus: ', res.data)
    })
  }

  updateStatus = () => {
    const { lead, user } = this.props
    var leadId = []
    leadId.push(lead.id)
    if (lead.assigned_to_armsuser_id === user.id) {
      if (lead.status === 'open') {
        axios
          .patch(
            `/api/leads`,
            {
              status: 'called',
            },
            { params: { id: leadId } }
          )
          .then((res) => {
            console.log('success')
          })
          .catch((error) => {
            console.log(`ERROR: /api/leads/?id=${data.id}`, error)
          })
      }
    }
  }

  listActionMenuItems = () => {
    const { user, lead } = this.props
    let actionData = StaticData.propertyActionItems
    return actionData.map((item, index) => {
      return (
        <MenuOption
          onSelect={() => {
            if (helper.propertyLeadNavAccess(user, lead)) helper.leadClosedToast()
            else this.performListActions(item.title)
          }}
        >
          <View style={styles.menuStyle}>
            <Image style={styles.bottomNavImg} source={item.image} />
            <Text style={styles.menuText}>{item.title}</Text>
          </View>
          {actionData.length - 1 !== index && <Divider />}
        </MenuOption>
      )
    })
  }

  performListActions = (title) => {
    const { goToComments, goToDiaryForm, goToAttachments } = this.props
    if (title === 'Add Comment') goToComments()
    if (title === 'Add Diary Task') goToDiaryForm()
    if (title === 'Add Attachment') goToAttachments()
  }

  render() {
    const {
      navigateTo,
      goToFollowUp,
      closedLeadEdit,
      goToHistory,
      user,
      lead,
      permissions,
      goToAttachments,
    } = this.props
    const { visible } = this.state
    let readPermission = getPermissionValue(
      lead.purpose === 'invest'
        ? PermissionFeatures.PROJECT_LEADS
        : PermissionFeatures.BUY_RENT_LEADS,
      PermissionActions.READ,
      permissions
    )
    let referPermission = getPermissionValue(
      lead.purpose === 'invest'
        ? PermissionFeatures.PROJECT_LEADS
        : PermissionFeatures.BUY_RENT_LEADS,
      PermissionActions.REFER,
      permissions
    )
    let assignPermission = getPermissionValue(
      lead.purpose === 'invest'
        ? PermissionFeatures.PROJECT_LEADS
        : PermissionFeatures.BUY_RENT_LEADS,
      PermissionActions.ASSIGN_REASSIGN,
      permissions
    )
    let updatePermission = getPermissionValue(
      lead.purpose === 'invest'
        ? PermissionFeatures.PROJECT_LEADS
        : PermissionFeatures.BUY_RENT_LEADS,
      PermissionActions.UPDATE,
      permissions
    )
    let updateProperty = getPermissionValue(
      PermissionFeatures.PROPERTIES,
      PermissionActions.UPDATE,
      permissions
    )
    return (
      <View style={styles.bottomNavMain}>
        <TouchableOpacity style={styles.bottomNavBtn} onPress={() => navigateTo()}>
          <View style={{ alignItems: 'center' }}>
            <Image
              style={styles.bottomNavImg}
              source={require('../../../assets/img/black/details.png')}
            />
            <Text style={styles.bottomNavBtnText}>Details</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          // disabled={closedLeadEdit ? false : true}
          style={styles.followBtn}
          onPress={() => {
            goToFollowUp()
            // if (closedLeadEdit && readPermission) goToFollowup()
          }}
        >
          <View style={styles.align}>
            <Image
              style={styles.bottomNavImg}
              source={require('../../../assets/img/black/tasks.png')}
            />
            <Text style={styles.followText}>Tasks</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={closedLeadEdit ? false : true}
          style={styles.followBtn}
          onPress={() => {
            // goToHistory()
            // console.log("HISTORY")
            // if (closedLeadEdit && readPermission) goToHistory()
          }}
        >
          <View style={styles.align}>
            <Image
              style={styles.bottomNavImg}
              source={require('../../../assets/img/black/activity.png')}
            />
            <Text style={styles.followText}>Activity</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={closedLeadEdit ? false : true}
          style={styles.followBtn}
          onPress={() => {
            // if (closedLeadEdit && readPermission) {
            //   goToAttachments('view')
            // }
          }}
        >
          <View style={styles.align}>
            <Image
              style={styles.bottomNavImg}
              source={require('../../../assets/img/attachBottom.png')}
            />
            <Text style={styles.followText}>Files</Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.bottomNavBtn2, visible === true]}>
          <Menu
            visible={visible}
            onDismiss={() => {
              // this.openMenu(false)
            }}
            anchor={
              <TouchableOpacity
                onPress={() => {
                  // this.openMenu(true)
                }}
                style={styles.align}
              >
                {visible === true ? (
                  <Image
                    style={styles.bottomNavImg}
                    source={require('../../../assets/img/Blue/menu.png')}
                  />
                ) : (
                  <Image
                    style={styles.bottomNavImg}
                    source={require('../../../assets/img/black/menu.png')}
                  />
                )}
                <Text style={[styles.bottomNavBtnText, visible === true && { color: '#348ceb' }]}>
                  Menu
                </Text>
              </TouchableOpacity>
            }
          >
            <View>
              {/* {isFromViewingScreen ? (
                <Menu.Item
                  onPress={() => {
                    if (closedLeadEdit && updateProperty) {
                      goToPropertyScreen()
                      this.openMenu(false)
                    } else helper.leadClosedToast()
                  }}
                  // icon={require('../../../assets/img/properties-icon-l.png')}
                  title="Add Property"
                />
              ) : null} */}
              <Menu.Item
                disabled={true}
                onPress={() => {
                  if (closedLeadEdit && assignPermission) {
                    this.navigateToAssignLead(lead)
                    this.openMenu(false)
                  } else helper.leadClosedToast()
                }}
                // icon={require('../../../assets/img/callIcon.png')}
                title="Re-Assign"
              />
              <Menu.Item
                disabled={true}
                onPress={() => {
                  if (closedLeadEdit && referPermission) {
                    this.navigateToShareScreen(lead)
                    this.openMenu(false)
                  } else helper.leadClosedToast()
                }}
                // icon={require('../../../assets/img/callIcon.png')}
                title="Refer Lead"
              />
              <Menu.Item
                onPress={() => {
                  if (closedLeadEdit) {
                    this.onCategorySelected(lead)
                    this.openMenu(false)
                  } else helper.leadClosedToast()
                }}
                // icon={require('../../../assets/img/callIcon.png')}
                title="Set Classification"
              />
            </View>
          </Menu>
        </View>
      </View>
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

export default connect(mapStateToProps)(PropertyBottomNav)
