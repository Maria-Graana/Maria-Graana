/** @format */

import axios from 'axios'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as MediaLibrary from 'expo-media-library'
import React, { Component } from 'react'
import { Alert, FlatList, View } from 'react-native'
import { connect } from 'react-redux'
import _ from 'underscore'
import AppStyles from '../../AppStyles'
import AddAttachmentPopup from '../../components/AddAttachmentPopup'
import UploadAttachment from '../../components/UploadAttachment'
import AttachmentTile from '../../components/AttachmentTile'
import LoadingNoResult from '../../components/LoadingNoResult'
import ViewDocs from '../../components/ViewDocs'
import helper from '../../helper'
import AddAttachment from './addAttachment'
import LegalTile from '../../components/LegalTile'
import { Buffer } from 'buffer'
import LegalComments from '../../components/LegalComments'

class LeadAttachments extends Component {
  paymentAttachments = []
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
      checkValidation: false,
      title: '',
      formData: { title: '', fileName: '', size: '', uri: '', category: '' },
      showDoc: false,
      docUrl: '',
      loading: false,
      attachmentsData: [],
      attachmentType: '',
      signedServiceFile: null,
      showAction: false,
      doneLoading: false,
      attachmentsDataEXT: [],
      commentModalLoading: false,
      currentItem: {},
      toggleCommentModal: false,
      selectedDocument: null,
      viewCommentsCheck: false,
      documentComments: [],
      scaId: null,
      scaStatus: null,
    }
  }

  showModal = (type) => {
    this.setState({
      isVisible: true,
      checkValidation: false,
      formData: { title: '', fileName: '', size: '', uri: '' },
      title: '',
      attachmentType: type,
    })
  }

  componentDidMount() {
    const { route } = this.props
    const { navProperty = false, workflow } = route.params
    if (navProperty) {
      this.fetchPropertyAttachement()
    } else if (workflow === 'cm') {
      // this.fetchAttachmentEXT()
    } else {
      // this.fetchAttachmentEXT()
      this.fetchAttachments()
    }
  }

  fetchPropertyAttachement = () => {
    const { route } = this.props
    const { propertyId, purpose } = route.params
    let url = `api/legal/scadocuments?propertyId=${propertyId}&addedBy=seller`
    this.setState({
      loading: true,
    })
    axios
      .get(url)
      .then((res) => {
        if (res.data.length > 0) {
          let signedFile = _.find(res.data, (item) => {
            return item.category === 'signed_services_agreement'
          })
          this.setState({
            isVisible: purpose == 'addSCA' ? true : false,
            attachmentsData: res.data,
            signedServiceFile: signedFile,
            scaId: res.data[0].id,
            scaStatus: res.data[0].status,
          })
        } else this.createSCAPayload()
      })
      .then(() =>
        this.setState({
          isVisible: this.state.scaStatus != 'pending_upload' || purpose == 'view' ? false : true,
          loading: false,
          doneLoading: false,
        })
      )
      .catch((err) => console.log(err))
      .catch((error) => {
        console.log(error)
      })
  }

  fetchAttachmentEXT = () => {
    const { route } = this.props
    const { workflow } = route.params
    let url = ``
    if (workflow === 'rcm' || workflow === 'propertyLeads') {
      const { rcmLeadId } = route.params
      url = `/api/leads/attachmentbylead?leadId=${rcmLeadId}`
    }
    if (workflow === 'cm') {
      const { cmLeadId } = route.params
      url = `/api/leads/attachmentbylead?leadId=${cmLeadId}`
    }
    axios
      .get(url)
      .then((res) => {
        this.setState({
          loading: false,
          attachmentsDataEXT: res.data,
          doneLoading: false,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  fetchAttachments = () => {
    const { route } = this.props
    const { workflow, purpose } = route.params
    let url = ``
    if (workflow === 'rcm' || workflow === 'propertyLeads') {
      const { rcmLeadId } = route.params
      url = `api/legal/scadocuments?leadId=${rcmLeadId}&addedBy=buyer`
    }
    if (workflow === 'cm') {
      const { cmLeadId } = route.params
      url = `api/legal/scadocuments?leadId=${cmLeadId}&addedBy=buyer`
    }
    this.setState({
      loading: true,
    })
    axios
      .get(url)
      .then((res) => {
        if (res.data.length > 0) {
          let signedFile = _.find(res.data, (item) => {
            return item.category === 'signed_services_agreement'
          })
          this.setState({
            isVisible: purpose == 'addSCA' ? true : false,
            attachmentsData: res.data,
            signedServiceFile: signedFile,
            scaId: res.data[0].id,
            scaStatus: res.data[0].status,
          })
        } else this.createSCAPayload()
      })
      .then(() =>
        this.setState({
          isVisible: this.state.scaStatus != 'pending_upload' || purpose == 'view' ? false : true,
          loading: false,
          doneLoading: false,
        })
      )
      .catch((err) => console.log(err))
      .catch((error) => {
        console.log(error)
      })
  }

  createSCAPayload = () => {
    const { route } = this.props
    const { workflow, navProperty = false } = route.params

    if (workflow === 'rcm' || workflow === 'propertyLeads') {
      const { rcmLeadId } = route.params
      let url = `api/legal/document/sca`
      axios.post(url, { leadId: rcmLeadId, addedBy: 'buyer' }).then((res) => {
        this.setState({ scaId: res.data.id })
        this.fetchAttachments()
      })
    }
    if (workflow === 'cm') {
      const { cmLeadId } = route.params
      let url = `api/legal/document/sca`
      axios.post(url, { leadId: cmLeadId, addedBy: 'buyer' }).then((res) => {
        this.setState({ scaId: res.data.id })
        this.fetchAttachments()
      })
    }

    if (navProperty) {
      const { propertyId } = route.params
      let url = `api/legal/document/sca`
      axios.post(url, { propertyId: propertyId, addedBy: 'seller' }).then((res) => {
        this.setState({ scaId: res.data.id })
        this.fetchPropertyAttachement()
      })
    }
  }

  setValues = () => {}

  closeModal = () => {
    const { isVisible, formData } = this.state
    const copyFormData = { ...formData }
    copyFormData.fileName = ''
    copyFormData.size = null
    copyFormData.uri = ''
    copyFormData.title = ''
    this.setState({
      isVisible: !isVisible,
      showAction: false,
    })
  }

  componentWillUnmount() {
    this.reopenPaymentModal()
  }

  reopenPaymentModal = () => {}

  deleteAttachmentFromServer = (item) => {
    axios
      .delete(`api/leads/comments/remove?id=${item.id}`)
      .then(() => {
        this.fetchAttachments()
      })
      .catch((error) => {
        helper.errorToast('ERROR DELETING ATTACHMENT')
        console.log('error', error.message)
      })
  }

  showDeleteDialog = (item) => {
    Alert.alert(
      'Delete attachment',
      'Are you sure you want to delete this attachment ?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            this.deleteAttachmentFromServer(item)
          },
        },
      ],
      { cancelable: false }
    )
  }

  handleForm = (formData) => {
    this.setState(
      {
        formData: formData,
        showAction: false,
      }
      // () => {
      //   this.formSubmit()
      // }
    )
  }

  // ********* On form Submit Function
  formSubmit = () => {
    const { title, formData } = this.state
    const { route } = this.props
    const { purpose } = route.params
    this.setState({
      doneLoading: true,
    })
    // ********* Form Validation Check
    if (!title || !formData.fileName) {
      this.setState({
        checkValidation: true,
        showAction: false,
        doneLoading: false,
      })
    } else {
      // ********* Call Add Attachment API here :)
      purpose == 'addSCA' ? this.uploadAttachmentLegal() : this.uploadAttachment()
    }
  }

  uploadAttachment = () => {
    const { formData, title, attachmentType } = this.state
    const { route } = this.props
    const { workflow, navProperty = false } = route.params
    let url = ``
    if (workflow === 'rcm' || workflow === 'propertyLeads') {
      const { rcmLeadId } = route.params
      url = `/api/leads/attachment?rcmLeadId=${rcmLeadId}&title=${title}`
    }
    if (workflow === 'cm') {
      const { cmLeadId } = route.params
      url = `/api/leads/attachment?cmLeadId=${cmLeadId}&title=${title}`
    }
    if (attachmentType === 'signed_services_agreement') url = url + `&category=${attachmentType}`
    let attachment = {
      name: formData.fileName,
      type: 'file/' + formData.fileName.split('.').pop(),
      uri: formData.uri,
    }
    let fd = new FormData()
    fd.append('file', attachment)
    // ====================== API call for Attachments base on LEAD ID
    axios
      .post(url, fd)
      .then((res) => {
        if (res.data) {
          this.fetchAttachments()
          helper.successToast('Attachment Uploaded Successfully!')
        }
      })
      .catch((error) => {
        console.log(url, error)
        helper.errorToast('Attachment Error: ', error)
      })
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
    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status === 'granted') {
      const asset = await MediaLibrary.createAssetAsync(fileUri)
      MediaLibrary.createAlbumAsync('ARMS', asset, false).then(() => {
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

  toggleActionSheet = () => {
    const { showAction } = this.state
    this.setState({
      showAction: true,
    })
  }

  // ARMS-2284 start

  submitMenu = (value, data) => {
    if (value === 'edit') {
      data.value = data.category
      this.toggleActionSheetLegal(data)
    }
    if (value === 'submit_to_legal') {
      this.toggleComments(data, false)
    }
    if (value === 'view_legal') {
      this.toggleComments(data, true)
    }
  }

  toggleActionSheetLegal = (data) => {
    this.setState({
      showAction: true,
      currentItem: data,
    })
  }

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
      .then(() => {
        FileSystem.getInfoAsync(fileUri).then((res) => {
          this.saveFile(res.uri, doc)
        })
      })
      .catch((error) => {
        helper.warning('ERROR: Downloading File')
        console.error('downloadBufferFile: ', error)
      })
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

  submitToAssignLegal = (data, comment) => {
    const { lead, route } = this.props
    const { navProperty = false } = route.params
    this.toggleComments(data, false)
    axios
      .patch(`/api/legal/document?documentId=${data.id}&leadId=${lead.id}`, {
        status: 'pending_legal',
        remarks: comment,
      })
      .then(() => {
        navProperty ? this.fetchPropertyAttachement() : this.fetchAttachments()
      })
      .catch((error) => {
        console.log(`ERROR: /api/leads/legalDocument?id=${data.id}`, error)
      })
  }

  uploadAttachmentLegal = () => {
    const { formData, scaId } = this.state
    const { route } = this.props
    const { navProperty = false } = route.params

    let attachment = {
      name: formData.fileName,
      type: 'file/' + formData.fileName.split('.').pop(),
      uri: formData.uri,
    }
    let fd = new FormData()
    fd.append('file', attachment)
    // ====================== API call for Attachments base on Payment ID

    let url = `/api/legal/document?legalId=${scaId}`
    console.log(`/api/legal/document?legalId=${scaId}`)
    console.log(`fd: `, fd)
    axios
      .post(url, fd)
      .then((res) => {
        if (res.data) {
          navProperty ? this.fetchPropertyAttachement() : this.fetchAttachments()
          this.closeModal()
        }
      })
      .catch((error) => {
        console.log('Attachment Error: ', error, `/api/legal/document?legalId=${scaId}`)
        helper.errorToast('Attachment Error: ', error)
      })
  }

  // ARMS-2284 end

  render() {
    const {
      isVisible,
      formData,
      checkValidation,
      title,
      showDoc,
      docUrl,
      loading,
      attachmentsData,
      signedServiceFile,
      showAction,
      doneLoading,
      attachmentsDataEXT,
      commentModalLoading,
      selectedDocument,
      toggleCommentModal,
      documentComments,
      viewCommentsCheck,
    } = this.state
    const { route, permissions, navigation } = this.props
    const { workflow, purpose } = route.params

    return (
      <View style={[AppStyles.container, { paddingLeft: 0, paddingRight: 0 }]}>
        <UploadAttachment showAction={showAction} submitUploadedAttachment={this.handleForm} />
        <AddAttachmentPopup
          isVisible={isVisible}
          formData={formData}
          title={title}
          setTitle={(title) => this.setState({ title: title })}
          formSubmit={() => this.formSubmit()}
          checkValidation={checkValidation}
          getAttachmentFromStorage={this.toggleActionSheet}
          closeModal={() => this.closeModal()}
          doneLoading={doneLoading}
          navigation={navigation}
          workflow={workflow}
          purpose={purpose}
        />
        <ViewDocs isVisible={showDoc} closeModal={this.closeDocsModal} url={docUrl} />
        <LegalComments
          commentModalLoading={commentModalLoading}
          selectedDocument={selectedDocument}
          active={toggleCommentModal}
          toggleComments={this.toggleComments}
          submitToAssignLegal={this.submitToAssignLegal}
          documentComments={documentComments}
          viewCommentsCheck={viewCommentsCheck}
        />
        {!loading ? (
          <>
            <FlatList
              style={{ paddingBottom: '3%' }}
              data={attachmentsData}
              renderItem={({ item, index }) => (
                <LegalTile
                  data={item}
                  index={index}
                  submitMenu={this.submitMenu}
                  getAttachmentFromStorage={this.toggleActionSheetLegal}
                  downloadLegalDocs={this.downloadLegalDocs}
                  // isLeadClosed={isLeadClosed}
                  addBorder={true}
                  isLeadSCA={true}
                />
              )}
              keyExtractor={(item) => {
                item.id.toString()
              }}
            />
            <FlatList
              ref={(ref) => {
                this.flatList = ref
              }}
              contentContainerStyle={{ flexGrow: 1 }}
              onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
              data={attachmentsDataEXT}
              renderItem={({ item }) => (
                <View>
                  {item.category !== 'signed_services_agreement' && purpose == 'view' && (
                    <AttachmentTile
                      data={item}
                      viewAttachments={this.downloadFile}
                      deleteAttachment={this.showDeleteDialog}
                    />
                  )}
                </View>
              )}
              ListFooterComponent={
                <AddAttachment
                  onPress={this.showModal}
                  downloadFile={this.downloadFile}
                  showDeleteDialog={this.showDeleteDialog}
                  signedServiceFile={signedServiceFile}
                  workflow={workflow}
                  purpose={purpose}
                  attachementData={attachmentsData}
                  // attachmentsDataEXT={attachmentsDataEXT}
                />
              }
              keyExtractor={(item, index) => index.toString()}
            />
          </>
        ) : (
          <LoadingNoResult loading={loading} />
        )}
      </View>
    )
  }
}
mapStateToProps = (store) => {
  return {
    user: store.user.user,
    lead: store.lead.lead,
    permissions: store.user.permissions,
  }
}
export default connect(mapStateToProps)(LeadAttachments)
