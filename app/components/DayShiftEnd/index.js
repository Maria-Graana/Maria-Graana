/** @format */

import React, { useEffect, useState } from 'react'
import { Alert, SafeAreaView, Text, View } from 'react-native'
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

  let date = new Date()
  const todayDate = moment(date).format('YYYY-MM-DD')
  const shiftStartDate = moment(startTime).format('YYYY-MM-DD')
  const shiftEndDate = moment(endTime).format('YYYY-MM-DD')

  const emailStats = () => {
    let endpoint = `/api/diary/emailstats?userId=${user.id}&day=${day}&startTime=${startTime}&endTime=${endTime}`
    axios
      .post(endpoint)
      .then((res) => {
        Alert.alert('Success')
      })
      .catch((err) => {
        Alert.alert('Something went wrong!')
      })
  }

  const alertWarn = () => {
    Alert.alert(
      'Finish Day?',
      'Are you sure you want to finish your day? You will still be able to work on your remaining tasks, but a report with above stats will be sent to your manager',
      [
        {
          text: 'Not Now',
          style: 'cancel',
        },
        { text: 'Finish Day', onPress: () => emailStats() },
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

    const overDue = total - remaining

    setTotalTasks(total)
    setRemainingTasks(remaining)
    setOverDueTasks(overDue)
  }, [visible])

  if (visible) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topView}>
          <Text style={styles.heading}>DAILY FINISH REPORT</Text>
        </View>
        <Ionicons
          name="md-close-circle-outline"
          color="black"
          size={35}
          style={styles.icon}
          onPress={() => setVisible(!visible)}
        />

        <View style={styles.cardView}>
          <View style={styles.card}>
            <Text>Name:</Text>
            <Text style={styles.cardText}>
              {user.firstName}
              {user.lastName}
            </Text>

            <Text style={styles.cardInnerSpace}>Report Duration:</Text>
            <Text style={styles.cardText}>
              {moment(startTime).format('hh:mm a DD MMM')} -{' '}
              {moment(endTime).format('hh:mm a DD MMM')}
            </Text>
          </View>
        </View>

        <View style={styles.containerRow}>
          <View style={styles.TotalBox}>
            <Text style={styles.TotalLabel1}>
              {remainingTasks}/{totalTasks}
            </Text>
            <Text style={styles.TotalLabel2}>Total Tasks of the Day</Text>
          </View>
        </View>

        <View style={styles.containerOverDueRow}>
          <View style={styles.OverDueBox}>
            <Text style={styles.bigLabelBoxText1}>
              {overDueTasks.toString().length == 1 ? '0' + overDueTasks : overDueTasks}
            </Text>
            <Text style={styles.bigLabelBoxText2}>Overdue Tasks</Text>
          </View>
        </View>

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
                {diaryStat['Meetings done']}/{diaryStat['Total meetings']}
              </Text>
              <Text style={styles.bigLabelBoxText2}>Meetings</Text>
            </View>
          </View>

          <View style={styles.bigBoxViewOuterRight}>
            <View style={styles.bigBoxViewInner}>
              <Text style={styles.bigLabelBoxText1}>
                {diaryStat['Viewings done']}/{diaryStat['Total viewings']}
              </Text>
              <Text style={styles.bigLabelBoxText2}>Viewings</Text>
            </View>
          </View>
        </View>

        {todayDate == shiftStartDate && todayDate == shiftEndDate && (
          <View style={styles.buttonEndView}>
            <TouchableButton
              containerStyle={styles.endPageBtn}
              label="Day/Shift End"
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
