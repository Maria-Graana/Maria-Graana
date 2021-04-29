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
    let actionData = StaticData.propertyActionItems
    return actionData.map((item, index) => {
      return (
        <MenuOption onSelect={() => this.performListActions(item.title)}>
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
    if (title === 'Comment') goToComments()
    if (title === 'Diary Task') goToDiaryForm()
    if (title === 'Attach') goToAttachments()
  }

  render() {
    const { navigateTo, goToFollowup } = this.props
    const { visible } = this.state

    return (
      <View style={styles.bottomNavMain}>
        <TouchableOpacity style={styles.bottomNavBtn} onPress={() => navigateTo()}>
          <Image style={styles.bottomNavImg} source={require('../../../assets/img/details.png')} />
          <Text style={styles.bottomNavBtnText}>CIF</Text>
        </TouchableOpacity>
        <PopupMenu style={styles.popMenu}>
          <MenuTrigger text="Action" customStyles={triggerStyles} />
          <MenuOptions customStyles={optionsStyles}>{this.listActionMenuItems()}</MenuOptions>
        </PopupMenu>
        <TouchableOpacity style={styles.followBtn} onPress={() => goToFollowup()}>
          <Text style={styles.followText}>Follow Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectBtn} onPress={() => {}}>
          <Text style={styles.actionText}>Reject</Text>
        </TouchableOpacity>
        <View style={[styles.bottomNavBtn2, visible === true && styles.forMenuIcon]}>
          <Menu
            visible={visible}
            onDismiss={() => this.openMenu(false)}
            anchor={
              <TouchableOpacity onPress={() => this.openMenu(true)} style={styles.align}>
                {visible === true ? (
                  <Image
                    style={styles.bottomNavImg}
                    source={require('../../../assets/img/menuIcon.png')}
                  />
                ) : (
                  <Image
                    style={styles.bottomNavImg}
                    source={require('../../../assets/img/menuIcon2.png')}
                  />
                )}
                <Text style={[styles.bottomNavBtnText, visible === true && styles.colorWhite]}>
                  Menu
                </Text>
              </TouchableOpacity>
            }
          >
            <Menu.Item title="No Option" />
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
  }
}

export default connect(mapStateToProps)(PropertyBottomNav)
