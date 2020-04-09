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

class Landing extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			count: {},
			loading: false,
		}
	}

	componentDidMount() {
		const { navigation } = this.props;
		this._unsubscribe = navigation.addListener('focus', () => {
			this.getListingsCount();
		});


	}

	componentWillUnmount() {
		this._unsubscribe();
	}

	getListingsCount = () => {
		this.setState({ loading: true })
		const that = this;
		setTimeout(function () {
			//Put All Your Code Here, Which You Want To Execute After Some Delay Time.
			axios.get(`/api/inventory/counts`).then(response => {
				that.setState({ loading: false, count: response.data });
			}).catch(error => {
				console.log('error', error);
			})
		}, 2000);
	}
	// ****** Navigate Function
	navigateFunction = (name, screenName) => {
		const { navigation } = this.props
		navigation.navigate(name, { screen: screenName })
	}

	render() {
		const { user } = this.props
		const { loading, count } = this.state;
		return (
			!loading ?
				<ScrollView style={[AppStyles.container, { paddingLeft: 25, paddingRight: 25 }]} >
					<SafeAreaView >
						{/* Main Wrap of Landing Page Buttons (Diary Button) */}
						{Ability.canView(user.role, 'Diary') && <LandingButtonTile navigateFunction={this.navigateFunction} label={'DIARY'} pagePath={'Diary'} screenName={'Diary'} buttonImg={DiaryImg} badges={count.diary} />}

						{/* Main Wrap of Landing Page Buttons (Leads Button) */}
						<LandingButtonTile navigateFunction={this.navigateFunction} label={'LEADS'} pagePath={'Lead'} screenName={'Lead'} buttonImg={LeadImg} badges={count.leads} />

						{/* Main Wrap of Landing Page Buttons (Inventory Button) */}
						{Ability.canView(user.role, 'Inventory') && <LandingButtonTile navigateFunction={this.navigateFunction} label={'PROPERTIES'} pagePath={'Inventory'} screenName={'Inventory'} buttonImg={InventoryImg} badges={count.inventory} />}
					</SafeAreaView>

				</ScrollView>
				:
				<Loader loading={loading} />
		)
	}
}

mapStateToProps = (store) => {
	return {
		user: store.user.user
	}
}

export default connect(mapStateToProps)(Landing)