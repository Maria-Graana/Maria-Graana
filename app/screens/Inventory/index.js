import React from 'react';
import styles from './style'
import { View, ScrollView, TextInput } from 'react-native';
import { connect } from 'react-redux';
import InventoryTile from '../../components/InventoryTile'
import AppStyles from '../../AppStyles'
import { Feather } from '@expo/vector-icons';

class Inventory extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<View style={AppStyles.container}>

				{/* ***** Main Filter Wrap */}
				<View style={styles.filterMainWrap}>
					<View style={[styles.searchInputWrap, styles.borderRightFilter]}>
						<TextInput placeholder={'Search By'} style={styles.inputFilterStyle}/>
					</View>
					<View style={[styles.searchInputWrap, styles.InputWrapSearch]}>
						<TextInput placeholder={'Yo'} style={styles.inputFilterStyle}/>
						<Feather name="search" size={20} color="#D0D0D0" style={styles.searchIcon}/>
					</View>
				</View>

				{/* ***** Main Tile Wrap */}
				<View style={styles.mainInventoryTile}>
					<ScrollView>
						<InventoryTile />
						<InventoryTile />
						<InventoryTile />
						<InventoryTile />
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