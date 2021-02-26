/** @format */

import axios from 'axios'
import { Buffer } from 'buffer'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as MediaLibrary from 'expo-media-library'
import * as Permissions from 'expo-permissions'
import * as React from 'react'
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { ActionSheet } from 'native-base'
import { connect } from 'react-redux'
import _ from 'underscore'
import { setlead } from '../../actions/lead'
import { setRCMPayment } from '../../actions/rcmPayment'
import AppStyles from '../../AppStyles'
import AddRCMPaymentModal from '../../components/AddRCMPaymentModal'
import AgentTile from '../../components/AgentTile/index'
import CMBottomNav from '../../components/CMBottomNav'
import HistoryModal from '../../components/HistoryModal/index'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import Loader from '../../components/loader'
import MatchTile from '../../components/MatchTile/index'
import ViewDocs from '../../components/ViewDocs'
import config from '../../config'
import helper from '../../helper'
import StaticData from '../../StaticData'
import BuyPaymentView from './buyPaymentView'
import RentPaymentView from './rentPaymentView'
import styles from './styles'
import DeleteModal from '../../components/DeleteModal'

var BUTTONS = ['Delete', 'Cancel']
var TOKENBUTTONS = ['Confirm', 'Cancel']
var CANCEL_INDEX = 1

