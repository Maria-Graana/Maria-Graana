import React from 'react';
import styles from './style'
import { View } from 'react-native';
import { connect } from 'react-redux';
import InventoryTile from '../../components/InventoryTile'
import AppStyles from '../../AppStyles'

class Inventory extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<View style={AppStyles.container}>

        {/* ***** Main Filter Wrap */}
				<View style={styles.filterMainWrap}></View>

        {/* ***** Main Tile Wrap */}
        <View style={styles.mainInventoryTile}>
            <InventoryTile/>
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