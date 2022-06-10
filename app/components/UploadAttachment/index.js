/** @format */

import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from 'expo-document-picker'
import { ActionSheet } from 'native-base'
import * as ImageManipulator from 'expo-image-manipulator'
import React from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { Camera } from 'expo-camera'
import helper from '../../helper'

var BUTTONS = ['Upload File', 'Take a Photo', 'Cancel']
var CANCEL_INDEX = 2

export default class UploadAttachment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: { title: '', fileName: '', size: '', uri: '', category: '' },
    }
  }

  openActionSheet = () => {
    const { onCancelPressed } = this.props
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: 'Select an Option',
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          this.takePhotos()
        } else if (buttonIndex === 2) {
          onCancelPressed ? onCancelPressed() : null
        } else if (buttonIndex === 0) {
          this.getAttachmentFromStorage()
        }
      }
    )
  }

  // ************* Take A Photo *****************
  takePhotos = async () => {
    let { status: camStatus } = await Camera.requestPermissionsAsync()
    if (camStatus !== 'granted') {
      const status = await Camera.requestPermissionsAsync().status
      if (status !== 'granted') {
        return
      }
    }
    let result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
    })
    if (!result.cancelled) {
      helper.warningToast('File is Uploading, Please Wait!')
      this._compressImageAndUpload(result.uri, result)
    }
  }

  //Image Compression and image size reduction...
  _compressImageAndUpload = async (uri, object) => {
    const { submitUploadedAttachment } = this.props
    let orginalWidth = object.width
    let originalHeight = object.height
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      orginalWidth * 0.5 > 1920
        ? [{ resize: { width: orginalWidth * 0.5, height: originalHeight * 0.5 } }]
        : [],
      {
        compress: 0.5,
      }
    )
    let name = manipResult.uri.split('/').pop()
    let match = /\.(\w+)$/.exec(name)
    let type = match ? `image/${match[1]}` : `image`
    let image = {
      type: type,
      uri: manipResult.uri,
      fileName: name,
      title: '',
    }
    submitUploadedAttachment(image)
  }

  // ************* Upload Attachment From Gallery *****************
  getAttachmentFromStorage = () => {
    const { formData } = this.state
    const { submitUploadedAttachment } = this.props
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
          helper.warningToast('File is Uploading, Please Wait!')
          if (item.name && item.name !== '') {
            newFormData.fileName = item.name
            newFormData.size = item.size
            newFormData.uri = item.uri
            submitUploadedAttachment(newFormData)
          }
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    const { showAction = false } = this.props
    if (showAction) this.openActionSheet()
    return <View></View>
  }
}

const styles = StyleSheet.create({})
