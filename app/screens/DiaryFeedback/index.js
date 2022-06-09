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
  FlatList,
} from 'react-native'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux'
import {
  clearDiaryFeedbacks,
  FEEDBACK_ACTIONS,
  getPropertyViewings,
  saveOrUpdateDiaryTask,
  setConnectFeedback,
  setMultipleModalVisible,
  setNextTask,
  setSelectedDiary,
} from '../../actions/diary'
import TouchableButton from '../../components/TouchableButton'
import ReconnectModal from '../../components/ReconnectModal'
import { setlead } from '../../actions/lead'
import axios from 'axios'
import RWRModal from '../../components/RWRModal'
import helper from '../../helper'
import DiaryHelper from '../Diary/diaryHelper'
import RescheduleViewingTile from '../../components/RescheduleViewingTile'
import Loader from '../../components/loader'
import _ from 'underscore'
class DiaryFeedback extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isReconnectModalVisible: false,
      isRWRModalVisible: false,
      loading: false,
      propertyShortlistData: [],
    }
  }

  componentDidMount() {
    const { diary, route, user, connectFeedback, dispatch, selectedDiary, selectedLead } =
      this.props
    const { actionType = null } = route?.params

    if (
      actionType &&
      actionType === 'Done' &&
      selectedDiary &&
      selectedDiary.taskType === 'viewing'
    ) {
      if (selectedLead) {
        this.setState({ loading: true }, async () => {
          let data = await getPropertyViewings(selectedLead.id, user.id)
          this.setState({ propertyShortlistData: data, loading: false }, () => {
            if (selectedDiary && selectedDiary.propertyId) {
              this.addProperty(true, selectedDiary.propertyId)
              dispatch(setConnectFeedback({ ...connectFeedback, otherTasksToUpdate: [] }))
            }
          })
        })
      }
    }
  }

  setNextFlow = () => {
    const { diaryFeedbacks, connectFeedback, dispatch, route, diary, selectedDiary, selectedLead } =
      this.props
    const { actionType = 'Connect' } = route?.params

    if (
      Object.keys(connectFeedback).length &&
      connectFeedback.comments &&
      connectFeedback.feedbackId
    ) {
      if (connectFeedback.section === "Couldn't Connect")
        this.setState({ isReconnectModalVisible: true })
      else if (
        actionType &&
        actionType === 'Done' &&
        selectedDiary &&
        selectedDiary.taskType === 'viewing'
      ) {
        this.handleNextAction({ type: 'done_viewing', section: connectFeedback.section })
      } else if (connectFeedback.section === 'Follow up')
        this.handleNextAction({ type: 'set_follow_up' })
      else if (connectFeedback.section === 'No Action Required')
        this.handleNextAction({ type: 'no_action_required' })
      else if (connectFeedback.section === 'Reject') {
        this.setState({ isRWRModalVisible: true })
      } else if (connectFeedback.section === 'Cancel Meeting')
        this.handleNextAction({ type: 'cancel_meeting' })
      else if (connectFeedback.section === 'Cancel Viewing') {
        this.handleNextAction({ type: 'cancel_viewing' })
      }
    } else {
      alert('reason is mandatory to continue!')
    }
  }

  setIsReconnectModalVisible = (value, type) => {
    this.setState({ isReconnectModalVisible: value }, () => {
      this.handleNextAction({ type })
    })
  }

  handleNextAction = (data) => {
    const {
      dispatch,
      connectFeedback,
      route,
      navigation,
      diary,
      user,
      selectedDiary,
      selectedLead,
    } = this.props
    const { type, reason = '', isBlacklist = false, section } = data
    if (type === 'connect_again') {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          makeHistory: true,
          comments: connectFeedback.comments,
          response: connectFeedback.comments,
          feedbackId: connectFeedback.feedbackId,
          response: connectFeedback.tag,
        })
      ).then((res) => {
        if (res) {
          saveOrUpdateDiaryTask(this.props.connectFeedback).then((response) => {
            if (response) {
              let copyConnectObj = { ...this.props.connectFeedback }
              delete copyConnectObj.makeHistory
              delete copyConnectObj.comments
              delete copyConnectObj.response
              delete copyConnectObj.feedbackId
              delete copyConnectObj.response
              delete copyConnectObj.tag
              delete copyConnectObj.colorCode
              delete copyConnectObj.section
              dispatch(setConnectFeedback(copyConnectObj)).then((res) => {
                dispatch(clearDiaryFeedbacks())
                dispatch(setMultipleModalVisible(true))
                navigation.goBack()
              })
            }
          })
        }
      })
    }
    if (type === 'no_action_required') {
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
          saveOrUpdateDiaryTask(this.props.connectFeedback).then((response) => {
            if (response) {
              dispatch(setConnectFeedback({}))
              dispatch(clearDiaryFeedbacks())
              navigation.goBack()
            }
          })
        }
      })
    } else if (
      type === 'set_follow_up' ||
      type === 'add_meeting' ||
      type === 'setup_another_meeting'
    ) {
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
        let copyObj = { ...this.props.connectFeedback }
        copyObj.selectedLead = selectedLead
        copyObj.status = 'pending'
        copyObj.reasonId = copyObj.feedbackId
        copyObj.reasonTag = copyObj.tag
        copyObj.taskCategory = 'leadTask'
        copyObj.userId = user.id
        copyObj.taskType = type === 'set_follow_up' ? 'follow_up' : 'meeting'
        copyObj.armsLeadId =
          selectedDiary && selectedDiary.armsLeadId ? selectedDiary.armsLeadId : null
        copyObj.leadId =
          selectedDiary && selectedDiary.armsProjectLeadId ? selectedDiary.armsProjectLeadId : null
        delete copyObj.id
        delete copyObj.feedbackId
        delete copyObj.feedbackTag

        navigation.replace('TimeSlotManagement', {
          data: copyObj,
          taskType: type === 'set_follow_up' ? 'follow_up' : 'meeting',
          isFromConnectFlow: true,
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
          dispatch(setConnectFeedback({}))
          dispatch(clearDiaryFeedbacks())
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
          leadId: selectedDiary && selectedDiary.armsLeadId ? selectedDiary.armsLeadId : null,
          feedbackId: connectFeedback.feedbackId,
          feedbackTag: connectFeedback.tag,
        })
      ).then((res) => {
        navigation.replace('TimeSlotManagement', {
          data: {
            userId: user.id,
            taskCategory: 'leadTask',
            reasonTag: connectFeedback.tag,
            reasonId: connectFeedback.feedbackId,
            makeHistory: true,
            id: selectedDiary.id,
            taskType: 'meeting',
            leadId:
              selectedDiary && selectedDiary.armsProjectLeadId
                ? selectedDiary.armsProjectLeadId
                : null,
            selectedLead,
          },
          taskType: 'meeting',
          isFromConnectFlow: true,
        })
      })
    } else if (type === 'reject') {
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
            this.closedLost(
              isBlacklist,
              DiaryHelper.getLeadType(selectedDiary),
              selectedLead,
              reason
            )
          }
        })
        dispatch(setConnectFeedback({}))
        dispatch(clearDiaryFeedbacks())
      })
    } else if (type === 'cancel_meeting') {
      // Cancel the meeting task and make a followup task as next task
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          comments: connectFeedback.comments,
          response: connectFeedback.comments,
          feedbackId: connectFeedback.feedbackId,
          feedbackTag: connectFeedback.tag,
          status: 'cancelled',
          otherTasksToUpdate: [],
        })
      ).then((res) => {
        navigation.replace('TimeSlotManagement', {
          data: {
            userId: user.id,
            taskCategory: 'leadTask',
            reasonTag: connectFeedback.tag,
            reasonId: connectFeedback.feedbackId,
            taskType: 'follow_up',
            armsLeadId: selectedDiary && selectedDiary.armsLeadId ? selectedDiary.armsLeadId : null,
            leadId:
              selectedDiary && selectedDiary.armsProjectLeadId
                ? selectedDiary.armsProjectLeadId
                : null,
            selectedLead,
          },
          taskType: 'follow_up',
          isFromConnectFlow: true,
        })
      })
    } else if (type === 'setup_viewing') {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          comments: connectFeedback.comments,
          response: connectFeedback.comments,
          feedbackId: connectFeedback.feedbackId,
          feedbackTag: connectFeedback.tag,
          armsLeadId: selectedDiary && selectedDiary.armsLeadId ? selectedDiary.armsLeadId : null,
          status: 'completed',
          otherTasksToUpdate: [],
        })
      ).then((res) => {
        saveOrUpdateDiaryTask(this.props.connectFeedback).then((res) => {
          dispatch(setConnectFeedback({}))
          dispatch(clearDiaryFeedbacks())
          if (res) {
            // get all information for lead before moving to next screen
            axios.get(`/api/leads/byId?id=${selectedLead.id}`).then((res) => {
              if (res.data) {
                dispatch(setlead(res.data))
                navigation.replace('RCMLeadTabs', {
                  screen: 'Viewing',
                  params: { screenName: 'Viewing' },
                })
              }
            })
          }
        })
      })
    } else if (type === 'reschedule_viewings') {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          comments: connectFeedback.comments,
          response: connectFeedback.comments,
          id: selectedDiary.id,
          armsLeadId: selectedDiary && selectedDiary.armsLeadId ? selectedDiary.armsLeadId : null,
          feedbackId: connectFeedback.feedbackId,
          feedbackTag: connectFeedback.tag,
          otherTasksToUpdate: [],
        })
      ).then((res) => {
        navigation.replace('RescheduleViewings', { mode: 'rescheduleViewing' })
      })
    } else if (type === 'cancel_viewing') {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          comments: connectFeedback.comments,
          response: connectFeedback.comments,
          id: selectedDiary.id,
          feedbackId: connectFeedback.feedbackId,
          armsLeadId: selectedDiary && selectedDiary.armsLeadId ? selectedDiary.armsLeadId : null,
          status: 'cancelled',
          otherTasksToUpdate: [],
          feedbackTag: connectFeedback.tag,
        })
      ).then((res) => {
        navigation.replace('RescheduleViewings', { mode: 'cancelViewing' })
      })
    } else if (type === 'done_viewing' && (section === 'Follow up' || section === 'Reject')) {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          response: connectFeedback.comments,
          armsLeadId: selectedDiary && selectedDiary.armsLeadId ? selectedDiary.armsLeadId : null,
          status: 'completed',
          feedbackTag: connectFeedback.tag,
        })
      ).then((res) => {
        if (section === 'Follow up') {
          const copyObj = { ...this.props.connectFeedback }
          copyObj.status = 'pending'
          copyObj.otherTasksToUpdate = []
          copyObj.reasonId = copyObj.feedbackId
          copyObj.reasonTag = copyObj.tag
          copyObj.taskType = 'follow_up'
          copyObj.selectedLead = selectedLead
          delete copyObj.id
          delete copyObj.feedbackId
          delete copyObj.feedbackTag
          dispatch(setConnectFeedback(copyObj)).then((res) => {
            navigation.replace('TimeSlotManagement', {
              data: { ...this.props.connectFeedback },
              taskType: 'follow_up',
              isFromConnectFlow: true,
            })
          })
        } else if (section === 'Reject') {
          this.setState({ isRWRModalVisible: true })
        }
      })
    } else if (
      type === 'shortlist_properties' ||
      type === 'offer' ||
      type === 'setup_more_viewings' ||
      type === 'propsure' ||
      type === 'select_property_for_transaction'
    ) {
      dispatch(
        setConnectFeedback({
          ...connectFeedback,
          response: connectFeedback.comments,
          id: selectedDiary.id,
          armsLeadId: selectedDiary && selectedDiary.armsLeadId ? selectedDiary.armsLeadId : null,
          status: 'completed',
          feedbackTag: connectFeedback.tag,
        })
      ).then((res) => {
        saveOrUpdateDiaryTask(this.props.connectFeedback).then((res) => {
          if (res) {
            axios.get(`api/leads/byId?id=${selectedLead.id}`).then((response) => {
              if (response.data) {
                dispatch(setlead(response.data))
                if (type === 'shortlist_properties') {
                  navigation.replace('RCMLeadTabs', {
                    screen: 'Match',
                    params: { screenName: 'Match' },
                  })
                } else if (type === 'offer') {
                  navigation.replace('RCMLeadTabs', {
                    screen: 'Offer',
                    params: { screenName: 'Offer' },
                  })
                } else if (type === 'setup_more_viewings') {
                  navigation.replace('RCMLeadTabs', {
                    screen: 'Viewing',
                    params: { screenName: 'Viewing' },
                  })
                } else if (type === 'propsure') {
                  navigation.replace('RCMLeadTabs', {
                    screen: 'Propsure',
                    params: { screenName: 'Propsure' },
                  })
                } else if (type === 'select_property_for_transaction') {
                  navigation.replace('RCMLeadTabs', {
                    screen: 'Payment',
                    params: { screenName: 'Payment' },
                  })
                }
              }
            })
          }
        })
      })
    }
  }

  closedLost = (isBlacklist = false, leadType, lead, reason = '') => {
    const { navigation } = this.props
    let url = `/api/leads/project`
    if (leadType === 'BuyRent') url = `/api/leads`
    else if (leadType === 'Wanted') url = `/api/wanted`
    axios({
      method: 'patch',
      url: url,
      params: {
        id: leadType === 'Wanted' ? lead && lead.id : lead && [lead.id],
        blacklistCustomer: isBlacklist,
      },
      data: {
        [leadType === 'Wanted' ? 'reason' : 'reasons']: reason,
        [['BuyRent', 'Project'].indexOf(leadType) > -1 ? 'customerId' : 'customer_id']:
          lead.customer && lead.customer.id,
      },
    }).then((res) => {
      this.setState({ isRWRModalVisible: false })
      helper.successToast('Lead closed successfully!')
      navigation.goBack()
    })
  }

  addProperty = (val, id) => {
    const { propertyShortlistData } = this.state
    let newMatches = propertyShortlistData.map((property) => {
      if (property.id === id) {
        property.checkBox = val
        return property
      } else {
        return property
      }
    })
    this.setState({ propertyShortlistData: newMatches })
  }

  render() {
    const {
      diaryFeedbacks,
      connectFeedback,
      dispatch,
      diary,
      route,
      user,
      contacts,
      selectedDiary,
      selectedLead,
    } = this.props
    const { isReconnectModalVisible, isRWRModalVisible, loading, propertyShortlistData } =
      this.state
    const { actionType = 'Connect' } = route?.params
    const FA = FEEDBACK_ACTIONS
    return loading ? (
      <Loader loading={loading} />
    ) : (
      <View style={AppStyles.container}>
        <ScrollView>
          <ReconnectModal
            isReconnectModalVisible={isReconnectModalVisible}
            taskType={selectedDiary ? selectedDiary.taskType : null}
            setIsReconnectModalVisible={(value, type) =>
              this.setIsReconnectModalVisible(value, type)
            }
          />
          <RWRModal
            isVisible={isRWRModalVisible}
            showHideModal={(value) => this.setState({ isRWRModalVisible: value })}
            rejectLead={(reason, isBlacklist) =>
              this.handleNextAction({ type: 'reject', reason, isBlacklist })
            }
            selectedReason={connectFeedback.tag ? connectFeedback.tag : null}
            message={
              'Lead will be closed as lost with this action. Are you sure you want to continue?'
            }
          />

          {actionType &&
          actionType === 'Done' &&
          selectedDiary &&
          selectedDiary.taskType === 'viewing' ? (
            <FlatList
              data={_.clone(propertyShortlistData)}
              renderItem={({ item }) => (
                <View style={{ marginVertical: 3 }}>
                  <RescheduleViewingTile
                    data={item}
                    user={user}
                    fromScreen={'DiaryFeedback'}
                    toggleCheckBox={this.addProperty}
                    showCheckboxes={true}
                    connectFeedback={connectFeedback}
                    selectedDiary={selectedDiary}
                    contacts={contacts}
                  />
                </View>
              )}
              keyExtractor={(item, index) => item.id.toString()}
            />
          ) : (
            <View style={[AppStyles.mainInputWrap]}>
              <TextInput
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
              />
            </View>
          )}

          {diaryFeedbacks &&
            Object.keys(diaryFeedbacks).map((key, j) => {
              return diaryFeedbacks[key].map((feedback, i) => {
                if (feedback.section === 'Actions') JSON.parse(feedback.tags[0])
                return feedback.tags ? (
                  <View key={i} style={styles.sectionView}>
                    <Text style={styles.sectionText}>{feedback.section}</Text>
                    <View style={styles.chipMain}>
                      {feedback.section === 'Actions'
                        ? feedback.tags &&
                          Object.keys(JSON.parse(feedback.tags[0])).map((tag, k) => (
                            <TouchableOpacity
                              key={k}
                              style={[
                                styles.chipContainer,
                                {
                                  borderColor: feedback.colorCode,
                                  backgroundColor:
                                    feedback.section === 'Actions'
                                      ? '#026ff2'
                                      : connectFeedback &&
                                        JSON.parse(feedback.tags[0])[tag] === connectFeedback.tag
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
                                      tag: JSON.parse(feedback.tags[0])[tag],
                                      comments: connectFeedback.comments || tag,
                                    })
                                  ).then((res) => {
                                    tag
                                      ? this.handleNextAction({
                                          type: tag.replace(/\s+/g, '_').toLowerCase(),
                                        })
                                      : alert('reason is mandatory to continue!')
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
                                      (connectFeedback &&
                                        JSON.parse(feedback.tags[0])[tag] === connectFeedback.tag)
                                        ? 'white'
                                        : 'black',
                                  },
                                ]}
                              >
                                {tag}
                              </Text>
                            </TouchableOpacity>
                          ))
                        : feedback.tags &&
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
                                      tag
                                        ? this.handleNextAction({
                                            type: tag.replace(/\s+/g, '_').toLowerCase(),
                                          })
                                        : alert('reason is mandatory to continue!')
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
    selectedDiary: store.diary.selectedDiary,
    selectedLead: store.diary.selectedLead,
    diaryFeedbacks: store.diary.diaryFeedbacks,
    connectFeedback: store.diary.connectFeedback,
    contacts: store.contacts.contacts,
  }
}

export default connect(mapStateToProps)(DiaryFeedback)
