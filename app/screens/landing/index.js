import React from 'react';
import styles from './style'
import AppStyles from '../../AppStyles'
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

class Landing extends React.Component {
	constructor(props) {
		super(props)
	}

	// ****** Navigate Function
	navigateFunction = (name) => {
		const { navigation } = this.props
		navigation.navigate(name)
	}

	render() {
		return (
			<SafeAreaView style={AppStyles.container}>

				<View >

					{/* Main Wrap of Landing Page Buttons (Diary Button) */}
					<View style={styles.buttonWrap}>
						<TouchableOpacity style={styles.mainbutton} onPress={() => this.navigateFunction('Diary')}>
							<Text style={styles.buttonText}>DIARY</Text>
						</TouchableOpacity>
					</View>

					{/* Main Wrap of Landing Page Buttons (Leads Button) */}
					<View style={styles.buttonWrap}>
						<TouchableOpacity style={styles.mainbutton} onPress={() => this.navigateFunction('Inventory')}>
							<Text style={styles.buttonText}>LEADS</Text>
						</TouchableOpacity>
					</View>

					{/* Main Wrap of Landing Page Buttons (Inventory Button) */}
					<View style={styles.buttonWrap}>
						<TouchableOpacity style={styles.mainbutton} onPress={() => this.navigateFunction('Inventory')}>
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