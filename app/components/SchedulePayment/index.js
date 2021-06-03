/** @format */

import React from 'react'
import { Image, Modal, SafeAreaView, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import backArrow from '../../../assets/img/backArrow.png'
import helper from '../../helper'
import Loader from '../loader'
import styles from './style'
import moment from 'moment-timezone'

class SchedulePayment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imageUrl: null,
      showWebView: false,
    }
  }

  addNewRecords = () => {
    let { data, downPayment, possessionCharges } = this.props
    if (data && data.length) {
      data.unshift({
        amountDue: downPayment,
        paymentDueDate: moment().format('DD MMM, YYYY'),
        paymentType: 'down Payment',
      })
      data.unshift({
        amountDue: possessionCharges,
        paymentDueDate: moment().format('DD MMM, YYYY'),
        paymentType: 'Possession Charges',
      })
      return data
    } else []
  }

  render() {
    let { active, data, toggleSchedulePayment, lead, loading } = this.props
    let headerName = lead.customer && lead.customer.customerName && lead.customer.customerName
    if (!headerName && headerName === '') headerName = lead.customer && lead.customer.phone
    data = this.addNewRecords()
    return (
      <Modal visible={active} animationType="slide" onRequestClose={toggleSchedulePayment}>
        <SafeAreaView style={styles.flexView}>
          <View style={styles.flexView}>
            <View style={styles.topHeader}>
              <TouchableOpacity onPress={toggleSchedulePayment}>
                <Image source={backArrow} style={[styles.backImg]} />
              </TouchableOpacity>
              <View style={styles.header}>
                <Text numberOfLines={1} style={styles.headerText}>
                  {headerName}
                </Text>
                <Text numberOfLines={1} style={[styles.detailText]}>
                  {lead.project
                    ? helper.capitalize(lead.project.name)
                    : helper.capitalize(lead.projectName)}
                  {lead.projectType ? ' - ' + helper.capitalize(lead.projectType) : ''}
                </Text>
              </View>
            </View>
            <View style={styles.barView}>
              <Text style={styles.barText}>PAYMENT PLAN</Text>
            </View>
            {data && data.length ? (
              <View style={styles.mainView}>
                <View style={styles.tableView}>
                  <View style={styles.tableMainBar}>
                    <Text style={styles.mainBarText}>Payment Type</Text>
                    <Text style={styles.mainBarAmountText}>Amount</Text>
                    <Text style={[styles.mainBarAmountText, {}]}>Due Date</Text>
                  </View>
                  <FlatList
                    data={data}
                    renderItem={(item, index) => (
                      <View style={styles.tableTile}>
                        <View style={{ justifyContent: 'center', flex: 1 }}>
                          <Text numberOfLines={1} style={styles.paymentText}>
                            {item.item.paymentType === 'installment'
                              ? `Installment ${item.item.id}`
                              : `${item.item.paymentType}`}
                          </Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                          <Text numberOfLines={1} style={styles.amountText}>
                            {Number(item.item.amountDue)}
                          </Text>
                        </View>
                        <View style={{ justifyContent: 'center', flex: 1 }}>
                          <Text numberOfLines={1} style={styles.tileText}>
                            {moment(item.item.paymentDueDate).format('DD MMM, YYYY')}
                          </Text>
                        </View>
                      </View>
                    )}
                    keyExtractor={(item, index) => {}}
                  />
                </View>
              </View>
            ) : (
              <Loader loading={loading} />
            )}
          </View>
        </SafeAreaView>
        <SafeAreaView style={styles.safeView} />
      </Modal>
    )
  }
}

mapStateToProps = (store) => {
  return {
    lead: store.lead.lead,
  }
}

export default connect(mapStateToProps)(SchedulePayment)
