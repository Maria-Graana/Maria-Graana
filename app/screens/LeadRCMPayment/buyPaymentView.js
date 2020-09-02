
import React from 'react'
import { View, TextInput } from 'react-native'
import moment from 'moment';
import StaticData from '../../StaticData';
import InputField from '../../components/InputField'

class BuyPaymentView extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() { }
    render() {
        const {
            agreedAmount,
            token,
            commissionPayment,
            handleAgreedAmountChange,
            handleTokenAmountChange,
            handleCommissionAmountChange,
            showAgreedAmountArrow,
            showTokenAmountArrow,
            showCommissionAmountArrow,
            handleAgreedAmountPress,
            handleTokenAmountPress,
            handleCommissionAmountPress,
            lead,
            showAndHideStyling,
            showStylingState,
            tokenPriceFromat,
            tokenDateStatus,
            agreeAmountFromat,
            comissionDateStatus,
            comissionPriceFromat,
        } = this.props;
        const isLeadClosed = lead.status === StaticData.Constants.lead_closed_lost || lead.status === StaticData.Constants.lead_closed_won;
        return (
            <View>
                <InputField
                    label={'AGREED AMOUNT'}
                    placeholder={'Enter Agreed Amount'}
                    name={'agreeAmount'}
                    value={agreedAmount}
                    priceFormatVal={agreedAmount != null ? agreedAmount : ''}
                    keyboardType={'numeric'}
                    onChange={handleAgreedAmountChange}
                    paymentDone={handleAgreedAmountPress}
                    showStyling={showAndHideStyling}
                    showStylingState={showStylingState}
                    editPriceFormat={{ status: agreeAmountFromat, name: 'agreeAmount' }}
                    editable={!isLeadClosed}
                    showDate={false}
                />

                {/* <View style={[styles.mainBlackWrap]}>
                    <View style={{ width: "50%", justifyContent: "center" }}>
                        <Text style={[styles.blackInputText]}>AGREED AMOUNT</Text>
                        <TextInput style={[styles.blackInput]} editable={!isLeadClosed} placeholder={'Enter Agreed Amount'} value={agreedAmount} keyboardType={'number-pad'} onChangeText={(text) => handleAgreedAmountChange(text)} />
                    </View>
                    <Text style={[styles.dateText, { textAlign: 'right' }]}>{`${formatPrice(agreedAmount)} PKR`}</Text>
                    {
                        showAgreedAmountArrow &&
                        <TouchableOpacity onPress={handleAgreedAmountPress} style={[styles.addBtnColorRight, styles.sideBtnInput, { alignItems: 'center', justifyContent: "center" }]}>
                            <Ionicons style={{ alignSelf: 'flex-end', marginRight: 10 }} name='ios-arrow-round-forward' size={40} color={AppStyles.colors.primaryColor} />
                        </TouchableOpacity>
                    }

                </View> */}

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
                        <Text style={[styles.blackInputText]}>TOKEN</Text>
                        <TextInput style={[styles.blackInput]} editable={!isLeadClosed} placeholder={'Enter Token Amount'} value={(token)} keyboardType={'number-pad'} onChangeText={(text) => handleTokenAmountChange(text)} />
                    </View>
                    <Text style={[styles.dateText, { textAlign: 'right' }]}>{`${formatPrice(token)} PKR`}</Text>
                    {
                        showTokenAmountArrow ?
                            <TouchableOpacity onPress={handleTokenAmountPress} style={[styles.addBtnColorRight, styles.sideBtnInput, { alignItems: 'center' }]}>
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
                        <Text style={[styles.blackInputText]}>COMMISSION PAYMENT</Text>
                        <TextInput style={[styles.blackInput]} editable={!isLeadClosed} keyboardType={'number-pad'} value={(commissionPayment)} onChangeText={(text) => handleCommissionAmountChange(text)} />
                    </View>
                    <Text style={[styles.dateText, { textAlign: 'right' }]}>{`${formatPrice(commissionPayment)} PKR`}</Text>
                    {
                        showCommissionAmountArrow ?
                            <TouchableOpacity onPress={handleCommissionAmountPress} style={[styles.addBtnColorRight, styles.sideBtnInput, { alignItems: 'center' }]} >
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
}



export default BuyPaymentView
