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
import SchedulePayment from '../../components/SchedulePayment'
import UnitsTable from '../../components/UnitsTable'
import CMBottomNav from '../../components/CMBottomNav'
import CMFirstForm from '../../components/CMFirstForm'
import CMPaymentModal from '../../components/CMPaymentModal'
import CMSecondForm from '../../components/CMSecondForm'
import DeleteModal from '../../components/DeleteModal'
import FirstScreenConfirmModal from '../../components/FirstScreenConfirmModal'
import HistoryModal from '../../components/HistoryModal'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import UnitDetailsModal from '../../components/UnitDetailsModal'
import ProductDetailsModal from '../../components/ProductDetailsModal'
import helper from '../../helper'
import PaymentMethods from '../../PaymentMethods'
import StaticData from '../../StaticData'
import PaymentHelper from './PaymentHelper'
import moment from 'moment-timezone'
import AccountsPhoneNumbers from '../../components/AccountsPhoneNumbers'
import SubmitFeedbackOptionsModal from '../../components/SubmitFeedbackOptionsModal'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import { Buffer } from 'buffer'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as MediaLibrary from 'expo-media-library'
import * as Permissions from 'expo-permissions'
import MonthPicker from '../../components/MonthPicker'

var BUTTONS = ['Delete', 'Cancel']
var CANCEL_INDEX = 1
class CMPayment extends Component {
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  constructor(props) {
    const date = new Date()
    super(props)
    const { lead, user, route, permissions } = this.props
    this.state = {
      checkLeadClosedOrNot: false,
      editable: false,
      buyerNotZero: false,
      addPaymentLoading: false,
      modalValidation: false,
      bookingModal: false,
      unitDetailModal: false,
      deletePaymentVisible: false,
      callModal: false,
      allProjects: [],
      pickerProjects: [],
      allFloors: [],
      pickerFloors: [],
      allUnits: [],
      meetings: [],
      pickerUnits: [],
      firstFormData: {
        perUnitType: 'null',
        parkingAvailable:
          lead.project && lead.project.parkingAvailable ? lead.project.parkingAvailable : 'no',
        parkingCharges:
          lead.project && lead.project.parkingCharges ? lead.project.parkingCharges : null,
        customerId: lead.customerId != null ? lead.customerId : '',
        clientName: lead.customer.customerName != null ? lead.customer.customerName : '',
        project:
          route.params?.unitData != null
            ? route.params?.unitData.projectId
            : lead.paidProject != null
            ? lead.paidProject.id
            : lead.project
            ? lead.project.id
            : '',
        floor: route.params?.unitData != null ? route.params?.unitData.floorId : '',
        unitType: route.params?.unitData != null ? 'fullUnit' : null,
        pearl: route.params?.unitData != null ? null : '',
        unit:
          route.params?.unitData != null
            ? route.params?.unitData.id
            : lead.unit != null
            ? lead.unit.id
            : '',
        unitPrice: route.params?.unitData != null ? route.params?.unitData.unit_price : 0,
        cnic: lead.customer && lead.customer.cnic != null ? lead.customer.cnic : null,
        paymentPlan: 'no',
        approvedDiscount: 0,
        approvedDiscountPrice: 0,
        finalPrice: 0,
        fullPaymentDiscountPrice: 0,
        pearlName: 'New Pearl',
        productId: null,
        installmentFrequency: '',
        possessionCharges: 0,
        downPayment: 0,
        possessionChargesPercentage: '',
        downPaymentPercentage: '',
        siteData: null,
        noOfInstallment: '',
        unitName: route.params?.unitData != null ? route.params?.unitData.name : '',
        projectName: route.params?.unitData != null ? route.params?.unitData.project.name : '',
        floorName: route.params?.unitData != null ? route.params?.unitData.floor.name : '',
        projectSiteId: null,
      },
      unitPearlDetailsData: route.params?.unitData != null ? route.params?.unitData.floor : {},
      oneUnitData: route.params?.unitData != null ? route.params?.unitData : {},
      unitDetailModal: false,
      checkValidation: false,
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
      checkLeadClosedOrNot: helper.checkAssignedSharedStatus(user, lead, permissions),
      openFirstScreenModal: false,
      firstScreenConfirmLoading: false,
      firstForm: lead.unit === null || lead.unit.id === null ? true : false,
      secondForm: lead.unit != null && lead.unit.id != null ? true : false,
      reasons: [],
      lead: false,
      selectedReason: '',
      leadCloseToggle: false,
      progressValue: 0,
      officeLocations: [],
      assignToAccountsLoading: false,
      active: false,
      closedWon: false,
      statusfeedbackModalVisible: false,
      modalMode: 'call',
      isFeedbackMeetingModalVisible: false,
      isFollowUpMode: false,
      projectProducts: [],
      productsPickerData: [],
      productDetailModal: false,
      oneProductData: {},
      showInstallmentFields: false,
      installmentFrequency: [],
      comment: null,
      showSchedule: false,
      SchedulePaymentData: [],
      downPayment: 0,
      possessionCharges: 0,
      downPaymenTime: moment().format('DD MMM, YYYY'),
      accountPhoneNumbers: [],
      accountsLoading: false,
      isMultiPhoneModalVisible: false,
      newActionModal: false,
      externalProject: false,
      toggleUnitsTable: false,
      tableHeaderTitle: [],
      tableData: [],
      isPrimary: false,
      selectedClient: null,
      allLeads: null,
      allLeadsData: null,
      setLeadDetail: null,
      startYear: 2000,
      endYear: 2050,
      selectedYear: date.getFullYear(),
      selectedMonth: date.getMonth() + 1,
      siteData: [],
      tableDataLoading: false,
    }
  }

