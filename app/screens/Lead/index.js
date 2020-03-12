import React from 'react';
import styles from './style'
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import InventoryTile from '../../components/InventoryTile'
import AppStyles from '../../AppStyles'

class Lead extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<View style={AppStyles.container}>
                <Text>
                    I am in Leads Page
                </Text>
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