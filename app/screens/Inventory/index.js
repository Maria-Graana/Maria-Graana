import React from 'react';
import styles from './style'
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

class Inventory extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Text>Hello</Text>
			</SafeAreaView>
		)
	}
}

mapStateToProps = (store) => {
	return {
		user: store.user.user
	}
}

export default connect(mapStateToProps)(Inventory)