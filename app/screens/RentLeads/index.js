import React from 'react';
import styles from './style'
import { View, Text, TouchableOpacity, Image, ScrollView, Linking, FlatList } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import PickerComponent from '../../components/Picker/index';
import { Fab, Button, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import SortImg from '../../../assets/img/sort.png'
import LoadingNoResult from '../../components/LoadingNoResult'
import OnLoadMoreComponent from "../../components/OnLoadMoreComponent";
import LeadTile from '../../components/LeadTile'
import axios from 'axios';
import helper from '../../helper'
import StaticData from '../../StaticData'
import { FAB } from 'react-native-paper';
import Loader from '../../components/loader';
import SortModal from '../../components/SortModal'
import { setlead } from '../../actions/lead';
import Search from '../../components/Search';
import { storeItem, getItem } from '../../actions/user';

class RentLeads extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			leadsData: [],
			statusFilter: '',
			open: false,
			sort: '',
			loading: false,
			activeSortModal: false,
			totalLeads: 0,
			page: 1,
			pageSize: 20,
			onEndReachedLoader: false,
			showSearchBar: false,
			searchText: '',
		}
	}

	componentDidMount() {
		this._unsubscribe = this.props.navigation.addListener('focus', () => {
			this.onFocus();
		})
	}

	componentWillUnmount() {
		this.clearStateValues();
	}

	onFocus = async () => {
		const sortValue = await this.getSortOrderFromStorage()
		const statusValue = await getItem('statusFilterRent');
		if (statusValue) {
			this.setState({ statusFilter: String(statusValue), sort: sortValue }, () => {
				this.fetchLeads()
			})
		}
		else {
			storeItem('statusFilterRent', 'all');
			this.setState({ statusFilter: 'all', sort: sortValue }, () => {
				this.fetchLeads()
			})
		}
	}

	getSortOrderFromStorage = async () => {
		const sortOrder = await getItem('sortRent');
		if (sortOrder) {
			return String(sortOrder);
		}
		else {
			storeItem('sortRent', '&order=Desc&field=updatedAt');
			return '&order=Desc&field=updatedAt';
		}
	}

	clearStateValues = () => {
		this.setState({
			page: 1,
			totalLeads: 0,
		})
	}

	fetchLeads = () => {
		const { sort, pageSize, page, leadsData, showSearchBar, searchText, statusFilter } = this.state
		this.setState({ loading: true })
		let query = ``
		if (showSearchBar && searchText !== '') {
			query = `/api/leads?purpose=rent&searchBy=name&q=${searchText}&pageSize=${pageSize}&page=${page}`
		}
		else {
			query = `/api/leads?purpose=rent&status=${statusFilter}${sort}&pageSize=${pageSize}&page=${page}`
		}
		axios.get(`${query}`)
			.then((res) => {
				this.setState({
					leadsData: page === 1 ? res.data.rows : [...leadsData, ...res.data.rows],
					loading: false,
					onEndReachedLoader: false,
					totalLeads: res.data.count,
					statusFilter: statusFilter,
				})
			}).catch((res) => {
				this.setState({
					loading: false,
				})
			})
	}

	goToFormPage = (page, status) => {
		const { navigation } = this.props;
		navigation.navigate(page, { 'pageName': status });
	}

	changeStatus = (status) => {
		this.clearStateValues()
		this.setState({ statusFilter: status, leadsData: [] }, () => {
			storeItem('statusFilterRent', status);
			this.fetchLeads();
		})
	}

	navigateTo = (data) => {
		this.props.dispatch(setlead(data))
		let page = ''
		if (data.status === 'open') {
			this.props.navigation.navigate('LeadDetail', { lead: data, purposeTab: 'rent' })
		} else {
			if (data.status === "viewing") {
				page = 'Viewing'
			}
			if (data.status === "offer") {
				page = 'Offer'
			}
			if (data.status === "propsure") {
				page = 'Propsure'
			}
			if (data.status === "payment") {
				page = 'Payment'
			}
			if (data.status === "payment" || data.status === 'closed_won' || data.status === 'closed_lost') {
				page = 'Payment'
			}
			this.props.navigation.navigate('RCMLeadTabs', {
				screen: page,
				params: { lead: data },
			})
		}

	}

	callNumber = (url) => {
		if (url != 'tel:null') {
			Linking.canOpenURL(url)
				.then(supported => {
					if (!supported) {
						console.log("Can't handle url: " + url);
					} else {
						return Linking.openURL(url)
					}
				}).catch(err => console.error('An error occurred', err));
		} else {
			helper.errorToast(`No Phone Number`)
		}
	}

	sendStatus = (status) => {
		this.setState({ sort: status, activeSortModal: !this.state.activeSortModal }, () => {
			storeItem('sortRent', status);
			this.fetchLeads();
		})
	}

	openStatus = () => {
		this.setState({ activeSortModal: !this.state.activeSortModal })
	}

	setKey = (index) => {
		return String(index);
	}

	clearAndCloseSearch = () => {
		this.setState({ searchText: '', showSearchBar: false }, () => {
			this.clearStateValues();
			this.fetchLeads()
		})
	}

	updateStatus = (data) => {
		var leadId = []
		leadId.push(data.id)
		if (data.status === 'open') {
			axios.patch(`/api/leads`,
				{
					status: 'called'
				}, { params: { id: leadId } })
				.then((res) => {
					this.fetchLeads()
				})
				.catch((error) => {
					console.log(`ERROR: /api/leads/?id=${data.id}`, error)
				})
		}
	}

	render() {
		const {
			leadsData,
			open,
			statusFilter,
			loading,
			activeSortModal,
			sort,
			totalLeads,
			onEndReachedLoader,
			searchText,
			showSearchBar,
		} = this.state
		const { user } = this.props;
		let leadStatus = StaticData.buyRentFilter
		return (
			<View style={[AppStyles.container, { marginBottom: 25, paddingHorizontal: 0 }]}>
				{/* ******************* TOP FILTER MAIN VIEW ********** */}
				<View style={{ marginBottom: 15 }}>
					{
						showSearchBar ? <View style={[styles.filterRow, { paddingBottom: 0, paddingTop: 0, paddingLeft: 0 }]}>
							<Search
								containerWidth="100%"
								placeholder='Search leads here'
								searchText={searchText}
								setSearchText={(value) => this.setState({ searchText: value })}
								showShadow={false}
								showClearButton={true}
								returnKeyType={'search'}
								onSubmitEditing={() => this.fetchLeads()}
								autoFocus={true}
								closeSearchBar={() => this.clearAndCloseSearch()}
							/>
						</View>
							:
							<View style={[styles.filterRow, { paddingHorizontal: 15 }]}>
								<View style={styles.pickerMain}>
									<PickerComponent
										placeholder={'Lead Status'}
										data={leadStatus}
										customStyle={styles.pickerStyle}
										customIconStyle={styles.customIconStyle}
										onValueChange={this.changeStatus}
										selectedItem={statusFilter}
									/>
								</View>
								<View style={styles.stylesMainSort}>
									<TouchableOpacity style={styles.sortBtn} onPress={() => { this.openStatus() }}>
										<Image source={SortImg} style={[styles.sortImg]} />
									</TouchableOpacity>
									<Ionicons style={{ alignSelf: 'center' }}
										onPress={() => {
											this.setState({ showSearchBar: true }, () => {
												this.clearStateValues();
											})
										}}
										name={'ios-search'}
										size={26}
										color={AppStyles.colors.primaryColor} />
								</View>
							</View>
					}
				</View>
				{
					leadsData && leadsData.length > 0 ?
						< FlatList
							data={leadsData}
							contentContainerStyle={styles.paddingHorizontal}
							renderItem={({ item }) => (
								<LeadTile
									updateStatus={this.updateStatus}
									dispatch={this.props.dispatch}
									purposeTab={'rent'}
									user={user}
									data={item}
									navigateTo={this.navigateTo}
									callNumber={this.callNumber}
								/>
							)}
							onEndReached={() => {
								if (leadsData.length < totalLeads) {
									this.setState({
										page: this.state.page + 1,
										onEndReachedLoader: true
									}, () => {
										this.fetchLeads();
									});
								}
							}}
							onEndReachedThreshold={0.5}
							keyExtractor={(item, index) => this.setKey(index)}
						/>
						:
						<LoadingNoResult loading={loading} />
				}
				<OnLoadMoreComponent onEndReached={onEndReachedLoader} />
				<FAB.Group
					open={open}
					icon="plus"
					style={{ marginBottom: 16 }}
					fabStyle={{ backgroundColor: AppStyles.colors.primaryColor }}
					color={AppStyles.bgcWhite.backgroundColor}
					actions={[
						{ icon: 'plus', label: 'Investment Lead', color: AppStyles.colors.primaryColor, onPress: () => this.goToFormPage('AddCMLead', 'CM') },
						{ icon: 'plus', label: 'Buy/Rent Lead', color: AppStyles.colors.primaryColor, onPress: () => this.goToFormPage('AddRCMLead', 'RCM') },

					]}
					onStateChange={({ open }) => this.setState({ open })}
				/>
				<SortModal
					sendStatus={this.sendStatus}
					openStatus={this.openStatus}
					data={StaticData.sortData}
					doneStatus={activeSortModal}
					sort={sort}
				/>
			</View>
		)
	}
}

mapStateToProps = (store) => {
	return {
		user: store.user.user
	}
}
export default connect(mapStateToProps)(RentLeads)
