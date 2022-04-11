/** @format */

import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  SafeAreaView,
} from 'react-native'
import { Switch } from 'native-base'
// import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import times from '../../../assets/img/times.png'
import SimpleInputText from '../SimpleInputField'
import PickerComponent from '../Picker/index'
import StaticData from '../../StaticData'
import ErrorMessage from '../ErrorMessage'
import TouchableButton from '../TouchableButton'
import TouchableInput from '../TouchableInput'
import AppStyles from '../../AppStyles'
import axios from 'axios'
import moment from 'moment'
import OfficeLocationSelector from '../OfficeLocationSelector'
import AddEditInstrument from '../AddEditInstrument'
import MonthPicker from '../MonthPicker'

const CMPaymentModal = ({
  onModalCloseClick,
  handleCommissionChange,
  modalValidation,
  CMPayment,
  goToPayAttachments,
  addPaymentLoading,
  lead,
  submitCommissionPayment,
  paymentNotZero,
  checkFirstFormToken = false,
  assignToAccounts,
  officeLocations,
  handleOfficeLocationChange,
  assignToAccountsLoading,
  handleInstrumentInfoChange,
  AllAssignedLeads,
  SelectedLeadDetails,
  months,
  selectedMonth,
  selectedYear,
  showPicker,
}) => {
  const handleEmptyValue = (value) => {
    return value != null && value != '' ? value : ''
  }
  const [remarks, setRemarks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isCollapsed, setCollapsed] = useState(false)

  const fetchRemarks = () => {
    if (isCollapsed === false) {
      const url = `/api/leads/paymentremarks?id=${CMPayment.id}`
      axios
        .get(url)
        .then((response) => {
          setRemarks(response.data.remarks)
          setLoading(false)
          setCollapsed(true)
        })
        .catch((error) => {
          console.log('`/api/leads/paymentremarks- Error', error)
          setLoading(false)
        })
    } else {
      setCollapsed(!isCollapsed)
    }
  }

  return (
    <Modal visible={CMPayment.visible} style={{ zIndex: 97 }}>
      <SafeAreaView style={AppStyles.mb1}>
        <ScrollView style={styles.modalMain}>
          <View style={styles.topHeader}>
            <Text style={styles.headingText}>Enter Details</Text>
            <TouchableOpacity
              style={styles.timesBtn}
              onPress={() => {
                setCollapsed(false)
                setRemarks([])
                onModalCloseClick()
              }}
            >
              <Image source={times} style={styles.timesImg} />
            </TouchableOpacity>
          </View>
          {CMPayment.paymentType !== 'tax' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                marginHorizontal: 10,
              }}
            >
              <Switch
                value={CMPayment.taxIncluded}
                trackColor={{ true: AppStyles.colors.primaryColor, false: 'grey' }}
                onValueChange={() => {
                  handleCommissionChange(!CMPayment.taxIncluded, 'taxIncluded')
                }}
                disabled={CMPayment.status === 'pendingAccount'}
                thumbColor={'#fff'}
              />
              <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>
                {CMPayment.taxIncluded === false || CMPayment.taxIncluded === null
                  ? 'Tax Not Included'
                  : 'Tax Included'}
              </Text>
            </View>
          )}

          <View style={styles.moreViewContainer}>
            {/* **************************************** */}
            {
              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <PickerComponent
                    enabled={CMPayment.status !== 'pendingAccount'}
                    onValueChange={handleCommissionChange}
                    data={
                      CMPayment.paymentType === 'token'
                        ? StaticData.paymentTypeForToken
                        : CMPayment.paymentType === 'tax'
                        ? StaticData.investmentTaxType
                        : StaticData.investmentPaymentType
                    }
                    name={'paymentType'}
                    placeholder="Payment Type"
                    selectedItem={CMPayment.paymentType}
                  />
                  {modalValidation === true && CMPayment.paymentType == '' && (
                    <ErrorMessage errorMessage={'Required'} />
                  )}
                </View>
              </View>
            }
            <SimpleInputText
              editable={CMPayment.status !== 'pendingAccount'}
              name={'installmentAmount'}
              fromatName={false}
              placeholder={'Enter Amount'}
              label={'ENTER AMOUNT'}
              value={CMPayment.installmentAmount}
              formatValue={CMPayment.installmentAmount}
              keyboardType={'numeric'}
              onChangeHandle={handleCommissionChange}
            />
            {paymentNotZero ? (
              <ErrorMessage errorMessage={'Amount must be greater than 0'} />
            ) : null}
            {modalValidation === true &&
            (CMPayment.installmentAmount == null || CMPayment.installmentAmount == '') ? (
              <ErrorMessage errorMessage={'Required'} />
            ) : null}
            <View style={[AppStyles.mainInputWrap]}>
              <View style={[AppStyles.inputWrap]}>
                <PickerComponent
                  enabled={CMPayment.status !== 'pendingAccount'}
                  onValueChange={handleCommissionChange}
                  data={StaticData.investFullPaymentType}
                  name={'type'}
                  placeholder="Payment Category"
                  selectedItem={CMPayment.type}
                />
                {modalValidation === true && CMPayment.type == '' && (
                  <ErrorMessage errorMessage={'Required'} />
                )}
              </View>
            </View>

            {CMPayment.type === 'Rent Adjustment' && (
              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <PickerComponent
                    onValueChange={handleCommissionChange}
                    enabled={CMPayment.status !== 'pendingAccount'}
                    data={AllAssignedLeads}
                    name={'rentAdjLeadID'}
                    placeholder="Lead ID"
                    selectedItem={CMPayment.rentAdjLeadID}
                  />
                  {modalValidation === true && CMPayment.rentAdjLeadID == null && (
                    <ErrorMessage errorMessage={'Required'} />
                  )}
                </View>
              </View>
            )}

            {/* The View for Lead Details */}
            {CMPayment.rentAdjLeadID &&
              SelectedLeadDetails &&
              SelectedLeadDetails.length != 0 &&
              SelectedLeadDetails[0] && (
                <View style={[AppStyles.mainInputWrap]}>
                  <View style={[AppStyles.inputWrap]}>
                    <View style={styles.detailsView}>
                      <Text style={styles.labelText}>Reference number</Text>
                      <Text style={styles.detailsText}>
                        {SelectedLeadDetails[0].referenceNumber}
                      </Text>
                      <Text style={styles.labelText}>Project</Text>
                      <Text style={styles.detailsText}>{SelectedLeadDetails[0].project.name}</Text>
                      <Text style={styles.labelText}>Floor</Text>
                      <Text style={styles.detailsText}>{SelectedLeadDetails[0].floor.name}</Text>
                      <Text style={styles.labelText}>Unit</Text>
                      <Text style={styles.detailsText}>{SelectedLeadDetails[0].unit.name}</Text>
                    </View>
                  </View>
                </View>
              )}

            {CMPayment.type === 'cheque' ||
            CMPayment.type === 'pay-Order' ||
            CMPayment.type === 'bank-Transfer' ? (
              <AddEditInstrument
                handleInstrumentInfoChange={handleInstrumentInfoChange}
                enabled={CMPayment.status !== 'pendingAccount'}
                errorMessage={CMPayment.instrumentDuplicateError}
              />
            ) : null}

            {CMPayment.type === 'asset_adjustment' && (
              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <SimpleInputText
                    name={'assetAdjDetails'}
                    fromatName={false}
                    placeholder={'Asset Adjustment Details'}
                    label={'ASSET ADJUSTMENT DETAILS'}
                    value={CMPayment.assetAdjDetails != '' ? CMPayment.assetAdjDetails : ''}
                    editable={CMPayment.status !== 'pendingAccount'}
                    formatValue={''}
                    onChangeHandle={handleCommissionChange}
                  />
                  {modalValidation === true &&
                    (CMPayment.assetAdjDetails == undefined || CMPayment.assetAdjDetails == '') && (
                      <ErrorMessage errorMessage={'Required'} />
                    )}
                </View>
              </View>
            )}

            {CMPayment.type === 'Inter-Mall Adjustment' && (
              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <SimpleInputText
                    name={'adjustedRefNo'}
                    fromatName={false}
                    placeholder={'Reference # of Adjusted Unit'}
                    label={'Reference # of Adjusted Unit'}
                    value={CMPayment.adjustedRefNo != '' ? CMPayment.adjustedRefNo : ''}
                    editable={CMPayment.status !== 'pendingAccount'}
                    formatValue={''}
                    onChangeHandle={handleCommissionChange}
                  />
                  {modalValidation === true &&
                    (CMPayment.adjustedRefNo == undefined || CMPayment.adjustedRefNo == '') && (
                      <ErrorMessage errorMessage={'Required'} />
                    )}
                </View>
              </View>
            )}

            {CMPayment.type === 'Rent Adjustment' && (
              <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                  <TouchableOpacity
                    onPress={() => showPicker()}
                    style={[
                      styles.input,
                      {
                        backgroundColor: CMPayment.status === 'pendingAccount' ? '#8baaef' : '#fff',
                      },
                    ]}
                    disabled={CMPayment.status === 'pendingAccount'}
                  >
                    {CMPayment.rentMonth == undefined || CMPayment.rentMonth == '' ? (
                      <Text style={styles.inputTextLabel}>Select Month</Text>
                    ) : (
                      <Text style={styles.inputText}>
                        {months[selectedMonth - 1]} {selectedYear}
                      </Text>
                    )}
                    <Image
                      style={{ width: 26, height: 26 }}
                      source={require('../../../assets/img/calendar.png')}
                    />
                  </TouchableOpacity>
                  {modalValidation === true &&
                    (CMPayment.rentMonth == undefined || CMPayment.rentMonth == '') && (
                      <ErrorMessage errorMessage={'Required'} />
                    )}
                </View>
              </View>
            )}

            <SimpleInputText
              editable={CMPayment.status !== 'pendingAccount'}
              name={'details'}
              fromatName={false}
              placeholder={'Details'}
              label={'DETAILS'}
              value={CMPayment.details != '' ? CMPayment.details : ''}
              formatValue={''}
              onChangeHandle={handleCommissionChange}
            />

            {CMPayment.id && (
              <TouchableOpacity
                disabled={loading}
                style={styles.addPaymentBtn}
                onPress={() => fetchRemarks()}
              >
                <Image
                  style={[styles.arrowDownImg, isCollapsed === true && styles.rotateImg]}
                  source={require('../../../assets/img/arrowDown.png')}
                ></Image>
                <Text style={styles.addPaymentBtnText}>VIEW REMARKS</Text>
              </TouchableOpacity>
            )}

            {loading === false && isCollapsed ? (
              remarks.length > 0 ? (
                <FlatList
                  style={{ minHeight: 20, maxHeight: 150 }}
                  data={remarks}
                  renderItem={({ item, index }) => (
                    <View style={[styles.MainTileView, index === 0 ? styles.noBorder : null]}>
                      <View>
                        <Text style={[styles.smallText]}>
                          {item.armsuser.firstName} {item.armsuser.lastName}{' '}
                          <Text style={styles.smallestText}>
                            {' '}
                            ({moment(item.createdAt).format('hh:mm A, MMM DD YY')})
                          </Text>
                        </Text>
                        <Text style={styles.largeText}>{handleEmptyValue(item.remarks)}</Text>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              ) : (
                <ErrorMessage color={'gray'} errorMessage={'No Payment Remarks Exists'} />
              )
            ) : null}

            {/* Attachments View */}
            {CMPayment.installmentAmount != null &&
              CMPayment.installmentAmount != '' &&
              CMPayment.type != '' &&
              !checkFirstFormToken && (
                <View style={[AppStyles.mainInputWrap]}>
                  <View style={[AppStyles.inputWrap]}>
                    <TouchableOpacity
                      disabled={CMPayment.status === 'pendingAccount'}
                      style={[
                        styles.addPaymentBtn,
                        {
                          backgroundColor:
                            CMPayment.status === 'pendingAccount' ? '#8baaef' : '#fff',
                          borderColor:
                            CMPayment.status === 'pendingAccount'
                              ? '#8baaef'
                              : AppStyles.colors.primaryColor,
                        },
                      ]}
                      onPress={() => {
                        goToPayAttachments()
                      }}
                    >
                      <Text
                        style={[
                          styles.addPaymentBtnText,
                          {
                            color:
                              CMPayment.status === 'pendingAccount'
                                ? '#f3f5f7'
                                : AppStyles.colors.primaryColor,
                          },
                        ]}
                      >
                        ATTACHMENTS
                      </Text>
                      {/* For Check if Required in case of Rebate */}
                    </TouchableOpacity>
                    {CMPayment.type == 'Rebate Adjustment' &&
                      modalValidation === true &&
                      (CMPayment.paymentAttachments.length == 0 ||
                        CMPayment.paymentAttachments === null ||
                        CMPayment.paymentAttachments == undefined) && (
                        <ErrorMessage errorMessage={'Required'} />
                      )}
                  </View>
                </View>
              )}

            {CMPayment.id ? (
              <OfficeLocationSelector
                officeLocations={officeLocations}
                officeLocationId={CMPayment.officeLocationId}
                handleOfficeLocationChange={handleOfficeLocationChange}
                disabled={
                  CMPayment.status === 'pendingAccount' ||
                  (lead && lead.project && lead.project.externalProject === true)
                }
              />
            ) : null}

            <View style={styles.row}>
              {CMPayment.status ? (
                <TouchableButton
                  disabled={
                    CMPayment.status !== 'open' &&
                    CMPayment.status !== 'pendingSales' &&
                    CMPayment.status !== 'notCleared'
                  }
                  containerBackgroundColor={
                    CMPayment.status === 'open' ||
                    CMPayment.status === 'pendingSales' ||
                    CMPayment.status === 'notCleared'
                      ? AppStyles.colors.primaryColor
                      : '#8baaef'
                  }
                  containerStyle={[
                    styles.bookedBtn,
                    {
                      width: '50%',
                      marginVertical: 15,
                      marginRight: 10,
                      borderColor:
                        CMPayment.status === 'open' ||
                        CMPayment.status === 'pendingSales' ||
                        CMPayment.status === 'notCleared'
                          ? AppStyles.colors.primaryColor
                          : '#8baaef',
                    },
                  ]}
                  label={'ASSIGN TO ACCOUNTS'}
                  textColor={
                    CMPayment.status === 'open' ||
                    CMPayment.status === 'pendingSales' ||
                    CMPayment.status === 'notCleared'
                      ? '#fff'
                      : '#f3f5f7'
                  }
                  fontFamily={AppStyles.fonts.boldFont}
                  fontSize={16}
                  loading={assignToAccountsLoading}
                  onPress={() =>
                    CMPayment.officeLocationId === null
                      ? alert('Payment Location cannot be empty!')
                      : assignToAccounts()
                  }
                />
              ) : null}

              <TouchableButton
                containerStyle={[
                  styles.bookedBtn,
                  {
                    width: CMPayment.status ? '45%' : '100%',
                    marginVertical: 15,
                    borderColor:
                      CMPayment.status !== 'pendingAccount'
                        ? AppStyles.colors.primaryColor
                        : '#8baaef',
                  },
                ]}
                containerBackgroundColor={
                  CMPayment.status !== 'pendingAccount' ? AppStyles.colors.primaryColor : '#8baaef'
                }
                textColor={CMPayment.status !== 'pendingAccount' ? '#fff' : '#f3f5f7'}
                label={'OK'}
                fontFamily={AppStyles.fonts.boldFont}
                fontSize={16}
                loading={addPaymentLoading}
                onPress={() => submitCommissionPayment()}
                disabled={CMPayment.status === 'pendingAccount'}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

mapStateToProps = (store) => {
  return {
    CMPayment: store.CMPayment.CMPayment,
  }
}

export default connect(mapStateToProps)(CMPaymentModal)

const styles = StyleSheet.create({
  modalMain: {
    backgroundColor: '#e7ecf0',
  },
  timesBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 50,
  },
  timesImg: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
  addPaymentBtn: {
    flexDirection: 'row',
    borderColor: '#006ff1',
    borderRadius: 4,
    borderWidth: 1,
    backgroundColor: '#fff',
    color: '#006ff1',
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    letterSpacing: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPaymentBtnImg: {
    resizeMode: 'contain',
    width: 20,
    marginRight: 10,
    height: 19,
  },
  addPaymentBtnText: {
    color: '#006ff1',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  bookedBtn: {
    borderColor: '#006ff1',
    backgroundColor: '#006ff1',
    width: '50%',
    borderRadius: 4,
    borderWidth: 1,
    color: '#006ff1',
    textAlign: 'center',
    borderRadius: 4,
    marginBottom: 0,
    justifyContent: 'center',
    marginBottom: 10,
    minHeight: 55,
  },
  bookedBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    // fontWeight: 'bold',
    // letterSpacing: 2,
    borderRadius: 4,
  },
  bookedBtnImage: {
    resizeMode: 'contain',
    width: 17,
    marginRight: 5,
    height: 17,
    position: 'relative',
    top: 2,
  },
  topHeader: {
    backgroundColor: '#006ff1',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  moreViewContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headingText: {
    color: '#fff',
    fontSize: 18,
  },
  reSubmitBtnMain: {
    flexDirection: 'row',
  },
  reSubmitBtns: {
    marginRight: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  reSubmitText: {
    fontSize: 16,
  },
  reSubmitLight: {
    backgroundColor: '#fff',
    flex: 1,
    marginRight: 0,
  },
  reSubmitTextDark: {
    color: '#006ff1',
  },
  cancelLight: {
    flex: 1,
  },
  MainTileView: {
    borderTopWidth: 1,
    borderColor: '#ECECEC',
    padding: 10,
    backgroundColor: 'white',
  },
  smallText: {
    color: '#1F2029',
    fontSize: 16,
    marginBottom: 3,
    textTransform: 'capitalize',
  },
  smallestText: {
    fontSize: 12,
  },
  largeText: {
    color: '#1F2029',
    fontSize: 14,
  },
  noBorder: {
    borderTopWidth: 0,
  },

  arrowDownImg: {
    marginTop: 1,
    resizeMode: 'contain',
    width: 17,
    marginRight: 10,
    height: 19,
  },
  rotateImg: {
    transform: [{ rotate: '180deg' }],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    letterSpacing: 2,
    color: '#0E73EE',
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 5,
  },
  labelText: {
    color: '#23232C',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 5,
  },
  detailsView: {
    backgroundColor: 'white',
    padding: '4%',
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4,
  },
  inputText: {
    fontSize: 16,
    fontSize: 14,
    fontFamily: 'OpenSans_regular',
  },
  inputTextLabel: {
    fontSize: 14,
    fontFamily: 'OpenSans_regular',
    fontWeight: '200',
    color: '#a8a8aa',
  },
})
