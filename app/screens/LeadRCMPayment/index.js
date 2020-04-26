import * as React from 'react';
import styles from './styles'
import { View, Text, FlatList, Image, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import MatchTile from '../../components/MatchTile/index';
import AgentTile from '../../components/AgentTile/index';
import { Button } from 'native-base';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Loader from '../../components/loader';
import BuyPaymentView from './buyPaymentView';
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import _ from 'underscore';
import StaticData from '../../StaticData';
import { formatPrice } from '../../PriceFormate'
import { setlead } from '../../actions/lead';
import RentPaymentView from './rentPaymentView';
import { FAB } from 'react-native-paper';
import { ProgressBar, Colors } from 'react-native-paper';

class LeadRCMPayment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            isVisible: false,
            open: false,
            allProperties: [],
            selectedProperty: {},
            checkReasonValidation: false,
            selectedReason: '',
            reasons: [],
            agreedAmount: null,
            token: null,
            commissionPayment: null,
            showAgreedAmountArrow: false,
            showTokenAmountArrow: false,
            showCommissionAmountArrow: false,
            lead: props.lead,
            pickerData: StaticData.oneToTwelve,
            showMonthlyRentArrow: false,
            formData: {
                contract_months: null,
                monthlyRent: null,
                security: null,
                advance: null
            },
            progressValue: 0
        }
    }

    componentDidMount = () => {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getSelectedProperty(this.state.lead)
        })
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    getSelectedProperty = (lead) => {
        const { dispatch } = this.props;
        const { rcmProgressBar } = StaticData
        let properties = [];
        this.setState({ loading: true });
        axios.get(`/api/leads/byId?id=${lead.id}`).then(response => {
            dispatch(setlead(response.data));
            this.setState({ progressValue: rcmProgressBar[lead.status] })
            if (response.data.shortlist_id === null) {
                this.getShortlistedProperties(lead)
            }
            else {
                if (response.data.paymentProperty) {
                    properties.push(response.data.paymentProperty);
                }
                else {
                    alert('Something went wrong...')
                }
            }
            this.setState({
                loading: false,
                allProperties: properties.length > 0 && properties,
                selectedReason: '',
                checkReasonValidation: '',
                agreedAmount: lead.payment ? String(lead.payment) : '',
                token: lead.token ? String(lead.token) : '',
                commissionPayment: lead.commissionPayment ? String(lead.commissionPayment) : '',
                formData: {
                    contract_months: lead.contract_months ? String(lead.contract_months) : '',
                    security: lead.security ? String(lead.security) : '',
                    advance: lead.advance ? String(lead.advance) : '',
                    monthlyRent: lead.monthlyRent ? String(tmonthlyRent) : ''
                }
            }, () => {
                this.checkCommissionPayment(response.data);
            })
        }).catch(error => {
            console.log(error)
            this.setState({
                loading: false,
            })
        })

    }

    getShortlistedProperties = (lead) => {
        axios.get(`/api/leads/${lead.id}/shortlist`)
            .then((res) => {
                //console.log('response=>', res.data.rows);
                this.setState({
                    allProperties: res.data.rows,
                    loading: false,
                    selectedReason: '',
                    checkReasonValidation: '',
                }, () => {
                    this.checkCommissionPayment(lead);
                })
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    loading: false,
                })
            })
    }

    checkCommissionPayment = (lead) => {
        if (lead.commissionPayment !== null) {
            this.setState({ reasons: StaticData.leadCloseReasonsWithPayment })
        }
        else {
            this.setState({ reasons: StaticData.leadCloseReasons })
        }
    }

    displayChecks = () => { }

    addProperty = () => { }

    ownProperty = (property) => {
        const { user } = this.props
        const { organization } = this.state
        if (property.assigned_to_armsuser_id) {
            return user.id === property.assigned_to_armsuser_id
        }
        else {
            return false
        }
    }

    handleReasonChange = (value) => {
        this.setState({ selectedReason: value });
    }


    closeModal = () => {
        this.setState({ isVisible: false })
    }

    showLeadPaymentModal = () => {
        this.setState({ isVisible: true })
    }


    selectForPayment = (item) => {
        const { allProperties, lead } = this.state;
        const selectedProperty = allProperties.filter(property => property.id === item.id);
        let payload = Object.create({});
        payload.shortlist_id = selectedProperty[0].id;
        axios.patch(`/api/leads/?id=${lead.id}`, payload).then(response => {
            this.setState({ lead: response.data }, () => {
                this.getSelectedProperty(lead);
            });
        }).catch(error => {
            console.log(error);
        })
    }

    selectDifferentProperty = () => {
        const { lead } = this.state;
        axios.patch(`/api/leads/unselectProperty?leadId=${lead.id}`).then(response => {
            this.props.dispatch(setlead(response.data));
            this.setState({ lead: response.data }, () => {
                this.getSelectedProperty(response.data);

            });
          
        }).catch(error => {
            console.log('errorr', error);
        })
    }

    
    showConfirmationDialog(item) {
        Alert.alert('WARNING', 'Selecting a different property will remove all payments, do you want to continue?', [
            { text: 'No', style: 'cancel' },
            { text: 'Yes', onPress: () => this.selectDifferentProperty() },
        ],
            { cancelable: false })
    }

    renderSelectPaymentView = (item) => {
        const { lead } = this.state;
        return (
            <TouchableOpacity key={item.id.toString()} onPress={lead.shortlist_id === null ? () => this.selectForPayment(item) : () => this.showConfirmationDialog()} style={styles.viewButtonStyle} activeOpacity={0.7}>
                <Text style={styles.buttonTextStyle}>
                    {
                        lead.shortlist_id === null ?
                            'SELECT FOR PAYMENT'
                            :
                            'SELECT A DIFFERENT PROPERTY'
                    }

                </Text>
            </TouchableOpacity>
        );
    }

    handleAgreedAmountChange = (agreedAmount) => {
        if (agreedAmount === '') {
            this.setState({ showAgreedAmountArrow: false, agreedAmount: '' });
        }
        else {
            this.setState({ agreedAmount, showAgreedAmountArrow: true });
        }
    }

    handleTokenAmountChange = (token) => {
        if (token === '') {
            this.setState({ showTokenAmountArrow: false, token: '' });
        }
        else {
            this.setState({ token, showTokenAmountArrow: true });

        }
    }

    handleCommissionAmountChange = (commissionPayment) => {
        if (commissionPayment === '') {
            this.setState({ showCommissionAmountArrow: false, commissionPayment: '' });
        }
        else {
            this.setState({ commissionPayment, showCommissionAmountArrow: true })
        }
    }

    convertToInteger = (val) => {
        if (val === '') {
            return null;
        }
        else if (typeof (val) === 'string' && val != '') {
            return parseInt(val);
        }
    }

    handleTokenAmountPress = () => {
        const { token } = this.state;
        const { lead } = this.state
        const { allProperties } = this.state;
        const selectedProperty = allProperties[0];
        let payload = Object.create({});
        payload.shortlist_id = selectedProperty.id;
        payload.token = this.convertToInteger(token);
        axios.patch(`/api/leads/?id=${lead.id}`, payload).then(response => {
            this.props.dispatch(setlead(response.data));
            this.setState({ showTokenAmountArrow: false, lead: response.data })
        }).catch(error => {
            console.log(error);
        })
    }

    handleAgreedAmountPress = () => {
        const { agreedAmount } = this.state;
        const { lead } = this.state
        const { allProperties } = this.state;
        const selectedProperty = allProperties[0];
        let payload = Object.create({});
        payload.shortlist_id = selectedProperty.id;
        payload.payment = this.convertToInteger(agreedAmount);
        axios.patch(`/api/leads/?id=${lead.id}`, payload).then(response => {
            this.props.dispatch(setlead(response.data));
            this.setState({ showAgreedAmountArrow: false, lead: response.data })
        }).catch(error => {
            console.log(error);
        })

    }

    handleCommissionAmountPress = () => {
        const { commissionPayment } = this.state;
        const { lead } = this.state
        const { allProperties } = this.state;
        const selectedProperty = allProperties[0];
        let payload = Object.create({});
        payload.shortlist_id = selectedProperty.id;
        payload.commissionPayment = this.convertToInteger(commissionPayment);
        axios.patch(`/api/leads/?id=${lead.id}`, payload).then(response => {
            this.props.dispatch(setlead(response.data));
            this.setState({ showCommissionAmountArrow: false, lead: response.data })
        }).catch(error => {
            console.log(error);
        })
    }

    handleMonthlyRentPress = () => {
        const { formData } = this.state;
        const { monthlyRent } = formData;
        const { lead } = this.state
        const { allProperties } = this.state;
        const selectedProperty = allProperties[0];
        let payload = Object.create({});
        payload.shortlist_id = selectedProperty.id;
        payload.monthlyRent = this.convertToInteger(monthlyRent);
        axios.patch(`/api/leads/?id=${lead.id}`, payload).then(response => {
            this.props.dispatch(setlead(response.data));
            this.setState({ showMonthlyRentArrow: false, lead: response.data })
        }).catch(error => {
            console.log(error);
        })
    }

    onHandleCloseLead = (reason) => {
        const { navigation } = this.props
        const { lead } = this.state;
        let payload = Object.create({});
        payload.reasons = reason;

        axios.patch(`/api/leads/?id=${lead.id}`, payload).then(response => {
            this.setState({ isVisible: false }, () => {
                navigation.navigate('Lead');
            });
        }).catch(error => {
            console.log(error);
        })
    }

    handleForm = (value, name) => {
        const { formData } = this.state;
        formData[name] = value
        this.setState({ formData }, () => {
            // console.log('formData', formData)
        })
        if (formData.monthlyRent !== '' && name === 'monthlyRent') { this.setState({ showMonthlyRentArrow: true }) }
        if (formData.contract_months !== '' && name === 'contract_months') { this.updateRentLead(formData.contract_months, name) }
        if (formData.advance !== '' && name === 'advance') { this.updateRentLead(formData.advance, name) }
        if (formData.security !== '' && name === 'security') { this.updateRentLead(formData.security, name) }
    }

    updateRentLead = (value, key) => {
        const { lead } = this.state
        const { allProperties } = this.state;
        const selectedProperty = allProperties[0];
        let payload = Object.create({});
        payload.shortlist_id = selectedProperty.id;
        switch (key) {
            case 'contract_months':
                payload.contract_months = this.convertToInteger(value);
                break;
            case 'advance':
                payload.advance = this.convertToInteger(value);
                break;
            case 'security':
                payload.security = this.convertToInteger(value);
                break;
        }

        axios.patch(`/api/leads/?id=${lead.id}`, payload).then(response => {
            this.props.dispatch(setlead(response.data));
            this.setState({ lead: response.data });
        }).catch(error => {
            console.log(error);
        })
    }


    goToDiaryForm = () => {
        const { navigation, user } = this.props
        const { lead } = this.state;
        navigation.navigate('AddDiary', {
            update: false,
            rcmLeadId: lead.id,
            agentId: user.id
        });
    }

    goToAttachments = () => {
        const { navigation } = this.props
        const { lead } = this.state;
        navigation.navigate('Attachments', { rcmLeadId: lead.id });
    }

    goToComments = () => {
        const { navigation } = this.props
        const { lead } = this.state;
        navigation.navigate('Comments', { rcmLeadId: lead.id });
    }


    render() {
        const { loading,
            allProperties,
            user,
            isVisible,
            checkReasonValidation,
            selectedReason,
            reasons,
            open,
            agreedAmount,
            showAgreedAmountArrow,
            showTokenAmountArrow,
            commissionPayment,
            progressValue,
            token,
            lead,
            pickerData,
            formData,
            showMonthlyRentArrow,
            showCommissionAmountArrow } = this.state;


        return (
            !loading ?
                <KeyboardAvoidingView style={[AppStyles.container, { backgroundColor: AppStyles.colors.backgroundColor, paddingLeft: 0, paddingRight: 0, marginBottom: 30 }]} behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={120}>
                    <ProgressBar style={{backgroundColor: "ffffff"}} progress={progressValue} color={'#0277FD'} />
                    <LeadRCMPaymentPopup
                        reasons={reasons}
                        selectedReason={selectedReason}
                        changeReason={this.handleReasonChange}
                        checkValidation={checkReasonValidation}
                        isVisible={isVisible}
                        closeModal={() => this.closeModal()}
                        onPress={this.onHandleCloseLead}
                    />
                    <View style={{ flex: 1 }}>
                        {
                            allProperties.length ?
                                <FlatList
                                    data={allProperties}
                                    renderItem={(item, index) => (
                                        <View style={{ marginVertical: 3, marginHorizontal: 15 }}>
                                            {
                                                this.ownProperty(item.item) ?
                                                    <MatchTile
                                                        data={item.item}
                                                        user={user}
                                                        displayChecks={this.displayChecks}
                                                        showCheckBoxes={false}
                                                        addProperty={this.addProperty}
                                                    />
                                                    :
                                                    <AgentTile
                                                        data={item.item}
                                                        user={user}
                                                        displayChecks={this.displayChecks}
                                                        showCheckBoxes={false}
                                                        addProperty={this.addProperty}
                                                    />
                                            }
                                            <View>
                                                {
                                                    this.renderSelectPaymentView(item.item)
                                                }
                                            </View>
                                        </View>
                                    )}
                                    ListFooterComponent={
                                        <View style={{ marginHorizontal: 15 }}>
                                            {
                                                lead.shortlist_id !== null ?
                                                    lead.purpose === 'sale' ?
                                                        <BuyPaymentView
                                                            lead={lead}
                                                            agreedAmount={agreedAmount}
                                                            showAgreedAmountArrow={showAgreedAmountArrow}
                                                            handleAgreedAmountPress={this.handleAgreedAmountPress}
                                                            handleAgreedAmountChange={this.handleAgreedAmountChange}

                                                            token={token}
                                                            handleTokenAmountChange={this.handleTokenAmountChange}
                                                            showTokenAmountArrow={showTokenAmountArrow}
                                                            handleTokenAmountPress={this.handleTokenAmountPress}

                                                            commissionPayment={commissionPayment}
                                                            handleCommissionAmountChange={this.handleCommissionAmountChange}
                                                            showCommissionAmountArrow={showCommissionAmountArrow}
                                                            handleCommissionAmountPress={this.handleCommissionAmountPress}

                                                        />
                                                        :
                                                        <RentPaymentView
                                                            lead={lead}
                                                            pickerData={pickerData}
                                                            handleForm={this.handleForm}
                                                            formData={formData}
                                                            showMonthlyRentArrow={showMonthlyRentArrow}
                                                            handleMonthlyRentPress={this.handleMonthlyRentPress}
                                                            token={token}
                                                            handleTokenAmountChange={this.handleTokenAmountChange}
                                                            showTokenAmountArrow={showTokenAmountArrow}
                                                            handleTokenAmountPress={this.handleTokenAmountPress}
                                                            commissionPayment={commissionPayment}
                                                            handleCommissionAmountChange={this.handleCommissionAmountChange}
                                                            showCommissionAmountArrow={showCommissionAmountArrow}
                                                            handleCommissionAmountPress={this.handleCommissionAmountPress}
                                                        />
                                                    : null
                                            }
                                            <View style={{ marginVertical: 10 }}>
                                                <Button onPress={this.showLeadPaymentModal}
                                                    style={[AppStyles.formBtn]}>
                                                    <Text style={AppStyles.btnText}>CLOSE LEAD</Text>
                                                </Button>
                                            </View>
                                        </View>
                                    }
                                    keyExtractor={(item, index) => item.id.toString()}
                                />

                                :
                                <Image source={require('../../../assets/images/no-result2.png')} resizeMode={'center'} style={{ flex: 1, alignSelf: 'center', width: 300, height: 300 }} />
                        }

                        <FAB.Group
                            open={open}
                            icon="plus"
                            fabStyle={{ backgroundColor: AppStyles.colors.primaryColor }}
                            color={AppStyles.bgcWhite.backgroundColor}
                            actions={[
                                { icon: 'plus', label: 'Comment', color: AppStyles.colors.primaryColor, onPress: () => this.goToComments() },
                                { icon: 'plus', label: 'Attachment', color: AppStyles.colors.primaryColor, onPress: () => this.goToAttachments() },
                                { icon: 'plus', label: 'Diary Task ', color: AppStyles.colors.primaryColor, onPress: () => this.goToDiaryForm() },
                            ]}
                            onStateChange={({ open }) => this.setState({ open })}
                        />

                    </View>

                </KeyboardAvoidingView>

                :
                <Loader loading={loading} />
        )
    }

}

mapStateToProps = (store) => {
    return {
        user: store.user.user,
        lead: store.lead.lead
    }
}

export default connect(mapStateToProps)(LeadRCMPayment)