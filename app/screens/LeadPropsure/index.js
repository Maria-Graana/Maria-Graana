import * as React from 'react';
import styles from './styles'
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import * as DocumentPicker from 'expo-document-picker';
import AppStyles from '../../AppStyles'
import MatchTile from '../../components/MatchTile/index';
import AgentTile from '../../components/AgentTile/index';
import axios from 'axios';
import Loader from '../../components/loader';
import PropsurePackagePopup from '../../components/PropsurePackagePopup/index'
import PropsureDocumentPopup from '../../components/PropsureDocumentPopup/index'
import _ from 'underscore';
import StaticData from '../../StaticData';
import helper from '../../helper';
import { ProgressBar } from 'react-native-paper';
import { setlead } from '../../actions/lead';
import CMBottomNav from '../../components/CMBottomNav'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import HistoryModal from '../../components/HistoryModal/index';

class LeadPropsure extends React.Component {
    constructor(props) {
        super(props)
        const { user, lead } = this.props;
        this.state = {
            loading: true,
            open: false,
            isVisible: false,
            documentModalVisible: false,
            checkValidation: false,
            checkPackageValidation: false,
            selectedPackage: '',
            packages: StaticData.propsurePackages,
            selectedPropertyId: null,
            selectedProperty: null,
            selectedPropsureId: null,
            matchData: [],
            file: null,
            progressValue: 0,
            // for the lead close dialog
            isCloseLeadVisible: false,
            checkReasonValidation: false,
            selectedReason: '',
            reasons: [],
            closedLeadEdit: helper.checkAssignedSharedStatus(user, lead),
            callModal: false,
            meetings: []
        }
    }

