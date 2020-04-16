import * as React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import MatchTile from '../../components/MatchTile/index';
import AgentTile from '../../components/AgentTile/index';
import { Fab, Button, Icon } from 'native-base';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Loader from '../../components/loader';
import _ from 'underscore';
import OfferModal from '../../components/OfferModal'
import { FAB } from 'react-native-paper';

class LeadOffer extends React.Component {
	constructor(props) {
		super(props)
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

	openChatModal = () => {
		const { modalActive } = this.state
		this.setState({
			modalActive: !modalActive,
		}, () => {
			if (!this.state.modalActive) {
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
				this.setState({ offerChat: res.data.rows })
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
			axios.post(`/api/offer?leadId=${lead.id}&shortlistedPropId=${currentProperty.id}`, body)
				.then((res) => {
					this.fetchOffers()
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}


	goToDiaryForm = () => {
		const { lead, navigation } = this.props
		navigation.navigate('AddDiary', {
			update: false,
			leadId: lead.id
		});
	}

	goToAttachments = () => {
		const { lead, navigation } = this.props
		navigation.navigate('Attachments', { leadId: lead.id });
	}

	goToComments = () => {
		const { lead, navigation } = this.props
		navigation.navigate('Comments', { leadId: lead.id });
	}

	placeAgreedOffer = () => {
		const { leadData, currentProperty } = this.state
		const { lead } = this.props
		if (leadData.agreed && leadData.agreed !== '') {
			let body = {
				offer: leadData.agreed,
				type: 'agreed'
			}
			axios.post(`/api/offer?leadId=${lead.id}&shortlistedPropId=${currentProperty.id}`, body)
				.then((res) => {
					this.fetchOffers()
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}

	checkStatus = (property) => {
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
					onPress={() => { this.openChatModal(); this.setProperty(property) }}
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
					onPress={() => { this.openChatModal(); this.setProperty(property) }}
				>
					<Text style={{ color: AppStyles.colors.primaryColor, fontFamily: AppStyles.fonts.defaultFont }}> PLACE OFFER</Text>
				</TouchableOpacity >
			)
		}
	}

	render() {
		const { loading, matchData, user, modalActive, offersData, offerChat, open } = this.state
		return (
			!loading ?
				<View style={[AppStyles.container, styles.container, { backgroundColor: AppStyles.colors.backgroundColor }]}>
					<View style={{ flex: 1 }}>
						{
							matchData.length ?
								<View>
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
										offersData={offersData}
										active={modalActive}
										offerChat={offerChat}
										placeMyOffer={this.placeMyOffer}
										placeTheirOffer={this.placeTheirOffer}
										placeAgreedOffer={this.placeAgreedOffer}
										handleForm={this.handleForm}
										openModal={this.openChatModal}
									/>
								</View>
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