/** @format */

import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import helper from '../../helper'
import DiaryHelper from '../Diary/diaryHelper'

class TaskDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  componentDidMount() {}

  render() {
    const { route } = this.props
    const { diary } = route.params
    return (
      <View style={AppStyles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.flexRow}>
            <Text style={[styles.headingText, { width: '90%' }]}> Task Type: </Text>
            <View style={{ width: '10%' }}>
              {
                <MaterialCommunityIcons
                  onPress={() => {
                    console.log('edit task')
                  }}
                  name="square-edit-outline"
                  size={26}
                  color={AppStyles.colors.primaryColor}
                />
              }
            </View>
          </View>
          <Text style={styles.labelText}> {`${DiaryHelper.showTaskType(diary.taskType)}`} </Text>
          <Text style={styles.headingText}> Report Duration: </Text>
          <Text style={styles.labelText}> {DiaryHelper.getReportDuration(diary)} </Text>

          <Text style={styles.headingText}> Description: </Text>
          <Text style={styles.labelText}> {diary.notes ? diary.notes : '-'} </Text>
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
})

export default TaskDetails
