/** @format */

import axios from 'axios'
import { Buffer } from 'buffer'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as MediaLibrary from 'expo-media-library'
import { ActionSheet } from 'native-base'
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
import AccountsPhoneNumbers from '../../components/AccountsPhoneNumbers'
import AddRCMPaymentModal from '../../components/AddRCMPaymentModal'
import AgentTile from '../../components/AgentTile/index'
import CMBottomNav from '../../components/CMBottomNav'
import DeleteModal from '../../components/DeleteModal'
import HistoryModal from '../../components/HistoryModal/index'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import Loader from '../../components/loader'
import MatchTile from '../../components/MatchTile/index'
import MeetingFollowupModal from '../../components/MeetingFollowupModal'
import StatusFeedbackModal from '../../components/StatusFeedbackModal'
import SubmitFeedbackOptionsModal from '../../components/SubmitFeedbackOptionsModal'
import ViewDocs from '../../components/ViewDocs'
import config from '../../config'
import helper from '../../helper'
import StaticData from '../../StaticData'
import BuyPaymentView from './buyPaymentView'
import RentPaymentView from './rentPaymentView'
import styles from './styles'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'

var BUTTONS = ['Delete', 'Cancel']
var TOKENBUTTONS = ['Confirm', 'Cancel']
var CANCEL_INDEX = 1

