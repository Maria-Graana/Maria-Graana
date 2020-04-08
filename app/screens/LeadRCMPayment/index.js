import * as React from 'react';
import styles from './styles'
import { View, Text, FlatList, Image, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableHighlightBase } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import MatchTile from '../../components/MatchTile/index';
import AgentTile from '../../components/AgentTile/index';
import { Fab, Button, Icon } from 'native-base';
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

class LeadRCMPayment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            isVisible: false,
            active: false,
            allProperties: [],
            selectedProperty: {},
            showSelectPaymentView: false,
            checkReasonValidation: false,
            selectedReason: '',
            reasons: StaticData.leadCloseReasons,
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
            }

        }
    }

    componentDidMount = () => {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.fetchProperties()
        })

    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    fetchProperties = () => {
        const { lead } = this.state
        console.log(lead);
        this.setState({ loading: true }, () => {
            axios.get(`/api/leads/${lead.id}/shortlist`)
                .then((res) => {
                    this.setState({
                        loading: false,
                        allProperties: res.data.rows,
                        showSelectPaymentView: false,
                        selectedReason: '',
                        checkReasonValidation: '',
                    })
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({
                        loading: false,
                    })
                })
        })

    }

    displayChecks = () => { }

    addProperty = () => { }

    ownProperty = (property) => {
        const { user } = this.props
        if ('armsuser' in property && property.armsuser) {
            return user.id === property.armsuser.id
        } else if ('user' in property && property.user) {
            return user.id === property.user.id
        } else {
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
        const { allProperties } = this.state;
        const { lead } = this.state;

        const selectedProperty = allProperties.filter(property => property.id === item.id);
        this.setState({ allProperties: [...selectedProperty], showSelectPaymentView: true }, () => {
            if (lead.purpose === 'sale') {
                // for sale lead
                // if agreed amount already exists for selected inventory, do this
                if (this.state.allProperties[0].agreedOffer.length > 0) {
                    let offerObject = this.state.allProperties[0].agreedOffer[0];
                    this.setState({
                        agreedAmount: String(lead.payment),
                        token: String(lead.token),
                        commissionPayment: String(lead.commissionPayment)
                    }, () => {
                        // if payment amount is null then set the agreed amount as payment amount as well.
                        if (lead.payment === null) {
                            this.setState({ agreedAmount: String(offerObject.offer) }, () => {
                                this.handleAgreedAmountPress();
                            })
                        }
                    })
                }
            }
            else {
                this.setState({
                    formData: { contract_months: String(lead.contract_months), security: String(lead.security), advance: String(lead.advance), monthlyRent: String(lead.monthlyRent) },
                    token: String(lead.token),
                    commissionPayment: String(lead.commissionPayment)
                })
            }
        });

    }

    renderSelectPaymentView = (item) => {
        return (
            !this.state.showSelectPaymentView ?
                <TouchableOpacity key={item.id.toString()} onPress={() => this.selectForPayment(item)} style={styles.viewButtonStyle} activeOpacity={0.7}>
                    <Text style={styles.buttonTextStyle}>
                        SELECT FOR PAYMENT
            </Text>
                </TouchableOpacity>
                : null
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
        payload.armsProperty = selectedProperty.arms_id;
        payload.graanaProperty = selectedProperty.graana_id;
        payload.graanaProperty = selectedProperty.graana_agency_id;
        payload.token = this.convertToInteger(token);
        axios.patch(`/api/leads/?id=${lead.id}`, payload).then(response => {
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
        payload.armsProperty = selectedProperty.arms_id;
        payload.graanaProperty = selectedProperty.graana_id;
        payload.graanaProperty = selectedProperty.graana_agency_id;
        payload.payment = this.convertToInteger(agreedAmount);
        axios.patch(`/api/leads/?id=${lead.id}`, payload).then(response => {
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
        payload.armsProperty = selectedProperty.arms_id;
        payload.graanaProperty = selectedProperty.graana_id;
        payload.graanaProperty = selectedProperty.graana_agency_id;
        payload.commissionPayment = this.convertToInteger(commissionPayment);
        axios.patch(`/api/leads/?id=${lead.id}`, payload).then(response => {
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
        payload.armsProperty = selectedProperty.arms_id;
        payload.graanaProperty = selectedProperty.graana_id;
        payload.graanaProperty = selectedProperty.graana_agency_id;
        payload.monthlyRent = this.convertToInteger(monthlyRent);
        axios.patch(`/api/leads/?id=${lead.id}`, payload).then(response => {
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
        payload.armsProperty = selectedProperty.arms_id;
        payload.graanaProperty = selectedProperty.graana_id;
        payload.graanaProperty = selectedProperty.graana_agency_id;
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
            this.setState({ lead: response.data }, () => {
                this.props.dispatch(setlead(this.state.lead));
            })

        }).catch(error => {
            console.log(error);
        })
    }


    goToDiaryForm = () => {
        const { navigation } = this.props
        const { lead } = this.state;
        this.setState({ active: false })
        navigation.navigate('AddDiary', {
            update: false,
            leadId: lead.id
        });
    }

    goToAttachments() {
        const { navigation } = this.props
        const { lead } = this.state;
        this.setState({ active: false })
        navigation.navigate('Attachments', { leadId: lead.id });
    }

    goToComments() {
        const { navigation } = this.props
        const { lead } = this.state;
        this.setState({ active: false })
        navigation.navigate('Comments', { leadId: lead.id });
    }


    render() {
        const { loading,
            allProperties,
            user,
            isVisible,
            showSelectPaymentView,
            checkReasonValidation,
            selectedReason,
            reasons,
            active,
            agreedAmount,
            showAgreedAmountArrow,
            showTokenAmountArrow,
            commissionPayment,
            token,
            lead,
            pickerData,
            formData,
            showMonthlyRentArrow,
            showCommissionAmountArrow } = this.state;


        return (
            !loading ?
                <KeyboardAvoidingView style={[AppStyles.container, { backgroundColor: AppStyles.colors.backgroundColor, paddingLeft: 0, paddingRight: 0, marginBottom: 30 }]} behavior={Platform.Os == "ios" ? "padding" : "height"} keyboardVerticalOffset={120}>

                    <LeadRCMPaymentPopup
                        reasons={reasons}
                        selectedReason={selectedReason}
                        changeReason={this.handleReasonChange}
                        checkValidation={checkReasonValidation}
                        isVisible={isVisible}
                        closeModal={() => this.closeModal()}
                        onPress={this.onHandleCloseLead}
                    />
                    <View style={{ opacity: active ? 0.3 : 1, flex: 1 }}>
                        {
                            allProperties.length ?
                                <FlatList
                                    data={allProperties}
                                    renderItem={(item, index) => (
                                        <View style={{ marginVertical: 10, marginHorizontal: 15 }}>
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
                                                showSelectPaymentView ?
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

                    </View>
                    <Fab
                        active={active}
                        direction="up"
                        style={{ backgroundColor: AppStyles.colors.primaryColor }}
                        position="bottomRight"
                        onPress={() => this.setState({ active: !active })}>
                        <Ionicons name="md-add" color="#ffffff" />
                        <Button style={{ backgroundColor: AppStyles.colors.primary }} activeOpacity={1} onPress={() => { this.goToDiaryForm() }}>
                            <Icon name="md-calendar" size={20} color={'#fff'} />
                        </Button>
                        <Button style={{ backgroundColor: AppStyles.colors.primary }} onPress={() => { this.goToAttachments() }}>
                            <Icon name="md-attach" />
                        </Button>
                        <Button style={{ backgroundColor: AppStyles.colors.primary }} onPress={() => { this.goToComments() }}>
                            <FontAwesome name="comment" size={20} color={'#fff'} />
                        </Button>
                    </Fab>
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