class LeadRCMPayment extends React.Component {
  constructor(props) {
    super(props)
    const { user, lead } = this.props
    this.state = {
      loading: true,
      isVisible: false,
      open: false,
      allProperties: [],
      selectedProperty: {},
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
      closedLeadEdit: helper.checkAssignedSharedStatus(user, lead),
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
      commissionNotApplicableBuyer: false,
      commissionNotApplicableSeller: false,
      agreementDoc: null,
      checkListDoc: null,
      legalAgreement: null,
      legalCheckList: null,
      webView: '',
      showWebView: false,
      activityBool: false,
      showDoc: false,
      deletePaymentVisible: false,
      tokenNotZero: false,
      agreedNotZero: false,
      buyerNotZero: false,
      sellerNotZero: false,
      rentNotZero: false,
      tokenMenu: false,
      assignToAccountsLoading: false
    }
  }

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params && this.props.route.params.isFromNotification) {
        const { lead } = this.props.route.params
        this.getCallHistory()
        this.getSelectedProperty(lead)
      } else {
        const { lead } = this.props
        this.getCallHistory()
        this.getSelectedProperty(lead)
      }
    })
  }

  // *******  Set Uploaded Legal Documents  *************
  setLegalDocuments = async () => {
    const { lead } = this.state
    let legalAgreeCopy = null
    let legalCheckCopy = null
    if (lead.legalDocuments && lead.legalDocuments.length) {
      lead.legalDocuments.forEach((element) => {
        if (element.category === 'agreement') {
          legalAgreeCopy = element
          legalAgreeCopy.loading = false
          legalAgreeCopy.uploaded = true
        }
        if (element.category === 'checklist') {
          legalCheckCopy = element
          legalCheckCopy.loading = false
          legalCheckCopy.uploaded = true
        }
      })
      this.setState({
        legalAgreement: legalAgreeCopy,
        legalCheckList: legalCheckCopy,
      })
    }
  }

  // *******  Set Legal Documents Activity Indicator *************
  setDocActivity = (doc) => {
    const { legalAgreement, legalCheckList } = this.state
    let legalAgreeCopy = null
    let legalCheckCopy = null
    if (doc.category === 'agreement') {
      legalAgreeCopy = legalAgreement
      legalAgreeCopy.loading = !legalAgreeCopy.loading
      this.setState({ legalAgreement: legalAgreeCopy })
    } else {
      legalCheckCopy = legalCheckList
      legalCheckCopy.loading = !legalCheckCopy.loading
      this.setState({ legalCheckList: legalCheckCopy })
    }
  }

  // *******  DownLoad Legal Documents Functions  *************
  downloadLegalDocs = async (doc) => {
    if (doc) {
      this.setDocActivity(doc)
      axios
        .get(`/api/leads/legalDocument?id=${doc.id}`, {
          responseType: 'arraybuffer',
          headers: {
            Accept: doc.fileType,
          },
        })
        .then((res) => {
          let buff = Buffer.from(res.data, 'base64')
          this.downloadBufferFile(buff.toString('base64'), doc)
        })
        .catch((error) => {
          console.log(`/api/leads/legalDocument?id=${doc.id} `, error)
          return null
        })
    }
  }

  downloadBufferFile = async (buff, doc) => {
    let fileUri = FileSystem.documentDirectory + doc.fileName
    FileSystem.writeAsStringAsync(fileUri, buff, { encoding: FileSystem.EncodingType.Base64 })
      .then((uri) => {
        FileSystem.getInfoAsync(fileUri).then((res) => {
          this.saveFile(res.uri, doc)
        })
      })
      .catch((error) => {
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
      this.setDocActivity(doc)
    }
  }

  // *******  View Legal Documents Modal  *************
  closeDocsModal = () => {
    const { showDoc } = this.state
    if (!showDoc) {
      this.setState({
        showDoc: !showDoc,
        showWebView: false,
      })
    } else {
      this.setState({
        showDoc: !showDoc,
        showWebView: true,
      })
    }
  }

  // *******  Upload Legal Documents Functions  *************
  uploadDocument = (category) => {
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
        if (category === 'agreement') {
          this.setState(
            {
              activityBool: true,
              agreementDoc: item,
            },
            () => {
              this.uploadDocToServer(category)
            }
          )
        } else {
          this.setState(
            {
              activityBool: true,
              checkListDoc: item,
            },
            () => {
              this.uploadDocToServer(category)
            }
          )
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  uploadDocToServer = (category) => {
    let data = null
    let that = this
    if (category === 'agreement') data = that.state.agreementDoc
    else data = that.state.checkListDoc
    if (data) {
      let document = {
        name: data.name,
        type: 'file/' + data.name.split('.').pop(),
        uri: data.uri,
      }
      let fd = new FormData()
      fd.append('file', document)
      axios
        .post(`/api/leads/legalDocuments?leadId=${that.state.lead.id}&category=${category}`, fd)
        .then((res) => {
          if (category === 'agreement') {
            let newDoc = this.state.legalAgreement
            // newDoc.uploaded = true
            this.setState({
              legalAgreement: newDoc,
              activityBool: false,
            })
          } else {
            let newDoc = this.state.legalCheckList
            // newDoc.uploaded = true
            this.setState({
              legalCheckList: newDoc,
              activityBool: false,
            })
          }
          helper.successToast('File Uploaded!')
          that.getSelectedProperty(that.state.lead)
        })
        .catch((error) => {
          console.log('error=>', error.message)
        })
    }
  }

  deleteDoc = (data) => {
    if (data) {
      axios
        .delete(`/api/leads/legaldocument?id=${data.id}`)
        .then((res) => {
          if (data.category === 'agreement') {
            this.setState({
              legalAgreement: null,
              agreementDoc: null,
            })
          } else {
            this.setState({
              legalCheckList: null,
              checkListDoc: null,
            })
          }
          helper.successToast('File Deleted!')
          this.getSelectedProperty(this.state.lead)
        })
        .catch((error) => {
          helper.errorToast('File Not Deleted!')
          console.log('error=>', error.message)
        })
    }
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
    })
    dispatch(setRCMPayment({ ...newData }))
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
          dispatch(setlead(response.data))
          this.setState(
            {
              progressValue: rcmProgressBar[lead.status],
              lead: response.data,
              activityBool: false,
            },
            () => {
              this.setLegalDocuments()
            }
          )
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
                  commissionNotApplicableBuyer: lead.commissionNotApplicableBuyer
                    ? lead.commissionNotApplicableBuyer
                    : false,
                  commissionNotApplicableSeller: lead.commissionNotApplicableSeller
                    ? lead.commissionNotApplicableSeller
                    : false,
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
    axios
      .get(`/api/leads/${lead.id}/shortlist`)
      .then((response) => {
        matches = helper.propertyCheck(response.data.rows)
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

  displayChecks = () => { }

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
    if (lead.commissions.length) {
      if (helper.checkClearedStatuses(lead)) {
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
    } else {
      this.setState({
        reasons: StaticData.leadCloseReasons,
        isVisible: true,
        checkReasonValidation: '',
      })
    }
  }

  selectForPayment = (item) => {
    const { allProperties, lead } = this.state
    const selectedProperty = allProperties.filter((property) => property.id === item.id)
    let payload = Object.create({})
    payload.shortlist_id = selectedProperty[0].id
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads`, payload, { params: { id: leadId } })
      .then((response) => {
        if (response.data) {
          this.setState({ lead: response.data }, () => {
            this.getSelectedProperty(response.data)
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  selectDifferentProperty = () => {
    const { lead } = this.state
    axios
      .patch(`/api/leads/unselectProperty?leadId=${lead.id}`)
      .then((response) => {
        this.props.dispatch(setlead(response.data))
        this.setState({ lead: response.data }, () => {
          this.getSelectedProperty(response.data)
        })
      })
      .catch((error) => {
        console.log('errorr', error)
      })
  }

  showConfirmationDialog = (item) => {
    const { lead } = this.state
    const { user } = this.props
    const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(user, lead)
    if (leadAssignedSharedStatus) {
      if (lead && lead.commissions && lead.commissions.length > 0) {
        let count = 0
        lead.commissions.map((item) => {
          if (item.paymentCategory === 'commission') count++
        })
        if (count) {
          helper.errorToast('Payment already added, cannot select another property')
          return
        }
      }
      Alert.alert(
        'WARNING',
        'Selecting a different property will remove all payments & legal services request, do you want to continue?',
        [
          { text: 'Yes', onPress: () => this.selectDifferentProperty() },
          { text: 'No', style: 'cancel' },
        ],
        { cancelable: false }
      )
    }
  }

  renderSelectPaymentView = (item) => {
    const { lead } = this.state
    return (
      <TouchableOpacity
        key={item.id.toString()}
        onPress={
          lead.shortlist_id === null
            ? () => this.selectForPayment(item)
            : () => this.showConfirmationDialog()
        }
        style={styles.viewButtonStyle}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonTextStyle}>
          {lead.shortlist_id === null ? 'SELECT FOR PAYMENT' : 'SELECT A DIFFERENT PROPERTY'}
        </Text>
      </TouchableOpacity>
    )
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
    if (Number(monthlyRent) <= 0) {
      this.setState({ rentNotZero: true })
      return
    }
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
    this.setState({ formData, rentNotZero: false }, () => { })
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
    navigation.navigate('Comments', {
      rcmLeadId: lead.id,
    })
  }

  navigateToDetails = () => {
    this.props.navigation.navigate('LeadDetail', {
      lead: this.props.lead,
      purposeTab: this.props.lead.purpose,
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
    const { } = this.state
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
    const { } = this.state
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

  onAddCommissionPayment = (addedBy, paymentCategory) => {
    const { dispatch, rcmPayment } = this.props
    dispatch(setRCMPayment({ ...rcmPayment, visible: true, addedBy, paymentCategory }))
  }

  onModalCloseClick = () => {
    this.clearReduxAndStateValues()
  }

  confirmTokenAction = (payment, status) => {
    const { dispatch } = this.props
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
    body.status_updated_by = 'buyer'
    if (status === 'at_property_agent_pending_verification') body.sellerAgentId = armsUserId
    if (
      (body.paymentCategory === 'token' && body.status === 'pendingSales') ||
      (body.paymentCategory === 'token' && body.status === 'notCleared')
    ) {
      body.status = 'pendingAccount'
    }
    if (body.paymentCategory === 'token' && body.status === 'given_back_to_buyer') {
      body.active = false
    }
    let baseUrl = `/api/leads/tokenPayment`
    axios
      .patch(`${baseUrl}?id=${paymentID}`, body)
      .then((response) => {
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

  handleCommissionChange = (value, name) => {
    const { rcmPayment, dispatch } = this.props
    const newSecondFormData = { ...rcmPayment, visible: rcmPayment.visible }
    newSecondFormData[name] = value
    this.setState({ buyerNotZero: false })
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
    const { rcmPayment, user } = this.props
    const { lead, editable } = this.state
    let baseUrl = `/api/leads/project/payments`
    if (
      rcmPayment.installmentAmount != null &&
      rcmPayment.installmentAmount != '' &&
      rcmPayment.type != ''
    ) {
      if (Number(rcmPayment.installmentAmount) <= 0) {
        this.setState({ buyerNotZero: true, addPaymentLoading: false, assignToAccountsLoading: false })
        return
      }
      if (editable === false) {
        // for commission addition
        let body = {
          ...rcmPayment,
          rcmLeadId: lead.id,
          armsUserId: user.id,
          // paymentCategory: 'commission',
          addedBy: rcmPayment.addedBy,
          active: true,
        }
        delete body.visible
        let toastMsg = 'Commission Payment Added'
        let errorMsg = 'Error Adding Commission Payment'
        if (body.paymentCategory === 'token') {
          baseUrl = `/api/leads/tokenPayment`
          body.status = 'at_buyer_agent'
          toastMsg = 'Token Payment Added'
          errorMsg = 'Error Adding Token Payment'
        }
        axios
          .post(baseUrl, body)
          .then((response) => {
            if (response.data) {
              // check if some attachment exists so upload that as well to server with payment id.
              if (rcmPayment.paymentAttachments.length > 0) {
                rcmPayment.paymentAttachments.map((paymentAttachment) =>
                  // payment attachments
                  this.uploadAttachment(paymentAttachment, response.data.id)
                )
              } else {
                this.clearReduxAndStateValues()
                this.fetchLead()
                helper.successToast(toastMsg)
              }
            }
          })
          .catch((error) => {
            this.clearReduxAndStateValues()
            helper.errorToast(errorMsg)
          })
      } else {
        // commission update mode
        let toastMsg = 'Commission Payment Updated'
        let errorMsg = 'Error Updating Commission Payment'
        baseUrl = `/api/leads/project/payment` // for patch request
        const { allProperties } = this.state
        let property = allProperties[0]
        let armsUserId =
          property && property.armsuser && property.armsuser.id && property.armsuser.id
        let body = { ...rcmPayment }
        let paymentID = body.id
        delete body.visible
        delete body.remarks
        delete body.id
        if (body.paymentCategory === 'token') {
          baseUrl = `/api/leads/tokenPayment`
          toastMsg = 'Token Payment Updated'
          errorMsg = 'Error Updating Token Payment'
        }
        if (
          (body.paymentCategory === 'token' && body.status === 'pendingSales') ||
          (body.paymentCategory === 'token' && body.status === 'notCleared')
        ) {
          body.status = 'pendingAccount'
        }
        if (body.paymentCategory === 'token' && body.status === 'given_back_to_buyer') {
          body.active = false
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
              this.clearReduxAndStateValues()
              helper.successToast(toastMsg)
            }
          })
          .catch((error) => {
            helper.errorToast(errorMsg)
            console.log('ERROR: ', error)
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
        `/api/leads/sendLegalEmail?leadId=${lead.id}&shortlistId=${selectedProperty ? selectedProperty.id : null
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

  setBuyerCommissionApplicable = (value) => {
    this.setState({ commissionNotApplicableBuyer: value }, () => {
      const { lead } = this.state
      const { allProperties } = this.state
      const selectedProperty = allProperties[0]
      let payload = Object.create({})
      payload.shortlist_id = selectedProperty.id
      payload.commissionNotApplicableBuyer = value
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
    })
  }

  setSellerCommissionApplicable = (value) => {
    this.setState({ commissionNotApplicableSeller: value }, () => {
      const { lead } = this.state
      const { allProperties } = this.state
      const selectedProperty = allProperties[0]
      let payload = Object.create({})
      payload.shortlist_id = selectedProperty.id
      payload.commissionNotApplicableSeller = value
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
    })
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
      this.fetchLead()
      helper.successToast(response.data.message)
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

  toggleTokenMenu = () => {
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
              this.submitCommissionPayment();
            })
          },
        },
      ],
      { cancelable: false }
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
      meetings,
      callModal,
      modalValidation,
      addPaymentLoading,
      assignToAccountsLoading,
      commissionNotApplicableBuyer,
      commissionNotApplicableSeller,
      agreementDoc,
      checkListDoc,
      webView,
      showWebView,
      legalAgreement,
      legalCheckList,
      showDoc,
      deletePaymentVisible,
      tokenNotZero,
      agreedNotZero,
      buyerNotZero,
      rentNotZero,
      activityBool,
      tokenMenu,
    } = this.state
    const { navigation, user } = this.props
    const showMenuItem = helper.checkAssignedSharedStatus(user, lead)

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
        <AddRCMPaymentModal
          onModalCloseClick={this.onModalCloseClick}
          handleCommissionChange={this.handleCommissionChange}
          modalValidation={modalValidation}
          goToPayAttachments={() => this.goToPayAttachments()}
          submitCommissionPayment={() => {
            this.setState({ addPaymentLoading: true }, () => {
              this.submitCommissionPayment()
            })
          }}
          addPaymentLoading={addPaymentLoading}
          assignToAccountsLoading={assignToAccountsLoading}
          lead={lead}
          paymentNotZero={buyerNotZero}
          assignToAccounts={() => { this.assignToAccounts() }}
        />
        {showWebView ? (
          <ViewDocs
            imageView={true}
            isVisible={showDoc}
            closeModal={this.closeDocsModal}
            url={webView}
          />
        ) : null}
        <HistoryModal
          getCallHistory={this.getCallHistory}
          navigation={navigation}
          data={meetings}
          closePopup={this.goToHistory}
          openPopup={callModal}
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
                      screen={'payment'}
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
                        screen={'payment'}
                      />
                    )}
                  <View>{this.renderSelectPaymentView(item.item)}</View>
                </View>
              )}
              ListFooterComponent={
                <View style={{ marginHorizontal: 10 }}>
                  {lead.shortlist_id !== null ? (
                    lead.purpose === 'sale' ? (
                      <BuyPaymentView
                        deleteDoc={this.deleteDoc}
                        uploadDocument={this.uploadDocument}
                        uploadDocToServer={this.uploadDocToServer}
                        legalAgreement={legalAgreement}
                        legalCheckList={legalCheckList}
                        agreementDoc={agreementDoc}
                        checkListDoc={checkListDoc}
                        downloadLegalDocs={this.downloadLegalDocs}
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
                        user={user}
                        commissionNotApplicableBuyer={commissionNotApplicableBuyer}
                        commissionNotApplicableSeller={commissionNotApplicableSeller}
                        setBuyerCommissionApplicable={this.setBuyerCommissionApplicable}
                        setSellerCommissionApplicable={this.setSellerCommissionApplicable}
                        onPaymentLongPress={this.onPaymentLongPress}
                        tokenNotZero={tokenNotZero}
                        agreedNotZero={agreedNotZero}
                        activityBool={activityBool}
                        requestLegalServices={this.showLegalRequestConfirmation}
                        toggleTokenMenu={this.toggleTokenMenu}
                        tokenMenu={tokenMenu}
                        confirmTokenAction={this.confirmTokenAction}
                      />
                    ) : (
                        <RentPaymentView
                          deleteDoc={this.deleteDoc}
                          uploadDocument={this.uploadDocument}
                          uploadDocToServer={this.uploadDocToServer}
                          agreementDoc={agreementDoc}
                          legalAgreement={legalAgreement}
                          legalCheckList={legalCheckList}
                          checkListDoc={checkListDoc}
                          downloadLegalDocs={this.downloadLegalDocs}
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
                          user={user}
                          commissionNotApplicableBuyer={commissionNotApplicableBuyer}
                          commissionNotApplicableSeller={commissionNotApplicableSeller}
                          setBuyerCommissionApplicable={this.setBuyerCommissionApplicable}
                          setSellerCommissionApplicable={this.setSellerCommissionApplicable}
                          onPaymentLongPress={this.onPaymentLongPress}
                          tokenNotZero={tokenNotZero}
                          agreedNotZero={agreedNotZero}
                          rentNotZero={rentNotZero}
                          activityBool={activityBool}
                          requestLegalServices={this.showLegalRequestConfirmation}
                          toggleTokenMenu={this.toggleTokenMenu}
                          tokenMenu={tokenMenu}
                          confirmTokenAction={this.confirmTokenAction}
                        />
                      )
                  ) : null}
                </View>
              }
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
          <View style={AppStyles.mainCMBottomNav}>
            <CMBottomNav
              goToAttachments={this.goToAttachments}
              navigateTo={this.navigateToDetails}
              goToDiaryForm={this.goToDiaryForm}
              goToComments={this.goToComments}
              alreadyClosedLead={() => this.closedLead()}
              closeLead={this.showLeadPaymentModal}
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

export default connect(mapStateToProps)(LeadRCMPayment)
