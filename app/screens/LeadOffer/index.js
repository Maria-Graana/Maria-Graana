import * as React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import MatchTile from '../../components/MatchTile/index';
import AgentTile from '../../components/AgentTile/index';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import Loader from '../../components/loader';
import _ from 'underscore';
import OfferModal from '../../components/OfferModal'

class LeadOffer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			modalActive: false,
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
		console.log('**************')
		this.setState({
			modalActive: !this.state.modalActive
		})
	}

	render() {
		const { loading, matchData, user, modalActive } = this.state
		return (
			!loading ?
				<View style={[AppStyles.container, styles.container, { backgroundColor: AppStyles.colors.backgroundColor }]}>
					<View>
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
													<TouchableOpacity
														style={{
															backgroundColor: 'white',
															height: 30,
															borderBottomEndRadius: 10,
															borderBottomLeftRadius: 10,
															justifyContent: "center",
															alignItems: "center"
														}}
														onPress={() => { this.openChatModal() }}
													>
														<Text style={{ color: AppStyles.colors.primaryColor, fontFamily: AppStyles.fonts.defaultFont }}> BOOK VIEWING</Text>
													</TouchableOpacity>
												</View>
											</View>
										)}
										keyExtractor={(item, index) => item.id.toString()}
									/>
									{console.log(modalActive)}
									<OfferModal
										active={modalActive}
										openModal={this.openChatModal}
									/>
								</View>
								:
								<Image source={require('../../../assets/images/no-result2.png')} resizeMode={'center'} style={{ flex: 1, alignSelf: 'center', width: 300, height: 300 }} />
						}
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

export default connect(mapStateToProps)(LeadOffer)