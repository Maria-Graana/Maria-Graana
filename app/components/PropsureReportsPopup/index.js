/** @format */

import { AntDesign } from '@expo/vector-icons'
import { Button } from 'native-base'
import React from 'react'
import { FlatList, Modal, SafeAreaView, Text, View } from 'react-native'
import { Divider } from 'react-native-paper'
import AppStyles from '../../AppStyles'
import { formatPrice } from '../../PriceFormate'
import MyCheckBox from '../MyCheckBox'
import styles from './styles'

const PropsureReportsPopup = (props) => {
  const {
    isVisible,
    closeModal,
    onPress,
    addRemoveReport,
    selectedReports,
    reports,
    totalReportPrice,
    checkValidation,
  } = props
  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={closeModal}>
      <SafeAreaView style={[AppStyles.mb1, { backgroundColor: '#e7ecf0' }]}>
        <AntDesign
          style={styles.closeStyle}
          onPress={closeModal}
          name="close"
          size={26}
          color={AppStyles.colors.textColor}
        />
        <FlatList
          data={reports}
          style={{ marginTop: 25 }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              <View style={styles.reportRow}>
                <View style={[styles.listView]}>
                  <MyCheckBox
                    status={
                      !item.addItem
                        ? selectedReports.some((report) => item.title === report.title)
                        : true
                    }
                    onPress={() => {
                      if (!item.addItem) addRemoveReport(item)
                    }}
                  />
                  <Text
                    onPress={() => {
                      if (!item.addItem) addRemoveReport(item)
                    }}
                    style={styles.reportName}
                  >
                    {item.title}
                  </Text>
                </View>
                <Text style={styles.reportPrice}>
                  <Text style={styles.pkr}>PKR</Text> {item.fee}
                </Text>
              </View>
              <Divider />
            </View>
          )}
        />

        <View style={[AppStyles.mainInputWrap, styles.buttonExtraStyle]}>
          <View style={styles.totalView}>
            <Text style={[AppStyles.btnText, { color: AppStyles.colors.textColor }]}>
              Total Services Cost
            </Text>
            <Text style={[AppStyles.btnText, { color: AppStyles.colors.primaryColor }]}>
              <Text style={styles.pkr}>PKR </Text>
              {totalReportPrice === 0 ? 0 : parseInt(formatPrice(totalReportPrice))}
            </Text>
          </View>
          <Button style={[AppStyles.formBtn, { marginTop: 10 }]} onPress={onPress}>
            <Text style={AppStyles.btnText}>REQUEST VERIFICATION</Text>
          </Button>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default PropsureReportsPopup
