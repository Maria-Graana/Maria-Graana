/** @format */

import axios from 'axios'
import { ActionSheet } from 'native-base'
import * as React from 'react'
import { Alert, FlatList, KeyboardAvoidingView, Linking, Platform, Text, View } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { connect } from 'react-redux'
import _ from 'underscore'
import {
  clearInstrumentInformation,
  clearInstrumentsList,
  getInstrumentDetails,
  setInstrumentInformation,
} from '../../actions/addInstrument'
import { setlead } from '../../actions/lead'
import { setRCMPayment } from '../../actions/rcmPayment'
import AppStyles from '../../AppStyles'
import AddRCMPaymentModal from '../../components/AddRCMPaymentModal'
import DeleteModal from '../../components/DeleteModal'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import Loader from '../../components/loader'
import MeetingFollowupModal from '../../components/MeetingFollowupModal'
import PropAgentTile from '../../components/PropAgentTile'
import PropertyBottomNav from '../../components/PropertyBottomNav'
import PropMatchTile from '../../components/PropMatchTile'
import config from '../../config'
import helper from '../../helper'
import StaticData from '../../StaticData'
import BuyPaymentView from './buyPaymentView'
import RentPaymentView from './rentPaymentView'
import AccountsPhoneNumbers from '../../components/AccountsPhoneNumbers'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'

var BUTTONS = ['Delete', 'Cancel']
var TOKENBUTTONS = ['Confirm', 'Cancel']
var CANCEL_INDEX = 1

