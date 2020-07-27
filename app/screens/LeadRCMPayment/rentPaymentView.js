
import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import AppStyles from '../../AppStyles'
import styles from './styles'
import { Ionicons } from '@expo/vector-icons';
import PickerComponent from '../../components/Picker'
import moment from 'moment';
import { formatPrice } from '../../PriceFormate'
import InputField from '../../components/InputField'

const RentPaymentView = (props) => {
    const {
        token,
        pickerData,
        handleForm,
        formData,
        handleMonthlyRentPress,
        showMonthlyRentArrow,
        commissionPayment,
        handleTokenAmountChange,
        handleCommissionAmountChange,
        showTokenAmountArrow,
        showCommissionAmountArrow,
        handleTokenAmountPress,
        handleCommissionAmountPress,
        lead,
        showAndHideStyling,
        showStylingState,
        tokenPriceFromat,
        tokenDateStatus,
        comissionDateStatus,
        comissionPriceFromat,
        monthlyFormatStatus
    } = props;
    const isLeadClosed = lead.status === StaticData.Constants.lead_closed_lost || lead.status === StaticData.Constants.lead_closed_won;
    return (
        <View>

            <InputField
                label={'MONTHLY RENT'}
                placeholder={'Enter Monthly Rent'}
                name={'monthlyRent'}
                value={formData.monthlyRent}
                priceFormatVal={formData.monthlyRent != null ? formData.monthlyRent : ''}
                keyboardType={'numeric'}
                onChange={handleForm}
                paymentDone={handleMonthlyRentPress}
                showStyling={showAndHideStyling}
                showStylingState={showStylingState}
                editPriceFormat={{ status: monthlyFormatStatus, name: 'monthlyRent' }}
                editable={!isLeadClosed}
                showDate={false}
            />
            <View style={[styles.mainBlackWrap]}>
                <View style={{ width: "50%", justifyContent: "center" }}>
                    <Text style={[styles.blackInputText, { marginLeft: 12 }]}>MONTHLY RENT</Text>
                    <TextInput style={[styles.blackInput, { marginLeft: 12 }]} editable={!isLeadClosed} placeholder={'Enter Monthly Rent'} value={formData.monthlyRent} keyboardType={'number-pad'} onChangeText={(text) => handleForm(text, 'monthlyRent')} />
                </View>
                <Text style={[styles.dateText, { textAlign: 'right' }]}>{`${formatPrice(formData.monthlyRent)} PKR`}</Text>
                {
                    showMonthlyRentArrow &&
                    <TouchableOpacity onPress={handleMonthlyRentPress} style={[styles.addBtnColorRight, styles.sideBtnInput, { alignItems: 'center', justifyContent: "center" }]}>
                        <Ionicons style={{ alignSelf: 'flex-end', marginRight: 10 }} name='ios-arrow-round-forward' size={40} color={AppStyles.colors.primaryColor} />
                    </TouchableOpacity>
                }

            </View>

            <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                    <PickerComponent onValueChange={handleForm} name={'contract_months'} data={pickerData} selectedItem={formData.contract_months} enabled={!isLeadClosed} placeholder='Contact duration (No of months)' />
                </View>
            </View>

            <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                    <PickerComponent onValueChange={handleForm} name={'advance'} data={pickerData} selectedItem={formData.advance} enabled={!isLeadClosed} placeholder='Advance (No of months)' />
                </View>
            </View>


            <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                    <PickerComponent onValueChange={handleForm} name={'security'} data={pickerData} selectedItem={formData.security} enabled={!isLeadClosed} placeholder='Security (No of months)' />
                </View>
            </View>

            <InputField
                label={'TOKEN'}
                placeholder={'Enter Token Amount'}
                name={'token'}
                value={token}
                priceFormatVal={token != null ? token : ''}
                keyboardType={'numeric'}
                onChange={handleTokenAmountChange}
                paymentDone={handleTokenAmountPress}
                showStyling={showAndHideStyling}
                showStylingState={showStylingState}
                editPriceFormat={{ status: tokenPriceFromat, name: 'token' }}
                date={lead.tokenPaymentTime && moment(lead.tokenPaymentTime).format('hh:mm A, MMMM DD')}
                editable={!isLeadClosed}
                showDate={true}
                dateStatus={{ status: tokenDateStatus, name: 'token' }}
            />

            {/* <View style={[styles.mainBlackWrap]}>
                <View style={{ width: "50%" }}>
                    <Text style={[styles.blackInputText, { marginLeft: 12 }]}>TOKEN</Text>
                    <TextInput style={[styles.blackInput, { marginLeft: 12 }]} editable={!isLeadClosed} placeholder={'Enter Token Amount'} value={(token)} keyboardType={'number-pad'} onChangeText={(text) => handleTokenAmountChange(text)} />
                </View>
                <Text style={[styles.dateText, { textAlign: 'right' }]}>{`${formatPrice(token)} PKR`}</Text>
                {
                    showTokenAmountArrow ?
                        <TouchableOpacity onPress={handleTokenAmountPress} style={[styles.addBtnColorRight, styles.sideBtnInput, { alignItems: 'center', justifyContent: "center" }]}>
                            <Ionicons style={{ alignSelf: 'flex-end', marginRight: 10 }} name='ios-arrow-round-forward' size={40} color={AppStyles.colors.primaryColor} />
                        </TouchableOpacity>
                        :
                        <View style={[styles.blackInputdate, { justifyContent: 'center' }]}>
                            <Text style={{
                                letterSpacing: 0.5,
                                minHeight: 30,
                                minWidth: 50,
                                marginLeft: 10,
                                fontSize: 10,
                                alignSelf: 'flex-end',
                                marginRight: 10
                            }}>{lead.tokenPaymentTime && moment(lead.tokenPaymentTime).format('hh:mm A, MMMM DD')}</Text>
                        </View>
                }

            </View> */}


            <InputField
                label={'COMMISSION PAYMENT'}
                placeholder={'Enter Comission Payment'}
                name={'commissionPayment'}
                value={commissionPayment}
                priceFormatVal={commissionPayment != null ? commissionPayment : ''}
                keyboardType={'numeric'}
                onChange={handleCommissionAmountChange}
                paymentDone={handleCommissionAmountPress}
                showStyling={showAndHideStyling}
                showStylingState={showStylingState}
                editPriceFormat={{ status: comissionPriceFromat, name: 'commissionPayment' }}
                date={lead.commissionTime && moment(lead.commissionTime).format('hh:mm A, MMMM DD')}
                editable={!isLeadClosed}
                showDate={true}
                dateStatus={{ status: comissionDateStatus, name: 'commissionPayment' }}
            />


            {/* <View style={[styles.mainBlackWrap]}>
                <View style={{ width: "50%" }}>
                    <Text style={[styles.blackInputText, { marginLeft: 12 }]}>COMMISSION PAYMENT</Text>
                    <TextInput style={[styles.blackInput, { marginLeft: 12 }]} editable={!isLeadClosed} keyboardType={'number-pad'} value={(commissionPayment)} onChangeText={(text) => handleCommissionAmountChange(text)} />
                </View>
                <Text style={[styles.dateText, { textAlign: 'right' }]}>{`${formatPrice(commissionPayment)} PKR`}</Text>
                {
                    showCommissionAmountArrow ?
                        <TouchableOpacity onPress={handleCommissionAmountPress} style={[styles.addBtnColorRight, styles.sideBtnInput, { alignItems: 'center', justifyContent: "center" }]} >
                            <Ionicons style={{ alignSelf: 'flex-end', marginRight: 10 }} name='ios-arrow-round-forward' size={40} color={AppStyles.colors.primaryColor} />
                        </TouchableOpacity>
                        :
                        <View style={[styles.blackInputdate, { justifyContent: 'center' }]}>
                            <Text style={{
                                letterSpacing: 0.5,
                                minHeight: 30,
                                marginLeft: 10,
                                fontSize: 10,
                                alignSelf: 'flex-end',
                                marginRight: 10
                            }}>{lead.commissionTime && moment(lead.commissionTime).format('hh:mm A, MMMM DD')}</Text>
                        </View>
                }

            </View> */}
        </View >
    )
}

export default RentPaymentView
