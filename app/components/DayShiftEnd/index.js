/** @format */

import React, { useEffect, useState } from 'react'
import { Alert, SafeAreaView, ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TouchableButton from '../TouchableButton'
import styles from './style'
import moment from 'moment'
import axios from 'axios'

export default function DayShiftEnd({
  navigation,
  setVisible,
  visible,
  diaryStat,
  user,
  startTime,
  endTime,
  day,
}) {
  const [totalTasks, setTotalTasks] = useState(null)
  const [remainingTasks, setRemainingTasks] = useState(null)
  const [overDueTasks, setOverDueTasks] = useState(null)
  const [rejectedTasks, setRejectedTasks] = useState(null)
  const [totalActions, setTotalActions] = useState(null)
  const [remainingActions, setRemainingActions] = useState(null)

  let date = new Date()
  const _format = 'YYYY-MM-DD'
  const todayDate = moment(date).format('YYYY-MM-DD')
  const shiftStartDate = moment(startTime).format('YYYY-MM-DD')
  const shiftEndDate = moment(endTime).format('YYYY-MM-DD')
  const nextDate = moment(todayDate, _format).add(1, 'days').format(_format)
  const prevDate = moment(todayDate, _format).add(-1, 'days').format(_format)

  const emailStats = () => {
    let endpoint = `/api/diary/emailstats?userId=${user.id}&day=${day}&startTime=${startTime}&endTime=${endTime}`
    axios
      .post(endpoint)
      .then((res) => {
        // Alert.alert('Success')
      })
      .catch((err) => {
        Alert.alert('Something went wrong!')
      })
  }

  const alertWarn = () => {
    Alert.alert(
      'End Day',
      'Are you sure you want to finish your day? You will still be able to work on your remaining tasks, but a report with above stats will be sent to your manager',
      [
        { text: 'End Day', onPress: () => emailStats() },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    )
  }

  useEffect(() => {
    navigation.setOptions({ headerShown: visible == true ? false : true })
    const total =
      diaryStat['Total Connect'] +
      diaryStat['Total FollowUps'] +
      diaryStat['Total meetings'] +
      diaryStat['Total viewings']

    const remaining =
      diaryStat['Connect tasks done'] +
      diaryStat['Follow ups done'] +
      diaryStat['Meetings done'] +
      diaryStat['Viewings done']

    const rejected =
      diaryStat['BuyRentLeads Rejected'] +
      diaryStat['ProjectLeads Rejected'] +
      diaryStat['WantedLeads Rejected']

    const actionDone = diaryStat['Meetings done'] + diaryStat['Viewings done']

    const actionTotal = diaryStat['Total meetings'] + diaryStat['Total viewings']

    const overDue = total - remaining

    setTotalTasks(total)
    setRemainingTasks(remaining)
    setOverDueTasks(overDue)
    setRejectedTasks(rejected)
    setTotalActions(actionTotal)
    setRemainingActions(actionDone)
  }, [visible])

  if (visible) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topView}>
          <Text style={styles.heading}>DAY END REPORT</Text>
        </View>
        <Ionicons
          name="md-close-circle-outline"
          color="black"
          size={35}
          style={styles.icon}
          onPress={() => setVisible(!visible)}
        />

        <ScrollView>
          <View style={styles.cardView}>
            <View style={styles.card}>
              <Text>Name:</Text>
              <Text style={styles.cardText}>
                {user.firstName} {''}
                {user.lastName}
              </Text>

              <Text style={styles.cardInnerSpace}>Report Duration:</Text>
              <Text style={styles.cardText}>
                {moment(startTime).format('hh:mm a')} - {moment(endTime).format('hh:mm a')} {'('}
                {moment(startTime).format('YYYY-MM-DD')}
                {')'}
              </Text>
            </View>
          </View>

          <View style={styles.containerRow}>
            <View style={styles.TotalBox}>
              <Text style={styles.TotalLabel1}>
                {remainingTasks == 'NaN' ? 0 : remainingTasks}/
                {totalTasks == 'NaN' ? 0 : totalTasks}
              </Text>
              <Text style={styles.TotalLabel2}>Total Tasks of the Day</Text>
            </View>
          </View>

          <View style={styles.containerOverDueRow}>
            <View style={styles.OverDueBox}>
              <Text style={styles.bigLabelBoxText1}>
                {/* {overDueTasks.toString().length == 1 && overDueTasks.toString() != '0'
                ? '0' + overDueTasks
                : overDueTasks} */}
                {diaryStat['Overdue Tasks']}
              </Text>
              <Text style={styles.bigLabelBoxText2}>Overdue Tasks</Text>
            </View>
          </View>

          <View style={styles.viewBottomScroll}>
            <View style={styles.containerRow}>
              <View style={styles.connectBoxViewOuterLeft}>
                <View style={styles.connectBoxViewInner}>
                  <Text style={styles.bigLabelBoxText1}>
                    {diaryStat['Connect tasks done']}/{diaryStat['Total Connect']}
                  </Text>
                  <Text style={styles.bigLabelBoxText2}>Connects Tasks</Text>
                </View>
              </View>

              <View style={styles.followBoxViewOuterRight}>
                <View style={styles.followBoxViewInner}>
                  <Text style={styles.bigLabelBoxText1}>
                    {diaryStat['Follow ups done']}/{diaryStat['Total FollowUps']}
                  </Text>
                  <Text style={styles.bigLabelBoxText2}>Follow Up Tasks</Text>
                </View>
              </View>
            </View>

            <View style={styles.containerRow}>
              <View style={styles.bigBoxViewOuterLeft}>
                <View style={styles.bigBoxViewInner}>
                  <Text style={styles.bigLabelBoxText1}>
                    {remainingActions == 'NaN' ? 0 : remainingActions}/
                    {totalActions == 'NaN' ? 0 : totalActions}
                  </Text>
                  <Text style={styles.bigLabelBoxText2}>Actions</Text>
                </View>
              </View>

              <View style={styles.bigBoxViewOuterRight}>
                <View style={styles.bigBoxViewInnerL}>
                  <Text style={styles.bigLabelBoxText1}>
                    {rejectedTasks == 'NaN' ? 0 : rejectedTasks}
                  </Text>
                  <Text style={styles.bigLabelBoxText2}>Leads Rejected</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {todayDate == shiftStartDate && (todayDate == shiftEndDate || nextDate == shiftEndDate) && (
          <View style={styles.buttonEndView}>
            <TouchableButton
              containerStyle={styles.endPageBtn}
              label="Day End"
              borderColor="white"
              containerBackgroundColor="#0f73ee"
              borderWidth={1}
              onPress={() => alertWarn()}
            />
          </View>
        )}
      </SafeAreaView>
    )
  } else {
    return null
  }
}
