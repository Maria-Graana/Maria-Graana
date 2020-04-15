import React, { Component } from 'react';
import {
  View,
  Picker,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import AppStyles from '../../AppStyles';
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment'


class MonthPicker extends Component {


  constructor(props) {
    super(props);
    let { startYear, endYear, selectedYear, selectedMonth, visible } = props;
    let years = this.getYears(startYear, endYear);
    let months = this.getMonths();
    selectedYear = selectedYear || years[0];
    selectedMonth = selectedMonth || ((new Date()).getMonth() + 1);
    this.state = {
      years,
      months,
      selectedYear,
      selectedMonth,
      visible: visible
    }
  }

  show = async ({ startYear, endYear, selectedYear, selectedMonth }) => {
    let years = this.getYears(startYear, endYear);
    let months = this.getMonths();
    selectedYear = selectedYear || years[0];
    selectedMonth = selectedMonth || ((new Date()).getMonth() + 1);
    let promise = new Promise((resolve) => {
      this.confirm = (year, month) => {
        resolve({
          year,
          month
        });
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
    return promise;
  }

  dismiss = () => {
    this.setState({
      visible: false
    })
  }

  getYears = (startYear, endYear) => {
    startYear = startYear || (new Date()).getFullYear();
    endYear = endYear || (new Date()).getFullYear();
    let years = []
    for (let i = startYear; i <= endYear; i++) {
      years.push(i)
    }
    return years;
  }

  getMonths = () => {
    let months = []
    for (let i = 1; i <= 12; i++) {
      months.push({ value: i, name: moment().month(i - 1).format("MMM") });
    }
    return months;
  }

  renderPickerItems = (data) => {
    let items = data.map((value, index) => {
      return (<Picker.Item key={'r-' + index} label={'' + value} value={value} />)
    })
    return items;
  }

  renderMonthPickerItems = (data) => {
    let items = data.map((item, index) => {
      return (<Picker.Item key={'r-' + index} label={'' + item.name} value={item.value} />)
    })
    return items;
  }

  onCancelPress = () => {
    this.dismiss();
  }

  onConfirmPress = () => {
    const confirm = this.confirm;
    const { selectedYear, selectedMonth } = this.state;
    confirm && confirm(selectedYear, selectedMonth);
    this.dismiss();
  }

  render() {
    const { years, months, selectedYear, selectedMonth, visible } = this.state;
    if (!visible) return null;
    return (
      <Modal
        visible={visible}
        animationType="slide"
      // onRequestClose={closeModal}
      >
        <SafeAreaView style={[AppStyles.mb1, { justifyContent: 'center', backgroundColor: '#e7ecf0' }]}>
          <AntDesign style={styles.closeStyle} onPress={this.onCancelPress} name="close" size={26} color={AppStyles.colors.textColor} />
          <View style={[styles.viewContainer]}>
            <TouchableOpacity
              style={styles.modal}
              onPress={this.onCancelPress}
            >
              <View
                style={styles.outerContainer}
              >
                <View style={styles.toolBar}>
                  <TouchableOpacity style={styles.toolBarButton} onPress={this.onCancelPress}>
                    <Text style={styles.toolBarButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity style={styles.toolBarButton} onPress={this.onConfirmPress}>
                    <Text style={styles.toolBarButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.innerContainer}>
                  <Picker
                    style={styles.picker}
                    selectedValue={selectedYear}
                    onValueChange={(itemValue, itemIndex) => this.setState({ selectedYear: itemValue }, () => {
                    })}
                  >
                    {this.renderPickerItems(years)}
                  </Picker>
                  <Picker
                    style={styles.picker}
                    selectedValue={selectedMonth}
                    onValueChange={(itemValue, itemIndex) => this.setState({ selectedMonth: itemValue }, () => {
                    })}
                  >
                    {this.renderMonthPickerItems(months)}
                  </Picker>
                </View>
              </View>
            </TouchableOpacity>



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
  },
  closeStyle: {
    position: 'absolute',
    right: 15,
    top: Platform.OS == 'android' ? 10 : 40,
    paddingVertical: 5
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  outerContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  toolBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flex: 1,
    flexDirection: 'row',
  },
  picker: {
    flex: 1,
  }
})

export default MonthPicker;


