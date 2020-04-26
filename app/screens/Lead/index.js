import React from 'react';
import styles from './style'
import { View, Text, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { connect } from 'react-redux';
import AppStyles from '../../AppStyles'
import PickerComponent from '../../components/Picker/index';
import { Fab, Button, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import SortImg from '../../../assets/img/sort.png'
import LoadingNoResult from '../../components/LoadingNoResult'
import LeadTile from '../../components/LeadTile'
import axios from 'axios';
import helper from '../../helper'
import StaticData from '../../StaticData'
import { FAB } from 'react-native-paper';


class Inventory extends React.Component {
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
			loading: false,
		}

	}

	componentDidMount() {
		this.fetchLeads('invest', 'all');
	}

	componentWillUnmount() {
	}

	fetchLeads = (purposeTab, statusFilter) => {
		const { sort } = this.state
		this.setState({
			loading: true,
			sort: !sort,
		})
		let query = ``
		let sortVar = ''
		if(sort === true){
			sortVar = `&order=Desc&field=updatedAt`
		}else{
			sortVar = `&order=Desc&field=createdAt`
		}

		if (purposeTab === 'invest') {
			query = `/api/leads/projects?all=${true}&status=${statusFilter}${sortVar != '' && sortVar}`
		} else {
			query = `/api/leads?purpose=${purposeTab}&status=${statusFilter}${sortVar != '' && sortVar}`
		}
		axios.get(`${query}`)
			.then((res) => {
				this.setState({
					leadsData: res.data,
					loading: false,
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
		this.setState({
			selectInventory: selectInventory,
		})
	}

	goToFormPage = (page, status) => {
		const { navigation } = this.props;
		navigation.navigate(page, { 'pageName': status });
	}

	changeTab = (status) => {
		this.setState({ purposeTab: status })
		this.fetchLeads(status, this.state.statusFilter);
	}

	changeStatus = (status) => {
		this.setState({ statusFilter: status })
		this.fetchLeads(this.state.purposeTab, status);
	}

	navigateTo = (data) => {
		const { purposeTab } = this.state
		this.props.navigation.navigate('LeadDetail', { lead: data, purposeTab: purposeTab })
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

	render() {
		const { selectInventory, dropDownId, purposeTab, leadsData, open, statusFilter, loading } = this.state
		let leadStatus = purposeTab === 'invest' ? StaticData.investmentFilter : StaticData.buyRentFilter
		return (
			<View>

				{/* ******************* TAb BUTTON VIEW ******* */}
				<View style={styles.mainTopTabs}>

					<View style={styles.mainTabs}>
						<TouchableOpacity style={[styles.tabBtnStyle, purposeTab === 'invest' && styles.activeTab]} onPress={() => { this.changeTab('invest') }}>
							<Text style={AppStyles.textCenter}>INVEST</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.mainTabs}>
						<TouchableOpacity style={[styles.tabBtnStyle, purposeTab === 'sale' && styles.activeTab]} onPress={() => { this.changeTab('sale') }}>
							<Text style={AppStyles.textCenter}>BUY</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.mainTabs}>
						<TouchableOpacity style={[styles.tabBtnStyle, purposeTab === 'rent' && styles.activeTab]} onPress={() => { this.changeTab('rent') }}>
							<Text style={AppStyles.textCenter}>RENT</Text>
						</TouchableOpacity>
					</View>

				</View>

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
						<TouchableOpacity style={styles.sortBtn} onPress={() => {this.fetchLeads(purposeTab, statusFilter)}}>
							<Image source={SortImg} style={[styles.sortImg]} />
							<Text style={styles.sortText}>Sort</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={[AppStyles.container, styles.minHeight]}>
					<View style={[styles.mainInventoryTile,]}>
						<ScrollView>
							{
								console.log(leadsData)
							}
							{
								leadsData && leadsData.rows && leadsData.rows.length > 0 ?
									leadsData.rows.map((item, key) => {
										return (
											<LeadTile
												key={key}
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
										)
									})
									:
									<LoadingNoResult loading={loading}/>
							}
						</ScrollView>

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

			</View>
		)
	}
}

mapStateToProps = (store) => {
	return {
		user: store.user.user
	}
}

export default connect(mapStateToProps)(Inventory)
