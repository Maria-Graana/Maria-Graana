import React from 'react';
import AppStyles from '../../AppStyles'
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import LandingButtonTile from '../../components/LandingButtonTile'
import DiaryImg from '../../../assets/img/diary.png'
import LeadImg from '../../../assets/img/leads.png'
import InventoryImg from '../../../assets/img/inventory.png'

class Landing extends React.Component {
	constructor(props) {
		super(props)
	}

	// ****** Navigate Function
	navigateFunction = (name, screenName) => {
		const { navigation } = this.props
		navigation.navigate(name,{screen: screenName})
	}

	render() {
		return (
			<SafeAreaView style={[AppStyles.container,{paddingLeft:25,paddingRight:25}]}>
				<ScrollView>
					<View >
						{/* Main Wrap of Landing Page Buttons (Diary Button) */}
						<LandingButtonTile navigateFunction={this.navigateFunction} label={'DIARY'} pagePath={'Diary'} screenName={'Diary'} buttonImg={DiaryImg} badges={'12'}/>

						{/* Main Wrap of Landing Page Buttons (Leads Button) */}
						<LandingButtonTile navigateFunction={this.navigateFunction} label={'LEADS'} pagePath={'Lead'} screenName={'Lead'} buttonImg={LeadImg} badges={'42'}/>

						{/* Main Wrap of Landing Page Buttons (Inventory Button) */}
						<LandingButtonTile navigateFunction={this.navigateFunction} label={'PROPERTIES'} pagePath={'Inventory'} screenName={'Inventory'} buttonImg={InventoryImg} badges={'32'}/>
					</View>
				</ScrollView>
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