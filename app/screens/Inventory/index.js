import * as RootNavigation from '../../navigation/RootNavigation';

import { Alert, FlatList, Image, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import Ability from '../../hoc/Ability'
import { ActionSheet } from 'native-base';
import AppStyles from '../../AppStyles'
import { Fab } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import Loader from '../../components/loader';
import NoResultsComponent from '../../components/NoResultsComponent';
import PropertyTile from '../../components/PropertyTile'
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import helper from '../../helper';
import styles from './style'
import { ActivityIndicator } from 'react-native-paper';
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent';

var BUTTONS = ['Delete', 'Cancel'];
var CANCEL_INDEX = 1;

class Inventory extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			propertiesList: [],
			totalProperties: 0,
			loading: true,
			page: 1,
			pageSize: 20,
			onEndReachedLoader: false,
		}


	}

	componentDidMount() {
		const { navigation } = this.props;
		this._unsubscribe = navigation.addListener('focus', () => {
			this.getPropertyListing();
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

	getPropertyListing = () => {
		const { propertiesList, page, pageSize } = this.state;
		const url = `/api/inventory/all?pageSize=${pageSize}&page=${page}`
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
				that.getPropertyListing();
			}

		}).catch(function (error) {
			this.setState({ loading: false })
			helper.successToast(error.message)
		})

	}

	onHandlePress = (data) => {
		const { navigation } = this.props;
		navigation.navigate('PropertyDetail', { property: data, update: true })
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

	onHandleOnCall = (url) => {
		helper.callNumber(url);
	}

	setKey = (index) => {
		return String(index);
	}


	render() {
		const { propertiesList, loading, totalProperties, onEndReachedLoader } = this.state;
		const { user, route } = this.props;
		return (
			!loading ?
				<View style={[AppStyles.container, { marginBottom: 25 }]}>


					{
						Ability.canAdd(user.role, route.params.screen) ?
							<Fab
								active='true'
								containerStyle={{ zIndex: 20 }}
								style={{ backgroundColor: AppStyles.colors.primaryColor }}
								position="bottomRight"
								onPress={this.goToInventoryForm}
							>
								<Ionicons name="md-add" color="#ffffff" />
							</Fab> :
							null
					}


					{/* ***** Main Tile Wrap */}

					{
						propertiesList && propertiesList.length > 0 ?
							< FlatList
								contentContainerStyle={{ paddingHorizontal: wp('2%') }}
								data={propertiesList}
								renderItem={({ item }) => (
									<PropertyTile
										data={item}
										onPress={(data) => this.onHandlePress(data)}
										onLongPress={(id) => this.onHandleLongPress(id)}
										onCall={(number) => this.onHandleOnCall(`tel:${number}`)}
									/>
								)}
								onEndReached={() => {
									if (propertiesList.length < totalProperties) {
										this.setState({
											page: this.state.page + 1,
											onEndReachedLoader: true
										}, () => {
											this.getPropertyListing();
										});
									}
								}}
								onEndReachedThreshold={0.5}
								keyExtractor={(item, index) => this.setKey(index)}
							/>
							:
							<NoResultsComponent imageSource={require('../../../assets/images/no-result2.png')} />
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
		user: store.user.user
	}
}

export default connect(mapStateToProps)(Inventory)