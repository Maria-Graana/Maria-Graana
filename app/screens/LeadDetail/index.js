/** @format */

import axios from 'axios'
import moment from 'moment'
import { Button } from 'native-base'
import React from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { goBack, setlead } from '../../actions/lead'
import AppStyles from '../../AppStyles'
import Loader from '../../components/loader'
import VoicePlayer from '../../components/VoicePlayer'
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
      mainButtonText: `Let’s Earn`,
      fromScreen: null,
    }
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params && this.props.route.params.isFromLeadWorkflow) {
        this.setState({ mainButtonText: 'Go Back', fromScreen: this.props.route.params.fromScreen })
      } else {
        this.setState({ mainButtonText: `Let's Earn`, fromScreen: null })
      }
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
          this.props.navigation.setParams({ type: 'Investment' })
          this.fetchLead('/api/leads/project/byId')
        }
      )
    } else if (purposeTab === 'sale' || purposeTab === 'buy') {
      this.setState(
        {
          type: 'Buy',
        },
        () => {
          this.props.navigation.setParams({ type: 'Buy' })
          this.fetchLead('api/leads/byId')
        }
      )
    } else if (purposeTab === 'property') {
      this.setState(
        {
          type: 'Property',
        },
        () => {
          this.props.navigation.setParams({ type: 'Property' })
          this.fetchLead('api/leads/byId')
        }
      )
    } else if (purposeTab === 'wanted') {
      this.setState(
        {
          type: 'Wanted',
        },
        () => {
          this.props.navigation.setParams({ type: 'Wanted' })
          this.fetchLead('api/wanted')
        }
      )
    } else {
      this.setState(
        {
          type: 'Rent',
        },
        () => {
          this.props.navigation.setParams({ type: 'Rent' })
          this.fetchLead('api/leads/byId')
        }
      )
    }
  }

  fetchLead = (url) => {
    const { route, user } = this.props
    const { type } = this.state
    const { lead, purposeTab } = route.params
    const that = this
    axios
      .get(`${url}?id=${lead.id}`)
      .then((res) => {
        let responseData =
          purposeTab == 'wanted' ? (res.data.rows.length > 0 ? res.data.rows[0] : {}) : res.data
        let leadType = type
        if (!responseData.paidProject && purposeTab !== 'wanted') {
          responseData.paidProject = responseData.project
        }
        this.props.dispatch(setlead(responseData))
        const regex = /(<([^>]+)>)/gi
        let text =
          purposeTab == 'wanted' && res.data.rows[0].description
            ? res.data.rows[0].description
            : res.data.description && res.data.description !== ''
            ? res.data.description.replace(regex, '')
            : null
        let leadData = purposeTab == 'wanted' ? res.data.rows[0] : res.data
        if (
          leadData.added_by_armsuser_id !== user.id &&
          leadData.assigned_to_armsuser_id !== user.id &&
          purposeTab !== 'invest'
        ) {
          leadType = 'Property'
        }

        this.setState(
          {
            lead: purposeTab == 'wanted' ? res.data.rows[0] : res.data,
            loading: false,
            description: text,
            type: leadType,
          },
          () => {
            purposeTab == 'wanted'
              ? that.checkCustomerName(res.data.rows[0])
              : that.checkCustomerName(res.data)
            purposeTab == 'wanted'
              ? that.checkAssignedLead(res.data.rows[0])
              : that.checkAssignedLead(res.data)
          }
        )
      })
      .catch((error) => {
        console.log(error, `${url}?id=${lead.id}`)
      })
  }

  navigateTo = () => {
    const { navigation, user } = this.props
    const { lead, type } = this.state
    var status = lead.status
    let page = ''
    if (!helper.checkAssignedSharedStatusANDReadOnly(user, lead)) {
      return
    }
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

  goBack = () => {
    const { lead, type, fromScreen } = this.state
    const { navigation } = this.props
    goBack({ lead, type, fromScreen, navigation })
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
    const { navigation, user } = this.props
    if (!helper.checkAssignedSharedStatusANDReadOnly(user, lead)) {
      return
    }
    if (lead.customer) {
      navigation.navigate('ClientDetail', { client: lead.customer ? lead.customer : null })
    } else {
      helper.errorToast(`Client information is not available.`)
    }
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
    } else if (purposeTab == 'wanted') {
      endPoint = `/api/wanted`
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
          lead.creator
            ? `(${helper.capitalize(lead.creator.firstName)} ${helper.capitalize(
                lead.creator.lastName
              )})`
            : ''
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

  getAssignedByName = (lead) => {
    if (lead && lead.cmAssignedBy) {
      return (
        helper.capitalize(lead.cmAssignedBy.firstName) +
        ' ' +
        helper.capitalize(lead.cmAssignedBy.lastName)
      )
    } else if (lead && lead.rcmAssignedBy) {
      return (
        helper.capitalize(lead.rcmAssignedBy.firstName) +
        ' ' +
        helper.capitalize(lead.rcmAssignedBy.lastName)
      )
    } else {
      return null
    }
  }

  leadStatus = () => {
    const { lead } = this.state
    if (lead && lead.status) {
      if (
        lead.status === 'viewing' ||
        lead.status === 'propsure' ||
        lead.status === 'offer' ||
        lead.status === 'offer'
      ) {
        return 'Shortlisting'
      }
      if (lead.status === 'meeting' || lead.status === 'nurture') {
        return 'In-Progress'
      } else {
        return helper.showStatus(lead.status.replace(/_+/g, ' ')).toUpperCase()
      }
    }
  }

  setCustomerName = () => {
    const { user } = this.props
    const { customerName, lead } = this.state
    if (helper.checkAssignedSharedWithoutMsg(user, lead)) return '---'
    else return customerName === '' ? lead.customer && lead.customer.customerName : customerName
  }

  render() {
    let { type, lead, mainButtonText, fromScreen, loading, editDes, description } = this.state
    const { user, route } = this.props
    const { purposeTab } = route.params
    const { screen } = route.params
    const { screenName } = route.params
    let projectName = lead.project ? helper.capitalize(lead.project.name) : lead.projectName
    const leadSource = this.checkLeadSource()
    const regex = /(<([^>]+)>)/gi
    let leadSize = this.leadSize(lead.size_unit)
    if (type === 'Property') {
      let purpose = lead.purpose === 'sale' || lead.purpose === 'buy' ? 'Buy' : 'Rent'
      type = purpose
    }
    let additionalInformation = []

    if (lead && lead.fbAdditionalDetails) {
      let parseAdditonalInfo = JSON.parse(lead.fbAdditionalDetails)
      additionalInformation = Object.keys(parseAdditonalInfo).map((item, index) =>
        parseAdditonalInfo[item].map((internalItem, index) => internalItem + ', ')
      )
    }
    let leadStatus = this.leadStatus()
    let assignedByName = this.getAssignedByName(lead)
    let checkAssignedShared = helper.checkAssignedSharedWithoutMsg()
    let setCustomerName = this.setCustomerName()

    return !loading ? (
      <View style={[AppStyles.container, styles.container]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.cardContainer}>
            <View style={styles.cardItemGrey}>
              <View style={styles.rowContainer}>
                <View>
                  <Text style={styles.headingText}>Client Name </Text>
                  {screenName === 'diary' ? (
                    <Text style={styles.labelText}>
                      {setCustomerName === 'undefined'
                        ? setCustomerName
                        : lead.customer && lead.customer.customerName}
                    </Text>
                  ) : (
                    <Text style={styles.labelText}>
                      {lead.customer && lead.customer.customerName}
                    </Text>
                  )}
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
            </View>

            <View style={styles.cardItemWhite}>
              <Text style={styles.headingText}>Requirement </Text>
              <Text style={styles.labelText}>
                {!lead.projectId && leadSize}
                {!lead.projectId && type !== 'Investment'
                  ? `${helper.capitalize(lead.subtype)} to ${type}`
                  : `Looking to Invest in Any Project`}
                {lead.projectId && (lead.projectType ? helper.capitalize(lead.projectType) : '-')}
              </Text>
            </View>

            <View style={styles.cardItemGrey}>
              <Text style={styles.headingText}>Price Range </Text>
              {!lead.projectId &&
              (lead.min_price !== null || lead.min_price !== undefined) &&
              (lead.price !== null || lead.price !== undefined) ? (
                <Text style={styles.labelText}>
                  {helper.convertPriceToStringLead(
                    lead.min_price,
                    lead.price,
                    StaticData.Constants.any_value
                  )}
                </Text>
              ) : null}
              {lead.projectId &&
              (lead.minPrice !== null || lead.minPrice !== undefined) &&
              (lead.maxPrice !== null || lead.maxPrice !== undefined) ? (
                <Text style={styles.labelText}>
                  {helper.convertPriceToStringLead(
                    lead.minPrice,
                    lead.maxPrice,
                    StaticData.Constants.any_value
                  )}
                </Text>
              ) : null}
            </View>

            <View style={styles.cardItemWhite}>
              <Text style={styles.headingText}>{type === 'Investment' ? 'Project' : 'Area'} </Text>
              {purposeTab === 'invest' ? (
                <Text style={styles.labelText}>{projectName ? projectName : 'Any Project'}</Text>
              ) : (
                <Text style={styles.labelText}>
                  {!lead.projectId &&
                  lead.armsLeadAreas &&
                  lead.armsLeadAreas.length &&
                  lead.armsLeadAreas[0].area
                    ? lead.armsLeadAreas[0].area &&
                      // lead.armsLeadAreas[0].area.name
                      lead.armsLeadAreas.map((item, index) => {
                        var comma = index > 0 ? ', ' : ''
                        return comma + item.area.name
                      })
                    : 'Area not specified'}
                  {!lead.projectId && lead.city && ' - ' + lead.city.name}
                </Text>
              )}
            </View>

            {additionalInformation.length > 0 ? (
              <View style={styles.cardItemWhite}>
                <Text style={styles.headingText}>Additional Details </Text>
                <Text style={styles.labelText}>{additionalInformation}</Text>
              </View>
            ) : null}

            {lead.projectId && lead.guideReference ? (
              <View style={styles.cardItemWhite}>
                <Text style={styles.headingText}>Reference Guide#</Text>
                <Text style={styles.labelText}>{lead.guideReference}</Text>
              </View>
            ) : null}

            {lead.wanted && lead.wanted.voiceLead && lead.wanted.voiceLead.voiceNoteLink ? (
              <View style={styles.cardItemWhite}>
                <Text style={styles.headingText}>Voice Note</Text>
                <VoicePlayer
                  audioFile={lead.wanted.voiceLead.voiceNoteLink}
                  voiceLead={lead.wanted.voiceLead}
                />
              </View>
            ) : null}

            <View style={styles.cardItemGrey}>
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
                    <Text style={[styles.labelText, { color: AppStyles.colors.textColor }]}>
                      {lead.description && lead.description !== ''
                        ? lead.description.replace(regex, '')
                        : null}
                    </Text>
                  )}
                </View>
                {helper.checkAssignedSharedStatusANDReadOnly(user, lead) ? (
                  <View style={styles.viewTwo}>
                    {editDes === true ? (
                      <TouchableOpacity
                        onPress={() => {
                          this.editDescription(false)
                        }}
                        style={styles.editDesBtn}
                        activeOpacity={0.6}
                      >
                        <Image
                          source={require('../../../assets/img/times.png')}
                          style={styles.editImg}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          this.editDescription(true)
                        }}
                        style={styles.editDesBtn}
                        activeOpacity={0.6}
                      >
                        <Image
                          source={require('../../../assets/img/edit.png')}
                          style={styles.editImg}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : null}
              </View>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.rowContainerType2}>
              <Text style={styles.headingTextTypeTwo}>Lead Type</Text>
              <Text style={[styles.labelTextTypeTwo, { width: '35%' }]}>{type} </Text>
              <View style={styles.statusView}>
                <Text style={styles.textStyle} numberOfLines={1}>
                  {leadStatus}
                </Text>
              </View>
            </View>

            <View style={styles.rowContainerType2}>
              <Text style={styles.headingTextTypeTwo}>Classification</Text>
              <Text style={styles.labelTextTypeTwo}>
                {lead.leadCategory ? lead.leadCategory : '-'}
              </Text>
            </View>

            <View style={styles.rowContainerType2}>
              <Text style={styles.headingTextTypeTwo}>Assigned To </Text>
              <Text style={styles.labelTextTypeTwo}>
                {lead.armsuser && lead.armsuser.firstName
                  ? lead.armsuser.firstName + ' ' + lead.armsuser.lastName
                  : '-'}
              </Text>
            </View>

            <View style={styles.rowContainerType2}>
              <Text style={styles.headingTextTypeTwo}>Assigned</Text>
              <Text style={styles.labelTextTypeTwo}>
                {lead.assigned_at ? moment(lead.assigned_at).format('MMM DD YYYY, hh:mm A') : '-'}{' '}
              </Text>
            </View>

            <View style={styles.rowContainerType2}>
              <Text style={styles.headingTextTypeTwo}>Created </Text>
              <Text style={styles.labelTextTypeTwo}>
                {moment(lead.createdAt).format('MMM DD YYYY, hh:mm A')}{' '}
              </Text>
            </View>

            <View style={styles.rowContainerType2}>
              <Text style={styles.headingTextTypeTwo}>Modified</Text>
              <Text style={styles.labelTextTypeTwo}>
                {moment(lead.updatedAt).format('MMM DD YYYY, hh:mm A')}{' '}
              </Text>
            </View>

            {lead.shared_with_armsuser_id &&
            user.id !== lead.shared_with_armsuser_id &&
            lead.shareUser ? (
              <View style={styles.rowContainerType2}>
                <Text style={styles.headingTextTypeTwo}>Reffered to</Text>
                <Text style={styles.labelTextTypeTwo}>
                  {lead.shareUser.firstName +
                    ' ' +
                    lead.shareUser.lastName +
                    ', ' +
                    lead.shareUser.phoneNumber}{' '}
                </Text>
              </View>
            ) : null}

            {lead.shared_with_armsuser_id &&
            user.id === lead.shared_with_armsuser_id &&
            lead.armsuser ? (
              <View style={styles.rowContainerType2}>
                <Text style={styles.headingTextTypeTwo}>Reffered by</Text>
                <Text style={styles.labelTextTypeTwo}>
                  {lead.armsuser.firstName +
                    ' ' +
                    lead.armsuser.lastName +
                    ', ' +
                    (lead.armsuser.phoneNumber ? lead.armsuser.phoneNumber : '')}{' '}
                </Text>
              </View>
            ) : null}

            {lead.sharedAt ? (
              <View style={styles.rowContainerType2}>
                <Text style={styles.headingTextTypeTwo}>Shared at</Text>
                <Text style={styles.labelTextTypeTwo}>
                  {moment(lead.sharedAt).format('MMM DD YYYY, hh:mm A')}{' '}
                </Text>
              </View>
            ) : null}

            <View style={styles.rowContainerType2}>
              <Text style={styles.headingTextTypeTwo}>Lead Source </Text>
              <Text numberOfLines={1} style={styles.labelTextTypeTwo}>
                {leadSource} {lead.projectId && lead.bulk && '(Bulk uploaded)'}
              </Text>
            </View>

            {assignedByName ? (
              <View style={styles.rowContainerType2}>
                <Text style={styles.headingTextTypeTwo}>Assigned By</Text>
                <Text numberOfLines={1} style={styles.labelTextTypeTwo}>
                  {assignedByName}
                </Text>
              </View>
            ) : null}

            {lead && lead.city ? (
              <View style={styles.rowContainerType2}>
                <Text style={styles.headingTextTypeTwo}>Lead City </Text>
                <Text numberOfLines={1} style={styles.labelTextTypeTwo}>
                  {lead.city.name}
                </Text>
              </View>
            ) : null}

            <View style={styles.rowContainerType2}>
              <Text style={styles.headingTextTypeTwo}>Lead ID</Text>
              <Text style={styles.labelTextTypeTwo}>{lead.id ? lead.id : ''} </Text>
            </View>

            <View style={styles.rowContainerType2}>
              <Text style={styles.headingTextTypeTwo}>Additional Info</Text>
              <Text style={styles.labelTextTypeTwo}>{lead.category ? lead.category : 'NA'} </Text>
            </View>
          </View>
        </ScrollView>
        {/* {screen === 'MenuLead' || screenName === 'MyDeals' || purposeTab == 'wanted' || screenName === "Leads" ? null : (
          <View style={styles.bottom}>
            <Button
              onPress={() => {
                fromScreen ? this.goBack() : this.navigateTo()
              }}
              style={[AppStyles.formBtn, styles.btn1]}
            >
              <Text style={AppStyles.btnText}>{mainButtonText}</Text>
            </Button>
          </View>
        )} */}
      </View>
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
