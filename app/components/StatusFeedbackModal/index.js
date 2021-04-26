
/** @format */

import fuzzy from 'fuzzy'
import React, { useRef, useState } from 'react'
import {
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
  performAction,
  performFollowup,
  performReject,
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
  return (
    <Modal visible={visible}>
      <SafeAreaView style={AppStyles.mb1}>
        <View style={styles.modalMain}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => showFeedbackModal(false)}>
            <Image source={times} style={styles.closeImg} />
          </TouchableOpacity>
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
              placeholder="Comments"
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
            {showAction && (
              <TouchableButton
                containerStyle={styles.button}
                fontFamily={AppStyles.fonts.boldFont}
                fontSize={16}
                containerBackgroundColor={AppStyles.colors.actionBg}
                onPress={() =>
                  selectedComment
                    ? performAction(modalMode, selectedComment)
                    : alert('Please select a comment to continue')
                }
                label={modalMode === 'call' ? 'Meeting Setup' : 'Action'}
              />
            )}
            {showFollowup && (
              <TouchableButton
                containerStyle={styles.button}
                containerBackgroundColor={AppStyles.colors.yellowBg}
                fontFamily={AppStyles.fonts.boldFont}
                fontSize={16}
                textColor={AppStyles.colors.textColor}
                onPress={() =>
                  selectedComment
                    ? performFollowup(selectedComment)
                    : alert('Please select a comment to continue')
                }
                label={'Follow up'}
              />
            )}
            <TouchableButton
              containerStyle={[styles.button, { width: showAction ? '32%' : '100%' }]}
              fontFamily={AppStyles.fonts.boldFont}
              fontSize={16}
              containerBackgroundColor={AppStyles.colors.redBg}
              onPress={() =>
                selectedComment
                  ? performReject(selectedComment)
                  : alert('Please select a comment to continue')
              }
              label={'Reject'}
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
    borderColor: AppStyles.colors.textColor,
    color: AppStyles.colors.textColor,
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
    justifyContent: 'space-between',
  },
  button: {
    justifyContent: 'center',
    minHeight: 55,
    borderRadius: 4,
    padding: 10,
    width: '32%',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 50,
  },
  closeImg: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  flatlistContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
