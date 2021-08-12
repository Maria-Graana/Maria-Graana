/** @format */

import React from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity, Image } from 'react-native'
import close from '../../../assets/img/times.png'

const SubmitFeedbackOptionsModal = ({ showModal, setShowModal }) => {
  return (
    <Modal visible={showModal}>
      <View style={[styles.modalMain]}>
        <View style={styles.row}>
          <Text style={styles.title}>What would you like to do next?</Text>
          {/* <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
            <Image source={close} style={styles.closeImg} />
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  )
}

export default SubmitFeedbackOptionsModal

const styles = StyleSheet.create({
  modalMain: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  title: {
    width: '90%',
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: AppStyles.fontSize.large,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 50,
    width: '10%',
  },
  closeImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
})
