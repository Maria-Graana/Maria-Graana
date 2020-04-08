
import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import AppStyles from '../../AppStyles'
import styles from './styles'
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../../PriceFormate'
import moment from 'moment';

const BuyPaymentView = (props) => {
    const { agreedAmount,token,commissionPayment, handleAgreedAmountChange, handleTokenAmountChange, handleCommissionAmountChange, showAgreedAmountArrow, showTokenAmountArrow, showCommissionAmountArrow, handleAgreedAmountPress, handleTokenAmountPress, handleCommissionAmountPress, lead } = props;
    return (
        <View>

            <View style={[styles.mainBlackWrap]}>
                <View style={{ width: "80%", justifyContent: "center" }}>
                    <Text style={[styles.blackInputText]}>AGREED AMOUNT</Text>
                    <TextInput style={[styles.blackInput]} placeholder={'Enter Agreed Amount'} value={agreedAmount}  keyboardType={'number-pad'} onChangeText={(text) => handleAgreedAmountChange(text)} />
                </View>
                {/* <Text style={styles.dateText}>{formatPrice(agreedAmount)}</Text> */}
                {
                    showAgreedAmountArrow &&
                    <TouchableOpacity onPress={handleAgreedAmountPress} style={[styles.addBtnColorRight, styles.sideBtnInput, { alignItems: 'center', justifyContent: "center" }]}>
                        <Ionicons name='ios-arrow-round-forward' size={40} color={AppStyles.colors.primaryColor} />
                    </TouchableOpacity>
                }

            </View>


            <View style={[styles.mainBlackWrap]}>
                <View style={{ width: "80%" }}>
                    <Text style={[styles.blackInputText]}>TOKEN</Text>
                    <TextInput style={[styles.blackInput]} placeholder={'Enter Token Amount'} value={(token)}  keyboardType={'number-pad'} onChangeText={(text) => handleTokenAmountChange(text)} />
                </View>
                {/* <Text style={styles.dateText}>{formatPrice(token)}</Text> */}
                {
                    showTokenAmountArrow ?
                    <TouchableOpacity onPress={handleTokenAmountPress} style={[styles.addBtnColorRight, styles.sideBtnInput, { alignItems: 'center' }]}>
                        <Ionicons name='ios-arrow-round-forward' size={40} color={AppStyles.colors.primaryColor} />
                    </TouchableOpacity>
                    :
                    <View style={[styles.blackInputdate,{justifyContent:'center'}]}>
                    <Text style={AppStyles.dateText}>{lead.tokenPaymentTime && moment(lead.tokenPaymentTime).format('hh:mm A, MMMM DD')}</Text>
                  </View>
                }

            </View>


            <View style={[styles.mainBlackWrap]}>
                <View style={{ width: "80%" }}>
                    <Text style={[styles.blackInputText]}>COMMISSION PAYMENT</Text>
                    <TextInput style={[styles.blackInput]} keyboardType={'number-pad'} value={(commissionPayment)} onChangeText={(text) => handleCommissionAmountChange(text)} />
                </View>
                {/* <Text style={styles.dateText}>{formatPrice(commissionPayment)}</Text> */}
                {
                    showCommissionAmountArrow &&
                    <TouchableOpacity  onPress={handleCommissionAmountPress} style={[styles.addBtnColorRight, styles.sideBtnInput, { alignItems: 'center' }]} >
                        <Ionicons name='ios-arrow-round-forward' size={40} color={AppStyles.colors.primaryColor} />
                    </TouchableOpacity>
                }

            </View>
        </View >
    )
}

export default BuyPaymentView
