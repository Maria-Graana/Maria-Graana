/** @format */

import axios from 'axios'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as MediaLibrary from 'expo-media-library'
import * as Permissions from 'expo-permissions'
import { ActionSheet } from 'native-base'
import React, { Component } from 'react'
import { Alert, FlatList, Text, View, TouchableOpacity } from 'react-native'
import UploadAttachment from '../../components/UploadAttachment'
import { AntDesign } from '@expo/vector-icons'
import { connect } from 'react-redux'
import { Buffer } from 'buffer'
import _ from 'underscore'
import AppStyles from '../../AppStyles'
import LegalTile from '../../components/LegalTile'
import LoadingNoResult from '../../components/LoadingNoResult'
import { setLegalPayment } from '../../actions/legalPayment'
import AccountsPhoneNumbers from '../../components/AccountsPhoneNumbers'
import ViewDocs from '../../components/ViewDocs'
import helper from '../../helper'
import StaticData from '../../StaticData'
import RCMBTN from '../../components/RCMBTN'
import RoundPlus from '../../../assets/img/roundPlus.png'
import AddLegalPaymentModal from '../../components/AddLegalPayment'
import { setlead } from '../../actions/lead'
import CommissionTile from '../../components/CommissionTile'
import DeleteModal from '../../components/DeleteModal'
import styles from './style'
import {
  clearInstrumentInformation,
  getInstrumentDetails,
  setInstrumentInformation,
} from '../../actions/addInstrument'

var BUTTONS = ['Delete', 'Cancel']
var CANCEL_INDEX = 1
class LegalAttachment extends Component {
  attachments = []
  constructor(props) {
    super(props)
    const { route } = this.props
    this.state = {
      isVisible: false,
      checkValidation: false,
      title: '',
      formData: { fileName: '', size: '', uri: '', category: '' },
      showDoc: false,
      docUrl: '',
      legalListing: [],
      loading: false,
      showWebView: false,
      showDoc: false,
      buyerNotZero: false,
      modalValidation: false,
      addPaymentLoading: false,
      assignToAccountsLoading: false,
      checkListDoc: null,
      legalPaymentObj: null,
      editable: false,
      legalServicesFee: null,
      officeLocations: [],
      showAction: false,
      currentItem: {},
      accountPhoneNumbers: [],
      accountsLoading: false,
      isMultiPhoneModalVisible: false,
    }
  }

  componentDidMount() {
    this.fetchLead()
    this.fetchDocuments()
    this.fetchLegalPaymentInfo()
    this.fetchOfficeLocations()
  }

  componentWillUnmount() {
    this.clearReduxAndStateValues()
  }

