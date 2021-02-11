/** @format */

import * as RootNavigation from '../../navigation/RootNavigation'

import { Alert, FlatList, Image, Text, View } from 'react-native'
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

import Ability from '../../hoc/Ability'
import { ActionSheet } from 'native-base'
import AppStyles from '../../AppStyles'
import { Fab } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import Loader from '../../components/loader'
import NoResultsComponent from '../../components/NoResultsComponent'
import PropertyTile from '../../components/PropertyTile'
import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import helper from '../../helper'
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent';
import GraanaPropertiesModal from '../../components/GraanaPropertiesStatusModal'
import StaticData from '../../StaticData'
import { isEmpty } from 'underscore'
import styles from './style';
import PickerComponent from '../../components/Picker'
import Search from '../../components/Search'

var BUTTONS = ['Delete', 'Cancel']
var CANCEL_INDEX = 1

class GraanaInventories extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			propertiesList: [],
			totalProperties: 0,
			loading: true,
			page: 1,
			pageSize: 20,
			onEndReachedLoader: false,
			graanaModalActive: false,
			singlePropertyData: {},
			forStatusPrice: false,
			showSearchBar: false,
			searchText: '',
			statusFilter: 'published',
			searchBy: 'id',
			selectedArea: null,
			formData: {
				amount: '',
			}
		}


	}

	componentDidMount() {
		const { navigation } = this.props;
		let that = this;
		this._unsubscribe = navigation.addListener('focus', () => {
			const { route } = that.props
			if (route.params && route.params.selectedArea) {
				const { selectedArea } = route.params;
				if (selectedArea) {
					this.setState({ selectedArea }, () => {
						this.getPropertyGraanaListing()
					})
				}
			}
			else {
				this.getPropertyGraanaListing()
			}
		})
	}


	componentWillUnmount() {
		this.clearStateValues();
		this._unsubscribe();
	}

	clearStateValues = () => {
		this.setState({
			page: 1,
			totalProperties: 0,
		})
	}

	getPropertyGraanaListing = () => {
		const { propertiesList, page, pageSize, statusFilter, searchBy, showSearchBar, searchText, selectedArea } = this.state;
		let query = ``
		if (showSearchBar && searchBy === 'id' && searchText !== '') {
			// Search By ID
			query = `/api/inventory/all?propType=graana&searchBy=id&q=${searchText}&pageSize=${pageSize}&page=${page}`
		}
		else if (showSearchBar && searchBy === 'area' && selectedArea) {
			// Search By Area
			query = `/api/inventory/all?propType=graana&searchBy=area&q=${selectedArea.id}&pageSize=${pageSize}&page=${page}`
		  }
		else {
			// Only Status Filter
			query = `/api/inventory/all?propType=graana&propStatus=${statusFilter}&pageSize=${pageSize}&page=${page}`
		}
		axios.get(query).then((response) => {
			if (response.status == 200) {
				this.setState({
					propertiesList: page === 1 ? response.data.rows : [...propertiesList, ...response.data.rows],
					totalProperties: response.data.count,
					onEndReachedLoader: false,
					loading: false,
				});
			}
		}).catch((error) => {
			console.log('error', error);
			this.setState({ loading: false })
		})
	}

	goToInventoryForm = () => {
		RootNavigation.navigate('AddInventory');
	}

	deleteProperty = (id) => {
		let endPoint = ``
		let that = this;
		endPoint = `api/inventory/${id}`
		axios.delete(endPoint).then(function (response) {
			if (response.status === 200) {
				helper.successToast('PROPERTY DELETED SUCCESSFULLY!')
				that.setState({ loading: true }, () => {
					that.getPropertyGraanaListing();
				})
			}

		}).catch(function (error) {
			that.setState({ loading: false })
			helper.successToast(error.message)
		})

	}

	onHandlePress = (data) => {
		const { navigation } = this.props;
		navigation.navigate('PropertyDetail', { property: data, update: true, editButtonHide: true, screenName: 'GraanaInventories' })
	}

	onHandleLongPress = (val) => {
		ActionSheet.show(
			{
				options: BUTTONS,
				cancelButtonIndex: CANCEL_INDEX,
				title: 'Select an Option',
			},
			buttonIndex => {
				if (buttonIndex === 0) {
					//Delete
					this.showDeleteDialog(val);
				}
			}
		);
	}

	showDeleteDialog(id) {
		Alert.alert('Delete Property', 'Are you sure you want to delete this property ?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Delete', onPress: () => this.deleteProperty(id) },
		],
			{ cancelable: false })
	}

	onHandleOnCall = (data) => {
		const { contacts } = this.props
		let newContact = helper.createContactPayload(data.customer)
		let firstName = data.customer && data.customer.first_name && data.customer.first_name
		let last_name = data.customer && data.customer.last_name && data.customer.last_name
		newContact.name = firstName + ' ' + last_name
		helper.callNumber(newContact, contacts)
	}

	setKey = (index) => {
		return String(index);
	}

	graanaVerifeyModal = (status, id) => {
		const { propertiesList } = this.state
		if (status === true) {
			var filterProperty = propertiesList.find((item) => { return item.id === id && item })
			this.setState({
				singlePropertyData: filterProperty,
				graanaModalActive: status,
				forStatusPrice: false,
			})
		} else {
			this.setState({
				graanaModalActive: status,
				forStatusPrice: false,
			})
		}
	}

	graanaStatusSubmit = (data, graanaStatus) => {
		if (graanaStatus === 'sold') {
			this.setState({
				forStatusPrice: true,
			})
		} else if (graanaStatus === 'rented') {
			this.setState({
				forStatusPrice: true,
			})
		} else {
			this.submitGraanaStatusAmount('other')
		}
	}

	handleForm = (value, name) => {
		const { formData } = this.state
		const newFormData = formData
		newFormData[name] = value
		this.setState({ formData: newFormData })
	}

	submitGraanaStatusAmount = (check) => {
		const { singlePropertyData, formData } = this.state
		var endpoint = ''
		var body = {
			amount: formData.amount
		}
		if (check === 'amount') {
			endpoint = `api/inventory/verifyProperty?id=${singlePropertyData.id}`, body
		} else {
			endpoint = `api/inventory/verifyProperty?id=${singlePropertyData.id}`
		}
		formData['amount'] = ''
		axios.patch(endpoint)
			.then((res) => {
				this.setState({
					forStatusPrice: false,
					graanaModalActive: false,
					formData,
				}, () => {
					helper.successToast(res.data)
				})
			})
	}

	changeStatus = (status) => {
		this.clearStateValues()
		this.setState({ statusFilter: status, propertiesList: [], loading: true }, () => {
			this.getPropertyGraanaListing();
		})
	}

	clearAndCloseSearch = () => {
		this.setState({ searchText: '', showSearchBar: false, selectedArea: null, loading: true, searchBy: 'id', statusFilter: 'published' }, () => {
			this.clearStateValues();
			this.getPropertyGraanaListing();
		})
	}

	changeSearchBy = (searchBy) => {
		this.setState({ searchBy, selectedArea: null });
	}


	handleSearchByArea = () => {
		const { navigation } = this.props;
		const { selectedArea } = this.state;
		navigation.navigate('AssignedAreas', { screenName: 'Graana.com', selectedArea });
	}

	render() {
		const {
			propertiesList,
			loading,
			totalProperties,
			onEndReachedLoader,
			graanaModalActive,
			singlePropertyData,
			forStatusPrice,
			formData,
			searchBy,
			searchText,
			statusFilter,
			showSearchBar,
			selectedArea
		} = this.state;
		const {user} = this.props;
		return (
			!loading ?
				<View style={[styles.container, { marginBottom: 25 }]}>
					{showSearchBar ? (
						<View style={[styles.filterRow, { paddingBottom: 0, paddingTop: 0, paddingLeft: 0, flexDirection: 'row', alignItems: 'center' }]}>
							<View style={[styles.pickerMain, { width: '20%', marginLeft: 10 }]}>
								<PickerComponent
									placeholder={'Search By'}
									data={helper.checkPP(user) ? StaticData.searchByIdOnly : StaticData.searchBy}
									customStyle={styles.pickerStyle}
									customIconStyle={styles.customIconStyle}
									onValueChange={this.changeSearchBy}
									selectedItem={searchBy}
								/>
							</View>
							{
								searchBy === 'id' ? <Search
									containerWidth={'80%'}
									placeholder={"Search by ID"}
									searchText={searchText}
									setSearchText={(value) => this.setState({ searchText: value })}
									showShadow={false}
									showClearButton={true}
									returnKeyType={'search'}
									onSubmitEditing={() => this.setState({ loading: true }, () => { this.getPropertyGraanaListing() })}
									closeSearchBar={() => this.clearAndCloseSearch()}
								/>
									:
									helper.checkPP(user) ?
										null :
										<View style={styles.searchTextContainerStyle} >
											<Text onPress={() => this.handleSearchByArea()} style={[AppStyles.formFontSettings, styles.searchAreaInput, {
												color: isEmpty(selectedArea) ? AppStyles.colors.subTextColor : AppStyles.colors.textColor
											}]} >
												{isEmpty(selectedArea) ? "Search by Area" : selectedArea.name}
											</Text>
											<Ionicons style={{ width: '10%' }} onPress={() => this.clearAndCloseSearch()} name={'ios-close-circle-outline'} size={24} color={'grey'} />
										</View>


							}

						</View>
					) : (
							<View style={[styles.filterRow, { paddingHorizontal: 15 }]}>
								<View style={styles.pickerMain}>
									<PickerComponent
										placeholder={'Property Status'}
										data={helper.checkPP(user) ? StaticData.graanaStatusFiltersPP : StaticData.graanaStatusFilters}
										customStyle={styles.pickerStyle}
										customIconStyle={styles.customIconStyle}
										onValueChange={this.changeStatus}
										selectedItem={statusFilter}
									/>
								</View>
								<View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
									<Ionicons
										onPress={() => {
											this.setState({ showSearchBar: true }, () => {
												this.clearStateValues()
											})
										}}
										name={'ios-search'}
										size={26}
										color={AppStyles.colors.primaryColor}
									/>
								</View>

							</View>
						)}
					{/* ***** Main Tile Wrap */}
					{
						propertiesList && propertiesList.length > 0 ?
							< FlatList
								contentContainerStyle={{ paddingHorizontal: wp('2%') }}
								data={propertiesList}
								renderItem={({ item, index }) => (
									<PropertyTile
										data={item}
										checkForArmsProperty={false}
										onPress={(data) => this.onHandlePress(data)}
										onLongPress={(id) => this.onHandleLongPress(id)}
										onCall={this.onHandleOnCall}
										graanaVerifeyModal={this.graanaVerifeyModal}
										whichProperties={'graanaProperties'}
									/>
								)}
								onEndReached={() => {
									if (propertiesList.length < totalProperties) {
										this.setState({
											page: this.state.page + 1,
											onEndReachedLoader: true
										}, () => {
											this.getPropertyGraanaListing();
										});
									}
								}}
								onEndReachedThreshold={0.5}
								keyExtractor={(item, index) => `${item.id}`}
							/>
							:
							<NoResultsComponent imageSource={require('../../../assets/img/no-result-found.png')} />
					}

					{
						<GraanaPropertiesModal
							active={graanaModalActive}
							data={singlePropertyData}
							forStatusPrice={forStatusPrice}
							formData={formData}
							handleForm={this.handleForm}
							graanaVerifeyModal={this.graanaVerifeyModal}
							submitStatus={this.graanaStatusSubmit}
							submitGraanaStatusAmount={this.submitGraanaStatusAmount}
						/>
					}

					{
						<OnLoadMoreComponent onEndReached={onEndReachedLoader} />
					}
				</View>
				:
				<Loader loading={loading} />
		)
	}
}

mapStateToProps = (store) => {
	return {
		user: store.user.user,
		contacts: store.contacts.contacts,
	}
}

export default connect(mapStateToProps)(GraanaInventories)
