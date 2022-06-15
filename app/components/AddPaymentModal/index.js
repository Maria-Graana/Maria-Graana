/** @format */

import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { ListItem, Body, Switch } from 'native-base'
import styles from './style'
import AppStyles from '../../AppStyles'
import Modal from 'react-native-modal'
import SimpleInputText from '../SimpleInputField'
import PickerComponent from '../Picker/index'
import StaticData from '../../StaticData'
import ErrorMessage from '../../components/ErrorMessage'
import times from '../../../assets/img/times.png'
import moment from 'moment'

class AddPaymentModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      active,
      secondHandleForm,
      addPaymentModalToggle,
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
      isAttachmentRequired,
    } = this.props
    return (
      <Modal isVisible={active}>
        <View style={[styles.modalMain]}>
          {modalLoading === false ? (
            <View style={styles.topHeader}>
              <Text style={styles.headingText}>
                Enter {secondFormData.whichModalVisible === 'taxModal' ? 'Tax' : ''} Details
              </Text>
              <TouchableOpacity
                style={styles.timesBtn}
                onPress={() => {
                  addPaymentModalToggle(false)
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
              {secondFormData.whichModalVisible != 'paymentModal' ||
                (secondFormData.whichModalVisible != 'token' && (
                  <View>
                    <ListItem
                      style={{ borderBottomWidth: 0, paddingBottom: 0 }}
                      onPress={() => {
                        secondHandleForm(!secondFormData.taxIncluded, 'taxIncluded')
                      }}
                    >
                      <Switch
                        value={secondFormData.taxIncluded}
                        trackColor={{ true: AppStyles.colors.primaryColor, false: 'grey' }}
                        onValueChange={() => {
                          secondHandleForm(!secondFormData.taxIncluded, 'taxIncluded')
                        }}
                        thumbColor={'#fff'}
                      />
                      <Body>
                        <Text style={{ marginLeft: 5, fontSize: 16, fontWeight: 'bold' }}>
                          {secondFormData.taxIncluded === false ||
                          secondFormData.taxIncluded === null
                            ? 'Tax Not Included'
                            : 'Tax Included'}
                        </Text>
                      </Body>
                    </ListItem>
                  </View>
                ))}

              <View style={styles.moreViewContainer}>
                <SimpleInputText
                  name={'installmentAmount'}
                  fromatName={false}
                  placeholder={'Enter Amount'}
                  label={'ENTER AMOUNT'}
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
                      <Text style={styles.addPaymentBtnText}>ATTACHMENT</Text>
                    </TouchableOpacity>
                  )}

                {isAttachmentRequired ? (
                  <ErrorMessage
                    containerStyle={{ marginVertical: 5 }}
                    errorMessage={'Attachment Required'}
                  />
                ) : null}

                {secondFormLeadData.status === 'pendingSales' ? (
                  <View style={styles.reSubmiitBtnMain}>
                    <TouchableOpacity
                      style={[styles.bookedBtn, styles.reSubmitBtns, styles.cancelLight]}
                      onPress={() => {
                        addPaymentModalToggle(false)
                      }}
                    >
                      {/* <Image source={require('../../../assets/img/checkWhite.png')} style={styles.bookedBtnImage} /> */}
                      <Text style={[styles.bookedBtnText, styles.reSubmitText]}>CANCEL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.bookedBtn, styles.reSubmitBtns, styles.reSubmitLight]}
                      onPress={() => {
                        addPaymentLoading != true && secondFormSubmit('payment')
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
                      addPaymentLoading != true && secondFormSubmit()
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

export default AddPaymentModal
