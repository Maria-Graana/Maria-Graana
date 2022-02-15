/** @format */

import React from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import { connect, useDispatch } from 'react-redux'
import close from '../../../assets/img/times.png'
import WhatToDoImg from '../../../assets/img/what_to_do.png'
import { clearCallPayload } from '../../actions/callMeetingFeedback'
import AppStyles from '../../AppStyles'
import TouchableButton from '../TouchableButton'

const SubmitFeedbackOptionsModal = ({
  showModal,
  setShowModal,
  call,
  performMeeting,
  performFollowUp,
  performReject,
  modalMode,
  bookUnit,
  callMeetingStatus,
  leadType,
  goToViewingScreen,
}) => {
  const dispatch = useDispatch()
  return (
    <Modal visible={showModal}>
      <SafeAreaView style={AppStyles.mb1}>
        <View style={[styles.modalMain]}>
          <View style={{ flex: 0.1 }}>
            <View style={styles.row}>
              <Text style={styles.title}>What would you like to do next?</Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => {
                  setShowModal(false)
                  dispatch(clearCallPayload())
                }}
              >
                <Image source={close} style={styles.closeImg} />
              </TouchableOpacity>
            </View>
          </View>

          <Image
            source={WhatToDoImg}
            style={{ alignSelf: 'center', flex: 0.5, resizeMode: 'center', marginHorizontal: 15 }}
          />
          <View style={styles.buttonsContainer}>
            {modalMode === 'call' && (
              <>
                {callMeetingStatus && callMeetingStatus.calledOn === 'phone' && leadType === 'CM' && (
                  <TouchableButton
                    label="Call Again"
                    onPress={() => {
                      call()
                      setShowModal(false)
                    }}
                    fontFamily={AppStyles.fonts.boldFont}
                    containerStyle={styles.button}
                    fontSize={16}
                    containerBackgroundColor={AppStyles.colors.actionBg}
                  />
                )}
                {leadType === 'CM' ? (
                  <TouchableButton
                    label="Meeting"
                    onPress={() => {
                      performMeeting()
                      setShowModal(false)
                      dispatch(clearCallPayload())
                    }}
                    fontFamily={AppStyles.fonts.boldFont}
                    fontSize={16}
                    containerStyle={styles.button}
                    containerBackgroundColor={AppStyles.colors.actionBg}
                  />
                ) : (
                  <TouchableButton
                    label="Go to Viewing"
                    onPress={() => {
                      goToViewingScreen()
                      setShowModal(false)
                      dispatch(clearCallPayload())
                    }}
                    fontFamily={AppStyles.fonts.boldFont}
                    fontSize={16}
                    containerStyle={styles.button}
                    containerBackgroundColor={AppStyles.colors.actionBg}
                  />
                )}
              </>
            )}

            {modalMode === 'meeting' && (
              <>
                <TouchableButton
                  label="Setup another Meeting"
                  onPress={() => {
                    performMeeting()
                    setShowModal(false)
                    dispatch(clearCallPayload())
                  }}
                  fontFamily={AppStyles.fonts.boldFont}
                  fontSize={16}
                  containerStyle={styles.button}
                  containerBackgroundColor={AppStyles.colors.actionBg}
                />
                <TouchableButton
                  label="Book a Unit"
                  onPress={() => {
                    bookUnit()
                    setShowModal(false)
                  }}
                  fontFamily={AppStyles.fonts.boldFont}
                  containerStyle={styles.button}
                  fontSize={16}
                  containerBackgroundColor={AppStyles.colors.actionBg}
                />
              </>
            )}

            <TouchableButton
              label="Follow-Up"
              onPress={() => {
                performFollowUp()
                setShowModal(false)
              }}
              fontFamily={AppStyles.fonts.boldFont}
              fontSize={16}
              containerStyle={styles.button}
              containerBackgroundColor={AppStyles.colors.yellowBg}
              textColor={AppStyles.colors.textColor}
            />
            <TouchableButton
              label="Reject with Reason"
              onPress={() => {
                performReject()
                setShowModal(false)
                dispatch(clearCallPayload())
              }}
              fontFamily={AppStyles.fonts.boldFont}
              containerStyle={styles.button}
              fontSize={16}
              containerBackgroundColor={AppStyles.colors.redBg}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

mapStateToProps = (store) => {
  return {
    callMeetingStatus: store.callMeetingStatus.callMeetingStatus,
  }
}

export default connect(mapStateToProps)(SubmitFeedbackOptionsModal)

const styles = StyleSheet.create({
  modalMain: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonsContainer: {
    flex: 0.4,
    justifyContent: 'center',
    //marginHorizontal: 15,
  },
  title: {
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: AppStyles.fontSize.large,
    paddingVertical: 5,
    width: '90%',
  },
  closeBtn: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 50,
  },
  closeImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },
  button: {
    justifyContent: 'center',
    minHeight: 55,
    borderRadius: 4,
    padding: 10,
    marginVertical: 10,
  },
})
