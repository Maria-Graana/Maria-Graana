
import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import AppStyles from '../../AppStyles'
import styles from './styles'
import ErrorMessage from '../../components/ErrorMessage/index'
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../../PriceFormate'
import checkImg from '../../../assets/img/check.png'
import { Button, Icon } from 'native-base';

const PaymentView = (props) => {
    const { formData, checkValidation, handleForm,onPress } = props;
    return (
        <View>

            <View style={[styles.mainBlackWrap]}>
                <View style={{ width: "60%" }}>
                    <Text style={[styles.blackInputText]}>TOKEN</Text>
                    <TextInput style={[styles.blackInput]} placeholder={'ADD TOKEN'} onChangeText={(text) => { handleForm(text, 'token') }} />
                    {
                        checkValidation === true && formData.token === '' && <ErrorMessage errorMessage={'Required'} />
                    }
                </View>
                <Text style={styles.dateText}>{formatPrice(formData.token)}</Text>
                <TouchableOpacity style={[styles.addBtnColorRight, styles.sideBtnInput]} onPress={() => onPress('token')}>
                    <Image source={checkImg} style={[styles.addImg]} />
                </TouchableOpacity>
            </View>


            <View style={[styles.mainBlackWrap]}>
                <View style={{ width: "60%" }}>
                    <Text style={[styles.blackInputText]}>PAYMENT</Text>
                    <TextInput style={[styles.blackInput]} placeholder={'ADD PAYMENT'} onChangeText={(text) => { handleForm(text, 'payment') }} />
                    {
                        checkValidation === true && formData.payment === '' && <ErrorMessage errorMessage={'Required'} />
                    }
                </View>
                <Text style={styles.dateText}>{formatPrice(formData.payment)}</Text>
                <TouchableOpacity style={[styles.addBtnColorRight, styles.sideBtnInput]} onPress={() => onPress('payment')}>
                    <Image source={checkImg} style={[styles.addImg]} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[AppStyles.flexDirectionRow, AppStyles.formBtn, { marginVertical: 10, alignItems: 'center', backgroundColor: '#fff' }]}
                onPress={() => console.log('Add payment')}>
                <Ionicons name="md-add" color={AppStyles.colors.textColor} size={20} />
                <Text style={[AppStyles.btnText, { color: AppStyles.colors.textColor, fontSize: AppStyles.fontSize.medium, fontFamily: AppStyles.fonts.semiBoldFont, marginLeft: 10 }]}>ADD ANOTHER PAYMENT</Text>
            </TouchableOpacity >

            <View style={[styles.mainBlackWrap]}>
                <View style={{ width: "60%" }}>
                    <Text style={[styles.blackInputText]}>COMMISSION PAYMENT</Text>
                    <TextInput style={[styles.blackInput]} onChangeText={(text) => { handleForm(text, 'commissionPayment') }} />
                    {
                        checkValidation === true && formData.commissionPayment === '' && <ErrorMessage errorMessage={'Required'} />
                    }
                </View>
                <Text style={styles.dateText}>{formatPrice(formData.commissionPayment)}</Text>
                <TouchableOpacity style={[styles.addBtnColorRight, styles.sideBtnInput]} onPress={() => onPress('commissionPayment')}>
                    <Image source={checkImg} style={[styles.addImg]} />
                </TouchableOpacity>
            </View>
        </View >
    )
}

export default PaymentView
