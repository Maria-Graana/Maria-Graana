/** @format */

import axios from 'axios'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as MediaLibrary from 'expo-media-library'
import * as Permissions from 'expo-permissions'
import React, { Component } from 'react'
import { Alert, FlatList, View } from 'react-native'
import { connect } from 'react-redux'
import _ from 'underscore'
import AppStyles from '../../AppStyles'
import AddAttachmentPopup from '../../components/AddAttachmentPopup'
import AttachmentTile from '../../components/AttachmentTile'
import LoadingNoResult from '../../components/LoadingNoResult'
import ViewDocs from '../../components/ViewDocs'
import helper from '../../helper'
import AddAttachment from './addAttachment'

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
    this.fetchAttachments()
  }

  fetchAttachments = () => {
    const { route } = this.props
    const { workflow } = route.params
    let url = ``
    if (workflow === 'rcm') {
      const { rcmLeadId } = route.params
      url = `/api/leads/comments?rcmLeadId=${rcmLeadId}&type=attachment`
    }
    if (workflow === 'cm') {
      const { cmLeadId } = route.params
      url = `/api/leads/comments?cmLeadId=${cmLeadId}&type=attachment`
    }
    this.setState({
      loading: true,
    })
    axios
      .get(url)
      .then((res) => {
        let signedFile = _.find(res.data, (item) => {
          return item.category === 'signed_services_agreement'
        })
        this.setState({
          loading: false,
          isVisible: false,
          attachmentsData: res.data,
          signedServiceFile: signedFile,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  setValues = (value) => {}

  closeModal = () => {
    const { isVisible, formData } = this.state
    const copyFormData = { ...formData }
    copyFormData.fileName = ''
    copyFormData.size = null
    copyFormData.uri = ''
    copyFormData.title = ''
    this.setState({
      isVisible: !isVisible,
    })
  }

  componentWillUnmount() {
    this.reopenPaymentModal()
  }

  reopenPaymentModal = () => {}

  getAttachmentFromStorage = () => {
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
            this.setState({
              formData: newFormData,
            })
          }
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  deleteAttachmentFromServer = (item) => {
    axios
      .delete(`api/leads/comments/remove?id=${item.id}`)
      .then((res) => {
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

  // ********* On form Submit Function
  formSubmit = () => {
    const { formData, title } = this.state

    // ********* Form Validation Check
    if (!title || !formData.fileName) {
      this.setState({
        checkValidation: true,
      })
    } else {
      // ********* Call Add Attachment API here :)
      this.uploadAttachment()
      var objectForAttachment = {
        fileName: '',
        uri: '',
        size: null,
        title: '',
      }
      objectForAttachment.fileName = formData.fileName
      objectForAttachment.size = formData.size
      objectForAttachment.uri = formData.uri
      objectForAttachment.title = title
    }
  }

  uploadAttachment = () => {
    const { formData, title, attachmentType } = this.state
    const { route } = this.props
    const { workflow } = route.params
    let url = ``
    if (workflow === 'rcm') {
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
    } = this.state
    const { route } = this.props
    const { workflow } = route.params
    return (
      <View style={[AppStyles.container, { paddingLeft: 0, paddingRight: 0 }]}>
        <AddAttachmentPopup
          isVisible={isVisible}
          formData={formData}
          title={title}
          setTitle={(title) => this.setState({ title: title })}
          formSubmit={this.formSubmit}
          checkValidation={checkValidation}
          getAttachmentFromStorage={this.getAttachmentFromStorage}
          closeModal={() => this.closeModal()}
        />
        <ViewDocs isVisible={showDoc} closeModal={this.closeDocsModal} url={docUrl} />
        {!loading ? (
          <FlatList
            ref={(ref) => {
              this.flatList = ref
            }}
            contentContainerStyle={{ flexGrow: 1 }}
            onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
            data={attachmentsData}
            renderItem={({ item }) => (
              <View>
                {item.category !== 'signed_services_agreement' && (
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
              />
            }
            keyExtractor={(item, index) => index.toString()}
          />
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
  }
}
export default connect(mapStateToProps)(LeadAttachments)