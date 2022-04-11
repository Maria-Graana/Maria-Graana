/** @format */

import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import AppStyles from '../../AppStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import DiaryHelper from '../Diary/diaryHelper'
import { connect } from 'react-redux'

class TaskDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  goToEditTask = () => {
    const { route, navigation } = this.props
    const { diary } = route.params
    navigation.navigate('AddDiary', { update: true, data: diary })
  }

  render() {
    const { route, user } = this.props
    const { diary, agentId = null, isFromTimeSlot = false } = route.params
    return (
      <View style={AppStyles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.flexRow}>
            <Text style={[styles.headingText, { width: '90%' }]}> Task Type: </Text>
            {diary && diary.status === 'pending' && agentId === user.id && !isFromTimeSlot ? (
              <View style={{ width: '10%' }}>
                {
                  <MaterialCommunityIcons
                    onPress={() => {
                      this.goToEditTask()
                    }}
                    name="square-edit-outline"
                    size={26}
                    color={AppStyles.colors.primaryColor}
                  />
                }
              </View>
            ) : null}
          </View>
          <Text style={styles.labelText}> {`${DiaryHelper.showTaskType(diary.taskType)}`} </Text>
          <Text style={styles.headingText}> Report Duration: </Text>
          <Text style={styles.labelText}> {DiaryHelper.getReportDuration(diary)} </Text>

          {diary && diary.reasonTag ? (
            <View style={styles.editViewContainer}>
              <Text style={styles.headingText}> Reason: </Text>
              <View style={{ alignSelf: 'flex-start', marginVertical: 10 }}>
                <Text
                  style={[
                    styles.taskResponse,
                    {
                      borderColor: diary.reason ? diary.reason.colorCode : 'transparent',
                    },
                  ]}
                >
                  {diary.reasonTag}
                </Text>
              </View>
            </View>
          ) : null}

          <Text style={styles.headingText}> Description: </Text>
          <ScrollView style={{ minHeight: 20, maxHeight: 200, paddingLeft: 5 }}>
            <Text style={styles.labelText}>{diary.notes ? diary.notes : '-'}</Text>
          </ScrollView>

          {diary && diary.feedbackTag ? (
            <View style={styles.editViewContainer}>
              <Text style={styles.headingText}> Outcome: </Text>
              <View style={{ alignSelf: 'flex-start', marginVertical: 10 }}>
                <Text
                  style={[
                    styles.taskResponse,
                    {
                      borderColor: diary.armsFeedback
                        ? diary.armsFeedback.colorCode
                        : 'transparent',
                    },
                  ]}
                >
                  {diary.feedbackTag}
                </Text>
              </View>
            </View>
          ) : null}

          {diary && diary.response ? (
            <View>
              <Text style={styles.headingText}> Comments: </Text>
              <Text style={styles.labelText}> {` ${diary.response}`} </Text>
            </View>
          ) : null}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  innerContainer: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 5,
  },
  headingText: {
    fontSize: 14,
    paddingVertical: 5,
    paddingBottom: 0,
    fontFamily: AppStyles.fonts.defaultFont,
  },
  labelText: {
    fontSize: 14,
    paddingVertical: 5,
    fontFamily: AppStyles.fonts.semiBoldFont,
  },
  flexRow: {
    flexDirection: 'row',
    width: '100%',
  },
  taskResponse: {
    paddingHorizontal: 10,
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 14,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#FFC61B',
  },
  editViewContainer: {
    backgroundColor: 'white',
    borderRadius: 4,
  },
})

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    diary: store.diary.diary,
  }
}

export default connect(mapStateToProps)(TaskDetails)
