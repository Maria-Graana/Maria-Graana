/** @format */

import axios from 'axios'
import fuzzy from 'fuzzy'
import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import times from '../../../assets/img/times.png'
import AppStyles from '../../AppStyles'
import SubmitFeedbackOptionsModal from '../SubmitFeedbackOptionsModal'
import TouchableButton from '../TouchableButton'

const CommentChip = ({ comment, setSelectedComment }) => {
  return (
    <TouchableOpacity
      style={[styles.itemContainer, { borderColor: comment.colorCode }]}
      onPress={() => setSelectedComment(comment)}
    >
      <Text style={styles.itemName}>{comment.name}</Text>
    </TouchableOpacity>
  )
}
const StatusFeedbackModal = ({
  visible,
  showFeedbackModal,
  commentsList,
  showAction = true,
  showFollowup = true,
  modalMode,
  sendStatus,
  currentCall,
  addMeeting,
  addFollowup,
  showFeedbackMeetingModal,
  rejectLead,
  leadType,
  goToViewingScreen,
}) => {
  const [selectedComment, setSelectedComment] = useState(null)
  const textInput = useRef(null)
  let data = []
  if (selectedComment != null && data && data.length === 0) {
    data = fuzzy.filter(selectedComment, commentsList, { extract: (e) => e.name })
    data = data.map((item) => item.original)
  } else {
    data = commentsList
  }

  const clearFormData = () => {
    setSelectedComment(null)
  }

  const performAction = () => {
    showFeedbackModal(false)
    if (leadType === 'CM') {
      if (currentCall) {
        if (modalMode === 'call') {
          sendStatus(
            selectedComment,
            currentCall.id,
            currentCall.calledOn === 'phone' ? 'call' : 'whatsapp'
          )
          addMeeting()
          clearFormData()
        } else {
          // Meeting Mode & actions for book unit and set up another meeting
          showFeedbackMeetingModal(true)
          sendStatus(selectedComment, currentCall.id, 'meeting')
          clearFormData()
        }
      }
    } else {
      if (currentCall) {
        sendStatus(
          selectedComment,
          currentCall.id,
          currentCall.calledOn === 'phone' ? 'call' : 'whatsapp'
        )
        clearFormData()
        goToViewingScreen()
      }
    }
  }

  const performFollowup = () => {
    if (currentCall) {
      showFeedbackModal(false)
      sendStatus(
        selectedComment,
        currentCall.id,
        currentCall && modalMode === 'call' && currentCall.calledOn === 'whatsapp'
          ? ' whatsapp'
          : currentCall && modalMode === 'call' && currentCall.calledOn === 'phone'
          ? 'call'
          : 'meeting'
      )
      addFollowup(selectedComment)
      clearFormData()
    }
  }

  const performReject = () => {
    let body = {
      reasons: selectedComment,
    }
    showFeedbackModal(false)
    if ((currentCall && modalMode === 'call') || modalMode === 'meeting') {
      sendStatus(
        selectedComment,
        currentCall.id,
        currentCall && modalMode === 'call' && currentCall.calledOn === 'whatsapp'
          ? ' whatsapp'
          : currentCall && modalMode === 'call' && currentCall.calledOn === 'phone'
          ? 'call'
          : 'meeting'
      )
      rejectLead(body)
      clearFormData()
    } else {
      rejectLead(body)
      clearFormData()
    }
  }

  const showRejectModal = () => {
    Alert.alert(
      'Reject(Close as Lost)',
      'Are you sure you want to continue?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => performReject() },
      ],
      { cancelable: false }
    )
  }

  const showTitle = () => {
    if (currentCall && modalMode === 'call' && currentCall.calledOn === 'phone') {
      return 'Call Feedback'
    } else if (currentCall && modalMode === 'call' && currentCall.calledOn === 'whatsapp') {
      return 'Whatsapp Feedback'
    } else if (modalMode === 'meeting') return 'Meeting Outcome'
    else if (modalMode === 'reject') return 'Reject with Reason'
  }

  const showTextBoxPlaceholder = () => {
    if (currentCall && modalMode === 'call' && currentCall.calledOn === 'phone') {
      return 'Enter call feedback'
    } else if (currentCall && modalMode === 'call' && currentCall.calledOn === 'whatsapp') {
      return 'Enter whatsapp call feedback'
    } else if (modalMode === 'meeting') return 'Enter meeting outcome'
    else if (modalMode === 'reject') return 'Enter reason of rejection'
    else return 'comments'
  }

  return (
    <Modal visible={visible}>
      <SafeAreaView style={AppStyles.mb1}>
        <View style={styles.modalMain}>
          <View style={styles.row}>
            <Text style={styles.title}>{showTitle()}</Text>
          </View>

          <View style={[AppStyles.mainInputWrap]}>
            <TextInput
              ref={textInput}
              placeholderTextColor={'#a8a8aa'}
              style={[
                AppStyles.formControl,
                Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
                AppStyles.formFontSettings,
                styles.commentContainer,
              ]}
              multiline
              autoFocus
              placeholder={showTextBoxPlaceholder()}
              onChangeText={(text) => setSelectedComment(text)}
              value={selectedComment}
            />
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatlistContent}
          >
            {data.map((item) => (
              <CommentChip
                key={item.value}
                comment={item}
                setSelectedComment={(comment) => {
                  setSelectedComment(comment.name)
                  textInput.current.focus()
                }}
              />
            ))}
          </ScrollView>
          <View style={styles.buttonsContainer}>
            <TouchableButton
              containerStyle={styles.button}
              fontFamily={AppStyles.fonts.boldFont}
              fontSize={16}
              containerBackgroundColor={AppStyles.colors.actionBg}
              onPress={() => {
                showFeedbackModal(false)
                clearFormData()
              }}
              label={'Cancel'}
            />
            <TouchableButton
              containerStyle={styles.button}
              fontFamily={AppStyles.fonts.boldFont}
              fontSize={16}
              onPress={() => {
                console.log('submit')
                showFeedbackModal(false)
                clearFormData()
              }}
              label={'Submit'}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default StatusFeedbackModal

const styles = StyleSheet.create({
  modalMain: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  commentContainer: {
    height: 100,
    paddingTop: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: AppStyles.colors.subTextColor,
    color: AppStyles.colors.textColor,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    borderRadius: 4,
    fontFamily: 'OpenSans_regular',
  },
  itemContainer: {
    borderWidth: 1,
    overflow: 'hidden',
    borderRadius: 12,
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 8,
  },
  itemName: {
    fontSize: 12,
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.semiBoldFont,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'flex-end',
  },
  button: {
    justifyContent: 'center',
    minHeight: 55,
    borderRadius: 4,
    padding: 10,
    width: '32%',
    marginHorizontal: 10,
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
  flatlistContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
})
