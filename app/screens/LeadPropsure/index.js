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
import PropsureReportsPopup from '../../components/PropsureReportsPopup/index'
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
            selectedReports: [],
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
            meetings: [],
            menuShow: false
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
                        selectedReports: []
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

    showReportsModal = (property) => {
        const { lead, user } = this.props
        const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(user, lead);
        if (leadAssignedSharedStatus) {
            this.setState({ isVisible: true, selectedPropertyId: property.id, selectedProperty: property});
        }
    }


    onHandleRequestVerification = () => {
        const { lead } = this.props
        const { selectedReports, selectedPropertyId, selectedProperty } = this.state;
        if (selectedReports.length === 0) {
            alert('Please select at least one report!')
        } else {
            // ********* Call Add Attachment API here :)
            this.closeModal();
            const body = {
                packageName: selectedReports,
                propertyId: selectedPropertyId,
                pId: selectedProperty.arms_id ? selectedProperty.arms_id : selectedProperty.graana_id,
                org: selectedProperty.arms_id ? 'arms' : 'graana',
            }
            console.log(body)
            // axios.post(`/api/leads/propsure/${lead.id}`, body).then(response => {
            //     this.fetchLead()
            //     this.fetchProperties();
            // }).catch(error => {
            //     console.log(error);
            //     this.setState({ selectedPropertyId: null, selectedReports: [], selectedProperty: null });
            // })

        }

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
            <TouchableOpacity key={item.id.toString()} onPress={() => this.showReportsModal(item)}
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
        const { lead } = this.props;
        if (lead.commissions && lead.commissions.status === StaticData.leadClearedStatus) {
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

    goToPropertyComments = (data) => {
        const { lead, navigation } = this.props
        this.toggleMenu(false, data.id)
        navigation.navigate('Comments', { propertyId: data.id, screenName: 'propsure' });
    }

    toggleMenu = (val, id) => {
        const { matchData } = this.state
        let newMatches = matchData.map(item => {
            if (item.id === id) {
                item.checkBox = val
                return item
            } else return item
        })
        this.setState({ matchData: newMatches })
    }

    addRemoveReport = (report) => {
        const { selectedReports } = this.state;
        let reports = [...selectedReports];
        if (reports.includes(report, 0)) {
            reports = _.without(reports, report);
        }
        else {
            reports.push(report);
        }
        this.setState({ selectedReports: reports })
    }

    render() {
        const { menuShow, meetings, callModal, loading, matchData, user, isVisible, documentModalVisible, file, checkValidation, checkReportsValidation, selectedReports, progressValue, reasons, selectedReason, isCloseLeadVisible, checkReasonValidation, closedLeadEdit } = this.state
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
                    <PropsureReportsPopup
                        reports={StaticData.propsureReportTypes}
                        addRemoveReport={(item) => this.addRemoveReport(item)}
                        selectedReports={selectedReports}
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
                                    data={_.clone(matchData)}
                                    renderItem={(item, index) => (
                                        <View style={{ marginVertical: 3, marginHorizontal: 15 }}>
                                            {
                                                this.ownProperty(item.item) ?
                                                    <MatchTile
                                                        data={_.clone(item.item)}
                                                        user={user}
                                                        displayChecks={this.displayChecks}
                                                        showCheckBoxes={false}
                                                        addProperty={this.addProperty}
                                                        isMenuVisible={true}
                                                        viewingMenu={false}
                                                        goToPropertyComments={this.goToPropertyComments}
                                                        toggleMenu={this.toggleMenu}
                                                        menuShow={menuShow}
                                                    />
                                                    :
                                                    <AgentTile
                                                        data={_.clone(item.item)}
                                                        user={user}
                                                        displayChecks={this.displayChecks}
                                                        showCheckBoxes={false}
                                                        addProperty={this.addProperty}
                                                        isMenuVisible={true}
                                                        viewingMenu={false}
                                                        goToPropertyComments={this.goToPropertyComments}
                                                        toggleMenu={this.toggleMenu}
                                                        menuShow={menuShow}
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