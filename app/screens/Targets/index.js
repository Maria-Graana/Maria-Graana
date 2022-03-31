/** @format */

import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, Picker } from 'react-native'
import AppStyles from '../../AppStyles'
import styles from './style.js'
import { Button } from 'native-base'
import { connect } from 'react-redux'
import MonthPicker from '../../components/MonthPicker'
import Loader from '../../components/loader'
import axios from 'axios'
import moment from 'moment'
import { formatPrice } from '../../components/PriceFormate'
import Ability from '../../hoc/Ability'

class Targets extends Component {
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  constructor(props) {
    const date = new Date()
    super(props)
    this.state = {
      checkValidation: false,
      loading: false,
      data: {},
      startYear: 2000,
      endYear: 2050,
      selectedYear: date.getFullYear(),
      selectedMonth: date.getMonth() + 1,
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    this._unsubscribe = navigation.addListener('focus', () => {
      this.getMyTarget()
    })
  }

  getMyTarget = () => {
    const { selectedMonth, selectedYear } = this.state
    const { user } = this.props
    let date = `${selectedYear}-${moment()
      .month(selectedMonth - 1)
      .format('MM')}`
    this.setState({ loading: true })
    axios
      .get(`/api/user/getAgentTatget?userId=${user.id}&fromDate=${date}`) // API changed
      .then((response) => {
        if (response.status === 200) {
          this.setState({ data: response.data, loading: false })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  navigateFunction = (name) => {
    const { navigation } = this.props
    navigation.navigate(name)
  }

  showPicker = () => {
    const { startYear, endYear, selectedYear, selectedMonth } = this.state
    this.picker
      .show({ startYear, endYear, selectedYear, selectedMonth })
      .then(({ year, month }) => {
        this.setState(
          {
            selectedYear: year,
            selectedMonth: month,
          },
          () => {
            this.getMyTarget()
          }
        )
      })
  }

  render() {
    const { loading, data, selectedYear, selectedMonth } = this.state
    const { user, route } = this.props
    return !loading ? (
      <View style={[AppStyles.container]}>
        <MonthPicker ref={(picker) => (this.picker = picker)} />
        <ScrollView>
          <View style={[styles.targetMain]}>
            <View style={[styles.formMain]}>
              {/* **************************************** */}
              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <TouchableOpacity onPress={() => this.showPicker()} style={styles.input}>
                    <Image
                      style={{ width: 26, height: 26 }}
                      source={require('../../../assets/img/calendar.png')}
                    />
                    <Text style={styles.inputText}>
                      {this.months[selectedMonth - 1]} {selectedYear}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={[styles.titleMain]}>
              <Text style={[styles.labelText]}>Project Revenue</Text>
              <Text style={[styles.priceText]}>
                {data && data.targetAmount ? formatPrice(data.targetAmount) : '0'}
              </Text>
            </View>
            <View style={[styles.titleMain]}>
              <Text style={[styles.labelText]}>Real Estate Revenue</Text>
              <Text style={[styles.priceText]}>
                {data && data.realEstateAmount ? formatPrice(data.realEstateAmount) : '0'}
              </Text>
            </View>
            <View style={[styles.titleMain]}>
              <Text style={[styles.labelText]}>Meetings</Text>
              <Text style={[styles.priceText]}>
                {data && data.meeting ? formatPrice(data.meeting) : '0'}
              </Text>
            </View>
            <View style={[styles.titleMain]}>
              <Text style={[styles.labelText]}>CIFs</Text>
              <Text style={[styles.priceText]}>
                {data && data.cif ? formatPrice(data.cif) : '0'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    ) : (
      <Loader loading={loading} />
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(Targets)
