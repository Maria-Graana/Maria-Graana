/** @format */

import { Alert, FlatList, Image, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import styles from './styles'
import Loader from '../../components/loader'
import AppStyles from '../../AppStyles'
import { setDiaryFilter, setDiaryFilterReason } from '../../actions/diary'
import { NavigationContainer } from '@react-navigation/native'

class DiaryReasons extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      feedbackReasons: [],
      loading: false,
    }
  }

  componentDidMount() {
    this.getFeedbackReasons()
  }

  getFeedbackReasons = () => {
    const { route, screenName = null } = this.props
    let endPoint = ``
    this.setState({ loading: true }, () => {
      endPoint =
        screenName && screenName === 'DiaryFilter'
          ? `/api/feedbacks/fetch`
          : `/api/feedbacks/fetch?section=Internal`
      axios
        .get(endPoint)
        .then((res) => {
          if (res && res.data) {
            let sections = Object.keys(res.data)
            let result = {}
            for (let i = 0; i < sections.length; i++) {
              let sectionArr = res.data[sections[i]]
              for (let j = 0; j < sectionArr.length; j++) {
                let id = sectionArr[j].id
                let tags = sectionArr[j].tags
                if (tags && sectionArr[j].section === 'Actions') {
                  try {
                    tags = JSON.parse(tags[0])
                    let newTags = Object.keys(tags).map((key) => tags[key])
                    tags = newTags
                  } catch (e) {
                    tags = null
                  }
                }
                if (tags) {
                  for (let k = 0; k < tags.length; k++) {
                    if (result[tags[k]]) result[tags[k]] = [...result[tags[k]], id]
                    else result[tags[k]] = [id]
                  }
                }
              }
            }
            let response = Object.keys(result).map((item) => {
              return {
                name: item,
                value: result[item],
              }
            })
            this.setState({
              loading: false,
              feedbackReasons: response,
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    })
  }

  onReasonSelected = (item) => {
    const { navigation, dispatch, screenName = null, onPress = null } = this.props
    dispatch(setDiaryFilterReason(item)).then(() => {
      !screenName && navigation.goBack()
      screenName && onPress()
    })
  }

  render() {
    const { feedbackReasons, loading } = this.state
    const { feedbackReasonFilter, screenName = null } = this.props

    return (
      <View style={[AppStyles.container, { backgroundColor: 'white' }]}>
        {screenName ? <Text style={styles.listTitle}>Reasons</Text> : null}
        {screenName ? <View style={styles.listborder}></View> : null}
        {!loading ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={feedbackReasons}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => this.onReasonSelected(item)}
                style={{
                  backgroundColor:
                    feedbackReasonFilter && item.name === feedbackReasonFilter.name
                      ? AppStyles.colors.backgroundColor
                      : 'white',
                }}
              >
                <View style={styles.itemContainer}>
                  <Text style={styles.item}>{item.name}</Text>
                </View>
                <View style={styles.underLine} />
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => item.name.toString()}
          />
        ) : (
          <Loader loading={loading} />
        )}
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    feedbackReasonFilter: store.diary.feedbackReasonFilter,
  }
}

export default connect(mapStateToProps)(DiaryReasons)
