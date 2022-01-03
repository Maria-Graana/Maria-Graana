/** @format */

import React, { Component } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import {
  clearDiaryFeedbacks,
  getPropertyViewings,
  saveOrUpdateDiaryTask,
  setConnectFeedback,
} from '../../actions/diary'
import _ from 'underscore'
import MatchTile from '../../components/MatchTile'
import Loader from '../../components/loader'
import RescheduleViewingTile from '../../components/RescheduleViewingTile'
import AppStyles from '../../AppStyles'
import TouchableButton from '../../components/TouchableButton'

class RescheduleViewings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      propertyShortlistData: [],
    }
  }

  componentDidMount() {
    const { navigation, route } = this.props
    const { mode = 'rescheduleViewing' } = route?.params
    this._unsubscribe = navigation.addListener('focus', () => {
      navigation.setOptions({
        title: mode === 'rescheduleViewing' ? 'Reschedule Viewings' : 'Cancel Viewing',
      })
      const { diary, user } = this.props
      const { selectedLead, selectedDiary } = diary
      if (selectedLead) {
        this.setState({ loading: true }, async () => {
          let data = await getPropertyViewings(selectedLead.id, user.id)
          this.setState({ propertyShortlistData: data, loading: false }, () => {
            if (selectedDiary && selectedDiary.propertyId) {
              this.addProperty(true, selectedDiary.propertyId)
            }
          })
        })
      }
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(setConnectFeedback({}))
  }

  checkImages = (data, organizantion) => {
    let imagesList = []
    if (organizantion) {
      if (organizantion === 'arms') {
        if (data.images.length > 0) {
          imagesList = data.images.map((item) => {
            return item.url
          })
        }
      } else {
        if (data.property_images.length > 0) {
          imagesList = data.property_images.map((item) => {
            return item.url
          })
        }
      }
    } else {
      if (data.arms_id) {
        if (data.images.length > 0) {
          imagesList = data.images.map((item) => {
            return item.url
          })
        }
      } else {
        if (data.property_images.length > 0) {
          imagesList = data.property_images.map((item) => {
            return item.url
          })
        }
      }
    }
    return imagesList
  }

  goToTimeSlots = () => {
    const { navigation, user, connectFeedback, dispatch, route } = this.props
    const { mode = 'rescheduleViewing' } = route?.params
    if (mode === 'cancelViewing') {
      saveOrUpdateDiaryTask({
        ...connectFeedback,
        userId: user.id,
        taskCategory: 'leadTask',
        reasonTag: connectFeedback.tag,
        reasonId: connectFeedback.feedbackId,
        id: connectFeedback.id,
        makeHistory: false,
        status: 'cancelled',
        taskType: 'viewing',
        otherTasksToUpdate: [...connectFeedback.otherTasksToUpdate],
      }).then((res) => {
        dispatch(
          setConnectFeedback({
            ...connectFeedback,
            status: 'pending',
            taskType: 'follow_up',
            otherTasksToUpdate: [],
            id: null,
          })
        ).then((res) => {
          navigation.replace('TimeSlotManagement', {
            data: { ...this.props.connectFeedback },
            taskType: 'follow_up',
            isFromConnectFlow: true,
          })
        })
      })
    } else {
      navigation.navigate('TimeSlotManagement', {
        data: {
          userId: user.id,
          taskCategory: 'leadTask',
          reasonTag: connectFeedback.tag,
          reasonId: connectFeedback.feedbackId,
          id: connectFeedback.id,
          makeHistory: true,
          status: 'pending',
          taskType: 'viewing',
          // otherTasksToUpdate: [...connectFeedback.otherTasksToUpdate],
        },
        taskType: 'viewing',
        isFromConnectFlow: true,
      })
    }

    // dispatch(setConnectFeedback({}))
    dispatch(clearDiaryFeedbacks())
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
    const { propertyShortlistData, loading } = this.state
    const { user, contacts, navigation, route, diary, connectFeedback } = this.props
    const { selectedDiary } = diary
    const { mode = 'rescheduleViewing' } = route?.params
    return loading ? (
      <Loader loading={loading} />
    ) : (
      <View style={styles.container}>
        <FlatList
          data={_.clone(propertyShortlistData)}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 3 }}>
              <RescheduleViewingTile
                data={item}
                user={user}
                goToTimeSlots={this.goToTimeSlots}
                toggleCheckBox={this.addProperty}
                showCheckboxes={mode === 'cancelViewing' ? true : false}
                connectFeedback={connectFeedback}
                selectedDiary={selectedDiary}
                mode={mode}
                contacts={contacts}
              />
            </View>
          )}
          keyExtractor={(item, index) => item.id.toString()}
        />
        <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            containerStyle={[AppStyles.formBtn]}
            label={mode === 'cancelViewing' ? 'CANCEL VIEWING' : 'DONE'}
            onPress={() => (mode === 'cancelViewing' ? this.goToTimeSlots() : navigation.goBack())}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    diary: store.diary.diary,
    connectFeedback: store.diary.connectFeedback,
    contacts: store.contacts.contacts,
  }
}

export default connect(mapStateToProps)(RescheduleViewings)
