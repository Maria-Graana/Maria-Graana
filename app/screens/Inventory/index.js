import React from 'react';
import styles from './style'
import { View, ScrollView, TextInput } from 'react-native';
import { Picker } from 'native-base';
import { connect } from 'react-redux';
import InventoryTile from '../../components/InventoryTile'
import AppStyles from '../../AppStyles'
import { Feather } from '@expo/vector-icons';

class Inventory extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			language: '',
			dotsDropDown: false,
			dropDownId: '',
			selectInventory: '',

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
		this.setState({
			selectInventory: id
		})
	}

	render() {
		const { selectInventory, dropDownId } = this.state
		return (
			<View style={AppStyles.container}>

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
					<ScrollView>
						{
							this.staticData.map((item, index) => {
								return (
									<InventoryTile
										showDropdown={this.showDropdown}
										dotsDropDown={this.state.dotsDropDown}
										selectInventory={this.selectInventory}
										selectedInventory={selectInventory}
										data={item}
										dropDownId={dropDownId}
									/>
								)
							})
						}
					</ScrollView>
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