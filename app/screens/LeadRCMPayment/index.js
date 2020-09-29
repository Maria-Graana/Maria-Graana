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
import helper from '../../helper';
import { formatPrice } from '../../PriceFormate'
import { setlead } from '../../actions/lead';
import CMBottomNav from '../../components/CMBottomNav'
import RentPaymentView from './rentPaymentView';
import { ProgressBar } from 'react-native-paper';
import HistoryModal from '../../components/HistoryModal/index';

class LeadRCMPayment extends React.Component {
    constructor(props) {
        super(props)
        const { user, lead } = this.props;
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
            progressValue: 0,
            // for the lead close dialog
            checkReasonValidation: false,
            selectedReason: '',
            reasons: [],
            closedLeadEdit: helper.checkAssignedSharedStatus(user, lead),
            showStyling: '',
            tokenDateStatus: false,
            tokenPriceFromat: true,
            agreeAmountFromat: true,
            comissionDateStatus: false,
            comissionPriceFromat: true,
            monthlyFormatStatus: true,
            organization: 'arms',
            callModal: false,
            meetings: []
        }
    }

    componentDidMount = () => {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getCallHistory()
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
        this.setState({ loading: true }, () => {
            axios.get(`/api/leads/byId?id=${lead.id}`).then(response => {
                dispatch(setlead(response.data));
                this.setState({ progressValue: rcmProgressBar[lead.status] })
                if (response.data.shortlist_id === null) {
                    this.getShortlistedProperties(lead)
                    return;
                }
                else {
                    if (response.data.paymentProperty) {
                        properties.push(response.data.paymentProperty);
                        properties = helper.propertyCheck(properties)
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
                                monthlyRent: lead.monthlyRent ? String(lead.monthlyRent) : ''
                            }
                        }, () => {
                            if (lead.token != null) {
                                this.dateStatusChange('token', true)
                                this.formatStatusChange('token', true)
                            }
                            if (lead.commissionPayment != null) {
                                this.dateStatusChange('commissionPayment', true)
                                this.formatStatusChange('commissionPayment', true)
                            }
                            if (lead.monthlyRent != null) {
                                this.formatStatusChange('monthlyRent', true)
                            }
                            this.checkCommissionPayment(response.data);
                        })
                    }
                    else {
                        alert('Something went wrong...')
                    }
                }

            }).catch(error => {
                console.log(error)
                this.setState({
                    loading: false,
                })
            })
        });


    }

    getShortlistedProperties = (lead) => {
        let matches = []
        axios.get(`/api/leads/${lead.id}/shortlist`)
            .then((response) => {
                matches = helper.propertyCheck(response.data.rows)
                this.setState({
                    allProperties: matches,
                    loading: false,
                    selectedReason: '',
                    checkReasonValidation: '',
                    agreedAmount: lead.payment ? String(lead.payment) : '',
                    token: lead.token ? String(lead.token) : '',
                    commissionPayment: lead.commissionPayment ? String(lead.commissionPayment) : '',
                    formData: {
                        contract_months: lead.contract_months ? String(lead.contract_months) : '',
                        security: lead.security ? String(lead.security) : '',
                        advance: lead.advance ? String(lead.advance) : '',
                        monthlyRent: lead.monthlyRent ? String(lead.monthlyRent) : ''
                    }
                }, () => {
                    this.checkCommissionPayment(response.data);
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
        if (property.arms_id) {
            if (property.assigned_to_armsuser_id) {
                return user.id === property.assigned_to_armsuser_id
            }
            else {
                return false
            }
        } else {
            return true
        }
    }

    handleReasonChange = (value) => {
        this.setState({ selectedReason: value });
    }

    closedLead = () => {
        helper.leadClosedToast()
    }

    closeModal = () => {
        this.setState({ isVisible: false })
    }

    showLeadPaymentModal = () => {
        const { lead } = this.state;
        var commissionPayment = lead.commissionPayment
        if (commissionPayment !== null) {
            this.setState({ reasons: StaticData.leadCloseReasonsWithPayment, isVisible: true, checkReasonValidation: '' })
        }
        else {
            this.setState({ reasons: StaticData.leadCloseReasons, isVisible: true, checkReasonValidation: '' })
        }
    }


    selectForPayment = (item) => {
        const { allProperties, lead } = this.state;
        const selectedProperty = allProperties.filter(property => property.id === item.id);
        let payload = Object.create({});
        payload.shortlist_id = selectedProperty[0].id;
        var leadId = []
        leadId.push(lead.id)
        axios.patch(`/api/leads`, payload, { params: { id: leadId } }).then(response => {
            if (response.data) {
                this.setState({ lead: response.data }, () => {
                    this.getSelectedProperty(response.data);
                });
            }
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

    showConfirmationDialog = (item) => {
        const { lead } = this.state;
        const { user } = this.props;
        const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(user, lead);
        if (leadAssignedSharedStatus) {
            Alert.alert('WARNING', 'Selecting a different property will remove all payments, do you want to continue?', [
                { text: 'Yes', onPress: () => this.selectDifferentProperty() },
                { text: 'No', style: 'cancel' },
            ],
                { cancelable: false })
        }
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
        if (agreedAmount === '') { this.setState({ agreedAmount: '' }) }
        else if (agreedAmount !== '') { this.setState({ agreedAmount, showAgreedAmountArrow: true }) }
    }

    handleTokenAmountChange = (token) => {
        if (token === '') { this.setState({ token: '' }) }
        else if (token !== '') { this.setState({ token, showTokenAmountArrow: true }) }
    }

    handleCommissionAmountChange = (commissionPayment) => {
        if (commissionPayment === '') { this.setState({ commissionPayment: '' }) }
        if (commissionPayment !== '') { this.setState({ commissionPayment, showCommissionAmountArrow: true }) }
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
        let payload = Object.create({});
        payload.token = this.convertToInteger(token);
        var leadId = []
        leadId.push(lead.id)
        axios.patch(`/api/leads`, payload, { params: { id: leadId } }).then(response => {
            this.props.dispatch(setlead(response.data));
            this.setState({
                showTokenAmountArrow: false,
                lead: response.data,
                showStyling: '',
                tokenDateStatus: true,
            })
            this.formatStatusChange('token', true)
        }).catch(error => {
            console.log(error);
        })
    }

    handleAgreedAmountPress = () => {
        const { agreedAmount } = this.state;
        const { lead } = this.state
        let payload = Object.create({});
        payload.payment = this.convertToInteger(agreedAmount);
        var leadId = []
        leadId.push(lead.id)
        axios.patch(`/api/leads`, payload, { params: { id: leadId } }).then(response => {
            this.props.dispatch(setlead(response.data));
            this.setState({
                showAgreedAmountArrow: false,
                lead: response.data,
                showStyling: '',
                agreeAmountFromat: true,
            })
            this.formatStatusChange('agreeAmount', true)
        }).catch(error => {
            console.log(error);
        })

    }

    handleCommissionAmountPress = () => {
        const { commissionPayment } = this.state;
        const { lead } = this.state
        let payload = Object.create({});
        payload.commissionPayment = this.convertToInteger(commissionPayment);
        var leadId = []
        leadId.push(lead.id)
        axios.patch(`/api/leads`, payload, { params: { id: leadId } }).then(response => {
            this.props.dispatch(setlead(response.data));
            this.setState({
                showCommissionAmountArrow: false,
                lead: response.data,
                showStyling: '',
                comissionDateStatus: true,
            }, () => this.checkCommissionPayment(response.data))
            this.formatStatusChange('commissionPayment', true)
        }).catch(error => {
            console.log(error);
        })
    }

    handleMonthlyRentPress = () => {
        const { formData } = this.state;
        const { monthlyRent } = formData;
        const { lead } = this.state
        let payload = Object.create({});
        payload.monthlyRent = this.convertToInteger(monthlyRent);
        var leadId = []
        leadId.push(lead.id)
        axios.patch(`/api/leads`, payload, { params: { id: leadId } }).then(response => {
            this.props.dispatch(setlead(response.data));
            this.setState({
                showMonthlyRentArrow: false,
                lead: response.data,
                showStyling: '',
            })
            this.formatStatusChange('monthlyRent', true)
        }).catch(error => {
            console.log(error);
        })
    }

    onHandleCloseLead = () => {
        const { navigation } = this.props
        const { lead, selectedReason } = this.state;
        let payload = Object.create({});
        payload.reasons = selectedReason;
        if (selectedReason !== '') {
            var leadId = []
            leadId.push(lead.id)
            axios.patch(`/api/leads`, payload, { params: { id: leadId } }).then(response => {
                this.setState({ isVisible: false }, () => {
                    navigation.navigate('Leads');
                });
            }).catch(error => {
                console.log(error);
            })
        }
        else {
            alert('Please select a reason for lead closure!')
        }

    }

    handleForm = (value, name) => {
        const { formData } = this.state;
        formData[name] = value
        this.setState({ formData }, () => {
            // console.log('formData', formData)
        })
        if (formData.monthlyRent !== '' && name === 'monthlyRent') {
            this.setState({ showMonthlyRentArrow: true })
        }
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
        var leadId = []
        leadId.push(lead.id)
        axios.patch(`/api/leads`, payload, { params: { id: leadId } }).then(response => {
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
            agentId: user.id,
            addedBy: 'self'
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

    navigateToDetails = () => {
        this.props.navigation.navigate('LeadDetail', { lead: this.props.lead, purposeTab: 'sale' })
    }

    showAndHideStyling = (name, clear) => {
        const { dummyData, inputDateStatus, inputDateStatus2 } = this.state
        const newDummy = dummyData

        if (clear === true) {
            this.clearStateValue(name, clear)
        }

        if (name === 'token') {
            this.dateStatusChange(name, false)
            this.formatStatusChange(name, false)
        }

        if (name != 'token') {
            this.dateStatusChange('token', true)
            this.formatStatusChange('token', true)
        }

        if (name === 'agreeAmount') {
            this.formatStatusChange(name, false)
        }

        if (name != 'agreeAmount') {
            this.formatStatusChange('agreeAmount', true)
        }

        if (name === 'commissionPayment') {
            this.dateStatusChange('commissionPayment', false)
            this.formatStatusChange(name, false)
        }

        if (name != 'commissionPayment') {
            this.dateStatusChange('commissionPayment', true)
            this.formatStatusChange('commissionPayment', true)
        }

        if (name === 'monthlyRent') {
            this.formatStatusChange(name, false)
        }
        if (name != 'monthlyRent') {
            this.formatStatusChange('monthlyRent', true)
        }

        this.setState({
            showStyling: clear === false ? name : '',
            showDate: false,
        })
    }

    formatStatusChange = (name, status, arrayName) => {
        const { } = this.state
        if (name === 'token') {
            this.setState({ tokenPriceFromat: status })
        }
        if (name === 'agreeAmount') {
            this.setState({ agreeAmountFromat: status })
        }
        if (name === 'commissionPayment') {
            this.setState({ comissionPriceFromat: status })
        }
        if (name === 'monthlyRent') {
            this.setState({ monthlyFormatStatus: status })
        }
    }

    dateStatusChange = (name, status, arrayName) => {
        const { } = this.state
        if (name === 'token') {
            this.setState({ tokenDateStatus: status })
        }
        if (name === 'agreeAmount') {
            this.setState({ agreeAmountFromat: status })
        }
        if (name === 'commissionPayment') {
            this.setState({ comissionDateStatus: status })
        }
    }

    clearStateValue(name, clear) {
        const { lead } = this.props
        axios.get(`/api/leads/byId?id=${lead.id}`)
            .then((res) => {
                if (name === 'token') {
                    var token = res.data.token
                    this.setState({ token: token != null ? token : '' }, () => {
                        if (token != null) {
                            this.dateStatusChange(name, true)
                            this.formatStatusChange(name, true)
                        } else {
                            this.dateStatusChange(name, false)
                            this.formatStatusChange(name, false)
                        }

                    })
                }


                if (name === 'agreeAmount') {
                    var agreeAmount = res.data.payment
                    this.setState({ agreedAmount: agreeAmount != null ? agreeAmount : '' }, () => {
                        if (agreeAmount != null) {
                            this.dateStatusChange(name, true)
                            this.formatStatusChange(name, true)
                        } else {
                            this.dateStatusChange(name, false)
                            this.formatStatusChange(name, false)
                        }

                    })
                }

                if (name === 'commissionPayment') {
                    var comission = res.data.commissionPayment
                    this.setState({ commissionPayment: comission != null ? comission : '' }, () => {
                        if (comission != null) {
                            this.dateStatusChange(name, true)
                            this.formatStatusChange(name, true)
                        } else {
                            this.dateStatusChange(name, false)
                            this.formatStatusChange(name, false)
                        }

                    })
                }

                if (name === 'monthlyRent') {
                    var monthly = res.data.monthlyRent
                    var newFormdata = { ...this.state.formData }
                    newFormdata['monthlyRent'] = monthly != null ? monthly : ''
                    this.setState({ formData: newFormdata }, () => {
                        if (monthly != null) {
                            this.formatStatusChange(name, true)
                        } else {
                            this.formatStatusChange(name, false)
                        }

                    })
                }
            })
    }

    goToHistory = () => {
        const { callModal } = this.state
        this.setState({ callModal: !callModal })
    }

    getCallHistory = () => {
        const { lead } = this.props
        axios.get(`/api/diary/all?armsLeadId=${lead.id}`)
            .then((res) => {
                this.setState({ meetings: res.data.rows })
            })
    }

    render() {
        const { loading,
            allProperties,
            user,
            isVisible,
            checkReasonValidation,
            selectedReason,
            reasons,
            agreedAmount,
            showAgreedAmountArrow,
            showTokenAmountArrow,
            commissionPayment,
            progressValue,
            token,
            lead,
            pickerData,
            formData,
            closedLeadEdit,
            showMonthlyRentArrow,
            showCommissionAmountArrow,
            showStyling,
            tokenDateStatus,
            tokenPriceFromat,
            comissionDateStatus,
            comissionPriceFromat,
            agreeAmountFromat,
            monthlyFormatStatus,
            meetings,
            callModal,
        } = this.state;

        return (
            !loading ?
                <KeyboardAvoidingView style={[AppStyles.container, { backgroundColor: AppStyles.colors.backgroundColor, paddingLeft: 0, paddingRight: 0, marginBottom: 30 }]} behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={120}>
                    <ProgressBar style={{ backgroundColor: "ffffff" }} progress={progressValue} color={'#0277FD'} />
                    <LeadRCMPaymentPopup
                        reasons={reasons}
                        selectedReason={selectedReason}
                        changeReason={(value) => this.handleReasonChange(value)}
                        checkValidation={checkReasonValidation}
                        isVisible={isVisible}
                        closeModal={() => this.closeModal()}
                        onPress={() => this.onHandleCloseLead()}
                    />
                    <HistoryModal
                        data={meetings}
                        closePopup={this.goToHistory}
                        openPopup={callModal}
                    />
                    <View style={{ flex: 1, minHeight: '100%', paddingBottom: 100 }}>
                        {
                            allProperties.length > 0 ?
                                <FlatList
                                    data={allProperties}
                                    renderItem={(item, index) => (
                                        <View style={{ marginVertical: 3, marginHorizontal: 10 }}>
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
                                        <View style={{ marginHorizontal: 10 }}>
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

                                                            showAndHideStyling={this.showAndHideStyling}
                                                            showStylingState={showStyling}
                                                            tokenDateStatus={tokenDateStatus}
                                                            tokenPriceFromat={tokenPriceFromat}
                                                            agreeAmountFromat={agreeAmountFromat}
                                                            comissionDateStatus={comissionDateStatus}
                                                            comissionPriceFromat={comissionPriceFromat}

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

                                                            showAndHideStyling={this.showAndHideStyling}
                                                            showStylingState={showStyling}
                                                            tokenDateStatus={tokenDateStatus}
                                                            tokenPriceFromat={tokenPriceFromat}
                                                            agreeAmountFromat={agreeAmountFromat}
                                                            comissionDateStatus={comissionDateStatus}
                                                            comissionPriceFromat={comissionPriceFromat}
                                                            monthlyFormatStatus={monthlyFormatStatus}
                                                        />
                                                    : null
                                            }
                                        </View>
                                    }
                                    keyExtractor={(item, index) => item.id.toString()}
                                />

                                :
                                <Image source={require('../../../assets/images/no-result2.png')} resizeMode={'center'} style={{ flex: 1, alignSelf: 'center', width: 300, height: 300 }} />
                        }
                        <View style={AppStyles.mainCMBottomNav}>
                            <CMBottomNav
                                goToAttachments={this.goToAttachments}
                                navigateTo={this.navigateToDetails}
                                goToDiaryForm={this.goToDiaryForm}
                                goToComments={this.goToComments}
                                alreadyClosedLead={() => this.closedLead()}
                                closeLead={this.showLeadPaymentModal}
                                closedLeadEdit={closedLeadEdit}
                                callButton={true}
                                customer={lead.customer}
                                lead={lead}
                                goToHistory={this.goToHistory}
                                getCallHistory={this.getCallHistory}
                            />
                        </View>

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