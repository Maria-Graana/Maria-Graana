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
import AgentTile from '../../components/AgentTile/index'
import CMBottomNav from '../../components/CMBottomNav'
import HistoryModal from '../../components/HistoryModal/index'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import Loader from '../../components/loader'
import MatchTile from '../../components/MatchTile/index'
import PropsureDocumentPopup from '../../components/PropsureDocumentPopup/index'
import PropsureReportsPopup from '../../components/PropsureReportsPopup/index'
import config from '../../config'
import helper from '../../helper'
import StaticData from '../../StaticData'
import styles from './styles'
import * as MediaLibrary from 'expo-media-library'
import * as FileSystem from 'expo-file-system'
import * as Permissions from 'expo-permissions'
import * as IntentLauncher from 'expo-intent-launcher'
import ViewDocs from '../../components/ViewDocs'
import PaymentMethods from '../../PaymentMethods'
import { setPropsurePayment } from '../../actions/propsurePayment'
import { setRCMPayment } from '../../actions/rcmPayment'
import DeleteModal from '../../components/DeleteModal'
import { ActionSheet, StyleProvider } from 'native-base'
import AddPropsurePayment from '../../components/AddPRopsurePayment'
import formTheme from '../../../native-base-theme/variables/formTheme'
import getTheme from '../../../native-base-theme/components'
import FollowUpModal from '../../components/FollowUpModal'
import StatusFeedbackModal from '../../components/StatusFeedbackModal'

var BUTTONS = ['Delete', 'Cancel']
var CANCEL_INDEX = 1

