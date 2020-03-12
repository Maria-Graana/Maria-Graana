import React from 'react';
import styles from './style'
import AppStyles from '../../AppStyles'
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import LandingButtonTile from '../../components/LandingButtonTile'

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
					<LandingButtonTile navigateFunction={this.navigateFunction} label={'Diary'} pagePath={'Diary'} />

					{/* Main Wrap of Landing Page Buttons (Leads Button) */}
					<LandingButtonTile navigateFunction={this.navigateFunction} label={'Lead'} pagePath={'Lead'} />

					{/* Main Wrap of Landing Page Buttons (Inventory Button) */}
					<LandingButtonTile navigateFunction={this.navigateFunction} label={'Inventory'} pagePath={'Inventory'} />
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