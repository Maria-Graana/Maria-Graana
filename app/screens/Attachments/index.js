/** @format */

import React, { Component } from 'react'
import { Text, View, FlatList, Alert } from 'react-native'
import AttachmentTile from '../../components/AttachmentTile'
import AppStyles from '../../AppStyles'
import AddAttachmentPopup from '../../components/AddAttachmentPopup'
import * as DocumentPicker from 'expo-document-picker'
import _ from 'underscore'
import AddAttachment from './addAttachment'
import axios from 'axios'
import Loader from '../../components/loader'
import ViewDocs from '../../components/ViewDocs'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as MediaLibrary from 'expo-media-library'
import * as Permissions from 'expo-permissions'
import helper from '../../helper'

class Attachments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      attachmentRows: [],
      isVisible: false,
      checkValidation: false,
      loading: true,
      title: '',
      formData: {
        size: '',
        title: '',
        fileName: '',
        uri: '',
      },
      showDoc: false,
      docUrl: '',
    }
  }

  componentDidMount() {
    this.getAttachmentsFromServer()
  }

  showModal = () => {
    this.setState({ isVisible: true, checkValidation: false })
  }

  closeModal = () => {
    const { isVisible } = this.state
    this.setState({
      isVisible: !isVisible,
      title: '',
      formData: { fileName: '', size: '', uri: '', title: '' },
    })
  }

  setTitle = (title) => {
    this.setState({ title: title })
  }

  getAttachmentFromStorage = () => {
    const { title, formData } = this.state
    // console.log('pickDocment')
    let options = {
      type: '*/*',
      copyToCacheDirectory: true,
    }
    DocumentPicker.getDocumentAsync(options)
      .then((item) => {
        if (item.type === 'cancel' && formData.fileName === '') {
          // App should prompt a pop message in-case file is already selected
          Alert.alert('Pick File', 'Please pick a file from documents!')
        } else {
          if (item.name && item.name !== '') {
            this.setState(
              { formData: { fileName: item.name, size: item.size, uri: item.uri, title: title } },
              () => {}
            )
          }
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getAttachmentsFromServer = () => {
    const { route } = this.props
    const { rcmLeadId, cmLeadId } = route.params
    // url is based if coming for rcmlead or cmlead
    const url = rcmLeadId
      ? `/api/leads/comments?rcmLeadId=${rcmLeadId}&type=attachment`
      : `/api/leads/comments?cmLeadId=${cmLeadId}&type=attachment`

    axios
      .get(url)
      .then((response) => {
        this.setState({
          attachmentRows: response.data,
          formData: { title: '', fileName: '', size: '', uri: '' },
          title: '',
          loading: false,
        })
      })
      .catch((error) => {
        console.log(error)
        this.setState({ loading: false })
      })
  }

  addAttachmentToList = () => {
    const { formData } = this.state
    let document = {
      name: formData.fileName,
      type: 'file/' + formData.fileName.split('.').pop(),
      uri: formData.uri,
    }
    this.uploadAttachment(document)
  }

  uploadAttachment(data) {
    const { title } = this.state
    const { route } = this.props
    const { rcmLeadId, cmLeadId } = route.params
    const url = rcmLeadId
      ? `/api/leads/attachment?rcmLeadId=${rcmLeadId}&title=${title}`
      : `/api/leads/attachment?cmLeadId=${cmLeadId}&title=${title}`

    let fd = new FormData()
    fd.append('file', data)
    this.setState({ loading: true })
    axios
      .post(url, fd)
      .then((response) => {
        this.getAttachmentsFromServer()
      })
      .catch((error) => {
        console.log('error=>', error.message)
      })
  }

  deleteAttachment = (item) => {
    this.deleteAttachmentFromServer(item.id)
  }

  showDeleteDialog(item) {
    Alert.alert(
      'Delete attachment',
      'Are you sure you want to delete this attachment ?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => this.deleteAttachment(item) },
      ],
      { cancelable: false }
    )
  }

  deleteAttachmentFromServer(attachmentId) {
    this.setState({ loading: true })
    axios
      .delete(`/api/leads/comments/remove?id=${attachmentId}`)
      .then((res) => {
        this.getAttachmentsFromServer()
      })
      .catch((error) => {
        console.log('error', error.message)
      })
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
      this.setState({ isVisible: false })
      this.addAttachmentToList()
    }
  }

  // *******  View Legal Documents Modal  *************
  closeDocsModal = () => {
    const { showDoc } = this.state
    this.setState({
      showDoc: !showDoc,
    })
  }

  // *******  DownLoad Documents Functions  *************
  downloadFile = async (doc) => {
    if (doc) {
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

  // *******  View Legal Documents  *************
  viewAttachments = (data) => {
    this.setState({
      showDoc: true,
      docUrl: data.value,
    })
  }

  render() {
    const {
      attachmentRows,
      isVisible,
      formData,
      checkValidation,
      title,
      loading,
      showDoc,
      docUrl,
    } = this.state
    return !loading ? (
      <View style={[AppStyles.container, { paddingLeft: 0, paddingRight: 0 }]}>
        <AddAttachmentPopup
          isVisible={isVisible}
          formData={formData}
          title={title}
          setTitle={(title) => this.setTitle(title)}
          formSubmit={this.formSubmit}
          checkValidation={checkValidation}
          getAttachmentFromStorage={this.getAttachmentFromStorage}
          closeModal={() => this.closeModal()}
        />
        <ViewDocs isVisible={showDoc} closeModal={this.closeDocsModal} url={docUrl} />
        <FlatList
          ref={(ref) => {
            this.flatList = ref
          }}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
          data={attachmentRows}
          renderItem={({ item }) => (
            <AttachmentTile
              imageView={false}
              viewAttachments={this.downloadFile}
              data={item}
              deleteAttachment={(item) => this.showDeleteDialog(item)}
            />
          )}
          ListFooterComponent={<AddAttachment onPress={this.showModal} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    ) : (
      <Loader loading={loading} />
    )
  }
}
export default Attachments