    componentDidMount = () => {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.fetchLead()
            this.getCallHistory()
            this.fetchProperties()
        })
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    fetchProperties = () => {
        const { lead } = this.props
        const { rcmProgressBar } = StaticData
        let matches = []
        this.setState({ loading: true }, () => {
            axios.get(`/api/leads/${lead.id}/shortlist`)
                .then((res) => {
                    matches = helper.propertyIdCheck(res.data.rows)
                    this.setState({
                        matchData: matches,
                        progressValue: rcmProgressBar[lead.status]
                    })
                })
                .catch((error) => {
                    console.log(error)

                }).finally(() => {
                    this.setState({
                        loading: false,
                        selectedPropertyId: null,
                        selctedPropsureId: null,
                        selectedProperty: null,
                        selectedPackage: ''
                    })
                })
        })

    }

    fetchLead = () => {
        const { lead } = this.props
        axios.get(`api/leads/byid?id=${lead.id}`)
            .then((res) => {
                this.props.dispatch(setlead(res.data))
            })
            .catch((error) => {
                console.log(error)
            })
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

    closeModal = () => { this.setState({ isVisible: false }) }

    showPackageModal = (property) => {
        const { lead, user } = this.props
        const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(user, lead);
        if (leadAssignedSharedStatus) {
            this.setState({ isVisible: true, selectedPropertyId: property.id, selectedProperty: property, checkPackageValidation: false });
        }
    }


    onHandleRequestVerification = () => {
        const { lead } = this.props
        const { selectedPackage, selectedPropertyId, selectedProperty } = this.state;
        if (selectedPackage === '') {
            this.setState({
                checkPackageValidation: true
            })
        } else {
            // ********* Call Add Attachment API here :)
            this.closeModal();
            const body = {
                packageName: selectedPackage,
                propertyId: selectedPropertyId,
                pId: selectedProperty.arms_id ? selectedProperty.arms_id : selectedProperty.graana_id,
                org: selectedProperty.arms_id ? 'arms' : 'graana',
            }
            axios.post(`/api/leads/propsure/${lead.id}`, body).then(response => {
                this.fetchLead()
                this.fetchProperties();
            }).catch(error => {
                console.log(error);
                this.setState({ selectedPropertyId: null, selectedPackage: '', selectedProperty: null });
            })

        }

    }

    handlePackageChange = (value) => {
        this.setState({ selectedPackage: value });
    }

    showDocumentModal = (propsureId) => {
        const { lead, user } = this.props
        const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(user, lead);
        if (leadAssignedSharedStatus) {
            this.setState({ documentModalVisible: true, selectedPropsureId: propsureId, checkValidation: false });
        }
    }

    closeDocumentModal = () => {
        this.setState({ documentModalVisible: false, file: null })
    }

    getAttachmentFromStorage = () => {
        let options = {
            type: '*/*',
            copyToCacheDirectory: true,
        }
        DocumentPicker.getDocumentAsync(options).then(item => {
            if (item.type === 'cancel') {
                Alert.alert('Pick File', 'Please pick a file from documents!')
            }
            else {
                this.setState({ file: item });
            }

        }).catch(error => {
            console.log(error);
        })
    }

    handleDocumentModalDone = () => {
        const { file } = this.state
        // ********* Form Validation Check
        if (file === null) {
            this.setState({
                checkValidation: true
            })
        } else {
            // ********* Call Add Attachment API here :)
            this.setState({ documentModalVisible: false })
            let document = {
                name: file.name,
                type: 'file/' + file.name.split('.').pop(),
                uri: file.uri
            }
            this.uploadAttachment(document);
            this.setState({
                file: null
            });
        }
    }

    uploadAttachment(data) {
        const { selectedPropsureId } = this.state;

        let fd = new FormData()
        fd.append('file', data);
        axios.post(`api/leads/propsureDoc?id=${selectedPropsureId}`, fd).then(response => {
            this.fetchLead()
            this.fetchProperties();
        }).catch(error => {
            console.log('error=>', error.message);
        })
    }

    renderPropsureVerificationView = (item) => {
        return (
            <TouchableOpacity key={item.id.toString()} onPress={() => this.showPackageModal(item)}
                style={[styles.viewButtonStyle, { backgroundColor: AppStyles.bgcWhite.backgroundColor }]} activeOpacity={0.7}>
                <Text style={styles.propsureVerificationTextStyle}>
                    PROPSURE VERIFICATION
                </Text>
            </TouchableOpacity>
        )
    }

    renderPropsurePendingView = (item) => {
        return item.propsures.map(propsure => {
            return (
                <TouchableOpacity key={item.id.toString()} onPress={propsure.status === 'pending' ? () => this.showDocumentModal(propsure.id) : null}
                    style={[styles.viewButtonStyle, { backgroundColor: propsure.status === 'pending' ? '#FCD12A' : AppStyles.colors.primaryColor }]} activeOpacity={0.7}>
                    <Text style={[styles.propsureVerificationTextStyle, { color: '#fff' }]}>
                        {
                            propsure.status === 'pending' ?
                                'PENDING VERIFICATION' :
                                'VERIFIED'
                        }
                    </Text>
                </TouchableOpacity>
            )
        });
    }

    closedLead = () => {
        helper.leadClosedToast()
    }

	closeLead = () => {
		const {lead} = this.props;
		if (lead.commissions && lead.commissions.status === 'approved') {
            this.setState({ reasons: StaticData.leadCloseReasonsWithPayment, isCloseLeadVisible: true, checkReasonValidation: '' })
        }
        else {
            this.setState({ reasons: StaticData.leadCloseReasons, isCloseLeadVisible: true, checkReasonValidation: '' })
        }
	}

    onHandleCloseLead = () => {
        const { navigation, lead } = this.props
        const { selectedReason } = this.state;
        let payload = Object.create({});
        payload.reasons = selectedReason;
        if (selectedReason !== '') {
            var leadId = []
            leadId.push(lead.id)
            axios.patch(`/api/leads`, payload, { params: { id: leadId } }).then(response => {
                this.setState({ isCloseLeadVisible: false }, () => {
                    helper.successToast(`Lead Closed`)
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

    handleReasonChange = (value) => {
        this.setState({ selectedReason: value });
    }


    closeLeadModal = () => {
        this.setState({ isCloseLeadVisible: false })
    }

    goToDiaryForm = () => {
        const { lead, navigation, user } = this.props
        navigation.navigate('AddDiary', {
            update: false,
            agentId: user.id,
            rcmLeadId: lead.id,
            addedBy: 'self'
        });
    }

    goToAttachments = () => {
        const { lead, navigation } = this.props
        navigation.navigate('Attachments', { rcmLeadId: lead.id });
    }

    goToComments = () => {
        const { lead, navigation } = this.props
        navigation.navigate('Comments', { rcmLeadId: lead.id });
    }

    navigateToDetails = () => {
        this.props.navigation.navigate('LeadDetail', { lead: this.props.lead, purposeTab: 'sale' })
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
        const { meetings, callModal, loading, matchData, user, isVisible, packages, selectedPackage, documentModalVisible, file, checkValidation, checkPackageValidation, progressValue, reasons, selectedReason, isCloseLeadVisible, checkReasonValidation, closedLeadEdit } = this.state
        const { lead, navigation } = this.props

        return (
            !loading ?
                <View style={[AppStyles.container, { backgroundColor: AppStyles.colors.backgroundColor, paddingLeft: 0, paddingRight: 0 }]}>
                    <ProgressBar style={{ backgroundColor: "ffffff" }} progress={progressValue} color={'#0277FD'} />
                    <HistoryModal
                        getCallHistory={this.getCallHistory}
                        navigation={navigation}
                        data={meetings}
                        closePopup={this.goToHistory}
                        openPopup={callModal}
                    />
                    <PropsurePackagePopup
                        packages={packages}
                        selectedPackage={selectedPackage}
                        changePackage={this.handlePackageChange}
                        checkValidation={checkPackageValidation}
                        isVisible={isVisible}
                        closeModal={() => this.closeModal()}
                        onPress={this.onHandleRequestVerification}
                    />
                    <PropsureDocumentPopup
                        isVisible={documentModalVisible}
                        closeModal={() => this.closeDocumentModal()}
                        onPress={this.handleDocumentModalDone}
                        getAttachmentFromStorage={this.getAttachmentFromStorage}
                        selectedFile={file}
                        checkValidation={checkValidation}
                    />
                    <View style={{ paddingBottom: 100 }}>
                        {
                            matchData.length ?
                                <FlatList
                                    data={matchData}
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
                                                    item.item.propsures.length === 0 ?
                                                        this.renderPropsureVerificationView(item.item) :
                                                        this.renderPropsurePendingView(item.item)
                                                }

                                            </View>
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => item.id.toString()}
                                />
                                :
                                <>
                                <Image source={require('../../../assets/img/no-result-found.png')} resizeMode={'center'} style={{ alignSelf: 'center', width: 300, height: 300 }} />
                                </>
                        }
                    </View>
                    <View style={AppStyles.mainCMBottomNav}>
                        <CMBottomNav
                            goToAttachments={this.goToAttachments}
                            navigateTo={this.navigateToDetails}
                            goToDiaryForm={this.goToDiaryForm}
                            goToComments={this.goToComments}
                            alreadyClosedLead={() => this.closedLead()}
                            closeLead={this.closeLead}
                            closedLeadEdit={closedLeadEdit}
                            callButton={true}
                            customer={lead.customer}
                            lead={lead}
                            goToHistory={this.goToHistory}
                            getCallHistory={this.getCallHistory}
                        />
                    </View>
                    <LeadRCMPaymentPopup
                        reasons={reasons}
                        selectedReason={selectedReason}
                        changeReason={(value) => this.handleReasonChange(value)}
                        checkValidation={checkReasonValidation}
                        isVisible={isCloseLeadVisible}
                        closeModal={() => this.closeLeadModal()}
                        onPress={() => this.onHandleCloseLead()}
                    />
                </View>
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

export default connect(mapStateToProps)(LeadPropsure)