  componentDidMount = () => {
    const { navigation, route, lead } = this.props
    if (route.params && route.params.unitData) {
      lead.id != route.params.unitData.projectId &&
        this.changeProject(route.params.unitData.projectId)
      lead.status == 'open' && this.getAllProjects()
    }
    this._unsubscribe = navigation.addListener('focus', () => {
      const { route } = this.props
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
      this.fetchProducts(lead)
      this.fetchOfficeLocations()
      this.fetchLead()
      this.getAllProjects()
      this.setdefaultFields(this.props.lead)
      lead.customer && lead.customer.cnic != null
        ? this.validateCnic(lead.customer && lead.customer.cnic != null ? lead.customer.cnic : null)
        : null
      if (route.params) this.setClient()
    })
  }

  componentWillUnmount = () => {
    const { dispatch } = this.props
    this.clearReduxAndStateValues()
    dispatch(clearInstrumentInformation())
    dispatch(clearInstrumentsList())
  }
  clearParmas = () => {
    const { navigation } = this.props
    navigation.setParams({ client: null, name: null })
  }
  setClient = () => {
    const { client, name } = this.props.route.params
    const { firstFormData } = this.state
    let copyObject = Object.assign({}, firstFormData)
    if (client) {
      copyObject.cnic = client.cnic
      copyObject.clientName = name
      this.setState({ firstFormData: copyObject })
      if (client.cnic != null) {
        this.setState({ cnicEditable: false, cnicValidate: false })
      } else {
        this.setState({ cnicEditable: true })
      }
    }
    this.setState({ selectedClient: client }, () => {
      this.clearParmas()
    })
  }
  handleClientClick = () => {
    const { navigation } = this.props
    const { firstFormData, selectedClient } = this.state
    let copyObject = Object.assign({}, firstFormData)
    this.setState({
      firstFormData: copyObject,
    })
    navigation.navigate('Client', {
      isFromDropDown: true,
      selectedClient,
      screenName: 'Payments',
    })
  }

  fetchProducts = (lead) => {
    const { paidProject, project } = lead
    const { firstFormData } = this.state
    let projectID =
      paidProject && paidProject.id ? paidProject.id : project && project.id ? project.id : null

    axios
      .get(`/api/project/products?projectId=${projectID}&unitType=${firstFormData.perUnitType}`)
      .then((res) => {
        this.setState({
          projectProducts: res.data,
          productsPickerData: PaymentHelper.normalizeProjectProducts(res.data),
        })
      })
      .catch((error) => {
        console.log(`/api/project/products?projectId=${projectID}`, error)
      })
  }

