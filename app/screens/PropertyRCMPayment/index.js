/** @format */

import * as React from 'react'
import styles from './styles'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles'
import MatchTile from '../../components/MatchTile/index'
import AgentTile from '../../components/AgentTile/index'
import { Button } from 'native-base'
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import Loader from '../../components/loader'
import BuyPaymentView from './buyPaymentView'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import _ from 'underscore'
import StaticData from '../../StaticData'
import helper from '../../helper'
import { setlead } from '../../actions/lead'
import { setRCMPayment } from '../../actions/rcmPayment'
import CMBottomNav from '../../components/CMBottomNav'
import RentPaymentView from './rentPaymentView'
import { ProgressBar } from 'react-native-paper'
import HistoryModal from '../../components/HistoryModal/index'
import AddCommissionModal from '../../components/AddCommissionModal'
import PropertyBottomNav from '../../components/PropertyBottomNav'
import PropMatchTile from '../../components/PropMatchTile'
import PropAgentTile from '../../components/PropAgentTile'
import { apps } from 'firebase'

class PropertyRCMPayment extends React.Component {
  constructor(props) {
    super(props)
    const { user, lead } = this.props
    this.state = {
      loading: true,
      isVisible: false,
      open: false,
      allProperties: [],
      checkReasonValidation: false,
      selectedReason: '',
      reasons: [],
      agreedAmount: null,
      token: null,
      showAgreedAmountArrow: false,
      showTokenAmountArrow: false,
      lead: props.lead,
      pickerData: StaticData.oneToTwelve,
      showMonthlyRentArrow: false,
      formData: {
        contract_months: null,
        monthlyRent: null,
        security: null,
        advance: null,
      },
      progressValue: 0,
      // for the lead close dialog
      checkReasonValidation: false,
      selectedReason: '',
      reasons: [],
      closedLeadEdit: helper.propertyCheckAssignedSharedStatus(user, lead),
      showStyling: '',
      tokenDateStatus: false,
      tokenPriceFromat: true,
      agreeAmountFromat: true,
      monthlyFormatStatus: true,
      organization: 'arms',
      callModal: false,
      meetings: [],
      modalValidation: false,
      addPaymentLoading: false,
      editable: false,
      matchData: [],
      menuShow: false,
    }
  }

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getCallHistory()
      this.getSelectedProperty(this.state.lead)
    })
  }

  clearReduxAndStateValues = () => {
    const { dispatch } = this.props
    const newData = {
      installmentAmount: null,
      type: '',
      rcmLeadId: null,
      details: '',
      visible: false,
      paymentAttachments: [],
    }
    this.setState({
      modalValidation: false,
      addPaymentLoading: false,
      editable: false,
    })
    dispatch(setRCMPayment(newData))
  }

  componentWillUnmount() {
    this.clearReduxAndStateValues()
    this._unsubscribe()
  }

  getSelectedProperty = (lead) => {
    const { dispatch } = this.props
    const { rcmProgressBar } = StaticData
    let properties = []
    this.setState({ loading: true }, () => {
      axios
        .get(`/api/leads/byId?id=${lead.id}`)
        .then((response) => {
          //console.log(response.data)
          dispatch(setlead(response.data))
          this.setState({ progressValue: rcmProgressBar[lead.status], lead: response.data })
          if (response.data.shortlist_id === null) {
            this.getShortlistedProperties(lead)
            return
          } else {
            if (response.data.paymentProperty) {
              properties.push(response.data.paymentProperty)
              properties = helper.propertyIdCheck(properties)
              this.setState(
                {
                  loading: false,
                  allProperties: properties.length > 0 && properties,
                  selectedReason: '',
                  checkReasonValidation: '',
                  agreedAmount: lead.payment ? String(lead.payment) : '',
                  token: lead.token ? String(lead.token) : '',
                  commissions: lead.commissions ? lead.commissions : null,
                  formData: {
                    contract_months: lead.contract_months ? String(lead.contract_months) : '',
                    security: lead.security ? String(lead.security) : '',
                    advance: lead.advance ? String(lead.advance) : '',
                    monthlyRent: lead.monthlyRent ? String(lead.monthlyRent) : '',
                  },
                },
                () => {
                  if (lead.token != null) {
                    this.dateStatusChange('token', true)
                    this.formatStatusChange('token', true)
                  }
                  if (lead.monthlyRent != null) {
                    this.formatStatusChange('monthlyRent', true)
                  }
                }
              )
            } else {
              alert('Something went wrong...')
            }
          }
        })
        .catch((error) => {
          console.log(error)
          this.setState({
            loading: false,
          })
        })
    })
  }

  getShortlistedProperties = (lead) => {
    let matches = []
    const { user } = this.props
    let shortListCheck = false
    axios
      .get(`/api/leads/${lead.id}/shortlist`)
      .then((response) => {
        matches = helper.propertyCheck(response.data.rows)
        if (matches && matches.length) {
          matches = _.find(matches, (property) => {
            if (
              helper.isSellerOrBuyer(property, lead, user) &&
              lead.shortlist_id &&
              lead.shortlist_id === property.id
            ) {
              //console.log('shortlisted selected for payment')
              shortListCheck = true
              return property
            } else {
              shortListCheck = false
              return null
            }
          })
          if (!shortListCheck) matches = []
        } else {
          matches = []
        }
        this.setState({
          allProperties: matches,
          loading: false,
          selectedReason: '',
          checkReasonValidation: '',
          agreedAmount: lead.payment ? String(lead.payment) : '',
          token: lead.token ? String(lead.token) : '',
          formData: {
            contract_months: lead.contract_months ? String(lead.contract_months) : '',
            security: lead.security ? String(lead.security) : '',
            advance: lead.advance ? String(lead.advance) : '',
            monthlyRent: lead.monthlyRent ? String(lead.monthlyRent) : '',
          },
        })
      })
      .catch((error) => {
        console.log(error)
        this.setState({
          loading: false,
        })
      })
  }

  displayChecks = () => {}

  addProperty = () => {}

  ownProperty = (property) => {
    const { user } = this.props
    const { organization } = this.state
    if (property.arms_id) {
      if (property.assigned_to_armsuser_id) {
        return user.id === property.assigned_to_armsuser_id
      } else {
        return false
      }
    } else {
      return true
    }
  }

  handleReasonChange = (value) => {
    this.setState({ selectedReason: value })
  }

  closedLead = () => {
    helper.leadClosedToast()
  }

  closeModal = () => {
    this.setState({ isVisible: false })
  }

  showLeadPaymentModal = () => {
    const { lead } = this.state
    if (lead.commissions && lead.commissions.status === StaticData.leadClearedStatus) {
      this.setState({
        reasons: StaticData.leadCloseReasonsWithPayment,
        isVisible: true,
        checkReasonValidation: '',
      })
    } else {
      this.setState({
        reasons: StaticData.leadCloseReasons,
        isVisible: true,
        checkReasonValidation: '',
      })
    }
  }

  handleAgreedAmountChange = (agreedAmount) => {
    if (agreedAmount === '') {
      this.setState({ agreedAmount: '' })
    } else if (agreedAmount !== '') {
      this.setState({ agreedAmount, showAgreedAmountArrow: true })
    }
  }

  handleTokenAmountChange = (token) => {
    if (token === '') {
      this.setState({ token: '' })
    } else if (token !== '') {
      this.setState({ token, showTokenAmountArrow: true })
    }
  }

  convertToInteger = (val) => {
    if (val === '') {
      return null
    } else if (typeof val === 'string' && val != '') {
      return parseInt(val)
    }
  }

  handleTokenAmountPress = () => {
    const { token } = this.state
    const { lead } = this.state
    let payload = Object.create({})
    payload.token = this.convertToInteger(token)
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads`, payload, { params: { id: leadId } })
      .then((response) => {
        this.props.dispatch(setlead(response.data))
        this.setState({
          showTokenAmountArrow: false,
          lead: response.data,
          showStyling: '',
          tokenDateStatus: true,
        })
        this.formatStatusChange('token', true)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  handleAgreedAmountPress = () => {
    const { agreedAmount } = this.state
    const { lead } = this.state
    let payload = Object.create({})
    payload.payment = this.convertToInteger(agreedAmount)
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads`, payload, { params: { id: leadId } })
      .then((response) => {
        this.props.dispatch(setlead(response.data))
        this.setState({
          showAgreedAmountArrow: false,
          lead: response.data,
          showStyling: '',
          agreeAmountFromat: true,
        })
        this.formatStatusChange('agreeAmount', true)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  handleMonthlyRentPress = () => {
    const { formData } = this.state
    const { monthlyRent } = formData
    const { lead } = this.state
    let payload = Object.create({})
    payload.monthlyRent = this.convertToInteger(monthlyRent)
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads`, payload, { params: { id: leadId } })
      .then((response) => {
        this.props.dispatch(setlead(response.data))
        this.setState({
          showMonthlyRentArrow: false,
          lead: response.data,
          showStyling: '',
        })
        this.formatStatusChange('monthlyRent', true)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  onHandleCloseLead = () => {
    const { navigation } = this.props
    const { lead, selectedReason } = this.state
    let payload = Object.create({})
    payload.reasons = selectedReason
    if (selectedReason !== '') {
      var leadId = []
      leadId.push(lead.id)
      axios
        .patch(`/api/leads`, payload, { params: { id: leadId } })
        .then((response) => {
          this.setState({ isVisible: false }, () => {
            navigation.navigate('Leads')
          })
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      alert('Please select a reason for lead closure!')
    }
  }

  handleForm = (value, name) => {
    const { formData } = this.state
    formData[name] = value
    this.setState({ formData }, () => {})
    if (formData.monthlyRent !== '' && name === 'monthlyRent') {
      this.setState({ showMonthlyRentArrow: true })
    }
    if (formData.contract_months !== '' && name === 'contract_months') {
      this.updateRentLead(formData.contract_months, name)
    }
    if (formData.advance !== '' && name === 'advance') {
      this.updateRentLead(formData.advance, name)
    }
    if (formData.security !== '' && name === 'security') {
      this.updateRentLead(formData.security, name)
    }
  }

  updateRentLead = (value, key) => {
    const { lead } = this.state
    const { allProperties } = this.state
    const selectedProperty = allProperties[0]
    let payload = Object.create({})
    payload.shortlist_id = selectedProperty.id
    switch (key) {
      case 'contract_months':
        payload.contract_months = this.convertToInteger(value)
        break
      case 'advance':
        payload.advance = this.convertToInteger(value)
        break
      case 'security':
        payload.security = this.convertToInteger(value)
        break
    }
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads`, payload, { params: { id: leadId } })
      .then((response) => {
        this.props.dispatch(setlead(response.data))
        this.setState({ lead: response.data })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  goToDiaryForm = () => {
    const { navigation, user } = this.props
    const { lead } = this.state
    navigation.navigate('AddDiary', {
      update: false,
      rcmLeadId: lead.id,
      agentId: user.id,
      addedBy: 'self',
    })
  }

  goToAttachments = () => {
    const { navigation } = this.props
    const { lead } = this.state
    navigation.navigate('Attachments', { rcmLeadId: lead.id })
  }

  goToComments = () => {
    const { navigation } = this.props
    const { lead } = this.state
    navigation.navigate('Comments', { rcmLeadId: lead.id })
  }

  navigateToDetails = () => {
    this.props.navigation.navigate('LeadDetail', { lead: this.props.lead, purposeTab: 'property' })
  }

  showAndHideStyling = (name, clear) => {
    const { dummyData, inputDateStatus, inputDateStatus2 } = this.state
    const newDummy = dummyData

    if (clear === true) {
      this.clearStateValue(name, clear)
    }

    if (name === 'token') {
      this.dateStatusChange(name, false)
      this.formatStatusChange(name, false)
    }

    if (name != 'token') {
      this.dateStatusChange('token', true)
      this.formatStatusChange('token', true)
    }

    if (name === 'agreeAmount') {
      this.formatStatusChange(name, false)
    }

    if (name != 'agreeAmount') {
      this.formatStatusChange('agreeAmount', true)
    }

    if (name === 'monthlyRent') {
      this.formatStatusChange(name, false)
    }
    if (name != 'monthlyRent') {
      this.formatStatusChange('monthlyRent', true)
    }

    this.setState({
      showStyling: clear === false ? name : '',
      showDate: false,
    })
  }

  formatStatusChange = (name, status, arrayName) => {
    const {} = this.state
    if (name === 'token') {
      this.setState({ tokenPriceFromat: status })
    }
    if (name === 'agreeAmount') {
      this.setState({ agreeAmountFromat: status })
    }
    if (name === 'monthlyRent') {
      this.setState({ monthlyFormatStatus: status })
    }
  }

  dateStatusChange = (name, status, arrayName) => {
    const {} = this.state
    if (name === 'token') {
      this.setState({ tokenDateStatus: status })
    }
    if (name === 'agreeAmount') {
      this.setState({ agreeAmountFromat: status })
    }
  }

  clearStateValue(name, clear) {
    const { lead } = this.props
    axios.get(`/api/leads/byId?id=${lead.id}`).then((res) => {
      if (name === 'token') {
        var token = res.data.token
        this.setState({ token: token != null ? token : '' }, () => {
          if (token != null) {
            this.dateStatusChange(name, true)
            this.formatStatusChange(name, true)
          } else {
            this.dateStatusChange(name, false)
            this.formatStatusChange(name, false)
          }
        })
      }

      if (name === 'agreeAmount') {
        var agreeAmount = res.data.payment
        this.setState({ agreedAmount: agreeAmount != null ? agreeAmount : '' }, () => {
          if (agreeAmount != null) {
            this.dateStatusChange(name, true)
            this.formatStatusChange(name, true)
          } else {
            this.dateStatusChange(name, false)
            this.formatStatusChange(name, false)
          }
        })
      }

      if (name === 'monthlyRent') {
        var monthly = res.data.monthlyRent
        var newFormdata = { ...this.state.formData }
        newFormdata['monthlyRent'] = monthly != null ? monthly : ''
        this.setState({ formData: newFormdata }, () => {
          if (monthly != null) {
            this.formatStatusChange(name, true)
          } else {
            this.formatStatusChange(name, false)
          }
        })
      }
    })
  }

  goToHistory = () => {
    const { callModal } = this.state
    this.setState({ callModal: !callModal })
  }

  getCallHistory = () => {
    const { lead } = this.props
    axios.get(`/api/diary/all?armsLeadId=${lead.id}`).then((res) => {
      this.setState({ meetings: res.data.rows })
    })
  }

  onAddCommissionPayment = () => {
    const { dispatch, rcmPayment } = this.props
    dispatch(setRCMPayment({ ...rcmPayment, visible: true }))
  }

  onModalCloseClick = () => {
    this.clearReduxAndStateValues()
  }

  handleCommissionChange = (value, name) => {
    const { rcmPayment, dispatch } = this.props
    const newSecondFormData = { ...rcmPayment, visible: rcmPayment.visible }
    newSecondFormData[name] = value
    dispatch(setRCMPayment(newSecondFormData))
  }

  setCommissionEditData = (data) => {
    const { dispatch } = this.props
    this.setState({ editable: true })
    dispatch(setRCMPayment({ ...data, visible: true }))
  }

  goToPayAttachments = () => {
    const { rcmPayment, dispatch, navigation } = this.props
    dispatch(setRCMPayment({ ...rcmPayment, visible: false }))
    navigation.navigate('RCMAttachment')
  }

  uploadAttachment = (paymentAttachment, paymentId) => {
    let attachment = {
      name: paymentAttachment.fileName,
      type: 'file/' + paymentAttachment.fileName.split('.').pop(),
      uri: paymentAttachment.uri,
    }
    let fd = new FormData()
    fd.append('file', attachment)
    fd.append('title', paymentAttachment.title)
    fd.append('type', 'file/' + paymentAttachment.fileName.split('.').pop())
    // ====================== API call for Attachments base on Payment ID
    axios
      .post(`/api/leads/paymentAttachment?id=${paymentId}`, fd)
      .then((res) => {
        if (res.data) {
          this.fetchLead()
          this.clearReduxAndStateValues()
        }
      })
      .catch((error) => {
        helper.errorToast('Attachment Error')
      })
  }

  submitCommissionPayment = () => {
    const { rcmPayment, dispatch, user } = this.props
    const { lead, editable } = this.state
    if (
      rcmPayment.installmentAmount != null &&
      rcmPayment.installmentAmount != '' &&
      Number(rcmPayment.installmentAmount) !== 0 &&
      rcmPayment.type != ''
    ) {
      this.setState({
        addPaymentLoading: true,
      })
      if (editable === false) {
        // for commission addition
        let body = { ...rcmPayment, rcmLeadId: lead.id, armsUserId: user.id, addedBy: 'seller' }
        delete body.visible
        axios
          .post(`/api/leads/project/payments`, body)
          .then((response) => {
            if (response.data) {
              // check if some attachment exists so upload that as well to server with payment id.
              if (response.data.message) {
                helper.errorToast(response.data.message)
                this.fetchLead()
                this.clearReduxAndStateValues()
              } else {
                if (rcmPayment.paymentAttachments.length > 0) {
                  rcmPayment.paymentAttachments.map((paymentAttachment) =>
                    // payment attachments
                    this.uploadAttachment(paymentAttachment, response.data.id)
                  )
                } else {
                  this.fetchLead()
                  this.clearReduxAndStateValues()
                  helper.successToast('Commission Payment Added')
                }
              }
            }
          })
          .catch((error) => {
            helper.errorToast('Error Adding Commission Payment', error)
            this.clearReduxAndStateValues()
          })
      } else {
        // commission update mode
        let body = { ...rcmPayment }
        delete body.visible
        axios
          .patch(`/api/leads/project/payment?id=${body.id}`, body)
          .then((response) => {
            // upload only the new attachments that do not have id with them in object.
            const filterAttachmentsWithoutId = rcmPayment.paymentAttachments
              ? _.filter(rcmPayment.paymentAttachments, (item) => {
                  return !_.has(item, 'id')
                })
              : []
            if (filterAttachmentsWithoutId.length > 0) {
              filterAttachmentsWithoutId.map((item, index) => {
                // payment attachments
                this.uploadAttachment(item, body.id)
              })
            } else {
              this.fetchLead()
              this.clearReduxAndStateValues()
              helper.successToast('Commission Payment Updated')
            }
          })
          .catch((error) => {
            helper.errorToast('Error Updating Commission Payment', error)
            this.clearReduxAndStateValues()
          })
      }
    } else {
      // Installment amount or type is missing so validation goes true, show error
      this.setState({
        modalValidation: true,
      })
    }
  }

  fetchLead = () => {
    const { dispatch, lead } = this.props
    const { rcmProgressBar } = StaticData
    this.setState({ loading: true }, () => {
      axios.get(`/api/leads/byId?id=${lead.id}`).then((response) => {
        if (response.data) {
          dispatch(setlead(response.data))
          this.setState({
            progressValue: rcmProgressBar[response.data.status],
            loading: false,
            lead: response.data,
          })
        } else {
          //console.log('something went wrong in api');
        }
      })
    })
  }

  goToPropertyComments = (data) => {
    const { lead, navigation } = this.props
    this.toggleMenu(false, data.id)
    navigation.navigate('Comments', { propertyId: data.id, screenName: 'payment' })
  }

  toggleMenu = (val, id) => {
    const { allProperties } = this.state
    let newMatches = allProperties.map((item) => {
      if (item.id === id) {
        item.checkBox = val
        return item
      } else return item
    })
    this.setState({ allProperties: newMatches })
  }

  render() {
    const {
      menuShow,
      loading,
      allProperties,
      isVisible,
      checkReasonValidation,
      selectedReason,
      reasons,
      agreedAmount,
      showAgreedAmountArrow,
      showTokenAmountArrow,
      progressValue,
      token,
      lead,
      pickerData,
      formData,
      closedLeadEdit,
      showMonthlyRentArrow,
      showStyling,
      tokenDateStatus,
      tokenPriceFromat,
      agreeAmountFromat,
      monthlyFormatStatus,
      meetings,
      callModal,
      modalValidation,
      addPaymentLoading,
    } = this.state
    const { navigation, user } = this.props

    return !loading ? (
      <KeyboardAvoidingView
        style={[
          AppStyles.container,
          {
            backgroundColor: AppStyles.colors.backgroundColor,
            paddingLeft: 0,
            paddingRight: 0,
            marginBottom: 30,
          },
        ]}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={120}
      >
        <ProgressBar
          style={{ backgroundColor: 'ffffff' }}
          progress={progressValue}
          color={'#0277FD'}
        />
        <LeadRCMPaymentPopup
          reasons={reasons}
          selectedReason={selectedReason}
          changeReason={(value) => this.handleReasonChange(value)}
          checkValidation={checkReasonValidation}
          isVisible={isVisible}
          closeModal={() => this.closeModal()}
          onPress={() => this.onHandleCloseLead()}
        />

        <AddCommissionModal
          onModalCloseClick={this.onModalCloseClick}
          handleCommissionChange={this.handleCommissionChange}
          modalValidation={modalValidation}
          goToPayAttachments={() => this.goToPayAttachments()}
          submitCommissionPayment={() => this.submitCommissionPayment()}
          addPaymentLoading={addPaymentLoading}
          lead={lead}
        />
        {/* 
                <HistoryModal
                    getCallHistory={this.getCallHistory}
                    navigation={navigation}
                    data={meetings}
                    closePopup={this.goToHistory}
                    openPopup={callModal}
                /> */}
        <View style={{ flex: 1, minHeight: '100%', paddingBottom: 100 }}>
          {allProperties.length > 0 ? (
            <FlatList
              data={_.clone(allProperties)}
              renderItem={(item, index) => (
                <View style={{ marginVertical: 3, marginHorizontal: 10 }}>
                  {this.ownProperty(item.item) ? (
                    <PropMatchTile
                      data={_.clone(item.item)}
                      user={user}
                      displayChecks={this.displayChecks}
                      showCheckBoxes={false}
                      addProperty={this.addProperty}
                      isMenuVisible={true}
                      viewingMenu={false}
                      goToPropertyComments={this.goToPropertyComments}
                      toggleMenu={this.toggleMenu}
                      menuShow={menuShow}
                      screen={'payment'}
                    />
                  ) : (
                    <PropAgentTile
                      data={_.clone(item.item)}
                      user={user}
                      displayChecks={this.displayChecks}
                      showCheckBoxes={false}
                      addProperty={this.addProperty}
                      isMenuVisible={true}
                      viewingMenu={false}
                      goToPropertyComments={this.goToPropertyComments}
                      toggleMenu={this.toggleMenu}
                      menuShow={menuShow}
                      screen={'payment'}
                    />
                  )}
                </View>
              )}
              ListFooterComponent={
                <View style={{ marginHorizontal: 10 }}>
                  {lead.shortlist_id !== null ? (
                    lead.purpose === 'sale' ? (
                      <BuyPaymentView
                        lead={lead}
                        agreedAmount={agreedAmount}
                        showAgreedAmountArrow={showAgreedAmountArrow}
                        handleAgreedAmountPress={this.handleAgreedAmountPress}
                        handleAgreedAmountChange={this.handleAgreedAmountChange}
                        token={token}
                        handleTokenAmountChange={this.handleTokenAmountChange}
                        showTokenAmountArrow={showTokenAmountArrow}
                        handleTokenAmountPress={this.handleTokenAmountPress}
                        showAndHideStyling={this.showAndHideStyling}
                        showStylingState={showStyling}
                        tokenDateStatus={tokenDateStatus}
                        tokenPriceFromat={tokenPriceFromat}
                        agreeAmountFromat={agreeAmountFromat}
                        onAddCommissionPayment={this.onAddCommissionPayment}
                        editTile={this.setCommissionEditData}
                      />
                    ) : (
                      <RentPaymentView
                        lead={lead}
                        pickerData={pickerData}
                        handleForm={this.handleForm}
                        formData={formData}
                        showMonthlyRentArrow={showMonthlyRentArrow}
                        handleMonthlyRentPress={this.handleMonthlyRentPress}
                        token={token}
                        handleTokenAmountChange={this.handleTokenAmountChange}
                        showTokenAmountArrow={showTokenAmountArrow}
                        handleTokenAmountPress={this.handleTokenAmountPress}
                        showAndHideStyling={this.showAndHideStyling}
                        showStylingState={showStyling}
                        tokenDateStatus={tokenDateStatus}
                        tokenPriceFromat={tokenPriceFromat}
                        agreeAmountFromat={agreeAmountFromat}
                        monthlyFormatStatus={monthlyFormatStatus}
                        onAddCommissionPayment={this.onAddCommissionPayment}
                        editTile={this.setCommissionEditData}
                      />
                    )
                  ) : null}
                </View>
              }
              keyExtractor={(item, index) => item && item.id && item.id.toString()}
            />
          ) : (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Text
                style={{
                  fontFamily: AppStyles.fonts.semiBoldFont,
                  fontSize: AppStyles.fontSize.medium,
                  color: AppStyles.colors.textColor,
                }}
              >
                NO PROPERTY IS SELECTED FOR PAYMENT YET
              </Text>
            </View>
          )}
          <View style={AppStyles.mainCMBottomNav}>
            <PropertyBottomNav
              goToAttachments={this.goToAttachments}
              navigateTo={this.navigateToDetails}
              goToDiaryForm={this.goToDiaryForm}
              goToComments={this.goToComments}
              alreadyClosedLead={() => this.closedLead()}
              closeLead={this.closeLead}
              closedLeadEdit={closedLeadEdit}
              callButton={true}
              customer={lead.customer}
              lead={lead}
              goToHistory={this.goToHistory}
              getCallHistory={this.getCallHistory}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    ) : (
      <Loader loading={loading} />
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
    rcmPayment: store.RCMPayment.RCMPayment,
  }
}

export default connect(mapStateToProps)(PropertyRCMPayment)
