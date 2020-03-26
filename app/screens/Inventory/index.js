import React from 'react';
import styles from './style'
import { View, FlatList, Alert } from 'react-native';
import { ActionSheet } from 'native-base';
import { connect } from 'react-redux';
import PropertyTile from '../../components/PropertyTile'
import AppStyles from '../../AppStyles'
import axios from 'axios';
import { Fab } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import * as RootNavigation from '../../navigation/RootNavigation';
import Loader from '../../components/loader';
import helper from '../../helper';

var BUTTONS = ['Delete', 'Cancel'];
var CANCEL_INDEX = 1;

class Inventory extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			propertiesList: [],
			loading: true,
			resultsFound: true
		}


	}

	componentDidMount() {
		const { navigation } = this.props;
		this._unsubscribe = navigation.addListener('focus', () => {
			this.getPropertyListing();
		});
	}


	componentWillUnmount() {
		this._unsubscribe();
	}

	getPropertyListing = () => {
		this.setState({ loading: true })
		axios.get(`api/inventory/all`).then((response) => {
			if (response.status == 200) {
				this.setState({
					propertiesList: response.data.rows,
					loading: false,
				});
			}
		}).catch((error) => {
			console.log('error', error);
		})
	}

	goToInventoryForm = () => {
		RootNavigation.navigate('AddInventory');
	}

	deleteProperty = (id) => {
		let endPoint = ``
		let that = this;
		endPoint = `api/inventory/delete?id=${id}`
		axios.delete(endPoint).then(function (response) {
			if (response.status === 200) {
				helper.successToast('PROPERTY DELETED SUCCESSFULLY!')
				that.getPropertyListing();
			}

		}).catch(function (error) {
			helper.successToast(error.message)
		})

	}

	onHandlePress = () => {
		console.log('onPress')
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

	showDeleteDialog(val) {
		Alert.alert('Delete Property', 'Are you sure you want to delete this property ?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Delete', onPress: () => this.deleteProperty(id) },
		],
			{ cancelable: false })
	}


	render() {
		const { propertiesList, loading } = this.state;
		return (
			!loading ?
				<View style={[AppStyles.container, { paddingLeft: 0, paddingRight: 0, marginBottom: 25 }]}>

					<Fab
						active='true'
						containerStyle={{ zIndex: 20 }}
						style={{ backgroundColor: AppStyles.colors.primaryColor }}
						position="bottomRight"
						onPress={this.goToInventoryForm}
					>
						<Ionicons name="md-add" color="#ffffff" />
					</Fab>

					{/* ***** Main Tile Wrap */}
					<FlatList
						data={propertiesList}
						renderItem={({ item }) => (
							<PropertyTile
								data={item}
								onPress={this.onHandlePress}
								onLongPress={(id) => this.onHandleLongPress(id)}
							/>
						)}

						keyExtractor={item => String(item.id)}
					/>
				</View> :
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