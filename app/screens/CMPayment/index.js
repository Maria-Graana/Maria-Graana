/** @format */

import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { Component } from 'react'
import AppJson from '../../../app.json'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux'
import styles from './style'
import config from '../../config'
import helper from '../../helper'
import CMFirstForm from '../../components/CMFirstForm'
import CMSecondForm from '../../components/CMSecondForm'
import BookingDetailsModal from '../../components/BookingDetailsModal'
import CMBottomNav from '../../components/CMBottomNav'
import UnitDetailsModal from '../../components/UnitDetailsModal'
import CMPaymentModal from '../../components/CMPaymentModal'
import { setCMPayment } from '../../actions/addCMPayment'
import DeleteModal from '../../components/DeleteModal'
import FirstScreenConfirmModal from '../../components/FirstScreenConfirmModal'
import { setCMTax } from '../../actions/addCMTax'
import { setlead } from '../../actions/lead'
import axios from 'axios'
import PaymentMethods from '../../PaymentMethods'
import { ActionSheet } from 'native-base'
import PaymentHelper from './PaymentHelper'

var BUTTONS = ['Delete', 'Cancel']
var CANCEL_INDEX = 1
class CMPayment extends Component {
  data = [
    {
      addedBy: null,
      armsUserId: 548,
      chequeDepositDat: null,
      cmLeadId: 214078,
      createdAt: '2021-02-15T10:34:24.890Z',
      deletedAt: null,
      details: null,
      id: 2288,
      installmentAmount: 353,
      outStandingTax: null,
      paymentAttachments: [],
      paymentCategory: 'token',
      paymentClearenceDate: null,
      paymentId: null,
      paymentTime: '2021-02-15T10:34:24.000Z',
      rcmLeadId: null,
      reason: null,
      remarks: null,
      shortlistPropertyId: null,
      status: 'pendingAccount',
      taxAmount: null,
      taxIncluded: false,
      type: 'pay-Order',
      updatedAt: '2021-02-15T10:34:24.890Z',
    },
  ]
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
        project: lead.paidProject != null ? lead.paidProject.id : '',
        floor: '',
        unitType: '',
        pearl: 0,
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
    }
  }

  componentDidMount = () => {
    // this.axiosCancelSource = axios.CancelToken.source()
    // axios
    //   .get('data.json', { cancelToken: this.axiosCancelSource.token })
    //   .then((response) => {})
    //   .catch((err) => console.log(err))
    const { firstForm, secondForm } = this.state
    const { lead } = this.props
    const { paidProject } = lead
    if (firstForm) {
      if (paidProject && paidProject.id) {
        this.getFloors(paidProject.id)
      }
    }
    if (secondForm) {
      this.setState({
        pearlUnit:
          lead && lead.unit && lead.unit.type && lead.unit.type === 'regular' ? false : true,
      })
    }
    this.fetchLead()
    this.getAllProjects()
    this.setdefaultFields(this.props.lead)
  }

  componentWillUnmount = () => {
    this.clearReduxAndStateValues()
  }

  // **************** Fetch API's Calls Start *******************
  fetchLead = async (functionCallingFor) => {
    const { lead } = this.props
    const { payment, unit } = lead
    const { cmProgressBar } = StaticData
    const { secondForm } = this.state
    axios
      .get(`/api/leads/project/byId?id=${lead.id}`)
      .then((res) => {
        // console.log('res.data: ', res.data)
        let responseData = res.data
        if (!responseData.paidProject) {
          responseData.paidProject = responseData.project
        }
        this.props.dispatch(setlead(responseData))
        if (secondForm) {
          this.calculatePayments(responseData, functionCallingFor)
        }
        this.setdefaultFields(responseData)
      })
      .catch((error) => {
        console.log('/api/leads/project/byId?id - Error', error)
      })
  }

  calculatePayments = (lead, functionCallingFor) => {
    const { payment, unit } = lead
    let { remainingPayment, remainingTax } = PaymentMethods.findRemaningPayment(
      payment,
      unit.finalPrice
    )
    let outStandingTax = PaymentMethods.findRemainingTax(payment, remainingTax)
    this.setState(
      {
        remainingPayment: remainingPayment,
        outStandingTax: outStandingTax,
      },
      () => {
        if (functionCallingFor === 'leadClose') {
          // this.formSubmit()
        }
      }
    )
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
    const { navigation, route } = this.props
    navigation.navigate('Attachments', { cmLeadId: this.props.lead.id })
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
    dispatch(setCMPayment({ ...CMPayment, visible: visible, paymentType: paymentType }))
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
    // const response = await axios.delete(url)
    // if (response.data) {
    //   this.clearReduxAndStateValues()
    //   this.fetchLead(lead)
    //   helper.successToast(response.data)
    // } else {
    //   helper.errorToast('ERROR DELETING PAYMENT!')
    // }
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

  setCommissionEditData = (data) => {
    const { dispatch } = this.props
    this.setState({
      editable: true,
      documentModalVisible: false,
      previousPayment: data.installmentAmount,
    })
    dispatch(setCMPayment({ ...data, visible: true }))
  }

  handleCommissionChange = (value, name) => {
    const { CMPayment, dispatch } = this.props
    const newSecondFormData = {
      ...CMPayment,
      visible: CMPayment.visible,
    }
    newSecondFormData[name] = value
    this.setState({ buyerNotZero: false })
    dispatch(setCMPayment(newSecondFormData))
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
      attachments: [],
      uri: '',
      size: null,
      title: '',
      taxIncluded: false,
      paymentType: '',
      paymentCategory: '',
      whichModalVisible: '',
      firstForm: false,
      secondForm: false,
    }
    dispatch(setCMPayment({ ...newData }))
    this.setState({
      modalValidation: false,
      addPaymentLoading: false,
      editable: false,
      totalReportPrice: 0,
    })
  }

  onModalCloseClick = () => {
    this.clearReduxAndStateValues()
  }

  editTile = (payment) => {
    console.log('EDIT', payment)
    const { dispatch } = this.props
    dispatch(
      setCMPayment({
        ...payment,
        visible: true,
      })
    )
    this.setState({
      editable: true,
    })
  }

  submitCommissionCMPayment = () => {
    const { CMPayment, user, lead, dispatch } = this.props
    const { editable, selectedProperty, previousPayment } = this.state
    if (
      CMPayment.installmentAmount != null &&
      CMPayment.installmentAmount != '' &&
      CMPayment.type != ''
    ) {
      this.setState({
        addPaymentLoading: true,
      })
      if (Number(CMPayment.installmentAmount) <= 0) {
        this.setState({ buyerNotZero: true, addPaymentLoading: false })
        return
      }
      if (editable === false) {
        // for commission addition
        let body = {
          ...CMPayment,
          cmLeadId: lead.id,
          armsUserId: user.id,
          addedBy: 'buyer',
          installmentAmount: CMPayment.installmentAmount,
        }
        delete body.visible
        if (CMPayment.paymentType === 'token') {
          dispatch(setCMPayment({ ...CMPayment, visible: false }))
          this.setState({ addPaymentLoading: false, checkFirstFormPayment: true })
          return
        }
        body.paymentCategory = CMPayment.paymentType
        console.log('Before API CAll body: ', body)
        axios
          .post(`/api/leads/project/payments`, body)
          .then((response) => {
            if (response.data) {
              // check if some attachment exists so upload that as well to server with payment id.
              if (CMPayment.attachments.length > 0) {
                CMPayment.attachments.map((paymentAttachment) =>
                  // payment attachments
                  this.uploadPaymentAttachment(paymentAttachment, response.data.id)
                )
              } else {
                this.clearReduxAndStateValues()
                this.fetchLead(lead)
                helper.successToast('Payment Added')
              }
            }
          })
          .catch((error) => {
            this.clearReduxAndStateValues()
            console.log('Error: ', error)
            helper.errorToast('Error Adding Payment')
          })
      } else {
        // commission update mode
        let body = {
          ...CMPayment,
          cmLeadId: lead.id,
          armsUserId: user.id,
          // addedBy: 'buyer',
          installmentAmount: CMPayment.installmentAmount,
        }
        delete body.visible
        delete body.remarks
        if (CMPayment.paymentType === 'token') {
          dispatch(setCMPayment({ ...CMPayment, visible: false }))
          this.setState({ addPaymentLoading: false, checkFirstFormPayment: true })
          return
        }
        body.paymentCategory = CMPayment.paymentType
        axios
          .patch(`/api/leads/project/payment?id=${body.id}`, body)
          .then((res) => {
            // upload only the new attachments that do not have id with them in object.
            const filterAttachmentsWithoutId = CMPayment.attachments
              ? _.filter(CMPayment.attachments, (item) => {
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
              helper.successToast('Payment Updated')
            }
          })
          .catch((error) => {
            helper.errorToast('Error Updating Payment', error)
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
          this.fetchLead(lead)
          this.fetchProperties(lead)
          this.clearReduxAndStateValues()
        }
      })
      .catch((error) => {
        helper.errorToast('Attachment Error: ', error)
      })
  }

  editTokenPayment = () => {
    const { CMPayment, dispatch } = this.props
    dispatch(setCMPayment({ ...CMPayment, visible: true }))
  }

  // **************** Add Payment Modal Functions End *******************

  // **************** First Screen Starts *******************

  setdefaultFields = (lead) => {
    const { checkPaymentPlan } = this.state
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
        },
        () => {
          let paymentArray = PaymentHelper.setPaymentPlanArray(lead, checkPaymentPlan)
          this.setState({
            paymentPlan: paymentArray,
            editable: false,
          })
        }
      )
  }

  handleFirstForm = (value, name) => {
    console.log(value, name)
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
    } = this.state
    const { lead } = this.props
    let newData = firstFormData
    let oneFloor = unitPearlDetailsData
    let oneUnit = oneUnitData
    let copyPearlUnit = pearlUnit
    let copyFinalPrice = finalPrice
    let copyPearlUnitPrice = pearlUnitPrice
    if (name === 'project') {
      if (lead.projectId !== value) {
        this.changeProject(value)
      }
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
      newData['approvedDiscount'] = PaymentHelper.handleEmptyValue(oneUnit.discount)
      newData['approvedDiscountPrice'] = PaymentMethods.findDiscountAmount(oneUnit)
      newData['pearl'] = null
    }
    if (name === 'approvedDiscount') {
      if (copyPearlUnit) oneUnit = PaymentHelper.createPearlObject(oneFloor, newData['pearl'])
      newData['approvedDiscountPrice'] = PaymentMethods.findApprovedDiscountAmount(oneUnit, value)
    }
    if (name === 'approvedDiscountPrice') {
      if (copyPearlUnit) oneUnit = PaymentHelper.createPearlObject(oneFloor, newData['pearl'])
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
    newData[name] = value
    if (oneUnit) {
      if (copyPearlUnit) oneUnit = PaymentHelper.createPearlObject(oneFloor, newData['pearl'])
      newData['finalPrice'] = PaymentMethods.findFinalPrice(
        oneUnit,
        newData['approvedDiscountPrice'],
        newData['fullPaymentDiscountPrice']
      )
    }
    if (name === 'cnic') {
      value = helper.normalizeCnic(value)
      this.validateCnic(value)
    }
    if (name === 'pearl') this.pearlCalculations(oneFloor, value)
    console.log('newData: ', newData)
    this.setState({
      firstFormData: { ...newData },
      unitPearlDetailsData: { ...oneFloor },
      oneUnitData: copyPearlUnit ? { ...oneFloor } : { ...oneUnit },
      pearlUnit: copyPearlUnit,
    })
  }

  pearlCalculations = (oneFloor, value) => {
    let totalSqft = oneFloor.pearlArea
    let minusSqft = value
    let copyLeftSqft = totalSqft - minusSqft
    if (copyLeftSqft < 50) {
      this.setState({ leftPearlSqft: copyLeftSqft })
    }
    let totalPrice = value * oneFloor.pricePerSqFt
    this.setState({
      pearlUnitPrice: totalPrice,
      unitPearlDetailsData: oneFloor,
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
    if (value.length < 15 || value === '') {
      this.setState({ cnicValidate: true })
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
    console.log('firstFormData: ', firstFormData)
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
      console.log('pearlBody: ', pearlBody)
      // axios
      //   .post(`/api/project/shop/create`, pearlBody)
      //   .then((res) => {
      //     unitId = res.data.id
      //     this.firstFormApiCall(res.data.id)
      //   })
      //   .catch((error) => {
      //     console.log('/api/project/shop/create - Error', error)
      //     helper.errorToast('Something went wrong!!')
      //     this.setState({
      //       firstScreenConfirmLoading: false,
      //     })
      //   })
    } else {
      let unitId =
        firstFormData.unit === null || firstFormData.unit === '' || firstFormData.unit === 'no'
          ? null
          : firstFormData.unit
      this.firstFormApiCall(unitId)
    }
  }

  firstFormApiCall = (unitId) => {
    const { lead, CMPayment } = this.props
    const { firstFormData } = this.state
    let body = PaymentHelper.generateApiPayload(firstFormData, lead, unitId, CMPayment)
    console.log('firstFormData: ', firstFormData)
    console.log('CMPayment: ', CMPayment)
    console.log('firstFormApiCall: ', body)
    let leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads/project`, body, { params: { id: leadId } })
      .then((res) => {
        console.log('firstFormApiCall: ', res.data)
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
    console.log('toggleBookingDetailsModal: ', value)
    this.setState({ bookingModal: value })
  }

  toggleBookingModal = (value) => {
    const { bookingModal } = this.state
    console.log('toggleBookingModal: ', !bookingModal)
    this.setState({ bookingModal: !bookingModal })
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
    } = this.state
    const { lead } = this.props
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1 }}>
          <BookingDetailsModal
            active={bookingModal}
            data={lead}
            formData={firstFormData}
            pearlModal={pearlUnit}
            toggleBookingDetailsModal={this.toggleBookingModal}
            openUnitDetailsModal={this.openUnitDetailsModal}
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
            />
          ) : null}
          <UnitDetailsModal
            active={unitDetailModal}
            data={oneUnitData}
            formData={firstFormData}
            pearlModal={pearlUnit}
            openUnitDetailsModal={this.openUnitDetailsModal}
            pearlUnitPrice={pearlUnitPrice}
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
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
    CMPayment: store.CMPayment.CMPayment,
    CMTax: store.CMTax.CMTax,
  }
}

export default connect(mapStateToProps)(CMPayment)
