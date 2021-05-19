import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Platform
} from 'react-native';
import moment from 'moment'
import AppStyles from '../../AppStyles'
import { AntDesign } from '@expo/vector-icons';
import {Picker} from '@react-native-picker/picker';


class YearPicker extends Component {


  constructor(props) {
    super(props);
    let { startYear, endYear, selectedYear, visible } = props;
    let years = this.getYears(startYear, endYear);
    selectedYear = selectedYear || years[0];
    this.state = {
      years,
      selectedYear,
      visible: visible
    }
  }

  show = async ({ startYear, endYear, selectedYear }) => {
    let years = this.getYears(startYear, endYear);
    selectedYear = selectedYear || years[0];
    let promise = new Promise((resolve) => {
      this.confirm = (year) => {
        resolve({
          year,
        });
      }
      this.setState({
        visible: true,
        years,
        startYear: startYear,
        endYear: endYear,
        selectedYear: selectedYear,
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

  renderPickerItems = (data) => {
    let items = data.map((value, index) => {
      return (<Picker.Item key={'r-' + index} label={'' + value} value={value} />)
    })
    return items;
  }

  onCancelPress = () => {
    this.dismiss();
  }

  onConfirmPress = () => {
    const confirm = this.confirm;
    const { selectedYear } = this.state;
    confirm && confirm(selectedYear);
    this.dismiss();
  }

  render() {
    const { years, selectedYear, visible } = this.state;
    if (!visible) return null;
    return (
      <Modal
        visible={visible}
        animationType="slide"
      >
        <SafeAreaView style={[AppStyles.mb1, { justifyContent: 'center', backgroundColor: '#e7ecf0' }]}>
          <AntDesign style={styles.closeStyle} onPress={this.onCancelPress} name="close" size={26} color={AppStyles.colors.textColor} />
          <View style={[styles.viewContainer]}>
            <View style={styles.innerContainer}>
              <Picker
                style={[styles.picker]}
                selectedValue={selectedYear}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) => this.setState({ selectedYear: itemValue }, () => {
                })}
              >
                {this.renderPickerItems(years)}
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
    backgroundColor: 'white'
  },
  closeStyle: {
    position: 'absolute',
    right: 15,
    top: Platform.OS == 'android' ? 10 : 40,
    paddingVertical: 5
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
    // flexDirection: 'row',
    // marginHorizontal: 15,
  },
  picker: {
    width: '50%'
  }
})

export default YearPicker;


