import * as React from 'react';
import styles from './styles'
import { View, Text, FlatList, Image, TouchableOpacity,KeyboardAvoidingView,Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import MatchTile from '../../components/MatchTile/index';
import AgentTile from '../../components/AgentTile/index';
import { Fab, Button, Icon } from 'native-base';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Loader from '../../components/loader';
import PaymentView from './paymentView';
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import _ from 'underscore';
import StaticData from '../../StaticData';

class LeadRCMPayment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            isVisible: false,
            active: false,
            allProperties: [],
            showSelectPaymentView: false,
            checkValidation: false,
            checkReasonValidation: false,
            selectedReason: '',
            formData: {
                token: '',
                payment: '',
                commisionPayment: ''
            },
            reasons: StaticData.leadCloseReasons
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
        const { lead } = this.props
        this.setState({ loading: true }, () => {
            axios.get(`/api/leads/${lead.id}/shortlist`)
                .then((res) => {
                    //console.log(res.data.rows);
                    this.setState({
                        loading: false,
                        allProperties: res.data.rows,
                        showSelectPaymentView: false,
                        selectedReason: '',
                        checkValidation: '',
                        checkReasonValidation: '',
                        formData: {
                            token: '',
                            payment: '',
                            commissionPayment: ''
                        }
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

    handleForm = (value, name) => {
        const { formData } = this.state
        formData[name] = value
        this.setState({ formData }, () => {
            //console.log(this.state.formData);
        });
    }

    selectForPayment = (item) => {
        const { allProperties } = this.state;
        const selectedProperty = allProperties.filter(property => property.id === item.id);
        this.setState(({ allProperties: [...selectedProperty], showSelectPaymentView: true }))
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

    handlePress = (value) => {
        const { formData } = this.state;
        const object = Object.assign({}, formData);
        if (value === 'token' && formData.token !== '') {
            object.token = this.convertToInteger(formData.token)
            object.payment = formData.payment === '' ? null : this.convertToInteger(formData.payment);
            object.commissionPayment = formData.commissionPayment === '' ? null : this.convertToInteger(formData.commissionPayment);
            this.updateLeadProperty(object);
        }
        else if (value === 'payment' && formData.payment !== '') {
            object.payment = this.convertToInteger(formData.payment)
            object.token = formData.token === '' ? null : this.convertToInteger(formData.token);
            object.commissionPayment = formData.commissionPayment === '' ? null : this.convertToInteger(formData.commissionPayment);
            this.updateLeadProperty(object);
        }
        else if (value === 'commissionPayment' && formData.commissionPayment !== '') {
            object.commissionPayment = this.convertToInteger(formData.commissionPayment)
            object.payment = formData.payment === '' ? null : this.convertToInteger(formData.payment);
            object.token = formData.token === '' ? null : this.convertToInteger(formData.token);
            this.updateLeadProperty(object);
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

    updateLeadProperty = (value) => {
        const { lead } = this.props
        const { allProperties } = this.state;
        const selectedProperty = allProperties[0];
        let payload = Object.create({});
        payload.arms_id = selectedProperty.arms_id;
        payload.graana_id = selectedProperty.graana_id;
        payload.graana_agency_id = selectedProperty.graana_agency_id;
        payload.token = value.token;
        payload.payment = value.payment;
        payload.commissionPayment = value.commissionPayment;

        axios.patch(`/api/leads/?id=${lead.id}`, payload).then(response => {
            // console.log('response=>', response.data);
            this.fetchProperties();
        }).catch(error => {
            console.log(error);
        })
    }

    onHandleCloseLead = (reason) => {
        const { lead, navigation } = this.props
        let payload = Object.create({});
        payload.reasons = reason;

        axios.patch(`/api/leads/?id=${lead.id}`, payload).then(response => {
            this.setState({ isVisible: false }, () => {
                navigation.navigate('Lead');
            });

            this.fetchProperties();
        }).catch(error => {
            console.log(error);
        })
    }

    goToDiaryForm = () => {
        const { lead ,navigation} = this.props
        this.setState({ active: false })
        navigation.navigate('AddDiary', {
            update: false,
            leadId: lead.id
        });
    }

    goToAttachments() {
        const { lead,navigation } = this.props
        this.setState({ active: false })
        navigation.navigate('Attachments', { leadId: lead.id });
    }

    goToComments() {
        const { lead,navigation } = this.props
        this.setState({ active: false })
        navigation.navigate('Comments', { leadId: lead.id });
    }



    render() {
        const { loading, allProperties, user, isVisible, showSelectPaymentView, formData, checkValidation, checkReasonValidation, selectedReason, reasons, active } = this.state;

        return (
            !loading ?
            <KeyboardAvoidingView style={[AppStyles.container, { backgroundColor: AppStyles.colors.backgroundColor, paddingLeft: 0, paddingRight: 0, marginBottom: 30 }]}  behavior={Platform.Os == "ios" ? "padding" : "height"} keyboardVerticalOffset={120}>

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
                                                        <PaymentView
                                                            formData={formData}
                                                            checkValidation={checkValidation}
                                                            handleForm={this.handleForm}
                                                            onPress={(value) => this.handlePress(value)}

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