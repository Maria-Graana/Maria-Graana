import React from 'react';
import AppStyles from '../../AppStyles'
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import LandingButtonTile from '../../components/LandingButtonTile'
import DiaryImg from '../../../assets/img/diary.png'
import LeadImg from '../../../assets/img/leads.png'
import InventoryImg from '../../../assets/img/inventory.png'
import Ability from '../../hoc/Ability'
import axios from 'axios'
import Loader from '../../components/loader';
import { getListingsCount } from '../../actions/listings'
import PushNotification from '../../PushNotifications';

class Landing extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		const { navigation, dispatch } = this.props;
		this._unsubscribe = navigation.addListener('focus', () => {
			setTimeout(function () {
				dispatch(getListingsCount())
			}, 2000)
		});
	}

	componentWillUnmount() {
		this._unsubscribe();
	}

	// ****** Navigate Function
	navigateFunction = (name, screenName) => {
		const { navigation } = this.props
		navigation.navigate(name, { screen: screenName })
	}

	render() {
		const { user, count } = this.props
		return (
				<ScrollView style={[AppStyles.container, { paddingLeft: 25, paddingRight: 25 }]} >
					<SafeAreaView >
						<PushNotification />
						{/* Main Wrap of Landing Page Buttons (Diary Button) */}
						{Ability.canView(user.role, 'Diary') && <LandingButtonTile navigateFunction={this.navigateFunction} label={'DIARY'} pagePath={'Diary'} screenName={'Diary'} buttonImg={DiaryImg} badges={count.diary} />}

						{/* Main Wrap of Landing Page Buttons (Leads Button) */}
						<LandingButtonTile navigateFunction={this.navigateFunction} label={'LEADS'} pagePath={'Lead'} screenName={'Lead'} buttonImg={LeadImg} badges={count.leads} />

						{/* Main Wrap of Landing Page Buttons (Inventory Button) */}
						{Ability.canView(user.role, 'Inventory') && <LandingButtonTile navigateFunction={this.navigateFunction} label={'PROPERTIES'} pagePath={'Inventory'} screenName={'Inventory'} buttonImg={InventoryImg} badges={count.inventory} />}
					</SafeAreaView>

				</ScrollView>
		)
	}
}

mapStateToProps = (store) => {
	return {
		user: store.user.user,
		count: store.listings.count
	}
}

export default connect(mapStateToProps)(Landing)