import * as React from 'react';
import styles from './style'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import Ability from '../../hoc/Ability';
import MatchTile from '../../components/MatchTile/index';
import AgentTile from '../../components/AgentTile/index';
import { Fab, Button, Icon } from 'native-base';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Loader from '../../components/loader';
import AddViewing from '../../components/AddViewing/index';
import _ from 'underscore';
import moment from 'moment';

class LeadViewing extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isVisible: false,
			active: false,
			loading: true,
			viewing: {
				date: '',
				time: ''
			},
			checkValidation: false,
			currentProperty: {}
		}
	}

	componentDidMount = () => {
		this._unsubscribe = this.props.navigation.addListener('focus', () => {
			this.fetchProperties()
		})
	}

	fetchProperties = () => {
		const { lead } = this.props
		axios.get(`/api/leads/${lead.id}/shortlist`)
			.then((res) => {
				this.setState({
					loading: false,
					matchData: res.data.rows
				})
			})
			.catch((error) => {
				console.log(error)
				this.setState({
					loading: false,
				})
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
		if ('armsuser' in property && property.armsuser) {
			return user.id === property.armsuser.id
		} else if ('user' in property && property.user) {
			return user.id === property.user.id
		} else {
			return false
		}
	}

	goToDiaryForm = () => {
		const { lead, navigation } = this.props
		this.setState({ active: false })
		navigation.navigate('AddDiary', {
			update: false,
			leadId: lead.id
		});
	}

	goToAttachments() {
		const { lead, navigation } = this.props
		this.setState({ active: false })
		navigation.navigate('Attachments', { leadId: lead.id });
	}

	goToComments() {
		const { lead, navigation } = this.props
		this.setState({ active: false })
		navigation.navigate('Comments', { leadId: lead.id });
	}

	setProperty = (property) => {
		this.setState({ currentProperty: property })
	}

	handleForm = (value, name) => {
		const { viewing } = this.state
		viewing[name] = value
		this.setState({ viewing })
	}

	submitViewing = () => {
		const { viewing } = this.state
		if (!viewing.time || !viewing.date) {
			this.setState({
				checkValidation: true
			})
		} else {
			this.createViewing()
		}
	}

	createViewing = () => {
		const { viewing, currentProperty } = this.state
		const { lead } = this.props
		let body = {
			date: viewing.date,
			time: viewing.time,
			propertyId: currentProperty.id,
			leadId: lead.id
		}
		axios.post(`/api/leads/viewing`, body)
			.then((res) => {
				this.setState({
					isVisible: false,
					loading: true
				})
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
					>
						<Text style={{ fontFamily: AppStyles.fonts.lightFont }}>Viewing at <Text style={{ color: AppStyles.colors.primaryColor, fontFamily: AppStyles.fonts.defaultFont }}>{moment(property.diaries[0].start).format("YYYY-MM-DD hh:mm a")}</Text></Text>
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

	render() {
		const { loading, matchData, user, isVisible, checkValidation, viewing, active } = this.state
		return (
			!loading ?
				<View style={[AppStyles.container, styles.container, { backgroundColor: AppStyles.colors.backgroundColor }]}>
					<View style={{ opacity: active ? 0.3 : 1, flex: 1 }}>
						<AddViewing
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
										<View style={{ marginVertical: 10 }}>
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
														doneViewing={this.doneViewing}
														menuShow={true}
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