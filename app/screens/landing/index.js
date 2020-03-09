import React from 'react';
import styles from './style'
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

class Landing extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<SafeAreaView style={styles.mainContainer}>
				<View >
					<View style={styles.buttonWrap}>
						<TouchableOpacity style={styles.mainbutton}>
							<Text style={styles.buttonText}>DIARY</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.buttonWrap}>
						<TouchableOpacity style={styles.mainbutton}>
							<Text style={styles.buttonText}>LEADS</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.buttonWrap}>
						<TouchableOpacity style={styles.mainbutton}>
							<Text style={styles.buttonText}>INVENTORY</Text>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		)
	}
}

mapStateToProps = (store) => {
	return {
		user: store.user.user
	}
}

export default connect(mapStateToProps)(Landing)