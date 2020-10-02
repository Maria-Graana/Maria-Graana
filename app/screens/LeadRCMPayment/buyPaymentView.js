
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
                
                {/* <InputField
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
                /> */}

            </View >
        )
    }
}



export default BuyPaymentView
