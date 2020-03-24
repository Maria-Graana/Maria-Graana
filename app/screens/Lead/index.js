import React from 'react';
import styles from './style'
import { View, TextInput, Text, FlatList, TouchableOpacity } from 'react-native';
import { Picker } from 'native-base';
import { connect } from 'react-redux';
import InventoryTile from '../../components/InventoryTile'
import AppStyles from '../../AppStyles'
import { Feather } from '@expo/vector-icons';
import { Fab } from 'native-base';
import { StackActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


class Inventory extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			language: '',
			dotsDropDown: false,
			dropDownId: '',
			selectInventory: [],
			febDrawer: false,
		}

		this.staticData = [
			{
				id: '1',
				propertyName: '10 marla house for sale',
				action: 'Token',
				price: '10 Crore',
				address: 'G/11, Islamabad',
				location: 'G/11, Islamabad',
			},
			{
				id: '2',
				propertyName: '40 marla house for sale',
				action: 'Deal Done',
				price: '20 Crore',
				address: 'i8/4, Islamabad',
				location: 'i8/4, Islamabad',
			},
			{
				id: '3',
				propertyName: '16 marla house for sale',
				action: 'Deal Done',
				price: '13 Crore',
				address: 'G2/11, Islamabad',
				location: 'G2/11, Islamabad',
			},
			{
				id: '4',
				propertyName: '5 marla house for sale',
				action: 'Token',
				price: '2 Crore',
				address: 'H1/11, Islamabad',
				location: 'H1/11, Islamabad',
			}
		]
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

	goToFormPage = () => {
		const { navigation } = this.props;
		navigation.dispatch(
			StackActions.replace('AddLead')
		);
	}

	openFebDraw = () => {
		const { febDrawer } = this.state

		this.setState({
			febDrawer: !febDrawer
		})
	}

	render() {
		const { selectInventory, dropDownId, febDrawer } = this.state
		return (
			<View style={AppStyles.container}>
				<Fab
					active='true'
					containerStyle={{ zIndex: 20 }}
					style={{ backgroundColor: '#333', position: 'relative' }}
					position="bottomRight"
					onPress={this.openFebDraw}
				>
					{
						febDrawer === true &&
						<View style={styles.mainDropFeb}>
							<TouchableOpacity style={[AppStyles.mbTen]} onPress={() => {this.goToFormPage('addLead')}}>
								<Text>RCM Lead</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => {this.goToFormPage('addLead')}}>
								<Text>CM Lead</Text>
							</TouchableOpacity>
						</View>
					}
					<Ionicons name="md-add" color="#ffffff" />
				</Fab>

				{/* ***** Main Filter Wrap */}
				<View style={styles.filterMainWrap}>
					<View style={[styles.searchInputWrap, styles.borderRightFilter]}>
						<Picker
							placeholder={'Search By'}
							selectedValue={this.state.language}
							onValueChange={(itemValue, itemIndex) =>
								this.setState({ language: itemValue })
							}>
							<Picker.Item label="Java" value="java" />
							<Picker.Item label="JavaScript" value="js" />
						</Picker>
					</View>
					<View style={[styles.searchInputWrap, styles.InputWrapSearch]}>
						<TextInput style={styles.inputFilterStyle} />
						<Feather name="search" size={20} color="#D0D0D0" style={styles.searchIcon} />
					</View>
				</View>

				{/* ***** Main Tile Wrap */}
				<View style={styles.mainInventoryTile}>
					<FlatList
						data={this.staticData}
						renderItem={({ item }) => (
							<InventoryTile
								showDropdown={this.showDropdown}
								dotsDropDown={this.state.dotsDropDown}
								selectInventory={this.selectInventory}
								selectedInventory={selectInventory}
								data={item}
								dropDownId={dropDownId}
								unSelectInventory={this.unSelectInventory}
							/>
						)}
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