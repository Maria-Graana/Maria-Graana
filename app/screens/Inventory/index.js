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
		}
	}

  showDropdown = () => {
    this.setState({
      dotsDropDown: !this.state.dotsDropDown
    })
  }

	render() {
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
						<InventoryTile showDropdown={this.showDropdown} dotsDropDown={this.state.dotsDropDown}/>
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