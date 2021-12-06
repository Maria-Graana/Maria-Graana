/** @format */

import React from 'react'
import { Text, View, StyleSheet, TextInput, ScrollView, Alert } from 'react-native'
import AppStyles from '../../AppStyles'
import DateTimePicker from '../../components/DatePicker'
import PickerComponent from '../../components/Picker'
import TouchableButton from '../../components/TouchableButton'
import helper from '../../helper.js'
import axios from 'axios'
import Loader from '../../components/loader'
import _ from 'underscore'
import StaticData from '../../StaticData'
import {
  clearDiaryFilter,
  getDiaryTasks,
  setDiaryFilter,
  setDiaryIsFilterApplied,
  setDiarySearch,
  setFiltersSearch,
} from '../../actions/diary'
import moment from 'moment'
import { connect } from 'react-redux'

const _format = 'YYYY-MM-DD'
const _today = moment(new Date()).format(_format)
class DiaryFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      feedbackReasons: [],
    }
  }

  componentDidMount() {
    this.getFeedbackReasons()
  }

  clearFilter = () => {
    const { dispatch, route, navigation } = this.props
    const { agentId, isOverdue } = route.params
    dispatch(clearDiaryFilter())
    dispatch(getDiaryTasks(_today, agentId, isOverdue))
    navigation.goBack()
  }

  getFeedbackReasons = () => {
    this.setState({ loading: true }, () => {
      let endPoint = `/api/feedbacks/fetch`
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

            this.setState({ loading: false, feedbackReasons: response })
          }
        })
        .catch((error) => {})
    })
  }

  onSearchPressed = () => {
    const { navigation, route, dispatch } = this.props
    const { agentId, isOverdue = false, screenName } = route.params
    dispatch(setDiaryIsFilterApplied(true))
    dispatch(getDiaryTasks(null, agentId, isOverdue))
    navigation.goBack()
  }

  handleForm = (value, name) => {
    const { dispatch } = this.props
    const { filters } = this.props
    let newformData = { ...filters }
    if (
      name === 'wantedId' ||
      name === 'projectId' ||
      name === 'buyrentId' ||
      name === 'customerId'
    ) {
      if (helper.isANumber(value)) {
        newformData[name] = value
      } else {
        alert('Please enter correct format!')
      }
    } else {
      newformData[name] = value
    }
    dispatch(setDiaryFilter(newformData))
  }

  render() {
    const { filters, route } = this.props
    const { loading, feedbackReasons } = this.state
    const { isOverdue } = route.params
    const { feedbacksId } = filters

    return loading ? (
      <Loader loading={loading} />
    ) : (
      <ScrollView style={styles.container}>
        {isOverdue ? null : (
          <DateTimePicker
            placeholderLabel={'Select Date'}
            name={'date'}
            mode={'date'}
            // showError={checkValidation === true && formData.date === ''}
            errorMessage={'Required'}
            iconSource={require('../../../assets/img/calendar.png')}
            date={new Date()}
            selectedValue={filters.date ? helper.formatDate(filters.date) : ''}
            handleForm={(value, name) => this.handleForm(helper.formatDate(value), name)}
            // disabled={currentMeeting && currentMeeting.status === 'completed'}
          />
        )}

        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent
              onValueChange={this.handleForm}
              selectedItem={feedbacksId ? feedbacksId : ''}
              data={feedbackReasons}
              name={'feedbacksId'}
              formatObject={true}
              placeholder="Select Reason"
              customIconStyle={{ marginRight: -6 }}
            />
          </View>
        </View>

        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <PickerComponent
              onValueChange={this.handleForm}
              selectedItem={filters.leadType}
              data={StaticData.leadTypes}
              name={'leadType'}
              placeholder="Lead Type"
              customIconStyle={{ marginRight: -6 }}
            />
          </View>
        </View>

        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              placeholderTextColor={'#a8a8aa'}
              style={[
                AppStyles.formControl,
                Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
                AppStyles.formFontSettings,
              ]}
              placeholder={'Project Lead ID'}
              keyboardType={'numeric'}
              value={filters.projectId}
              onChangeText={(text) => this.handleForm(text, 'projectId')}
            />
          </View>
        </View>

        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              placeholderTextColor={'#a8a8aa'}
              style={[
                AppStyles.formControl,
                Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
                AppStyles.formFontSettings,
              ]}
              placeholder={'Buy/Rent Lead ID'}
              keyboardType={'numeric'}
              value={filters.buyrentId}
              onChangeText={(text) => this.handleForm(text, 'buyrentId')}
            />
          </View>
        </View>

        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              placeholderTextColor={'#a8a8aa'}
              style={[
                AppStyles.formControl,
                Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
                AppStyles.formFontSettings,
              ]}
              placeholder={'Wanted Lead ID'}
              value={filters.wantedId}
              onChangeText={(text) => this.handleForm(text, 'wantedId')}
            />
          </View>
        </View>

        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              placeholderTextColor={'#a8a8aa'}
              style={[
                AppStyles.formControl,
                Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
                AppStyles.formFontSettings,
              ]}
              placeholder={'Client Name'}
              value={filters.customerName}
              // editable={formData.status === 'pending'}
              onChangeText={(text) => this.handleForm(text, 'customerName')}
            />
          </View>
        </View>

        <View style={[AppStyles.mainInputWrap]}>
          <View style={[AppStyles.inputWrap]}>
            <TextInput
              placeholderTextColor={'#a8a8aa'}
              style={[
                AppStyles.formControl,
                Platform.OS === 'ios' ? AppStyles.inputPadLeft : { paddingLeft: 10 },
                AppStyles.formFontSettings,
              ]}
              placeholder={'Client Contact'}
              value={filters.customerPhoneNumber}
              // editable={formData.status === 'pending'}
              onChangeText={(text) => this.handleForm(text, 'customerPhoneNumber')}
            />
          </View>
        </View>
        <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
            label={'SEARCH'}
            onPress={this.onSearchPressed}
            // loading={loading}
            // disabled={currentMeeting && currentMeeting.status === 'completed'}
          />
        </View>

        <View style={[AppStyles.mainInputWrap]}>
          <TouchableButton
            containerStyle={[AppStyles.formBtn, styles.addInvenBtn]}
            label={'CLEAR'}
            onPress={this.clearFilter}
            // loading={loading}
            // disabled={currentMeeting && currentMeeting.status === 'completed'}
          />
        </View>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: '#e7ecf0',
  },
})

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    filters: store.diary.filters,
  }
}

export default connect(mapStateToProps)(DiaryFilter)
