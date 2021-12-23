/** @format */

import React, { Component } from 'react'
import {
  Text,
  View,
  TextInput,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux'
import { clearDiaryFeedbacks, saveOrUpdateDiaryTask, setConnectFeedback } from '../../actions/diary'
import TouchableButton from '../../components/TouchableButton'
import ReconnectModal from '../../components/ReconnectModal'
import { setlead } from '../../actions/lead'
import axios from 'axios'
class DiaryFeedback extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isReconnectModalVisible: false,
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(setConnectFeedback({}))
    // Implement clear diary feedbacks here
    dispatch(clearDiaryFeedbacks())
  }

  setNextFlow = () => {
    const { diaryFeedbacks, connectFeedback, dispatch } = this.props

    //console.log('Action=>', connectFeedback)
    if (Object.keys(connectFeedback).length) {
      if (connectFeedback.section === "Couldn't Connect")
        this.setState({ isReconnectModalVisible: true })
      else if (connectFeedback.section === 'Follow up') this.handleNextAction('set_follow_up')
      else if (connectFeedback.section === 'No Action Required')
        this.handleNextAction('no_action_required')
      // else if (
      //   ['Follow up', 'Cancel Viewing', 'Cancel Meeting'].indexOf(connectFeedback.section) > -1
      // ) {
      //   if (
      //     connectFeedback.section !== 'Cancel Viewing' ||
      //     ['Done', 'Cancel'].indexOf(actionType) > -1
      //   )
      //     // exclude direct cancel(outside of connect flow) viewing case
      //     setSlotModal(true)
      //   else {
      //     setRescheduleViewingModal(true)
      //     props.fetchLeadScheduledProperties(diary.armsLeadId)
      //     setCancelAction(true)
      //   }
      // }
      //  else if (connectFeedback.section === 'refer') setInvestLeadModal(true)
      //   else if (connectFeedback.section === 'Reject') setRwrModal(true)
      //   else if (connectFeedback.section === 'No Action Required')
      //     saveOrUpdateDiaryTask({
      //       ...newTask,
      //       makeHistory: true,
      //       otherTasksToUpdate: connectFeedback.otherTasksToUpdate.map((task) => {
      //         return {
      //           ...newTask,
      //           id: task.id,
      //           makeHistory: true,
      //           comments: task.comment,
      //           response: task.comment,
      //           feedbackId: connectFeedback.id,
      //           feedbackTag: connectFeedback.tag,
      //         }
      //       }),
      //       comments: connectFeedback.comment,
      //       response: connectFeedback.comment,
      //       feedbackId: connectFeedback.id,
      //       feedbackTag: connectFeedback.tag,
      //     })
    }
  }

  setIsReconnectModalVisible = (value, type) => {
    this.setState({ isReconnectModalVisible: value }, () => {
      this.handleNextAction(type)
    })
  }

  handleNextAction = (type) => {
    const { dispatch, connectFeedback, route, navigation, diary, user } = this.props
    const { selectedDiary, selectedLead } = diary
    if (type === 'connect_again' || type === 'no_action_required') {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          makeHistory: true,
          comments: connectFeedback.comments,
          response: connectFeedback.comments,
          feedbackId: connectFeedback.feedbackId,
          feedbackTag: connectFeedback.tag,
          otherTasksToUpdate: [],
        })
      ).then((res) => {
        if (res) {
          console.log(this.props.connectFeedback)
          saveOrUpdateDiaryTask(this.props.connectFeedback).then((response) => {
            if (response) {
              navigation.goBack()
            }
          })
        }
      })
      // console.log('connect again', connectFeedback)
    } else if (type === 'set_follow_up' || type === 'add_meeting') {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          comments: connectFeedback.comments,
          response: connectFeedback.comments,
          feedbackId: connectFeedback.feedbackId,
          feedbackTag: connectFeedback.tag,
          status: 'completed',
          otherTasksToUpdate: [],
        })
      ).then((res) => {
        // console.log('previoustaskpayload=>', this.props.connectFeedback)
        saveOrUpdateDiaryTask(this.props.connectFeedback).then((res) => {
          if (res) {
            navigation.replace('TimeSlotManagement', {
              data: {
                userId: user.id,
                taskCategory: 'leadTask',
                reasonTag: connectFeedback.tag,
                reasonId: connectFeedback.feedbackId,
                taskType: type === 'set_follow_up' ? 'follow_up' : 'meeting',
                armsLeadId:
                  selectedDiary && selectedDiary.armsLeadId ? selectedDiary.armsLeadId : null,
                leadId:
                  selectedDiary && selectedDiary.armsProjectLeadId
                    ? selectedDiary.armsProjectLeadId
                    : null,
              },
              taskType: type === 'set_follow_up' ? 'follow_up' : 'meeting',
              isFromConnectFlow: true,
            })
          }
        })
      })
    } else if (type === 'book_a_unit') {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          comments: connectFeedback.comments,
          response: connectFeedback.comments,
          feedbackId: connectFeedback.feedbackId,
          feedbackTag: connectFeedback.tag,
          status: 'completed',
          otherTasksToUpdate: [],
        })
      ).then((res) => {
        saveOrUpdateDiaryTask(this.props.connectFeedback).then((res) => {
          if (res) {
            // get all information for lead before moving to next screen
            axios.get(`/api/leads/project/byId?id=${selectedLead.id}`).then((res) => {
              if (res.data) {
                dispatch(setlead(res.data))
                navigation.replace('CMLeadTabs', {
                  screen: 'Payments',
                  params: { screenName: 'Payments' },
                })
              }
            })
          }
        })
      })
    } else if (type === 'reschedule_meeting') {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          comments: connectFeedback.comments,
          response: connectFeedback.comments,
          feedbackId: connectFeedback.feedbackId,
          feedbackTag: connectFeedback.tag,
          makeHistory: true,
          otherTasksToUpdate: [],
        })
      ).then((res) => {
        // console.log('previoustaskpayload=>', this.props.connectFeedback)
        saveOrUpdateDiaryTask(this.props.connectFeedback).then((res) => {
          if (res) {
            navigation.replace('TimeSlotManagement', {
              data: {
                userId: user.id,
                taskCategory: 'leadTask',
                reasonTag: connectFeedback.tag,
                reasonId: connectFeedback.feedbackId,
                taskType: 'meeting',
                armsLeadId:
                  selectedDiary && selectedDiary.armsLeadId ? selectedDiary.armsLeadId : null,
                leadId:
                  selectedDiary && selectedDiary.armsProjectLeadId
                    ? selectedDiary.armsProjectLeadId
                    : null,
              },
              taskType: 'meeting',
              isFromConnectFlow: true,
            })
          }
        })
      })
    }
  }

  render() {
    const { diaryFeedbacks, connectFeedback, dispatch } = this.props
    const { isReconnectModalVisible } = this.state
    return (
      <View style={AppStyles.container}>
        <ScrollView>
          <ReconnectModal
            isReconnectModalVisible={isReconnectModalVisible}
            setIsReconnectModalVisible={(value, type) =>
              this.setIsReconnectModalVisible(value, type)
            }
          />
          <View style={[AppStyles.mainInputWrap]}>
            <TextInput
              // ref={textInput}
              placeholderTextColor={'#a8a8aa'}
              style={[
                AppStyles.formControl,
                Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
                AppStyles.formFontSettings,
                styles.commentContainer,
              ]}
              multiline
              //autoFocus
              placeholder={'Comments'}
              onChangeText={(text) =>
                dispatch(setConnectFeedback({ ...connectFeedback, comments: text }))
              }
              // value={connectFeedback && connectFeedback.comment ? connectFeedback.comment : null}
            />
          </View>
          {diaryFeedbacks &&
            Object.keys(diaryFeedbacks).map((key, j) => {
              return diaryFeedbacks[key].map((feedback, i) => {
                return feedback.tags ? (
                  <View key={i} style={styles.sectionView}>
                    <Text style={styles.sectionText}>{feedback.section}</Text>
                    <View style={styles.chipMain}>
                      {feedback.tags &&
                        feedback.tags.map((tag, k) => {
                          return (
                            <TouchableOpacity
                              key={k}
                              style={[
                                styles.chipContainer,
                                {
                                  borderColor: feedback.colorCode,
                                  backgroundColor:
                                    feedback.section === 'Actions'
                                      ? '#026ff2'
                                      : connectFeedback && tag === connectFeedback.tag
                                      ? connectFeedback.colorCode
                                      : 'white',
                                },
                              ]}
                              onPress={() => {
                                if (feedback.section === 'Actions') {
                                  dispatch(
                                    setConnectFeedback({
                                      ...connectFeedback,
                                      section: feedback.section,
                                      colorCode: feedback.colorCode,
                                      feedbackId: feedback.id,
                                      tag: tag,
                                      comments: connectFeedback.comments || tag,
                                    })
                                  ).then((res) => {
                                    this.handleNextAction(tag.replace(/\s+/g, '_').toLowerCase())
                                  })
                                } else
                                  dispatch(
                                    setConnectFeedback({
                                      ...connectFeedback,
                                      section: feedback.section,
                                      colorCode: feedback.colorCode,
                                      feedbackId: feedback.id,
                                      tag: tag,
                                      comments: connectFeedback.comments || tag,
                                    })
                                  )
                              }}
                            >
                              <Text
                                style={[
                                  styles.chipName,
                                  {
                                    color:
                                      feedback.section === 'Actions' ||
                                      (connectFeedback && tag === connectFeedback.tag)
                                        ? 'white'
                                        : 'black',
                                  },
                                ]}
                              >
                                {tag}
                              </Text>
                            </TouchableOpacity>
                          )
                        })}
                    </View>
                  </View>
                ) : null
              })
            })}
        </ScrollView>
        <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            containerStyle={[AppStyles.formBtn]}
            label={'OK'}
            onPress={() => this.setNextFlow()}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
  sectionView: {
    marginVertical: 10,
    marginHorizontal: 5,
    flex: 1,
  },
  sectionText: {
    marginVertical: 5,
    fontFamily: AppStyles.fonts.semiBoldFont,
    color: AppStyles.colors.textColor,
  },
  chipMain: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  chipContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    margin: 5,
  },
  chipName: {
    fontSize: 12,
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.semiBoldFont,
    alignSelf: 'center',
  },
})

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    diary: store.diary.diary,
    diaryFeedbacks: store.diary.diaryFeedbacks,
    connectFeedback: store.diary.connectFeedback,
  }
}

export default connect(mapStateToProps)(DiaryFeedback)