class LeadRCMPayment extends React.Component {
  constructor(props) {
    super(props)
    const { user, lead, permissions, shortlistedData } = this.props
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
      leadInfo: [],
      lead: props.lead,
      pickerData: StaticData.oneToTwelve,
      showMonthlyRentArrow: false,
      formData: {
        contract_months: null,
        monthlyRent: null,
        security: null,
        advance: null,
      },
      buyerDetailForm: {
        agreedAmount: null,
        advance: null,
      },
      progressValue: 0,
      // for the lead close dialog
      checkReasonValidation: false,
      selectedReason: '',
      reasons: [],
      closedLeadEdit: helper.checkAssignedSharedStatus(user, lead, permissions, shortlistedData),
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
      assignToAccountsLoading: false,
      legalDocLoader: false,
      officeLocations: [],
      rentMonthlyToggle: false,
      buyerSellerCounts: { buyerCount: 0, count: 0, selerCount: 0 },
      legalServicesFee: null,
      buyerToggleModal: false,
      advanceNotZero: false,
      active: false,
      closedWon: false,
      statusfeedbackModalVisible: false,
      modalMode: 'call',
      currentCall: null,
      isFollowUpMode: false,
      comment: null,
      accountPhoneNumbers: [],
      accountsLoading: false,
      isMultiPhoneModalVisible: false,
      newActionModal: false,
      legalBuyListing: [],
      legalSellerListing: [],
    }
  }

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params && this.props.route.params.isFromNotification) {
        const { lead } = this.props.route.params
        this.fetchFunctions(lead)
      } else {
        const { lead } = this.props
        this.fetchFunctions(lead)
      }
    })
  }

  fetchFunctions = (lead) => {
    this.fetchLeadInfo()
    this.getSelectedProperty(lead)
    this.getLegalDocumentsCount()
    this.getCallHistory()
    this.fetchOfficeLocations()
    this.fetchLegalPaymentInfo()
    this.fetchSellerDocuments(lead)
    this.fetchBuyerDocuments(lead)
  }

  // componentDidUpdate(prevProps, prevState) {
  //   // console.log(this.state.commissionNotApplicableBuyer, 'CURRENTBUYER')
  //   // console.log(prevState.commissionNotApplicableBuyer, 'PREVSTATE')
  //   const { lead } = this.props.route.params

  //   if (prevState.commissionNotApplicableBuyer !== this.state.commissionNotApplicableBuyer) {
  //     this.fetchSellerDocuments(lead)
  //     this.fetchBuyerDocuments(lead)
  //     console.log('BUYER')
  //     this.checkCloseWon()
  //   }
  //   if (prevState.commissionNotApplicableSeller !== this.state.commissionNotApplicableSeller) {
  //     console.log('SELLER')
  //     this.fetchSellerDocuments(lead)
  //     this.fetchBuyerDocuments(lead)
  //     this.checkCloseWon()
  //   }
  // }

  fetchLegalPaymentInfo = () => {
    this.setState({ loading: true }, () => {
      axios.get(`/api/leads/legalPayment`).then((res) => {
        this.setState({
          legalServicesFee: res.data,
        })
      })
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
    const { status } = await MediaLibrary.requestPermissionsAsync()
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

  fetchOfficeLocations = () => {
    const { user, dispatch, rcmPayment } = this.props
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

  setDefaultOfficeLocation = () => {
    const { rcmPayment, user, dispatch } = this.props
    let defaultUserLocationId = user.officeLocationId
    dispatch(setRCMPayment({ ...rcmPayment, officeLocationId: defaultUserLocationId }))
    return defaultUserLocationId
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
      copyToCacheDirectory: false,
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
      officeLocationId: this.setDefaultOfficeLocation(),
      instrumentDuplicateError: null,
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
    const { dispatch } = this.props
    this.clearReduxAndStateValues()
    dispatch(clearInstrumentInformation())
    dispatch(clearInstrumentsList())
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
          this.showLeadPaymentModal(response.data)
          this.getLegalDocumentsCount()
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
                  // commissionNotApplicableBuyer: lead.commissionNotApplicableBuyer
                  //   ? lead.commissionNotApplicableBuyer
                  //   : false,
                  // commissionNotApplicableSeller: lead.commissionNotApplicableSeller
                  //   ? lead.commissionNotApplicableSeller
                  //   : false,
                  formData: {
                    contract_months: lead.contract_months ? String(lead.contract_months) : '',
                    security: lead.security ? String(lead.security) : '',
                    advance: lead.advance ? String(lead.advance) : '',
                    monthlyRent: lead.monthlyRent ? String(lead.monthlyRent) : '',
                  },
                  buyerDetailForm: {
                    agreedAmount: lead.payment ? String(lead.payment) : '',
                    advance: lead.advance ? String(lead.advance) : '',
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
          buyerDetailForm: {
            agreedAmount: lead.payment ? String(lead.payment) : '',
            advance: lead.advance ? String(lead.advance) : '',
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

  showLeadPaymentModal = async (lead) => {
    const { legalServicesFee } = this.state
    if (lead.commissions.length) {
      let legalDocResp = await this.getLegalDocumentsCount()
      if (helper.checkClearedStatuses(lead, legalDocResp, legalServicesFee)) {
        this.setState({
          closedWon: true,
        })
      } else {
        this.setState({
          closedWon: false,
        })
      }
    }
  }

  getLegalDocumentsCount = async () => {
    const { lead } = this.props
    this.setState({ legalDocLoader: true })
    try {
      let res = await axios.get(`api/legal/document/count?leadId=${lead.id}`)
      this.setState({
        buyerSellerCounts: res.data,
        legalDocLoader: false,
      })
      return res.data
    } catch (error) {
      console.log(`ERROR: api/legal/document/count?leadId=${lead.id}`, error)
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
    console.log('showConfirmationDialog')
    const { lead } = this.state
    const { user, permissions, shortlistedData } = this.props
    const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(
      user,
      lead,
      permissions,
      shortlistedData
    )
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
    const { permissions } = this.props
    return (
      <TouchableOpacity
        key={item.id.toString()}
        onPress={() => {
          if (
            getPermissionValue(
              PermissionFeatures.BUY_RENT_LEADS,
              PermissionActions.UPDATE,
              permissions
            )
          ) {
            if (lead.shortlist_id === null) this.selectForPayment(item)
            else this.showConfirmationDialog()
          }
        }}
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
      val = val.replace(/,/g, '')
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
    const { buyerDetailForm } = this.state
    const { lead } = this.state
    let payload = Object.create({})
    if (buyerDetailForm.agreedAmount && Number(buyerDetailForm.agreedAmount) <= 0) {
      this.setState({ agreedNotZero: true })
      return
    }
    if (buyerDetailForm.advance && Number(buyerDetailForm.advance) <= 0) {
      this.setState({ advanceNotZero: true })
      return
    }
    payload.payment = this.convertToInteger(buyerDetailForm.agreedAmount)
    payload.advance = this.convertToInteger(buyerDetailForm.advance)
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads`, payload, { params: { id: leadId } })
      .then((response) => {
        this.toggleBuyerDetails()
        this.fetchLead()
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

  handleForm = (value, name) => {
    const { formData } = this.state
    let copy = formData
    copy[name] = value.replace(/,/g, '')
    this.setState({ formData: copy, rentNotZero: false })
  }

  handleBuyerForm = (value, name) => {
    const { buyerDetailForm } = this.state
    let copy = buyerDetailForm
    copy[name] = value.replace(/,/g, '')
    this.setState({ buyerDetailForm: copy, agreedNotZero: false, advanceNotZero: false })
  }

  updateRentLead = () => {
    const { lead, formData } = this.state
    const { allProperties } = this.state
    this.toggleMonthlyDetails()
    const selectedProperty = allProperties[0]
    let payload = Object.create({})
    payload = {
      advance: this.convertToInteger(formData.advance),
      contract_months: this.convertToInteger(formData.contract_months),
      security: this.convertToInteger(formData.security),
      monthlyRent: this.convertToInteger(formData.monthlyRent),
    }
    payload.shortlist_id = selectedProperty.id
    var leadId = []
    leadId.push(lead.id)
    axios
      .patch(`/api/leads`, payload, { params: { id: leadId } })
      .then((response) => {
        console.log('success')
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

  goToAttachments = (purpose) => {
    const { navigation } = this.props
    const { lead } = this.state
    navigation.navigate('LeadAttachments', {
      rcmLeadId: lead.id,
      workflow: 'rcm',
      purpose: purpose,
    })
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
    let leadObject = null
    if (this.props.route.params && this.props.route.params.isFromNotification) {
      const { lead } = this.props.route.params
      leadObject = lead
    } else {
      const { lead } = this.props
      leadObject = lead
    }
    if (leadObject) {
      axios.get(`/api/leads/tasks?rcmLeadId=${leadObject.id}`).then((res) => {
        this.setState({ meetings: res.data })
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
    // pending implementation here for instrument...
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
    this.setState({ editable: true })
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
    const { rcmPayment, user } = this.props
    const { lead, editable } = this.state
    if (
      rcmPayment.installmentAmount != null &&
      rcmPayment.installmentAmount != '' &&
      rcmPayment.type != ''
    ) {
      if (Number(rcmPayment.installmentAmount) <= 0) {
        this.setState({
          buyerNotZero: true,
          addPaymentLoading: false,
          assignToAccountsLoading: false,
        })
        return
      }
      if (editable === false) {
        // for commission addition
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
            addedBy: rcmPayment.addedBy,
            active: true,
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
    this.fetchFunctions(lead)
  }

  addRCMPayment = (body) => {
    const { rcmPayment, user, dispatch } = this.props
    let baseUrl = `/api/leads/project/payments`

    let toastMsg = 'Commission Payment Added'
    let errorMsg = 'Error Adding Commission Payment'
    if (body.paymentCategory === 'token') {
      baseUrl = `/api/leads/tokenPayment`
      body.status = 'at_buyer_agent'
      ;(body.officeLocationId = user && user.officeLocation ? user.officeLocation.id : null),
        (toastMsg = 'Token Payment Added')
      errorMsg = 'Error Adding Token Payment'
    }
    body.officeLocationId = this.setDefaultOfficeLocation()
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
            this.fetchLead()
            helper.successToast(toastMsg)
          }
        }
      })
      .catch((error) => {
        helper.errorToast(errorMsg)
      })
      .finally(() => {
        this.clearReduxAndStateValues()
        dispatch(clearInstrumentInformation())
      })
  }

  updateRCMPayment = (body) => {
    const { dispatch, rcmPayment } = this.props
    let toastMsg = 'Commission Payment Updated'
    let errorMsg = 'Error Updating Commission Payment'
    let baseUrl = `/api/leads/project/payment` // for patch request
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
          dispatch(clearInstrumentInformation())
          helper.successToast(toastMsg)
        }
      })
      .catch((error) => {
        helper.errorToast(errorMsg)
        console.log('ERROR: ', error)
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
            if (res.data.status === false) {
              dispatch(
                setRCMPayment({
                  ...rcmPayment,
                  instrumentDuplicateError: res.data.message,
                })
              )
              this.setState({ addPaymentLoading: false, assignToAccountsLoading: false })
              return
            }
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

  fetchLead = () => {
    const { dispatch, lead } = this.props
    const { rcmProgressBar } = StaticData
    this.setState({ loading: true }, () => {
      axios
        .get(`/api/leads/byId?id=${lead.id}`)
        .then((response) => {
          if (response.data) {
            dispatch(setlead(response.data))
            this.showLeadPaymentModal(response.data)
            this.setState({
              progressValue: rcmProgressBar[response.data.status],
              loading: false,
              lead: response.data,
              formData: {
                contract_months: response.data.contract_months
                  ? String(response.data.contract_months)
                  : '',
                security: response.data.security ? String(response.data.security) : '',
                advance: response.data.advance ? String(response.data.advance) : '',
                monthlyRent: response.data.monthlyRent ? String(response.data.monthlyRent) : '',
              },
              buyerDetailForm: {
                agreedAmount: response.data.payment ? String(response.data.payment) : '',
                advance: response.data.advance ? String(response.data.advance) : '',
              },
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

  showConfirmationDialogClosePayment = (value, addedBy) => {
    if (!value) {
      if (addedBy === 'buyer') this.setBuyerCommissionApplicable(value)
      else this.setSellerCommissionApplicable(value)
      return
    }
    ActionSheet.show(
      {
        options: TOKENBUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title:
          'Uploaded legal documents will be deleted with disable action. Are you sure you want to continue?',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          this.disableLegalDocs(value, addedBy)
        }
      }
    )
  }

  disableLegalDocs = (value, addedBy) => {
    const { lead } = this.state
    axios
      .post(`/api/legal/document/disable?leadId=${lead.id}&addedBy=${addedBy}`)
      .then((res) => {
        console.log('res.data.disableLegaldocuments; ', res.data.disableLegaldocuments)
        if (res.data.disableLegaldocuments) {
          this.deleteLegalDocs(value, addedBy)
        }
      })
      .catch((error) => {
        console.log(`/api/legal/document/disable?leadId=${lead.id}&addedBy=${addedBy}`, error)
      })
  }

  deleteLegalDocs = (value, addedBy) => {
    const { lead } = this.state
    axios
      .delete(`/api/legal/documents?leadId=${lead.id}&addedBy=${addedBy}`)
      .then((res) => {
        console.log('res.data; ', res.data)
        this.setState({ loading: false })
        if (addedBy === 'buyer') this.setBuyerCommissionApplicable(value)
        else this.setSellerCommissionApplicable(value)
      })
      .catch((error) => {
        console.log(`/api/legal/documents?leadId=${lead.id}&addedBy=${addedBy}`, error)
      })
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
      console.log('payload: ', payload)
      axios
        .patch(`/api/leads`, payload, { params: { id: leadId } })
        .then((response) => {
          this.fetchLead()
          this.setState({ lead: response.data })
        })
        .catch((error) => {
          console.log(`/api/leads`)
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
          this.fetchLead()
          this.setState({ lead: response.data })
        })
        .catch((error) => {
          console.log(`/api/leads`)
          console.log(error)
        })
    })
  }
  fetchBuyerDocuments = (lead) => {
    axios
      .get(
        `/api/legal/documents/${lead.id}?addedBy=buyer&leadType=${lead.purpose}&legalType=${lead.legalTypeBuyer}`
      )
      .then((res) => {
        if (res.data && res.data.length) {
          this.setState({
            legalBuyListing: helper.setLegalListing(res.data),
          })
        }
      })
      .catch((error) => {
        console.log('error: ', error)
      })
  }
  fetchSellerDocuments = (lead) => {
    let query = `/api/legal/documents/${lead.id}?addedBy=seller&leadType=${lead.purpose}&legalType=${lead.legalTypeSeller}`
    axios
      .get(query)
      .then((res) => {
        if (res.data && res.data.length) {
          this.setState({
            legalSellerListing: helper.setLegalListing(res.data),
          })
        }
      })
      .catch((error) => {
        console.log('error: ', error)
      })
  }
  fetchLeadInfo = () => {
    const { lead } = this.props
    axios
      .get(`api/leads/byid?id=${lead.id}`)
      .then((res) => {
        this.setState({
          leadInfo: res.data,
          commissionNotApplicableBuyer: res.data.commissionNotApplicableBuyer,
          commissionNotApplicableSeller: res.data.commissionNotApplicableSeller,
        })
        this.props.dispatch(setlead(res.data))
        this.checkCloseWon()
      })
      .catch((error) => {
        console.log(error)
      })
  }
  docsValidationHtml = (docs, type) => {
    let docsValidationHtml = ''
    let category = ''
    docs.map((doc) => {
      if (
        doc.status !== 'approved' &&
        (doc.category !== 'police_verification_report_optional' || doc.status === 'uploaded')
      ) {
        category =
          doc.category === 'cnic' ? 'CNIC' : doc.category && doc.category.replace(/_/g, ' ')
        docsValidationHtml += `${type} ${this.capitalizeWordsWithoutUnderscore(
          category
        )} is not approved. \n`
      }
    })
    return docsValidationHtml
  }

  checkCloseWon() {
    let isBuyerCommissionNotClear = false
    let isBuyerLegalPaymentNotClear = false
    let isBuyerPropsureServiceNotClear = false
    let isSellerCommissionNotClear = false
    let isSellerLegalPaymentNotClear = false
    let isSellerPropsureServiceNotClear = false
    let buyerCommissionPaymentFound = false
    let sellerCommissionPaymentFound = false
    const { user } = this.props
    const { leadInfo, legalSellerListing, legalBuyListing } = this.state
    const { commissions, propsureOutstandingPayment } = leadInfo
    if (commissions && commissions.length) {
      commissions.map((item) => {
        if (item.addedBy === 'buyer') {
          if (item.paymentCategory === 'commission') buyerCommissionPaymentFound = true
          if (item.status !== 'cleared') {
            if (item.paymentCategory === 'commission') isBuyerCommissionNotClear = true
            else if (item.paymentCategory === 'legal_payment') isBuyerLegalPaymentNotClear = true
            else if (item.paymentCategory === 'propsure_services')
              isBuyerPropsureServiceNotClear = true
          }
        } else if (item.addedBy === 'seller') {
          if (item.paymentCategory === 'commission') sellerCommissionPaymentFound = true
          if (item.status !== 'cleared') {
            if (item.paymentCategory === 'commission') isSellerCommissionNotClear = true
            else if (item.paymentCategory === 'legal_payment') isSellerLegalPaymentNotClear = true
            else if (item.paymentCategory === 'propsure_services')
              isSellerPropsureServiceNotClear = true
          }
        }
      })
    }

    let paymentsValidationHtml = ''
    let documentsValidationHtml = ''
    if (this.state.commissionNotApplicableBuyer === false) {
      if (isBuyerCommissionNotClear || !buyerCommissionPaymentFound)
        paymentsValidationHtml += `Buyer advisor's commission payment is not cleared.\n`
      if (isBuyerLegalPaymentNotClear)
        paymentsValidationHtml += `Buyer advisor's legal payment is not cleared.\n`
      if (isBuyerPropsureServiceNotClear)
        paymentsValidationHtml += `Buyer advisor's propsure payment is not cleared.\n`
      if (propsureOutstandingPayment > 0)
        paymentsValidationHtml += `Buyer advisor's propsure outstanding payment is not cleared.\n`

      if (legalBuyListing && legalBuyListing.length && user.organization.type !== 'Franchise')
        documentsValidationHtml += this.docsValidationHtml(legalBuyListing, "Buyer client's")
    }

    if (this.state.commissionNotApplicableSeller === false) {
      if (isSellerCommissionNotClear || !sellerCommissionPaymentFound)
        paymentsValidationHtml += `Seller advisor's commission payment is not cleared.\n`
      if (isSellerLegalPaymentNotClear)
        paymentsValidationHtml += `Seller advisor's legal payment is not cleared.\n`
      if (isSellerPropsureServiceNotClear)
        paymentsValidationHtml += `Seller advisor's propsure payment is not cleared.\n`

      if (legalSellerListing && legalSellerListing.length && user.organization.type !== 'Franchise')
        documentsValidationHtml += this.docsValidationHtml(legalSellerListing, "Seller client's")
    }
    return { paymentEr: paymentsValidationHtml, documentEr: documentsValidationHtml }
  }

  capitalizeWordsWithoutUnderscore = (str, skip = false) => {
    return (
      str &&
      str.replace(/(^|_)./g, function (txt) {
        let withOut = txt.replace(/_/, ' ')
        if (skip) return withOut.charAt(0).toUpperCase() + withOut.substr(1)
        else return withOut.charAt(0).toUpperCase() + withOut.substr(1).toUpperCase()
      })
    )
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

  handleOfficeLocation = (value) => {
    const { rcmPayment, dispatch } = this.props
    dispatch(setRCMPayment({ ...rcmPayment, officeLocationId: value }))
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
              this.submitCommissionPayment()
            })
          },
        },
      ],
      { cancelable: false }
    )
  }

  closeLegalDocument = (addedBy) => {
    const { allProperties, lead } = this.state
    const selectedProperty = allProperties[0]
    this.props.navigation.navigate('LegalAttachments', {
      addedBy: addedBy,
      shorlistedProperty: selectedProperty,
      leadPurpose: lead.purpose,
    })
  }

  toggleMonthlyDetails = () => {
    const { rentMonthlyToggle } = this.state
    this.setState({
      rentMonthlyToggle: !rentMonthlyToggle,
    })
  }

  toggleBuyerDetails = () => {
    const { buyerToggleModal } = this.state
    this.setState({
      buyerToggleModal: !buyerToggleModal,
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
      lead,
      rcmLeadId: lead ? lead.id : null,
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

  goToViewingScreen = () => {
    const { navigation } = this.props
    navigation.navigate('RCMLeadTabs', { screen: 'Viewing' })
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

  setNewActionModal = (value) => {
    this.setState({ newActionModal: value })
  }

  readPermission = () => {
    const { permissions } = this.props
    return getPermissionValue(
      PermissionFeatures.BUY_RENT_LEADS,
      PermissionActions.READ,
      permissions
    )
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
      progressValue,
      lead,
      pickerData,
      formData,
      closedLeadEdit,
      showStyling,
      agreeAmountFromat,
      meetings,
      callModal,
      modalValidation,
      addPaymentLoading,
      assignToAccountsLoading,
      commissionNotApplicableBuyer,
      commissionNotApplicableSeller,
      webView,
      showWebView,
      showDoc,
      deletePaymentVisible,
      agreedNotZero,
      buyerNotZero,
      tokenMenu,
      legalDocLoader,
      officeLocations,
      rentMonthlyToggle,
      buyerSellerCounts,
      buyerToggleModal,
      buyerDetailForm,
      advanceNotZero,
      active,
      statusfeedbackModalVisible,
      modalMode,
      closedWon,
      isFollowUpMode,
      accountPhoneNumbers,
      accountsLoading,
      isMultiPhoneModalVisible,
      newActionModal,
      legalSellerListing,
      legalBuyListing,
    } = this.state
    const { navigation, user, contacts, permissions, shortlistedData } = this.props
    const showMenuItem = helper.checkAssignedSharedStatus(user, lead, permissions, shortlistedData)
    let readPermission = this.readPermission()
    let updatePermission = this.updatePermission()
    return !loading ? (
      <KeyboardAvoidingView
        style={[
          AppStyles.container,
          {
            backgroundColor: AppStyles.colors.backgroundColor,
            paddingLeft: 0,
            paddingRight: 0,
            marginBottom: 10,
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
          legalDocLoader={legalDocLoader}
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
          assignToAccounts={() => {
            this.assignToAccounts()
          }}
          officeLocations={officeLocations}
          handleOfficeLocationChange={this.handleOfficeLocation}
          handleInstrumentInfoChange={this.handleInstrumentInfoChange}
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
        <View style={{ flex: 1, minHeight: '100%', paddingBottom: 65 }}>
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
                      selectForPayment={this.selectForPayment}
                      showConfirmationDialog={this.showConfirmationDialog}
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
                      selectForPayment={this.selectForPayment}
                      showConfirmationDialog={this.showConfirmationDialog}
                    />
                  )}
                  <View>{this.renderSelectPaymentView(item.item)}</View>
                </View>
              )}
              ListFooterComponent={
                <View style={{ marginHorizontal: 10 }}>
                  {lead.shortlist_id !== null ? (
                    lead.purpose === 'sale' || lead.purpose === 'buy' ? (
                      <BuyPaymentView
                        lead={lead}
                        agreedAmount={agreedAmount}
                        handleAgreedAmountChange={this.handleAgreedAmountChange}
                        handleAgreedAmountPress={this.handleAgreedAmountPress}
                        showAndHideStyling={this.showAndHideStyling}
                        showStylingState={showStyling}
                        agreeAmountFromat={agreeAmountFromat}
                        onAddCommissionPayment={this.onAddCommissionPayment}
                        editTile={this.setCommissionEditData}
                        user={user}
                        currentProperty={allProperties}
                        commissionNotApplicableBuyer={commissionNotApplicableBuyer}
                        commissionNotApplicableSeller={commissionNotApplicableSeller}
                        setBuyerCommissionApplicable={this.showConfirmationDialogClosePayment}
                        setSellerCommissionApplicable={this.showConfirmationDialogClosePayment}
                        onPaymentLongPress={this.onPaymentLongPress}
                        agreedNotZero={agreedNotZero}
                        toggleTokenMenu={this.toggleTokenMenu}
                        tokenMenu={tokenMenu}
                        confirmTokenAction={this.confirmTokenAction}
                        closeLegalDocument={this.closeLegalDocument}
                        buyerSellerCounts={buyerSellerCounts}
                        buyerToggleModal={buyerToggleModal}
                        toggleBuyerDetails={this.toggleBuyerDetails}
                        formData={buyerDetailForm}
                        handleForm={this.handleBuyerForm}
                        advanceNotZero={advanceNotZero}
                        call={this.fetchPhoneNumbers}
                        readPermission={readPermission}
                        updatePermission={updatePermission}
                        closedLeadEdit={closedLeadEdit}
                      />
                    ) : (
                      <RentPaymentView
                        pickerData={pickerData}
                        handleForm={this.handleForm}
                        formData={formData}
                        lead={lead}
                        onAddCommissionPayment={this.onAddCommissionPayment}
                        editTile={this.setCommissionEditData}
                        user={user}
                        currentProperty={allProperties}
                        commissionNotApplicableBuyer={commissionNotApplicableBuyer}
                        commissionNotApplicableSeller={commissionNotApplicableSeller}
                        setBuyerCommissionApplicable={this.showConfirmationDialogClosePayment}
                        setSellerCommissionApplicable={this.showConfirmationDialogClosePayment}
                        onPaymentLongPress={this.onPaymentLongPress}
                        toggleTokenMenu={this.toggleTokenMenu}
                        tokenMenu={tokenMenu}
                        toggleMonthlyDetails={this.toggleMonthlyDetails}
                        rentMonthlyToggle={rentMonthlyToggle}
                        updateRentLead={this.updateRentLead}
                        confirmTokenAction={this.confirmTokenAction}
                        closeLegalDocument={this.closeLegalDocument}
                        buyerSellerCounts={buyerSellerCounts}
                        call={this.fetchPhoneNumbers}
                        readPermission={readPermission}
                        updatePermission={updatePermission}
                        closedLeadEdit={closedLeadEdit}
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

          <StatusFeedbackModal
            visible={statusfeedbackModalVisible}
            showFeedbackModal={(value, modalMode) => this.showStatusFeedbackModal(value, modalMode)}
            commentsList={
              modalMode === 'call'
                ? StaticData.commentsFeedbackCall
                : StaticData.leadClosedCommentsFeedback
            }
            modalMode={modalMode}
            rejectLead={(body) => this.rejectLead(body)}
            setNewActionModal={(value) => this.setNewActionModal(value)}
            leadType={'RCM'}
          />
          <SubmitFeedbackOptionsModal
            showModal={newActionModal}
            modalMode={modalMode}
            setShowModal={(value) => this.setNewActionModal(value)}
            performFollowUp={this.openModalInFollowupMode}
            performReject={this.goToRejectForm}
            //call={this.callAgain}
            goToViewingScreen={this.goToViewingScreen}
            leadType={'RCM'}
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
              closeLead={this.showLeadPaymentModal}
              closedLeadEdit={closedLeadEdit}
              callButton={true}
              customer={lead.customer}
              lead={lead}
              goToHistory={this.goToHistory}
              getCallHistory={this.getCallHistory}
              goToFollowUp={(value) => this.openModalInFollowupMode(value)}
              navigation={navigation}
              goToRejectForm={this.goToRejectForm}
              showStatusFeedbackModal={(value) => this.showStatusFeedbackModal(value)}
              setCurrentCall={(call) => this.setCurrentCall(call)}
              leadType={'RCM'}
              closedWon={closedWon}
              onHandleCloseLead={this.onHandleCloseLead}
              closedWonOptionVisible={true}
              checkCloseWon={this.checkCloseWon()}
              leadData={this.state.leadInfo}
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
    shortlistedData: store.drawer.shortlistedData,
  }
}

export default connect(mapStateToProps)(LeadRCMPayment)
