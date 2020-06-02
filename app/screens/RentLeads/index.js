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
import { widthPercentageToDP } from 'react-native-responsive-screen';

class RentLeads extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			language: '',
			leadsData: [],
			dotsDropDown: false,
			dropDownId: '',
			selectInventory: [],
			febDrawer: false,
			purposeTab: 'invest',
			statusFilter: 'all',
			open: false,
			sort: '&order=Desc&field=createdAt',
			loading: false,
			activeSortModal: false,
			totalLeads: 0,
			page: 1,
			pageSize: 20,
			onEndReachedLoader: false,
		}
	}

	componentDidMount() {
		this.fetchLeads(this.state.statusFilter);
		this._unsubscribe = this.props.navigation.addListener('focus', () => {
			this.fetchLeads(this.state.statusFilter);
		})
	}

	componentWillUnmount() {
		this.clearStateValues();
	}

	clearStateValues = () => {
		this.setState({
			page: 1,
			totalProperties: 0,
		})
	}

	fetchLeads = (statusFilter) => {
		const { sort, pageSize, page, leadsData } = this.state
		this.setState({ loading: true })
		let query = ``
		query = `/api/leads?purpose=rent&status=${this.state.statusFilter}${sort}&pageSize=${pageSize}&page=${page}`
		axios.get(`${query}`)
			.then((res) => {
				this.setState({
					leadsData: page === 1 ? res.data.rows : [...leadsData, ...res.data.rows],
					loading: false,
					onEndReachedLoader: false,
					totalLeads: res.data.count
				})
			})
	}

	showDropdown = (id) => {
		this.setState({
			dropDownId: id,
			dotsDropDown: !this.state.dotsDropDown
		})
	}

	selectInventory = (id) => {
		const { selectInventory } = this.state
		this.setState({
			selectInventory: [...selectInventory, id]
		})
	}

	unSelectInventory = (id) => {
		const { selectInventory } = this.state
		let index = selectInventory.indexOf(id)
		selectInventory.splice(index, 1)
		this.setState({ selectInventory: selectInventory })
	}

	goToFormPage = (page, status) => {
		const { navigation } = this.props;
		navigation.navigate(page, { 'pageName': status });
	}

	changeTab = (status) => {
		this.setState({
			purposeTab: status,
			statusFilter: 'all',
			sort: '&order=Desc&field=createdAt'
		}, () => {
			this.fetchLeads('all');
		})

	}

	changeStatus = (status) => {
		this.clearStateValues()
		this.setState({ statusFilter: status, leadsData: [] }, () => {
			this.fetchLeads(status);
		})
	}

	navigateTo = (data) => {
		const { purposeTab } = this.state
		this.props.navigation.navigate('LeadDetail', { lead: data, purposeTab: 'rent' })
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
		this.setState({ sort: status, activeSortModal: !this.state.activeSortModal }, () => { this.fetchLeads(this.state.statusFilter); })
	}

	openStatus = () => {
		this.setState({ activeSortModal: !this.state.activeSortModal })
	}

	setKey = (index) => {
		return String(index);
	}

	render() {
		const {
			selectInventory,
			dropDownId,
			purposeTab,
			leadsData,
			open,
			statusFilter,
			loading,
			activeSortModal,
			sort,
			totalLeads,
			onEndReachedLoader,
		} = this.state
		const { user } = this.props;
		let leadStatus = purposeTab === 'invest' ? StaticData.investmentFilter : StaticData.buyRentFilter
		return (
			<View style={[AppStyles.container, { marginBottom: 25 }]}>
				{/* ******************* TOP FILTER MAIN VIEW ********** */}
				<View style={[styles.mainFilter]}>
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
							<Text style={styles.sortText}>Sort</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={[AppStyles.container, styles.minHeight]}>
					<View style={[styles.mainInventoryTile,]}>

						{
							leadsData && leadsData && leadsData.length > 0 ?

								< FlatList
									data={leadsData}
									renderItem={({ item }) => (

										<LeadTile
											user={user}
											// key={key}
											showDropdown={this.showDropdown}
											dotsDropDown={this.state.dotsDropDown}
											selectInventory={this.selectInventory}
											selectedInventory={selectInventory}
											data={item}
											dropDownId={dropDownId}
											unSelectInventory={this.unSelectInventory}
											goToInventoryForm={this.goToInventoryForm}
											navigateTo={this.navigateTo}
											callNumber={this.callNumber}
										/>
									)}
									// ListEmptyComponent={<NoResultsComponent imageSource={require('../../../assets/images/no-result2.png')} />}
									onEndReached={() => {
										if (leadsData.length < totalLeads) {
											this.setState({
												page: this.state.page + 1,
												onEndReachedLoader: true
											}, () => {
												this.fetchLeads(statusFilter);
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
					</View>
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
				</View>
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
