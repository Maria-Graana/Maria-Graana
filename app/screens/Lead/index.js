import React from 'react';
import styles from './style'
import { View, ScrollView, TextInput, FlatList } from 'react-native';
import { Picker } from 'native-base';
import { connect } from 'react-redux';
import LeadTile from '../../components/LeadTile'
import AppStyles from '../../AppStyles'
import { Feather } from '@expo/vector-icons';

class Lead extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			language: '',
			dotsDropDown: false,
			dropDownId: '',
			selectInventory: [],

		}

		this.staticData = [
			{
				id: '1',
				propertyName: '3 marla house for sale',
				action: 'Deal Done',
				price: '55 Lac',
				address: 'Gulraiz, street #3, Rawapindi',
				location: 'Gulraiz, Rawapindi',
			},
			{
				id: '2',
				propertyName: '10 marla plot for sale',
				action: 'Deal Done',
				price: '1.5 Crore',
				address: 'G9/4, street #93, Islamabad',
				location: 'G9/4, Islamabad',
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
					<FlatList
						data={this.staticData}
						renderItem={({ item }) => (
							<LeadTile
								data={item}
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

export default connect(mapStateToProps)(Lead)