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

class CMPayment extends Component {
  constructor(props) {
    super(props)
    const { lead } = this.props
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
        project: '',
        floor: '',
        unitType: '',
        pearl: '',
        unit: '',
        unitPrice: 0,
        cnic: lead.customer && lead.customer.cnic != null ? lead.customer.cnic : null,
        paymentPlan: 'no',
        approvedDiscount: 0,
        approvedDiscountPrice: 0,
        finalPrice: 0,
        fullPaymentDiscountPrice: 0,
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
      firstFormModal: false,
      firstFormConfirmLoading: false,
      finalPrice: 0,
      cnicValidate: false,
      firstFormValidate: false,
      pearlUnitPrice: 0,
      leftPearlSqft: 0,
    }
  }

  componentDidMount = () => {
    // this.axiosCancelSource = axios.CancelToken.source()
    // axios
    //   .get('data.json', { cancelToken: this.axiosCancelSource.token })
    //   .then((response) => {})
    //   .catch((err) => console.log(err))
    this.fetchLead()
    this.getAllProjects()
    this.setdefaultFields(this.props.lead)
    // console.log('this.props.lead: ', this.props.lead)
  }

  componentWillUnmount = () => {
    this.clearReduxAndStateValues()
  }

  toggleBookingDetailsModal = (value) => {
    this.setState({ bookingModal: value })
  }

  // **************** Fetch API's Calls Start *******************
  fetchLead = () => {
    const { lead } = this.props
    const { cmProgressBar } = StaticData
    axios
      .get(`/api/leads/project/byId?id=${lead.id}`)
      .then((res) => {
        let responseData = res.data
        if (!responseData.paidProject) {
          responseData.paidProject = responseData.project
        }
        this.props.dispatch(setlead(responseData))
        this.setdefaultFields(responseData)
      })
      .catch((error) => {
        console.log('/api/leads/project/byId?id - Error', error)
      })
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
  addPaymentModalToggle = (visible, paymentCategory) => {
    const { CMPayment, dispatch } = this.props
    dispatch(setCMPayment({ ...CMPayment, visible: visible, paymentCategory: paymentCategory }))
  }

  showHideDeletePayment = (val) => {
    this.setState({ deletePaymentVisible: val, documentModalVisible: false })
  }

  deletePayment = async (reason) => {
    const { CMPayment, lead } = this.props
    const { selectedPayment } = this.state
    this.showHideDeletePayment(false)
    const { installmentAmount } = selectedPayment
    // let url = `/api/leads/deletePropsurePayment?id=${selectedPayment.id}&reason=${reason}&leadId=${lead.id}&outstandingPayment=${totalPayment}`
    // const response = await axios.delete(url)
    // if (response.data) {
    //   this.clearReduxAndStateValues()
    //   this.fetchLead(lead)
    //   this.fetchProperties(lead)
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

  submitCommissionCMPayment = () => {
    const { CMPayment, user, lead } = this.props
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
          // addedBy: 'buyer',
          amount: CMPayment.installmentAmount,
        }
        delete body.visible
        delete body.installmentAmount
        delete body.paymentCategory
        console.log('body: ', body)
        // axios
        //   .post(`/api/leads/propsurePayment`, body)
        //   .then((response) => {
        //     if (response.data) {
        //       // check if some attachment exists so upload that as well to server with payment id.
        //       if (CMPayment.attachments.length > 0) {
        //         CMPayment.attachments.map((paymentAttachment) =>
        //           // payment attachments
        //           this.uploadPaymentAttachment(paymentAttachment, response.data.id)
        //         )
        //       } else {
        //         this.clearReduxAndStateValues()
        //         this.fetchLead(lead)
        //         helper.successToast('Payment Added')
        //       }
        //     }
        //   })
        //   .catch((error) => {
        //     this.clearReduxAndStateValues()
        //     console.log('Error: ', error)
        //     helper.errorToast('Error Adding Payment')
        //   })
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
        delete body.paymentCategory
        // axios
        //   .patch(`/api/leads/project/payment?id=${body.id}`, body)
        //   .then((res) => {
        //     // upload only the new attachments that do not have id with them in object.
        //     const filterAttachmentsWithoutId = CMPayment.attachments
        //       ? _.filter(CMPayment.attachments, (item) => {
        //           return !_.has(item, 'id')
        //         })
        //       : []
        //     if (filterAttachmentsWithoutId.length > 0) {
        //       filterAttachmentsWithoutId.map((item, index) => {
        //         // payment attachments
        //         this.uploadPaymentAttachment(item, body.id)
        //       })
        //     } else {
        //       this.fetchLead(lead)
        //       this.clearReduxAndStateValues()
        //       helper.successToast('Payment Updated')
        //     }
        //   })
        //   .catch((error) => {
        //     helper.errorToast('Error Updating Payment', error)
        //     this.clearReduxAndStateValues()
        //   })
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
  // **************** Add Payment Modal Functions End *******************

  // **************** First Screen Starts *******************

  setPaymentPlanArray = (lead) => {
    const { paymentPlan, checkPaymentPlan } = this.state
    const array = []
    if (
      checkPaymentPlan.investment === true &&
      lead.paidProject != null &&
      lead.paidProject != null
    ) {
      array.push({
        value: 'Sold on Investment Plan',
        name: `Investment Plan ${
          lead.paidProject.full_payment_discount > 0
            ? `(Full Payment Disc: ${lead.paidProject.full_payment_discount}%)`
            : ''
        }`,
      })
    }
    if (checkPaymentPlan.rental === true && lead.paidProject != null && lead.paidProject != null) {
      array.push({ value: 'Sold on Rental Plan', name: `Rental Plan` })
    }
    if (checkPaymentPlan.years != null) {
      array.push({
        value: 'Sold on Installments Plan',
        name: checkPaymentPlan.years + ' Years Quarterly Installments',
      })
    }
    if (checkPaymentPlan.monthly === true) {
      array.push({
        value: 'Sold on Monthly Installments Plan',
        name: checkPaymentPlan.years + ' Years Monthly Installments',
      })
    }
    this.setState({
      paymentPlan: array,
    })
  }

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
          this.setPaymentPlanArray(lead)
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
    } = this.state
    const { lead } = this.props
    let newData = firstFormData
    let oneFloor = unitPearlDetailsData
    let oneUnit = oneUnitData
    let copyPearlUnit = pearlUnit
    let copyFinalPrice = finalPrice
    if (name === 'project') {
      if (lead.projectId !== value) {
        this.changeProject(value)
      }
      this.getFloors(value)
    }
    if (name === 'floor') {
      if (allFloors && allFloors.length) {
        oneFloor = allFloors.find((item) => {
          return item.id == value && item
        })
      }
    }
    if (name === 'unitType' && value === 'fullUnit') {
      this.getUnits(newData.project, newData.floor)
      copyPearlUnit = false
    }
    if (name === 'unitType' && value === 'pearl') copyPearlUnit = true
    if (name === 'unit') {
      oneUnit = this.fetchOneUnit(value)
      newData['approvedDiscount'] = this.handleEmptyValue(oneUnit.discount)
      newData['approvedDiscountPrice'] = PaymentMethods.findDiscountAmount(oneUnit)
    }
    if (name === 'approvedDiscount') {
      newData['approvedDiscountPrice'] = PaymentMethods.findApprovedDiscountAmount(oneUnit, value)
    }
    if (name === 'approvedDiscountPrice') {
      newData['approvedDiscount'] = PaymentMethods.findApprovedDiscountPercentage(oneUnit, value)
    }
    if (name === 'paymentPlan' && value === 'Sold on Investment Plan') {
      let fullPaymentDiscount = lead.paidProject != null && lead.paidProject.full_payment_discount
      let fullPaymentDiscountPrice = PaymentMethods.findApprovedDiscountAmount(
        oneUnit,
        fullPaymentDiscount
      )
      newData['fullPaymentDiscountPrice'] = fullPaymentDiscountPrice
    }
    if (name === 'paymentPlan' && value !== 'Sold on Investment Plan') {
      newData['fullPaymentDiscountPrice'] = 0
    }
    newData[name] = value
    if (oneUnit) {
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
    if (name === 'pearl') {
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
    // console.log('oneUnit: ', oneUnit)
    this.setState({
      firstFormData: { ...newData },
      unitPearlDetailsData: { ...oneFloor },
      oneUnitData: copyPearlUnit ? { ...oneFloor } : { ...oneUnit },
      pearlUnit: copyPearlUnit,
    })
  }

  createPearl = (oneFloor, pearl) => {
    // console.log('oneFloor: ', oneFloor)
    // console.log('pearl: ', pearl)
    // const {lead} = this.props
    // var downPayment = lead.paidProject != null ? lead.paidProject.down_payment : 0
    // var totalDownPayment = (downPayment / 100) * unitPrice
    // var fullPaymentDiscount = lead.paidProject != null ? lead.paidProject.full_payment_discount : 0
    // var totalFullpaymentDiscount = (1 - fullPaymentDiscount / 100) * unitPrice
    // var possessionCharges = lead.paidProject != null ? lead.paidProject.possession_charges : 0
    // var totalpossessionCharges = (possessionCharges / 100) * unitPrice
    // var installmentAmount = unitPrice - totalDownPayment - totalpossessionCharges
    // var installmentPlan = lead.paidProject != null ? lead.paidProject.installment_plan : 1
    // var numberOfQuarterlyInstallments = installmentPlan * 4
    // var quarterlyInstallmentsAmount = installmentAmount / numberOfQuarterlyInstallments
    // var numberOfMonthlyInstallments = installmentPlan * 12
    // var monthlyInstallmentsAmount = installmentAmount / numberOfMonthlyInstallments
    // var totalRent = unitPearlDetailsData.rentPerSqFt * formData.pearl
    // const {firstFormData, unitPearlDetailsData} = this.state
    // let totalRent = unitPearlDetailsData.rentPerSqFt * formData.pearl
    // pearlBody = {
    //   area: pearl,
    //   area_unit: 'sqft',
    //   bookingStatus: 'Available',
    //   category_charges: 0,
    //   unit_price: unitPrice,
    //   discount: 0,
    //   discount_amount: 0,
    //   discounted_price: unitPrice,
    //   down_payment: totalDownPayment,
    //   floorId: firstFormData.foor,
    //   full_payment_price: totalFullpaymentDiscount,
    //   possession_charges: totalpossessionCharges,
    //   installment_amount: installmentAmount,
    //   quarterly_installments: quarterlyInstallmentsAmount,
    //   monthly_installments: monthlyInstallmentsAmount,
    //   name: 'Shop # 4892',
    //   optional_fields: '{}',
    //   pricePerSqFt: unitPearlDetailsData.pricePerSqFt,
    //   projectId: firstFormData.project,
    //   rate_per_sqft: unitPearlDetailsData.pricePerSqFt,
    //   remarks: '',
    //   rent: totalRent,
    //   rentPerSqFt: unitPearlDetailsData.rentPerSqFt,
    //   reservation: unitPearlDetailsData.project.reservation_charges,
    //   type: 'pearl',
    //   userId: this.props.user.id,
    //   name: 'name',
    // }
  }

  handleEmptyValue(value) {
    return value != null && value != '' ? Number(value) : 0
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

  firstFormConfirmModal = () => {
    const { firstForm, cnicValidate, leftPearlSqft, unitPearlDetailsData } = this.state
    if (firstForm.pearl != null) {
      if (
        firstForm.pearl <= unitPearlDetailsData.pearlArea &&
        firstForm.pearl >= 50 &&
        firstForm.cnic != null &&
        firstForm.cnic != '' &&
        cnicValidate === false &&
        firstForm.paymentPlan != 'no' &&
        firstForm.token != null &&
        firstForm.token != ''
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
        firstForm.project != null &&
        firstForm.floor != null &&
        firstForm.unit != null &&
        firstForm.paymentPlan != 'no' &&
        firstForm.token != null &&
        firstForm.token != '' &&
        firstForm.type != '' &&
        firstForm.cnic != null &&
        firstForm.cnic != '' &&
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

  submitFirstForm = () => {
    console.log('submitFirstForm')
  }
  // **************** First Screen Ends *******************

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
    } = this.state
    const { lead } = this.props
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1 }}>
          {/* <BookingDetailsModal
            active={bookingModal}
            data={{}}
            formData={formData}
            pearlModal={false}
            toggleBookingDetailsModal={this.toggleBookingDetailsModal}
            // openUnitDetailsModal={this.openUnitDetailsModal}
          /> */}
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
          <FirstScreenConfirmModal
            active={firstFormModal}
            data={firstFormData}
            getAllProject={allProjects}
            getAllFloors={allFloors}
            allUnits={allUnits}
            firstScreenConfirmLoading={firstFormConfirmLoading}
            firstScreenConfirmModal={this.firstScreenConfirmModal}
            submitFirstScreen={this.submitFirstForm}
          />
          <KeyboardAvoidingView>
            <ScrollView>
              <View style={{ flex: 1, marginBottom: 60 }}>
                {/* <CMFirstForm
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
                  submitFirstForm={this.firstFormConfirmModal}
                  pearlUnit={pearlUnit}
                  finalPrice={finalPrice}
                  cnicValidate={cnicValidate}
                  firstFormValidate={firstFormValidate}
                  pearlModal={pearlUnit}
                  pearlUnitPrice={pearlUnitPrice}
                /> */}
                <CMSecondForm addPaymentModalToggle={this.addPaymentModalToggle} 
                toggleBookingDetailsModal={this.toggleBookingDetailsModal}/>
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
              // closeLead={this.fetchLead}
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