class LeadPropsure extends React.Component {
  constructor(props) {
    super(props)
    const { user, lead } = this.props
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
      pendingPropsures: null,
      matchData: [],
      progressValue: 0,
      // for the lead close dialog
      isCloseLeadVisible: false,
      checkReasonValidation: false,
      selectedReason: '',
      reasons: [],
      closedLeadEdit: helper.checkAssignedSharedStatus(user, lead),
      callModal: false,
      meetings: [],
      menuShow: false,
      showDoc: false,
      docUrl: '',
      totalReportPrice: 0,
      modalValidation: false,
      addPaymentLoading: false,
      propsureReportTypes: [],
      editable: false,
      deletePaymentVisible: false,
      previousPayment: 0,
      selectedPayment: {},
      legalDocLoader: false,
      assignToAccountsLoading: false,
      officeLocations: [],
      active: false,
      statusfeedbackModalVisible: false,
      closedWon: false,
    }
  }

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params && this.props.route.params.isFromNotification) {
        const { lead } = this.props.route.params
        this.fetchOfficeLocations()
        this.fetchLegalPaymentInfo()
        this.fetchLead(lead)
        this.getCallHistory()
        this.fetchProperties(lead)
        this.fetchPropsureReportsList()
      } else {
        const { lead, rcmPayment, dispatch } = this.props
        dispatch(setRCMPayment({ ...rcmPayment, visible: false }))
        this.fetchOfficeLocations()
        this.fetchLegalPaymentInfo()
        this.fetchLead(lead)
        this.getCallHistory()
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
        this.setState({
          propsureReportTypes: res.data,
        })
      })
      .catch((error) => {
        console.log(`ERROR: api/inventory/listpropsureReports: ${error}`)
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

  callback = (downloadProgress) => {
    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
  }

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
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
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
            assignToAccountsLoading: false,
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
          })
        })
    })
  }

  fetchLead = (lead) => {
    axios
      .get(`api/leads/byid?id=${lead.id}`)
      .then((res) => {
        this.props.dispatch(setlead(res.data))
        this.closeLead(res.data)
        this.setState({
          assignToAccountsLoading: false,
        })
      })
      .catch((error) => {
        console.log(error)
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

  showDocumentModal = (propsureReports, property) => {
    const { lead, user, dispatch } = this.props
    const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(user, lead)
    if (leadAssignedSharedStatus) {
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
        copyToCacheDirectory: true,
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
    return (
      <TouchableOpacity
        key={item.id.toString()}
        onPress={() => this.showReportsModal(item)}
        style={[styles.viewButtonStyle]}
        activeOpacity={0.7}
      >
        <Text style={styles.PVTextStyle}>PROPSURE VERIFICATION</Text>
      </TouchableOpacity>
    )
  }

  renderPropsurePendingView = (item) => {
    let propsures = item.propsures.map((item) => ({ ...item, isLoading: false }))
    let status = helper.propsurePendingStatuses(item, 'buyer')
    if (status !== 'VERIFIED') {
      return (
        <TouchableOpacity
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

  fetchLegalPaymentInfo = () => {
    this.setState({ loading: true }, () => {
      axios.get(`/api/leads/legalPayment`).then((res) => {
        this.setState({
          legalServicesFee: res.data,
        })
      })
    })
  }

  closeLead = async (lead) => {
    const { legalServicesFee } = this.state
    if (lead.commissions.length) {
      let { count } = await this.getLegalDocumentsCount()
      if (helper.checkClearedStatuses(lead, count, legalServicesFee)) {
        this.setState({
          closedWon: true,
        })
      }
    }
  }

  getLegalDocumentsCount = async () => {
    const { lead } = this.props
    this.setState({ legalDocLoader: true })
    try {
      let res = await axios.get(`api/leads/legalDocCount?leadId=${lead.id}`)
      return res.data
    } catch (error) {
      console.log(`ERROR: api/leads/legalDocCount?leadId=${lead.id}`, error)
    }
  }

  onHandleCloseLead = () => {
    const { navigation, lead } = this.props
    let payload = Object.create({})
    payload.reasons = 'payment_done'
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads`, payload, { params: { id: leadId } })
      .then((response) => {
        this.setState({ isVisible: false }, () => {
          helper.successToast(`Lead Closed`)
          navigation.navigate('Leads')
        })
      })
      .catch((error) => {
        console.log(error)
      })
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

  goToAttachments = () => {
    const { lead, navigation } = this.props
    navigation.navigate('LeadAttachments', { rcmLeadId: lead.id, workflow: 'rcm' })
  }

  goToComments = () => {
    const { lead, navigation } = this.props
    navigation.navigate('Comments', { rcmLeadId: lead.id })
  }

  navigateToDetails = () => {
    this.props.navigation.navigate('LeadDetail', {
      lead: this.props.lead,
      purposeTab: this.props.lead.purpose,
      isFromLeadWorkflow: true,
      fromScreen: 'propsure',
    })
  }

  goToHistory = () => {
    const { callModal } = this.state
    this.setState({ callModal: !callModal })
  }

  getCallHistory = () => {
    let leadObject = null
    if (this.props.route.params && this.props.route.params.isFromNotification) {
      const { lead } = this.props.route.params
      leadObject = lead
    } else {
      const { lead } = this.props
      leadObject = lead
    }
    if (leadObject) {
      axios.get(`/api/diary/all?armsLeadId=${leadObject.id}`).then((res) => {
        this.setState({ meetings: res.data.rows })
      })
    }
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

  addRemoveReport = (report) => {
    const { selectedReports } = this.state
    let reports = [...selectedReports]
    let totalReportPrice = 0
    if (reports.some((item) => item.title === report.title)) {
      reports = _.without(reports, report)
      totalReportPrice = PaymentMethods.addPropsureReportPrices(reports)
    } else {
      reports.push(report)
      totalReportPrice = PaymentMethods.addPropsureReportPrices(reports)
    }
    this.setState({ selectedReports: reports, totalReportPrice: totalReportPrice })
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

  closeDocsModal = () => {
    const { showDoc } = this.state
    if (!showDoc) {
      this.setState({
        showDoc: !showDoc,
        documentModalVisible: false,
      })
    } else {
      this.setState({
        showDoc: !showDoc,
        documentModalVisible: true,
      })
    }
  }

  // <<<<<<<<<<<<<<<<<< Requent Propsure Documents >>>>>>>>>>>>>>>>>>
  closeModal = () => {
    this.setState({ isVisible: false })
  }

  showReportsModal = (property) => {
    const { lead, user } = this.props
    const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(user, lead)
    if (leadAssignedSharedStatus) {
      this.setState({
        isVisible: true,
        selectedPropertyId: property.id,
        selectedProperty: property,
      })
    }
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
        addedBy: 'buyer',
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
    const { dispatch, user } = this.props
    this.setState({
      editable: true,
      documentModalVisible: false,
      previousPayment: data.installmentAmount,
      officeLocationId:
        data && data.officeLocationId
          ? data.officeLocationId
          : user && user.officeLocation
          ? user.officeLocation.id
          : null,
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
  }

  handleCommissionChange = (value, name) => {
    const { propsurePayment, dispatch } = this.props
    const newSecondFormData = {
      ...propsurePayment,
      visible: propsurePayment.visible,
    }
    newSecondFormData[name] = value
    this.setState({ buyerNotZero: false })
    dispatch(setPropsurePayment(newSecondFormData))
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
    dispatch(setPropsurePayment({ ...newData }))
    this.setState({
      modalValidation: false,
      addPaymentLoading: false,
      editable: false,
      totalReportPrice: 0,
      assignToAccountsLoading: false,
    })
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
        // for commission addition
        let body = {
          ...propsurePayment,
          rcmLeadId: lead.id,
          armsUserId: user.id,
          outstandingPayment:
            Number(propsureOutstandingPayment) - Number(propsurePayment.installmentAmount),
          addedBy: 'buyer',
          amount: propsurePayment.installmentAmount,
          shortlistPropertyId: propsurePayment.selectedPropertyId,
        }
        delete body.visible
        delete body.installmentAmount
        delete body.selectedPropertyId
        delete body.paymentCategory
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
                this.clearReduxAndStateValues()
                this.fetchLead(lead)
                this.getCallHistory()
                this.fetchProperties(lead)
                this.fetchPropsureReportsList()
                helper.successToast('Propsure Payment Added')
              }
            }
          })
          .catch((error) => {
            this.clearReduxAndStateValues()
            console.log('Error: ', error)
            helper.errorToast('Error Adding Propsure Payment')
          })
      } else {
        // commission update mode
        let remaingFee = Number(propsureOutstandingPayment) + Number(previousPayment)
        remaingFee = remaingFee - Number(propsurePayment.installmentAmount)
        let body = {
          ...propsurePayment,
          rcmLeadId: lead.id,
          armsUserId: user.id,
          outstandingPayment: remaingFee,
          addedBy: 'buyer',
          installmentAmount: propsurePayment.installmentAmount,
          shortlistPropertyId: propsurePayment.selectedPropertyId,
        }
        delete body.visible
        delete body.remarks
        delete body.selectedPropertyId
        delete body.paymentCategory
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
              this.getCallHistory()
              this.fetchProperties(lead)
              this.fetchPropsureReportsList()
              this.clearReduxAndStateValues()
              helper.successToast('Propsure Payment Updated')
            }
          })
          .catch((error) => {
            helper.errorToast('Error Updating Propsure Payment', error)
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

  cancelPropsureRequest = async (data) => {
    const { lead } = this.props
    const { propsureOutstandingPayment } = lead
    if (data && data.propsures && data.propsures.length) {
      let pendingPropsures =
        data.propsures && data.propsures.length
          ? _.filter(
              data.propsures,
              (item) => item.status === 'pending' && item.addedBy === 'buyer'
            )
          : null
      let totalFee = helper.AddPropsureReportsFee(pendingPropsures, 'buyer')
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

  // <<<<<<<<<<<<<<<<<< Payment & Attachment Workflow End >>>>>>>>>>>>>>>>>>

  closeMeetingFollowupModal = () => {
    this.setState({
      active: !this.state.active,
      isFollowUpMode: false,
    })
  }

  //  ************ Function for open modal ************
  openModal = () => {
    this.setState({
      active: !this.state.active,
    })
  }

  // ************ Function for Reject modal ************
  goToRejectForm = () => {
    const { statusfeedbackModalVisible } = this.state
    this.setState({
      statusfeedbackModalVisible: !statusfeedbackModalVisible,
      modalMode: 'reject',
    })
  }

  rejectLead = (body) => {
    const { navigation, lead } = this.props
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads`, body, { params: { id: leadId } })
      .then((res) => {
        helper.successToast(`Lead Closed`)
        navigation.navigate('Leads')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  showStatusFeedbackModal = (value) => {
    this.setState({ statusfeedbackModalVisible: value })
  }

  setCurrentCall = (call) => {
    this.setState({ currentCall: call, modalMode: 'call' })
  }

  goToViewingScreen = () => {
    const { navigation } = this.props
    navigation.navigate('RCMLeadTabs', { screen: 'Viewing' })
  }

  sendStatus = (status, id) => {
    const { lead } = this.props
    let body = {
      reasons: comment,
    }
    axios.patch(`/api/diary/update?id=${id}`, body).then((res) => {})
  }

  render() {
    const {
      menuShow,
      meetings,
      callModal,
      loading,
      matchData,
      isVisible,
      documentModalVisible,
      pendingPropsures,
      selectedReports,
      progressValue,
      reasons,
      selectedReason,
      isCloseLeadVisible,
      checkReasonValidation,
      closedLeadEdit,
      showDoc,
      docUrl,
      totalReportPrice,
      addPaymentLoading,
      modalValidation,
      buyerNotZero,
      propsureReportTypes,
      selectedProperty,
      deletePaymentVisible,
      legalDocLoader,
      assignToAccountsLoading,
      officeLocations,
      active,
      statusfeedbackModalVisible,
      closedWon,
    } = this.state
    const { lead, navigation, user } = this.props
    const showMenuItem = helper.checkAssignedSharedStatus(user, lead)
    return !loading ? (
      <StyleProvider style={getTheme(formTheme)}>
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
          <HistoryModal
            getCallHistory={this.getCallHistory}
            navigation={navigation}
            data={meetings}
            closePopup={this.goToHistory}
            openPopup={callModal}
          />
          <PropsureReportsPopup
            reports={propsureReportTypes}
            addRemoveReport={(item) => this.addRemoveReport(item)}
            selectedReports={selectedReports}
            isVisible={isVisible}
            closeModal={() => this.closeModal()}
            onPress={this.onHandleRequestVerification}
            totalReportPrice={totalReportPrice}
            type={'buyer'}
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
            type={'buyer'}
          />
          <ViewDocs isVisible={showDoc} closeModal={this.closeDocsModal} url={docUrl} />
          <AddPropsurePayment
            onModalCloseClick={this.onModalCloseClick}
            handleCommissionChange={this.handleCommissionChange}
            modalValidation={modalValidation}
            goToPayAttachments={() => this.goToPayAttachments(selectedProperty)}
            submitCommissionPayment={() => this.submitCommissionPropsurePayment()}
            addPaymentLoading={addPaymentLoading}
            lead={lead}
            paymentNotZero={buyerNotZero}
            officeLocations={officeLocations}
            assignToAccounts={this.assignToAccounts}
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
                      <MatchTile
                        data={_.clone(item.item)}
                        user={user}
                        displayChecks={this.displayChecks}
                        showCheckBoxes={false}
                        addProperty={this.addProperty}
                        isMenuVisible={showMenuItem}
                        viewingMenu={false}
                        goToPropertyComments={this.goToPropertyComments}
                        toggleMenu={this.toggleMenu}
                        menuShow={menuShow}
                        screen={'propsure'}
                        cancelPropsureRequest={this.cancelPropsureRequest}
                      />
                    ) : (
                      <AgentTile
                        data={_.clone(item.item)}
                        user={user}
                        displayChecks={this.displayChecks}
                        showCheckBoxes={false}
                        addProperty={this.addProperty}
                        isMenuVisible={showMenuItem}
                        viewingMenu={false}
                        goToPropertyComments={this.goToPropertyComments}
                        toggleMenu={this.toggleMenu}
                        menuShow={menuShow}
                        screen={'propsure'}
                        cancelPropsureRequest={this.cancelPropsureRequest}
                      />
                    )}
                    <View>
                      {helper.checkPropsureRequests(item.item.propsures, 'buyer')
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
          <FollowUpModal
            leadType={'rcm'}
            active={active}
            openModal={this.openModal}
            diaryForm={true}
          />
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
            addFollowup={() => this.openModalInFollowupMode()}
            leadType={'RCM'}
            currentCall={currentCall}
            goToViewingScreen={this.goToViewingScreen}
          />

          <MeetingFollowupModal
            closeModal={() => this.closeMeetingFollowupModal()}
            active={active}
            isFollowUpMode={isFollowUpMode}
            lead={lead}
            leadType={'RCM'}
            getMeetingLead={this.getCallHistory}
          />
          <View style={AppStyles.mainCMBottomNav}>
            <CMBottomNav
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
              goToFollowUp={this.openModal}
              navigation={navigation}
              goToRejectForm={this.goToRejectForm}
              closedWon={closedWon}
              onHandleCloseLead={this.onHandleCloseLead}
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
            legalDocLoader={legalDocLoader}
          />
        </View>
      </StyleProvider>
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
  }
}

export default connect(mapStateToProps)(LeadPropsure)
