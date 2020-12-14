/** @format */

import React from 'react'
import { StyleSheet, Modal, SafeAreaView, Image } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { WebView } from 'react-native-webview'
import AppStyles from '../../AppStyles'

class ViewDocs extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { isVisible, closeModal, url, imageView } = this.props
    let showImage = imageView || false

    return (
      <Modal visible={isVisible} animationType="slide" onRequestClose={closeModal}>
        <SafeAreaView
          style={[AppStyles.mb1, { justifyContent: 'center', backgroundColor: '#e7ecf0' }]}
        >
          <AntDesign
            style={styles.closeStyle}
            onPress={closeModal}
            name="close"
            size={30}
            color={AppStyles.colors.textColor}
          />
          {!showImage ? (
            <WebView source={{ uri: url }} style={{ marginTop: 0 }} />
          ) : (
            <Image
              source={{
                uri: url,
              }}
              resizeMode={'center'}
              style={{
                flex: 1,
                alignSelf: 'center',
                height: 350,
                width: 350,
              }}
            />
          )}
        </SafeAreaView>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  closeStyle: {
    position: 'absolute',
    right: 15,
    top: Platform.OS == 'android' ? 10 : 40,
    paddingVertical: 5,
    zIndex: 5,
  },
})

export default ViewDocs
