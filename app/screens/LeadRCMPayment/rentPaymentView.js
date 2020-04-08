
import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import AppStyles from '../../AppStyles'
import styles from './styles'
import { Ionicons } from '@expo/vector-icons';
import PickerComponent from '../../components/Picker'
import moment from 'moment';

const RentPaymentView = (props) => {
    const { token, pickerData, handleForm, formData, handleMonthlyRentPress,showMonthlyRentArrow, commissionPayment, handleTokenAmountChange, handleCommissionAmountChange, showTokenAmountArrow, showCommissionAmountArrow, handleTokenAmountPress, handleCommissionAmountPress, lead } = props;
    console.log(formData)
    return (
        <View>
            <View style={[styles.mainBlackWrap]}>
                <View style={{ width: "80%", justifyContent: "center" }}>
                    <Text style={[styles.blackInputText, { marginLeft: 12 }]}>MONTHLY RENT</Text>
                    <TextInput style={[styles.blackInput, { marginLeft: 12 }]} placeholder={'Enter Monthly Rent'} value={formData.monthlyRent} keyboardType={'number-pad'} onChangeText={(text) => handleForm(text, 'monthlyRent')} />
                </View>
                {
                     showMonthlyRentArrow &&
                    <TouchableOpacity onPress={handleMonthlyRentPress} style={[styles.addBtnColorRight, styles.sideBtnInput, { alignItems: 'flex-end' }]}>
                        <Ionicons name='ios-arrow-round-forward' size={40} color={AppStyles.colors.primaryColor} style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                }

            </View>

            <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                    <PickerComponent onValueChange={handleForm} name={'contract_months'} data={pickerData} selectedItem={formData.contract_months} placeholder='Contact duration (No of months)' />
                </View>
            </View>

            <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                    <PickerComponent onValueChange={handleForm} name={'advance'} data={pickerData} selectedItem={formData.advance} placeholder='Advance (No of months)' />
                </View>
            </View>


            <View style={[AppStyles.mainInputWrap]}>
                <View style={[AppStyles.inputWrap]}>
                    <PickerComponent onValueChange={handleForm} name={'security'} data={pickerData} selectedItem={formData.security} placeholder='Security (No of months)' />
                </View>
            </View>



            <View style={[styles.mainBlackWrap]}>
                <View style={{ width: "80%" }}>
                    <Text style={[styles.blackInputText, { marginLeft: 12 }]}>TOKEN</Text>
                    <TextInput style={[styles.blackInput, { marginLeft: 12 }]} placeholder={'Enter Token Amount'} value={(token)} keyboardType={'number-pad'} onChangeText={(text) => handleTokenAmountChange(text)} />
                </View>
                {
                    showTokenAmountArrow ?
                        <TouchableOpacity onPress={handleTokenAmountPress} style={[styles.addBtnColorRight, styles.sideBtnInput, { alignItems: 'flex-end' }]}>
                            <Ionicons name='ios-arrow-round-forward' size={40} color={AppStyles.colors.primaryColor} style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                        :
                        <View style={[styles.blackInputdate, { justifyContent: 'center' }]}>
                            <Text style={AppStyles.dateText}>{moment(lead.tokenPaymentTime).format('hh:mm A, MMMM DD')}</Text>
                        </View>
                }

            </View>


            <View style={[styles.mainBlackWrap]}>
                <View style={{ width: "80%" }}>
                    <Text style={[styles.blackInputText, { marginLeft: 12 }]}>COMMISSION PAYMENT</Text>
                    <TextInput style={[styles.blackInput, { marginLeft: 12 }]} keyboardType={'number-pad'} value={(commissionPayment)} onChangeText={(text) => handleCommissionAmountChange(text)} />
                </View>
                {
                    showCommissionAmountArrow &&
                    <TouchableOpacity onPress={handleCommissionAmountPress} style={[styles.addBtnColorRight, styles.sideBtnInput, { alignItems: 'flex-end' }]} >
                        <Ionicons name='ios-arrow-round-forward' size={40} color={AppStyles.colors.primaryColor} style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                }

            </View>
        </View >
    )
}

export default RentPaymentView
