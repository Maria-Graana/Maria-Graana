/** @format */

import axios from 'axios'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as MediaLibrary from 'expo-media-library'
import { ActionSheet } from 'native-base'
import moment from 'moment-timezone'
import React, { Component } from 'react'
import { Alert, FlatList, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import DateTimePicker from '../../components/DatePicker'
import UploadAttachment from '../../components/UploadAttachment'
import LegalComments from '../../components/LegalComments'
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
import PickerComponent from '../../components/Picker/index'
import styles from './style'
import {
  clearInstrumentInformation,
  getInstrumentDetails,
  setInstrumentInformation,
} from '../../actions/addInstrument'
import TouchableButton from '../../components/TouchableButton'
import style from '../../components/LegalTile/style'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'

var BUTTONS = ['Delete', 'Cancel']
var CANCEL_INDEX = 1
class LegalAttachment extends Component {
  attachments = []
  constructor(props) {
    super(props)
    const { lead, user, permissions, shortlistedData } = this.props
    this.state = {
      otherDoc: false,
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
      toggleCommentModal: false,
      commentModalLoading: false,
      documentComments: [],
      firstFormData: {
        legalService: 'internal',
        legalDescription: 'client',
      },
      selectedDocument: null,
      transferDate: null,
      viewCommentsCheck: false,
      closedLeadEdit: helper.checkAssignedSharedStatus(user, lead, permissions, shortlistedData),
    }
  }

  componentDidMount() {
    this.fetchLead()
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
        .get(`/api/leads/byId?id=${lead.id}&legal=true&transfer=true`)
        .then((response) => {
          if (response.data) {
            dispatch(setlead(response.data))
            this.fetchDocuments(response.data)
            let mailCheck = this.mailSentCheck()
            if (mailCheck) {
              this.setState({
                checkListDoc: this.checkListDoc(response.data),
                legalPaymentObj: this.checkLegalPayment(response.data),
                assignToAccountsLoading: false,
                showAction: false,
                transferDate: response.data.transferedDate,
              })
            }
          }
        })
        .finally(() => {
          this.setState({ loading: false })
        })
    })
  }

  checkLegalPayment = (lead) => {
    const { route } = this.props
    const { commissions } = lead
    let newlegalPayment =
      commissions &&
      commissions.length &&
      _.find(commissions, (item) => {
        return item.paymentCategory === 'legal_payment' && item.addedBy === route.params.addedBy
      })
    return newlegalPayment
  }

  setDefaultOfficeLocation = () => {
    const { legalPayment, user, dispatch } = this.props
    let defaultUserLocationId = user.officeLocationId
    dispatch(setLegalPayment({ ...legalPayment, officeLocationId: defaultUserLocationId }))
    return defaultUserLocationId
  }

  checkListDoc = (lead) => {
    const { route } = this.props
    const { legalDocuments } = lead
    let newcheckListDoc =
      legalDocuments &&
      legalDocuments.length &&
      _.find(legalDocuments, (item) => {
        return item.category === 'legal_checklist' && item.addedBy === route.params.addedBy
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
    return newcheckListDoc
  }

  fetchDocuments = (lead) => {
    const { route } = this.props
    const { addedBy } = route.params
    axios
      .get(
        `/api/legal/documents/${lead.id}?addedBy=${addedBy}&leadType=${lead.purpose}&legalType=${lead.legalType}`
      )
      .then((res) => {
        if (res.data && res.data.length) {
          this.setState({
            legalListing: helper.setLegalListing(res.data),
            firstFormData: {
              legalService: addedBy === 'buyer' ? lead.legalTypeBuyer : lead.legalTypeSeller,
              legalDescription:
                addedBy === 'buyer' ? lead.legalDescriptionBuyer : lead.legalDescriptionSeller,
            },
          })
        }
      })
      .catch((error) => {
        console.log('error: ', error)
      })
  }

  confirmationLegalService = (legalType, legalDescription) => {
    let that = this
    const { firstFormData } = this.state
    setTimeout(function () {
      Alert.alert(
        `Change to ${helper.capitalize(firstFormData.legalService)}`,
        `Are you sure you want to change to ${helper.capitalize(
          firstFormData.legalService
        )} Services? If you continue, you may have to upload some legal documents again.`,
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes',
            onPress: async () => {
              that.updateLegalService(legalType, legalDescription)
            },
          },
        ],
        { cancelable: false }
      )
    }, 600)
  }

  updateLegalService = (legalType, legalDescription) => {
    const { route, lead } = this.props
    axios
      .post(
        `/api/legal/updateService?leadId=${lead.id}&legalType=${legalType}&legalDescription=${
          legalType === 'internal' ? 'agent' : legalDescription
        }&addedBy=${route.params.addedBy}`
      )
      .then((res) => {
        this.fetchLead()
      })
      .catch((error) => {
        console.log(
          `/api/legal/updateService?leadId=${lead.id}&legalType=${legalType}&legalDescription=${
            legalType === 'internal' ? 'agent' : legalDescription
          }}&addedBy=${route.params.addedBy}`,
          error
        )
      })
  }

  setTransferDate = (date) => {
    const { route, lead } = this.props
    this.setState({
      transferDate: date,
    })
    axios
      .patch(`/api/legal/transferDate?addedBy=${route.params.addedBy}&leadId=${lead.id}`, {
        transferDate: date,
      })
      .then((res) => {
        this.fetchLead()
      })
      .catch((error) => {
        console.log(`legal/transferDate?addedBy=${route.params.addedBy}&leadId=${lead.id}`, error)
      })
  }

  handleForm = (formData) => {
    const { currentItem } = this.state
    formData.category = this.state.otherDoc ? 'other' : currentItem.category
    this.setState(
      {
        showAction: false,
        formData: formData,
      },
      () => {
        this.uploadAttachment(formData)
      }
    )
  }

  submitForm = (formData) => {
    const { currentItem } = this.state
    formData.category = currentItem.category
    this.setState(
      {
        formData: formData,
        showAction: false,
        loading: true,
      },
      () => {
        // this.uploadAttachment(this.state.formData)
        ///View Doc
        this.uploadAttachment(formData)
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
      copyToCacheDirectory: false,
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
    const propertyID =
      lead && lead.paymentProperty.origin === 'arms'
        ? lead.paymentProperty.arms_id
        : lead.paymentProperty.graana_id

    const { checkListDoc, currentItem } = this.state
    let attachment = {
      uri: legalAttachment.uri,
      type: 'file/' + legalAttachment.fileName.split('.').pop(),
      name: legalAttachment.fileName,
    }

    let fd = new FormData()
    fd.append('file', attachment)
    // ====================== API call for Attachments base on Payment ID
    let url = `/api/legal/document?legalId=${currentItem.id}`
    if (legalAttachment.category === 'legal_checklist')
      url = `/api/leads/checklist?id=${checkListDoc.id}&addedBy=${route.params.addedBy}`
    else if (!legalAttachment?.category) {
      url = `/api/legal/document?legalId=&scaflow=true&propertyId=${propertyID}&leadId=${lead.id}&docCategory=other&addedBy=${route.params.addedBy}`
      this.setState({
        otherDoc: false,
      })
    }

    axios
      .post(url, fd)
      .then((res) => {
        if (res.data) {
          this.fetchLead()
        }
      })
      .catch((error) => {
        console.log('Attachment Error: ', error)
        helper.errorToast('Attachment Error: ', error)
      })
  }

  deleteAttachmentFromServer = (item) => {
    axios
      .delete(`/api/legal/document?id=${item.id}`)
      .then((res) => {
        this.fetchLead()
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

  // saveFile = async (fileUri, doc) => {
  //   const { status } = await MediaLibrary.requestPermissionsAsync()
  //   if (status === 'granted') {
  //     const asset = await MediaLibrary.createAssetAsync(fileUri)
  //     MediaLibrary.createAlbumAsync('ARMS', asset, false).then((res) => {
  //       helper.successToast('File Downloaded!')
  //       FileSystem.getContentUriAsync(fileUri).then((cUri) => {
  //         let fileType = doc.fileName.split('.').pop()
  //         if (fileType.includes('jpg') || fileType.includes('png') || fileType.includes('jpeg')) {
  //           this.viewAttachments(doc)
  //         } else {
  //           if (fileType.includes('pdf')) fileType = 'application/pdf'
  //           else fileType = fileType
  //           IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
  //             data: cUri,
  //             flags: 1,
  //             type: fileType,
  //           })
  //         }
  //       })
  //     })
  //   }
  // }

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
    if (value === 'submit_to_legal') {
      this.toggleComments(data, false)
    }
    if (value === 'view_legal') {
      this.toggleComments(data, true)
    }
  }

  toggleComments = (data, viewCommentsCheck) => {
    const { toggleCommentModal } = this.state
    if (!toggleCommentModal === true) {
      this.fetchComments(data)
      this.setState({
        showAction: false,
        toggleCommentModal: !toggleCommentModal,
        commentModalLoading: !toggleCommentModal === true ? true : false,
        selectedDocument: data,
        viewCommentsCheck: viewCommentsCheck,
      })
    } else {
      this.setState({
        toggleCommentModal: !toggleCommentModal,
        commentModalLoading: !toggleCommentModal === true ? true : false,
      })
    }
  }

  // *********** fetch Comments ***************
  fetchComments = (data) => {
    this.setState({ commentModalLoading: true }, () => {
      axios
        .get(`/api/legal/document/comments?documentId=${data.id}`)
        .then((res) => {
          this.setState({
            documentComments: helper.setCommentsPayload(res.data),
            commentModalLoading: false,
          })
        })
        .finally(() => {
          this.setState({ commentModalLoading: false })
        })
    })
  }

  // *******  DownLoad Legal Documents Functions  *************
  downloadLegalDocs = async (doc) => {
    if (doc) {
      helper.warningToast('File Downloading...')

      axios
        ///api/legal/document?legalId=21544
        .get(`/api/legal/document?legalId=${doc.id}`, {
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
        `/api/legal/requestService?leadId=${lead.id}&shortlistId=${shorlistedProperty.id}&addedBy=${addedBy}`
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
      instrumentDuplicateError: null,
      officeLocationId: this.setDefaultOfficeLocation(),
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

    body.officeLocationId = this.setDefaultOfficeLocation()
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
            if (res.data.status === false) {
              dispatch(
                setLegalPayment({
                  ...legalPayment,
                  instrumentDuplicateError: res.data.message,
                })
              )
              this.setState({ addPaymentLoading: false, assignToAccountsLoading: false })
              return
            }
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

  // ************ EXTERNAL INTERNAL LEGAL WORKFLOW FIELDS ******************
  handleFirstForm = (value, name) => {
    const { firstFormData } = this.state
    let formData = firstFormData
    formData[name] = value
    if (name !== 'legalDescription')
      this.confirmationLegalService(formData.legalService, formData.legalDescription)
    else this.updateLegalService(formData.legalService, formData.legalDescription)
  }

  TransferDate = () => {
    return (
      <TouchableOpacity style={[styles.legalBtnView]} disabled={true}>
        <View style={[styles.statusTile]}>
          <Text style={styles.transferText}>TRANSFER DATE:</Text>
          <Text style={styles.dateText}>{moment(new Date()).format('MMM DD, YYYY')}</Text>
        </View>
      </TouchableOpacity>
    )
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

  cancelFileUploading = () => {
    this.setState({
      formData: { fileName: '', size: '', uri: '', category: '' },
    })
  }

  filterByID(item, filterKey) {
    if (item.status == filterKey) {
      return false
    } else {
      return item
    }
  }
  filterByStatus(item, filterKey) {
    if (item.status == filterKey) {
      return item
    } else {
      return false
    }
  }
  submitAllToAssignLegal = () => {
    const { legalListing } = this.state

    let arrByID = legalListing.filter((item) => this.filterByID(item, 'pending_upload'))

    if (arrByID?.length == 0) {
      helper.errorToast('You need to upload all required documents before submitting to legal.')
    } else {
      const { lead } = this.props

      let uploadedObjArray = legalListing.filter((item) => this.filterByStatus(item, 'uploaded'))

      if (uploadedObjArray?.length == 0) {
        helper.warningToast('All Documents Already Uploaded')
      } else {
        const mappedArrayData = uploadedObjArray.map(({ id }) => {
          return { documentId: id, status: 'pending_legal' }
        })

        axios
          .patch(`/api/legal/documents?leadId=${lead.id}`, mappedArrayData)
          .then((res) => {
            this.fetchLead()
          })
          .catch((error) => {
            console.log(`ERROR: /api/leads/?id=${data.id}`, error)
          })
      }
    }
  }
  isBeforeToday(date) {
    const today = new Date()

    today.setHours(0, 0, 0, 0)

    return date < today
  }

  // *******  Assign To Legal  *************
  submitToAssignLegal = (data, comment) => {
    const { lead } = this.props
    this.toggleComments(data, false)
    axios
      .patch(`/api/legal/document?documentId=${data.id}&leadId=${lead.id}`, {
        status: 'pending_legal',
        remarks: comment,
      })
      .then((res) => {
        this.fetchLead()
      })
      .catch((error) => {
        console.log(`ERROR: /api/leads/legalDocument?id=${data.id}`, error)
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
      firstFormData,
      toggleCommentModal,
      commentModalLoading,
      selectedDocument,
      documentComments,
      transferDate,
      viewCommentsCheck,
      closedLeadEdit,
      formData,
    } = this.state
    const { lead, route, contacts } = this.props
    const { leadPurpose, addedBy } = route.params
    let mailCheck = this.mailSentCheck()
    let onReadOnly = this.checkReadOnlyMode()
    const isLeadClosed =
      lead.status === StaticData.Constants.lead_closed_lost ||
      lead.status === StaticData.Constants.lead_closed_won
    let readPermission = this.readPermission()
    let updatePermission = this.updatePermission()

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
        <LegalComments
          commentModalLoading={commentModalLoading}
          selectedDocument={selectedDocument}
          active={toggleCommentModal}
          toggleComments={this.toggleComments}
          submitToAssignLegal={this.submitToAssignLegal}
          documentComments={documentComments}
          viewCommentsCheck={viewCommentsCheck}
        />
        <ScrollView>
          {!loading ? (
            <View style={[styles.mainView, AppStyles.mb1]}>
              <>
                <View style={{ padding: 10 }}>
                  <PickerComponent
                    onValueChange={(value, name) => {
                      if (updatePermission && closedLeadEdit) this.handleFirstForm(value, name)
                    }}
                    data={StaticData.legalServicesFields}
                    name={'legalService'}
                    placeholder="Legal Services Types"
                    selectedItem={firstFormData.legalService}
                    enabled={closedLeadEdit}
                  />
                </View>
                {firstFormData.legalService !== 'internal' && leadPurpose === 'sale' ? (
                  <View style={{ padding: 10 }}>
                    <PickerComponent
                      onValueChange={(value, name) => {
                        if (updatePermission && closedLeadEdit) this.handleFirstForm(value, name)
                      }}
                      data={StaticData.externalServicesFields}
                      name={'legalDescription'}
                      placeholder="External Service Preferences"
                      selectedItem={firstFormData.legalDescription}
                      enabled={closedLeadEdit}
                    />
                  </View>
                ) : null}
              </>
              <Text style={styles.mandatoryText}>DOCUMENTS</Text>
              <View style={[]}>
                <FlatList
                  data={legalListing}
                  renderItem={({ item, index }) => (
                    <LegalTile
                      cancelFileUploading={this.cancelFileUploading}
                      formData={formData}
                      submitUploadedAttachment={this.submitForm}
                      data={item}
                      index={index + 1}
                      submitMenu={(value, data) => {
                        if (updatePermission && closedLeadEdit) this.submitMenu(value, data)
                      }}
                      getAttachmentFromStorage={(item) => {
                        if (updatePermission && closedLeadEdit) this.toggleActionSheet(item)
                      }}
                      downloadLegalDocs={(item) => {
                        if (updatePermission && closedLeadEdit) this.downloadLegalDocs(item)
                      }}
                      isLeadClosed={isLeadClosed}
                    />
                  )}
                  keyExtractor={(item, index) => {
                    item.id.toString()
                  }}
                />

                <TouchableButton
                  containerStyle={[styles.timePageBtn, { marginVertical: 10 }]}
                  label="+ Add Documents"
                  borderColor="white"
                  containerBackgroundColor="#0f73ee"
                  borderWidth={1}
                  onPress={() =>
                    this.setState({
                      showAction: true,
                      otherDoc: true,
                    })
                  }
                />
              </View>
              <TouchableButton
                containerStyle={[styles.timePageBtn, { marginVertical: 10 }]}
                label="Submit To Legal"
                borderColor="white"
                containerBackgroundColor="#0f73ee"
                borderWidth={1}
                // disabled={disabled}
                onPress={() => this.submitAllToAssignLegal()}
              />

              {(leadPurpose === 'buy' || leadPurpose === 'sale') &&
              addedBy !== 'seller' &&
              firstFormData.legalService === 'internal' ? (
                <View style={[AppStyles.mb1, styles.pad15, styles.padV15]}>
                  {mailCheck ? (
                    <View style={[styles.transferView, { marginBottom: 10 }]}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.mandatoryText}>TRANSFER SERVICES</Text>
                        <Text
                          style={[
                            styles.mandatoryText,
                            { fontFamily: AppStyles.fonts.semiBoldFont },
                          ]}
                        >
                          PKR{' '}
                          <Text style={styles.mandatoryText}>
                            {legalServicesFee && legalServicesFee.fee}
                          </Text>
                        </Text>
                      </View>
                      <View style={[styles.datePicker]}>
                        <DateTimePicker
                          disabled={checkListDoc && checkListDoc.fileKey !== null ? true : false}
                          placeholderLabel={'Select Transfer date'}
                          name={'date'}
                          mode={'date'}
                          errorMessage={'Required'}
                          iconSource={require('../../../assets/img/calendar.png')}
                          date={transferDate ? new Date(transferDate) : new Date()}
                          selectedValue={transferDate ? helper.formatDate(transferDate) : ''}
                          handleForm={(value, name) => {
                            if (this.isBeforeToday(value)) {
                              Alert.alert(
                                '',
                                `Are you sure you want to select past date.`,
                                [
                                  { text: 'No', style: 'cancel' },
                                  {
                                    text: 'Yes',
                                    onPress: async () => {
                                      if (updatePermission && closedLeadEdit)
                                        this.setTransferDate(value, 'transferDate')
                                    },
                                  },
                                ],
                                { cancelable: false }
                              )
                            } else {
                              if (updatePermission && closedLeadEdit)
                                this.setTransferDate(value, 'transferDate')
                            }
                          }}
                        />
                      </View>
                      <View style={styles.pad15}>
                        {!legalPaymentObj && legalServicesFee && legalServicesFee.fee > 0 ? (
                          <RCMBTN
                            onClick={() => {
                              if (updatePermission && closedLeadEdit)
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
                            updatePermission={updatePermission}
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
                  {!mailCheck ? (
                    <RCMBTN
                      onClick={() => {
                        if (updatePermission && closedLeadEdit) this.showLegalRequestConfirmation()
                      }}
                      btnText={'REQUEST TRANSFER SERVICES'}
                      checkLeadClosedOrNot={false}
                      hiddenBtn={false}
                      addBorder={true}
                      isLeadClosed={isLeadClosed}
                    />
                  ) : null}
                  {/* ) : null} */}
                </View>
              ) : null}
            </View>
          ) : (
            <LoadingNoResult loading={loading} />
          )}
        </ScrollView>
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
    permissions: store.user.permissions,
    shortlistedData: store.drawer.shortlistedData,
  }
}
export default connect(mapStateToProps)(LegalAttachment)
