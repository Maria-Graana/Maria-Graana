import React from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import times from '../../../assets/img/times.png'
import SimpleInputText from '../SimpleInputField'
import PickerComponent from '../Picker/index';
import StaticData from '../../StaticData';
import ErrorMessage from '../../components/ErrorMessage'

const AddCommissionModal = ({
    onModalCloseClick,
    handleCommissionChange,
    modalValidation,
    rcmPayment,
    goToPayAttachments,
    addPaymentLoading,
    lead,
    submitCommissionPayment,
}) => {
    return (
        <Modal isVisible={rcmPayment.visible}>
            <View style={styles.modalMain}>
                <View style={styles.topHeader}>
                    <Text style={styles.headingText}>Enter Details</Text>
                    <TouchableOpacity style={styles.timesBtn} onPress={() => onModalCloseClick()}>
                        <Image source={times} style={styles.timesImg} />
                    </TouchableOpacity>
                </View>
                <View style={styles.moreViewContainer}>
                    <SimpleInputText
                        name={'installmentAmount'}
                        fromatName={false}
                        placeholder={'Enter Amount'}
                        label={'ENTER AMOUNT'}
                        value={rcmPayment.installmentAmount}
                        formatValue={rcmPayment.installmentAmount}
                        editable={true}
                        keyboardType={'numeric'}
                        onChangeHandle={handleCommissionChange}
                    />
                    {
                        modalValidation === true && (rcmPayment.installmentAmount == null || rcmPayment.installmentAmount == '') ? <ErrorMessage errorMessage={'Required'} /> : null
                    }

                    <View style={[AppStyles.mainInputWrap]}>
                        <View style={[AppStyles.inputWrap]}>
                            <PickerComponent onValueChange={handleCommissionChange} data={StaticData.fullPaymentType} name={'type'} placeholder='Type' selectedItem={rcmPayment.type} />
                            {modalValidation === true && rcmPayment.type == '' && <ErrorMessage errorMessage={'Required'} />}
                        </View>
                    </View>

                    <SimpleInputText
                        name={'details'}
                        fromatName={false}
                        placeholder={'Details'}
                        label={'DETAILS'}
                        value={rcmPayment.details != '' ? rcmPayment.details : ''}
                        formatValue={''}
                        editable={true}
                        onChangeHandle={handleCommissionChange}
                    />

                    {
                        lead.commissions && lead.commissions.remarks != null &&
                        <SimpleInputText
                            name={'remarks'}
                            fromatName={false}
                            placeholder={'Remarks'}
                            label={'REMARKS'}
                            value={rcmPayment.remarks}
                            formatValue={''}
                            editable={false}
                        />
                    }

                    {
                        rcmPayment.installmentAmount != null && rcmPayment.installmentAmount != '' &&
                        rcmPayment.type != '' &&
                        <TouchableOpacity style={styles.addPaymentBtn} onPress={() => { goToPayAttachments() }}>
                            <Image style={styles.addPaymentBtnImg} source={require('../../../assets/img/roundPlus.png')}></Image>
                            <Text style={styles.addPaymentBtnText}>ADD ATTACHMENT</Text>
                        </TouchableOpacity>
                    }

                    {
                        lead.commissions && lead.commissions.status === 'rejected' ?
                            <View style={styles.reSubmiitBtnMain}>
                                <TouchableOpacity style={[styles.bookedBtn, styles.reSubmitBtns, styles.cancelLight]} onPress={() => { onModalCloseClick() }}>
                                    <Text style={[styles.bookedBtnText, styles.reSubmitText]}>
                                        CANCEL
                          </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.bookedBtn, styles.reSubmitBtns, styles.reSubmitLight]} onPress={() => { addPaymentLoading != true && submitCommissionPayment() }}>
                                    <Text style={[styles.bookedBtnText, styles.reSubmitText, styles.reSubmitTextDark]}>
                                        {addPaymentLoading === true ? 'Wait...' : 'RE-SUBMIT'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <TouchableOpacity style={styles.bookedBtn} onPress={() => { addPaymentLoading != true && submitCommissionPayment() }}>
                                <Image source={require('../../../assets/img/checkWhite.png')} style={styles.bookedBtnImage} />
                                <Text style={styles.bookedBtnText}>
                                    {addPaymentLoading === true ? 'Wait...' : 'OK'}
                                </Text>
                            </TouchableOpacity>
                    }
                </View>
            </View>

        </Modal>

    )
}

mapStateToProps = (store) => {
    return {
        rcmPayment: store.RCMPayment.RCMPayment,
    }
}

export default connect(mapStateToProps)(AddCommissionModal)



const styles = StyleSheet.create({
    modalMain: {
        backgroundColor: '#e7ecf0',
        borderRadius: 7,
        overflow: 'hidden',
        zIndex: 5,
        position: 'relative',
        elevation: 5,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#33333312',
        shadowOpacity: 1,
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
    MainTileView: {
        borderBottomWidth: 1,
        borderColor: '#ECECEC',
        paddingTop: 15,
        paddingBottom: 15,
    },
    smallText: {
        color: '#1F2029',
        fontSize: 14,
        marginBottom: 3,
        textTransform: 'capitalize',
    },
    largeText: {
        color: '#1F2029',
        fontSize: 20,
    },
    noBorder: {
        borderBottomWidth: 0
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
        marginBottom: 15,
        justifyContent: 'center',
        marginTop: 15,
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
        flexDirection: 'row',
        borderColor: '#006ff1',
        backgroundColor: '#006ff1',
        borderRadius: 4,
        borderWidth: 1,
        color: '#006ff1',
        textAlign: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
        borderRadius: 4,
        marginBottom: 0,
        justifyContent: 'center',
        marginBottom: 10,
    },
    bookedBtnText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
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
        flexDirection: 'row'
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
        color: '#006ff1'
    },
    cancelLight: {
        flex: 1,
    },
})
