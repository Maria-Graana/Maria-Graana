/** @format */

import axios from 'axios'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as MediaLibrary from 'expo-media-library'
import React, { Component } from 'react'
import { Alert, FlatList, View } from 'react-native'
import { connect } from 'react-redux'
import _ from 'underscore'
import { setRCMPayment } from '../../actions/rcmPayment'
import AppStyles from '../../AppStyles'
import AddAttachmentPopup from '../../components/AddAttachmentPopup'
import AttachmentTile from '../../components/AttachmentTile'
import UploadAttachment from '../../components/UploadAttachment'
import ViewDocs from '../../components/ViewDocs'
import helper from '../../helper'
import AddAttachment from './addAttachment'

class RCMAttachment extends Component {
  attachments = []
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
      checkValidation: false,
      title: '',
      formData: { ...this.props.rcmPayment },
      showDoc: false,
      docUrl: '',
      showAction: false,
    }
  }

  showModal = () => {
    this.setState({
      isVisible: true,
      checkValidation: false,
      formData: { title: '', fileName: '', size: '', uri: '' },
      title: '',
    })
  }

  componentDidMount() {
    // console.log('rcmAttachmentProps', this.props.rcmPayment)
  }

  setValues = (value) => {
    this.props.dispatch(setRCMPayment(value))
  }

  closeModal = () => {
    const { isVisible, formData } = this.state
    const { rcmPayment } = this.props
    const copyFormData = { ...formData }
    copyFormData.fileName = ''
    copyFormData.size = null
    copyFormData.uri = ''
    copyFormData.title = ''
    this.setState(
      {
        isVisible: !isVisible,
      },
      () => {
        this.setValues({ ...rcmPayment, copyFormData })
      }
    )
  }

  componentWillUnmount() {
    this.reopenPaymentModal()
  }

  reopenPaymentModal = () => {
    const { rcmPayment, dispatch } = this.props
    dispatch(setRCMPayment({ ...rcmPayment, visible: true }))
  }

  handleForm = (formData) => {
    this.setState({
      formData: formData,
      showAction: false,
    })
  }

  toggleActionSheet = () => {
    this.setState({
      showAction: true,
    })
  }

  deleteAttachmentLocally = (item) => {
    const { rcmPayment } = this.props
    let newPaymentArray = { ...rcmPayment }
    newPaymentArray = _.without(newPaymentArray.paymentAttachments, item)
    this.setValues({ ...rcmPayment, paymentAttachments: newPaymentArray })
  }

  deleteAttachmentFromServer = (item) => {
    axios
      .delete(`/api/leads/payment/attachment?attachmentId=${item.id}`)
      .then((res) => {
        this.deleteAttachmentLocally(item)
      })
      .catch((error) => {
        console.log('error', error.message)
      })
  }

  showDeleteDialog(item) {
    Alert.alert(
      'Delete attachment',
      'Are you sure you want to delete this attachment ?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () =>
            item.id ? this.deleteAttachmentFromServer(item) : this.deleteAttachmentLocally(item),
        },
      ],
      { cancelable: false }
    )
  }

  // ********* On form Submit Function
  formSubmit = () => {
    const { formData, title } = this.state
    const { rcmPayment } = this.props

    // ********* Form Validation Check
    if (!title || !formData.fileName) {
      this.setState({
        checkValidation: true,
      })
    } else {
      // ********* Call Add Attachment API here :)
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
      if ('paymentAttachments' in rcmPayment) {
        // console.log()
      } else {
        rcmPayment.paymentAttachments = []
      }
      rcmPayment.paymentAttachments.push(objectForAttachment)
      var payload = {
        ...rcmPayment,
      }
      this.setState({ isVisible: false }, () => {
        this.setValues(payload)
      })
    }
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
    const { isVisible, formData, checkValidation, title, showAction, showDoc, docUrl } = this.state
    const { rcmPayment } = this.props
    return (
      <View style={[AppStyles.container, { paddingLeft: 0, paddingRight: 0 }]}>
        <UploadAttachment showAction={showAction} submitUploadedAttachment={this.handleForm} />
        <AddAttachmentPopup
          isVisible={isVisible}
          formData={formData}
          title={title}
          setTitle={(title) => this.setState({ title: title })}
          formSubmit={this.formSubmit}
          checkValidation={checkValidation}
          getAttachmentFromStorage={this.toggleActionSheet}
          closeModal={() => this.closeModal()}
        />
        <ViewDocs isVisible={showDoc} closeModal={this.closeDocsModal} url={docUrl} />
        <FlatList
          ref={(ref) => {
            this.flatList = ref
          }}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
          data={rcmPayment.paymentAttachments ? rcmPayment.paymentAttachments : []}
          renderItem={({ item }) => (
            <AttachmentTile
              data={item}
              viewAttachments={this.downloadFile}
              deleteAttachment={(item) => this.showDeleteDialog(item)}
            />
          )}
          ListFooterComponent={<AddAttachment onPress={this.showModal} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }
}
mapStateToProps = (store) => {
  return {
    rcmPayment: store.RCMPayment.RCMPayment,
  }
}
export default connect(mapStateToProps)(RCMAttachment)