class PropertyRCMPayment extends React.Component {
  constructor(props) {
    super(props)
    const { user, lead, permissions } = this.props
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
      closedLeadEdit: helper.checkAssignedSharedStatus(user, lead, permissions),
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
      deletePaymentVisible: false,
      tokenNotZero: false,
      agreedNotZero: false,
      buyerNotZero: false,
      sellerNotZero: false,
      rentNotZero: false,
      tokenMenu: false,
      editTextInput: true,
      assignToAccountsLoading: false,
      officeLocations: [],
      rentMonthlyToggle: false,
      active: false,
      isFollowUpMode: false,
      accountPhoneNumbers: [],
      accountsLoading: false,
      isMultiPhoneModalVisible: false,
    }
  }

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params && this.props.route.params.isFromNotification) {
        const { lead } = this.props.route.params
        this.fetchOfficeLocations()
        this.getSelectedProperty(lead)
      } else {
        const { lead } = this.props
        this.fetchOfficeLocations()
        this.getSelectedProperty(lead)
      }
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
      officeLocationId: null,
    }
    this.setState({
      modalValidation: false,
      addPaymentLoading: false,
      assignToAccountsLoading: false,
      editable: false,
    })
    dispatch(setRCMPayment(newData))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    this.clearReduxAndStateValues()
    dispatch(clearInstrumentInformation())
    dispatch(clearInstrumentsList())
    this._unsubscribe()
  }

  fetchOfficeLocations = () => {
    axios
      .get(`/api/user/locations`)
      .then((response) => {
        if (response.data) {
          this.setState({
            officeLocations: response.data.map((item) => {
              return {
                name: item.name,
                value: item.id,
              }
            }),
          })
        }
      })
      .catch((error) => {
        console.log(`/api/user/locations`, error)
      })
  }

  getSelectedProperty = (lead) => {
    const { dispatch } = this.props
    const { rcmProgressBar } = StaticData
    let properties = []
    this.setState({ loading: true }, () => {
      axios
        .get(`/api/leads/byId?id=${lead.id}`)
        .then((response) => {
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
      this.setState({ agreedAmount: '', agreedNotZero: false })
    } else if (agreedAmount !== '') {
      this.setState({ agreedAmount, showAgreedAmountArrow: true, agreedNotZero: false })
    }
  }

  handleTokenAmountChange = (token) => {
    if (token === '') {
      this.setState({ token: '', tokenNotZero: false })
    } else if (token !== '') {
      this.setState({ token, showTokenAmountArrow: true, tokenNotZero: false })
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
    if (Number(token) <= 0) {
      this.setState({ tokenNotZero: true })
      return
    }
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
    if (Number(agreedAmount) <= 0) {
      this.setState({ agreedNotZero: true })
      return
    }
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
      screenName: 'Diary',
    })
  }

  goToAttachments = () => {
    const { navigation } = this.props
    const { lead } = this.state
    navigation.navigate('LeadAttachments', { rcmLeadId: lead.id, workflow: 'propertyLeads' })
  }

  goToComments = () => {
    const { navigation } = this.props
    const { lead } = this.state
    navigation.navigate('Comments', { rcmLeadId: lead.id })
  }

  navigateToDetails = () => {
    this.props.navigation.navigate('LeadDetail', {
      lead: this.props.lead,
      purposeTab: 'property',
      isFromLeadWorkflow: true,
      fromScreen: 'payment',
    })
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

  onAddCommissionPayment = (type, paymentCategory) => {
    const { dispatch, rcmPayment } = this.props
    console.log('paymentCategory: ', paymentCategory)

    console.log('editTextInput: ', this.state.editTextInput)
    dispatch(setRCMPayment({ ...rcmPayment, visible: true, addedBy: type, paymentCategory }))
  }

  onModalCloseClick = () => {
    this.clearReduxAndStateValues()
  }

  handleCommissionChange = (value, name) => {
    const { rcmPayment, dispatch, lead, addInstrument } = this.props
    const newSecondFormData = { ...rcmPayment, visible: rcmPayment.visible }
    newSecondFormData[name] = value
    if (
      name === 'type' &&
      (value === 'cheque' || value === 'pay-Order' || value === 'bank-Transfer')
    ) {
      if (lead && lead.customer_id) {
        dispatch(getInstrumentDetails(value, lead.customer_id))
        dispatch(
          setInstrumentInformation({
            ...addInstrument,
            customerId: lead && lead.customer_id ? lead.customer_id : null,
            instrumentType: value,
            instrumentAmount: null,
            instrumentNo: null,
            id: null,
          })
        )
      }
    }
    this.setState({ buyerNotZero: false })
    dispatch(setRCMPayment(newSecondFormData))
  }

  handleInstrumentInfoChange = (value, name) => {
    const { addInstrument, dispatch, instruments } = this.props
    const copyInstrument = { ...addInstrument }
    if (name === 'instrumentNumber') {
      copyInstrument.instrumentNo = value
    } else if (name === 'instrumentNumberPicker') {
      const instrument = instruments.find((item) => item.id === value)
      copyInstrument.instrumentNo = instrument.instrumentNo
      copyInstrument.instrumentAmount = instrument.instrumentAmount
      copyInstrument.id = instrument.id
      copyInstrument.editable = false
    } else if (name === 'instrumentAmount') copyInstrument.instrumentAmount = value

    dispatch(setInstrumentInformation(copyInstrument))
  }

  setCommissionEditData = (data) => {
    const { dispatch, user, lead } = this.props
    if (data.paymentCategory === 'token') {
      this.setState({
        editTextInput: false,
        editable: true,
      })
    } else {
      this.setState({ editable: true })
    }
    dispatch(
      setRCMPayment({
        ...data,
        visible: true,
        officeLocationId:
          data && data.officeLocationId
            ? data.officeLocationId
            : user && user.officeLocation
            ? user.officeLocation.id
            : null,
      })
    )
    if (data && data.paymentInstrument && lead) {
      dispatch(getInstrumentDetails(data.paymentInstrument.instrumentType, lead.customer_id))
      dispatch(
        setInstrumentInformation({
          ...data.paymentInstrument,
          editable: data.paymentInstrument.id ? false : true,
        })
      )
    }
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
      rcmPayment.type != ''
    ) {
      this.setState({
        addPaymentLoading: true,
      })
      if (Number(rcmPayment.installmentAmount) <= 0) {
        this.setState({
          buyerNotZero: true,
          addPaymentLoading: false,
          assignToAccountsLoading: false,
        })
        return
      }
      if (editable === false) {
        let body = {}
        // for payment addition
        if (
          rcmPayment.type === 'cheque' ||
          rcmPayment.type === 'pay-Order' ||
          rcmPayment.type === 'bank-Transfer'
        ) {
          // for cheque,pay order and bank transfer
          let isValid = this.checkInstrumentValidation()
          if (isValid) {
            this.addEditRCMInstrumentOnServer()
          }
        } else {
          // for all other types
          body = {
            ...rcmPayment,
            rcmLeadId: lead.id,
            armsUserId: user.id,
          }
          delete body.visible
          this.addRCMPayment(body)
        }
      } else {
        let body = {}
        // commission update mode
        if (
          rcmPayment.type === 'cheque' ||
          rcmPayment.type === 'pay-Order' ||
          rcmPayment.type === 'bank-Transfer'
        ) {
          // for cheque,pay order and bank transfer
          let isValid = this.checkInstrumentValidation()
          if (isValid) {
            this.addEditRCMInstrumentOnServer(true)
          }
        } else {
          // for all other types
          body = { ...rcmPayment }
          this.updateRCMPayment(body)
        }
      }
    } else {
      // Installment amount or type is missing so validation goes true, show error
      this.setState({
        modalValidation: true,
      })
    }
  }

  addRCMPayment = (body) => {
    const { dispatch, rcmPayment } = this.props
    axios
      .post(`/api/leads/project/payments`, body)
      .then((response) => {
        if (response.data) {
          // check if some attachment exists so upload that as well to server with payment id.
          if (response.data.message) {
            helper.errorToast(response.data.message)
            this.fetchLead()
          } else {
            if (rcmPayment.paymentAttachments.length > 0) {
              rcmPayment.paymentAttachments.map((paymentAttachment) =>
                // payment attachments
                this.uploadAttachment(paymentAttachment, response.data.id)
              )
            } else {
              this.fetchLead()
              helper.successToast('Commission Payment Added')
            }
          }
        }
      })
      .catch((error) => {
        helper.errorToast('Error Adding Commission Payment', error)
        this.clearReduxAndStateValues()
      })
      .finally(() => {
        this.clearReduxAndStateValues()
        dispatch(clearInstrumentInformation())
      })
  }

  updateRCMPayment = (body) => {
    const { dispatch, rcmPayment } = this.props
    // commission update mode
    let baseUrl = `/api/leads/project/payment`
    let paymentID = body.id
    delete body.visible
    delete body.id
    body.status = rcmPayment.status
    if (body.paymentCategory === 'token') {
      baseUrl = `/api/leads/tokenPayment`
      body.status = 'pendingAccount'
    }
    axios
      .patch(`${baseUrl}?id=${paymentID}`, body)
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
            this.uploadAttachment(item, paymentID)
          })
        } else {
          this.fetchLead()
          helper.successToast('Commission Payment Updated')
        }
      })
      .catch((error) => {
        helper.errorToast('Error Updating Commission Payment', error)
      })
      .finally(() => {
        this.clearReduxAndStateValues()
        dispatch(clearInstrumentInformation())
      })
  }

  addEditRCMInstrumentOnServer = (isRCMEdit = false) => {
    let body = {}
    const { addInstrument, rcmPayment, dispatch, lead, user } = this.props
    if (addInstrument.id) {
      // selected existing instrument // add mode
      body = {
        ...rcmPayment,
        rcmLeadId: lead.id,
        armsUserId: user.id,
        addedBy: rcmPayment.addedBy,
        active: true,
        instrumentId: addInstrument.id,
      }
      if (isRCMEdit) this.updateRCMPayment(body)
      else this.addRCMPayment(body)
    } else {
      // add mode // new instrument info
      axios
        .post(`api/leads/instruments`, addInstrument)
        .then((res) => {
          if (res && res.data) {
            body = {
              ...rcmPayment,
              rcmLeadId: lead.id,
              armsUserId: user.id,
              addedBy: rcmPayment.addedBy,
              active: true,
              instrumentId: res.data.id,
            }
            if (isRCMEdit) this.updateRCMPayment(body)
            else this.addRCMPayment(body)
          }
        })
        .catch((error) => {
          console.log('Error: ', error)
        })
    }
  }

  checkInstrumentValidation = () => {
    const { addInstrument } = this.props
    if (addInstrument.instrumentNo === null || addInstrument.instrumentNo === '') {
      alert('Instrument Number cannot be empty')
      this.setState({
        addPaymentLoading: false,
        assignToAccountsLoading: false,
      })
      return false
    } else if (addInstrument.instrumentAmount === null || addInstrument.instrumentAmount === '') {
      alert('Instrument Amount cannot be empty')
      this.setState({
        addPaymentLoading: false,
        assignToAccountsLoading: false,
      })
      return false
    } else {
      return true
    }
  }

  fetchLead = () => {
    const { dispatch, lead } = this.props
    const { rcmProgressBar } = StaticData
    this.setState({ loading: true }, () => {
      axios
        .get(`/api/leads/byId?id=${lead.id}`)
        .then((response) => {
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
        .finally(() => {
          this.setState({ loading: false })
        })
    })
  }

  goToPropertyComments = (data) => {
    const { lead, navigation } = this.props
    this.toggleMenu(false, data.id)
    navigation.navigate('Comments', { propertyId: data.id, screenName: 'payment', leadId: lead.id })
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

  addProperty = (data) => {
    this.redirectProperty(data)
  }

  showLegalRequestConfirmation = () => {
    Alert.alert(
      'Legal Services Request',
      'Are you sure you want to continue?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => this.requestLegalServices(),
        },
      ],
      { cancelable: false }
    )
  }

  requestLegalServices = () => {
    const { lead } = this.props
    const { allProperties } = this.state
    const selectedProperty = allProperties[0]
    axios
      .post(
        `/api/leads/sendLegalEmail?leadId=${lead.id}&shortlistId=${
          selectedProperty ? selectedProperty.id : null
        }`
      )
      .then((response) => {
        if (response.data) {
          this.fetchLead()
          helper.successToast(response.data)
        }
      })
      .catch((error) => {
        helper.errorToast('Something went wrong while sending email')
        console.log('something went wrong in /api/leads/sendLegalEmail', error)
      })
  }

  redirectProperty = (property) => {
    if (property.origin === 'arms' || property.origin === 'arms_lead') {
      if (this.ownProperty(property))
        this.props.navigation.navigate('PropertyDetail', {
          property: property,
          update: true,
          screen: 'LeadDetail',
        })
      else helper.warningToast(`You cannot view other agent's property details!`)
    } else {
      let url = `${config.graanaUrl}/property/${property.graana_id}`
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) helper.errorToast(`No application available open this Url`)
          else return Linking.openURL(url)
        })
        .catch((err) => console.error('An error occurred', err))
    }
  }

  showHideDeletePayment = (val) => {
    this.setState({ deletePaymentVisible: val })
  }

  deletePayment = async (reason) => {
    const { rcmPayment } = this.props
    this.showHideDeletePayment(false)
    const url = `/api/leads/payment?id=${rcmPayment.id}&reason=${reason}`
    const response = await axios.delete(url)
    if (response.data) {
      this.clearReduxAndStateValues()
      helper.successToast(response.data.message)
      this.fetchLead()
    } else {
      helper.errorToast('ERROR DELETING PAYMENT!')
    }
  }

  onPaymentLongPress = (data) => {
    const { dispatch } = this.props
    dispatch(setRCMPayment({ ...data }))
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: 'Select an Option',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          //Delete
          this.showHideDeletePayment(true)
        }
      }
    )
  }

  confirmTokenAction = (payment, status) => {
    const { dispatch } = this.props
    console.log('payment: ', payment)
    // dispatch(setRCMPayment({ ...payment }))
    ActionSheet.show(
      {
        options: TOKENBUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: 'Are you sure you want to continue?',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          //Confirm
          this.submitMenu(payment, status)
        }
      }
    )
  }

  submitMenu = (payment, status) => {
    const { allProperties } = this.state
    let property = allProperties[0]
    let armsUserId = property && property.armsuser && property.armsuser.id && property.armsuser.id
    let body = { ...payment }
    let paymentID = body.id
    delete body.visible
    delete body.remarks
    delete body.id
    body.status = status
    body.status_updated_by = 'seller'
    let baseUrl = `/api/leads/tokenPayment`
    console.log('UPDATE body: ', body)
    console.log('baseURL: ', `${baseUrl}?id=${paymentID}`)
    axios
      .patch(`${baseUrl}?id=${paymentID}`, body)
      .then((response) => {
        console.log('response: ', response.data)
        // upload only the new attachments that do not have id with them in object.
        const filterAttachmentsWithoutId = payment.paymentAttachments
          ? _.filter(payment.paymentAttachments, (item) => {
              return !_.has(item, 'id')
            })
          : []
        if (filterAttachmentsWithoutId.length > 0) {
          filterAttachmentsWithoutId.map((item, index) => {
            // payment attachments
            this.uploadAttachment(item, paymentID)
          })
        } else {
          this.fetchLead()
          this.clearReduxAndStateValues()
          helper.successToast('Token Payment Updated')
        }
      })
      .catch((error) => {
        console.log('error: ', error)
        helper.errorToast('Error Updating Token Payment', error)
        this.clearReduxAndStateValues()
      })
  }

  toggleTokenMenu = () => {
    console.log('i am here')
    const { tokenMenu } = this.state
    this.setState({
      tokenMenu: !tokenMenu,
    })
  }

  assignToAccounts = () => {
    Alert.alert(
      'Assign to Accounts',
      'Are you sure you want to assign this payment to accounts?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            const { rcmPayment, dispatch } = this.props
            await dispatch(
              setRCMPayment({ ...rcmPayment, visible: false, status: 'pendingAccount' })
            )
            this.setState({ assignToAccountsLoading: true }, () => {
              this.submitCommissionPayment()
            })
          },
        },
      ],
      { cancelable: false }
    )
  }

  closeLegalDocument = (addedBy) => {
    const { allProperties } = this.state
    const selectedProperty = allProperties[0]
    this.props.navigation.navigate('LegalAttachments', {
      addedBy: addedBy,
      shorlistedProperty: selectedProperty,
    })
  }

  handleOfficeLocation = (value) => {
    const { rcmPayment, dispatch } = this.props
    dispatch(setRCMPayment({ ...rcmPayment, officeLocationId: value }))
  }

  toggleMonthlyDetails = () => {
    const { rentMonthlyToggle } = this.state
    this.setState({
      rentMonthlyToggle: !rentMonthlyToggle,
    })
  }

  closeMeetingFollowupModal = () => {
    this.setState({
      active: !this.state.active,
      isFollowUpMode: false,
    })
  }

  //  ************ Function for open Follow up modal ************
  openModalInFollowupMode = (value) => {
    const { navigation, lead } = this.props
    navigation.navigate('ScheduledTasks', {
      taskType: 'follow_up',
      lead,
      rcmLeadId: lead ? lead.id : null,
    })
    // this.setState({
    //   active: !this.state.active,
    //   isFollowUpMode: true,
    //   comment: value,
    // })
  }

  fetchPhoneNumbers = (data) => {
    this.setState({
      accountsLoading: true,
      isMultiPhoneModalVisible: true,
    })
    if (data) {
      axios
        .get(`/api/user/accountsTeamContactDetails?officeLocationId=${data.officeLocationId}`)
        .then((res) => {
          this.setState({
            accountPhoneNumbers: res.data,
            accountsLoading: false,
          })
        })
        .catch((error) => {
          console.log(
            `/api/user/accountsTeamContactDetails?officeLocationId=${data.officeLocationId}`,
            error
          )
          this.setState({
            accountsLoading: false,
            isMultiPhoneModalVisible: false,
          })
        })
    }
  }

  toggleAccountPhone = () => {
    const { isMultiPhoneModalVisible } = this.state
    this.setState({
      isMultiPhoneModalVisible: !isMultiPhoneModalVisible,
    })
  }

  updatePermission = () => {
    const { permissions } = this.props
    return getPermissionValue(
      PermissionFeatures.BUY_RENT_LEADS,
      PermissionActions.UPDATE,
      permissions
    )
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
      modalValidation,
      addPaymentLoading,
      deletePaymentVisible,
      tokenNotZero,
      agreedNotZero,
      buyerNotZero,
      rentNotZero,
      tokenMenu,
      editTextInput,
      assignToAccountsLoading,
      officeLocations,
      rentMonthlyToggle,
      active,
      isFollowUpMode,
      accountPhoneNumbers,
      accountsLoading,
      isMultiPhoneModalVisible,
    } = this.state
    const { user, contacts } = this.props
    let updatePermission = this.updatePermission()

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
        <AccountsPhoneNumbers
          toggleAccountPhone={this.toggleAccountPhone}
          isMultiPhoneModalVisible={isMultiPhoneModalVisible}
          contacts={accountPhoneNumbers}
          loading={accountsLoading}
          phoneContacts={contacts}
        />
        <AddRCMPaymentModal
          onModalCloseClick={this.onModalCloseClick}
          handleCommissionChange={this.handleCommissionChange}
          modalValidation={modalValidation}
          submitCommissionPayment={() => {
            this.setState({ addPaymentLoading: true }, () => {
              this.submitCommissionPayment()
            })
          }}
          addPaymentLoading={addPaymentLoading}
          assignToAccountsLoading={assignToAccountsLoading}
          goToPayAttachments={() => this.goToPayAttachments()}
          lead={lead}
          paymentNotZero={buyerNotZero}
          editTextInput={editTextInput}
          officeLocations={officeLocations}
          handleOfficeLocationChange={this.handleOfficeLocation}
          handleInstrumentInfoChange={this.handleInstrumentInfoChange}
          assignToAccounts={() => this.assignToAccounts()}
        />
        <DeleteModal
          isVisible={deletePaymentVisible}
          deletePayment={(reason) => this.deletePayment(reason)}
          showHideModal={(val) => this.showHideDeletePayment(val)}
        />
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
                    lead.purpose === 'sale' || lead.purpose === 'buy' ? (
                      <BuyPaymentView
                        user={user}
                        currentProperty={allProperties}
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
                        onPaymentLongPress={this.onPaymentLongPress}
                        tokenNotZero={tokenNotZero}
                        agreedNotZero={agreedNotZero}
                        rentNotZero={rentNotZero}
                        requestLegalServices={this.showLegalRequestConfirmation}
                        toggleTokenMenu={this.toggleTokenMenu}
                        tokenMenu={tokenMenu}
                        confirmTokenAction={this.confirmTokenAction}
                        closeLegalDocument={this.closeLegalDocument}
                        call={this.fetchPhoneNumbers}
                        updatePermission={updatePermission}
                        closedLeadEdit={closedLeadEdit}
                      />
                    ) : (
                      <RentPaymentView
                        user={user}
                        currentProperty={allProperties}
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
                        onPaymentLongPress={this.onPaymentLongPress}
                        tokenNotZero={tokenNotZero}
                        agreedNotZero={agreedNotZero}
                        rentNotZero={rentNotZero}
                        requestLegalServices={this.showLegalRequestConfirmation}
                        toggleTokenMenu={this.toggleTokenMenu}
                        tokenMenu={tokenMenu}
                        confirmTokenAction={this.confirmTokenAction}
                        closeLegalDocument={this.closeLegalDocument}
                        toggleMonthlyDetails={this.toggleMonthlyDetails}
                        rentMonthlyToggle={rentMonthlyToggle}
                        call={this.fetchPhoneNumbers}
                        updatePermission={updatePermission}
                        closedLeadEdit={closedLeadEdit}
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

          <MeetingFollowupModal
            closeModal={() => this.closeMeetingFollowupModal()}
            active={active}
            isFollowUpMode={isFollowUpMode}
            lead={lead}
            leadType={'RCM'}
          />
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
              goToHistory={() => null}
              getCallHistory={() => null}
              goToFollowUp={(value) => this.openModalInFollowupMode(value)}
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
    addInstrument: store.Instruments.addInstrument,
    instruments: store.Instruments.instruments,
    contacts: store.contacts.contacts,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(PropertyRCMPayment)
