/** @format */

import axios from 'axios'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as MediaLibrary from 'expo-media-library'
import * as Permissions from 'expo-permissions'
import React, { Component } from 'react'
import { Alert, FlatList, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { Buffer } from 'buffer'
import _ from 'underscore'
import AppStyles from '../../AppStyles'
import LegalTile from '../../components/LegalTile'
import LoadingNoResult from '../../components/LoadingNoResult'
import ViewDocs from '../../components/ViewDocs'
import helper from '../../helper'
import StaticData from '../../StaticData'
import styles from './style'
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
    }
  }

  componentDidMount() {
    this.fetchDocuments()
  }

  componentWillUnmount() {}

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
            newFormData.category = data.value
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
    let attachment = {
      name: legalAttachment.fileName,
      type: 'file/' + legalAttachment.fileName.split('.').pop(),
      uri: legalAttachment.uri,
    }
    let fd = new FormData()
    fd.append('file', attachment)
    // ====================== API call for Attachments base on Payment ID
    axios
      .post(
        `/api/leads/legalDocuments?leadId=${lead.id}&category=${legalAttachment.category}&addedBy=${route.params.addedBy}`,
        fd
      )
      .then((res) => {
        if (res.data) {
          this.fetchDocuments()
        }
      })
      .catch((error) => {
        helper.errorToast('Attachment Error: ', error)
      })
  }

  deleteAttachmentFromServer = (item) => {
    axios
      .delete(`/api/leads/legalDocument?id=${item.id}`)
      .then((res) => {
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
      this.getAttachmentFromStorage(data)
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
        this.fetchDocuments()
      })
      .catch((error) => {
        console.log(`ERROR: /api/leads/legalDocument?id=${data.id}`, error)
      })
  }

  // *******  DownLoad Legal Documents Functions  *************
  downloadLegalDocs = async (doc) => {
    if (doc) {
      console.log('downloadLegalDocs')
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

  render() {
    const { legalListing, loading, showDoc, webView, showWebView } = this.state
    return (
      <View style={[AppStyles.mb1]}>
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
            <Text style={styles.mandatoryText}>Upload the below mandatory documents.</Text>
            <FlatList
              data={legalListing}
              renderItem={({ item, index }) => (
                <LegalTile
                  data={item}
                  index={index + 1}
                  submitMenu={this.submitMenu}
                  getAttachmentFromStorage={this.getAttachmentFromStorage}
                  downloadLegalDocs={this.downloadLegalDocs}
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
    rcmPayment: store.RCMPayment.RCMPayment,
    lead: store.lead.lead,
  }
}
export default connect(mapStateToProps)(LegalAttachment)