  fetchLegalPaymentInfo = () => {
    this.setState({ loading: true }, () => {
      axios
        .get(`/api/leads/legalPayment`)
        .then((res) => {
          this.setState({
            legalServicesFee: res.data,
          })
        })
        .finally(() => {
          this.setState({ loading: false })
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

  fetchLead = () => {
    const { dispatch, lead, route } = this.props
    this.setState({ loading: true }, () => {
      axios
        .get(`/api/leads/byId?id=${lead.id}`)
        .then((response) => {
          if (response.data) {
            dispatch(setlead(response.data))
            let mailCheck = this.mailSentCheck()
            if (mailCheck) {
              const { legalDocuments, commissions } = response.data
              let newcheckListDoc =
                legalDocuments &&
                legalDocuments.length &&
                _.find(legalDocuments, (item) => {
                  return (
                    item.category === 'legal_checklist' && item.addedBy === route.params.addedBy
                  )
                })
              let newlegalPayment =
                commissions &&
                commissions.length &&
                _.find(commissions, (item) => {
                  return (
                    item.paymentCategory === 'legal_payment' &&
                    item.addedBy === route.params.addedBy
                  )
                })
              if (!newcheckListDoc) {
                newcheckListDoc = {
                  fileKey: null,
                  id: 1,
                  category: 'legal_checklist',
                  name: 'CHECKLIST',
                  status: 'pending',
                }
              } else newcheckListDoc.name = 'CHECKLIST'
              this.setState({
                checkListDoc: newcheckListDoc,
                legalPaymentObj: newlegalPayment,
                assignToAccountsLoading: false,
                showAction: false,
              })
            }
          }
        })
        .finally(() => {
          this.setState({ loading: false })
        })
    })
  }

  fetchDocuments = () => {
    const { route, lead } = this.props
    let list =
      route.params.addedBy === 'buyer'
        ? _.clone(StaticData.BuyerLegalDocumentsList)
        : _.clone(StaticData.SellerLegalDocumentsList)
    this.setState({ loading: true }, () => {
      axios
        .get(`/api/leads/listLegalDocuments?leadId=${lead.id}&addedBy=${route.params.addedBy}`)
        .then((res) => {
          if (res.data && res.data.length) {
            list = helper.setLegalListing(list, res.data)
          }
          this.setState({
            legalListing: list,
            loading: false,
          })
        })
        .catch((error) => {
          console.log('error: ', error)
        })
        .finally(() => {
          this.setState({ loading: false })
        })
    })
  }

  handleForm = (formData) => {
    const { currentItem } = this.state
    formData.category = currentItem.category
    console.log('handleForm: ', formData)
    this.setState(
      {
        formData: formData,
        showAction: false,
      },
      () => {
        this.uploadAttachment(this.state.formData)
      }
    )
  }

  toggleActionSheet = (data) => {
    this.setState({
      showAction: true,
      currentItem: data,
    })
  }

  getAttachmentFromStorage = (data) => {
    const { title, formData } = this.state
    var newFormData = { ...formData }
    let options = {
      type: '*/*',
      copyToCacheDirectory: true,
    }
    DocumentPicker.getDocumentAsync(options)
      .then((item) => {
        if (item.type === 'cancel' && newFormData.fileName === '') {
          // App should prompt a pop message in-case file is already selected
          Alert.alert('Pick File', 'Please pick a file from documents!')
        } else {
          if (item.name && item.name !== '') {
            newFormData.fileName = item.name
            newFormData.size = item.size
            newFormData.uri = item.uri
            newFormData.category = data.category
            this.setState({
              formData: newFormData,
              loading: true,
            })
            this.uploadAttachment(newFormData)
          }
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  uploadAttachment = (legalAttachment) => {
    const { route, lead } = this.props
    const { checkListDoc } = this.state
    let attachment = {
      name: legalAttachment.fileName,
      type: 'file/' + legalAttachment.fileName.split('.').pop(),
      uri: legalAttachment.uri,
    }
    let fd = new FormData()
    fd.append('file', attachment)
    // ====================== API call for Attachments base on Payment ID
    let url = `/api/leads/legalDocuments?leadId=${lead.id}&category=${legalAttachment.category}&addedBy=${route.params.addedBy}`
    if (legalAttachment.category === 'legal_checklist')
      url = `/api/leads/checklist?id=${checkListDoc.id}&addedBy=${route.params.addedBy}`
    axios
      .post(url, fd)
      .then((res) => {
        if (res.data) {
          this.fetchLead()
          this.fetchDocuments()
        }
      })
      .catch((error) => {
        console.log('Attachment Error: ', error)
        helper.errorToast('Attachment Error: ', error)
      })
  }

  deleteAttachmentFromServer = (item) => {
    axios
      .delete(`/api/leads/legalDocument?id=${item.id}`)
      .then((res) => {
        this.fetchLead()
        this.fetchDocuments()
      })
      .catch((error) => {
        console.log('error', error.message)
      })
  }

  showDeleteDialog(item) {
    Alert.alert(
      'Delete attachment',
      'Are you sure you want to delete this attachment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => this.deleteAttachmentFromServer(item),
        },
      ],
      { cancelable: false }
    )
  }

  // *******  View Documents Modal  *************
  closeDocsModal = () => {
    const { showDoc } = this.state
    this.setState({
      showDoc: !showDoc,
    })
  }

  // *******  DownLoad Documents Functions  *************
  downloadFile = async (doc) => {
    if (doc && 'id' in doc) {
      let fileUri = FileSystem.documentDirectory + doc.fileName
      FileSystem.downloadAsync(doc.value, fileUri)
        .then(({ uri }) => {
          this.saveFile(uri, doc)
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
            this.viewAttachments(doc)
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

  // *******  View Documents  *************
  viewAttachments = (data) => {
    this.setState({
      showDoc: true,
      docUrl: data.value,
    })
  }

  // *******  View Documents  *************
  submitMenu = (value, data) => {
    if (value === 'edit') {
      data.value = data.category
      this.toggleActionSheet(data)
    }
    if (value === 'remove') {
      this.showDeleteDialog(data)
    }
    if (value === 'assign_to_legal') {
      this.submitToAssignLegal(data)
    }
  }

  // *******  Assign To Legal  *************
  submitToAssignLegal = (data) => {
    axios
      .patch(`/api/leads/legalDocument?id=${data.id}`, {
        status: 'pending_legal',
      })
      .then((res) => {
        this.fetchLead()
        this.fetchDocuments()
      })
      .catch((error) => {
        console.log(`ERROR: /api/leads/legalDocument?id=${data.id}`, error)
      })
  }

  // *******  DownLoad Legal Documents Functions  *************
  downloadLegalDocs = async (doc) => {
    if (doc) {
      helper.warningToast('File Downloading...')
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
          helper.warning('ERROR: Downloading File')
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
        helper.warning('ERROR: Downloading File')
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

  toggleWebView = () => {
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

  // Request for legal services
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
    const { lead, route } = this.props
    const { shorlistedProperty, addedBy } = route.params
    axios
      .post(
        `/api/leads/sendLegalEmail?leadId=${lead.id}&shortlistId=${shorlistedProperty.id}&addedBy=${addedBy}`
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

  // *********** Legal Payment WorkFlow ******************

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
    dispatch(setLegalPayment({ ...newData }))
  }

  onAddCommissionPayment = (addedBy, paymentCategory) => {
    const { dispatch, legalPayment } = this.props
    dispatch(setLegalPayment({ ...legalPayment, visible: true, addedBy, paymentCategory }))
  }

  onModalCloseClick = () => {
    this.clearReduxAndStateValues()
  }

  handleCommissionChange = (value, name) => {
    const { legalPayment, dispatch, lead, addInstrument } = this.props
    const newSecondFormData = { ...legalPayment, visible: legalPayment.visible }
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
    dispatch(setLegalPayment(newSecondFormData))
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
    this.setState({
      editable: true,
    })
    dispatch(
      setLegalPayment({
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
    const { legalPayment, dispatch, navigation } = this.props
    dispatch(setLegalPayment({ ...legalPayment, visible: false }))
    navigation.navigate('LegalPaymentAttachment')
  }

  uploadLegalPaymentAttachment = (paymentAttachment, paymentId) => {
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

  submitLegalPayment = () => {
    const { legalPayment, user, lead } = this.props
    const { editable } = this.state

    if (
      legalPayment.installmentAmount != null &&
      legalPayment.installmentAmount != '' &&
      legalPayment.type != ''
    ) {
      if (Number(legalPayment.installmentAmount) <= 0) {
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
          legalPayment.type === 'cheque' ||
          legalPayment.type === 'pay-Order' ||
          legalPayment.type === 'bank-Transfer'
        ) {
          // for cheque,pay order and bank transfer
          let isValid = this.checkInstrumentValidation()
          if (isValid) {
            this.addEditLegalInstrumentOnServer()
          }
        } else {
          // for all other types
          body = {
            ...legalPayment,
            rcmLeadId: lead.id,
            armsUserId: user.id,
            addedBy: legalPayment.addedBy,
            active: true,
          }
          delete body.visible
          this.addLegalPayment(body)
        }
      } else {
        let body = {}
        // payment update mode
        if (
          legalPayment.type === 'cheque' ||
          legalPayment.type === 'pay-Order' ||
          legalPayment.type === 'bank-Transfer'
        ) {
          // for cheque,pay order and bank transfer
          let isValid = this.checkInstrumentValidation()
          if (isValid) {
            this.addEditLegalInstrumentOnServer(true)
          }
        } else {
          // for all other types
          body = { ...legalPayment }
          this.updateLegalPayment(body)
        }
      }
    } else {
      // Installment amount or type is missing so validation goes true, show error
      this.setState({
        modalValidation: true,
      })
    }
  }

  addLegalPayment = (body) => {
    const { legalPayment, dispatch } = this.props
    let toastMsg = 'Legal Payment Added'
    let errorMsg = 'Error Adding Legal Payment'
    let baseUrl = `/api/leads/project/payments`
    axios
      .post(baseUrl, body)
      .then((response) => {
        if (response.data) {
          // check if some attachment exists so upload that as well to server with payment id.
          if (legalPayment.paymentAttachments.length > 0) {
            legalPayment.paymentAttachments.map((paymentAttachment) =>
              // payment attachments
              this.uploadLegalPaymentAttachment(paymentAttachment, response.data.id)
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
        dispatch(clearInstrumentInformation())
        this.clearReduxAndStateValues()
      })
  }

  updateLegalPayment = (body) => {
    const { legalPayment, dispatch } = this.props
    let toastMsg = 'Legal Payment Updated'
    let errorMsg = 'Error Updating Legal Payment'
    let baseUrl = `/api/leads/project/payment` // for patch request
    let paymentID = body.id
    delete body.visible
    delete body.remarks
    delete body.id

    axios
      .patch(`${baseUrl}?id=${paymentID}`, body)
      .then((response) => {
        // upload only the new attachments that do not have id with them in object.
        const filterAttachmentsWithoutId = legalPayment.paymentAttachments
          ? _.filter(legalPayment.paymentAttachments, (item) => {
              return !_.has(item, 'id')
            })
          : []
        if (filterAttachmentsWithoutId.length > 0) {
          filterAttachmentsWithoutId.map((item, index) => {
            // payment attachments
            this.uploadLegalPaymentAttachment(item, paymentID)
          })
        } else {
          this.fetchLead()
          helper.successToast(toastMsg)
        }
      })
      .catch((error) => {
        helper.errorToast(errorMsg)
        console.log('ERROR: ', error)
      })
      .finally(() => {
        dispatch(clearInstrumentInformation())
        this.clearReduxAndStateValues()
      })
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

  addEditLegalInstrumentOnServer = (isLegalEdit = false) => {
    let body = {}
    const { addInstrument, legalPayment, dispatch, lead, user } = this.props
    if (addInstrument.id) {
      // selected existing instrument // add mode
      body = {
        ...legalPayment,
        rcmLeadId: lead.id,
        armsUserId: user.id,
        addedBy: legalPayment.addedBy,
        active: true,
        instrumentId: addInstrument.id,
      }
      delete body.visible
      if (isLegalEdit) {
        this.updateLegalPayment(body)
      } else {
        this.addLegalPayment(body)
      }
    } else {
      // add mode // new instrument info
      axios
        .post(`api/leads/instruments`, addInstrument)
        .then((res) => {
          if (res && res.data) {
            body = {
              ...legalPayment,
              rcmLeadId: lead.id,
              armsUserId: user.id,
              addedBy: legalPayment.addedBy,
              active: true,
              instrumentId: res.data.id,
            }
            if (isLegalEdit) this.updateLegalPayment(body)
            else this.addLegalPayment(body)
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
            const { legalPayment, dispatch } = this.props
            await dispatch(
              setLegalPayment({ ...legalPayment, visible: false, status: 'pendingAccount' })
            )
            this.setState({ assignToAccountsLoading: true }, () => {
              this.submitLegalPayment()
            })
          },
        },
      ],
      { cancelable: false }
    )
  }

  onPaymentLongPress = (data) => {
    const { dispatch } = this.props
    dispatch(setLegalPayment({ ...data }))
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

  handleOfficeLocation = (value) => {
    const { legalPayment, dispatch } = this.props
    dispatch(setLegalPayment({ ...legalPayment, officeLocationId: value }))
  }

  deletePayment = async (reason) => {
    const { legalPayment } = this.props
    this.showHideDeletePayment(false)
    const url = `/api/leads/payment?id=${legalPayment.id}&reason=${reason}`
    const response = await axios.delete(url)
    if (response.data) {
      this.clearReduxAndStateValues()
      this.fetchLead()
      helper.successToast(response.data.message)
    } else {
      helper.errorToast('ERROR DELETING PAYMENT!')
    }
  }

  showHideDeletePayment = (val) => {
    this.setState({ deletePaymentVisible: val })
  }

  checkReadOnlyMode = () => {
    const { lead } = this.props
    const isLeadClosed =
      lead.status === StaticData.Constants.lead_closed_lost ||
      lead.status === StaticData.Constants.lead_closed_won
    if (isLeadClosed) {
      return true
    } else return false
  }

  mailSentCheck = () => {
    const { lead, route } = this.props
    if (route.params.addedBy === 'seller') return lead.sellerLegalMail
    else return lead.legalMailSent
  }

  legalDownLoadTile = (item) => {
    return (
      <TouchableOpacity
        style={styles.btnView}
        onPress={() => {
          if (item) this.downloadLegalDocs(item)
        }}
        activeOpacity={0.7}
      >
        <View style={[AppStyles.flexDirectionRow, styles.tileView]}>
          <View style={styles.tileInnerView}>
            <Text style={styles.titleText} numberOfLines={2}>
              {item && item.name}
            </Text>
          </View>
          <View style={styles.iconView}>
            <AntDesign name="checkcircleo" size={32} color={AppStyles.colors.primaryColor} />
          </View>
        </View>
      </TouchableOpacity>
    )
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

  render() {
    const {
      legalListing,
      loading,
      showDoc,
      webView,
      showWebView,
      modalValidation,
      buyerNotZero,
      addPaymentLoading,
      assignToAccountsLoading,
      checkListDoc,
      legalPaymentObj,
      deletePaymentVisible,
      legalServicesFee,
      officeLocations,
      showAction,
      accountPhoneNumbers,
      accountsLoading,
      isMultiPhoneModalVisible,
    } = this.state
    const { lead, route, contacts } = this.props
    let mailCheck = this.mailSentCheck()
    let onReadOnly = this.checkReadOnlyMode()
    const isLeadClosed =
      lead.status === StaticData.Constants.lead_closed_lost ||
      lead.status === StaticData.Constants.lead_closed_won
    return (
      <View style={[AppStyles.mb1]}>
        <UploadAttachment showAction={showAction} submitUploadedAttachment={this.handleForm} />
        <AddLegalPaymentModal
          onModalCloseClick={this.onModalCloseClick}
          handleCommissionChange={this.handleCommissionChange}
          modalValidation={modalValidation}
          goToPayAttachments={() => this.goToPayAttachments()}
          submitCommissionPayment={() => {
            this.setState({ addPaymentLoading: true }, () => {
              this.submitLegalPayment()
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
        <AccountsPhoneNumbers
          toggleAccountPhone={this.toggleAccountPhone}
          isMultiPhoneModalVisible={isMultiPhoneModalVisible}
          contacts={accountPhoneNumbers}
          loading={accountsLoading}
          phoneContacts={contacts}
        />
        <DeleteModal
          isVisible={deletePaymentVisible}
          deletePayment={(reason) => this.deletePayment(reason)}
          showHideModal={(val) => this.showHideDeletePayment(val)}
        />
        {showWebView ? (
          <ViewDocs
            imageView={true}
            isVisible={showDoc}
            closeModal={this.toggleWebView}
            url={webView}
          />
        ) : null}
        {!loading ? (
          <View style={[styles.mainView, AppStyles.mb1]}>
            <View style={[styles.pad15, styles.padV15]}>
              {!mailCheck ? (
                <RCMBTN
                  onClick={() => {
                    this.showLegalRequestConfirmation()
                  }}
                  btnText={'REQUEST TRANSFER SERVICES'}
                  checkLeadClosedOrNot={false}
                  hiddenBtn={false}
                  addBorder={true}
                  isLeadClosed={isLeadClosed}
                />
              ) : null}
              {mailCheck ? (
                <View style={styles.transferView}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.mandatoryText}>TRANSFER SERVICES</Text>
                    <Text
                      style={[styles.mandatoryText, { fontFamily: AppStyles.fonts.semiBoldFont }]}
                    >
                      PKR{' '}
                      <Text style={styles.mandatoryText}>
                        {legalServicesFee && legalServicesFee.fee}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.pad15}>
                    {!legalPaymentObj && legalServicesFee && legalServicesFee.fee > 0 ? (
                      <RCMBTN
                        onClick={() => {
                          this.onAddCommissionPayment(route.params.addedBy, 'legal_payment')
                        }}
                        btnImage={RoundPlus}
                        btnText={'ADD LEGAL SERVICES PAYMENT'}
                        checkLeadClosedOrNot={false}
                        hiddenBtn={false}
                        addBorder={true}
                        isLeadClosed={isLeadClosed}
                      />
                    ) : null}
                    {legalPaymentObj && legalServicesFee && legalServicesFee.fee > 0 ? (
                      <CommissionTile
                        data={legalPaymentObj}
                        editTile={this.setCommissionEditData}
                        onPaymentLongPress={() => this.onPaymentLongPress(legalPaymentObj)}
                        commissionEdit={onReadOnly}
                        title={legalPaymentObj ? 'LEGAL PAYMENT' : ''}
                        call={this.fetchPhoneNumbers}
                        showAccountPhone={true}
                      />
                    ) : null}
                  </View>
                  {checkListDoc && checkListDoc.fileKey !== null ? (
                    <View>{this.legalDownLoadTile(checkListDoc)}</View>
                  ) : (
                    <LegalTile
                      data={checkListDoc}
                      index={null}
                      submitMenu={() => {}}
                      getAttachmentFromStorage={() => {}}
                      downloadLegalDocs={() => {}}
                      isLeadClosed={isLeadClosed}
                      addBorder={true}
                    />
                  )}
                </View>
              ) : null}
            </View>
            <Text style={styles.mandatoryText}>DOCUMENTS</Text>
            <FlatList
              data={legalListing}
              renderItem={({ item, index }) => (
                <LegalTile
                  data={item}
                  index={index + 1}
                  submitMenu={this.submitMenu}
                  getAttachmentFromStorage={this.toggleActionSheet}
                  downloadLegalDocs={this.downloadLegalDocs}
                  isLeadClosed={isLeadClosed}
                />
              )}
              keyExtractor={(item, index) => {
                index.toString()
              }}
            />
          </View>
        ) : (
          <LoadingNoResult loading={loading} />
        )}
      </View>
    )
  }
}
mapStateToProps = (store) => {
  return {
    legalPayment: store.LegalPayment.LegalPayment,
    addInstrument: store.Instruments.addInstrument,
    instruments: store.Instruments.instruments,
    contacts: store.contacts.contacts,
    lead: store.lead.lead,
    user: store.user.user,
  }
}
export default connect(mapStateToProps)(LegalAttachment)
