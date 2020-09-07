import * as React from 'react';
import styles from './style'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import MatchTile from '../../components/MatchTile/index';
import AgentTile from '../../components/AgentTile/index';
import axios from 'axios';
import Loader from '../../components/loader';
import AddViewing from '../../components/AddViewing/index';
import _ from 'underscore';
import moment from 'moment';
import { FAB } from 'react-native-paper';
import { ProgressBar } from 'react-native-paper';
import StaticData from '../../StaticData';
import { setlead } from '../../actions/lead';
import helper from '../../helper';
import TimerNotification from '../../LocalNotifications';
import CMBottomNav from '../../components/CMBottomNav'
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'

class LeadViewing extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isVisible: false,
			open: false,
			loading: true,
			viewing: {
				date: '',
				time: ''
			},
			checkValidation: false,
			currentProperty: {},
			progressValue: 0,
			menuShow: false,
			updateViewing: false,
			isMenuVisible: true,
			// for the lead close dialog
			isCloseLeadVisible: false,
			checkReasonValidation: false,
			selectedReason: '',
			reasons: [],
			closedLeadEdit: this.props.lead.status !== StaticData.Constants.lead_closed_lost && this.props.lead.status !== StaticData.Constants.lead_closed_won,
		}
	}

	componentDidMount = () => {
		this._unsubscribe = this.props.navigation.addListener('focus', () => {
			this.fetchLead()
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

	openModal = () => {
		const { isVisible } = this.state
		this.setState({
			isVisible: !isVisible
		})
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

	closedLead = () => {
		helper.leadClosedToast()
	}

	closeLead = () => {
		const { user, lead } = this.props;
		var commissionPayment = this.props.lead.commissionPayment
		if (user.id === lead.assigned_to_armsuser_id) {
			if (commissionPayment !== null) {
				this.setState({ reasons: StaticData.leadCloseReasonsWithPayment, isVisible: true, checkReasonValidation: '' })
			}
			else {
				this.setState({ reasons: StaticData.leadCloseReasons, isVisible: true, checkReasonValidation: '' })
			}
		}
		else {
			helper.leadNotAssignedToast()
		}

	}

	onHandleCloseLead = () => {
		const { navigation, lead } = this.props
		const { selectedReason } = this.state;
		let payload = Object.create({});
		payload.reasons = selectedReason;
		axios.patch(`/api/leads/?id=${lead.id}`, payload).then(response => {
			this.setState({ isVisible: false }, () => {
				helper.successToast(`Lead Closed`)
				navigation.navigate('Leads');
			});
		}).catch(error => {
			console.log(error);
		})
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

	setProperty = (property) => {
		const { viewing } = this.state;
		viewing['date'] = '';
		viewing['time'] = '';
		this.setState({ currentProperty: property, updateViewing: false })
	}

	updateProperty = (property) => {
		if (property.diaries.length) {
			if (property.diaries[0].status === 'pending') {
				let diary = property.diaries[0]
				let date = moment(diary.date);
				this.setState({
					currentProperty: property,
					viewing: {
						date: date,
						time: diary.start
					},
					updateViewing: true
				})
			}
		}
	}

	handleForm = (value, name) => {
		const { viewing } = this.state
		viewing[name] = value
		this.setState({ viewing })
	}

	submitViewing = () => {
		const { viewing, updateViewing } = this.state
		if (!viewing.time || !viewing.date) {
			this.setState({
				checkValidation: true
			})
		} else {
			if (updateViewing) this.updateViewing()
			else this.createViewing()
		}
	}

	updateViewing = () => {
		const { viewing, currentProperty } = this.state
		const { lead } = this.props
		if (currentProperty.diaries.length) {
			let diary = currentProperty.diaries[0]
			let start = helper.formatDateAndTime(helper.formatDate(viewing.date), viewing.time);
			let end = moment(start).add(1, 'hours').format('YYYY-MM-DDTHH:mm:ssZ')
			let body = {
				date: start,
				time: start,
				start: start,
				end: end,
				subject: diary.subject,
				taskCategory: 'leadTask',
			}
			axios.patch(`/api/diary/update?id=${diary.id}`, body)
				.then((res) => {
					this.setState({
						isVisible: false,
						loading: true
					})
					let start = new Date(res.data.start)
					let end = new Date(res.data.end)
					let data = {
						id: res.data.id,
						title: res.data.subject,
						body: moment(start).format("hh:mm") + ' - ' + moment(end).format("hh:mm")
					}
					helper.deleteAndUpdateNotification(data, start, res.data.id)
					this.fetchLead()
					this.fetchProperties()
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}

	createViewing = () => {
		const { viewing, currentProperty } = this.state
		const { lead } = this.props
		let customer = lead.customer && lead.customer.customerName && helper.capitalize(lead.customer.customerName) || ''
		let areaName = currentProperty.area && currentProperty.area.name && currentProperty.area.name || ''
		let customerId = lead.customer && lead.customer.id
		let start = helper.formatDateAndTime(helper.formatDate(viewing.date), viewing.time);
		let end = moment(start).add(1, 'hours').format('YYYY-MM-DDTHH:mm:ssZ')
		let body = {
			date: start,
			time: start,
			start: start,
			end: end,
			propertyId: currentProperty.id,
			leadId: lead.id,
			subject: "Viewing with " + customer + " at " + areaName,
			taskCategory: 'leadTask',
			customerId: customerId
		}
		axios.post(`/api/leads/viewing`, body)
			.then((res) => {
				this.setState({
					isVisible: false,
					loading: true,
				})
				let start = new Date(res.data.start)
				let end = new Date(res.data.end)
				let data = {
					id: res.data.id,
					title: res.data.subject,
					body: moment(start).format("hh:mm") + ' - ' + moment(end).format("hh:mm")
				}
				TimerNotification(data, start)
				this.fetchLead()
				this.fetchProperties()
			})
			.catch((error) => {
				console.log(error)
			})
	}

	checkStatus = (property) => {
		const { lead, user } = this.props;
		if (property.diaries.length) {
			if (property.diaries[0].status === 'completed') {
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
						<Text style={{ color: 'white', fontFamily: AppStyles.fonts.defaultFont }}>VIEWING DONE</Text>
					</TouchableOpacity >
				)
			} else if (property.diaries[0].status === 'pending') {
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
							if (lead.status === StaticData.Constants.lead_closed_lost || lead.status === StaticData.Constants.lead_closed_won) {
								helper.leadClosedToast();
							} else if (user.id !== lead.assigned_to_armsuser_id) {
								helper.leadNotAssignedToast();
							}
							else {
								this.openModal();
								this.updateProperty(property)
							}
						}}
					>
						<Text style={{ fontFamily: AppStyles.fonts.lightFont }}>Viewing at <Text style={{ color: AppStyles.colors.primaryColor, fontFamily: AppStyles.fonts.defaultFont }}>{moment(property.diaries[0].start).format('LLL')}</Text></Text>
					</TouchableOpacity >
				)
			}
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
						if (lead.status === StaticData.Constants.lead_closed_lost || lead.status === StaticData.Constants.lead_closed_won) {
							helper.leadClosedToast();

						}
						else if (user.id !== lead.assigned_to_armsuser_id) {
							helper.leadNotAssignedToast();
						}
						else {
							this.openModal();
							this.setProperty(property)
						}

					}}
				>
					<Text style={{ color: AppStyles.colors.primaryColor, fontFamily: AppStyles.fonts.defaultFont }}>BOOK VIEWING</Text>
				</TouchableOpacity >
			)
		}
	}

	doneViewing = (property) => {
		if (property.diaries.length) {
			if (property.diaries[0].status === 'pending') {
				let body = {
					status: 'completed'
				}

				axios.patch(`/api/diary/update?id=${property.diaries[0].id}`, body)
					.then((res) => {
						this.setState({ loading: true })
						this.fetchProperties()
					})
					.catch((error) => {
						console.log(error)
					})
			}
		}
	}

	cancelViewing = (property) => {
		const { lead } = this.props;
		if (property.diaries.length) {
			if (property.diaries[0].status === 'pending') {
				axios.delete(`/api/diary/delete?id=${property.diaries[0].id}&propertyId=${property.id}&leadId=${lead.id}`)
					.then((res) => {
						this.setState({ loading: true })
						helper.deleteLocalNotification(property.diaries[0].id)
						this.fetchProperties()
					})
					.catch((error) => {
						console.log(error)
					})
			}
		}
	}

	deleteProperty = (property) => {
		axios.delete(`/api/leads/shortlisted?id=${property.id}`)
			.then((res) => {
				if (res.status === 200) {
					if (res.data.message) {
						helper.errorToast(res.data.message)
					}
					else {
						this.setState({ loading: true })
						this.fetchProperties()
					}
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	navigateToDetails = () => {
		this.props.navigation.navigate('LeadDetail', { lead: this.props.lead, purposeTab: 'sale' })
	}

	showMenuItem = () => {
		const { lead, user } = this.props;
		if ((lead.status === StaticData.Constants.lead_closed_won || lead.status === StaticData.Constants.lead_closed_lost) || user.id !== lead.assigned_to_armsuser_id) {
			return false;
		}
		else {
			return true;
		}

	}


	render() {
		const { loading, matchData, isVisible, checkValidation, viewing, progressValue, updateViewing, isMenuVisible, reasons, selectedReason, isCloseLeadVisible, checkReasonValidation, closedLeadEdit } = this.state
		const { lead, user } = this.props;
		const showMenuItem = this.showMenuItem();
		return (
			!loading ?
				<View style={{ flex: 1 }}>
					<View>
						<ProgressBar style={{ backgroundColor: "ffffff" }} progress={progressValue} color={'#0277FD'} />
					</View>
					<View style={[AppStyles.container, styles.container, { backgroundColor: AppStyles.colors.backgroundColor }]}>
						<View style={{ paddingBottom: 100 }}>
							<AddViewing
								update={updateViewing}
								onPress={this.submitViewing}
								handleForm={this.handleForm}
								openModal={this.openModal}
								viewing={viewing}
								checkValidation={checkValidation}
								isVisible={isVisible} />
							{
								matchData.length ?
									<FlatList
										data={matchData}
										renderItem={(item, index) => (
											<View style={{ marginVertical: 3 }}>
												{
													this.ownProperty(item.item) ?
														<MatchTile
															deleteProperty={this.deleteProperty}
															cancelViewing={this.cancelViewing}
															doneViewing={this.doneViewing}
															isMenuVisible={showMenuItem && isMenuVisible}
															data={item.item}
															user={user}
															displayChecks={this.displayChecks}
															showCheckBoxes={false}
															addProperty={this.addProperty}
														/>
														:
														<AgentTile
															deleteProperty={this.deleteProperty}
															cancelViewing={this.cancelViewing}
															doneViewing={this.doneViewing}
															isMenuVisible={showMenuItem && isMenuVisible}
															data={item.item}
															user={user}
															displayChecks={this.displayChecks}
															showCheckBoxes={false}
															addProperty={this.addProperty}
														/>
												}
												<View>
													{
														this.checkStatus(item.item)
													}
												</View>
											</View>
										)}
										keyExtractor={(item, index) => item.id.toString()}
									/>
									:
									<Image source={require('../../../assets/images/no-result2.png')} resizeMode={'center'} style={{ flex: 1, alignSelf: 'center', width: 300, height: 300 }} />
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

export default connect(mapStateToProps)(LeadViewing)