/** @format */

import React from 'react'
import { View, Text, Modal, SafeAreaView, TouchableOpacity, FlatList, Alert } from 'react-native'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import styles from './styles'
import AppStyles from '../../AppStyles'
import { Button } from 'native-base'
import { formatPrice } from '../../PriceFormate'
import ErrorMessage from '../../components/ErrorMessage'
import Loader from '../loader'
import { ActivityIndicator } from 'react-native-paper'
import CommissionTile from '../CommissionTile'
import helper from '../../helper'

const PropsureDocumentPopup = (props) => {
  const {
    isVisible,
    closeModal,
    onPress,
    pendingPropsures,
    getAttachmentFromStorage,
    uploadReport,
    downloadFile,
    propsureOutstandingPayment,
    selectedProperty,
    editable,
    onPaymentLongPress,
    type,
    additionalRequest,
  } = props
  let totalReportsFree = helper.AddPropsureReportsFee(pendingPropsures, type)
  let singlePayment = helper.propsurePaymentType(selectedProperty, type)
  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={closeModal}>
      <SafeAreaView
        style={[AppStyles.mb1, { justifyContent: 'center', backgroundColor: '#e7ecf0' }]}
      >
        <AntDesign
          style={styles.closeStyle}
          onPress={closeModal}
          name="close"
          size={26}
          color={AppStyles.colors.textColor}
        />
        <FlatList
          data={pendingPropsures}
          style={{ marginTop: 35 }}
          renderItem={({ item }) => (
            <View>
              {item.addedBy === type ? (
                <View style={[styles.viewContainer]}>
                  <View style={styles.tileView}>
                    <Text style={{ color: AppStyles.colors.textColor, marginVertical: 5 }}>{`${
                      item.propsureReport && item.propsureReport.title && item.propsureReport.title
                    }`}</Text>
                    <Text style={styles.reportPrice}>
                      <Text style={styles.pkr}>PKR</Text>{' '}
                      {item.propsureReport && item.propsureReport && item.propsureReport.fee === 0
                        ? 0
                        : parseInt(
                            formatPrice(
                              item.propsureReport &&
                                item.propsureReport.fee &&
                                item.propsureReport.fee
                            )
                          )}
                    </Text>
                  </View>

                  <TouchableOpacity
                    disabled={item.isLoading && item.status === 'verified'}
                    onPress={() => {
                      if (item.status === 'verified') {
                        downloadFile(item)
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[AppStyles.flexDirectionRow, AppStyles.bgcWhite, styles.tileView]}>
                      <View
                        style={[
                          {
                            backgroundColor: '#fff',
                            borderRadius: 4,
                            borderWidth: 0,
                            height: 50,
                            marginHorizontal: 10,
                            flex: 0.8,
                            justifyContent: 'center',
                          },
                        ]}
                      >
                        {item.status === 'verified' ? (
                          <Text
                            style={[
                              {
                                letterSpacing: 1,
                                fontFamily: AppStyles.fonts.semiBoldFont,
                                color: AppStyles.colors.textColor,
                              },
                            ]}
                            numberOfLines={2}
                          >
                            {item.propsureDocs && item.propsureDocs.length > 0
                              ? item.propsureDocs[0].name
                                ? item.propsureDocs[0].name
                                : item.propsureDocs[0].fileName
                              : ``}
                          </Text>
                        ) : (
                          <Text
                            style={[
                              {
                                letterSpacing: 1,
                                fontFamily: AppStyles.fonts.semiBoldFont,
                                color: AppStyles.colors.subTextColor,
                              },
                            ]}
                            numberOfLines={2}
                          >
                            Pending Propsure
                          </Text>
                        )}
                      </View>
                      {item.status === 'pending' ? (
                        <TouchableOpacity
                          disabled={item.isLoading}
                          onPress={() => {}}
                          style={{
                            flex: 0.2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: AppStyles.colors.subTextColor,
                            borderLeftWidth: item.status === 'pending' ? 0 : 0.5,
                          }}
                        >
                          {item.isLoading ? (
                            <ActivityIndicator
                              size={'large'}
                              color={AppStyles.colors.primaryColor}
                            />
                          ) : null}
                        </TouchableOpacity>
                      ) : (
                        <View
                          style={{
                            flex: 0.2,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <AntDesign
                            name="checkcircleo"
                            size={32}
                            color={AppStyles.colors.primaryColor}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                  {item.showMsg ? (
                    <View style={{ paddingVertical: 5 }}>
                      <Text>File Downloaded!</Text>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
        {/* {
                        checkValidation === true && selectedFile === null && <ErrorMessage errorMessage={'Required'} />
                    } */}

        <View style={[AppStyles.mainInputWrap, { backgroundColor: '#fff' }]}>
          <View style={styles.totalView}>
            <Text style={[AppStyles.btnText, { color: AppStyles.colors.textColor }]}>
              Total Amount
            </Text>
            <Text style={[AppStyles.btnText, { color: AppStyles.colors.primaryColor }]}>
              <Text style={styles.pkr}>PKR </Text>
              {totalReportsFree === 0 ? 0 : parseInt(formatPrice(totalReportsFree))}
            </Text>
          </View>
          {totalReportsFree !== 0 && (
            <View style={{ margin: 10 }}>
              {singlePayment ? (
                <CommissionTile
                  data={singlePayment}
                  editTile={editable}
                 onPaymentLongPress={() => onPaymentLongPress(singlePayment)}
                  commissionEdit={false}
                  updatePermission={true}
                  closedLeadEdit={true}
                  title={'Propsure Payment'}
                />
              ) : (
                <Button style={[AppStyles.formBtn, { marginVertical: 10 }]} onPress={onPress}>
                  <Text style={AppStyles.btnText}>ADD PAYMENT</Text>
                </Button>
              )}
            </View>
          )}
          {totalReportsFree <= 0 || !singlePayment ? (
            <View style={{ margin: 10 }}>
              <Button style={[AppStyles.formBtn, { marginTop: 10 }]} onPress={additionalRequest}>
                <Text style={AppStyles.btnText}>REQUEST MORE REPORTS</Text>
              </Button>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default PropsureDocumentPopup
