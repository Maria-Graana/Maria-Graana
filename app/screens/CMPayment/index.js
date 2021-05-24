/** @format */

import axios from 'axios'
import { ActionSheet } from 'native-base'
import React, { Component } from 'react'
import { Alert, KeyboardAvoidingView, ScrollView, View } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { connect } from 'react-redux'
import _ from 'underscore'
import { setCMPayment } from '../../actions/addCMPayment'
import {
  clearInstrumentInformation,
  clearInstrumentsList,
  getInstrumentDetails,
  setInstrumentInformation,
} from '../../actions/addInstrument'
import { setlead } from '../../actions/lead'
import AppStyles from '../../AppStyles'
import BookingDetailsModal from '../../components/BookingDetailsModal'
import CMBottomNav from '../../components/CMBottomNav'
import CMFirstForm from '../../components/CMFirstForm'
import CMPaymentModal from '../../components/CMPaymentModal'
import CMSecondForm from '../../components/CMSecondForm'
import DeleteModal from '../../components/DeleteModal'
import FirstScreenConfirmModal from '../../components/FirstScreenConfirmModal'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import MeetingFollowupModal from '../../components/MeetingFollowupModal'
import StatusFeedbackModal from '../../components/StatusFeedbackModal'
import UnitDetailsModal from '../../components/UnitDetailsModal'
import ProductDetailsModal from '../../components/ProductDetailsModal'
import helper from '../../helper'
import PaymentMethods from '../../PaymentMethods'
import StaticData from '../../StaticData'
import PaymentHelper from './PaymentHelper'

var BUTTONS = ['Delete', 'Cancel']
var CANCEL_INDEX = 1
class CMPayment extends Component {
  constructor(props) {
    super(props)
    const { lead, user } = this.props
    this.state = {
      checkLeadClosedOrNot: false,
      editable: false,
      buyerNotZero: false,
      addPaymentLoading: false,
      modalValidation: false,
      bookingModal: false,
      unitDetailModal: false,
      deletePaymentVisible: false,
      allProjects: [],
      pickerProjects: [],
      allFloors: [],
      pickerFloors: [],
      allUnits: [],
      pickerUnits: [],
      firstFormData: {
        project:
          lead.paidProject != null ? lead.paidProject.id : lead.project ? lead.project.id : '',
        floor: '',
        unitType: '',
        pearl: '',
        unit: lead.unit != null ? lead.unit.id : '',
        unitPrice: 0,
        cnic: lead.customer && lead.customer.cnic != null ? lead.customer.cnic : null,
        paymentPlan: 'no',
        approvedDiscount: 0,
        approvedDiscountPrice: 0,
        finalPrice: 0,
        fullPaymentDiscountPrice: 0,
        pearlName: 'New Pearl',
        productId: null,
        installmentFrequency: null,
        paymentPlanDuration: null,
      },
      unitPearlDetailsData: {},
      oneUnitData: {},
      unitDetailModal: false,
      pearlUnit: false,
      checkPaymentPlan: {
        years:
          (lead.paidProject != null && lead.paidProject.installment_plan != null) || ''
            ? lead.paidProject.installment_plan
            : null,
        monthly:
          lead.paidProject != null && lead.paidProject.monthly_installment_availablity === 'yes'
            ? true
            : false,
        rental:
          lead.paidProject != null && lead.paidProject.rent_available === 'yes' ? true : false,
        investment: true,
        quartarly: true,
      },
      cnicEditable: lead.customer && lead.customer.cnic != null ? false : true,
      firstFormModal: false,
      firstFormConfirmLoading: false,
      finalPrice: 0,
      cnicValidate: false,
      firstFormValidate: false,
      pearlUnitPrice: 0,
      leftPearlSqft: 0,
      checkFirstFormPayment: false,
      checkLeadClosedOrNot: helper.checkAssignedSharedStatus(user, lead),
      openFirstScreenModal: false,
      firstScreenConfirmLoading: false,
      firstForm: lead.unit === null || lead.unit.id === null ? true : false,
      secondForm: lead.unit != null && lead.unit.id != null ? true : false,
      reasons: [],
      lead: false,
      selectedReason: '',
      leadCloseToggle: false,
      progressValue: 0,
      checkFirstFormToken: false,
      officeLocations: [],
      assignToAccountsLoading: false,
      active: false,
      closedWon: false,
      statusfeedbackModalVisible: false,
      modalMode: 'call',
      currentCall: null,
      isFeedbackMeetingModalVisible: false,
      isFollowUpMode: false,
      projectProducts: [],
      productsPickerData: [],
      productDetailModal: false,
      oneProductData: {},
      showInstallmentFields: false,
      paymentPlanDuration: [],
      installmentFrequency: [],
    }
  }

  componentDidMount = () => {
    const { firstForm, secondForm } = this.state
    const { lead } = this.props
    const { paidProject, project } = lead
    if (firstForm) {
      let projectID = paidProject && paidProject.id ? paidProject.id : project && project.id
      if ((paidProject && paidProject.id) || (project && project.id)) {
        this.getFloors(projectID)
      }
    }
    if (secondForm) {
      this.setState({
        pearlUnit:
          lead && lead.unit && lead.unit.type && lead.unit.type === 'regular' ? false : true,
      })
    }
    this.fetchProducts()
    this.fetchOfficeLocations()
    this.fetchLead()
    this.getAllProjects()
    this.setdefaultFields(this.props.lead)
    this.validateCnic(lead.customer && lead.customer.cnic != null ? lead.customer.cnic : null)
  }

  componentWillUnmount = () => {
    const { dispatch } = this.props
    this.clearReduxAndStateValues()
    dispatch(clearInstrumentInformation())
    dispatch(clearInstrumentsList())
  }

