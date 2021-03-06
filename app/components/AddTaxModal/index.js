/** @format */

import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal'
import SimpleInputText from '../SimpleInputField'
import PickerComponent from '../Picker/index'
import StaticData from '../../StaticData'
import ErrorMessage from '../../components/ErrorMessage'
import times from '../../../assets/img/times.png'
import moment from 'moment'

class AddTaxModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      active,
      secondHandleForm,
      addTaxModalToggle,
      secondFormData,
      secondFormSubmit,
      secondCheckValidation,
      modalLoading,
      addPaymentLoading,
      goToPayAttachments,
      secondFormLeadData,
      remarks,
      goToRemarks,
      remarkActive,
      remarkData,
      remarksPaymentLoading,
      paymentNotZero,
    } = this.props
    return (
      <Modal isVisible={active}>
        <View style={[styles.modalMain]}>
          {modalLoading === false ? (
            <View style={styles.topHeader}>
              <Text style={styles.headingText}>Add Tax Details</Text>
              <TouchableOpacity
                style={styles.timesBtn}
                onPress={() => {
                  addTaxModalToggle(false)
                }}
              >
                <Image source={times} style={styles.timesImg} />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={{ padding: 10 }}>Fetching Data...</Text>
          )}
          {modalLoading === false ? (
            <ScrollView>
              <View style={styles.moreViewContainer}>
                <SimpleInputText
                  name={'installmentAmount'}
                  fromatName={false}
                  placeholder={'Enter Amount'}
                  label={'ENTER TAX AMOUNT'}
                  value={
                    secondFormData.installmentAmount != null
                      ? secondFormData.installmentAmount
                      : null
                  }
                  formatValue={
                    secondFormData.installmentAmount != null
                      ? secondFormData.installmentAmount
                      : null
                  }
                  editable={true}
                  keyboardType={'numeric'}
                  onChangeHandle={secondHandleForm}
                />
                {paymentNotZero ? (
                  <ErrorMessage errorMessage={'Amount must be greater than 0'} />
                ) : null}
                {secondCheckValidation === true ? (
                  secondFormData.installmentAmount === null ||
                  secondFormData.installmentAmount === '' ? (
                    <ErrorMessage errorMessage={'Required'} />
                  ) : null
                ) : null}

                <View style={[AppStyles.mainInputWrap]}>
                  <View style={[AppStyles.inputWrap]}>
                    <PickerComponent
                      onValueChange={secondHandleForm}
                      data={StaticData.investFullPaymentType}
                      name={'type'}
                      placeholder="Type"
                      selectedItem={secondFormData.type}
                    />
                    {secondCheckValidation === true && secondFormData.type === '' && (
                      <ErrorMessage errorMessage={'Required'} />
                    )}
                  </View>
                </View>

                <SimpleInputText
                  name={'details'}
                  fromatName={false}
                  placeholder={'Details'}
                  label={'DETAILS'}
                  value={secondFormData.details != '' ? secondFormData.details : ''}
                  formatValue={''}
                  editable={true}
                  onChangeHandle={secondHandleForm}
                />

                {remarks != null && (
                  <TouchableOpacity
                    style={styles.addPaymentBtn}
                    onPress={() => {
                      goToRemarks(!remarkActive, secondFormLeadData.id)
                    }}
                  >
                    <Image
                      style={[styles.arrowDownImg, remarkActive === true && styles.rotateImg]}
                      source={require('../../../assets/img/arrowDown.png')}
                    ></Image>
                    <Text style={styles.addPaymentBtnText}>VIEW REMARKS</Text>
                  </TouchableOpacity>
                )}

                {remarkActive === true && (
                  <View style={[styles.collapseMain, styles.collapseOpen]}>
                    <ScrollView style={{ height: 150 }}>
                      {remarksPaymentLoading === false ? (
                        remarkData &&
                        remarkData.length &&
                        remarkData.map((item, index) => {
                          return (
                            <View
                              style={[styles.MainTileView, index === 0 ? styles.noBorder : null]}
                            >
                              <View>
                                <Text style={[styles.smallText]}>
                                  {item.armsuser.firstName} {item.armsuser.lastName}{' '}
                                  <Text style={styles.smallestText}>
                                    {' '}
                                    ({moment(item.createdAt).format('hh:mm A, MMM DD, YYYY')})
                                  </Text>
                                </Text>
                                <Text style={styles.largeText}>{item.remarks}</Text>
                              </View>
                            </View>
                          )
                        })
                      ) : (
                        <Text>Fetching Data...</Text>
                      )}
                    </ScrollView>
                  </View>
                )}

                {secondFormData.installmentAmount != null &&
                  secondFormData.installmentAmount != '' &&
                  secondFormData.type != '' && (
                    <TouchableOpacity
                      style={styles.addPaymentBtn}
                      onPress={() => {
                        goToPayAttachments(true)
                      }}
                    >
                      <Image
                        style={styles.addPaymentBtnImg}
                        source={require('../../../assets/img/roundPlus.png')}
                      ></Image>
                      <Text style={styles.addPaymentBtnText}>ATTACHMENTS</Text>
                    </TouchableOpacity>
                  )}

                {secondFormLeadData.status === 'pendingSales' ? (
                  <View style={styles.reSubmiitBtnMain}>
                    <TouchableOpacity
                      style={[styles.bookedBtn, styles.reSubmitBtns, styles.cancelLight]}
                      onPress={() => {
                        addTaxModalToggle(false)
                      }}
                    >
                      {/* <Image source={require('../../../assets/img/checkWhite.png')} style={styles.bookedBtnImage} /> */}
                      <Text style={[styles.bookedBtnText, styles.reSubmitText]}>CANCEL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.bookedBtn, styles.reSubmitBtns, styles.reSubmitLight]}
                      onPress={() => {
                        addPaymentLoading != true && secondFormSubmit('tax')
                      }}
                    >
                      {/* <Image source={require('../../../assets/img/checkWhite.png')} style={styles.bookedBtnImage} /> */}
                      <Text
                        style={[styles.bookedBtnText, styles.reSubmitText, styles.reSubmitTextDark]}
                      >
                        {addPaymentLoading === true ? 'Wait...' : 'RE-SUBMIT'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.bookedBtn}
                    onPress={() => {
                      addPaymentLoading != true && secondFormSubmit('tax')
                    }}
                  >
                    {addPaymentLoading === false && (
                      <Image
                        source={require('../../../assets/img/checkWhite.png')}
                        style={styles.bookedBtnImage}
                      />
                    )}
                    <Text style={styles.bookedBtnText}>
                      {addPaymentLoading === true ? (
                        <ActivityIndicator size="small" color={'white'} style={styles.loaderTop} />
                      ) : (
                        'OK'
                      )}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          ) : null}
        </View>
      </Modal>
    )
  }
}

export default AddTaxModal
