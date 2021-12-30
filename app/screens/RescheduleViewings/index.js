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

class RescheduleViewings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      propertyShortlistData: [],
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    this._unsubscribe = navigation.addListener('focus', () => {
      const { diary, user } = this.props
      const { selectedLead } = diary
      if (selectedLead) {
        this.setState({ loading: true }, async () => {
          let data = await getPropertyViewings(selectedLead.id, user.id)
          this.setState({ propertyShortlistData: data, loading: false })
        })
      }
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(setConnectFeedback({}))
  }

  checkImages = (data, organizantion) => {
    console.log(organizantion)
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

  goToTimeSlots = (diary) => {
    const { navigation, user, connectFeedback, dispatch } = this.props
    navigation.navigate('TimeSlotManagement', {
      data: {
        userId: user.id,
        taskCategory: 'leadTask',
        reasonTag: connectFeedback.tag,
        reasonId: connectFeedback.feedbackId,
        id: diary.id,
        makeHistory: true,
        taskType: 'viewing',
        armsLeadId: diary && diary.armsLeadId ? diary.armsLeadId : null,
        leadId: diary && diary.armsProjectLeadId ? diary.armsProjectLeadId : null,
      },
      taskType: 'viewing',
      isFromConnectFlow: true,
    })
    dispatch(setConnectFeedback({}))
    dispatch(clearDiaryFeedbacks())
  }

  render() {
    const { propertyShortlistData, loading } = this.state
    const { user } = this.props
    return loading ? (
      <Loader loading={loading} />
    ) : (
      <View style={styles.container}>
        <FlatList
          data={_.clone(propertyShortlistData)}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 3 }}>
              <RescheduleViewingTile data={item} user={user} goToTimeSlots={this.goToTimeSlots} />
            </View>
          )}
          keyExtractor={(item, index) => item.id.toString()}
        />
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
  }
}

export default connect(mapStateToProps)(RescheduleViewings)