  fetchProducts = () => {
    const { lead } = this.props
    const { paidProject, project } = lead
    let projectID = paidProject && paidProject.id ? paidProject.id : project && project.id
    axios
      .get(`/api/project/products?projectId=${projectID}`)
      .then((res) => {
        this.setState({
          projectProducts: res.data,
          productsPickerData: PaymentHelper.normalizeProjectProducts(res.data),
        })
      })
      .catch((error) => {
        console.log(`/api/user/locations`, error)
      })
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

  // **************** Fetch API's Calls Start *******************
  fetchLead = async (functionCallingFor) => {
    const { lead } = this.props
    const { payment, unit } = lead
    const { cmProgressBar } = StaticData
    const { secondForm, firstForm } = this.state
    axios
      .get(`/api/leads/project/byId?id=${lead.id}`)
      .then((res) => {
        let responseData = res.data
        if (!responseData.paidProject) responseData.paidProject = responseData.project
        this.props.dispatch(setlead(responseData))
        this.fetchProducts()
        this.setdefaultFields(responseData)
        if (secondForm) {
          this.calculatePayments(responseData, functionCallingFor)
        }
        this.checkLeadClosureReasons(res.data)
      })
      .catch((error) => {
        console.log('/api/leads/project/byId?id - Error', error)
      })
  }

  calculatePayments = (lead, functionCallingFor) => {
    const { payment, unit, paidProject } = lead
    let fullPaymentDiscount = PaymentHelper.findPaymentPlanDiscount(lead, unit)
    let finalPrice = PaymentMethods.findFinalPrice(
      unit,
      unit.discounted_price,
      fullPaymentDiscount,
      unit.type === 'regular' ? false : true
    )
    let { remainingPayment, remainingTax } = PaymentMethods.findRemaningPayment(payment, finalPrice)
    let outStandingTax = PaymentMethods.findRemainingTax(payment, remainingTax)
    this.setState({
      remainingPayment: remainingPayment,
      outStandingTax: outStandingTax,
      finalPrice: finalPrice,
    })
  }

  checkLeadClosureReasons = (lead) => {
    const { payment, unit } = lead
    if (!unit) {
      return
    }
    let fullPaymentDiscount = PaymentHelper.findPaymentPlanDiscount(lead, unit)
    let finalPrice = PaymentMethods.findFinalPrice(
      unit,
      unit.discounted_price,
      fullPaymentDiscount,
      unit.type === 'regular' ? false : true
    )
    let { remainingPayment, remainingTax } = PaymentMethods.findRemaningPayment(payment, finalPrice)
    let outStandingTax = PaymentMethods.findRemainingTaxWithClearedStatus(payment, remainingTax)
    if (outStandingTax <= 0 && remainingPayment <= 0) {
      this.setState({
        closedWon: true,
      })
    }
  }

  getAllProjects = () => {
    axios
      .get(`/api/project/all`)
      .then((res) => {
        let projectArray = []
        res &&
          res.data.items.map((item, index) => {
            return projectArray.push({ value: item.id, name: item.name })
          })
        this.setState({
          pickerProjects: projectArray,
          allProjects: res.data.items,
        })
      })
      .catch((error) => {
        console.log('/api/project/all - Error', error)
      })
  }

  getFloors = (id) => {
    axios
      .get(`/api/project/floors?projectId=${id}`)
      .then((res) => {
        let Array = []
        res &&
          res.data.rows.map((item, index) => {
            return Array.push({ value: item.id, name: item.name })
          })
        this.setState({
          pickerFloors: Array,
          allFloors: res.data.rows,
        })
      })
      .catch((error) => {
        console.log('/api/project/floors?projectId - Error', error)
      })
  }

  getUnits = (projectId, floorId) => {
    const { lead } = this.props
    axios
      .get(
        `/api/project/shops?projectId=${projectId}&floorId=${floorId}&status=Available&type=regular`
      )
      .then((res) => {
        let array = []
        res &&
          res.data.rows.map((item, index) => {
            return array.push({ value: item.id, name: item.name })
          })
        this.setState({
          pickerUnits: array,
          allUnits: res.data.rows,
        })
      })
      .catch((error) => {
        console.log('/api/project/shops?projectId & floorId & status & type - Error', error)
      })
  }

  // **************** Check Lead Close *******************
  closedLead = () => {
    const { lead, user } = this.props
    this.state.checkLeadClosedOrNot === true && helper.leadClosedToast()
    lead.assigned_to_armsuser_id != user.id && helper.leadNotAssignedToast()
  }

  // **************** Bottom Nav Functions Start *******************
  goToAttachments = () => {
    const { navigation, route, lead } = this.props
    navigation.navigate('LeadAttachments', { cmLeadId: lead.id, workflow: 'cm' })
  }

  goToPayAttachments = () => {
    const { navigation } = this.props
    this.setState({
      addPaymentModalToggleState: false,
      paymentRemarkVisible: false,
    })
    navigation.navigate('AttachmentsForPayments')
  }

  goToDiaryForm = (taskType) => {
    const { navigation, route, user } = this.props
    navigation.navigate('AddDiary', {
      update: false,
      agentId: user.id,
      cmLeadId: this.props.lead.id,
      addedBy: 'self',
      tasksList: StaticData.taskValuesCMLead,
      taskType: taskType != '' ? taskType : null,
      screenName: 'Diary',
    })
  }

  navigateTo = () => {
    this.props.navigation.navigate('LeadDetail', {
      lead: this.props.lead,
      purposeTab: 'invest',
      isFromLeadWorkflow: true,
      fromScreen: 'payments',
    })
  }

  goToComments = () => {
    const { navigation, route } = this.props
    navigation.navigate('Comments', { cmLeadId: this.props.lead.id })
  }
  // **************** Bottom Nav Functions End *******************

  // **************** Add Payment Modal Functions Start *******************
  addPaymentModalToggle = (visible, paymentType) => {
    const { CMPayment, dispatch } = this.props
    const { secondForm } = this.state
    dispatch(setCMPayment({ ...CMPayment, visible: visible, paymentType: paymentType }))
    this.setState({
      checkFirstFormToken: secondForm ? false : true,
    })
  }

  showHideDeletePayment = (val) => {
    this.setState({ deletePaymentVisible: val, documentModalVisible: false })
  }

  deletePayment = async (reason) => {
    const { CMPayment, lead } = this.props
    const { selectedPayment, outStandingTax } = this.state
    this.showHideDeletePayment(false)
    const { installmentAmount } = selectedPayment
    let url = `/api/leads/payment?id=${selectedPayment.id}&reason=${reason}`
    const response = await axios.delete(url)
    if (response.data) {
      this.clearReduxAndStateValues()
      this.fetchLead()
      helper.successToast(response.data.message)
    } else {
      helper.errorToast('ERROR DELETING PAYMENT!')
    }
  }

  onPaymentLongPress = (data) => {
    const { dispatch } = this.props
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: 'Select an Option',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          //Delete
          this.setState({
            selectedPayment: data,
          })
          this.showHideDeletePayment(true)
        }
      }
    )
  }

  goToPayAttachments = () => {
    const { CMPayment, dispatch, navigation } = this.props
    dispatch(
      setCMPayment({
        ...CMPayment,
        visible: false,
      })
    )
    navigation.navigate('Attachments')
  }

  handleCommissionChange = (value, name) => {
    const { CMPayment, dispatch, lead, addInstrument } = this.props
    const newSecondFormData = {
      ...CMPayment,
      visible: CMPayment.visible,
    }
    newSecondFormData[name] = value
    if (
      name === 'type' &&
      (value === 'cheque' || value === 'pay-Order' || value === 'bank-Transfer')
    ) {
      if (lead && lead.customerId) {
        dispatch(getInstrumentDetails(value, lead.customerId))
        dispatch(
          setInstrumentInformation({
            ...addInstrument,
            customerId: lead && lead.customerId ? lead.customerId : null,
            instrumentType: value,
            instrumentAmount: null,
            instrumentNo: null,
            id: null,
          })
        )
      }
    }

    this.setState({ buyerNotZero: false })
    dispatch(setCMPayment(newSecondFormData))
  }

  handleInstrumentInfoChange = (value, name) => {
    const { addInstrument, dispatch, instruments } = this.props
    const copyInstrument = { ...addInstrument }
    if (name === 'instrumentNumber') {
      copyInstrument.instrumentNo = value
      const instrument = instruments.find((item) => item.instrumentNo === value)
      if (instrument) {
        copyInstrument.instrumentAmount = instrument.instrumentAmount
        copyInstrument.id = instrument.id
        copyInstrument.editable = false
      }
    } else if (name === 'instrumentAmount') copyInstrument.instrumentAmount = value

    dispatch(setInstrumentInformation(copyInstrument))
  }

  clearReduxAndStateValues = () => {
    const { dispatch } = this.props
    const newData = {
      installmentAmount: null,
      type: '',
      cmLeadId: null,
      details: '',
      visible: false,
      fileName: '',
      paymentAttachments: [],
      uri: '',
      size: null,
      title: '',
      taxIncluded: false,
      paymentType: '',
      paymentCategory: '',
      whichModalVisible: '',
      firstForm: false,
      secondForm: false,
      officeLocationId: null,
    }
    dispatch(setCMPayment({ ...newData }))
    this.setState({
      modalValidation: false,
      addPaymentLoading: false,
      editable: false,
      totalReportPrice: 0,
      checkFirstFormToken: false,
      assignToAccountsLoading: false,
    })
  }

  onModalCloseClick = () => {
    const { firstForm } = this.state
    const { CMPayment, dispatch } = this.props
    if (firstForm) {
      if (
        (CMPayment && CMPayment.installmentAmount === '') ||
        (CMPayment && !CMPayment.installmentAmount)
      ) {
        this.clearReduxAndStateValues()
        this.setState({
          checkFirstFormPayment: false,
        })
      } else {
        dispatch(
          setCMPayment({
            ...CMPayment,
            visible: false,
          })
        )
      }
    } else {
      this.clearReduxAndStateValues()
      dispatch(clearInstrumentInformation())
    }
  }

  editTile = (payment) => {
    const { dispatch, user, lead } = this.props
    dispatch(
      setCMPayment({
        ...payment,
        visible: true,
        officeLocationId:
          payment && payment.officeLocationId
            ? payment.officeLocationId
            : user && user.officeLocation
            ? user.officeLocation.id
            : null,
      })
    )
    if (payment && payment.paymentInstrument && lead) {
      dispatch(getInstrumentDetails(payment.paymentInstrument.instrumentType, lead.customerId))
      dispatch(
        setInstrumentInformation({
          ...payment.paymentInstrument,
          editable: payment.paymentInstrument.id ? false : true,
        })
      )
    }

    this.setState({
      editable: true,
    })
  }

  submitCommissionCMPayment = async () => {
    const { CMPayment, user, lead } = this.props
    const { editable, firstForm } = this.state
    if (
      (firstForm && CMPayment.paymentCategory === null) ||
      (firstForm && CMPayment.paymentCategory === '')
    ) {
      this.setState({
        modalValidation: true,
      })
      return
    }
    if (
      CMPayment.installmentAmount != null &&
      CMPayment.installmentAmount != '' &&
      CMPayment.type != ''
    ) {
      this.setState({
        addPaymentLoading: true,
      })
      if (Number(CMPayment.installmentAmount) <= 0) {
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
          CMPayment.type === 'cheque' ||
          CMPayment.type === 'pay-Order' ||
          CMPayment.type === 'bank-Transfer'
        ) {
          // for cheque,pay order and bank transfer
          let isValid = this.checkInstrumentValidation()
          if (isValid) {
            this.addEditCMInstrumentOnServer()
          }
        } else {
          // for all other types
          body = {
            ...CMPayment,
            cmLeadId: lead.id,
            armsUserId: user.id,
            addedBy: 'buyer',
            installmentAmount: CMPayment.installmentAmount,
          }
          this.addCMPayment(body)
        }
        delete body.visible
      } else {
        // for payment updation
        if (
          CMPayment.type === 'cheque' ||
          CMPayment.type === 'pay-Order' ||
          CMPayment.type === 'bank-Transfer'
        ) {
          // for cheque,pay order and bank transfer
          let isValid = this.checkInstrumentValidation()
          if (isValid) {
            this.addEditCMInstrumentOnServer(true)
          }
        } else {
          // for all other types
          body = {
            ...CMPayment,
            cmLeadId: lead.id,
            armsUserId: user.id,
            installmentAmount: CMPayment.installmentAmount,
          }
          this.updateCMPayment(body)
        }
      }
    } else {
      // Installment amount or type is missing so validation goes true, show error
      this.setState({
        modalValidation: true,
      })
    }
  }

  addCMPayment = (body) => {
    const { CMPayment, user, lead, dispatch } = this.props
    if (CMPayment.paymentType === 'token') {
      dispatch(setCMPayment({ ...CMPayment, visible: false }))
      this.setState({ addPaymentLoading: false, checkFirstFormPayment: true })
      return
    }
    body.paymentCategory = CMPayment.paymentType
    axios
      .post(`/api/leads/project/payments`, body)
      .then((response) => {
        if (response.data) {
          // check if some attachment exists so upload that as well to server with payment id.
          if (CMPayment.paymentAttachments.length > 0) {
            CMPayment.paymentAttachments.map((paymentAttachment) => {
              // payment attachments
              this.uploadPaymentAttachment(paymentAttachment, response.data.id)
            })
          } else {
            this.clearReduxAndStateValues()
            dispatch(clearInstrumentInformation())
            this.fetchLead(lead)
            helper.successToast('Payment Added')
          }
        }
      })
      .catch((error) => {
        this.clearReduxAndStateValues()
        dispatch(clearInstrumentInformation())
        console.log('Error: ', error)
        helper.errorToast('Error Adding Payment')
      })
  }

  updateCMPayment = (body) => {
    const { CMPayment, lead, dispatch } = this.props
    if (CMPayment.paymentType === 'token') {
      dispatch(setCMPayment({ ...CMPayment, visible: false }))
      this.setState({ addPaymentLoading: false, checkFirstFormPayment: true })
      return
    }
    axios
      .patch(`/api/leads/project/payment?id=${body.id}`, body)
      .then((res) => {
        // upload only the new attachments that do not have id with them in object.
        const filterAttachmentsWithoutId = CMPayment.paymentAttachments
          ? _.filter(CMPayment.paymentAttachments, (item) => {
              return !_.has(item, 'id')
            })
          : []
        if (filterAttachmentsWithoutId.length > 0) {
          filterAttachmentsWithoutId.map((item, index) => {
            // payment attachments
            this.uploadPaymentAttachment(item, body.id)
          })
        } else {
          this.fetchLead(lead)
          this.clearReduxAndStateValues()
          dispatch(clearInstrumentInformation())
          helper.successToast('Payment Updated')
        }
      })
      .catch((error) => {
        helper.errorToast('Error Updating Payment', error)
        console.log('error: ', error)
        this.clearReduxAndStateValues()
        dispatch(clearInstrumentInformation())
      })
  }

  addEditCMInstrumentOnServer = (isCMEdit = false) => {
    let body = {}
    const { addInstrument, CMPayment, lead, user } = this.props
    if (addInstrument.id) {
      // selected existing instrument // add mode
      body = {
        ...CMPayment,
        cmLeadId: lead.id,
        armsUserId: user.id,
        installmentAmount: CMPayment.installmentAmount,
        instrumentId: addInstrument.id,
      }
      if (isCMEdit) this.updateCMPayment(body)
      else this.addCMPayment(body)
    } else {
      // add mode // new instrument info
      axios
        .post(`api/leads/instruments`, addInstrument)
        .then((res) => {
          if (res && res.data) {
            body = {
              ...CMPayment,
              cmLeadId: lead.id,
              armsUserId: user.id,
              addedBy: 'buyer',
              installmentAmount: CMPayment.installmentAmount,
              instrumentId: res.data.id,
            }
            if (isCMEdit) this.updatePayment(body)
            else this.addPayment(body)
          }
          if (isCMEdit) this.updateCMPayment(body)
          else this.addCMPayment(body)
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

  uploadPaymentAttachment = (paymentAttachment, paymentId) => {
    const { lead } = this.props
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
        helper.errorToast('Attachment Error: ', error)
      })
  }

  editTokenPayment = () => {
    const { CMPayment, dispatch, addInstrument } = this.props
    dispatch(setCMPayment({ ...CMPayment, visible: true }))
    dispatch(
      setInstrumentInformation({
        ...addInstrument,
        editable: addInstrument && addInstrument.id ? false : true,
      })
    )
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
            const { CMPayment, dispatch } = this.props
            await dispatch(setCMPayment({ ...CMPayment, visible: false, status: 'pendingAccount' }))
            this.setState({ assignToAccountsLoading: true }, () => {
              this.submitCommissionCMPayment()
            })
          },
        },
      ],
      { cancelable: false }
    )
  }

  // **************** Add Payment Modal Functions End *******************

  // **************** First Screen Starts *******************

  setdefaultFields = (lead) => {
    const { checkPaymentPlan, firstForm } = this.state
    const { cmProgressBar } = StaticData
    const { paidProject, project } = lead
    if (firstForm) {
      let projectID = paidProject && paidProject.id ? paidProject.id : project && project.id
      if ((paidProject && paidProject.id) || (project && project.id)) {
        this.getFloors(projectID)
      }
    }
    var newcheckPaymentPlan = { ...checkPaymentPlan }
    newcheckPaymentPlan['years'] =
      (lead.paidProject != null && lead.paidProject.installment_plan != null) || ''
        ? lead.paidProject.installment_plan
        : null
    newcheckPaymentPlan['monthly'] =
      lead.paidProject != null && lead.paidProject.monthly_installment_availablity === 'yes'
        ? true
        : false
    ;(newcheckPaymentPlan['rental'] =
      lead.paidProject != null && lead.paidProject.rent_available === 'yes' ? true : false),
      this.setState(
        {
          checkPaymentPlan: newcheckPaymentPlan,
          firstFormData: {
            project:
              lead.paidProject != null ? lead.paidProject.id : lead.project ? lead.project.id : '',
            floor: '',
            unitType: '',
            pearl: '',
            unit: lead.unit != null ? lead.unit.id : '',
            unitPrice: 0,
            cnic: lead.customer && lead.customer.cnic != null ? lead.customer.cnic : null,
            paymentPlan: 'no',
            approvedDiscount: 0,
            approvedDiscountPrice: 0,
            finalPrice: 0,
            fullPaymentDiscountPrice: 0,
            pearlName: 'New Pearl',
          },
        },
        () => {
          const { checkPaymentPlan } = this.state
          let paymentArray = PaymentHelper.setPaymentPlanArray(lead, checkPaymentPlan)
          this.setState({
            progressValue: cmProgressBar[lead.status] || 0,
            paymentPlan: paymentArray,
            editable: false,
          })
        }
      )
  }

  handleFirstForm = (value, name) => {
    const {
      firstFormData,
      allFloors,
      unitPearlDetailsData,
      allUnits,
      oneUnitData,
      pearlUnit,
      allProjects,
      finalPrice,
      pearlUnitPrice,
      oneProductData,
      projectProducts,
      showInstallmentFields,
      paymentPlanDuration,
      installmentFrequency,
    } = this.state
    const { lead } = this.props
    const { noProduct } = lead
    let newData = firstFormData
    let oneFloor = unitPearlDetailsData
    let oneUnit = oneUnitData
    let copyPearlUnit = pearlUnit
    let copyFinalPrice = finalPrice
    let copyPearlUnitPrice = pearlUnitPrice
    let oneProduct = oneProductData
    let newShowInstallmentFields = showInstallmentFields
    let newPaymentPlanDuration = paymentPlanDuration
    let newInstallmentFrequency = installmentFrequency
    if (name === 'project') {
      // if (lead.projectId !== value) {
      this.changeProject(value)
      // }
      this.getFloors(value)
      newData = PaymentHelper.refreshFirstFormData(newData, name, lead)
      copyPearlUnit = false
      oneUnit = {}
      oneFloor = {}
      copyPearlUnitPrice = 0
    }
    if (name === 'floor') {
      oneFloor = PaymentHelper.findFloor(allFloors, value)
      newData = PaymentHelper.refreshFirstFormData(newData, name, lead)
      copyPearlUnit = false
      copyPearlUnitPrice = 0
    }
    if (name === 'unitType' && value === 'fullUnit') {
      this.getUnits(newData.project, newData.floor)
      copyPearlUnit = false
      copyPearlUnitPrice = 0
    }
    if (name === 'unitType' && value === 'pearl') {
      copyPearlUnit = true
      newData = PaymentHelper.refreshFirstFormData(newData, name, lead)
    }
    if (name === 'unit') {
      oneUnit = this.fetchOneUnit(value)
      if (noProduct) {
        newData['approvedDiscount'] = PaymentHelper.handleEmptyValue(oneUnit.discount)
        newData['approvedDiscountPrice'] = PaymentMethods.findDiscountAmount(oneUnit)
      }
      newData['pearl'] = null
    }
    if (name === 'approvedDiscount') {
      if (copyPearlUnit) oneUnit = PaymentHelper.createPearlObject(oneFloor, newData['pearl'])
      if (Number(value) > 100) return
      newData['approvedDiscountPrice'] = PaymentMethods.findApprovedDiscountAmount(oneUnit, value)
    }
    if (name === 'approvedDiscountPrice') {
      if (copyPearlUnit) oneUnit = PaymentHelper.createPearlObject(oneFloor, newData['pearl'])
      value = value.replace(/,/g, '')
      newData['approvedDiscount'] = PaymentMethods.findApprovedDiscountPercentage(oneUnit, value)
    }
    if (name === 'paymentPlan' && value === 'Sold on Investment Plan') {
      if (copyPearlUnit) oneUnit = PaymentHelper.createPearlObject(oneFloor, newData['pearl'])
      let fullPaymentDiscountPrice = PaymentHelper.findPaymentPlanDiscount(lead, oneUnit)
      newData['fullPaymentDiscountPrice'] = fullPaymentDiscountPrice
    }
    if (name === 'paymentPlan' && value !== 'Sold on Investment Plan') {
      newData['fullPaymentDiscountPrice'] = 0
    }
    if (name === 'cnic') {
      value = helper.normalizeCnic(value)
      this.validateCnic(value)
    }
    if (name === 'pearl') this.pearlCalculations(oneFloor, value)
    newData[name] = value
    if (name === 'productId') {
      oneProduct = _.find(projectProducts, (item) => {
        return item.projectProductId === value
      })
      newData['approvedDiscount'] = PaymentHelper.handleEmptyValue(
        oneProduct.projectProduct.discount
      )
      newData['approvedDiscountPrice'] = PaymentMethods.findProductDiscountAmount(
        oneUnit,
        oneProduct
      )
      newShowInstallmentFields = PaymentHelper.setProductPaymentPlan(oneProduct)
      newPaymentPlanDuration = PaymentHelper.setPaymentPlanDuration(oneProduct)
      newInstallmentFrequency = PaymentHelper.setInstallmentFrequency(oneProduct)
      if (newPaymentPlanDuration && newPaymentPlanDuration.length === 1)
        newData.paymentPlanDuration = newPaymentPlanDuration[0].value
      if (newInstallmentFrequency && newInstallmentFrequency.length === 1)
        newData.installmentFrequency = newInstallmentFrequency[0].value
      newData.paymentPlan = oneProduct.projectProduct.paymentPlan
    }
    if (oneUnit) {
      if (copyPearlUnit) oneUnit = PaymentHelper.createPearlObject(oneFloor, newData['pearl'])
      newData['finalPrice'] = PaymentMethods.findFinalPrice(
        oneUnit,
        newData['approvedDiscountPrice'],
        newData['fullPaymentDiscountPrice'],
        copyPearlUnit ? true : false
      )
    }
    this.setState({
      firstFormData: { ...newData },
      unitPearlDetailsData: { ...oneFloor },
      oneUnitData: copyPearlUnit ? { ...oneFloor } : { ...oneUnit },
      pearlUnit: copyPearlUnit,
      oneProductData: oneProduct,
      showInstallmentFields: newShowInstallmentFields,
      installmentFrequency: newInstallmentFrequency,
      paymentPlanDuration: newPaymentPlanDuration,
    })
  }

  pearlCalculations = (oneFloor, value) => {
    let totalSqft = oneFloor.pearlArea
    let minusSqft = value
    let copyLeftSqft = totalSqft - minusSqft
    let totalPrice = value * oneFloor.pricePerSqFt
    this.setState({
      pearlUnitPrice: totalPrice,
      unitPearlDetailsData: oneFloor,
      leftPearlSqft: copyLeftSqft,
    })
  }

  changeProject = (id) => {
    const { lead } = this.props
    var body = {
      paymentProject: id,
    }
    var leadId = []
    leadId.push(lead.id)
    axios.patch(`/api/leads/project`, body, { params: { id: leadId } }).then((res) => {
      this.fetchLead()
    })
  }

  openUnitDetailsModal = () => {
    const { unitDetailModal } = this.state
    this.setState({
      unitDetailModal: !unitDetailModal,
    })
  }
  openProductDetailsModal = () => {
    const { productDetailModal } = this.state
    this.setState({
      productDetailModal: !productDetailModal,
    })
  }

  fetchOneUnit = (unit) => {
    const { allUnits } = this.state
    let oneUnit = {}
    if (allUnits && allUnits.length) {
      oneUnit = allUnits.find((item) => {
        return item.id == unit && item
      })
    }
    return oneUnit
  }

  validateCnic = (value) => {
    if ((value && value.length < 15) || value === '' || !value) {
      this.setState({ cnicValidate: true, cnicEditable: true })
    } else {
      this.setState({ cnicValidate: false })
    }
  }

  firstFormValidateModal = (status) => {
    const {
      firstFormData,
      cnicValidate,
      leftPearlSqft,
      unitPearlDetailsData,
      checkFirstFormPayment,
    } = this.state
    const { lead } = this.props
    const { noProduct } = lead
    if (!noProduct && firstFormData.paymentPlan === 'no') firstFormData.paymentPlan = null
    if (firstFormData.pearl != null) {
      if (
        firstFormData.pearl <= unitPearlDetailsData.pearlArea &&
        firstFormData.pearl >= 50 &&
        firstFormData.cnic != null &&
        firstFormData.cnic != '' &&
        cnicValidate === false &&
        firstFormData.paymentPlan != 'no' &&
        checkFirstFormPayment
      ) {
        if (leftPearlSqft < 50 && leftPearlSqft > 0) {
          this.setState({
            firstFormValidate: true,
          })
        } else {
          this.setState({
            openFirstScreenModal: status,
          })
        }
      } else {
        this.setState({
          firstFormValidate: true,
        })
      }
    } else {
      if (
        firstFormData.project != null &&
        firstFormData.floor != null &&
        firstFormData.unit != null &&
        firstFormData.paymentPlan != 'no' &&
        checkFirstFormPayment &&
        firstFormData.type != '' &&
        firstFormData.cnic != null &&
        firstFormData.cnic != '' &&
        cnicValidate === false
      ) {
        this.setState({
          openFirstScreenModal: status,
        })
      } else {
        this.setState({
          firstFormValidate: true,
        })
      }
    }
  }

  currencyConvert = (x) => {
    x = x.toString()
    var lastThree = x.substring(x.length - 3)
    var otherNumbers = x.substring(0, x.length - 3)
    if (otherNumbers != '') lastThree = ',' + lastThree
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
    return res
  }

  firstFormConfirmModal = (value) => {
    this.setState({
      openFirstScreenModal: value,
    })
  }

  submitFirstForm = () => {
    const { lead, user } = this.props
    const { firstFormData, pearlUnitPrice, unitPearlDetailsData } = this.state
    this.setState({
      firstScreenConfirmLoading: true,
    })
    let pearlBody = PaymentHelper.createPearl({
      firstFormData,
      pearlUnitPrice,
      unitPearlDetailsData,
      lead,
      user,
    })
    if (firstFormData.unitType === 'pearl') {
      axios
        .post(`/api/project/shop/create`, pearlBody)
        .then((res) => {
          this.firstFormApiCall(res.data.id)
        })
        .catch((error) => {
          console.log('/api/project/shop/create - Error', error)
          helper.errorToast('Something went wrong!!')
          this.setState({
            firstScreenConfirmLoading: false,
          })
        })
    } else {
      let unitId =
        firstFormData.unit === null || firstFormData.unit === '' || firstFormData.unit === 'no'
          ? null
          : firstFormData.unit
      this.firstFormApiCall(unitId)
    }
  }

  firstFormApiCall = (unitId) => {
    const { lead, CMPayment, addInstrument } = this.props
    const { noProduct } = lead
    const { firstFormData, oneProductData } = this.state
    let body = noProduct
      ? PaymentHelper.generateApiPayload(firstFormData, lead, unitId, CMPayment, addInstrument)
      : PaymentHelper.generateProductApiPayload(
          firstFormData,
          lead,
          unitId,
          CMPayment,
          oneProductData,
          addInstrument
        )
    let leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads/project`, body, { params: { id: leadId } })
      .then((res) => {
        axios
          .get(`/api/leads/project/byId?id=${lead.id}`)
          .then((res) => {
            let responseData = res.data
            if (!responseData.paidProject) {
              responseData.paidProject = responseData.project
            }
            this.props.dispatch(setlead(responseData))
            this.setState(
              {
                secondScreenData: res.data,
                openFirstScreenModal: false,
                firstForm: false,
                secondForm: true,
                firstScreenConfirmLoading: false,
              },
              () => {
                helper.successToast('Unit Has Been Booked')
                this.clearReduxAndStateValues()
                this.fetchLead()
              }
            )
          })
          .catch((error) => {
            console.log('/api/leads/project/byId?id - Error', error)
            helper.errorToast('Something went wrong!!!')
            this.setState({
              firstScreenConfirmLoading: false,
            })
          })
      })
      .catch((error) => {
        console.log('/api/leads/project - Error', error)
        helper.errorToast('Something went wrong!!')
        this.setState({
          firstScreenConfirmLoading: false,
        })
      })
  }
  // **************** First Screen Ends *******************

  toggleBookingDetailsModal = (value) => {
    this.setState({ bookingModal: value })
  }

  toggleBookingModal = (value) => {
    const { bookingModal } = this.state
    this.setState({ bookingModal: !bookingModal })
  }

  closeModal = () => {
    this.setState({ leadCloseToggle: false })
  }

  handleReasonChange = (value) => {
    this.setState({ selectedReason: value })
  }

  onHandleCloseLead = () => {
    const { lead, navigation } = this.props
    let body = {
      reasons: 'payment_done',
    }
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads/project`, body, { params: { id: leadId } })
      .then((res) => {
        this.setState({ isVisible: false }, () => {
          helper.successToast(`Lead Closed`)
          navigation.navigate('Leads')
        })
      })
      .catch((error) => {
        console.log('/api/leads/project - Error', error)
        helper.errorToast('Closed lead API failed!!')
      })
  }

  handleOfficeLocation = (value) => {
    const { CMPayment, dispatch } = this.props
    dispatch(setCMPayment({ ...CMPayment, officeLocationId: value }))
  }

  // ************ Function for Reject modal ************

  goToRejectForm = () => {
    const { statusfeedbackModalVisible } = this.state
    this.setState({ modalMode: 'reject', statusfeedbackModalVisible: !statusfeedbackModalVisible })
  }

  rejectLead = (body) => {
    const { navigation, lead } = this.props
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads/project`, body, { params: { id: leadId } })
      .then((res) => {
        helper.successToast(`Lead Closed`)
        navigation.navigate('Leads')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  setCurrentCall = (call) => {
    this.setState({ currentCall: call, modalMode: 'call' })
  }

  showStatusFeedbackModal = (value) => {
    this.setState({ statusfeedbackModalVisible: value })
  }

  sendStatus = (status, id) => {
    const { lead } = this.props
    let body = {
      response: status,
      comments: status,
      leadId: lead.id,
    }
    axios.patch(`/api/diary/update?id=${id}`, body).then((res) => {})
  }

  //  ************ Function for open modal ************
  openModalInMeetingMode = () => {
    this.setState({
      active: !this.state.active,
      isFollowUpMode: false,
    })
  }

  closeMeetingFollowupModal = () => {
    this.setState({
      active: !this.state.active,
      isFollowUpMode: false,
    })
  }

  //  ************ Function for open Follow up modal ************
  openModalInFollowupMode = () => {
    this.setState({
      active: !this.state.active,
      isFollowUpMode: true,
    })
  }

  render() {
    const {
      checkLeadClosedOrNot,
      buyerNotZero,
      addPaymentLoading,
      modalValidation,
      bookingModal,
      unitDetailModal,
      deletePaymentVisible,
      pickerFloors,
      pickerProjects,
      pickerUnits,
      firstFormData,
      unitPearlDetailsData,
      oneUnitData,
      pearlUnit,
      paymentPlan,
      firstFormModal,
      allProjects,
      allFloors,
      allUnits,
      firstFormConfirmLoading,
      finalPrice,
      cnicValidate,
      firstFormValidate,
      pearlUnitPrice,
      checkFirstFormPayment,
      firstScreenConfirmLoading,
      openFirstScreenModal,
      firstForm,
      secondForm,
      cnicEditable,
      remainingPayment,
      outStandingTax,
      reasons,
      selectedReason,
      leadCloseToggle,
      leftPearlSqft,
      progressValue,
      checkFirstFormToken,
      assignToAccountsLoading,
      officeLocations,
      active,
      statusfeedbackModalVisible,
      closedWon,
      modalMode,
      currentCall,
      isFollowUpMode,
      projectProducts,
      productsPickerData,
      productDetailModal,
      oneProductData,
      showInstallmentFields,
      paymentPlanDuration,
      installmentFrequency,
    } = this.state
    const { lead, navigation } = this.props
    return (
      <View style={{ flex: 1 }}>
        <ProgressBar
          style={{ backgroundColor: '#ffffff' }}
          progress={progressValue}
          color={'#0277FD'}
        />
        <View style={{ flex: 1 }}>
          <BookingDetailsModal
            active={bookingModal}
            data={lead}
            formData={firstFormData}
            pearlModal={pearlUnit}
            toggleBookingDetailsModal={this.toggleBookingModal}
            openUnitDetailsModal={this.openUnitDetailsModal}
            finalPrice={finalPrice}
          />
          {allFloors != '' && allFloors.length && allProjects != '' && allProjects.length ? (
            <FirstScreenConfirmModal
              active={openFirstScreenModal}
              data={firstFormData}
              getAllProject={allProjects}
              getAllFloors={allFloors}
              allUnits={allUnits}
              firstScreenConfirmLoading={firstScreenConfirmLoading}
              firstFormConfirmModal={this.firstFormConfirmModal}
              submitFirstScreen={this.submitFirstForm}
              pearlUnitPrice={pearlUnitPrice}
              oneProductData={oneProductData}
            />
          ) : null}
          <LeadRCMPaymentPopup
            reasons={reasons}
            selectedReason={selectedReason}
            isVisible={leadCloseToggle}
            CMlead={true}
            closeModal={() => this.closeModal()}
            changeReason={this.handleReasonChange}
            onPress={this.onHandleCloseLead}
          />
          <UnitDetailsModal
            active={unitDetailModal}
            data={oneUnitData}
            formData={firstFormData}
            pearlModal={pearlUnit}
            openUnitDetailsModal={this.openUnitDetailsModal}
            pearlUnitPrice={pearlUnitPrice}
            lead={lead}
          />
          <ProductDetailsModal
            active={productDetailModal}
            data={oneProductData}
            openProductDetailsModal={this.openProductDetailsModal}
          />
          <CMPaymentModal
            onModalCloseClick={this.onModalCloseClick}
            handleCommissionChange={this.handleCommissionChange}
            modalValidation={modalValidation}
            goToPayAttachments={() => this.goToPayAttachments()}
            submitCommissionPayment={() => this.submitCommissionCMPayment()}
            addPaymentLoading={addPaymentLoading}
            lead={lead}
            paymentNotZero={buyerNotZero}
            checkFirstFormToken={checkFirstFormToken}
            assignToAccounts={() => this.assignToAccounts()}
            officeLocations={officeLocations}
            handleOfficeLocationChange={this.handleOfficeLocation}
            assignToAccountsLoading={assignToAccountsLoading}
            handleInstrumentInfoChange={this.handleInstrumentInfoChange}
          />
          <DeleteModal
            isVisible={deletePaymentVisible}
            deletePayment={(reason) => this.deletePayment(reason)}
            showHideModal={(val) => this.showHideDeletePayment(val)}
          />
          <KeyboardAvoidingView>
            <ScrollView>
              <View style={{ flex: 1, marginBottom: 60 }}>
                {firstForm && (
                  <CMFirstForm
                    pickerFloors={pickerFloors}
                    pickerProjects={pickerProjects}
                    pickerUnits={pickerUnits}
                    handleFirstForm={this.handleFirstForm}
                    firstFormData={firstFormData}
                    checkLeadClosedOrNot={checkLeadClosedOrNot}
                    unitPearlDetailsData={unitPearlDetailsData}
                    openUnitDetailsModal={this.openUnitDetailsModal}
                    oneUnitData={oneUnitData}
                    paymentPlan={paymentPlan}
                    submitFirstForm={this.firstFormValidateModal}
                    pearlUnit={pearlUnit}
                    finalPrice={finalPrice}
                    cnicValidate={cnicValidate}
                    firstFormValidate={firstFormValidate}
                    pearlModal={pearlUnit}
                    pearlUnitPrice={pearlUnitPrice}
                    addPaymentModalToggle={this.addPaymentModalToggle}
                    checkFirstFormPayment={checkFirstFormPayment}
                    currencyConvert={PaymentHelper.currencyConvert}
                    editTokenPayment={this.editTokenPayment}
                    cnicEditable={cnicEditable}
                    leftPearlSqft={leftPearlSqft}
                    projectProducts={projectProducts}
                    productsPickerData={productsPickerData}
                    openProductDetailsModal={this.openProductDetailsModal}
                    showInstallmentFields={showInstallmentFields}
                    paymentPlanDuration={paymentPlanDuration}
                    installmentFrequency={installmentFrequency}
                    lead={lead}
                  />
                )}
                {secondForm && (
                  <CMSecondForm
                    lead={lead}
                    data={this.data}
                    addPaymentModalToggle={this.addPaymentModalToggle}
                    currencyConvert={this.currencyConvert}
                    editTile={this.editTile}
                    onPaymentLongPress={this.onPaymentLongPress}
                    toggleBookingDetailsModal={this.toggleBookingModal}
                    checkLeadClosedOrNot={checkLeadClosedOrNot}
                    remainingPayment={remainingPayment}
                    outStandingTax={outStandingTax}
                  />
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <StatusFeedbackModal
            visible={statusfeedbackModalVisible}
            showFeedbackModal={(value) => this.showStatusFeedbackModal(value)}
            modalMode={modalMode}
            commentsList={
              modalMode === 'call'
                ? StaticData.commentsFeedbackCall
                : StaticData.leadClosedCommentsFeedback
            }
            showAction={modalMode === 'call'}
            showFollowup={modalMode === 'call'}
            rejectLead={(body) => this.rejectLead(body)}
            sendStatus={(comment, id) => this.sendStatus(comment, id)}
            addMeeting={() => this.openModalInMeetingMode()}
            addFollowup={() => this.openModalInFollowupMode()}
            leadType={'CM'}
            currentCall={currentCall}
          />

          <MeetingFollowupModal
            closeModal={() => this.closeMeetingFollowupModal()}
            active={active}
            isFollowUpMode={isFollowUpMode}
            lead={lead}
            leadType={'CM'}
          />

          <View style={AppStyles.mainCMBottomNav}>
            <CMBottomNav
              goToAttachments={this.goToAttachments}
              navigateTo={this.navigateTo}
              goToDiaryForm={this.goToDiaryForm}
              goToComments={this.goToComments}
              closedLeadEdit={checkLeadClosedOrNot}
              alreadyClosedLead={this.closedLead}
              closeLead={this.fetchLead}
              closeLeadFor={'leadClose'}
              goToFollowUp={this.openModalInFollowupMode}
              goToRejectForm={this.goToRejectForm}
              closedWon={closedWon}
              showStatusFeedbackModal={(value) => this.showStatusFeedbackModal(value)}
              setCurrentCall={(call) => this.setCurrentCall(call)}
              leadType={'CM'}
              navigation={navigation}
              customer={lead.customer}
              goToHistory={() => {}}
              getCallHistory={() => {}}
              onHandleCloseLead={this.onHandleCloseLead}
            />
          </View>
        </View>
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
    CMPayment: store.CMPayment.CMPayment,
    addInstrument: store.Instruments.addInstrument,
    instruments: store.Instruments.instruments,
  }
}

export default connect(mapStateToProps)(CMPayment)
