/** @format */

import React from 'react'
import {
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
  Image,
} from 'react-native'
import { Row, Table } from 'react-native-table-component'
import { connect } from 'react-redux'
import BackButton from '../../components/BackButton'
import helper from '../../helper'
import Loader from '../loader'
import styles from './style'

class UnitsTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  setTableRowWidth = () => {
    const { tableHeaderTitle } = this.props
    let array =
      tableHeaderTitle &&
      tableHeaderTitle.length &&
      tableHeaderTitle.map((item) => {
        return 120
      })
    return array
  }

  render() {
    let {
      active,
      data,
      toggleSchedulePayment,
      lead,
      tableHeaderTitle,
      handleFirstForm,
      formData,
      tableDataLoading,
    } = this.props
    let headerName = lead.customer && lead.customer.customerName && lead.customer.customerName
    if (!headerName && headerName === '') headerName = lead.customer && lead.customer.phone
    let widthArr = this.setTableRowWidth()
    return (
      <Modal visible={active} animationType="slide" onRequestClose={toggleSchedulePayment}>
        <SafeAreaView style={styles.flexView}>
          <View style={styles.flexView}>
            <View style={styles.topHeader}>
              <BackButton onClick={toggleSchedulePayment} />
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
              <Text style={styles.barText}>
                {formData.projectName} {'>>'} {formData.floorName}
              </Text>
            </View>
            {tableDataLoading ? (
              <Loader loading={tableDataLoading} />
            ) : data && data.length ? (
              <View style={styles.container}>
                <ScrollView horizontal={true}>
                  <View>
                    <Table borderStyle={styles.tableBorder}>
                      <Row
                        data={tableHeaderTitle}
                        widthArr={widthArr}
                        style={styles.headerTable}
                        textStyle={styles.headerTextStyle}
                      />
                    </Table>
                    <ScrollView style={styles.dataWrapper}>
                      <Table borderStyle={styles.tableBorder}>
                        {data.map((rowData, index) => (
                          <TouchableHighlight
                            onPress={() => {
                              handleFirstForm(rowData, 'unit')
                            }}
                          >
                            <Row
                              key={index}
                              data={rowData}
                              widthArr={widthArr}
                              style={[styles.row]}
                              textStyle={styles.text}
                            />
                          </TouchableHighlight>
                        ))}
                      </Table>
                    </ScrollView>
                  </View>
                </ScrollView>
              </View>
            ) : (
              <Image
                source={require('../../../assets/img/no-result-found.png')}
                style={styles.imageStyle}
              />
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

export default connect(mapStateToProps)(UnitsTable)
