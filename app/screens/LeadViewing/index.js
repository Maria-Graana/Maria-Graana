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
			isMenuVisible: true
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
		axios.get(`/api/leads/${lead.id}/shortlist`)
			.then((res) => {
				this.setState({
					loading: false,
					matchData: res.data.rows,
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

	goToDiaryForm = () => {
		const { lead, navigation, user } = this.props
		navigation.navigate('AddDiary', {
			update: false,
			rcmLeadId: lead.id,
			agentId: user.id
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
		this.setState({ currentProperty: property, updateViewing: false })
	}

	updateProperty = (property) => {
		if (property.diaries.length) {
			if (property.diaries[0].status === 'pending') {
				let diary = property.diaries[0]
				let startReplace = ''
				if (diary.start) {
					startReplace = diary.start.replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1")
				}
				else {
					startReplace = diary.time.replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1")
				}
				let date = moment(diary.date).utcOffset(diary.date).format('YYYY-MM-DD')
				this.setState({
					currentProperty: property,
					viewing: {
						date: date,
						time: startReplace
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
			let start = moment(viewing.date + viewing.time, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:ss')
			let end = moment(start).add(1, 'hours').format('YYYY-MM-DDTHH:mm:ss')
			let body = {
				date: viewing.date,
				time: viewing.time,
				start: start,
				end: end,
				subject: diary.subject
			}
			axios.patch(`/api/diary/update?id=${diary.id}`, body)
				.then((res) => {
					this.setState({
						isVisible: false,
						loading: true
					})
					let timeStamp = helper.convertTimeZoneTimeStamp(res.data.start)
					let start = helper.convertTimeZone(res.data.start)
					let end = helper.convertTimeZone(res.data.end)
					let data = {
						title: res.data.subject,
						body: moment(start).format("hh:mm") + ' - ' + moment(end).format("hh:mm")
					}
					TimerNotification(data, timeStamp)
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
		let customerId= lead.customer && lead.customer.id
		let body = {
			date: viewing.date,
			time: viewing.time,
			propertyId: currentProperty.id,
			leadId: lead.id,
			subject: "Viewing with " + customer + " at " + areaName,
			customerId: customerId
		}
		axios.post(`/api/leads/viewing`, body)
			.then((res) => {
				this.setState({
					isVisible: false,
					loading: true
				})
				let timeStamp = helper.convertTimeZoneTimeStamp(res.data.start)
				let start = helper.convertTimeZone(res.data.start)
				let end = helper.convertTimeZone(res.data.end)
				let data = {
					title: res.data.subject,
					body: moment(start).format("hh:mm") + ' - ' + moment(end).format("hh:mm")
				}
				TimerNotification(data, timeStamp)
				this.fetchLead()
				this.fetchProperties()
			})
			.catch((error) => {
				console.log(error)
			})
	}

	checkStatus = (property) => {
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
						onPress={() => { this.openModal(); this.updateProperty(property) }}
					>
						<Text style={{ fontFamily: AppStyles.fonts.lightFont }}>Viewing at <Text style={{ color: AppStyles.colors.primaryColor, fontFamily: AppStyles.fonts.defaultFont }}>{moment(helper.convertTimeZone(property.diaries[0].start)).format('LLL')}</Text></Text>
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
					onPress={() => { this.openModal(); this.setProperty(property) }}
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
		if (property.diaries.length) {
			if (property.diaries[0].status === 'pending') {
				axios.delete(`/api/diary/delete?id=${property.diaries[0].id}`)
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

	deleteProperty = (property) => {
		axios.delete(`/api/leads/shortlisted?id=${property.id}`)
			.then((res) => {
				this.setState({ loading: true })
				this.fetchProperties()
			})
			.catch((error) => {
				console.log(error)
			})
	}

	render() {
		const { loading, matchData, user, isVisible, checkValidation, viewing, open, progressValue, menuShow, updateViewing, isMenuVisible } = this.state
		return (
			!loading ?
				<View style={{ flex: 1 }}>
					<View>
						<ProgressBar style={{ backgroundColor: "ffffff" }} progress={progressValue} color={'#0277FD'} />
					</View>
					<View style={[AppStyles.container, styles.container, { backgroundColor: AppStyles.colors.backgroundColor }]}>
						<View style={{ flex: 1 }}>
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
															isMenuVisible={isMenuVisible}
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
															isMenuVisible={isMenuVisible}
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