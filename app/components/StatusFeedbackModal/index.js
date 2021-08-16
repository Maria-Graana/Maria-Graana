/** @format */

import axios from 'axios'
import fuzzy from 'fuzzy'
import React, { useEffect, useRef, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
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
import { clearCallPayload, sendCallStatus } from '../../actions/callMeetingFeedback'
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
  // showAction = true,
  // showFollowup = true,
  modalMode,
  sendMeetingStatus,
  currentMeeting,
  getMeetingLead,
  // addMeeting,
  // addFollowup,
  // showFeedbackMeetingModal,
  rejectLead,
  // leadType,
  // goToViewingScreen,
  callMeetingStatus,
}) => {
  const [selectedComment, setSelectedComment] = useState(null)
  const dispatch = useDispatch()
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

  const showTitle = () => {
    if (callMeetingStatus && modalMode === 'call' && callMeetingStatus.calledOn === 'phone') {
      return 'Call Feedback'
    } else if (
      callMeetingStatus &&
      modalMode === 'call' &&
      callMeetingStatus.calledOn === 'whatsapp'
    ) {
      return 'Whatsapp Feedback'
    } else if (modalMode === 'meeting') return 'Meeting Outcome'
    else if (modalMode === 'reject') return 'Reject with Reason'
  }

  const showTextBoxPlaceholder = () => {
    if (callMeetingStatus && modalMode === 'call' && callMeetingStatus.calledOn === 'phone') {
      return 'Enter call feedback'
    } else if (
      callMeetingStatus &&
      modalMode === 'call' &&
      callMeetingStatus.calledOn === 'whatsapp'
    ) {
      return 'Enter whatsapp call feedback'
    } else if (modalMode === 'meeting') return 'Enter meeting outcome'
    else if (modalMode === 'reject') return 'Enter reason of rejection'
    else return 'comments'
  }

  const submitFeedback = () => {
    if (modalMode === 'call') {
      // handle call action
      dispatch(sendCallStatus(selectedComment)).then((res) => {
        getMeetingLead()
      })
    } else if (modalMode === 'meeting') {
      // handle meeting action
      sendMeetingStatus(selectedComment, currentMeeting.id)
    } else {
      // handle reject action
      let body = {
        reasons: selectedComment,
      }
      rejectLead(body)
    }
    showFeedbackModal(false)
    clearFormData()
  }

  const discardFeedback = () => {
    if (modalMode === 'call') {
      dispatch(clearCallPayload())
    }
    showFeedbackModal(false)
    clearFormData()
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
              onPress={() => discardFeedback()}
              label={'Cancel'}
            />
            <TouchableButton
              containerStyle={styles.button}
              fontFamily={AppStyles.fonts.boldFont}
              fontSize={16}
              onPress={() => {
                selectedComment ? submitFeedback() : alert('Please select a comment to continue')
              }}
              label={'Submit'}
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

export default connect(mapStateToProps)(StatusFeedbackModal)

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
