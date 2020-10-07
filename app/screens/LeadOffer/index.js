import * as React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import MatchTile from '../../components/MatchTile/index';
import AgentTile from '../../components/AgentTile/index';
import axios from 'axios';
import Loader from '../../components/loader';
import _ from 'underscore';
import OfferModal from '../../components/OfferModal'
import { FAB } from 'react-native-paper';
import { ProgressBar } from 'react-native-paper';
import { setlead } from '../../actions/lead';
import CMBottomNav from '../../components/CMBottomNav'
import StaticData from '../../StaticData';
import helper from '../../helper';
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import HistoryModal from '../../components/HistoryModal/index';

class LeadOffer extends React.Component {
	constructor(props) {
		super(props)
		const {user, lead} = this.props;
		this.state = {
			open: false,
			loading: true,
			modalActive: false,
			offersData: [],
			leadData: {
				my: '',
				their: '',
				agreed: ''
			},
			currentProperty: {},
			progressValue: 0,
			disableButton: false,
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

	fetchProperties = () => {
		const { lead } = this.props
		const { rcmProgressBar } = StaticData
		let matches = []
		axios.get(`/api/leads/${lead.id}/shortlist`)
			.then((res) => {
				matches = helper.propertyCheck(res.data.rows)
				this.setState({
					disableButton: false,
					loading: false,
					matchData: matches,
					progressValue: rcmProgressBar[lead.status]
				})
			})
			.catch((error) => {
				console.log(error)
				this.setState({
					loading: false,
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

	openChatModal = () => {
		const { modalActive } = this.state
		this.setState({
			modalActive: !modalActive,
		}, () => {
			if (!this.state.modalActive) {
				this.fetchLead()
				this.fetchProperties()
			}
		})
	}

	setProperty = (property) => {
		this.setState({ currentProperty: property }, () => {
			this.fetchOffers()
		})
	}

	handleForm = (value, name) => {
		const { leadData } = this.state
		leadData[name] = value
		this.setState({ leadData });
	}

	fetchOffers = () => {
		const { currentProperty } = this.state
		const { lead } = this.props
		axios.get(`/api/offer?leadId=${lead.id}&shortlistedPropId=${currentProperty.id}`)
			.then((res) => {
				this.setState({ offerChat: res.data.rows, disableButton: false, leadData: { my: '', their: '', agreed: '' } })
			})
			.catch((error) => {
				console.log(error)
			})
	}

	placeMyOffer = () => {
		const { leadData, currentProperty } = this.state
		const { lead } = this.props
		if (leadData.my && leadData.my !== '') {
			let body = {
				offer: leadData.my,
				type: 'my'
			}
			this.setState({ disableButton: true })
			axios.post(`/api/offer?leadId=${lead.id}&shortlistedPropId=${currentProperty.id}`, body)
				.then((res) => {
					this.fetchOffers()
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}

	placeTheirOffer = () => {
		const { leadData, currentProperty } = this.state
		const { lead } = this.props
		if (leadData.their && leadData.their !== '') {
			let body = {
				offer: leadData.their,
				type: 'their'
			}
			this.setState({ disableButton: true })
			axios.post(`/api/offer?leadId=${lead.id}&shortlistedPropId=${currentProperty.id}`, body)
				.then((res) => {
					this.fetchOffers()
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}

	closedLead = () => {
		helper.leadClosedToast()
	}

	closeLead = () => {
		var commissionPayment = this.props.lead.commissionPayment
			if (commissionPayment !== null) {
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


	closeModal = () => {
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

	placeAgreedOffer = () => {
		const { leadData, currentProperty } = this.state
		const { lead } = this.props
		if (leadData.agreed && leadData.agreed !== '') {
			let body = {
				offer: leadData.agreed,
				type: 'agreed'
			}
			this.setState({ disableButton: true })
			axios.post(`/api/offer?leadId=${lead.id}&shortlistedPropId=${currentProperty.id}`, body)
				.then((res) => {
					this.openChatModal()
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}

	checkStatus = (property) => {
		const { lead, user } = this.props;
		const leadAssignedSharedStatus = helper.checkAssignedSharedStatus(user, lead);
		if (property.agreedOffer.length) {
			return (
				<TouchableOpacity
					style={{
						backgroundColor: AppStyles.colors.primaryColor,
						height: 30,
						borderBottomEndRadius: 10,
						borderBottomLeftRadius: 10,
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					<Text style={{ color: 'white', fontFamily: AppStyles.fonts.lightFont }}>Agreed Amount: <Text style={{ fontFamily: AppStyles.fonts.defaultFont }}>{property.agreedOffer[0].offer}</Text></Text>
				</TouchableOpacity >
			)
		} else if (property.leadOffers.length) {
			return (
				<TouchableOpacity
					style={{
						backgroundColor: 'white',
						height: 30,
						borderBottomEndRadius: 10,
						borderBottomLeftRadius: 10,
						justifyContent: "center",
						alignItems: "center"
					}}
					onPress={() => {
						if(leadAssignedSharedStatus){
							this.openChatModal();
							this.setProperty(property)
						}
					}}
				>
					<Text style={{ fontFamily: AppStyles.fonts.lightFont }}>View <Text style={{ color: AppStyles.colors.primaryColor, fontFamily: AppStyles.fonts.defaultFont }}>Offers</Text></Text>
				</TouchableOpacity >
			)
		} else {
			return (
				<TouchableOpacity
					style={{
						backgroundColor: 'white',
						height: 30,
						borderBottomEndRadius: 10,
						borderBottomLeftRadius: 10,
						justifyContent: "center",
						alignItems: "center"
					}}
					onPress={() => {
						if(leadAssignedSharedStatus){
							this.openChatModal();
							this.setProperty(property)
						}
					}}
				>
					<Text style={{ color: AppStyles.colors.primaryColor, fontFamily: AppStyles.fonts.defaultFont }}> PLACE OFFER</Text>
				</TouchableOpacity >
			)
		}
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

		const { meetings, callModal, loading, matchData, user, modalActive, offersData, offerChat, open, progressValue, disableButton, leadData, reasons, selectedReason, isCloseLeadVisible, checkReasonValidation, closedLeadEdit } = this.state
		const { lead } = this.props

		return (
			!loading ?
				<View style={{ flex: 1 }}>
					<ProgressBar style={{ backgroundColor: "ffffff" }} progress={progressValue} color={'#0277FD'} />
					<HistoryModal
						data={meetings}
						closePopup={this.goToHistory}
						openPopup={callModal}
					/>
					<View style={[AppStyles.container, styles.container, { backgroundColor: AppStyles.colors.backgroundColor }]}>
						<View style={{ paddingBottom: 100 }}>
							{
								matchData.length ?
									<View>
										<FlatList
											data={matchData}
											renderItem={(item, index) => (
												<View style={{ marginVertical: 3 }}>
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
														{this.checkStatus(item.item)}
													</View>
												</View>
											)}
											keyExtractor={(item, index) => item.id.toString()}
										/>
										<OfferModal
											leadData={leadData}
											offersData={offersData}
											active={modalActive}
											offerChat={offerChat}
											placeMyOffer={this.placeMyOffer}
											placeTheirOffer={this.placeTheirOffer}
											placeAgreedOffer={this.placeAgreedOffer}
											handleForm={this.handleForm}
											disableButton={disableButton}
											openModal={this.openChatModal}
										/>
									</View>
									:
									<>
									<Image source={require('../../../assets/images/no-result2.png')} resizeMode={'center'} style={{ alignSelf: 'center', width: 300, height: 300 }} />
									</>
							}
						</View>
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
						closeModal={() => this.closeModal()}
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

export default connect(mapStateToProps)(LeadOffer)