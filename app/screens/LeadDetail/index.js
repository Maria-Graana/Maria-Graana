/** @format */

import axios from 'axios'
import moment from 'moment'
import { Button } from 'native-base'
import React from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { setlead } from '../../actions/lead'
import AppStyles from '../../AppStyles'
import Loader from '../../components/loader'
import helper from '../../helper'
import Ability from '../../hoc/Ability'
import StaticData from '../../StaticData'
import styles from './style'

const _format = 'YYYY-MM-DD'

class LeadDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: '',
      lead: [],
      loading: true,
      customerName: '',
      showAssignToButton: false,
      editDes: false,
      description: '',
    }
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.purposeTab()
    })
  }

  purposeTab = () => {
    const { route } = this.props
    const { purposeTab } = route.params
    if (purposeTab === 'invest') {
      this.setState(
        {
          type: 'Investment',
        },
        () => {
          this.fetchLead('/api/leads/project/byId')
        }
      )
    } else if (purposeTab === 'sale') {
      this.setState(
        {
          type: 'Buy',
        },
        () => {
          this.fetchLead('api/leads/byId')
        }
      )
    } else if (purposeTab === 'property') {
      this.setState(
        {
          type: 'Property',
        },
        () => {
          this.fetchLead('api/leads/byId')
        }
      )
    } else {
      this.setState(
        {
          type: 'Rent',
        },
        () => {
          this.fetchLead('api/leads/byId')
        }
      )
    }
  }

  fetchLead = (url) => {
    const { route, user } = this.props
    const { type } = this.state
    const { lead } = route.params
    const that = this
    axios
      .get(`${url}?id=${lead.id}`)
      .then((res) => {
        let responseData = res.data
        let leadType = type
        if (!responseData.paidProject) {
          responseData.paidProject = responseData.project
        }
        this.props.dispatch(setlead(responseData))
        const regex = /(<([^>]+)>)/gi
        let text =
          res.data.description && res.data.description !== ''
            ? res.data.description.replace(regex, '')
            : null
        let leadData = res.data
        if (
          leadData.added_by_armsuser_id !== user.id &&
          leadData.assigned_to_armsuser_id !== user.id
        )
          leadType = 'Property'
        this.setState({ lead: res.data, loading: false, description: text, type: leadType }, () => {
          that.checkCustomerName(res.data)
          that.checkAssignedLead(res.data)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  navigateTo = () => {
    const { navigation } = this.props
    const { lead, type } = this.state
    var status = lead.status
    let page = ''

    if (type === 'Investment') {
      if (
        status === 'token' ||
        status === 'payment' ||
        status === 'closed_won' ||
        status === 'closed_lost'
      ) {
        page = 'Payments'
      } else {
        page = 'Meetings'
      }
      navigation.navigate('CMLeadTabs', {
        screen: page,
        params: { lead: lead },
      })
    } else if (type === 'Property') {
      if (status === 'viewing') {
        page = 'Viewing'
      }
      if (status === 'offer') {
        page = 'Offer'
      }
      if (status === 'propsure') {
        page = 'Propsure'
      }
      if (status === 'payment') {
        page = 'Payment'
      }
      if (status === 'payment' || status === 'closed_won' || status === 'closed_lost') {
        page = 'Payment'
      }
      navigation.navigate('PropertyTabs', {
        screen: page,
        params: { lead: lead },
      })
    } else {
      if (status === 'viewing') {
        page = 'Viewing'
      }
      if (status === 'offer') {
        page = 'Offer'
      }
      if (status === 'propsure') {
        page = 'Propsure'
      }
      if (status === 'payment') {
        page = 'Payment'
      }
      if (status === 'payment' || status === 'closed_won' || status === 'closed_lost') {
        page = 'Payment'
      }
      navigation.navigate('RCMLeadTabs', {
        screen: page,
        params: { lead: lead },
      })
    }
  }

  navigateToAssignLead = () => {
    const { navigation } = this.props
    const { lead, type } = this.state
    navigation.navigate('AssignLead', { leadId: lead.id, type: type, screen: 'LeadDetail' })
  }

  checkAssignedLead = (lead) => {
    const { user } = this.props
    // Show assign lead button only if loggedIn user is Sales level2 or CC/BC/RE Manager
    if (
      Ability.canView(user.subRole, 'AssignLead') &&
      lead.status !== StaticData.Constants.lead_closed_lost &&
      lead.status !== StaticData.Constants.lead_closed_won
    ) {
      // Lead can only be assigned to someone else if it is assigned to no one or to current user
      if (lead.assigned_to_armsuser_id === null || user.id === lead.assigned_to_armsuser_id) {
        this.setState({ showAssignToButton: true })
      } else {
        // Lead is already assigned to some other user (any other user)
        this.setState({ showAssignToButton: false })
      }
    }
  }

  checkCustomerName = (lead) => {
    if (lead.projectId || lead.projectName) {
      if (lead.customer && lead.customer.customerName) {
        this.setState({ customerName: helper.capitalize(lead.customer.customerName) })
      }
    } else {
      if (lead.customer && lead.customer.first_name) {
        this.setState({
          customerName:
            helper.capitalize(lead.customer.first_name) +
            ' ' +
            helper.capitalize(lead.customer.last_name),
        })
      }
    }
  }

  goToClientsDetail = () => {
    const { lead } = this.state
    const { navigation } = this.props
    navigation.navigate('ClientDetail', { client: lead.customer ? lead.customer : null })
  }

  editDescription = (status) => {
    this.setState({
      editDes: status,
    })
  }

  handleDes = (text) => {
    const regex = /(<([^>]+)>)/gi
    text = text && text !== '' ? text.replace(regex, '') : null
    this.setState({
      description: text,
    })
  }

  submitDes = () => {
    const { route } = this.props
    const { description } = this.state
    const { purposeTab, lead } = route.params
    var endPoint = ''
    var leadId = []
    leadId.push(lead.id)
    var body = {
      description: description,
    }
    if (purposeTab == 'invest') {
      endPoint = `/api/leads/project`
    } else {
      endPoint = `/api/leads`
    }
    axios.patch(endPoint, body, { params: { id: leadId } }).then((res) => {
      this.purposeTab()
      this.editDescription(false)
    })
  }

  checkLeadSource = () => {
    const { lead } = this.state
    if (lead.origin) {
      if (lead.origin === 'arms') {
        return `${lead.origin.split('_').join(' ').toLocaleUpperCase()} ${
          lead.creator ? `(${lead.creator.firstName} ${lead.creator.lastName})` : ''
        }`
      } else {
        return `${lead.origin.split('_').join(' ').toLocaleUpperCase()}`
      }
    } else {
      return null
    }
  }

  leadSize = (unit) => {
    const { lead } = this.state
    let minSize =
      !lead.projectId && lead.size && lead.size !== null && lead.size !== undefined ? lead.size : ''
    let maxSize =
      !lead.projectId && lead.max_size && lead.max_size !== null && lead.max_size !== undefined
        ? lead.max_size
        : ''
    let size = helper.convertSizeToStringV2(
      minSize,
      maxSize,
      StaticData.Constants.size_any_value,
      unit
    )
    size = size === '' ? '' : size + ' '
    return size
  }

  render() {
    let { type, lead, customerName, showAssignToButton, loading, editDes, description } = this.state
    const { user, route } = this.props
    const { purposeTab } = route.params
    let projectName = lead.project ? helper.capitalize(lead.project.name) : lead.projectName
    const leadSource = this.checkLeadSource()
    const regex = /(<([^>]+)>)/gi
    let leadSize = this.leadSize(lead.size_unit)
    if (type === 'Property') {
      let purpose = lead.purpose === 'sale' ? 'Buy' : 'Rent'
      type = purpose
    }
    return !loading ? (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[
          AppStyles.container,
          styles.container,
          { backgroundColor: AppStyles.colors.backgroundColor },
        ]}
      >
        <View style={styles.outerContainer}>
          <View style={styles.rowContainer}>
            <View style={AppStyles.mb1}>
              <Text style={styles.headingText}>Lead Type</Text>
              <Text style={styles.labelText}>{type} </Text>
            </View>
            <View style={styles.statusView}>
              <Text style={styles.textStyle}>
                {lead.status && lead.status === 'token' ? (
                  <Text>DEAL SIGNED - TOKEN</Text>
                ) : lead.status === 'meeting' ? (
                  lead.status.split('_').join(' ').toUpperCase() + ' PLANNED'
                ) : (
                  lead.status.split('_').join(' ').toUpperCase()
                )}
              </Text>
            </View>
          </View>
          <View style={styles.underLine} />
          <View style={styles.rowContainer}>
            <View style={AppStyles.mb1}>
              <Text style={styles.headingText}>Client Name </Text>
              <Text style={styles.labelText}>{customerName === '' ? lead.customer && lead.customer.customerName: customerName}</Text>
            </View>
            {purposeTab !== 'property' && (
              <TouchableOpacity
                onPress={() => this.goToClientsDetail()}
                style={styles.roundButtonView}
                activeOpacity={0.6}
              >
                <Text style={[AppStyles.btnText, { fontSize: 16 }]}>Details</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.underLine} />
          <View style={styles.mainDesView}>
            <View style={styles.viewOne}>
              <Text style={styles.headingText}>Description </Text>
              {editDes === true ? (
                <View>
                  <TextInput
                    placeholderTextColor={'#a8a8aa'}
                    style={styles.inputDes}
                    placeholder={`Edit Description`}
                    value={description}
                    onChangeText={(text) => {
                      this.handleDes(text)
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => this.submitDes()}
                    style={styles.roundButtonViewTwo}
                    activeOpacity={0.6}
                  >
                    <Text style={{ textAlign: 'center', color: '#fff' }}>Submit</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.labelText}>
                  {lead.description && lead.description !== ''
                    ? lead.description.replace(regex, '')
                    : null}
                </Text>
              )}
            </View>
            <View style={styles.viewTwo}>
              {editDes === true ? (
                <TouchableOpacity
                  onPress={() => {
                    this.editDescription(false)
                  }}
                  style={styles.editDesBtn}
                  activeOpacity={0.6}
                >
                  <Image source={require('../../../assets/img/times.png')} style={styles.editImg} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.editDescription(true)
                  }}
                  style={styles.editDesBtn}
                  activeOpacity={0.6}
                >
                  <Image source={require('../../../assets/img/edit.png')} style={styles.editImg} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.underLine} />
          <Text style={styles.headingText}>Requirement </Text>
          <Text style={styles.labelText}>
            {!lead.projectId && leadSize}
            {!lead.projectId && `${helper.capitalize(lead.subtype)} to ${type}`}
            {lead.projectId && lead.projectType && helper.capitalize(lead.projectType)}
          </Text>
          <View style={styles.underLine} />
          <Text style={styles.headingText}>{type === 'Investment' ? 'Project' : 'Area'} </Text>
          <Text style={styles.labelText}>
            {!lead.projectId && lead.armsLeadAreas && lead.armsLeadAreas.length
              ? lead.armsLeadAreas[0].area &&
                // lead.armsLeadAreas[0].area.name
                lead.armsLeadAreas.map((item, index) => {
                  var comma = index > 0 ? ', ' : ''
                  return comma + item.area.name
                })
              : ''}
            {!lead.projectId && lead.city && ' - ' + lead.city.name}
            {purposeTab === 'invest' && projectName}
          </Text>
          <View style={styles.underLine} />
          <Text style={styles.headingText}>Price Range </Text>
          {!lead.projectId && lead.min_price && lead.price ? (
            <Text style={styles.labelText}>
              {helper.convertPriceToString(
                lead.min_price,
                lead.price,
                StaticData.Constants.any_value
              )}
            </Text>
          ) : null}
          {lead.projectId && lead.minPrice && lead.maxPrice ? (
            <Text style={styles.labelText}>
              {helper.convertPriceToString(
                lead.minPrice,
                lead.maxPrice,
                StaticData.Constants.any_value
              )}
            </Text>
          ) : null}
          <View style={styles.underLine} />
          <Text style={styles.headingText}>Assigned</Text>
          <Text style={styles.labelText}>
            {lead.assigned_at ? moment(lead.assigned_at).format('MMM DD YYYY, hh:mm A') : '-'}{' '}
          </Text>
          <View style={styles.underLine} />
          <Text style={styles.headingText}>Created </Text>
          <Text style={styles.labelText}>
            {moment(lead.createdAt).format('MMM DD YYYY, hh:mm A')}{' '}
          </Text>
          <View style={styles.underLine} />
          <Text style={styles.headingText}>Modified</Text>
          <Text style={styles.labelText}>
            {moment(lead.updatedAt).format('MMM DD YYYY, hh:mm A')}{' '}
          </Text>
          <View style={styles.underLine} />
          {lead.shared_with_armsuser_id &&
          user.id !== lead.shared_with_armsuser_id &&
          lead.shareUser ? (
            <>
              <Text style={styles.headingText}>Shared with</Text>
              <Text style={styles.labelText}>
                {lead.shareUser.firstName +
                  ' ' +
                  lead.shareUser.lastName +
                  ', ' +
                  lead.shareUser.phoneNumber}{' '}
              </Text>
              <View style={styles.underLine} />
            </>
          ) : null}
          {lead.shared_with_armsuser_id &&
          user.id === lead.shared_with_armsuser_id &&
          lead.armsuser ? (
            <>
              <Text style={styles.headingText}>Shared by</Text>
              <Text style={styles.labelText}>
                {lead.armsuser.firstName +
                  ' ' +
                  lead.armsuser.lastName +
                  ', ' +
                  (lead.armsuser.phoneNumber ? lead.armsuser.phoneNumber : '')}{' '}
              </Text>
              <View style={styles.underLine} />
            </>
          ) : null}
          {lead.sharedAt ? (
            <>
              <Text style={styles.headingText}>Shared at</Text>
              <Text style={styles.labelText}>
                {moment(lead.sharedAt).format('MMM DD YYYY, hh:mm A')}{' '}
              </Text>
              <View style={styles.underLine} />
            </>
          ) : null}

          <Text style={styles.headingText}>Lead Source </Text>
          <Text numberOfLines={1} style={styles.labelText}>
            {leadSource} {lead.projectId && lead.bulk && '(Bulk uploaded)'}
          </Text>
          <View style={styles.underLine} />
          <Text style={styles.headingText}>Assigned To </Text>
          <Text style={styles.labelText}>
            {lead.armsuser && lead.armsuser.firstName
              ? lead.armsuser.firstName + ' ' + lead.armsuser.lastName
              : '-'}
          </Text>
          <View style={styles.underLine} />
          <Text style={styles.headingText}>Lead ID</Text>
          <Text style={styles.labelText}>{lead.id ? lead.id : ''} </Text>
          <View style={styles.underLine} />
          <Text style={styles.headingText}>Additional Information </Text>
          <Text style={styles.labelText}>{lead.category ? lead.category : 'NA'} </Text>
        </View>

        <View style={[AppStyles.assignButtonView]}>
          <Button
            onPress={() => {
              this.navigateTo()
            }}
            style={[AppStyles.formBtn, styles.btn1]}
          >
            <Text style={AppStyles.btnText}>OPEN LEAD WORKFLOW</Text>
          </Button>
        </View>
      </ScrollView>
    ) : (
      <Loader loading={loading} />
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(LeadDetail)