  fetchOfficeLocations = () => {
    const { lead } = this.props
    axios
      .get(`/api/user/locations`)
      .then((response) => {
        if (response.data && lead && lead.project) {
          let locations = PaymentHelper.setOfficeLocation(response.data, lead.project)
          this.setState({
            officeLocations: locations,
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
    const { secondForm, firstForm } = this.state
    axios
      .get(`/api/leads/project/byId?id=${lead.id}`)
      .then((res) => {
        let responseData = { ...res.data }
        let bookingFormsData =
          responseData.bookingForms.length > 0 ? responseData.bookingForms[0] : null
        if (bookingFormsData) {
          let { unit } = responseData
          unit['finalPrice'] = bookingFormsData.finalPrice
          unit['type'] = bookingFormsData.projectType
          unit['discount_amount'] = bookingFormsData.discountedAmount
          unit['discounted_price'] = bookingFormsData.discountedPrice
          responseData.unit.category_charges =
            bookingFormsData.unitCategoryCharges === null ? 0 : bookingFormsData.unitCategoryCharges
          responseData.unit.pricePerSqFt = bookingFormsData.unitRatePerSqrFt
          responseData.unit.area = bookingFormsData.unitArea
          responseData.unit.unit_price = bookingFormsData.price
          responseData.unit.bookingStatus = bookingFormsData.unitStatus
          responseData.unit.finalPrice = bookingFormsData.finalPrice
        }
        if (!responseData.paidProject) responseData.paidProject = responseData.project
        this.props.dispatch(setlead(responseData))
        this.fetchProducts(responseData)
        this.getCallHistory()
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
    let discountAmount = ''
    if (unit.type !== 'pearl')
      discountAmount = PaymentMethods.findApprovedDiscountAmount(unit, unit.discount)
    else discountAmount = unit.discounted_price

    let finalPrice = PaymentMethods.findFinalPrice(
      0,
      unit,
      discountAmount,
      fullPaymentDiscount,
      unit.type === 'regular' ? false : true
    )
    let { remainingPayment, remainingTax } = PaymentMethods.findRemaningPayment(
      payment,
      lead.unit.finalPrice
    )
    let outStandingTax = PaymentMethods.findRemainingTax(payment, remainingTax)
    this.setState({
      remainingPayment: remainingPayment,
      outStandingTax: outStandingTax,
      finalPrice: Math.ceil(finalPrice),
    })
  }

  checkLeadClosureReasons = (lead) => {
    const { payment, unit, paidProject, downPayment, installmentDue } = lead
    const { externalProject } = paidProject
    if (!unit) {
      return
    }
    let fullPaymentDiscount = PaymentHelper.findPaymentPlanDiscount(lead, unit)
    let discountAmount = ''
    if (unit.type !== 'pearl')
      discountAmount = PaymentMethods.findApprovedDiscountAmount(unit, unit.discount)
    else discountAmount = unit.discounted_price
    let finalPrice = PaymentMethods.findFinalPrice(
      0,
      unit,
      discountAmount,
      fullPaymentDiscount,
      unit.type === 'regular' ? false : true
    )
    let { remainingPayment, remainingTax, clearedPayment } =
      PaymentMethods.findRemaningPaymentWithClearedStatus(payment, Math.ceil(finalPrice))
    let outStandingTax = PaymentMethods.findRemainingTaxWithClearedStatus(payment, remainingTax)
    if (
      (!externalProject && outStandingTax <= 0 && remainingPayment <= 0) ||
      (externalProject &&
        installmentDue !== 'full_payment' &&
        outStandingTax <= 0 &&
        clearedPayment >= Number(downPayment)) ||
      (externalProject &&
        installmentDue === 'full_payment' &&
        outStandingTax <= 0 &&
        remainingPayment <= 0)
    ) {
      this.setState({
        closedWon: true,
      })
    } else {
      this.setState({
        closedWon: false,
      })
    }
  }

  getAllProjects = () => {
    const { route, lead } = this.props
    axios
      .get(`/api/project/all`)
      .then((res) => {
        let projectArray = []
        res &&
          res.data.items.map((item, index) => {
            return projectArray.push({ value: item.id, name: item.name })
          })

        this.setState(
          {
            pickerProjects: projectArray,
            allProjects: res.data.items,
          },
          () =>
            lead.status == 'open' &&
            route.params &&
            route.params.unitData &&
            this.getUnits(route.params.unitData.projectId, route.params.unitData.floorId)
        )
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
    let url = ``
    if (floorId == '') {
      url = `/api/project/shops?projectId=${projectId}&status=Available,Hold&resaleType=fresh,resale&offset=0&all=true&type[]=available for pearls&type[]=regular`
    } else {
      url = `/api/project/shops?projectId=${projectId}&floorId=${floorId}&status=Available,Hold&resaleType=fresh,resale&offset=0&all=true&type[]=available for pearls&type[]=regular`
    }
    axios
      .get(url)
      .then((res) => {
        let array = []
        res &&
          res.data.rows.map((item, index) => {
            return array.push({
              value: item.id,
              name: item.saleType === 'resale' ? item.name + ' - Resale' : item.name,
            })
          })
        this.setState(
          {
            pickerUnits: array,
            allUnits: res.data.rows,
          },
          () => {
            const { allProjects } = this.state
            let currentProject = _.find(allProjects, function (item) {
              return item.id === projectId
            })
            this.generateUnitsTableData(currentProject)
          }
        )
      })
      .catch((error) => {
        console.log('/api/project/shops?projectId & floorId & status & type - Error', error)
      })
  }

  generateUnitsTableData = (project) => {
    const { allUnits } = this.state
    let headerTitle = ['Unit', 'Unit Type']
    let otherTitles = ['Size(Sqft)', 'Rate/Sqft', 'Unit Price', 'Image']
    let projectKeys = []
    let tableData = []
    let projectOptionalFields = JSON.parse(project && project.optional_fields) || []
    projectOptionalFields.map((item, index) => {
      headerTitle.push(item.fieldName)
      projectKeys.push(item.fieldName)
    })
    this.setState({ tableDataLoading: true }, () => {
      allUnits &&
        allUnits.map((item) => {
          let oneRow = []
          oneRow.push(item.name)
          oneRow.push(item.unitType)
          const { optional_fields } = item
          let unitOptionalFields = JSON.parse(optional_fields)
          projectKeys &&
            projectKeys.length &&
            projectKeys.map((key) => {
              unitOptionalFields[key] && oneRow.push(unitOptionalFields[key].data)
            })
          oneRow.push(item.area)
          oneRow.push(item.rate_per_sqft)
          oneRow.push(PaymentMethods.findUnitPrice(item))
          oneRow.push('---')
          tableData.push(oneRow)
        })
      otherTitles.map((item) => {
        headerTitle.push(item)
      })
      this.setState({
        tableHeaderTitle: headerTitle,
        tableData: tableData,
        tableDataLoading: false,
      })
    })
  }

  // **************** Check Lead Close *******************
  closedLead = () => {
    const { lead, user } = this.props
    this.state.checkLeadClosedOrNot === true && helper.leadClosedToast()
    lead.assigned_to_armsuser_id != user.id && helper.leadNotAssignedToast()
  }

  // **************** Bottom Nav Functions Start *******************
  goToAttachments = (purpose) => {
    const { navigation, route, lead } = this.props
    navigation.navigate('LeadAttachments', { cmLeadId: lead.id, workflow: 'cm', purpose: purpose })
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
    dispatch(
      setCMPayment({
        ...CMPayment,
        visible: visible,
        paymentType: paymentType,
        paymentCategory: paymentType,
      })
    )
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
    const { allLeadsData } = this.state
    const { CMPayment, dispatch, lead, addInstrument } = this.props
    const newSecondFormData = {
      ...CMPayment,
      visible: name == 'rentMonth' ? true : CMPayment.visible,
    }
    if (name === 'type' && value !== 'Rent Adjustment') {
      delete newSecondFormData['rentAdjLeadID']
      delete newSecondFormData['rentMonth']
    }
    if (name === 'type' && value !== 'Inter-mall Adjustment') {
      delete newSecondFormData['adjustedRefNo']
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

    if (name === 'rentAdjLeadID') {
      const leadSelected = allLeadsData.filter((item) => {
        if (item.id == value) return item
      })

      this.setState({ setLeadDetail: leadSelected })
    }

    if (name === 'type' && value === 'Rent Adjustment') {
      const url = `/api/leads/projects?leadsByUser=${lead.assigned_to_armsuser_id}&web=true&hasBooking=true`
      axios.get(url).then((res) => {
        const haveLeads = res.data.rows.map((item) => {
          return { value: item.id, name: item.id }
        })

        this.setState({ allLeads: haveLeads, allLeadsData: res.data.rows })
      })
    }
    this.setState({ buyerNotZero: false })
    dispatch(setCMPayment(newSecondFormData))
  }

  showPicker = () => {
    const { startYear, endYear, selectedYear, selectedMonth } = this.state
    const { CMPayment, dispatch } = this.props

    const newSecondFormData = {
      ...CMPayment,
      visible: false,
    }
    dispatch(setCMPayment(newSecondFormData))

    this.picker
      .show({ startYear, endYear, selectedYear, selectedMonth })
      .then(({ year, month }) => {
        this.setState(
          {
            selectedYear: year,
            selectedMonth: month,
          },
          () => {
            const rentMonthDate = moment(`01-${month + 1}-${year}`, 'DD-MM-YYYY').format()

            this.handleCommissionChange(rentMonthDate, 'rentMonth')
          }
        )
      })
  }

  handleInstrumentInfoChange = (value, name) => {
    const { addInstrument, dispatch, instruments } = this.props
    const copyInstrument = { ...addInstrument }
    if (name === 'instrumentNumber') {
      copyInstrument.instrumentNo = value
      this.setState({ isPrimary: true })
    } else if (name === 'instrumentNumberPicker') {
      const instrument = instruments.find((item) => item.id === value)
      copyInstrument.instrumentNo = instrument.instrumentNo
      copyInstrument.instrumentAmount = instrument.instrumentAmount
      copyInstrument.id = instrument.id
      copyInstrument.editable = false
      this.setState({ isPrimary: false })
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
      officeLocationId: this.setDefaultOfficeLocation(),
      instrumentDuplicateError: null,
    }
    dispatch(setCMPayment({ ...newData }))
    this.setState({
      modalValidation: false,
      addPaymentLoading: false,
      editable: false,
      totalReportPrice: 0,
      assignToAccountsLoading: false,
    })
  }
  goToHistory = () => {
    const { callModal } = this.state
    this.setState({ callModal: !callModal })
  }

  getCallHistory = () => {
    const { lead } = this.props
    axios.get(`/api/leads/tasks?cmLeadId=${lead.id}`).then((res) => {
      this.setState({ meetings: res.data })
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
    const { dispatch, user, lead, CMPayment } = this.props
    const { officeLocations } = this.state
    let locationId =
      payment && payment.officeLocationId
        ? payment.officeLocationId
        : user && user.officeLocation
        ? user.officeLocation.id
        : null
    if (officeLocations[0] && officeLocations.length === 1) {
      locationId = officeLocations[0].value
    }
    dispatch(
      setCMPayment({
        ...payment,
        visible: true,
        officeLocationId: locationId,
        paymentType: payment.paymentCategory ? payment.paymentCategory : '',
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

  setDefaultOfficeLocation = () => {
    let defaultOfficeLocation = null
    const { CMPayment, user, lead, dispatch } = this.props
    const { officeLocations } = this.state
    if (lead.project && lead.project.externalProject === true && officeLocations) {
      defaultOfficeLocation = officeLocations[0] && officeLocations[0]?.value
    } else {
      defaultOfficeLocation = user.officeLocationId
    }
    dispatch(setCMPayment({ ...CMPayment, officeLocationId: defaultOfficeLocation }))
    return defaultOfficeLocation
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
      CMPayment.type &&
      CMPayment.type == 'Rent Adjustment' &&
      (CMPayment.rentAdjLeadID == null ||
        CMPayment.rentAdjLeadID == undefined ||
        CMPayment.rentMonth == '' ||
        CMPayment.rentMonth == undefined)
    ) {
      this.setState({
        modalValidation: true,
      })
    } else if (
      CMPayment.type &&
      CMPayment.type == 'Inter-Mall Adjustment' &&
      (CMPayment.adjustedRefNo == '' || CMPayment.adjustedRefNo == undefined)
    ) {
      this.setState({
        modalValidation: true,
      })
    } else if (
      CMPayment.type &&
      CMPayment.type == 'Rebate Adjustment' &&
      (CMPayment.paymentAttachments.length == 0 ||
        CMPayment.paymentAttachments === null ||
        CMPayment.paymentAttachments == undefined)
    ) {
      this.setState({
        modalValidation: true,
      }) //For Rebate Adjustment
    } else if (
      CMPayment.type &&
      CMPayment.type == 'asset_adjustment' &&
      (CMPayment.assetAdjDetails == '' || CMPayment.assetAdjDetails == undefined)
    ) {
      this.setState({
        modalValidation: true,
      })
    } else {
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
        let body = {}

        if (editable === false) {
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
  }

  addCMPayment = (body) => {
    const { CMPayment, user, lead, dispatch, addInstrument } = this.props

    body.paymentCategory = CMPayment.paymentType
    body.officeLocationId = this.setDefaultOfficeLocation()
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
            this.fetchLead(lead)
            helper.successToast('Payment Added')
          }
        }
      })
      .catch((error) => {
        console.log('Error: ', error)
        helper.errorToast('Error Adding Payment')
      })
      .finally(() => {
        this.clearReduxAndStateValues()
        dispatch(clearInstrumentInformation())
      })
  }

  updateCMPayment = (body) => {
    const { CMPayment, lead, dispatch } = this.props
    body.paymentCategory = CMPayment.paymentType
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
          helper.successToast('Payment Updated')
        }
      })
      .catch((error) => {
        helper.errorToast('Error Updating Payment', error)
        console.log('error: ', error)
      })
      .finally(() => {
        this.clearReduxAndStateValues()
        dispatch(clearInstrumentInformation())
      })
  }

  addEditCMInstrumentOnServer = (isCMEdit = false) => {
    let body = {}
    const { addInstrument, CMPayment, lead, user, dispatch } = this.props
    const { isPrimary } = this.state
    if (addInstrument.id) {
      // selected existing instrument // add mode
      body = {
        ...CMPayment,
        cmLeadId: lead.id,
        armsUserId: user.id,
        installmentAmount: CMPayment.installmentAmount,
        instrumentId: addInstrument.id,
        isPrimary,
      }

      if (isCMEdit) this.updateCMPayment(body)
      else this.addCMPayment(body)
    } else {
      // add mode // new instrument info
      axios
        .post(`api/leads/instruments`, addInstrument)
        .then((res) => {
          if (res && res.data) {
            if (res.data.status === false) {
              dispatch(
                setCMPayment({
                  ...CMPayment,
                  instrumentDuplicateError: res.data.message,
                })
              )
              this.setState({ addPaymentLoading: false, assignToAccountsLoading: false })
              return
            }
            body = {
              ...CMPayment,
              cmLeadId: lead.id,
              armsUserId: user.id,
              addedBy: 'buyer',
              installmentAmount: CMPayment.installmentAmount,
              instrumentId: res.data.id,
              isPrimary,
            }
            if (isCMEdit) this.updateCMPayment(body)
            else this.addCMPayment(body)
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
    const { route } = this.props
    const { firstFormData } = this.state
    const { checkPaymentPlan, firstForm } = this.state
    const { cmProgressBar } = StaticData
    const { paidProject, project } = lead
    if (firstForm) {
      let projectID = paidProject && paidProject.id ? paidProject.id : project && project.id
      if ((paidProject && paidProject.id) || (project && project.id)) {
        this.getFloors(projectID)
        this.getSites(projectID)
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
    newcheckPaymentPlan['rental'] =
      lead.paidProject != null && lead.paidProject.rent_available === 'yes' ? true : false
    this.setState(
      {
        checkPaymentPlan: newcheckPaymentPlan,
        firstFormData,
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

  getSites = (projectId) => {
    axios
      .get(`/api/leads/getProjectSites?projectId=${projectId}`)
      .then((res) => {
        this.setState({ siteData: res.data })
      })
      .catch((err) => console.log(err))
  }

  handleFirstForm = (value, name) => {
    const {
      firstFormData,
      allFloors,
      unitPearlDetailsData,
      oneUnitData,
      pearlUnit,
      finalPrice,
      pearlUnitPrice,
      oneProductData,
      projectProducts,
      showInstallmentFields,
      pickerProjects,
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
    let discountedAmount = null
    let downPaymentValue = null
    let possessionChargesValue = null

    if (name === 'project') {
      const { allProjects } = this.state
      const parkingObj = this.getParkingDetails(allProjects, value)
      this.getSites(value)
      newData['parkingCharges'] =
        parkingObj?.parkingCharges !== null && parkingObj?.parkingCharges !== ''
          ? parkingObj?.parkingCharges
          : 0
      newData['parkingAvailable'] = parkingObj.parkingAvailable.toLowerCase()
      newData['projectSiteId'] = null
      this.changeProject(value)
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
      newData['projectName'] = _.find(pickerProjects, (item) => {
        return item.value === newData.project
      }).name
      newData['floorName'] = oneFloor.name
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
      oneUnit = this.fetchOneUnit(value[0])
      if (noProduct) {
        newData['approvedDiscount'] = PaymentHelper.handleEmptyValue(oneUnit.discount)
        newData['approvedDiscountPrice'] = PaymentMethods.findDiscountAmount(oneUnit)
      }
      newData['pearl'] = null
      value = oneUnit.id
      newData['unitName'] = oneUnit.name
      newData['perUnitType'] = oneUnit.unitType
      this.fetchProducts(lead)
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
      value ? this.validateCnic(value) : null
    }
    if (name === 'pearl') {
      this.pearlCalculations(oneFloor, value)
      if (oneUnit) {
        if (copyPearlUnit) oneUnit = PaymentHelper.createPearlObject(oneFloor, value)
        newData['finalPrice'] = Math.ceil(
          PaymentMethods.findFinalPrice(
            newData['parkingAvailable'] === 'yes' &&
              newData['parkingCharges'] != '' &&
              newData['parkingCharges'] != null
              ? newData['parkingCharges']
              : 0,
            oneUnit,
            newData['approvedDiscountPrice'],
            newData['fullPaymentDiscountPrice'],
            true
          )
        )
      }
    }
    newData[name] = value
    if (
      name === 'productId' ||
      name === 'parkingAvailable' ||
      name === 'approvedDiscount' ||
      name === 'approvedDiscountPrice'
    ) {
      // set default values for product here
      const { allProjects } = this.state
      const parkingObj = this.getParkingDetails(allProjects, firstFormData.project)
      if (name === 'parkingAvailable') {
        newData['parkingAvailable'] = value
        newData['parkingCharges'] =
          parkingObj?.parkingCharges !== null && parkingObj?.parkingCharges !== ''
            ? parkingObj?.parkingCharges
            : 0
      }

      if (
        name === 'parkingAvailable' ||
        name === 'approvedDiscount' ||
        name === 'approvedDiscountPrice'
      ) {
        oneProduct = _.find(projectProducts, (item) => {
          return item.projectProductId === newData['productId']
        })
      } else {
        oneProduct = _.find(projectProducts, (item) => {
          return item.projectProductId === value
        })
      }

      if (name === 'approvedDiscount' || name === 'approvedDiscountPrice') {
        if (name === 'approvedDiscount') {
          if (copyPearlUnit) oneUnit = PaymentHelper.createPearlObject(oneFloor, newData['pearl'])
          if (Number(value) > 100) return
          newData['approvedDiscountPrice'] = PaymentMethods.findApprovedDiscountAmount(
            oneUnit,
            value
          )
        } else {
          if (copyPearlUnit) oneUnit = PaymentHelper.createPearlObject(oneFloor, newData['pearl'])
          value = value.replace(/,/g, '')
          newData['approvedDiscount'] = PaymentMethods.findApprovedDiscountPercentage(
            oneUnit,
            value
          )
        }
      } else {
        discountedAmount = PaymentMethods.findProductDiscountAmount(oneUnit, oneProduct)

        newData['approvedDiscount'] = PaymentHelper.handleEmptyValue(
          oneProduct.projectProduct.discount
        )

        if (copyPearlUnit) oneUnit = PaymentHelper.createPearlObject(oneFloor, newData['pearl'])
        newData['approvedDiscountPrice'] = discountedAmount
      }

      if (oneUnit) {
        if (copyPearlUnit) oneUnit = PaymentHelper.createPearlObject(oneFloor, newData['pearl'])
        newData['finalPrice'] = Math.ceil(
          PaymentMethods.findFinalPrice(
            newData['parkingAvailable'] === 'yes' &&
              newData['parkingCharges'] != '' &&
              newData['parkingCharges'] != null
              ? newData['parkingCharges']
              : 0,
            oneUnit,
            newData['approvedDiscountPrice'],
            newData['fullPaymentDiscountPrice'],
            copyPearlUnit ? true : false
          )
        )
      }

      if (name === 'productId') {
        newData['noOfInstallment'] = PaymentHelper.handleEmptyValue(
          oneProduct.projectProduct.noInstallmentsMin
        )
        newData['installmentFrequency'] = PaymentHelper.handleEmptyValue(
          oneProduct.projectProduct.installmentFrequencyMin
        )

        downPaymentValue = PaymentMethods.calculateDownPayment(
          { ...oneProduct.projectProduct, downPayment: oneProduct.projectProduct.downPaymentMin },
          newData.finalPrice, // final price including discount
          0
        )

        newData['downPayment'] = downPaymentValue

        newData['downPaymentPercentage'] = PaymentHelper.handleEmptyValue(
          oneProduct.projectProduct.downPaymentMin
        )

        newData['possessionCharges'] = PaymentMethods.calculatePossessionCharges(
          {
            ...oneProduct.projectProduct,
            possessionCharges: oneProduct.projectProduct.possessionChargesMin,
          },
          newData.finalPrice, // final price including discount
          0
        )
        newData['possessionChargesPercentage'] = PaymentHelper.handleEmptyValue(
          oneProduct.projectProduct.possessionChargesMin
        )
        newShowInstallmentFields = PaymentHelper.setProductPaymentPlan(oneProduct)
        newData.paymentPlan = oneProduct.projectProduct.paymentPlan
      }
    }

    if (name === 'downPaymentPercentage') {
      downPaymentValue = PaymentMethods.calculateDownPayment(
        { ...oneProductData.projectProduct, downPayment: value },
        newData.finalPrice, // final price including discount
        0
      )
      newData['downPayment'] = downPaymentValue
      newData['downPaymentPercentage'] = value
    }

    if (name === 'downPayment') {
      newData['downPayment'] = value
      newData['downPaymentPercentage'] = PaymentMethods.calculateDownPaymentPercentage(
        newData.finalPrice, // final price including discount
        value,
        0
      )
    }

    if (name === 'possessionChargesPercentage') {
      possessionChargesValue = PaymentMethods.calculatePossessionCharges(
        { ...oneProductData.projectProduct, possessionCharges: value },
        newData.finalPrice, // final price including discount
        0
      )
      newData['possessionCharges'] = possessionChargesValue
      newData['possessionChargesPercentage'] = value
    }

    if (name === 'possessionCharges') {
      newData['possessionCharges'] = value
      newData['possessionChargesPercentage'] = PaymentMethods.calculatePossessionChargesPercentage(
        newData.finalPrice, // final price including discount
        value,
        0
      )
    }

    this.setState(
      {
        firstFormData: { ...newData },
        unitPearlDetailsData: { ...oneFloor },
        oneUnitData: copyPearlUnit ? { ...oneFloor } : { ...oneUnit },
        pearlUnit: copyPearlUnit,
        oneProductData: oneProduct,
        showInstallmentFields: newShowInstallmentFields,
        toggleUnitsTable: false,
      },
      () => {
        //console.log('firstForm', this.state.firstFormData)
      }
    )
  }

  getParkingDetails = (allProjects, value) => {
    let parkingObj
    allProjects.map((project) => {
      if (project.id == value) {
        parkingObj = {
          parkingAvailable: project.parkingAvailable,
          parkingCharges: project.parkingCharges,
        }
        return parkingObj
      }
    })
    return parkingObj
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
    axios
      .patch(`/api/leads/project`, body, { params: { id: leadId } })
      .then((res) => {
        this.fetchLead()
      })
      .catch((err) => console.log(`/api/leads/project`, body, { params: { id: leadId } }))
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
        return item.name == unit && item
      })
    }
    return oneUnit
  }

  validateCnic = (value) => {
    if (value.length < 7 || (value.length > 8 && value.length < 13 && value !== ''))
      this.setState({ cnicValidate: true, cnicEditable: true })
    else this.setState({ cnicValidate: false })
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
    if (
      firstFormData.possessionChargesPercentage &&
      firstFormData.downPaymentPercentage &&
      Number(firstFormData.possessionChargesPercentage) +
        Number(firstFormData.downPaymentPercentage) >
        100
    ) {
      alert('Sum of Down Payment and Posession Charges cannot be greater than Final Price')
      return
    }

    if (!noProduct && firstFormData.paymentPlan === 'no') firstFormData.paymentPlan = null
    const validationValues = PaymentHelper.firstFormValidation(
      lead,
      firstFormData,
      cnicValidate,
      leftPearlSqft,
      unitPearlDetailsData,
      checkFirstFormPayment
    )
    if (status === 'confirmation') {
      this.setState({
        firstFormValidate: validationValues.firstFormValidate,
        openFirstScreenModal: validationValues.openFirstScreenModal,
      })
    }
    if (status === 'schedulePayment') {
      this.setState(
        {
          firstFormValidate: validationValues.firstFormValidate,
          openFirstScreenModal: false,
        },
        () => {
          if (validationValues.openFirstScreenModal) this.toggleSchedulePayment()
        }
      )
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
    if (firstFormData.unitType === 'pearl') {
      let pearlBody = PaymentHelper.createPearl({
        firstFormData,
        pearlUnitPrice,
        unitPearlDetailsData,
        lead,
        user,
      })
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
    const { firstFormData, oneProductData, isPrimary, selectedClient } = this.state
    let body = noProduct
      ? PaymentHelper.generateApiPayload(
          firstFormData,
          lead,
          unitId,
          CMPayment,
          addInstrument,
          isPrimary,
          selectedClient
        )
      : PaymentHelper.generateProductApiPayload(
          firstFormData,
          lead,
          unitId,
          CMPayment,
          oneProductData,
          addInstrument,
          isPrimary,
          selectedClient
        )
    let leadId = []
    body.officeLocationId = this.setDefaultOfficeLocation()
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

  handleOfficeLocation = (value) => {
    const { CMPayment, dispatch } = this.props
    dispatch(setCMPayment({ ...CMPayment, officeLocationId: value }))
  }

  //  ************ SCHEDULE OF PAYMENT WORKFLOW **************
  toggleSchedulePayment = () => {
    const { showSchedule, firstFormData } = this.state
    if (
      firstFormData.possessionChargesPercentage &&
      firstFormData.downPaymentPercentage &&
      Number(firstFormData.possessionChargesPercentage) +
        Number(firstFormData.downPaymentPercentage) >
        100
    ) {
      alert('Sum of Down Payment and Posession Charges cannot be greater than Final Price')
      return
    }
    if (!showSchedule) this.fetchScheduleData()
    this.setState({
      showSchedule: !showSchedule,
    })
  }

  fetchScheduleData = () => {
    const { lead, CMPayment, addInstrument, user } = this.props
    const {
      firstFormData,
      oneProductData,
      secondForm,
      pearlUnitPrice,
      unitPearlDetailsData,
      selectedClient,
      isPrimary,
    } = this.state
    if (secondForm) {
      axios
        .get(`/api/leads/paymentSchedule?leadId=${lead.id}`)
        .then((res) => {
          this.setState({
            SchedulePaymentData: res.data,
            downPayment: lead.downPayment,
            possessionCharges: lead.possession_charges,
            downPaymenTime: lead.downPaymenTime,
          })
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      let body = {}
      let downPayment = 0
      let possessionCharges = 0
      if (firstFormData.unitType === 'pearl') {
        body = PaymentHelper.createPearlSchedule(
          lead,
          user,
          firstFormData,
          pearlUnitPrice,
          unitPearlDetailsData,
          oneProductData,
          CMPayment,
          selectedClient,
          addInstrument,
          isPrimary
        )
        downPayment = body.down_payment
        possessionCharges = body.possession_charges
      } else {
        let unitId =
          firstFormData.unit === null || firstFormData.unit === '' || firstFormData.unit === 'no'
            ? null
            : firstFormData.unit

        body = PaymentHelper.generateProductApiPayload(
          firstFormData,
          lead,
          unitId,
          CMPayment,
          oneProductData,
          addInstrument,
          isPrimary,
          selectedClient
        )
      }
      let leadId = []
      leadId.push(lead.id)
      axios
        .post(`/api/leads/diplaySchedule?leadId=${lead.id}`, body)
        .then((res) => {
          this.setState({
            SchedulePaymentData: helper.addID(res.data),
            downPayment: firstFormData.downPayment,
            possessionCharges: firstFormData.possessionCharges,
          })
        })
        .catch((error) => {
          console.log(`/api/leads/diplaySchedule?leadId=${lead.id} - Error`, error)
          helper.errorToast('Something went wrong!!')
        })
    }
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

  openUnitsTable = () => {
    const { toggleUnitsTable } = this.state
    this.setState({
      toggleUnitsTable: !toggleUnitsTable,
    })
  }

  generateKFI = () => {
    const { lead } = this.props
    let templateData = PaymentHelper.generateKFIPayload(lead)
    helper.warningToast('Downloading KFI Document!')
    axios
      .post(`/api/leads/KFIReport?leadId=${lead.id}`, templateData, {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/pdf',
        },
      })
      .then((res) => {
        let buff = Buffer.from(res.data, 'base64')
        let doc = {
          fileType: 'application/pdf',
          fileName: 'KFIDocument',
        }
        this.downloadBufferFile(buff.toString('base64'), doc)
      })
      .catch((error) => {
        console.log('error----->', error)
      })
  }

  downloadBufferFile = async (buff, doc) => {
    let fileUri = FileSystem.documentDirectory + `${doc.fileName}.pdf`
    FileSystem.writeAsStringAsync(fileUri, buff, { encoding: FileSystem.EncodingType.Base64 })
      .then((uri) => {
        FileSystem.getInfoAsync(fileUri).then((res) => {
          this.saveFile(res.uri, doc)
        })
      })
      .catch((error) => {
        helper.errorToast('ERROR: Downloading File')
        console.error('downloadBufferFile: ', error)
      })
  }

  saveFile = async (fileUri, doc) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (status === 'granted') {
      const asset = await MediaLibrary.createAssetAsync(fileUri)
      MediaLibrary.createAlbumAsync('ARMS', asset, false).then((res) => {
        FileSystem.getContentUriAsync(fileUri).then((cUri) => {
          if (
            doc.fileType.includes('jpg') ||
            doc.fileType.includes('png') ||
            doc.fileType.includes('jpeg')
          ) {
            this.setState({
              showWebView: true,
              webView: cUri,
              showDoc: true,
            })
          } else {
            let fileType = doc.fileType
            if (doc.fileType.includes('pdf')) fileType = 'application/pdf'
            else fileType = doc.fileType
            IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
              data: cUri,
              flags: 1,
              type: fileType,
            })
          }
        })
      })
      helper.successToast('File Downloaded!')
    }
  }

  readPermission = () => {
    const { permissions } = this.props
    return getPermissionValue(PermissionFeatures.PROJECT_LEADS, PermissionActions.READ, permissions)
  }

  updatePermission = () => {
    const { permissions } = this.props
    return getPermissionValue(
      PermissionFeatures.PROJECT_LEADS,
      PermissionActions.UPDATE,
      permissions
    )
  }

  openModalInFollowupMode = (value) => {
    const { navigation, lead } = this.props

    navigation.navigate('ScheduledTasks', {
      // lead,
      // rcmLeadId: lead ? lead.id : null,
      lead: lead,
      purposeTab: 'invest',
      screen: 'InvestLeads',
      cmLeadId: lead.id,
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
      allProjects,
      allFloors,
      allUnits,
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
      assignToAccountsLoading,
      officeLocations,
      active,
      statusfeedbackModalVisible,
      closedWon,
      modalMode,
      isFollowUpMode,
      projectProducts,
      productsPickerData,
      productDetailModal,
      oneProductData,
      showInstallmentFields,
      installmentFrequency,
      comment,
      showSchedule,
      SchedulePaymentData,
      downPayment,
      possessionCharges,
      downPaymenTime,
      accountPhoneNumbers,
      accountsLoading,
      isMultiPhoneModalVisible,
      newActionModal,
      toggleUnitsTable,
      tableHeaderTitle,
      tableData,
      checkValidation,
      selectedClient,
      callModal,
      meetings,
      allLeads,
      setLeadDetail,
      selectedMonth,
      selectedYear,
      siteData,
      tableDataLoading,
    } = this.state
    const { lead, navigation, contacts, route, CMPayment, dispatch } = this.props
    const { screenName } = this.props.route.params
    let readPermission = this.readPermission()
    let updatePermission = this.updatePermission()
    return (
      <View style={{ flex: 1 }}>
        <ProgressBar
          style={{ backgroundColor: '#ffffff' }}
          progress={progressValue}
          color={'#0277FD'}
        />

        <MonthPicker
          ref={(picker) => (this.picker = picker)}
          CMPayment={CMPayment}
          dispatch={dispatch}
        />

        <View style={{ flex: 1 }}>
          <AccountsPhoneNumbers
            toggleAccountPhone={this.toggleAccountPhone}
            isMultiPhoneModalVisible={isMultiPhoneModalVisible}
            contacts={accountPhoneNumbers}
            loading={accountsLoading}
            phoneContacts={contacts}
          />

          <BookingDetailsModal
            active={bookingModal}
            data={lead}
            formData={firstFormData}
            pearlModal={pearlUnit}
            toggleBookingDetailsModal={this.toggleBookingModal}
            openUnitDetailsModal={this.openUnitDetailsModal}
            finalPrice={finalPrice}
            generateKFI={this.generateKFI}
            navigation={navigation}
            clientName={firstFormData.clientName}
            updatePermission={updatePermission}
          />
          <SchedulePayment
            active={showSchedule}
            data={SchedulePaymentData}
            toggleSchedulePayment={this.toggleSchedulePayment}
            loading={false}
            downPayment={downPayment}
            possessionCharges={possessionCharges}
            downPaymenTime={downPaymenTime}
          />
          <UnitsTable
            tableHeaderTitle={tableHeaderTitle}
            tableData={tableData}
            active={toggleUnitsTable}
            data={tableData}
            toggleSchedulePayment={this.openUnitsTable}
            loading={false}
            downPayment={downPayment}
            possessionCharges={possessionCharges}
            downPaymenTime={downPaymenTime}
            selectUnit={this.selectUnitTable}
            handleFirstForm={this.handleFirstForm}
            formData={firstFormData}
            tableDataLoading={tableDataLoading}
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
              submitFirstForm={this.firstFormValidateModal}
              clientName={firstFormData.clientName}
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
            assignToAccounts={() => this.assignToAccounts()}
            officeLocations={officeLocations}
            handleOfficeLocationChange={this.handleOfficeLocation}
            assignToAccountsLoading={assignToAccountsLoading}
            handleInstrumentInfoChange={this.handleInstrumentInfoChange}
            AllAssignedLeads={allLeads}
            SelectedLeadDetails={setLeadDetail}
            months={this.months}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            showPicker={this.showPicker}
          />
          <DeleteModal
            isVisible={deletePaymentVisible}
            deletePayment={(reason) => this.deletePayment(reason)}
            showHideModal={(val) => this.showHideDeletePayment(val)}
          />
          <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView
              scrollEnabled={firstForm ? true : false}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ flex: 1, marginBottom: 45 }}>
                {firstForm && (
                  <CMFirstForm
                    allProjects={allProjects}
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
                    cnicEditable={cnicEditable}
                    leftPearlSqft={leftPearlSqft}
                    projectProducts={projectProducts}
                    productsPickerData={productsPickerData}
                    openProductDetailsModal={this.openProductDetailsModal}
                    showInstallmentFields={showInstallmentFields}
                    installmentFrequency={installmentFrequency}
                    lead={lead}
                    openUnitsTable={this.openUnitsTable}
                    checkValidation={checkValidation}
                    handleClientClick={this.handleClientClick}
                    updatePermission={updatePermission}
                    siteData={siteData}
                    oneProduct={
                      oneProductData && oneProductData.projectProduct
                        ? oneProductData.projectProduct
                        : null
                    }
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
                    toggleSchedulePayment={this.toggleSchedulePayment}
                    call={this.fetchPhoneNumbers}
                    updatePermission={updatePermission}
                  />
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          <HistoryModal
            getCallHistory={this.getCallHistory}
            navigation={navigation}
            data={meetings}
            closePopup={this.goToHistory}
            openPopup={callModal}
          />
          {secondForm && (
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
                goToFollowUp={(value) => this.openModalInFollowupMode(value)}
                goToRejectForm={this.goToRejectForm}
                closedWon={closedWon}
                showStatusFeedbackModal={(value, modalMode) =>
                  this.showStatusFeedbackModal(value, modalMode)
                }
                addMeeting={() => this.openModalInMeetingMode()}
                leadType={'CM'}
                navigation={navigation}
                customer={lead.customer}
                goToHistory={this.goToHistory}
                onHandleCloseLead={this.onHandleCloseLead}
                fetchLead={this.fetchLead}
                screenName={screenName}
                lead={lead}
                closeWonOptionVisibleFromInvest={true}
              />
            </View>
          )}
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
    contacts: store.contacts.contacts,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(CMPayment)
