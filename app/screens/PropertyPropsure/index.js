/** @format */

import axios from 'axios'
import * as DocumentPicker from 'expo-document-picker'
import * as React from 'react'
import { Alert, FlatList, Image, Linking, Text, TouchableOpacity, View } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { connect } from 'react-redux'
import _ from 'underscore'
import { setlead } from '../../actions/lead'
import AppStyles from '../../AppStyles'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import Loader from '../../components/loader'
import PropAgentTile from '../../components/PropAgentTile'
import PropertyBottomNav from '../../components/PropertyBottomNav'
import PropMatchTile from '../../components/PropMatchTile'
import PropsureDocumentPopup from '../../components/PropsureDocumentPopup/index'
import PropsureReportsPopup from '../../components/PropsureReportsPopup/index'
import PaymentMethods from '../../PaymentMethods'
import { setPropsurePayment } from '../../actions/propsurePayment'
import { setRCMPayment } from '../../actions/rcmPayment'
import config from '../../config'
import helper from '../../helper'
import StaticData from '../../StaticData'
import styles from './style'
import DeleteModal from '../../components/DeleteModal'
import { ActionSheet } from 'native-base'
import * as MediaLibrary from 'expo-media-library'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import AddPropsurePayment from '../../components/AddPRopsurePayment'
import MeetingFollowupModal from '../../components/MeetingFollowupModal'
import {
  clearInstrumentInformation,
  getInstrumentDetails,
  setInstrumentInformation,
} from '../../actions/addInstrument'

var BUTTONS = ['Delete', 'Cancel']
var CANCEL_INDEX = 1

