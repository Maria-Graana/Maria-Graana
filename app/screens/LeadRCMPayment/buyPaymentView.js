
import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import AppStyles from '../../AppStyles'
import styles from './styles'
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../../PriceFormate'
import moment from 'moment';

const BuyPaymentView = (props) => {
    const { agreedAmount, token, commissionPayment, handleAgreedAmountChange, handleTokenAmountChange, handleCommissionAmountChange, showAgreedAmountArrow, showTokenAmountArrow, showCommissionAmountArrow, handleAgreedAmountPress, handleTokenAmountPress, handleCommissionAmountPress, lead } = props;
    return (
        <View>

            <View style={[styles.mainBlackWrap]}>
                <View style={{ width: "50%", justifyContent: "center" }}>
                    <Text style={[styles.blackInputText]}>AGREED AMOUNT</Text>
                    <TextInput style={[styles.blackInput]} placeholder={'Enter Agreed Amount'} value={agreedAmount} keyboardType={'number-pad'} onChangeText={(text) => handleAgreedAmountChange(text)} />
                </View>
                <Text style={[styles.dateText, { textAlign: 'right' }]}>{`${formatPrice(agreedAmount)} PKR`}</Text>
                {
                    showAgreedAmountArrow &&
                    <TouchableOpacity onPress={handleAgreedAmountPress} style={[styles.addBtnColorRight, styles.sideBtnInput, { alignItems: 'center', justifyContent: "center" }]}>
                        <Ionicons style={{alignSelf:'flex-end',marginRight:10}} name='ios-arrow-round-forward' size={40} color={AppStyles.colors.primaryColor} />
                    </TouchableOpacity>
                }

            </View>


            <View style={[styles.mainBlackWrap]}>
                <View style={{ width: "50%" }}>
                    <Text style={[styles.blackInputText]}>TOKEN</Text>
                    <TextInput style={[styles.blackInput]} placeholder={'Enter Token Amount'} value={(token)} keyboardType={'number-pad'} onChangeText={(text) => handleTokenAmountChange(text)} />
                </View>
                <Text style={[styles.dateText, { textAlign: 'right' }]}>{`${formatPrice(token)} PKR`}</Text>
                {
                    showTokenAmountArrow ?
                        <TouchableOpacity onPress={handleTokenAmountPress} style={[styles.addBtnColorRight, styles.sideBtnInput, { alignItems: 'center' }]}>
                            <Ionicons style={{alignSelf:'flex-end',marginRight:10}} name='ios-arrow-round-forward' size={40} color={AppStyles.colors.primaryColor} />
                        </TouchableOpacity>
                        :
                        <View style={[styles.blackInputdate,{justifyContent:'center'}]}>
                            <Text style={{
                                letterSpacing: 0.5,
                                minHeight:30,
                                marginLeft:10,
                                fontSize: 10,
                                alignSelf:'flex-end',
                                marginRight:10
                            }}>{lead.tokenPaymentTime && moment(lead.tokenPaymentTime).format('hh:mm A, MMMM DD')}</Text>
                        </View>
                }

            </View>


            <View style={[styles.mainBlackWrap]}>
                <View style={{ width: "50%" }}>
                    <Text style={[styles.blackInputText]}>COMMISSION PAYMENT</Text>
                    <TextInput style={[styles.blackInput]} keyboardType={'number-pad'} value={(commissionPayment)} onChangeText={(text) => handleCommissionAmountChange(text)} />
                </View>
                <Text style={[styles.dateText, { textAlign: 'right' }]}>{`${formatPrice(commissionPayment)} PKR`}</Text>
                {
                    showCommissionAmountArrow &&
                    <TouchableOpacity onPress={handleCommissionAmountPress} style={[styles.addBtnColorRight, styles.sideBtnInput, { alignItems: 'center' }]} >
                        <Ionicons style={{alignSelf:'flex-end',marginRight:10}} name='ios-arrow-round-forward' size={40} color={AppStyles.colors.primaryColor} />
                    </TouchableOpacity>
                }

            </View>
        </View >
    )
}

export default BuyPaymentView
