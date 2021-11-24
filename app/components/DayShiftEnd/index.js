/** @format */

import React, { useEffect } from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import TouchableButton from '../TouchableButton'
import styles from './style'

export default function DayShiftEnd({ navigation, setVisible, visible }) {
  useEffect(() => {
    navigation.setOptions({ headerShown: visible == true ? false : true })
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
            <Text style={styles.cardText}>Anas Murtaza</Text>

            <Text style={styles.cardInnerSpace}>Report Duration:</Text>
            <Text style={styles.cardText}>100-009</Text>
          </View>
        </View>

        <View style={styles.containerRow}>
          <View style={styles.TotalBox}>
            <Text style={styles.TotalLabel1}>72/80</Text>
            <Text style={styles.TotalLabel2}>Total Tasks of the Day</Text>
          </View>

          <View style={styles.OverDueBox}>
            <Text style={styles.bigLabelBoxText1}>08</Text>
            <Text style={styles.bigLabelBoxText2}>Overdue Tasks</Text>
          </View>
        </View>

        <View style={styles.containerRow}>
          <View style={styles.bigBoxViewOuterLeft}>
            <View style={styles.bigBoxViewInner}>
              <Text style={styles.bigLabelBoxText1}>20/24</Text>
              <Text style={styles.bigLabelBoxText2}>Connects Tasks</Text>
            </View>
          </View>

          <View style={styles.bigBoxViewOuterRight}>
            <View style={styles.bigBoxViewInner}>
              <Text style={styles.bigLabelBoxText1}>20/24</Text>
              <Text style={styles.bigLabelBoxText2}>Connects Tasks</Text>
            </View>
          </View>
        </View>

        <View style={styles.containerRow}>
          <View style={styles.bigBoxViewOuterLeft}>
            <View style={styles.bigBoxViewInner}>
              <Text style={styles.bigLabelBoxText1}>20/24</Text>
              <Text style={styles.bigLabelBoxText2}>Connects Tasks</Text>
            </View>
          </View>

          <View style={styles.bigBoxViewOuterRight}>
            <View style={styles.bigBoxViewInner}>
              <Text style={styles.bigLabelBoxText1}>20/24</Text>
              <Text style={styles.bigLabelBoxText2}>Connects Tasks</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonEndView}>
          <TouchableButton
            containerStyle={styles.endPageBtn}
            label="Day/Shift End"
            borderColor="white"
            containerBackgroundColor="#0f73ee"
            borderWidth={1}
            // disabled={disabled}
            // onPress={() => formSubmit()}
            // loading={imageLoading || loading}
          />
        </View>
      </SafeAreaView>
    )
  } else {
    return null
  }
}
