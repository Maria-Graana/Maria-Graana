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
  SafeAreaView,
  Modal,
} from 'react-native'
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

const AddRCMPaymentModal = ({
  onModalCloseClick,
  handleCommissionChange,
  modalValidation,
  rcmPayment,
  goToPayAttachments,
  addPaymentLoading,
  assignToAccountsLoading,
  lead,
  submitCommissionPayment,
  paymentNotZero,
  editTextInput = true,
  assignToAccounts,
  officeLocations,
  handleOfficeLocationChange,
  handleInstrumentInfoChange,
}) => {
  const handleEmptyValue = (value) => {
    return value != null && value != '' ? value : ''
  }

  const [remarks, setRemarks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isCollapsed, setCollapsed] = useState(false)

  const fetchRemarks = () => {
    if (isCollapsed === false) {
      const url = `/api/leads/paymentremarks?id=${rcmPayment.id}`
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
    <Modal visible={rcmPayment.visible}>
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
          <View style={styles.moreViewContainer}>
            {/* **************************************** */}
            <SimpleInputText
              name={'installmentAmount'}
              fromatName={false}
              placeholder={'Enter Amount'}
              label={'ENTER AMOUNT'}
              value={rcmPayment.installmentAmount}
              formatValue={rcmPayment.installmentAmount}
              keyboardType={'numeric'}
              onChangeHandle={handleCommissionChange}
              editable={editTextInput && rcmPayment.status !== 'pendingAccount'}
            />
            {paymentNotZero ? (
              <ErrorMessage errorMessage={'Amount must be greater than 0'} />
            ) : null}
            {modalValidation === true &&
            (rcmPayment.installmentAmount == null || rcmPayment.installmentAmount == '') ? (
              <ErrorMessage errorMessage={'Required'} />
            ) : null}
            <View style={[AppStyles.mainInputWrap]}>
              <View style={[AppStyles.inputWrap]}>
                <PickerComponent
                  onValueChange={handleCommissionChange}
                  enabled={rcmPayment.status !== 'pendingAccount'}
                  data={StaticData.fullPaymentType}
                  name={'type'}
                  placeholder="Type"
                  selectedItem={rcmPayment.type}
                />
                {modalValidation === true && rcmPayment.type == '' && (
                  <ErrorMessage errorMessage={'Required'} />
                )}
              </View>
            </View>

            {rcmPayment.type === 'cheque' ||
            rcmPayment.type === 'pay-Order' ||
            rcmPayment.type === 'bank-Transfer' ? (
              <AddEditInstrument
                handleInstrumentInfoChange={handleInstrumentInfoChange}
                enabled={rcmPayment.status !== 'pendingAccount'}
              />
            ) : null}

            <SimpleInputText
              name={'details'}
              fromatName={false}
              placeholder={'Details'}
              label={'DETAILS'}
              value={rcmPayment.details != '' ? rcmPayment.details : ''}
              editable={rcmPayment.status !== 'pendingAccount'}
              formatValue={''}
              onChangeHandle={handleCommissionChange}
            />

            {rcmPayment.id && (
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

            {rcmPayment.installmentAmount != null &&
              rcmPayment.installmentAmount != '' &&
              rcmPayment.type != '' && (
                <TouchableOpacity
                  style={[
                    styles.addPaymentBtn,
                    {
                      backgroundColor: rcmPayment.status === 'pendingAccount' ? '#8baaef' : '#fff',
                      borderColor:
                        rcmPayment.status === 'pendingAccount'
                          ? '#8baaef'
                          : AppStyles.colors.primaryColor,
                    },
                  ]}
                  disabled={rcmPayment.status === 'pendingAccount'}
                  onPress={() => {
                    goToPayAttachments()
                  }}
                >
                  <Text
                    style={[
                      styles.addPaymentBtnText,
                      {
                        color:
                          rcmPayment.status === 'pendingAccount'
                            ? '#f3f5f7'
                            : AppStyles.colors.primaryColor,
                      },
                    ]}
                  >
                    ATTACHMENTS
                  </Text>
                </TouchableOpacity>
              )}

            {rcmPayment.id ? (
              <OfficeLocationSelector
                officeLocations={officeLocations}
                officeLocationId={rcmPayment.officeLocationId}
                handleOfficeLocationChange={handleOfficeLocationChange}
                disabled={rcmPayment.status === 'pendingAccount'}
              />
            ) : null}

            <View style={styles.row}>
              {rcmPayment.status && rcmPayment.paymentCategory !== 'token' ? (
                <TouchableButton
                  disabled={
                    rcmPayment.status !== 'open' &&
                    rcmPayment.status !== 'pendingSales' &&
                    rcmPayment.status !== 'notCleared'
                  }
                  containerBackgroundColor={
                    rcmPayment.status === 'open' ||
                    rcmPayment.status === 'pendingSales' ||
                    rcmPayment.status === 'notCleared'
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
                        rcmPayment.status === 'open' ||
                        rcmPayment.status === 'pendingSales' ||
                        rcmPayment.status === 'notCleared'
                          ? AppStyles.colors.primaryColor
                          : '#8baaef',
                    },
                  ]}
                  label={'ASSIGN TO ACCOUNTS'}
                  textColor={
                    rcmPayment.status === 'open' ||
                    rcmPayment.status === 'pendingSales' ||
                    rcmPayment.status === 'notCleared'
                      ? '#fff'
                      : '#f3f5f7'
                  }
                  fontFamily={AppStyles.fonts.boldFont}
                  fontSize={16}
                  loading={assignToAccountsLoading}
                  onPress={() =>
                    rcmPayment.officeLocationId === null
                      ? alert('Payment Location cannot be empty!')
                      : assignToAccounts()
                  }
                />
              ) : null}

              <TouchableButton
                containerStyle={[
                  styles.bookedBtn,
                  {
                    width:
                      rcmPayment.status && rcmPayment.paymentCategory !== 'token' ? '45%' : '100%',
                    marginVertical: 15,
                    borderColor:
                      rcmPayment.status !== 'pendingAccount'
                        ? AppStyles.colors.primaryColor
                        : '#8baaef',
                  },
                ]}
                containerBackgroundColor={
                  rcmPayment.status !== 'pendingAccount' ? AppStyles.colors.primaryColor : '#8baaef'
                }
                textColor={rcmPayment.status !== 'pendingAccount' ? '#fff' : '#f3f5f7'}
                disabled={rcmPayment.status === 'pendingAccount'}
                label={'OK'}
                fontFamily={AppStyles.fonts.boldFont}
                fontSize={16}
                loading={addPaymentLoading}
                onPress={() => submitCommissionPayment()}
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
    rcmPayment: store.RCMPayment.RCMPayment,
  }
}

export default connect(mapStateToProps)(AddRCMPaymentModal)

const styles = StyleSheet.create({
  modalMain: {
    backgroundColor: '#e7ecf0',
    // borderRadius: 7,
    // overflow: 'hidden',
    // zIndex: 5,
    // position: 'relative',
    // elevation: 5,
    // shadowOffset: { width: 5, height: 5 },
    // shadowColor: '#33333312',
    // shadowOpacity: 1,
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
    letterSpacing: 2,
    borderRadius: 4,
    marginVertical: 10,
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
})
