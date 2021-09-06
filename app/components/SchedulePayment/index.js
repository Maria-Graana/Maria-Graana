/** @format */

import moment from 'moment-timezone'
import React from 'react'
import { FlatList, Modal, SafeAreaView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import BackButton from '../../components/BackButton'
import helper from '../../helper'
import Loader from '../loader'
import styles from './style'

class SchedulePayment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imageUrl: null,
      showWebView: false,
    }
  }

  addNewRecords = () => {
    let { data, downPayment, possessionCharges, downPaymenTime } = this.props
    if (data && data.length) {
      data.unshift({
        amountDue: downPayment,
        paymentDueDate: downPaymenTime,
        paymentType: 'down Payment',
      })
      data.unshift({
        amountDue: possessionCharges,
        paymentDueDate: downPaymenTime,
        paymentType: 'Possession Charges',
      })
      return data
    } else []
  }

  render() {
    let { active, data, toggleSchedulePayment, lead, loading } = this.props
    let headerName = lead.customer && lead.customer.customerName && lead.customer.customerName
    if (!headerName && headerName === '') headerName = lead.customer && lead.customer.phone
    return (
      <Modal visible={active} animationType="slide" onRequestClose={toggleSchedulePayment}>
        <SafeAreaView style={styles.flexView}>
          <View style={styles.flexView}>
            <View style={styles.topHeader}>
              <View style={styles.padLeft}>
                <BackButton onClick={toggleSchedulePayment} />
              </View>
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
                    renderItem={({ item, index, separators }) => (
                      <View style={styles.tableTile}>
                        <View style={{ justifyContent: 'center', flex: 1 }}>
                          <Text numberOfLines={1} style={styles.paymentText}>
                            {item.paymentType === 'fullPayment' ? `Full Payment` : null}
                            {item.paymentType === 'installment' ? `Installment ${index}` : null}
                            {item.paymentType === 'possessionCharges'
                              ? `Possession Charges ${index}`
                              : null}
                            {item.paymentType === 'downPayment' ? `Down Payment` : null}
                          </Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                          <Text numberOfLines={1} style={styles.amountText}>
                            {Number(item.amountDue)}
                          </Text>
                        </View>
                        <View style={{ justifyContent: 'center', flex: 1 }}>
                          <Text numberOfLines={1} style={styles.tileText}>
                            {moment(item.paymentDueDate).format('DD MMM, YYYY')}
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
