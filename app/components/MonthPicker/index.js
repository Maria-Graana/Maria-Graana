/** @format */

import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Platform,
} from 'react-native'
import moment from 'moment'
import AppStyles from '../../AppStyles'
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import { setCMPayment } from '../../actions/addCMPayment'

class MonthPicker extends Component {
  constructor(props) {
    super(props)
    let { startYear, endYear, selectedYear, selectedMonth, visible } = props
    let years = this.getYears(startYear, endYear)
    let months = this.getMonths()
    selectedYear = selectedYear || years[0]
    selectedMonth = selectedMonth || new Date().getMonth() + 1
    this.state = {
      years,
      months,
      selectedYear,
      selectedMonth,
      visible: visible,
    }
  }

  show = async ({ startYear, endYear, selectedYear, selectedMonth }) => {
    let years = this.getYears(startYear, endYear)
    let months = this.getMonths()
    selectedYear = selectedYear || years[0]
    selectedMonth = selectedMonth || new Date().getMonth() + 1
    let promise = new Promise((resolve) => {
      this.confirm = (year, month) => {
        resolve({
          year,
          month,
        })
      }
      this.setState({
        visible: true,
        years,
        months,
        startYear: startYear,
        endYear: endYear,
        selectedYear: selectedYear,
        selectedMonth: selectedMonth,
      })
    })
    return promise
  }

  dismiss = () => {
    const { CMPayment = null, dispatch } = this.props
    //On Cancel Picker Should open the modal Add payments again
    if (CMPayment) {
      const newSecondFormData = {
        ...CMPayment,
        visible: true,
      }
      dispatch(setCMPayment(newSecondFormData))
    }
    this.setState({
      visible: false,
    })
  }

  getYears = (startYear, endYear) => {
    startYear = startYear || new Date().getFullYear()
    endYear = endYear || new Date().getFullYear()
    let years = []
    for (let i = startYear; i <= endYear; i++) {
      years.push(i)
    }
    return years
  }

  getMonths = () => {
    let months = []
    for (let i = 1; i <= 12; i++) {
      months.push({
        value: i,
        name: moment()
          .month(i - 1)
          .format('MMM'),
      })
    }
    return months
  }

  renderPickerItems = (data) => {
    let items = data.map((value, index) => {
      return <Picker.Item key={'r-' + index} label={'' + value} value={value} />
    })
    return items
  }

  renderMonthPickerItems = (data) => {
    let items = data.map((item, index) => {
      return <Picker.Item key={'r-' + index} label={'' + item.name} value={item.value} />
    })
    return items
  }

  onCancelPress = () => {
    this.dismiss()
  }

  onConfirmPress = () => {
    const confirm = this.confirm
    const { selectedYear, selectedMonth } = this.state
    confirm && confirm(selectedYear, selectedMonth)
    this.dismiss()
  }

  render() {
    const { years, months, selectedYear, selectedMonth, visible } = this.state
    if (!visible) return null
    return (
      <Modal visible={visible} animationType="slide">
        <SafeAreaView
          style={[AppStyles.mb1, { justifyContent: 'center', backgroundColor: '#e7ecf0' }]}
        >
          <AntDesign
            style={styles.closeStyle}
            onPress={this.onCancelPress}
            name="close"
            size={26}
            color={AppStyles.colors.textColor}
          />
          <View style={[styles.viewContainer]}>
            <View style={styles.innerContainer}>
              <Picker
                style={[styles.picker]}
                selectedValue={selectedYear}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ selectedYear: itemValue }, () => {})
                }
              >
                {this.renderPickerItems(years)}
              </Picker>
              <Picker
                style={styles.picker}
                selectedValue={selectedMonth}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ selectedMonth: itemValue }, () => {})
                }
              >
                {this.renderMonthPickerItems(months)}
              </Picker>
            </View>
            <View style={styles.toolBar}>
              <TouchableOpacity style={styles.toolBarButton} onPress={this.onCancelPress}>
                <Text style={styles.toolBarButtonText}>CANCEL</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <TouchableOpacity style={styles.toolBarButton} onPress={this.onConfirmPress}>
                <Text style={styles.toolBarButtonText}>CONFIRM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    marginLeft: 25,
    marginRight: 25,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  closeStyle: {
    position: 'absolute',
    right: 15,
    top: Platform.OS == 'android' ? 10 : 40,
    paddingVertical: 5,
  },
  toolBar: {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: 1,
    borderColor: '#EBECED',
  },
  toolBarButton: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  toolBarButtonText: {
    fontSize: 15,
    color: '#2d4664',
  },
  innerContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
  },
  picker: {
    width: '50%',
  },
})

export default MonthPicker