class PropertyPropsure extends React.Component {
  constructor(props) {
    super(props)
    const { user, lead, permissions } = this.props
    this.state = {
      loading: true,
      open: false,
      isVisible: false,
      documentModalVisible: false,
      checkValidation: false,
      selectedReports: [],
      selectedPropertyId: null,
      selectedProperty: null,
      selectedPropsureId: null,
      pendingPropsures: [],
      matchData: [],
      progressValue: 0,
      // for the lead close dialog
      isCloseLeadVisible: false,
      checkReasonValidation: false,
      selectedReason: '',
      reasons: [],
      closedLeadEdit: helper.propertyCheckAssignedSharedStatus(user, lead, permissions),
      callModal: false,
      meetings: [],
      menuShow: false,
      totalReportPrice: 0,
      modalValidation: false,
      addPaymentLoading: false,
      propsureReportTypes: [],
      editable: false,
      deletePaymentVisible: false,
      assignToAccountsLoading: false,
      previousPayment: 0,
      selectedPayment: {},
      officeLocations: [],
      active: false,
      isFollowUpMode: false,
    }
  }

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params && this.props.route.params.isFromNotification) {
        const { lead } = this.props.route.params
        this.fetchLead(lead)
        this.fetchOfficeLocations()
        this.fetchProperties(lead)
        this.fetchPropsureReportsList()
      } else {
        const { lead, rcmPayment, dispatch } = this.props
        dispatch(setRCMPayment({ ...rcmPayment, visible: false }))
        this.fetchLead(lead)
        this.fetchOfficeLocations()
        this.fetchProperties(lead)
        this.fetchPropsureReportsList()
      }
    })
  }

  componentWillUnmount() {
    this.clearReduxAndStateValues()
    this._unsubscribe()
  }

  fetchPropsureReportsList = () => {
    axios
      .get(`/api/inventory/listpropsureReports`)
      .then((res) => {
        let reports = helper.addFalse(res.data)
        this.setState({
          propsureReportTypes: reports,
        })
      })
      .catch((error) => {
        console.log(`ERROR: api/inventory/listpropsureReports: ${error}`)
      })
  }

  fetchProperties = (lead) => {
    const { rcmProgressBar } = StaticData
    let matches = []
    this.setState({ loading: true }, () => {
      axios
        .get(`/api/leads/${lead.id}/shortlist`)
        .then((res) => {
          matches = helper.propertyIdCheck(res.data.rows)
          this.setState({
            matchData: matches,
            progressValue: rcmProgressBar[lead.status],
          })
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.setState({
            loading: false,
            selectedPropertyId: null,
            selectedProperty: null,
            selectedReports: [],
            assignToAccountsLoading: false,
          })
        })
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

  fetchLead = (lead) => {
    axios
      .get(`api/leads/byid?id=${lead.id}`)
      .then((res) => {
        this.props.dispatch(setlead(res.data))
        this.setState({ assignToAccountsLoading: false })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  displayChecks = () => {}

  downloadFile = async (data) => {
    const { pendingPropsures } = this.state
    let pendingPropsuresCopy = []
    if (data.propsureDocs && data.propsureDocs.length) {
      let doc = data.propsureDocs[0]
      const uri = doc.document
      let fileUri = FileSystem.documentDirectory + doc.fileName
      FileSystem.downloadAsync(uri, fileUri)
        .then(({ uri }) => {
          this.saveFile(uri, doc)
          pendingPropsuresCopy = pendingPropsures.map((item) => {
            if (item.id === data.id) {
              item.showMsg = true
              return item
            } else {
              item.showMsg = false
              return item
            }
          })
          this.setState({ pendingPropsures: pendingPropsuresCopy })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  saveFile = async (fileUri, doc) => {
    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status === 'granted') {
      const asset = await MediaLibrary.createAssetAsync(fileUri)
      MediaLibrary.createAlbumAsync('ARMS', asset, false).then((res) => {
        helper.successToast('File Downloaded!')
        FileSystem.getContentUriAsync(fileUri).then((cUri) => {
          let fileType = doc.fileName.split('.').pop()
          if (fileType.includes('jpg') || fileType.includes('png') || fileType.includes('jpeg')) {
            this.setState({ showDoc: true, docUrl: doc.document, documentModalVisible: false })
          } else {
            if (fileType.includes('pdf')) fileType = 'application/pdf'
            else fileType = fileType
            IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
              data: cUri,
              flags: 1,
              type: fileType,
            })
          }
        })
      })
    }
  }

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

  closeModal = () => {
    const { propsureReportTypes } = this.state
    let reports = helper.addFalse(propsureReportTypes)
    this.setState({ isVisible: false, pendingPropsures: [], propsureReportTypes: reports })
  }

  showReportsModal = (property) => {
    const { lead, user, permissions } = this.props
    const leadAssignedSharedStatus = helper.propertyCheckAssignedSharedStatus(
      user,
      lead,
      permissions
    )
    this.setState({
      isVisible: true,
      selectedPropertyId: property.id,
      selectedProperty: property,
    })
  }

  onHandleRequestVerification = () => {
    const { lead } = this.props
    const { selectedReports, selectedPropertyId, selectedProperty, totalReportPrice } = this.state
    if (selectedReports.length === 0) {
      alert('Please select at least one report!')
    } else {
      // ********* Call Add Attachment API here :)
      this.closeModal()
      let reportIds = _.map(selectedReports, function (item) {
        return {
          id: item.id,
          fee: item.fee,
        }
      })
      const body = {
        packageName: _.pluck(selectedReports, 'title'),
        propertyId: selectedPropertyId,
        pId: selectedProperty.arms_id ? selectedProperty.arms_id : selectedProperty.graana_id,
        org: selectedProperty.arms_id ? 'arms' : 'graana',
        propsureIds: reportIds,
        outstandingPropsure: totalReportPrice,
        addedBy: 'seller',
      }
      axios
        .post(`/api/leads/propsure/${lead.id}`, body)
        .then((response) => {
          this.fetchLead(lead)
          this.fetchProperties(lead)
        })
        .catch((error) => {
          console.log(error)
          this.setState({ selectedPropertyId: null, selectedReports: [], selectedProperty: null })
        })
    }
  }

  showDocumentModal = (propsureReports, property) => {
    const { lead, user, dispatch, permissions } = this.props
    const leadAssignedSharedStatus = helper.propertyCheckAssignedSharedStatus(
      user,
      lead,
      permissions
    )
    let installment = property.cmInstallment
      ? property.cmInstallment
      : {
          installmentAmount: null,
          type: '',
          rcmLeadId: null,
          details: '',
          visible: false,
          paymentAttachments: [],
          selectedPropertyId: property.id,
        }
    dispatch(setPropsurePayment(installment))
    this.setState({
      documentModalVisible: true,
      pendingPropsures: propsureReports,
      checkValidation: false,
      selectedPropertyId: property.id,
      selectedProperty: property,
    })
  }

  closeDocumentModal = () => {
    this.setState({ documentModalVisible: false, file: null })
    this.onAddCommissionPayment()
  }

  closeDocument = () => {
    this.setState({ documentModalVisible: false })
  }

  onAddCommissionPayment = () => {
    const { dispatch, propsurePayment } = this.props
    dispatch(setPropsurePayment({ ...propsurePayment, visible: true }))
  }

  getAttachmentFromStorage = (id) => {
    const { pendingPropsures } = this.state
    const pendingPropsuresCopy = [...pendingPropsures]
    if (id) {
      let options = {
        type: '*/*',
        copyToCacheDirectory: false,
      }
      DocumentPicker.getDocumentAsync(options)
        .then((item) => {
          if (item.type === 'cancel') {
            Alert.alert('Pick File', 'Please pick a file from documents!')
            return
          }
          // const file = pendingPropsuresCopy.find(item => item.id === id, 0);
          const propsureDocument = _.find(pendingPropsuresCopy, (item) => item.id === id)
          if (propsureDocument) {
            // id matched, push the file in propsure doc array
            if (propsureDocument.propsureDocs && propsureDocument.propsureDocs.length > 0) {
              // document already exists so replace the existing file
              propsureDocument.propsureDocs[0] = item
            } else {
              // new document
              propsureDocument.propsureDocs.push(item)
            }
          }
          this.setState({ pendingPropsures: pendingPropsuresCopy })
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      console.log('error')
    }
  }

  uploadAttachment(file, propsureId) {
    const { pendingPropsures, lead } = this.state
    let pendingPropsuresCopy = [...pendingPropsures]
    pendingPropsuresCopy = pendingPropsuresCopy.map((item) =>
      item.id === propsureId ? { ...item, isLoading: true } : item
    )
    this.setState({ pendingPropsures: pendingPropsuresCopy }, () => {
      let document = {
        name: file.name,
        type: 'file/' + file.name.split('.').pop(),
        uri: file.uri,
      }
      let fd = new FormData()
      fd.append('file', document)
      axios
        .post(`api/leads/propsureDoc?id=${propsureId}`, fd)
        .then((response) => {
          if (response.data) {
            pendingPropsuresCopy = pendingPropsuresCopy.map((item) =>
              item.id === response.data.id ? { ...response.data, isLoading: false } : item
            )
          }
          this.setState({ pendingPropsures: pendingPropsuresCopy })
          this.fetchDocuments()
          this.fetchLead(lead)
        })
        .catch((error) => {
          console.log('error=>', error.message)
        })
    })
  }

  fetchDocuments = () => {
    const { lead } = this.props
    const { rcmProgressBar } = StaticData
    let matches = []
    axios
      .get(`/api/leads/${lead.id}/shortlist`)
      .then((res) => {
        matches = helper.propertyIdCheck(res.data.rows)
        this.setState({
          matchData: matches,
          progressValue: rcmProgressBar[lead.status],
        })
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.setState({
          selectedPropertyId: null,
          selectedProperty: null,
          selectedReports: [],
        })
      })
  }

  renderPropsureVerificationView = (item) => {
    const { lead, user } = this.props
    return (
      <TouchableOpacity
        // disabled={helper.isSellerOrBuyer(item, lead, user)}
        key={item.id.toString()}
        onPress={() => this.showReportsModal(item)}
        style={[styles.viewButtonStyle, { backgroundColor: AppStyles.bgcWhite.backgroundColor }]}
        activeOpacity={0.7}
      >
        <Text style={styles.propsureVerificationTextStyle}>PROPSURE VERIFICATION</Text>
      </TouchableOpacity>
    )
  }

  renderPropsurePendingView = (item) => {
    const { lead, user } = this.props
    let propsures = item.propsures.map((item) => ({ ...item, isLoading: false }))
    let status = helper.propsurePendingStatuses(item, 'seller')
    if (status !== 'VERIFIED') {
      return (
        <TouchableOpacity
          // disabled={helper.isSellerOrBuyer(item, lead, user)}
          style={[styles.viewButtonStyle, { backgroundColor: '#FCD12A' }]}
          activeOpacity={0.7}
          onPress={() => this.showDocumentModal(propsures, item)}
        >
          <Text style={[styles.propsureVerificationTextStyle, { color: '#fff' }]}>{status}</Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          style={[styles.viewButtonStyle, { backgroundColor: AppStyles.colors.primaryColor }]}
          activeOpacity={0.7}
          onPress={() => this.showDocumentModal(propsures, item)}
        >
          <Text style={[styles.propsureVerificationTextStyle, { color: '#fff' }]}>{status}</Text>
        </TouchableOpacity>
      )
    }
  }

  closedLead = () => {
    helper.leadClosedToast()
  }

  closeLead = () => {
    const { lead } = this.props
    if (lead.commissions && lead.commissions.status === StaticData.leadClearedStatus) {
      this.setState({
        reasons: StaticData.leadCloseReasonsWithPayment,
        isCloseLeadVisible: true,
        checkReasonValidation: '',
      })
    } else {
      this.setState({
        reasons: StaticData.leadCloseReasons,
        isCloseLeadVisible: true,
        checkReasonValidation: '',
      })
    }
  }

  onHandleCloseLead = () => {
    const { navigation, lead } = this.props
    const { selectedReason } = this.state
    let payload = Object.create({})
    payload.reasons = selectedReason
    if (selectedReason !== '') {
      var leadId = []
      leadId.push(lead.id)
      axios
        .patch(`/api/leads`, payload, { params: { id: leadId } })
        .then((response) => {
          this.setState({ isCloseLeadVisible: false }, () => {
            helper.successToast(`Lead Closed`)
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

  handleReasonChange = (value) => {
    this.setState({ selectedReason: value })
  }

  closeLeadModal = () => {
    this.setState({ isCloseLeadVisible: false })
  }

  goToDiaryForm = () => {
    const { lead, navigation, user } = this.props
    navigation.navigate('AddDiary', {
      update: false,
      agentId: user.id,
      rcmLeadId: lead.id,
      addedBy: 'self',
      screenName: 'Diary',
    })
  }

  addRemoveReport = (report) => {
    const { selectedReports, pendingPropsures } = this.state
    let reports = [...selectedReports]
    let totalReportPrice = 0
    if (report.addItem) return
    if (reports.some((item) => item.title === report.title)) {
      reports = _.without(reports, report)
      totalReportPrice = PaymentMethods.addPropsureReportPrices(reports, pendingPropsures)
    } else {
      reports.push(report)
      totalReportPrice = PaymentMethods.addPropsureReportPrices(reports, pendingPropsures)
    }
    this.setState({ selectedReports: reports, totalReportPrice: totalReportPrice })
  }

  goToAttachments = () => {
    const { lead, navigation } = this.props
    navigation.navigate('LeadAttachments', { rcmLeadId: lead.id, workflow: 'propertyLeads' })
  }

  goToComments = () => {
    const { lead, navigation } = this.props
    navigation.navigate('Comments', { rcmLeadId: lead.id })
  }

  navigateToDetails = () => {
    this.props.navigation.navigate('LeadDetail', {
      lead: this.props.lead,
      purposeTab: 'property',
      isFromLeadWorkflow: true,
      fromScreen: 'propsure',
    })
  }

  goToPropertyComments = (data) => {
    const { lead, navigation } = this.props
    this.toggleMenu(false, data.id)
    navigation.navigate('Comments', {
      propertyId: data.id,
      screenName: 'propsure',
      leadId: lead.id,
    })
  }

  toggleMenu = (val, id) => {
    const { matchData } = this.state
    let newMatches = matchData.map((item) => {
      if (item.id === id) {
        item.checkBox = val
        return item
      } else return item
    })
    this.setState({ matchData: newMatches })
  }

  addProperty = (data) => {
    this.redirectProperty(data)
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

  // <<<<<<<<<<<<<<<<<< Payment & Attachment Workflow Start >>>>>>>>>>>>>>>>>>

  showHideDeletePayment = (val) => {
    this.setState({ deletePaymentVisible: val, documentModalVisible: false })
  }

  deletePayment = async (reason) => {
    const { propsurePayment, lead } = this.props
    const { selectedPayment } = this.state
    this.showHideDeletePayment(false)
    const { propsureOutstandingPayment } = lead
    const { installmentAmount } = selectedPayment
    let totalPayment = Number(propsureOutstandingPayment) + Number(installmentAmount)
    let url = `/api/leads/deletePropsurePayment?id=${selectedPayment.id}&reason=${reason}&leadId=${lead.id}&outstandingPayment=${totalPayment}`
    const response = await axios.delete(url)
    if (response.data) {
      this.clearReduxAndStateValues()
      this.fetchLead(lead)
      this.fetchProperties(lead)
      helper.successToast(response.data)
    } else {
      helper.errorToast('ERROR DELETING PROPSURE PAYMENT!')
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
    const { propsurePayment, dispatch, navigation } = this.props
    dispatch(
      setPropsurePayment({
        ...propsurePayment,
        visible: false,
      })
    )
    navigation.navigate('PropsureAttachments')
  }

  setCommissionEditData = (data) => {
    const { dispatch, user, lead } = this.props
    this.setState({
      editable: true,
      documentModalVisible: false,
      previousPayment: data.installmentAmount,
    })

    dispatch(
      setPropsurePayment({
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

  handleCommissionChange = (value, name) => {
    const { propsurePayment, dispatch, lead, addInstrument } = this.props
    const newSecondFormData = {
      ...propsurePayment,
      visible: propsurePayment.visible,
    }
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
    this.s
    this.setState({ buyerNotZero: false })
    dispatch(setPropsurePayment(newSecondFormData))
  }

  handleInstrumentInfoChange = (value, name) => {
    const { addInstrument, dispatch, instruments } = this.props
    const copyInstrument = { ...addInstrument }
    if (name === 'instrumentNumber') {
      copyInstrument.instrumentNo = value
    } else if (name === 'instrumentNumberPicker') {
      const instrument = instruments.find((item) => item.instrumentNo === value)
      copyInstrument.instrumentNo = instrument.instrumentNo
      copyInstrument.instrumentAmount = instrument.instrumentAmount
      copyInstrument.id = instrument.id
      copyInstrument.editable = false
    } else if (name === 'instrumentAmount') copyInstrument.instrumentAmount = value

    dispatch(setInstrumentInformation(copyInstrument))
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
      assignToAccountsLoading: false,
      editable: false,
      totalReportPrice: 0,
    })
    dispatch(setPropsurePayment({ ...newData }))
  }

  onModalCloseClick = () => {
    this.clearReduxAndStateValues()
  }

  submitCommissionPropsurePayment = () => {
    const { propsurePayment, user, lead } = this.props
    const { editable, selectedProperty, previousPayment } = this.state
    const { propsureOutstandingPayment } = lead
    if (
      propsurePayment.installmentAmount != null &&
      propsurePayment.installmentAmount != '' &&
      propsurePayment.type != ''
    ) {
      this.setState({
        addPaymentLoading: true,
      })
      if (Number(propsurePayment.installmentAmount) <= 0) {
        this.setState({
          buyerNotZero: true,
          addPaymentLoading: false,
          assignToAccountsLoading: false,
        })
        return
      }
      if (editable === false) {
        let body = {}
        let outstandingPaymentCalc =
          Number(propsureOutstandingPayment) - Number(propsurePayment.installmentAmount)

        // for payment addition
        if (
          propsurePayment.type === 'cheque' ||
          propsurePayment.type === 'pay-Order' ||
          propsurePayment.type === 'bank-Transfer'
        ) {
          // for cheque,pay order and bank transfer
          let isValid = this.checkInstrumentValidation()
          if (isValid) {
            this.addEditPropsureInstrumentOnServer(false, outstandingPaymentCalc)
          }
        } else {
          // for all other types
          body = {
            ...propsurePayment,
            rcmLeadId: lead.id,
            armsUserId: user.id,
            outstandingPayment: outstandingPaymentCalc,
            addedBy: 'seller',
            amount: propsurePayment.installmentAmount,
            shortlistPropertyId: propsurePayment.selectedPropertyId,
          }
          delete body.visible
          delete body.installmentAmount
          delete body.selectedPropertyId
          delete body.paymentCategory
          this.addPropsurePayment(body)
        }
      } else {
        let remainingFee = Number(propsureOutstandingPayment) + Number(previousPayment)
        remainingFee = remainingFee - Number(propsurePayment.installmentAmount)
        let body = {}
        // payment update mode
        if (
          propsurePayment.type === 'cheque' ||
          propsurePayment.type === 'pay-Order' ||
          propsurePayment.type === 'bank-Transfer'
        ) {
          // for cheque,pay order and bank transfer
          let isValid = this.checkInstrumentValidation()
          if (isValid) {
            this.addEditPropsureInstrumentOnServer(true, remainingFee)
          }
        } else {
          // for all other types

          body = {
            ...propsurePayment,
            rcmLeadId: lead.id,
            armsUserId: user.id,
            outstandingPayment: remaingFee,
            addedBy: 'seller',
            installmentAmount: propsurePayment.installmentAmount,
            shortlistPropertyId: propsurePayment.selectedPropertyId,
          }
          delete body.visible
          delete body.remarks
          delete body.selectedPropertyId
          delete body.paymentCategory
          this.updatePropsurePayment(body)
        }
      }
    } else {
      // Installment amount or type is missing so validation goes true, show error
      this.setState({
        modalValidation: true,
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

  addPropsurePayment = (body) => {
    const { lead, propsurePayment, dispatch } = this.props
    axios
      .post(`/api/leads/propsurePayment`, body)
      .then((response) => {
        if (response.data) {
          // check if some attachment exists so upload that as well to server with payment id.
          if (propsurePayment.paymentAttachments.length > 0) {
            propsurePayment.paymentAttachments.map((paymentAttachment) =>
              // payment attachments
              this.uploadPaymentAttachment(paymentAttachment, response.data.id)
            )
          } else {
            this.fetchLead(lead)
            this.fetchProperties(lead)
            this.fetchPropsureReportsList()
            helper.successToast('Propsure Payment Added')
          }
        }
      })
      .catch((error) => {
        console.log('Error: ', error)
        helper.errorToast('Error Adding Propsure Payment')
      })
      .finally(() => {
        this.clearReduxAndStateValues()
        dispatch(clearInstrumentInformation())
      })
  }

  updatePropsurePayment = (body) => {
    const { propsurePayment, lead, dispatch } = this.props
    axios
      .patch(`/api/leads/project/payment?id=${body.id}`, body)
      .then((res) => {
        
        // upload only the new attachments that do not have id with them in object.
        const filterAttachmentsWithoutId = propsurePayment.paymentAttachments
          ? _.filter(propsurePayment.paymentAttachments, (item) => {
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
          this.fetchProperties(lead)
          this.fetchPropsureReportsList()
          helper.successToast('Propsure Payment Updated')
        }
      })
      .catch((error) => {
        helper.errorToast('Error Updating Propsure Payment', error)
      })
      .finally(() => {
        this.clearReduxAndStateValues()
        dispatch(clearInstrumentInformation())
      })
  }

  addEditPropsureInstrumentOnServer = (isPropsureEdit = false, outstandingPayment) => {
    let body = {}
    const { addInstrument, propsurePayment, dispatch, lead, user } = this.props
    if (addInstrument.id) {
      // selected existing instrument // add mode
      body = {
        ...propsurePayment,
        rcmLeadId: lead.id,
        armsUserId: user.id,
        outstandingPayment: outstandingPayment,
        addedBy: 'seller',
        amount: propsurePayment.installmentAmount,
        shortlistPropertyId: propsurePayment.selectedPropertyId,
        instrumentId: addInstrument.id,
      }
      delete body.visible
      delete body.installmentAmount
      delete body.selectedPropertyId
      delete body.paymentCategory
      if (isPropsureEdit) this.updatePropsurePayment(body)
      else this.addPropsurePayment(body)
    } else {
      // add mode // new instrument info
      axios
        .post(`api/leads/instruments`, addInstrument)
        .then((res) => {
          if (res && res.data) {
            body = {
              ...propsurePayment,
              rcmLeadId: lead.id,
              armsUserId: user.id,
              outstandingPayment: outstandingPayment,
              addedBy: 'seller',
              amount: propsurePayment.installmentAmount,
              shortlistPropertyId: propsurePayment.selectedPropertyId,
              instrumentId: res.data.id,
            }
            if (isPropsureEdit) this.updatePropsurePayment(body)
            else this.addPropsurePayment(body)
          }
        })
        .catch((error) => {
          console.log('Error: ', error)
        })
    }
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
            const { propsurePayment, dispatch } = this.props
            await dispatch(
              setPropsurePayment({ ...propsurePayment, visible: false, status: 'pendingAccount' })
            )
            this.setState({ assignToAccountsLoading: true }, () => {
              this.submitCommissionPropsurePayment()
            })
          },
        },
      ],
      { cancelable: false }
    )
  }

  handleOfficeLocation = (value) => {
    const { propsurePayment, dispatch } = this.props
    dispatch(setPropsurePayment({ ...propsurePayment, officeLocationId: value }))
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

  cancelPropsureRequest = async (data) => {
    const { lead } = this.props
    const { propsureOutstandingPayment } = lead
    if (data && data.propsures && data.propsures.length) {
      let pendingPropsures =
        data.propsures && data.propsures.length
          ? _.filter(
              data.propsures,
              (item) => item.status === 'pending' && item.addedBy === 'seller'
            )
          : null
      let totalFee = helper.AddPropsureReportsFee(pendingPropsures, 'seller')
      totalFee = Number(propsureOutstandingPayment) - Number(totalFee)
      let reportIds = _.pluck(pendingPropsures, 'id')
      let url = `/api/leads/deletePropsure?`
      let params = {
        id: reportIds,
        leadId: lead.id,
        outStandingPayment: totalFee,
      }
      const response = await axios.delete(url, {
        params: params,
      })
      if (response.data && response.data.message) {
        helper.warningToast(response.data.message)
      } else {
        this.clearReduxAndStateValues()
        this.fetchLead(lead)
        this.fetchProperties(lead)
        helper.successToast('PROPSURE CANCEL REQUEST SUCCESSFULL')
      }
    } else {
      helper.warningToast('NO PROPSURE REQUEST AVAILABLE!')
    }
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

  additionalRequest = () => {
    const { propsureReportTypes, pendingPropsures } = this.state
    let totalReportPrice = PaymentMethods.addPropsureReportPrices([], pendingPropsures)
    let newReports = helper.checkPropsureAdditionalReports(propsureReportTypes, pendingPropsures)
    this.setState({
      documentModalVisible: false,
      file: null,
      isVisible: true,
      propsureReportTypes: newReports,
      totalReportPrice: totalReportPrice,
    })
  }

  // <<<<<<<<<<<<<<<<<< Payment & Attachment Workflow End >>>>>>>>>>>>>>>>>>

  render() {
    const {
      menuShow,
      meetings,
      callModal,
      loading,
      matchData,
      isVisible,
      documentModalVisible,
      checkValidation,
      pendingPropsures,
      selectedReports,
      progressValue,
      reasons,
      selectedReason,
      isCloseLeadVisible,
      checkReasonValidation,
      closedLeadEdit,
      totalReportPrice,
      addPaymentLoading,
      modalValidation,
      buyerNotZero,
      selectedProperty,
      propsureReportTypes,
      deletePaymentVisible,
      active,
      isFollowUpMode,
      officeLocations,
      assignToAccountsLoading,
    } = this.state
    const { lead, navigation, user } = this.props

    return !loading ? (
      <View
        style={[
          AppStyles.container,
          { backgroundColor: AppStyles.colors.backgroundColor, paddingLeft: 0, paddingRight: 0 },
        ]}
      >
        <ProgressBar
          style={{ backgroundColor: 'ffffff' }}
          progress={progressValue}
          color={'#0277FD'}
        />
        <PropsureReportsPopup
          reports={propsureReportTypes}
          addRemoveReport={(item) => this.addRemoveReport(item)}
          selectedReports={selectedReports}
          isVisible={isVisible}
          closeModal={() => this.closeModal()}
          onPress={this.onHandleRequestVerification}
          totalReportPrice={totalReportPrice}
          type={'seller'}
        />
        <PropsureDocumentPopup
          pendingPropsures={_.clone(pendingPropsures)}
          isVisible={documentModalVisible}
          uploadReport={(report, propsureId) => this.uploadAttachment(report, propsureId)}
          closeModal={() => this.closeDocument()}
          onPress={() => this.closeDocumentModal()}
          downloadFile={this.downloadFile}
          getAttachmentFromStorage={this.getAttachmentFromStorage}
          propsureOutstandingPayment={lead.propsureOutstandingPayment}
          selectedProperty={selectedProperty}
          editable={this.setCommissionEditData}
          onPaymentLongPress={this.onPaymentLongPress}
          type={'seller'}
          additionalRequest={this.additionalRequest}
        />
        <AddPropsurePayment
          onModalCloseClick={this.onModalCloseClick}
          handleCommissionChange={this.handleCommissionChange}
          handleInstrumentInfoChange={this.handleInstrumentInfoChange}
          modalValidation={modalValidation}
          officeLocations={officeLocations}
          goToPayAttachments={() => this.goToPayAttachments(selectedProperty)}
          submitCommissionPayment={() => this.submitCommissionPropsurePayment()}
          assignToAccountsLoading={assignToAccountsLoading}
          addPaymentLoading={addPaymentLoading}
          assignToAccounts={this.assignToAccounts}
          lead={lead}
          paymentNotZero={buyerNotZero}
          handleOfficeLocationChange={this.handleOfficeLocation}
        />
        <DeleteModal
          isVisible={deletePaymentVisible}
          deletePayment={(reason) => this.deletePayment(reason)}
          showHideModal={(val) => this.showHideDeletePayment(val)}
        />
        <View style={{ paddingBottom: 100 }}>
          {matchData.length ? (
            <FlatList
              data={_.clone(matchData)}
              renderItem={(item, index) => (
                <View style={{ marginVertical: 3, marginHorizontal: 15 }}>
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
                      screen={'propsure'}
                      cancelPropsureRequest={this.cancelPropsureRequest}
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
                      screen={'propsure'}
                      cancelPropsureRequest={this.cancelPropsureRequest}
                    />
                  )}
                  <View>
                    {helper.checkPropsureRequests(item.item.propsures, 'seller')
                      ? this.renderPropsureVerificationView(item.item)
                      : this.renderPropsurePendingView(item.item)}
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => item.id.toString()}
            />
          ) : (
            <>
              <Image
                source={require('../../../assets/img/no-result-found.png')}
                resizeMode={'center'}
                style={{ alignSelf: 'center', width: 300, height: 300 }}
              />
            </>
          )}
        </View>
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
            // alreadyClosedLead={() => this.closedLead()}
            // closeLead={this.closeLead}
            // closedLeadEdit={closedLeadEdit}
            callButton={true}
            customer={lead.customer}
            lead={lead}
            goToHistory={() => null}
            getCallHistory={() => null}
            goToFollowup={() => this.openModalInFollowupMode()}
          />
        </View>
        <LeadRCMPaymentPopup
          reasons={reasons}
          selectedReason={selectedReason}
          changeReason={(value) => this.handleReasonChange(value)}
          checkValidation={checkReasonValidation}
          isVisible={isCloseLeadVisible}
          closeModal={() => this.closeLeadModal()}
          onPress={() => this.onHandleCloseLead()}
        />
      </View>
    ) : (
      <Loader loading={loading} />
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
    propsurePayment: store.PropsurePayment.PropsurePayment,
    rcmPayment: store.RCMPayment.RCMPayment,
    addInstrument: store.Instruments.addInstrument,
    instruments: store.Instruments.instruments,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(PropertyPropsure)
