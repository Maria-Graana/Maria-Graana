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
// import styles from './style'
import { ActivityIndicator } from 'react-native-paper';
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent';
import { cos } from 'react-native-reanimated';
import GraanaPropertiesModal from '../../components/GraanaPropertiesStatusModal'

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
			formData: {
				amount: '',
			}
		}


	}

	componentDidMount() {
		const { navigation } = this.props;
		this._unsubscribe = navigation.addListener('focus', () => {
			this.getPropertyGraanaListing();
		});
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
		const { propertiesList, page, pageSize } = this.state;
		const url = `/api/inventory/all?propType=graana&pageSize=${pageSize}&page=${page}`
		axios.get(url).then((response) => {
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
		navigation.navigate('PropertyDetail', { property: data, update: true, editButtonHide: true ,screenName: 'GraanaInventories' })
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
		} = this.state;
		
		return (
			!loading ?
				<View style={[AppStyles.container, { marginBottom: 25 }]}>
					{/* ***** Main Tile Wrap */}
					{
						propertiesList && propertiesList.length > 0 ?
							< FlatList
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
								keyExtractor={(item, index) =>  `${item.id}`}
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
