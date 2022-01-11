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
  setDairyFilterApplied,
  setDiaryFilter,
  setDiaryFilterReason,
} from '../../actions/diary'
import moment from 'moment'
import { connect } from 'react-redux'
import TouchableInput from '../../components/TouchableInput'

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

  clearFilter = () => {
    const { dispatch, route, navigation } = this.props
    const { agentId, isOverdue } = route.params
    dispatch(setDairyFilterApplied(false)).then((res) => {
      dispatch(clearDiaryFilter())
      dispatch(setDiaryFilterReason(null))
      if (isOverdue) {
        dispatch(getDiaryTasks({ selectedDate: _today, agentId, overdue: isOverdue }))
      }
      navigation.goBack()
    })
  }

  onSearchPressed = () => {
    const { navigation, route, dispatch } = this.props
    const { agentId, isOverdue = false } = route.params
    const { filters, feedbackReasonFilter } = this.props
    const newFormData = {
      ...filters,
      reasonTag: feedbackReasonFilter ? feedbackReasonFilter.name : null,
    }
    //console.log(newFormData)
    dispatch(setDiaryFilter(newFormData))
    dispatch(setDairyFilterApplied(true))
    dispatch(getDiaryTasks({ agentId, overdue: isOverdue }))
    navigation.goBack()
  }

  handleForm = (value, name) => {
    const { dispatch } = this.props
    const { filters, feedbackReasonFilter } = this.props
    let newformData = {
      ...filters,
    }
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

  goToDiaryReasons = () => {
    const { navigation, route } = this.props
    navigation.navigate('DiaryReasons', { screenName: 'DiaryFilter' })
  }

  render() {
    const { filters, route, feedbackReasonFilter } = this.props
    const { loading } = this.state
    const { isOverdue } = route.params

    return loading ? (
      <Loader loading={loading} />
    ) : (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {isOverdue ? null : (
            <>
              <Text style={styles.headingText}>Date:</Text>
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
              />
            </>
          )}
          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <Text style={[styles.headingText]}>Reason:</Text>
              <TouchableInput
                onPress={() => this.goToDiaryReasons()}
                showIconOrImage={false}
                value={feedbackReasonFilter ? feedbackReasonFilter.name : ''}
                placeholder={'Select Reason'}
              />
            </View>
          </View>

          {/* <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <Text style={[styles.headingText, { marginBottom: 10 }]}>Reason:</Text>
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
          </View> */}

          <View style={[AppStyles.mainInputWrap]}>
            <View style={[AppStyles.inputWrap]}>
              <Text style={[styles.headingText, { marginBottom: 10 }]}>Lead Type:</Text>
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
              <Text style={[styles.headingText, { marginBottom: 10 }]}>Project Lead ID:</Text>
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
              <Text style={[styles.headingText, { marginBottom: 10 }]}>Buy/Rent Lead ID:</Text>
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
              <Text style={[styles.headingText, { marginBottom: 10 }]}>Wanted Lead ID:</Text>
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
              <Text style={[styles.headingText, { marginBottom: 10 }]}>Client Name:</Text>
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
              <Text style={[styles.headingText, { marginBottom: 10 }]}>Client Contact:</Text>
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
        </ScrollView>
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
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: '#e7ecf0',
  },
  headingText: {
    fontSize: 14,
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.textColor,
  },
})

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    filters: store.diary.filters,
    feedbackReasonFilter: store.diary.feedbackReasonFilter,
  }
}

export default connect(mapStateToProps)(DiaryFilter)
